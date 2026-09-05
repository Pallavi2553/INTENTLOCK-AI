// auditEngine.js - Immutable Audit Ledger & Event Logging Engine
// INTENTLOCK AI: Append-only compliance log for forensic review and agent governance

import crypto from 'crypto';

export class AuditEngine {
  constructor() {
    this.logs = [];
    this.stats = {
      totalEvaluations: 0,
      allowedCount: 0,
      blockedCount: 0,
      askUserCount: 0,
      totalSpendPrevented: 0
    };
  }

  recordEvent(eventData) {
    const timestamp = new Date().toISOString();
    const eventId = `AUDIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const entry = {
      id: eventId,
      timestamp,
      intentId: eventData.intentId || 'UNKNOWN-INTENT',
      agentId: eventData.agentId || 'agent-shopbot-01',
      transactionId: eventData.transactionId || 'UNKNOWN-TX',
      event: eventData.event || 'FIREWALL_EVALUATION',
      decision: eventData.decision || 'UNKNOWN',
      driftScore: eventData.driftScore ?? 0,
      intentMatchScore: eventData.intentMatchScore ?? 100,
      amount: eventData.amount || 0,
      violations: eventData.violations || [],
      reason: eventData.reason || 'Standard evaluation',
      userApproval: eventData.userApproval || null,
      metadata: eventData.metadata || {},
      immutableHash: crypto
        .createHash('sha256')
        .update(JSON.stringify({ ...eventData, timestamp, eventId }))
        .digest('hex')
        .substring(0, 16)
    };

    // Append to immutable array
    this.logs.unshift(entry);

    // Update aggregate dashboard statistics
    this.stats.totalEvaluations += 1;
    if (entry.decision === 'ALLOW') this.stats.allowedCount += 1;
    if (entry.decision === 'BLOCK') {
      this.stats.blockedCount += 1;
      // If blocked, accumulate synthetic prevented spend
      this.stats.totalSpendPrevented += (entry.amount || 0);
    }
    if (entry.decision === 'ASK_USER') this.stats.askUserCount += 1;

    return entry;
  }

  getLogs(filter = {}) {
    let result = [...this.logs];
    if (filter.decision) {
      result = result.filter(l => l.decision === filter.decision);
    }
    if (filter.intentId) {
      result = result.filter(l => l.intentId === filter.intentId);
    }
    return result;
  }

  getStats() {
    return { ...this.stats };
  }

  clearLogs() {
    this.logs = [];
    this.stats = {
      totalEvaluations: 0,
      allowedCount: 0,
      blockedCount: 0,
      askUserCount: 0,
      totalSpendPrevented: 0
    };
  }
}

export const auditEngine = new AuditEngine();
