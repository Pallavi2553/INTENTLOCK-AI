// App.jsx - Main Application Controller for INTENTLOCK AI
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import CreateIntentView from './components/CreateIntentView';
import IntentPassportView from './components/IntentPassportView';
import AgentPermissionsView from './components/AgentPermissionsView';
import LiveTransactionView from './components/LiveTransactionView';
import FirewallComparatorView from './components/FirewallComparatorView';
import CounterfactualView from './components/CounterfactualView';
import ChaosModeView from './components/ChaosModeView';
import AuditLogView from './components/AuditLogView';
import ArchitectureView from './components/ArchitectureView';
import JudgeDemoModal from './components/JudgeDemoModal';
import { api } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [activePassport, setActivePassport] = useState(null);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [firewallResult, setFirewallResult] = useState(null);
  const [counterfactualData, setCounterfactualData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [agentProfile, setAgentProfile] = useState(null);
  const [showJudgeDemo, setShowJudgeDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial application state on mount
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    try {
      const [dashRes, activeRes, agentRes] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getActiveState().catch(() => null),
        api.getAgentPermissions().catch(() => null)
      ]);

      if (dashRes) setDashboardData(dashRes);
      if (activeRes) {
        if (activeRes.passport) setActivePassport(activeRes.passport);
        if (activeRes.transaction) setActiveTransaction(activeRes.transaction);
        if (activeRes.firewall) setFirewallResult(activeRes.firewall);
        if (activeRes.counterfactual) setCounterfactualData(activeRes.counterfactual);
      }
      if (agentRes && agentRes.profile) {
        setAgentProfile(agentRes.profile);
      }
    } catch (err) {
      console.error('Failed loading system state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIntentCreated = (data) => {
    setActivePassport(data.passport);
    setActiveTransaction(data.agentTransaction);
    setFirewallResult(data.firewallEvaluation);
    setTimeline(data.timeline || []);
    if (data.firewallEvaluation?.decision === 'BLOCK') {
      api.getActiveState().then(res => {
        if (res.counterfactual) setCounterfactualData(res.counterfactual);
      });
    }
    refreshDashboard();
  };

  const handleTransactionUpdated = (data) => {
    setActiveTransaction(data.transaction);
    setFirewallResult(data.firewall);
    setCounterfactualData(data.counterfactual);
    setTimeline(data.timeline || []);
    refreshDashboard();
  };

  const handleAttackExecuted = (data) => {
    setActiveTransaction(data.transaction);
    setFirewallResult(data.evaluation);
    setCounterfactualData(data.counterfactual);
    setTimeline(data.timeline || []);
    if (data.agentProfile) setAgentProfile(data.agentProfile);
    refreshDashboard();
  };

  const handleJudgeDemoCompleted = (data) => {
    setActivePassport(data.passport);
    setActiveTransaction(data.maliciousTransaction);
    setFirewallResult(data.firewallEvaluation);
    setCounterfactualData(data.counterfactual);
    setTimeline(data.timeline || []);
    if (data.agentProfile) setAgentProfile(data.agentProfile);
    refreshDashboard();
  };

  const refreshDashboard = () => {
    api.getDashboard().then(res => {
      if (res) setDashboardData(res);
    }).catch(console.error);

    api.getAgentPermissions().then(res => {
      if (res?.profile) setAgentProfile(res.profile);
    }).catch(console.error);
  };

  return (
    <div className="app-container">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchJudgeDemo={() => setShowJudgeDemo(true)}
        agentStatus={agentProfile?.status || 'ACTIVE'}
        trustScore={agentProfile?.trustScore || 92}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            dashboardData={dashboardData}
            activePassport={activePassport}
            activeTransaction={activeTransaction}
            firewallResult={firewallResult}
            setActiveTab={setActiveTab}
            onLaunchJudgeDemo={() => setShowJudgeDemo(true)}
          />
        )}

        {activeTab === 'create-intent' && (
          <CreateIntentView
            onIntentCreated={handleIntentCreated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'passport' && (
          <IntentPassportView
            activePassport={activePassport}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'agent' && (
          <AgentPermissionsView
            agentProfile={agentProfile}
            onProfileUpdated={(updated) => {
              setAgentProfile(updated);
              refreshDashboard();
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'live-transaction' && (
          <LiveTransactionView
            activePassport={activePassport}
            activeTransaction={activeTransaction}
            firewallResult={firewallResult}
            timeline={timeline}
            onTransactionUpdated={handleTransactionUpdated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'firewall' && (
          <FirewallComparatorView
            activePassport={activePassport}
            activeTransaction={activeTransaction}
            firewallResult={firewallResult}
            onActionComplete={() => {
              refreshAllData();
              setActiveTab('live-transaction');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'chaos' && (
          <ChaosModeView
            onAttackExecuted={handleAttackExecuted}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'counterfactual' && (
          <CounterfactualView
            counterfactualData={counterfactualData}
            activePassport={activePassport}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* 5-Minute Judge Demo Modal */}
      {showJudgeDemo && (
        <JudgeDemoModal
          onClose={() => {
            setShowJudgeDemo(false);
            setActiveTab('firewall');
          }}
          onDemoCompleted={handleJudgeDemoCompleted}
        />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(7, 11, 20, 0.95)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>INTENTLOCK AI</strong> — The Payment Firewall for Autonomous AI • Prototype v1.0
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Deterministic Rule Engine</span>
            <span>•</span>
            <span>Immutable Audit Trail</span>
            <span>•</span>
            <span>Synthetic Demonstration Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
