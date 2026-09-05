// DashboardView.jsx - Executive Dashboard & Metrics Overview
import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  DollarSign, 
  Bot, 
  ArrowUpRight, 
  Zap, 
  Activity,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function DashboardView({ 
  dashboardData, 
  activePassport, 
  activeTransaction, 
  firewallResult,
  setActiveTab,
  onLaunchJudgeDemo
}) {
  const metrics = [
    {
      label: 'Active Intent Sessions',
      value: dashboardData?.activeIntentSessions ?? 1,
      icon: Activity,
      color: '#06b6d4',
      sub: 'Cryptographically bounded'
    },
    {
      label: 'Protected Transactions',
      value: dashboardData?.protectedTransactions ?? 0,
      icon: Lock,
      color: '#3b82f6',
      sub: 'Full Intent Drift checks'
    },
    {
      label: 'Blocked Violations',
      value: dashboardData?.blockedViolations ?? 0,
      icon: ShieldAlert,
      color: '#ef4444',
      sub: 'Zero unauthorized leaks'
    },
    {
      label: 'Approval Requests',
      value: dashboardData?.approvalRequests ?? 0,
      icon: AlertCircle,
      color: '#f59e0b',
      sub: 'Soft drifts held for user'
    },
    {
      label: 'Unauthorized Spend Prevented',
      value: `₹${(dashboardData?.potentialUnauthorizedSpendPrevented || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
      sub: 'Immediate & recurring charges'
    },
    {
      label: 'Agent Trust Score',
      value: `${dashboardData?.agentTrustScore || 92}/100`,
      icon: Bot,
      color: (dashboardData?.agentTrustScore || 92) > 70 ? '#10b981' : '#ef4444',
      sub: dashboardData?.agentStatus === 'SUSPENDED' ? 'SUSPENDED (3 strikes)' : 'Optimal reliability'
    }
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-pill">
            <Zap size={14} /> The Payment Firewall for Autonomous AI
          </div>
          <h1 className="hero-title">
            Your AI can act.<br />
            <span style={{ color: '#06b6d4' }}>It cannot change your intent.</span>
          </h1>
          <p className="hero-subtitle">
            INTENTLOCK continuously compares <strong>User Intent</strong> against <strong>Checkout State</strong> before money moves. 
            When autonomous shopping agents drift into price hikes, hidden recurring subscriptions, or unauthorized accessories, the firewall locks down funds deterministically.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setActiveTab('create-intent')}>
              <span>CREATE NEW INTENT</span>
              <ArrowUpRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('chaos')}>
              <Zap size={16} color="#f59e0b" />
              <span>TEST CHAOS ATTACK</span>
            </button>
            <button className="btn-judge-hero" onClick={onLaunchJudgeDemo}>
              <span>RUN 5-MIN JUDGE DEMO</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div className="metric-card" key={idx}>
              <div className="metric-header">
                <span className="metric-label">{m.label}</span>
                <div className="metric-icon-box" style={{ background: `${m.color}20`, color: m.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-sub">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Live System State Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Active Intent & Passport Summary */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#06b6d4" /> Active Intent Authority
            </h3>
            <span className="badge badge-safe">ACTIVE</span>
          </div>

          {activePassport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Passport ID:</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: '600' }}>{activePassport.passportId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Purpose:</span>
                <span style={{ fontWeight: '600' }}>{activePassport.purpose}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Maximum Spend Cap:</span>
                <span className="font-mono" style={{ color: '#10b981', fontWeight: '700' }}>₹{activePassport.maximumSpend?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Restricted Add-ons:</span>
                <span style={{ color: '#f87171', fontWeight: '600' }}>
                  {activePassport.restrictedAddons?.join(', ') || 'None'}
                </span>
              </div>
              <button 
                className="btn-secondary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setActiveTab('passport')}
              >
                Inspect Full Intent Passport
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              No active intent session. Click "Create Intent" to initialize.
            </div>
          )}
        </div>

        {/* Live Firewall Status */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#10b981" /> Live Firewall Verdict
            </h3>
            {firewallResult && (
              <span className={`badge ${
                firewallResult.decision === 'ALLOW' ? 'badge-safe' :
                firewallResult.decision === 'ASK_USER' ? 'badge-warn' : 'badge-block'
              }`}>
                {firewallResult.decision === 'ALLOW' ? '🟢 ALLOWED' :
                 firewallResult.decision === 'ASK_USER' ? '🟡 ASK USER' : '🔴 BLOCKED'}
              </span>
            )}
          </div>

          {firewallResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INTENT MATCH</div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                    {firewallResult.intentMatchScore}%
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INTENT DRIFT</div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: firewallResult.driftScore > 35 ? '#ef4444' : '#06b6d4' }}>
                    {firewallResult.driftScore}%
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Firewall Evaluation:</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  {firewallResult.primaryReason}
                </div>
              </div>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setActiveTab('firewall')}
              >
                Open Side-by-Side Comparator
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              No pending transaction evaluated yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Audit Event Feed */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Firewall Activity (Immutable Trail)</h3>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('audit')}>
            View Full Audit Ledger
          </button>
        </div>

        {dashboardData?.recentAudits && dashboardData.recentAudits.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {dashboardData.recentAudits.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.decision === 'ALLOW' ? <CheckCircle size={16} color="#10b981" /> :
                   item.decision === 'BLOCK' ? <XCircle size={16} color="#ef4444" /> :
                   <HelpCircle size={16} color="#f59e0b" />}
                  <div>
                    <span className="font-mono" style={{ color: '#38bdf8', marginRight: '8px' }}>{item.intentId}</span>
                    <span style={{ fontWeight: '600' }}>{item.reason}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    {item.amount ? `₹${item.amount.toLocaleString()}` : '—'}
                  </span>
                  <span className={`badge ${
                    item.decision === 'ALLOW' ? 'badge-safe' :
                    item.decision === 'BLOCK' ? 'badge-block' : 'badge-warn'
                  }`}>
                    {item.decision}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>
            No audit records recorded in current session.
          </div>
        )}
      </div>
    </div>
  );
}
