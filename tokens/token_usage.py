#!/usr/bin/env python3
"""Сводка фактического расхода токенов из транскрипта сессии Claude Code (*.jsonl).

Использование: python3 tokens/token_usage.py <session.jsonl> > tokens/TOKEN_LOG.md
Берёт поле message.usage у ответов ассистента (одна строка на уникальный message.id).
"""
import json, sys

path = sys.argv[1]
seen, rows = set(), []
for line in open(path, encoding="utf-8"):
    try:
        e = json.loads(line)
    except ValueError:
        continue
    m = e.get("message") or {}
    u = m.get("usage")
    if e.get("type") != "assistant" or not u or m.get("id") in seen:
        continue
    seen.add(m.get("id"))
    rows.append((e.get("timestamp", "")[:19].replace("T", " "), m.get("model", ""),
                 u.get("input_tokens", 0), u.get("cache_creation_input_tokens", 0),
                 u.get("cache_read_input_tokens", 0), u.get("output_tokens", 0)))

cols = ["input", "cache_write", "cache_read", "output"]
tot = [sum(r[i] for r in rows) for i in range(2, 6)]
print("# Лог расхода токенов (фронтенд)\n")
print(f"Источник: транскрипт сессии Claude Code, {len(rows)} запросов к модели.\n")
print("## Итого\n")
print("| " + " | ".join(cols) + " | всего |\n|" + "---|" * 5)
print("| " + " | ".join(f"{t:,}" for t in tot) + f" | {sum(tot):,} |\n")
print("## По запросам\n")
print("| # | время (UTC) | модель | " + " | ".join(cols) + " |\n|" + "---|" * 7)
for i, r in enumerate(rows, 1):
    print(f"| {i} | {r[0]} | {r[1]} | " + " | ".join(f"{x:,}" for x in r[2:]) + " |")
