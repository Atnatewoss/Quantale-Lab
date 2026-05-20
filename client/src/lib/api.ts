export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = {
  getElements: async () => {
    const response = await fetch(`${API_BASE}/elements`);
    if (!response.ok) throw new Error('Failed to fetch elements');
    return response.json();
  },

  queryLe: async (a: string, b: string) => {
    const response = await fetch(`${API_BASE}/query/le`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b }),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  queryJoin: async (elements: string[]) => {
    const response = await fetch(`${API_BASE}/query/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elements }),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  queryResidual: async (a: string, c: string) => {
    const response = await fetch(`${API_BASE}/query/residual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, c }),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  compose: async (left: string, right: string) => {
    const response = await fetch(`${API_BASE}/compose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ left, right }),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  getLogsDemo: async () => {
    const response = await fetch(`${API_BASE}/logs/demo`);
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  verify: async () => {
    const response = await fetch(`${API_BASE}/verify`);
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },


};
