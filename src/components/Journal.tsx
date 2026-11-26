import type { JournalEntry } from '../session';

export function Journal({ entries }: { entries: JournalEntry[] }) {
  return (
    <section className="panel">
      <h2>Журнал открытий</h2>
      {entries.length === 0 ? (
        <p className="muted">Пока пусто. Смешай два материала!</p>
      ) : (
        <ol className="journal">
          {entries.map((e) => (
            <li key={e.at}>
              {e.a} + {e.b} = <b>{e.result}</b>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
