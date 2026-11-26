# Исходный промпт

Разработка фронтенда началась с этого запроса к AI-агенту (Claude Code). В качестве контекста агенту были переданы [SPEC.md](../SPEC.md) (фронтенд), спецификация бэкенда (для контракта API) и [CLAUDE.md](../CLAUDE.md) (правила работы).

> У меня есть два промпта - раздай тогда их агентам, и нужно создать оба репозитория соответственно.
>
> *(далее: SPEC.md — Alchemy Forge Backend, SPEC.md — Alchemy Forge Frontend, CLAUDE.md, приведены в репозитории)*

Контракт API, взятый из спецификации бэкенда:

- `GET /health` — проверка живости сервиса.
- `GET /api/materials?sessionId=...` — все материалы + `discoveredMaterialIds` (стартовые всегда доступны).
- `POST /api/craft` `{ sessionId, materialAId, materialBId }` → `{ matched: true, isNewDiscovery, resultMaterial }` или `{ matched: false, message }`.
- `POST /api/reset` `{ sessionId }` — сброс прогресса.
- Ошибки: `{ error: string }`.
