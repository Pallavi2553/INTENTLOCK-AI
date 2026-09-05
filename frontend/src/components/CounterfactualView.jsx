// CounterfactualView.jsx - "What Would Have Happened?" Threat vs Recovery Simulator
import React from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  RefreshCw, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';

export default function CounterfactualView({ counterfactualData, activePassport, setActiveTab }) {
  if (!counterfactualData) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
        <Cpu size={48} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Counterfactual Simulator Inactive
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          When the INTENTLOCK payment firewall blocks an unauthorized or drifted transaction, 
          the counterfactual engine calculates both the avoided financial disaster and the autonomous safe recovery path.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('chaos')}>
          TRIGGER CHAOS ATTACK TO SIMULATE
        </button>
      </div>
    );
  }

  const { threatAnalysis, recoveryPath, scenarioComparison } = counterfactualData;

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <Cpu size={14} /> Core Feature #7 & #13 — Counterfactual Threat Simulator
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          What Would Have Happened?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Real-time financial impact analysis: comparing the compounding unauthorized liabilities prevented 
          against the verified alternative path found by autonomous recovery.
        </p>
      </div>

      {/* Main Comparison: Threat vs Recovery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Threat Panel: IF ALLOWED */}
        <div 
          style={{
            background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-block">
              <ShieldAlert size={12} /> THE DANGER
            </span>
            <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: '700', textTransform: 'uppercase' }}>
              WITHOUT INTENTLOCK
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171', marginBottom: '0.5rem' }}>
            IF ALLOWED: Unauthorized Leakage
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Without a payment firewall, the autonomous agent would have settled the manipulated checkout, 
            locking you into ongoing silent charges.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Immediate Direct Spend Excess</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Over user-authorized cap</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f87171' }}>
                ₹{threatAnalysis.unauthorizedDirectSpend?.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unauthorized Add-ons & Warranties</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Merchant cart upselling</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f87171' }}>
                ₹{threatAnalysis.unauthorizedAddonCost?.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stealth Recurring Subscription</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Monthly recurring liability</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f87171' }}>
                ₹{threatAnalysis.monthlyRecurring?.toLocaleString()}/mo
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>1-Year Total Drain Avoided</div>
                <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>Direct excess + 12 monthly charges</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171' }}>
                ₹{threatAnalysis.totalAnnualizedLossAvoided?.toLocaleString()}
              </div>
            </div>

          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
            {threatAnalysis.impactStatement}
          </div>
        </div>

        {/* Recovery Panel: IF BLOCKED */}
        <div 
          style={{
            background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-safe">
              <ShieldCheck size={12} /> INTENT RECOVERY
            </span>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase' }}>
              WITH INTENTLOCK
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', marginBottom: '0.5rem' }}>
            IF BLOCKED: Autonomous Safe Recovery
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The firewall prevented the rogue checkout, and our autonomous agent immediately pivoted 
            to locate a fully compliant alternative matching your exact specifications.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Discovered Alternative</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                {recoveryPath.foundProduct}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Merchant: {recoveryPath.merchant}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compliant Purchase Price</div>
                <div style={{ fontSize: '0.72rem', color: '#34d399' }}>{recoveryPath.budgetDifference}</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: '800', color: '#34d399' }}>
                ₹{recoveryPath.price?.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Intent Match Score</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Zero forbidden add-ons</div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: '800', color: '#06b6d4' }}>
                {recoveryPath.intentMatchScore}%
              </div>
            </div>

            <div style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Firewall Settlement Verdict</div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Safe to dispatch funds</div>
              </div>
              <span className="badge badge-safe" style={{ fontSize: '0.85rem' }}>
                🟢 SAFE TO PROCEED
              </span>
            </div>

          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            onClick={() => setActiveTab('firewall')}
          >
            <span>CONFIRM RECOVERY & PROCEED</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
