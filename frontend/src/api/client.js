// client.js - Typed API Client for INTENTLOCK AI Backend

const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const api = {
  getHealth: () => fetchJson('/health'),
  getDashboard: () => fetchJson('/dashboard'),
  getActiveState: () => fetchJson('/intent/active'),
  
  extractIntent: (prompt) => 
    fetchJson('/intent/extract', { method: 'POST', body: JSON.stringify({ prompt }) }),

  createIntent: (prompt, overrides = {}) => 
    fetchJson('/intent/create', { method: 'POST', body: JSON.stringify({ prompt, overrides }) }),

  getPassport: (id) => fetchJson(`/intent/${id}`),
  listPassports: () => fetchJson('/intent'),

  getAgentPermissions: () => fetchJson('/agent/permissions'),
  updateAgentPermissions: (data) => 
    fetchJson('/agent/permissions', { method: 'PUT', body: JSON.stringify(data) }),
  reactivateAgent: () => 
    fetchJson('/agent/reactivate', { method: 'POST' }),

  triggerAgentAction: (selectedProductId = null) => 
    fetchJson('/agent/action', { method: 'POST', body: JSON.stringify({ selectedProductId }) }),

  checkFirewall: (intent, transaction) => 
    fetchJson('/firewall/check', { method: 'POST', body: JSON.stringify({ intent, transaction }) }),

  runChaosAttack: (attackType) => 
    fetchJson('/chaos/run', { method: 'POST', body: JSON.stringify({ attackType }) }),

  respondApproval: (action, approvedAmount) => 
    fetchJson('/approval/respond', { method: 'POST', body: JSON.stringify({ action, approvedAmount }) }),

  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/audit${query ? `?${query}` : ''}`);
  },

  runJudgeDemo: () => 
    fetchJson('/demo/judge-flow', { method: 'POST' }),

  getMarketplace: () => fetchJson('/marketplace/products')
};
