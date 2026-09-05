// AgentPermissionsView.jsx - Autonomous Agent Permissions Matrix & Trust Governance
import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  RefreshCw, 
  AlertOctagon, 
  DollarSign, 
  Sliders, 
  Lock,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';

export default function AgentPermissionsView({ agentProfile, onProfileUpdated, setActiveTab }) {
  const [profile, setProfile] = useState(agentProfile || null);
  const [loading, setLoading] = useState(!agentProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!agentProfile) {
      loadProfile();
    } else {
      setProfile(agentProfile);
    }
  }, [agentProfile]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getAgentPermissions();
      setProfile(res.profile);
      if (onProfileUpdated) onProfileUpdated(res.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCapability = (key) => {
    if (!profile) return;
    const updated = {
      ...profile,
      capabilities: {
        ...profile.capabilities,
        [key]: !profile.capabilities[key]
      }
    };
    savePermissions(updated);
  };

  const handleToggleConstraint = (key) => {
    if (!profile) return;
    const updated = {
      ...profile,
      constraints: {
        ...profile.constraints,
        [key]: !profile.constraints[key]
      }
    };
    savePermissions(updated);
  };

  const savePermissions = async (updatedProfile) => {
    setSaving(true);
    try {
      const res = await api.updateAgentPermissions(updatedProfile);
      if (res.success) {
        setProfile(res.profile);
        if (onProfileUpdated) onProfileUpdated(res.profile);
      }
    } catch (err) {
      alert(`Failed to update permissions: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReactivate = async () => {
    try {
      const res = await api.reactivateAgent();
      if (res.success) {
        setProfile(res.profile);
        if (onProfileUpdated) onProfileUpdated(res.profile);
      }
    } catch (err) {
      alert(`Failed to reactivate: ${err.message}`);
    }
  };

  if (loading || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#06b6d4' }} />
        <div>Loading agent permissions matrix...</div>
      </div>
    );
  }

  const isSuspended = profile.status === 'SUSPENDED';

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <Bot size={14} /> Core Feature #6 — Agent Permissions Passport
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Autonomous Agent Authority & Governance
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Define what autonomous actions ShoppingBot is permitted to execute on your behalf.
          If an agent repeatedly attempts transactions outside its bounds, the trust score decays and locks down the agent.
        </p>
      </div>

      {/* Suspension Alert Banner if Locked Out */}
      {isSuspended && (
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertOctagon size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f87171' }}>
                AGENT SUSPENDED — SAFETY LOCKOUT ACTIVE
              </div>
              <div style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginTop: '4px' }}>
                {profile.suspensionReason || 'Agent attempted 3 transactions outside its authorization.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handleReactivate}>
              <RotateCcw size={16} />
              <span>REACTIVATE AGENT</span>
            </button>
          </div>
        </div>
      )}

      {/* Agent Profile & Trust Score Card */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: isSuspended ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                border: `1px solid ${isSuspended ? '#ef4444' : '#06b6d4'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={32} color={isSuspended ? '#ef4444' : '#06b6d4'} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{profile.agentName}</h3>
                <span className={`badge ${isSuspended ? 'badge-block' : 'badge-safe'}`}>
                  {profile.status}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                ID: <span className="font-mono">{profile.agentId}</span> • Version {profile.version}
              </div>
            </div>
          </div>

          {/* Trust Score Visual Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AGENT TRUST SCORE</div>
              <div style={{ fontSize: '0.78rem', color: isSuspended ? '#f87171' : '#34d399', fontWeight: '600' }}>
                {isSuspended ? 'Lockout Threshold Tripped' : 'Certified Autonomous Operator'}
              </div>
            </div>
            <div 
              className="font-mono" 
              style={{ 
                fontSize: '2rem', 
                fontWeight: '800', 
                color: profile.trustScore > 70 ? '#10b981' : profile.trustScore > 45 ? '#f59e0b' : '#ef4444' 
              }}
            >
              {profile.trustScore}/100
            </div>
          </div>

        </div>
      </div>

      {/* Permissions Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Capability Controls */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#06b6d4" /> Pipeline Capabilities
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Search products</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Semantic marketplace exploration</div>
              </div>
              <button 
                onClick={() => handleToggleCapability('searchProducts')}
                style={{ background: profile.capabilities.searchProducts ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {profile.capabilities.searchProducts ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Compare products</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Multi-merchant price & spec evaluation</div>
              </div>
              <button 
                onClick={() => handleToggleCapability('compareProducts')}
                style={{ background: profile.capabilities.compareProducts ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {profile.capabilities.compareProducts ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Add to cart</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Stage items in merchant basket</div>
              </div>
              <button 
                onClick={() => handleToggleCapability('addToCart')}
                style={{ background: profile.capabilities.addToCart ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {profile.capabilities.addToCart ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Proceed to checkout</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Navigate to payment portal</div>
              </div>
              <button 
                onClick={() => handleToggleCapability('checkout')}
                style={{ background: profile.capabilities.checkout ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {profile.capabilities.checkout ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Autonomous auto payment</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Execute payment without manual OTP</div>
              </div>
              <button 
                onClick={() => handleToggleCapability('autoPayment')}
                style={{ background: profile.capabilities.autoPayment ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                {profile.capabilities.autoPayment ? <Check size={16} /> : <X size={16} />}
              </button>
            </div>

          </div>
        </div>

        {/* Constraint Restrictions */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#ef4444" /> Strict Boundary Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Maximum Automatic Payment:</span>
                <span className="font-mono" style={{ color: '#10b981', fontWeight: '700' }}>
                  ₹{profile.constraints.maxAutoPaymentLimit.toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Hard ceiling configured across all tasks</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Recurring Payments</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Authorize silent monthly renewals</div>
              </div>
              <span className={`badge ${profile.constraints.recurringPaymentsAllowed ? 'badge-safe' : 'badge-block'}`}>
                {profile.constraints.recurringPaymentsAllowed ? 'ALLOWED' : '❌ NOT ALLOWED'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Cart Quantity Ceiling</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Maximum units per transaction</div>
              </div>
              <span className="font-mono" style={{ fontWeight: '700', color: '#06b6d4' }}>
                Max {profile.constraints.maxQuantity}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Merchant Add-ons & Warranties</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Accessories, insurance, fast delivery fees</div>
              </div>
              <span className={`badge ${profile.constraints.addonsAllowed ? 'badge-safe' : 'badge-block'}`}>
                {profile.constraints.addonsAllowed ? 'ALLOWED' : '❌ NOT ALLOWED'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>High-Risk Merchant Categories</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Gift cards, crypto vouchers, gambling</div>
              </div>
              <span className="badge badge-block">
                ❌ NOT ALLOWED
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
