export interface Material {
  id: number;
  slug: string;
  name: string;
  tier: number;
  isStarter: boolean;
}

export type CraftResult =
  | { matched: true; isNewDiscovery: boolean; resultMaterial: Material }
  | { matched: false; message: string };

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const TIMEOUT_MS = 60_000; // бесплатный бэкенд может просыпаться до минуты

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? `Ошибка сервера (${res.status})`);
    return data as T;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('Сервер не ответил вовремя');
    if (e instanceof TypeError) throw new Error('Нет связи с сервером');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// Бэкенд может отдавать поля в snake_case, приводим к одному виду
function normalize(m: Record<string, unknown>): Material {
  return {
    id: Number(m.id),
    slug: String(m.slug),
    name: String(m.name),
    tier: Number(m.tier ?? 1),
    isStarter: Boolean(m.isStarter ?? m.is_starter),
  };
}

export const api = {
  health: () => request<unknown>('/health'),

  async materials(sessionId: string) {
    const d = await request<{ materials: Record<string, unknown>[]; discoveredMaterialIds: number[] }>(
      `/api/materials?sessionId=${encodeURIComponent(sessionId)}`,
    );
    return { materials: d.materials.map(normalize), discoveredIds: d.discoveredMaterialIds ?? [] };
  },

  async craft(sessionId: string, materialAId: number, materialBId: number): Promise<CraftResult> {
    const d = await request<CraftResult & { resultMaterial?: Record<string, unknown> }>('/api/craft', {
      method: 'POST',
      body: JSON.stringify({ sessionId, materialAId, materialBId }),
    });
    return d.matched ? { ...d, resultMaterial: normalize(d.resultMaterial!) } : d;
  },

  reset: (sessionId: string) =>
    request<unknown>('/api/reset', { method: 'POST', body: JSON.stringify({ sessionId }) }),
};
