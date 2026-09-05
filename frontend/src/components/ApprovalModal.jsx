// ApprovalModal.jsx - Human Approval Screen for Soft Intent Drift
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, XCircle, DollarSign, ArrowRight } from 'lucide-react';
import { api } from '../api/client';

export default function ApprovalModal({ approvalPayload, onClose, onActionComplete }) {
  const [submitting, setSubmitting] = useState(false);

  if (!approvalPayload) return null;

  const handleAction = async (action) => {
    setSubmitting(true);
    try {
      const res = await api.respondApproval(action, approvalPayload.currentPrice);
      if (res.success && onActionComplete) {
        onActionComplete(res);
      }
      onClose();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={26} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HUMAN AUTHORIZATION GATE
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Your AI Agent Needs Approval
            </h3>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          {approvalPayload.reason || 'The selected option is slightly above your original budget threshold. As your payment firewall, INTENTLOCK has paused the transaction.'}
        </p>

        {/* Pricing Comparison Box */}
        <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Original Limit</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>
                ₹{approvalPayload.originalLimit?.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Price</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f59e0b' }}>
                ₹{approvalPayload.currentPrice?.toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Additional Spend Delta:</span>
            <span className="font-mono" style={{ color: '#f87171', fontWeight: '700', fontSize: '1rem' }}>
              +₹{approvalPayload.difference?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
            onClick={() => handleAction('APPROVE')}
            disabled={submitting}
          >
            <CheckCircle size={16} />
            <span>APPROVE ₹{approvalPayload.currentPrice?.toLocaleString()} (ONE-TIME OVERRIDE)</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={() => handleAction('FIND_ALTERNATIVE')}
            disabled={submitting}
          >
            <RefreshCw size={16} />
            <span>FIND ANOTHER OPTION (WITHIN ₹{approvalPayload.originalLimit?.toLocaleString()})</span>
          </button>

          <button 
            className="btn-secondary" 
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={() => handleAction('CANCEL')}
            disabled={submitting}
          >
            <XCircle size={16} />
            <span>CANCEL PAYMENT & REJECT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
