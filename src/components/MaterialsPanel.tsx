import { useMemo, useState } from 'react';
import type { Material } from '../api';
import { MaterialCard } from './MaterialCard';

interface Props {
  materials: Material[];
  onPick: (m: Material) => void;
}

export function MaterialsPanel({ materials, onPick }: Props) {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<number | 0>(0);

  const tiers = useMemo(() => [...new Set(materials.map((m) => m.tier))].sort(), [materials]);
  const visible = materials.filter(
    (m) => (!tier || m.tier === tier) && m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="panel">
      <h2>Материалы</h2>
      <div className="filters">
        <input placeholder="Поиск…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={tier} onChange={(e) => setTier(Number(e.target.value))}>
          <option value={0}>Все тиры</option>
          {tiers.map((t) => (
            <option key={t} value={t}>
              Тир {t}
            </option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? (
        <p className="muted">Ничего не найдено</p>
      ) : (
        <div className="grid">
          {visible.map((m) => (
            <MaterialCard key={m.id} material={m} onClick={() => onPick(m)} />
          ))}
        </div>
      )}
    </section>
  );
}
