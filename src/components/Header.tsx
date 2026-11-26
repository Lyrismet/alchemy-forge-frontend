import { Icon } from './Icon';

export type ServerStatus = 'checking' | 'waking' | 'online' | 'offline';

const LABELS: Record<ServerStatus, string> = {
  checking: 'Подключение…',
  waking: 'Сервер просыпается…',
  online: 'Сервер онлайн',
  offline: 'Нет связи',
};

interface Props {
  discovered: number;
  total: number;
  status: ServerStatus;
  onReset: () => void;
  busy: boolean;
}

export function Header({ discovered, total, status, onReset, busy }: Props) {
  const pct = total ? Math.round((discovered / total) * 100) : 0;
  return (
    <header className="header">
      <div className="logo">
        <Icon glyph="mix" size={40} />
        <h1>
          Alchemy <span>Forge</span>
        </h1>
      </div>
      <div className="header-right">
        <span className={`status status-${status}`}>
          <i aria-hidden="true" />
          {LABELS[status]}
        </span>
        <div className="progress">
          <Icon glyph="progress" size={28} />
          <div>
            <div className="progress-text">
              Открыто <b>{discovered} из {total}</b>
            </div>
            <div className="bar">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onReset} disabled={busy}>
          <Icon glyph="reset" size={20} />
          Сбросить прогресс
        </button>
      </div>
    </header>
  );
}
