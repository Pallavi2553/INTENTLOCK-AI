// CreateIntentView.jsx - Natural Language Prompt & Structured Constraint Extractor
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sliders, 
  DollarSign, 
  ShoppingBag, 
  Ban, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { api } from '../api/client';

export default function CreateIntentView({ onIntentCreated, setActiveTab }) {
  const [prompt, setPrompt] = useState(
    'Buy me a laptop under ₹50,000 with at least 16GB RAM and 512GB SSD. Do not add accessories or subscriptions.'
  );
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [creating, setCreating] = useState(false);
  const [samplePresets, setSamplePresets] = useState([]);

  // Load samples on mount
  useEffect(() => {
    api.listPassports().then(res => {
      if (res.sampleIntents) setSamplePresets(res.sampleIntents);
    }).catch(console.error);
  }, []);

  // Debounce extraction on prompt change
  useEffect(() => {
    if (!prompt.trim()) return;
    const timer = setTimeout(() => {
      handleExtract(prompt);
    }, 250);
    return () => clearTimeout(timer);
  }, [prompt]);

  const handleExtract = async (textToExtract) => {
    if (!textToExtract.trim()) return;
    setExtracting(true);
    try {
      const res = await api.extractIntent(textToExtract);
      if (res.success) {
        setExtractedData(res.extracted);
      }
    } catch (err) {
      console.error('Extract error:', err);
    } finally {
      setExtracting(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setPrompt(preset.prompt);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || creating) return;
    setCreating(true);
    try {
      const res = await api.createIntent(prompt, extractedData);
      if (res.success) {
        onIntentCreated(res);
        setActiveTab('passport');
      }
    } catch (err) {
      alert(`Error creating intent: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill">
          <Sparkles size={14} /> Core Feature #1 — Natural Language Intent
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Define User Intent & Authorization
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Type your instructions in plain human language. INTENTLOCK deterministically parses your spending limits, 
          prohibited add-ons, and quantity caps into an immutable security credential.
        </p>
      </div>

      {/* Quick Presets */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          Or Select a Sample Intent Scenario:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {samplePresets.map((preset) => (
            <button
              key={preset.id}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              onClick={() => handleApplyPreset(preset)}
            >
              <ShoppingBag size={14} color="#06b6d4" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Box */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <textarea
              className="form-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Buy me a laptop under ₹50,000 with 16GB RAM. Do not add accessories or subscriptions."
              style={{ fontSize: '1.05rem', resize: 'vertical' }}
            />
            {extracting && (
              <div style={{ position: 'absolute', right: '12px', bottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#06b6d4' }}>
                <RefreshCw size={12} className="animate-spin" /> Parsing constraints...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Deterministic constraint engine active. AI will be held strictly to these rules.</span>
            </div>

            <button type="submit" className="btn-primary" disabled={creating} style={{ minWidth: '220px' }}>
              {creating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Issuing Passport...</span>
                </>
              ) : (
                <>
                  <span>AUTHORIZE INTENT & ISSUE PASSPORT</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Visual Structured Constraints Card */}
      {extractedData && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EXTRACTED INTENT STRUCTURE</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Structured Authorization Bounds</h3>
            </div>
            <span className="badge badge-safe">
              <CheckCircle2 size={12} /> DETERMINISTIC RESTRAINTS
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Maximum Spending Limit</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                ₹{extractedData.maxAmount?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Hard ceiling — agent cannot exceed</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authorized Quantity</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#06b6d4', marginTop: '4px' }}>
                {extractedData.quantity} {extractedData.quantity === 1 ? 'Item' : 'Items'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Cart tampering strictly blocked</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Category</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
                {extractedData.category}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Unapproved category swaps blocked</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Soft Approval Threshold</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>
                ₹{extractedData.approvalRequiredAbove?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Triggers human review above this</div>
            </div>
          </div>

          {/* Constraint Pills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} /> Required / Preferred Attributes
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {extractedData.preferredAttributes && extractedData.preferredAttributes.length > 0 ? (
                  extractedData.preferredAttributes.map((attr, i) => (
                    <span key={i} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {attr}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Standard baseline specs</span>
                )}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ban size={14} /> Forbidden Items & Liabilities
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {extractedData.prohibitedAddons?.map((addon, i) => (
                  <span key={i} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>
                    ✕ No {addon}
                  </span>
                ))}
                <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                  ✕ No Recurring Subscriptions
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
