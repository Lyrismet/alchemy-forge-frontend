export type ServerStatus = 'checking' | 'waking' | 'online' | 'offline';

const LABELS: Record<ServerStatus, string> = {
  checking: 'Проверка…',
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
  return (
    <header className="header">
      <h1>⚗️ Alchemy Forge</h1>
      <div className="header-info">
        <span className="progress">
          Открыто {discovered} из {total}
        </span>
        <span className={`status status-${status}`}>● {LABELS[status]}</span>
        <button onClick={onReset} disabled={busy}>
          Сбросить прогресс
        </button>
      </div>
    </header>
  );
}
