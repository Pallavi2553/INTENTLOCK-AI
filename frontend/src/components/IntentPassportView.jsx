// IntentPassportView.jsx - Cryptographic Intent Passport Credential Badge
import React from 'react';
import { 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Key, 
  User, 
  Target, 
  DollarSign, 
  Layers, 
  Ban, 
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode
} from 'lucide-react';

export default function IntentPassportView({ activePassport, setActiveTab }) {
  if (!activePassport) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <ShieldAlert size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Active Intent Passport</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          An Intent Passport acts as the verifiable source of truth for autonomous agent authorization.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab('create-intent')}>
          CREATE FIRST INTENT
        </button>
      </div>
    );
  }

  const isExpired = activePassport.status === 'EXPIRED';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <FileCheck2 size={14} /> Core Feature #2 — Verifiable Intent Passport
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Intent Passport Credential
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          The cryptographically sealed source of truth. Autonomous agents cannot modify this token, 
          and merchant checkouts must align with these parameters or trigger immediate payment shutdown.
        </p>
      </div>

      {/* Passport Visual Card */}
      <div 
        style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '24px',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Holographic Watermark Simulation */}
        <div 
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Passport Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                OFFICIAL FINTECH SECURITY TOKEN
              </span>
              <span className="badge badge-safe">
                <CheckCircle size={12} /> {activePassport.status}
              </span>
            </div>
            <h1 className="font-mono" style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {activePassport.passportId}
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Issued by: INTENTLOCK Deterministic Gatekeeper • Protocol v1.4
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Time Validity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '700', fontSize: '1rem', marginTop: '2px' }}>
              <Clock size={16} />
              <span>30 Min Window</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Expires: {new Date(activePassport.expiresAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Passport Body Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              <User size={14} color="#06b6d4" />
              <span>Intent Owner</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
              {activePassport.owner}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Authenticated human principal
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Target size={14} color="#3b82f6" />
              <span>Approved Purpose</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
              Purchase {activePassport.allowedCategory}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {activePassport.purpose}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              <DollarSign size={14} />
              <span>Payment Authority</span>
            </div>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981' }}>
              ₹{activePassport.maximumSpend?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Strict spending boundary (Hard cap)
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Layers size={14} color="#f59e0b" />
              <span>Quantity Cap</span>
            </div>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
              {activePassport.quantity} Item Only
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Multi-item upsells prohibited
            </div>
          </div>

        </div>

        {/* Security Restrictions & Rules */}
        <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Authorized Constraint Rules
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span>Category: <strong>{activePassport.allowedCategory}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✕</span>
              <span>Accessories: <strong>PROHIBITED</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✕</span>
              <span>Subscriptions: <strong>PROHIBITED</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✕</span>
              <span>Extended Warranty: <strong>PROHIBITED</strong></span>
            </div>

          </div>
        </div>

        {/* Cryptographic Signature Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={18} color="#06b6d4" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Deterministic SHA-256 Signature</div>
              <div className="font-mono" style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                {activePassport.signature}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setActiveTab('agent')} style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
              <span>View Agent Permissions</span>
            </button>
            <button className="btn-primary" onClick={() => setActiveTab('firewall')} style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
              <span>Proceed to Firewall</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
