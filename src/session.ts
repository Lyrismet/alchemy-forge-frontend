const KEY = 'alchemy-forge-session';

export function getSessionId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export interface JournalEntry {
  a: string;
  b: string;
  result: string;
  at: number;
}

const journalKey = (s: string) => `alchemy-forge-journal:${s}`;

export function loadJournal(sessionId: string): JournalEntry[] {
  try {
    return JSON.parse(localStorage.getItem(journalKey(sessionId)) ?? '[]');
  } catch {
    return [];
  }
}

export function saveJournal(sessionId: string, entries: JournalEntry[]) {
  localStorage.setItem(journalKey(sessionId), JSON.stringify(entries));
}
