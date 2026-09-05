// ChaosModeView.jsx - Intent Attack & Chaos Vector Simulation Lab
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  RefreshCw, 
  DollarSign, 
  Store, 
  Clock, 
  ArrowRight,
  Zap,
  Bomb
} from 'lucide-react';
import { api } from '../api/client';

export default function ChaosModeView({ onAttackExecuted, setActiveTab }) {
  const [activeAttackKey, setActiveAttackKey] = useState(null);
  const [running, setRunning] = useState(false);
  const [lastAttackResult, setLastAttackResult] = useState(null);

  const attacks = [
    {
      key: 'PRICE_DRIFT',
      name: '1. Price Drift',
      icon: TrendingUp,
      color: '#f59e0b',
      tag: 'Budget Breach',
      desc: 'Simulated merchant secretly bumps price by +₹2,499 above authorized maximum.'
    },
    {
      key: 'QUANTITY_DRIFT',
      name: '2. Quantity Drift',
      icon: Layers,
      color: '#06b6d4',
      tag: 'Cart Tampering',
      desc: 'Shopping cart quantity auto-doubles from 1 unit to 2 units without human consent.'
    },
    {
      key: 'UNAUTHORIZED_ADDON',
      name: '3. Unauthorized Add-on',
      icon: ShieldAlert,
      color: '#ec4899',
      tag: 'Hidden Accessory',
      desc: 'Merchant slips ₹2,999 Extended Warranty package into checkout basket.'
    },
    {
      key: 'SUBSCRIPTION_INJECTION',
      name: '4. Subscription Injection',
      icon: Flame,
      color: '#ef4444',
      tag: 'Recurring Trap',
      desc: 'Stealth recurrent cloud subscription (₹499/mo = ₹5,988/year) injected.'
    },
    {
      key: 'PRODUCT_SWAP',
      name: '5. Product Swap',
      icon: Bomb,
      color: '#a855f7',
      tag: 'Category Mismatch',
      desc: 'Agent selects an unapproved product (Smart Watch instead of authorized Laptop).'
    },
    {
      key: 'MERCHANT_SWAP',
      name: '6. Merchant Swap',
      icon: Store,
      color: '#3b82f6',
      tag: 'Rogue Vendor',
      desc: 'Routing payment through an unverified, unapproved third-party storefront.'
    },
    {
      key: 'CHECKOUT_MANIPULATION',
      name: '7. Combined Checkout Manipulation',
      icon: Zap,
      color: '#ef4444',
      tag: 'Hero Attack Scenario',
      desc: 'Triple attack: Price exceeds budget + ₹2,999 warranty + ₹499/mo subscription.'
    },
    {
      key: 'EXPIRED_AUTHORIZATION',
      name: '8. Expired Authorization',
      icon: Clock,
      color: '#64748b',
      tag: 'Time Out of Bounds',
      desc: 'Simulates transaction execution after the 30-minute Intent Passport has expired.'
    }
  ];

  const handleTriggerAttack = async (attackKey) => {
    setActiveAttackKey(attackKey);
    setRunning(true);
    try {
      const res = await api.runChaosAttack(attackKey);
      if (res.success) {
        setLastAttackResult(res);
        if (onAttackExecuted) onAttackExecuted(res);
      }
    } catch (err) {
      alert(`Chaos injection failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
          <Flame size={14} /> Core Feature #8 & #14 — Intent Attack & Chaos Mode
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Autonomous Payment Attack Simulator
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Simulate how malicious merchants, rogue agent scripts, or unprompted upsells mutate transactions at checkout.
          Test how INTENTLOCK detects intent drift and shuts down payment settlement before money moves.
        </p>
      </div>

      {/* 8 Attack Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {attacks.map((atk) => {
          const Icon = atk.icon;
          const isSelected = activeAttackKey === atk.key;

          return (
            <div 
              key={atk.key}
              className="glass-panel"
              style={{
                border: isSelected ? `2px solid ${atk.color}` : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(22, 33, 62, 0.95)' : 'var(--bg-card)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${atk.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: atk.color }}>
                    <Icon size={20} />
                  </div>
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.3)', color: atk.color, border: `1px solid ${atk.color}40` }}>
                    {atk.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>
                  {atk.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {atk.desc}
                </p>
              </div>

              <button
                className="btn-secondary"
                style={{
                  width: '100%',
                  background: isSelected ? atk.color : 'rgba(255,255,255,0.05)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
                disabled={running}
                onClick={() => handleTriggerAttack(atk.key)}
              >
                {running && isSelected ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Injecting Attack...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>INJECT THIS ATTACK</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Attack Feedback Banner */}
      {lastAttackResult && (
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid #ef4444',
            borderRadius: '18px',
            padding: '1.75rem',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={32} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DEFENSE TRIGGERED: {lastAttackResult.attack?.name}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
                🚨 INTENT DRIFT DETECTED — PAYMENT HALTED
              </h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Intent Drift Score spiked to <strong style={{ color: '#f87171' }}>{lastAttackResult.evaluation?.driftScore}%</strong> • 
                Violations: <strong>{lastAttackResult.evaluation?.violations?.map(v => v.title).join(', ')}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={() => setActiveTab('firewall')}>
              <span>INSPECT IN FIREWALL</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('counterfactual')}>
              <span>SEE COUNTERFACTUAL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
