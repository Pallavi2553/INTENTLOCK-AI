// LiveTransactionView.jsx - 6-Stage Animated Transaction Pipeline & Event Timeline
import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Bot, 
  Store, 
  ShoppingCart, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';

export default function LiveTransactionView({ 
  activePassport, 
  activeTransaction, 
  firewallResult, 
  timeline, 
  onTransactionUpdated,
  setActiveTab 
}) {
  const [running, setRunning] = useState(false);

  const stages = [
    { id: 'user', label: '1. Human User', sub: 'Authorizes Goal', icon: User },
    { id: 'intent', label: '2. Intent Passport', sub: 'Structured Limits', icon: Sparkles },
    { id: 'agent', label: '3. AI Agent', sub: 'Autonomous Search', icon: Bot },
    { id: 'merchant', label: '4. Merchant Store', sub: 'Catalog & Pricing', icon: Store },
    { id: 'checkout', label: '5. Checkout State', sub: 'Final Cart & Add-ons', icon: ShoppingCart },
    { id: 'firewall', label: '6. INTENTLOCK', sub: 'Drift Gatekeeper', icon: ShieldCheck },
    { id: 'payment', label: '7. Settlement', sub: 'Money Movement', icon: CreditCard }
  ];

  const getDecisionStatus = () => {
    if (!firewallResult) return { color: '#06b6d4', text: 'MONITORING', bg: 'rgba(6, 182, 212, 0.15)' };
    if (firewallResult.decision === 'ALLOW') return { color: '#10b981', text: '🟢 ALLOWED', bg: 'rgba(16, 185, 129, 0.15)' };
    if (firewallResult.decision === 'ASK_USER') return { color: '#f59e0b', text: '🟡 REVIEW REQUIRED', bg: 'rgba(245, 158, 11, 0.15)' };
    return { color: '#ef4444', text: '🔴 BLOCKED', bg: 'rgba(239, 68, 68, 0.2)' };
  };

  const status = getDecisionStatus();

  const handleSimulateAgentRun = async () => {
    setRunning(true);
    try {
      const res = await api.triggerAgentAction();
      if (res.success && onTransactionUpdated) {
        onTransactionUpdated(res);
      }
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <ShieldCheck size={14} /> Core Feature #9 & #21 — Live Transaction Pipeline
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Real-Time Intent Drift & Payment Flow
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Watch autonomous agent actions progress from user intent through merchant checkout. 
          The INTENTLOCK firewall stands directly between the checkout cart and final payment settlement.
        </p>
      </div>

      {/* 7-Stage Visual Pipeline */}
      <div className="glass-panel" style={{ marginBottom: '2rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Autonomous Transaction Pipeline Flow
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: status.bg, border: `1px solid ${status.color}` }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color }} />
            <span style={{ color: status.color, fontWeight: '700', fontSize: '0.85rem' }}>
              {status.text}
            </span>
          </div>
        </div>

        <div className="pipeline-track">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === stages.length - 1;
            const isFirewall = stage.id === 'firewall';
            const isPayment = stage.id === 'payment';

            return (
              <React.Fragment key={stage.id}>
                <div 
                  className="pipeline-stage active"
                  style={{
                    borderColor: isFirewall ? '#06b6d4' : isPayment && firewallResult?.decision === 'BLOCK' ? '#ef4444' : undefined,
                    background: isFirewall ? 'rgba(6, 182, 212, 0.12)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isFirewall ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isFirewall ? '#06b6d4' : 'var(--text-main)'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#ffffff' }}>{stage.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{stage.sub}</div>
                </div>

                {!isLast && (
                  <div className="pipeline-arrow">
                    <ArrowRight size={18} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current Staged Transaction Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Left: Active Staged Transaction */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="#06b6d4" /> Staged Merchant Cart
            </h3>
            {activeTransaction?.status && (
              <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#38bdf8' }}>
                {activeTransaction.id}
              </span>
            )}
          </div>

          {activeTransaction ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Merchant:</span>
                <span style={{ fontWeight: '600' }}>{activeTransaction.merchant}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Item:</span>
                <span style={{ fontWeight: '600', maxWidth: '220px', textAlign: 'right' }}>{activeTransaction.product}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Checkout Amount:</span>
                <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: activeTransaction.amount > (activePassport?.maximumSpend || 50000) ? '#ef4444' : '#10b981' }}>
                  ₹{activeTransaction.amount.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                <span className="font-mono" style={{ fontWeight: '700' }}>{activeTransaction.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Detected Add-ons:</span>
                <span style={{ color: activeTransaction.addons?.length > 0 ? '#ef4444' : 'var(--text-dim)', fontWeight: '600' }}>
                  {activeTransaction.addons?.length > 0 ? activeTransaction.addons.map(a => a.name).join(', ') : 'None'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Recurring Plan:</span>
                <span style={{ color: activeTransaction.recurring ? '#ef4444' : 'var(--text-dim)', fontWeight: '600' }}>
                  {activeTransaction.recurring ? `₹${activeTransaction.subscriptionPlan?.pricePerMonth || 499}/mo` : 'None'}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              No staged checkout available.
            </div>
          )}
        </div>

        {/* Right: Live Event Timeline */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Autonomous Event Timeline</h3>
            <button 
              className="btn-secondary" 
              onClick={handleSimulateAgentRun}
              disabled={running}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <RotateCcw size={12} className={running ? 'animate-spin' : ''} />
              <span>Re-run Agent</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto' }}>
            {timeline && timeline.length > 0 ? (
              timeline.map((event) => (
                <div 
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${
                      event.stage === 'CHAOS_ATTACK' || event.stage === 'FIREWALL_BLOCKED' ? '#ef4444' :
                      event.stage === 'USER_INTENT' ? '#06b6d4' :
                      event.stage === 'RECOVERY' ? '#10b981' : '#3b82f6'
                    }`
                  }}
                >
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {event.timestamp}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{event.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0' }}>
                Timeline ready for execution.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
