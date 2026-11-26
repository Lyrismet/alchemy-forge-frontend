import { useMemo, useState } from 'react';
import type { Material } from '../api';
import { TIER_NAMES, pips } from '../tiers';
import { MaterialCard } from './MaterialCard';
import { Icon } from './Icon';

interface Props {
  materials: Material[];
  onPick: (m: Material) => void;
}

export function MaterialsPanel({ materials, onPick }: Props) {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState(0);

  const tiers = useMemo(() => [...new Set(materials.map((m) => m.tier))].sort(), [materials]);
  const visible = materials.filter(
    (m) => (!tier || m.tier === tier) && m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Материалы</h2>
        <span className="muted">{visible.length} шт.</span>
      </div>
      <label className="search">
        <Icon glyph="search" size={20} />
        <input placeholder="Поиск по названию" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Поиск по названию" />
      </label>
      <div className="chips">
        {[0, ...tiers].map((t) => (
          <button key={t} className={`chip${tier === t ? ' is-active' : ''}`} data-tier={t || undefined} onClick={() => setTier(t)}>
            {t ? `${pips(t)} ${TIER_NAMES[t] ?? t}` : 'Все'}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="empty">Ничего не найдено</p>
      ) : (
        <div className="tiles">
          {visible.map((m) => (
            <MaterialCard key={m.id} material={m} onClick={() => onPick(m)} />
          ))}
        </div>
      )}
    </section>
  );
}
