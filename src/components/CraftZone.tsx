import type { CraftResult, Material } from '../api';
import { MaterialCard } from './MaterialCard';

interface Props {
  slots: (Material | null)[];
  onDropId: (slot: number, id: number) => void;
  onClearSlot: (slot: number) => void;
  onClear: () => void;
  onCraft: () => void;
  crafting: boolean;
  result: CraftResult | null;
}

export function CraftZone({ slots, onDropId, onClearSlot, onClear, onCraft, crafting, result }: Props) {
  const ready = slots.every(Boolean);
  return (
    <section className="panel craft">
      <h2>Кузница</h2>
      <div className="slots">
        {slots.map((m, i) => (
          <div
            key={i}
            className="slot"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onDropId(i, Number(e.dataTransfer.getData('text/plain')));
            }}
          >
            {m ? <MaterialCard material={m} onClick={() => onClearSlot(i)} /> : <span className="muted">Слот {i + 1}</span>}
          </div>
        ))}
      </div>
      <div className="actions">
        <button onClick={onClear} disabled={crafting || !slots.some(Boolean)}>
          Очистить
        </button>
        <button className="primary" onClick={onCraft} disabled={!ready || crafting}>
          {crafting ? 'Смешиваем…' : 'Смешать'}
        </button>
      </div>

      <div className="result" aria-live="polite">
        {result?.matched && (
          <div key={result.resultMaterial.id + String(result.isNewDiscovery)} className="result-ok">
            {result.isNewDiscovery && <span className="new">НОВЫЙ!</span>}
            <MaterialCard material={result.resultMaterial} highlight={result.isNewDiscovery} />
          </div>
        )}
        {result && !result.matched && <p className="result-fail">{result.message}</p>}
      </div>
    </section>
  );
}
