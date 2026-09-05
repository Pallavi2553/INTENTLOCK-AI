// AuditLogView.jsx - Forensic Audit Ledger & Governance History
import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Hash,
  Download
} from 'lucide-react';
import { api } from '../api/client';

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [filterDecision, setFilterDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAuditLogs();
  }, [filterDecision]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs(filterDecision ? { decision: filterDecision } : {});
      setLogs(res.logs || []);
      setStats(res.stats || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `intentlock-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <History size={14} /> Core Feature #18 — Immutable Audit Ledger
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Autonomous Transaction Forensic Trail
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Every decision made by INTENTLOCK AI is recorded with deterministic hashes, intent passport IDs, 
          and exact reasonings. No payment authorization occurs without an auditable verification record.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filter Verdict:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['', 'ALLOW', 'ASK_USER', 'BLOCK'].map((dec) => (
                <button
                  key={dec}
                  className={`btn-secondary ${filterDecision === dec ? 'active' : ''}`}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    background: filterDecision === dec ? 'rgba(6, 182, 212, 0.2)' : undefined,
                    borderColor: filterDecision === dec ? '#06b6d4' : undefined,
                    color: filterDecision === dec ? '#38bdf8' : undefined
                  }}
                  onClick={() => setFilterDecision(dec)}
                >
                  {dec === '' ? 'ALL' : dec}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={loadAuditLogs} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Trail</span>
            </button>
            <button className="btn-secondary" onClick={handleExportJson} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              <Download size={14} />
              <span>Export Audit JSON</span>
            </button>
          </div>

        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 14px' }}>Timestamp</th>
              <th style={{ padding: '12px 14px' }}>Intent ID</th>
              <th style={{ padding: '12px 14px' }}>Agent</th>
              <th style={{ padding: '12px 14px' }}>Amount</th>
              <th style={{ padding: '12px 14px' }}>Drift</th>
              <th style={{ padding: '12px 14px' }}>Decision</th>
              <th style={{ padding: '12px 14px' }}>Reasoning & Violations</th>
              <th style={{ padding: '12px 14px' }}>Integrity Hash</th>
            </tr>
          </thead>
          <tbody>
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <tr 
                  key={log.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: '600' }}>
                    {log.intentId}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {log.agentId}
                  </td>
                  <td className="font-mono" style={{ padding: '12px 14px', fontWeight: '700' }}>
                    {log.amount ? `₹${log.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="font-mono" style={{ padding: '12px 14px', fontWeight: '700', color: log.driftScore > 35 ? '#ef4444' : '#10b981' }}>
                    {log.driftScore}%
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${
                      log.decision === 'ALLOW' ? 'badge-safe' :
                      log.decision === 'BLOCK' ? 'badge-block' : 'badge-warn'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', maxWidth: '300px', fontSize: '0.82rem', lineHeight: '1.4' }}>
                    <div style={{ fontWeight: '600' }}>{log.reason}</div>
                    {log.violations && log.violations.length > 0 && (
                      <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '2px' }}>
                        Violations: {log.violations.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="font-mono" style={{ padding: '12px 14px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                    {log.immutableHash}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No audit trail records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
