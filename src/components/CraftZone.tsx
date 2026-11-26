import type { CraftResult, Material } from '../api';
import { TierBadge } from '../tiers';
import { Icon, glyphFor } from './Icon';

interface Props {
  slots: (Material | null)[];
  onDropId: (slot: number, id: number) => void;
  onClearSlot: (slot: number) => void;
  onClear: () => void;
  onCraft: () => void;
  crafting: boolean;
  result: { res: CraftResult; formula: string; key: number } | null;
}

export function CraftZone({ slots, onDropId, onClearSlot, onClear, onCraft, crafting, result }: Props) {
  const ready = slots.every(Boolean);
  const failed = !crafting && result?.res.matched === false;

  return (
    <section className="panel craft">
      <div className="panel-head col">
        <h2>Горн</h2>
        <span className="muted">Выберите 2 материала и нажмите «Смешать»</span>
      </div>

      <div className={`slots${failed ? ' is-fail' : ''}`} key={failed ? result?.key : 'slots'}>
        {slots.map((m, i) => (
          <div key={i} className="slot-wrap">
            {i > 0 && <span className="plus" aria-hidden="true">+</span>}
            <div
              className={`slot${m ? ' is-filled' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDropId(i, Number(e.dataTransfer.getData('text/plain')));
              }}
            >
              {m ? (
                <button className="slot-btn" onClick={() => onClearSlot(i)} disabled={crafting} aria-label={`Убрать ${m.name} из слота ${i + 1}`}>
                  <Icon glyph={glyphFor(m.slug)} size={52} />
                  <span>{m.name}</span>
                </button>
              ) : (
                <div className="slot-empty">
                  <span className="slot-n">{i + 1}</span>
                  <span>пусто</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="craft-actions">
        <button className="btn-mix" onClick={onCraft} disabled={!ready || crafting}>
          {crafting ? (
            <>
              <span className="ring-sm" />
              Смешиваем…
            </>
          ) : (
            <>
              <Icon glyph="mix" size={28} />
              Смешать
            </>
          )}
        </button>
        <button className="btn btn-icon" onClick={onClear} disabled={crafting || !slots.some(Boolean)} aria-label="Очистить слоты">
          <Icon glyph="reset" size={28} />
        </button>
      </div>

      <div className="result-box" aria-live="polite">
        {crafting ? (
          <div className="result">
            <div className="ring" />
            <b>Горн раскаляется…</b>
            <div className="skel" />
            <div className="skel short" />
          </div>
        ) : !result ? (
          <div className="result result-idle">
            <span className="dim"><Icon glyph="sparkle" size={48} /></span>
            <b className="title">Горн остыл</b>
            <span className="muted">Положите материалы в слоты, здесь появится результат</span>
          </div>
        ) : result.res.matched ? (
          <div key={result.key} className={`result pop ${result.res.isNewDiscovery ? 'result-new' : 'result-known'}`}>
            {result.res.isNewDiscovery ? (
              <span className="tag tag-new"><Icon glyph="sparkle" size={18} />НОВЫЙ!</span>
            ) : (
              <span className="tag">Уже открыто</span>
            )}
            <Icon glyph={glyphFor(result.res.resultMaterial.slug)} size={result.res.isNewDiscovery ? 72 : 52} />
            <b className="title big">{result.res.resultMaterial.name}</b>
            <TierBadge tier={result.res.resultMaterial.tier} />
            <span className="muted">{result.formula}</span>
          </div>
        ) : (
          <div key={result.key} className="result pop result-fail">
            <Icon glyph="close" size={48} />
            <b className="title">Нет реакции</b>
            <span className="fail-formula">{result.formula}</span>
            <span className="muted">{result.res.message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
