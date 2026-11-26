# ⚗️ Alchemy Forge — Frontend

Клиент игры-алхимии: смешивай два материала и открывай новые. Вся логика крафта и рецепты живут на бэкенде, фронтенд только вызывает REST API.

- Стек: React 19 + Vite + TypeScript, без UI-библиотек.
- Бэкенд: отдельный репозиторий (Node.js + Express + PostgreSQL).
- Спецификация: [SPEC.md](SPEC.md), правила работы AI: [CLAUDE.md](CLAUDE.md), исходный промпт: [docs/INITIAL_PROMPT.md](docs/INITIAL_PROMPT.md), лог расхода токенов: [tokens/TOKEN_LOG.md](tokens/TOKEN_LOG.md) (скрипт `tokens/token_usage.py`).

## Возможности

- Шапка: прогресс «Открыто X из Y», статус сервера, сброс прогресса.
- Панель материалов: поиск по названию, фильтр по тиру, клик или drag-and-drop в слот.
- Кузница: 2 слота, «Очистить», «Смешать».
- Результат: анимация и пометка «НОВЫЙ!», либо сообщение о неудаче.
- Журнал открытий текущей сессии.
- `sessionId` (UUID) хранится в `localStorage`.
- Холодный старт бесплатного бэкенда: таймаут 60 с, статус «Сервер просыпается…», кнопка «Повторить».

## Локальный запуск

```bash
npm install
cp .env.example .env      # укажи адрес бэкенда в VITE_API_URL
npm run dev               # http://localhost:5173
```

| Переменная | Пример | Описание |
|---|---|---|
| `VITE_API_URL` | `https://alchemy-forge-api.onrender.com` | Базовый URL бэкенда, без `/` в конце |

Сборка: `npm run build` (результат в `dist/`).

## Деплой на Vercel (бесплатно)

1. Задеплой бэкенд и получи его URL.
2. На [vercel.com/new](https://vercel.com/new) импортируй этот репозиторий. Preset определится как **Vite** (build `npm run build`, output `dist`).
3. В **Environment Variables** добавь `VITE_API_URL` = URL бэкенда.
4. Нажми **Deploy** и скопируй адрес сайта.
5. На бэкенде выставь `CORS_ORIGIN` = адрес сайта на Vercel (без `/` в конце).

`VITE_API_URL` подставляется при сборке, поэтому после его изменения нужен Redeploy.

Netlify тоже подойдёт: build `npm run build`, publish `dist`, та же переменная окружения.
