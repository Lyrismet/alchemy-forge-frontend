import { GLYPHS } from '../icons';

// Слаг материала с бэкенда → глиф из дизайн-концепта
const BY_SLUG: Record<string, string> = {
  fire: 'fire', water: 'water', earth: 'ore', air: 'sparkle', iron: 'iron', wood: 'log', root: 'leather', spark: 'rune',
  steam: 'crystal', clay: 'ore', coal: 'ore', ingot: 'iron', lava: 'fire', cloud: 'water', dust: 'ore', sprout: 'herb',
  lightning: 'rune', rust: 'leather', tool: 'sword', herb: 'herb', brick: 'scroll', steel: 'iron', storm: 'rune',
  potion: 'potion', obsidian: 'crystal', glass: 'crystal', mechanism: 'shield', forge: 'mix', elixir: 'potion',
  thunder_blade: 'sword', philosophers_stone: 'gem', golem: 'mithril',
};

export const glyphFor = (slug: string) => BY_SLUG[slug] ?? 'crystal';

export function Icon({ glyph, size = 48 }: { glyph: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="icon"
      dangerouslySetInnerHTML={{ __html: GLYPHS[glyph] ?? GLYPHS.crystal }}
    />
  );
}
