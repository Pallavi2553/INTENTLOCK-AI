// FirewallComparatorView.jsx - Central Intent vs Transaction Comparator & Firewall Decision
import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import ApprovalModal from './ApprovalModal';

export default function FirewallComparatorView({ 
  activePassport, 
  activeTransaction, 
  firewallResult, 
  onActionComplete,
  setActiveTab 
}) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!firewallResult || !activePassport || !activeTransaction) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <ShieldAlert size={48} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Active Evaluation</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Create an intent and initiate an agent task to run the side-by-side firewall comparator.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('create-intent')}>
          INITIALIZE INTENT
        </button>
      </div>
    );
  }

  const { decision, intentMatchScore, driftScore, violations, explanation, approvalPayload } = firewallResult;

  const isBlocked = decision === 'BLOCK';
  const isAskUser = decision === 'ASK_USER';
  const isAllowed = decision === 'ALLOW';

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <Lock size={14} /> Core Feature #5 & #30 — Payment Firewall Gatekeeper
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          User Intent vs. Checkout State
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          The core breakthrough of INTENTLOCK: continuously proving that the final financial debit 
          strictly matches the human's original authorization before a single rupee moves.
        </p>
      </div>

      {/* 3-Column Split Comparator Component */}
      <div className="comparator-grid">
        
        {/* Left Column: ORIGINAL USER INTENT */}
        <div className="comparator-column" style={{ borderTop: '4px solid #06b6d4' }}>
          <div className="column-header">
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Source of Truth</div>
              <div className="column-title" style={{ color: '#38bdf8' }}>Original User Intent</div>
            </div>
            <span className="badge badge-safe">AUTHENTIC</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category & Item</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                {activePassport.allowedCategory}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved Budget Ceiling</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                ₹{activePassport.maximumSpend?.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved Quantity</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                {activePassport.quantity} Item
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prohibited Add-ons</div>
              <div style={{ color: '#f87171', fontWeight: '600', fontSize: '0.9rem', marginTop: '2px' }}>
                {activePassport.restrictedAddons?.join(', ') || 'No accessories, no warranties'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subscription Authority</div>
              <div style={{ color: '#f87171', fontWeight: '600', fontSize: '0.9rem', marginTop: '2px' }}>
                Strictly Prohibited (₹0 recurring)
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: INTENT DRIFT ENGINE */}
        <div className="drift-center-dial" style={{ borderTop: `4px solid ${isBlocked ? '#ef4444' : isAskUser ? '#f59e0b' : '#10b981'}` }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            INTENT DRIFT ENGINE
          </div>

          <div 
            className="dial-circle" 
            style={{ 
              borderColor: isBlocked ? '#ef4444' : isAskUser ? '#f59e0b' : '#10b981',
              boxShadow: `0 0 20px ${isBlocked ? 'rgba(239,68,68,0.3)' : isAskUser ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`
            }}
          >
            <div className="dial-score" style={{ color: isBlocked ? '#ef4444' : isAskUser ? '#f59e0b' : '#10b981' }}>
              {driftScore}%
            </div>
            <div className="dial-label">DRIFT</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INTENT MATCH</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
              {intentMatchScore}%
            </div>
          </div>

          <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.4)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {violations.length > 0 ? (
              <span style={{ color: '#f87171', fontWeight: '700' }}>
                {violations.length} VIOLATION{violations.length > 1 ? 'S' : ''} DETECTED
              </span>
            ) : (
              <span style={{ color: '#34d399', fontWeight: '700' }}>
                0 VIOLATIONS
              </span>
            )}
          </div>
        </div>

        {/* Right Column: CURRENT TRANSACTION STATE */}
        <div className="comparator-column" style={{ borderTop: `4px solid ${isBlocked ? '#ef4444' : isAskUser ? '#f59e0b' : '#10b981'}` }}>
          <div className="column-header">
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Incoming Payload</div>
              <div className="column-title" style={{ color: isBlocked ? '#f87171' : '#ffffff' }}>Current Checkout State</div>
            </div>
            <span className={`badge ${isBlocked ? 'badge-block' : isAskUser ? 'badge-warn' : 'badge-safe'}`}>
              {activeTransaction.merchant}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Product In Cart</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {activeTransaction.product}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Final Checkout Total</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: activeTransaction.amount > (activePassport.maximumSpend || 50000) ? '#ef4444' : '#ffffff', marginTop: '2px' }}>
                ₹{activeTransaction.amount.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cart Quantity</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: '700', color: activeTransaction.quantity !== activePassport.quantity ? '#ef4444' : '#ffffff', marginTop: '2px' }}>
                {activeTransaction.quantity} Item{activeTransaction.quantity > 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attached Add-ons</div>
              <div style={{ color: activeTransaction.addons?.length > 0 ? '#ef4444' : 'var(--text-dim)', fontWeight: '600', fontSize: '0.9rem', marginTop: '2px' }}>
                {activeTransaction.addons?.length > 0 ? activeTransaction.addons.map(a => `${a.name} (+₹${a.price.toLocaleString()})`).join(', ') : 'None'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recurring Charge</div>
              <div style={{ color: activeTransaction.recurring ? '#ef4444' : 'var(--text-dim)', fontWeight: '600', fontSize: '0.9rem', marginTop: '2px' }}>
                {activeTransaction.recurring ? `₹${activeTransaction.subscriptionPlan?.pricePerMonth || 499}/month (Stealth Subscription)` : 'None'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Decision Banner Component */}
      <div 
        className={`decision-banner ${
          isAllowed ? 'decision-allow' : isAskUser ? 'decision-ask' : 'decision-block'
        }`}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: isAllowed ? '#10b981' : isAskUser ? '#f59e0b' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isAllowed ? <CheckCircle size={28} color="#ffffff" /> :
             isAskUser ? <HelpCircle size={28} color="#ffffff" /> :
             <XCircle size={28} color="#ffffff" />}
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
              {isAllowed ? '🟢 PAYMENT AUTHORIZED & ALLOWED' :
               isAskUser ? '🟡 PAYMENT PAUSED — HUMAN APPROVAL REQUIRED' :
               '🔴 PAYMENT BLOCKED BY INTENTLOCK FIREWALL'}
            </div>
            <p style={{ fontSize: '0.95rem', marginTop: '4px', opacity: 0.9 }}>
              {explanation}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          {isAskUser && (
            <button className="btn-primary" style={{ background: '#f59e0b' }} onClick={() => setShowApprovalModal(true)}>
              <span>REVIEW & DECIDE</span>
              <ArrowRight size={16} />
            </button>
          )}

          {isBlocked && (
            <button className="btn-primary" onClick={() => setActiveTab('counterfactual')}>
              <span>VIEW WHAT WOULD HAVE HAPPENED</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Violations Detail Breakdown */}
      {violations.length > 0 && (
        <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Specific Constraint Violations ({violations.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {violations.map((v, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#f87171', fontSize: '0.92rem' }}>{v.title}</div>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginTop: '2px' }}>{v.message}</div>
                </div>
                <span className="font-mono" style={{ color: '#f87171', fontWeight: '700', fontSize: '0.85rem' }}>
                  +{v.scoreAdded} Drift
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Human Approval Modal */}
      {showApprovalModal && approvalPayload && (
        <ApprovalModal
          approvalPayload={approvalPayload}
          onClose={() => setShowApprovalModal(false)}
          onActionComplete={(res) => {
            if (onActionComplete) onActionComplete(res);
          }}
        />
      )}
    </div>
  );
}
