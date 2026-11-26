import type { Material } from '../api';

interface Props {
  material: Material;
  onClick?: () => void;
  highlight?: boolean;
}

export function MaterialCard({ material, onClick, highlight }: Props) {
  return (
    <button
      className={`card tier-${material.tier}${highlight ? ' card-new' : ''}`}
      onClick={onClick}
      draggable={!!onClick}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', String(material.id))}
      title={material.name}
    >
      <span className="card-name">{material.name}</span>
      <span className="badge">T{material.tier}</span>
    </button>
  );
}
