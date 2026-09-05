// JudgeDemoModal.jsx - 5-Minute Guided Judge Demonstration
import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';

export default function JudgeDemoModal({ onClose, onDemoCompleted }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [demoState, setDemoState] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSteps = 5;

  const runScenario = async () => {
    setLoading(true);
    try {
      const res = await api.runJudgeDemo();
      if (res.success) {
        setDemoState(res);
        if (onDemoCompleted) onDemoCompleted(res);
      }
    } catch (err) {
      alert(`Judge demo failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runScenario();
  }, []);

  // Auto-play timer: advances every 3.5 seconds if auto-playing
  React.useEffect(() => {
    if (!isAutoPlaying || loading) return;
    if (currentStep >= totalSteps) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => Math.min(totalSteps, prev + 1));
    }, 3500);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, loading]);

  const nextStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep(prev => Math.min(totalSteps, prev + 1));
  };

  const prevStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const restartDemo = () => {
    setCurrentStep(1);
    setIsAutoPlaying(true);
    runScenario();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '820px', 
          border: '2px solid rgba(168, 85, 247, 0.5)',
          background: 'linear-gradient(145deg, #090e1a 0%, #0f172a 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(168, 85, 247, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EXECUTIVE DEMO WALKTHROUGH
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                5-Minute Judge Demo Scenario
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsAutoPlaying(prev => !prev)}
              style={{
                background: isAutoPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${isAutoPlaying ? '#10b981' : 'var(--border-subtle)'}`,
                color: isAutoPlaying ? '#34d399' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Toggle Auto-Play"
            >
              {isAutoPlaying ? '⏸ Auto-Playing (3.5s)' : '▶ Resume Auto-Play'}
            </button>

            <button
              onClick={restartDemo}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Restart Demo"
            >
              <RotateCcw size={12} />
              <span>Restart</span>
            </button>

            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: s <= currentStep ? 'linear-gradient(90deg, #a855f7, #06b6d4)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#a855f7' }} />
            <div>Initializing multi-stage autonomous scenario...</div>
          </div>
        ) : (
          <div>
            {/* Step 1: User Intent */}
            {currentStep === 1 && (
              <div>
                <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', marginBottom: '0.75rem' }}>
                  STEP 1: USER NATURAL LANGUAGE INTENT
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Human User Issues Autonomous Buying Instruction
                </h4>
                <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', borderLeft: '3px solid #06b6d4', fontStyle: 'italic', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
                  "Buy me a laptop under ₹50,000, 16GB RAM, 512GB SSD, no accessories or subscriptions."
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AUTHORIZED SPEND</div>
                    <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>₹50,000</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PROHIBITED</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f87171' }}>Accessories & Subscriptions</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PASSPORT ISSUED</div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{demoState?.passport?.passportId}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Agent Clean Selection */}
            {currentStep === 2 && (
              <div>
                <span className="badge badge-safe" style={{ marginBottom: '0.75rem' }}>
                  STEP 2: AGENT INITIAL MARKETPLACE MATCH
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Autonomous Agent Finds Compliant Option
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  ShoppingBot scans synthetic inventory and selects Dell Inspiron 15 (16GB RAM, 512GB SSD) at ₹47,999.
                  Initially, the match is 100% compliant and ready for safe settlement.
                </p>
                <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Dell Inspiron 15 (16GB RAM, 512GB SSD)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Merchant: TechVault Hub</div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>
                      ₹47,999
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#34d399', fontWeight: '600' }}>
                    ✓ Fits within ₹50,000 budget • 0 Add-ons • 0 Subscriptions
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Chaos Attack Injected */}
            {currentStep === 3 && (
              <div>
                <span className="badge badge-block" style={{ marginBottom: '0.75rem' }}>
                  STEP 3: CHECKOUT PRICE MANIPULATION (CHAOS ATTACK)
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#f87171' }}>
                  Merchant Manipulates Cart at Final Checkout
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  At the final moment before settlement, the simulated merchant mutates the checkout payload:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>1. Price Hiked from ₹47,999 →</span>
                    <strong className="font-mono" style={{ color: '#f87171' }}>₹52,499 (Exceeds ₹50,000 limit)</strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>2. Slipped in Unauthorized Warranty →</span>
                    <strong style={{ color: '#f87171' }}>+₹2,999 Extended Protection</strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>3. Injected Recurring Subscription →</span>
                    <strong style={{ color: '#f87171' }}>+₹499/month Cloud Storage</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Firewall Blocks Payment */}
            {currentStep === 4 && (
              <div>
                <span className="badge badge-block" style={{ marginBottom: '0.75rem' }}>
                  STEP 4: INTENTLOCK PAYMENT FIREWALL TRIGGERS
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  🛑 PAYMENT DETERMINISTICALLY BLOCKED
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  The firewall compares the original Intent Passport against the mutated cart state. 
                  Intent Drift spikes to <strong>78%</strong>, and payment is blocked before money moves.
                </p>
                <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '700', color: '#f87171', marginBottom: '0.5rem' }}>
                    Violations Detected:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                    <li>❌ Hard Budget Exceeded (₹52,499 &gt; ₹50,000)</li>
                    <li>❌ Unauthorized Add-on detected (2-Year Extended Protection)</li>
                    <li>❌ Unauthorized Recurring Payment (₹499/mo subscription)</li>
                  </ul>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#fca5a5' }}>
                    Total immediate + annualized unauthorized loss prevented: <strong>₹11,486</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Autonomous Recovery */}
            {currentStep === 5 && (
              <div>
                <span className="badge badge-safe" style={{ marginBottom: '0.75rem' }}>
                  STEP 5: AUTONOMOUS SAFE RECOVERY
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#34d399' }}>
                  🟢 Alternative Located & Safe to Proceed
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  Rather than stalling, INTENTLOCK's recovery engine pivots the agent to a fully verified safe alternative:
                </p>
                <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.15rem' }}>
                        {demoState?.counterfactual?.recoveryPath?.foundProduct || 'Acer Swift Go (16GB RAM, 512GB SSD)'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Safe Vendor: TechVault Hub</div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>
                      ₹{demoState?.counterfactual?.recoveryPath?.price?.toLocaleString() || '48,490'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <div>Intent Match: <strong style={{ color: '#06b6d4' }}>97%</strong></div>
                    <div>Under Budget By: <strong style={{ color: '#10b981' }}>₹1,510</strong></div>
                    <div>Add-ons: <strong>0</strong></div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#a7f3d0', fontWeight: '600', textAlign: 'center' }}>
                  🎉 The Payment Firewall protected user intent while preserving the speed of autonomous commerce.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
          <button 
            className="btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
          >
            Previous
          </button>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button className="btn-primary" onClick={nextStep}>
              <span>Next Stage</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary" style={{ background: '#10b981' }} onClick={onClose}>
              <span>Done (Inspect Prototype)</span>
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
