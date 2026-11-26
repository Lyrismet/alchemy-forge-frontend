export const TIER_NAMES: Record<number, string> = { 1: 'Обычный', 2: 'Редкий', 3: 'Эпический', 4: 'Легендарный' };

// Редкость читается цветом, числом точек и текстом
export const pips = (tier: number) => '●'.repeat(tier) + '○'.repeat(Math.max(0, 3 - tier));
export const tierLabel = (tier: number) => `${pips(tier)} ${TIER_NAMES[tier] ?? `Тир ${tier}`}`;

export function TierBadge({ tier }: { tier: number }) {
  return (
    <span className="badge" data-tier={tier}>
      {tierLabel(tier)}
    </span>
  );
}
