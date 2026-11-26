import type { Material } from '../api';
import type { JournalEntry } from '../session';
import { pips, TIER_NAMES } from '../tiers';
import { Icon, glyphFor } from './Icon';

interface Props {
  entries: JournalEntry[];
  all: Material[];
  discovered: Set<number>;
}

export function Journal({ entries, all, discovered }: Props) {
  const tiers = [...new Set(all.map((m) => m.tier))].sort();
  const hidden = all.filter((m) => !m.isStarter && !discovered.has(m.id)).length;

  return (
    <section className="panel">
      <div className="panel-head">
        <Icon glyph="history" size={32} />
        <h2>Журнал открытий</h2>
      </div>
      <div className="tier-rows">
        {tiers.map((t) => {
          const list = all.filter((m) => m.tier === t);
          const done = list.filter((m) => m.isStarter || discovered.has(m.id)).length;
          return (
            <div key={t} className="tier-row" data-tier={t}>
              <div className="tier-row-head">
                <span>{pips(t)} {TIER_NAMES[t] ?? t}</span>
                <span className="muted">{done} / {list.length}</span>
              </div>
              <div className="bar"><div style={{ width: `${(done / list.length) * 100}%` }} /></div>
            </div>
          );
        })}
      </div>
      <div className="label">Последние рецепты</div>
      {entries.length === 0 ? (
        <p className="empty">Пока пусто. Смешайте два материала!</p>
      ) : (
        <ol className="history">
          {entries.map((e) => (
            <li key={e.at}>
              <Icon glyph={glyphFor(e.slug ?? '')} size={36} />
              <div>
                <div className="history-name">{e.result}</div>
                <div className="muted small">{e.a} + {e.b}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="locked">
        <Icon glyph="lock" size={24} />
        Скрыто рецептов: {hidden}
      </div>
    </section>
  );
}
