// Header.jsx - Application Header with Brand, Navigation Tabs, and Judge Demo Action
import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  Activity, 
  Lock, 
  AlertTriangle, 
  History, 
  FileText, 
  Cpu, 
  Layers 
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onLaunchJudgeDemo, agentStatus, trustScore }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'create-intent', label: 'Create Intent', icon: Sparkles },
    { id: 'passport', label: 'Intent Passport', icon: FileText },
    { id: 'agent', label: 'Agent & Permissions', icon: Bot },
    { id: 'live-transaction', label: 'Live Pipeline', icon: Layers },
    { id: 'firewall', label: 'Firewall', icon: Lock },
    { id: 'chaos', label: 'Chaos Mode', icon: AlertTriangle },
    { id: 'counterfactual', label: 'Counterfactual', icon: Cpu },
    { id: 'audit', label: 'Audit Log', icon: History },
    { id: 'architecture', label: 'Architecture', icon: Layers }
  ];

  return (
    <>
      <div className="synthetic-banner">
        ⚠️ SYNTHETIC DEMO ENVIRONMENT — NO REAL BANKING ACCOUNTS OR REAL MONEY ARE ACCESSED OR MOVED
      </div>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-group" onClick={() => setActiveTab('dashboard')}>
            <div className="logo-shield">
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <div className="brand-name">INTENTLOCK AI</div>
              <div className="brand-tag">Autonomous Payment Firewall</div>
            </div>
          </div>

          <nav className="nav-tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="header-actions">
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: agentStatus === 'SUSPENDED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${agentStatus === 'SUSPENDED' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              <Bot size={14} color={agentStatus === 'SUSPENDED' ? '#ef4444' : '#10b981'} />
              <span style={{ color: agentStatus === 'SUSPENDED' ? '#f87171' : '#34d399' }}>
                Trust: {trustScore}/100
              </span>
            </div>

            <button 
              className="btn-judge-hero"
              onClick={onLaunchJudgeDemo}
              title="Launch Guided 5-Minute Evaluation Demo"
            >
              <Sparkles size={14} />
              <span>5-MIN JUDGE DEMO</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
