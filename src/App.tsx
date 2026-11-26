import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type CraftResult, type Material } from './api';
import { getSessionId, loadJournal, saveJournal, type JournalEntry } from './session';
import { Header, type ServerStatus } from './components/Header';
import { MaterialsPanel } from './components/MaterialsPanel';
import { CraftZone } from './components/CraftZone';
import { Journal } from './components/Journal';

const sessionId = getSessionId();

export default function App() {
  const [all, setAll] = useState<Material[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([]);
  const [status, setStatus] = useState<ServerStatus>('checking');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<(Material | null)[]>([null, null]);
  const [crafting, setCrafting] = useState(false);
  const [result, setResult] = useState<CraftResult | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadJournal(sessionId));

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStatus('checking');
    const wakeTimer = setTimeout(() => setStatus('waking'), 3000);
    try {
      const d = await api.materials(sessionId);
      setAll(d.materials);
      setDiscoveredIds(d.discoveredIds);
      setStatus('online');
    } catch (e) {
      setError((e as Error).message);
      setStatus('offline');
    } finally {
      clearTimeout(wakeTimer);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const available = useMemo(() => {
    const ids = new Set(discoveredIds);
    return all.filter((m) => m.isStarter || ids.has(m.id));
  }, [all, discoveredIds]);

  const putInSlot = (m: Material, slot?: number) => {
    setResult(null);
    setSlots((s) => {
      const i = slot ?? (s[0] ? 1 : 0);
      const next = [...s];
      next[i] = m;
      return next;
    });
  };

  const craft = async () => {
    const [a, b] = slots;
    if (!a || !b) return;
    setCrafting(true);
    setError(null);
    try {
      const r = await api.craft(sessionId, a.id, b.id);
      setResult(r);
      setStatus('online');
      if (r.matched && r.isNewDiscovery) {
        setDiscoveredIds((ids) => [...ids, r.resultMaterial.id]);
        setAll((list) => (list.some((m) => m.id === r.resultMaterial.id) ? list : [...list, r.resultMaterial]));
        const next = [{ a: a.name, b: b.name, result: r.resultMaterial.name, at: Date.now() }, ...journal];
        setJournal(next);
        saveJournal(sessionId, next);
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus('offline');
    } finally {
      setCrafting(false);
    }
  };

  const reset = async () => {
    if (!confirm('Сбросить весь прогресс?')) return;
    setCrafting(true);
    try {
      await api.reset(sessionId);
      setJournal([]);
      saveJournal(sessionId, []);
      setSlots([null, null]);
      setResult(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCrafting(false);
    }
  };

  return (
    <div className="app">
      <Header discovered={available.length} total={all.length} status={status} onReset={reset} busy={crafting || isLoading} />

      {error && (
        <div className="error">
          {error}
          <button onClick={load}>Повторить</button>
        </div>
      )}

      {isLoading ? (
        <p className="loading">
          {status === 'waking' ? 'Сервер просыпается после простоя, это может занять до минуты…' : 'Загрузка…'}
        </p>
      ) : (
        <main className="layout">
          <MaterialsPanel materials={available} onPick={(m) => putInSlot(m)} />
          <CraftZone
            slots={slots}
            onDropId={(i, id) => {
              const m = available.find((x) => x.id === id);
              if (m) putInSlot(m, i);
            }}
            onClearSlot={(i) => setSlots((s) => s.map((x, j) => (j === i ? null : x)))}
            onClear={() => {
              setSlots([null, null]);
              setResult(null);
            }}
            onCraft={craft}
            crafting={crafting}
            result={result}
          />
          <Journal entries={journal} />
        </main>
      )}
    </div>
  );
}
