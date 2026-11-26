import type { Material } from '../api';
import { TIER_NAMES } from '../tiers';
import { Icon, glyphFor } from './Icon';

interface Props {
  material: Material;
  onClick?: () => void;
}

export function MaterialCard({ material, onClick }: Props) {
  const t = material.tier;
  return (
    <button
      className="tile"
      data-tier={t}
      onClick={onClick}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(material.id))}
      aria-label={`${material.name}, ${TIER_NAMES[t] ?? `тир ${t}`}`}
    >
      <span className="pips" aria-hidden="true">
        {Array.from({ length: Math.max(3, t) }, (_, i) => (
          <i key={i} className={i < t ? 'on' : ''} />
        ))}
      </span>
      <Icon glyph={glyphFor(material.slug)} size={48} />
      <span className="tile-name">{material.name}</span>
    </button>
  );
}
