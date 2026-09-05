// ArchitectureView.jsx - System Architecture & Dual-Layer Security Model
import React from 'react';
import { 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Bot, 
  Sparkles, 
  ArrowDown, 
  CheckCircle, 
  Ban, 
  AlertCircle 
} from 'lucide-react';

export default function ArchitectureView() {
  const steps = [
    { title: 'User Intent', sub: 'Natural language goal defined by human principal' },
    { title: 'Intent Extraction Engine', sub: 'Parses constraints (budget, quantity, forbidden items)' },
    { title: 'Intent Passport', sub: 'Cryptographically bounded credential & authority source of truth' },
    { title: 'Autonomous AI Agent', sub: 'Explores merchant catalog, compares items & builds cart' },
    { title: 'Action Monitor & Checkout Trap', sub: 'Intercepts cart state, pricing changes, add-ons & subscriptions' },
    { title: 'Intent Drift Engine', sub: 'Mathematical 0–100 drift scoring against passport constraints' },
    { title: 'Agent Permission & Risk Engine', sub: 'Evaluates agent trust score, capability masks & volatility' },
    { title: 'PAYMENT FIREWALL', sub: 'Tri-state deterministic gatekeeper: ALLOW | ASK USER | BLOCK' },
    { title: 'Settlement / Recovery', sub: 'Safe funds movement OR autonomous recovery to compliant option' },
    { title: 'Immutable Audit Ledger', sub: 'Tamper-evident forensic record with cryptographic hashes' }
  ];

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <Layers size={14} /> Core Feature #22 — System Architecture
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Dual-Layer Architectural Blueprint
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          INTENTLOCK AI decouples probabilistic AI reasoning from deterministic payment authorization.
          An LLM can explore, compare, and explain — but cannot authorize transactions or override spending limits.
        </p>
      </div>

      {/* Why Existing Fraud Detection Fails vs INTENTLOCK */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2.5rem'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginBottom: '0.75rem' }}>
          Why Traditional Payment Fraud Detection Is Insufficient for Autonomous AI
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ color: '#f87171', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Traditional Bank / Card Fraud Detection:
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Asks: <em>"Is this card stolen? Is the IP unusual? Is the merchant legitimate?"</em><br />
              When an AI agent buys a ₹52,499 laptop with ₹2,999 warranty from Dell's official store, the bank sees a <strong>100% legitimate, authenticated purchase</strong> and approves it.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <div style={{ color: '#34d399', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              INTENTLOCK AI Payment Firewall:
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Asks: <em>"Does this final payment still match what the human originally intended?"</em><br />
              It detects that the user approved only ₹50,000 without accessories, calculates <strong>Intent Drift = 78%</strong>, and <strong>BLOCKS the payment before money moves</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Two Pillars: LLM Layer vs Safety Layer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* LLM Layer */}
        <div className="glass-panel" style={{ borderTop: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '700', textTransform: 'uppercase' }}>Probabilistic Layer</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>AI & Natural Language Layer</h3>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Responsible for natural language understanding and contextual communication. Has zero access to payment credentials.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#a855f7', fontWeight: '700' }}>•</span>
              <span><strong>Intent Parsing:</strong> Extracts category, budget ceilings, and excluded terms from freeform text.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#a855f7', fontWeight: '700' }}>•</span>
              <span><strong>Autonomous Shopping:</strong> Semantic search, specs matching, and merchant option comparison.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#a855f7', fontWeight: '700' }}>•</span>
              <span><strong>Human-Readable Explanations:</strong> Clarifies why a payment was held or blocked in natural language.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✕</span>
              <span style={{ color: '#f87171' }}><strong>STRICT NON-AUTHORITY:</strong> An LLM prompt or output can NEVER authorize a money transfer.</span>
            </li>
          </ul>
        </div>

        {/* Deterministic Safety Layer */}
        <div className="glass-panel" style={{ borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Deterministic Layer</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Payment Firewall Safety Engine</h3>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            A 100% deterministic code engine executing mathematical constraint validation and hard spending ceilings.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span><strong>Hard Spending Limits:</strong> Mathematical check <code className="font-mono" style={{ color: '#34d399' }}>amount &lt;= limit</code>. Zero tolerance.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span><strong>Normalized Intent Drift Score:</strong> Transparent 0–100 algorithm with distinct factor weights.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span><strong>Cryptographic Intent Passports:</strong> Signed tokens with strict 30-minute expiration windows.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span><strong>Agent Governance:</strong> 3-strike lockout policy suspending rogue or repeated drift agents.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Step-by-Step Flow Pipeline Diagram */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' }}>
          End-to-End Autonomous Payment Pipeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '720px', margin: '0 auto' }}>
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 18px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div 
                  className="font-mono" 
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.2)',
                    color: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{step.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.sub}</div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-dim)' }}>
                  <ArrowDown size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
