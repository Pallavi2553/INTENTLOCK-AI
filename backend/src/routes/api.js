// routes/api.js - Comprehensive REST API Endpoints
// INTENTLOCK AI: Payment Firewall for Autonomous AI

import express from 'express';
import { extractIntentFromPrompt, buildIntentStructure } from '../engine/intentEngine.js';
import { passportManager } from '../engine/intentPassport.js';
import { agentEngine } from '../engine/agentEngine.js';
import { evaluateIntentDrift } from '../engine/driftEngine.js';
import { permissionEngine } from '../engine/permissionEngine.js';
import { firewallEngine } from '../engine/firewallEngine.js';
import { simulateCounterfactual } from '../engine/counterfactualEngine.js';
import { auditEngine } from '../engine/auditEngine.js';
import { 
  SYNTHETIC_PRODUCTS, 
  SYNTHETIC_ADDONS, 
  SYNTHETIC_SUBSCRIPTIONS, 
  SAMPLE_INTENTS, 
  CHAOS_ATTACK_PRESETS 
} from '../engine/syntheticData.js';

const router = express.Router();

// Active runtime state
let activeIntent = null;
let activePassport = null;
let activeTransaction = null;
let lastFirewallResult = null;
let lastCounterfactual = null;

// Initialize with default demo intent on startup
function initDefaults() {
  const defaultIntent = buildIntentStructure(SAMPLE_INTENTS[0].prompt, {
    maxAmount: 50000,
    category: 'Laptop',
    quantity: 1,
    prohibitedAddons: ['accessories', 'subscriptions', 'warranty'],
    recurringPaymentAllowed: false
  });
  activeIntent = defaultIntent;
  activePassport = passportManager.createPassport(defaultIntent);

  // Generate initial agent action
  const agentRun = agentEngine.executeTask(activeIntent);
  if (agentRun.success) {
    activeTransaction = agentRun.transaction;
    lastFirewallResult = firewallEngine.evaluate(activePassport, activeTransaction);
  }
}
initDefaults();

// --- 1. HEALTH ENDPOINT ---
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'INTENTLOCK AI Engine',
    version: '1.0.0',
    mode: 'SYNTHETIC_DEMO',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// --- 2. INTENT EXTRACTION & CREATION ---
router.post('/intent/extract', (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const extracted = extractIntentFromPrompt(prompt);
    res.json({ success: true, extracted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/intent/create', (req, res) => {
  try {
    const { prompt, overrides } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const intent = buildIntentStructure(prompt, overrides || {});
    activeIntent = intent;
    activePassport = passportManager.createPassport(intent);

    // Run agent immediately to simulate real-world shopping initiation
    const agentRun = agentEngine.executeTask(intent);
    if (agentRun.success) {
      activeTransaction = agentRun.transaction;
      lastFirewallResult = firewallEngine.evaluate(activePassport, activeTransaction);
      if (lastFirewallResult.decision === 'BLOCK') {
        lastCounterfactual = simulateCounterfactual(activePassport, activeTransaction, lastFirewallResult);
      } else {
        lastCounterfactual = null;
      }
    }

    res.json({
      success: true,
      intent,
      passport: activePassport,
      agentTransaction: activeTransaction,
      firewallEvaluation: lastFirewallResult,
      timeline: agentEngine.getTimeline()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/intent/active', (req, res) => {
  res.json({
    intent: activeIntent,
    passport: activePassport,
    transaction: activeTransaction,
    firewall: lastFirewallResult,
    counterfactual: lastCounterfactual
  });
});

router.get('/intent/:id', (req, res) => {
  const passport = passportManager.getPassport(req.params.id);
  if (!passport) {
    return res.status(404).json({ error: 'Intent Passport not found' });
  }
  res.json({ passport });
});

router.get('/intent', (req, res) => {
  res.json({
    passports: passportManager.listPassports(),
    sampleIntents: SAMPLE_INTENTS
  });
});

// --- 3. AGENT SIMULATION & ACTIONS ---
router.post('/agent/action', (req, res) => {
  try {
    if (!activeIntent) {
      return res.status(400).json({ error: 'No active intent. Create an intent first.' });
    }

    const { actionType, selectedProductId } = req.body;
    let forceProduct = null;
    if (selectedProductId) {
      forceProduct = SYNTHETIC_PRODUCTS.find(p => p.id === selectedProductId);
    }

    const agentRun = agentEngine.executeTask(activeIntent, { forceProduct });
    if (!agentRun.success) {
      return res.status(400).json({ error: agentRun.reason });
    }

    activeTransaction = agentRun.transaction;
    lastFirewallResult = firewallEngine.evaluate(activePassport, activeTransaction);

    if (lastFirewallResult.decision === 'BLOCK') {
      lastCounterfactual = simulateCounterfactual(activePassport, activeTransaction, lastFirewallResult);
    } else {
      lastCounterfactual = null;
    }

    res.json({
      success: true,
      transaction: activeTransaction,
      firewall: lastFirewallResult,
      counterfactual: lastCounterfactual,
      timeline: agentEngine.getTimeline()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/agent/permissions', (req, res) => {
  res.json({
    profile: permissionEngine.getProfile()
  });
});

router.put('/agent/permissions', (req, res) => {
  try {
    const updated = permissionEngine.updatePermissions(req.body);
    res.json({ success: true, profile: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/agent/reactivate', (req, res) => {
  try {
    const profile = permissionEngine.reactivateAgent();
    auditEngine.recordEvent({
      intentId: activeIntent ? activeIntent.id : 'SYSTEM',
      agentId: profile.agentId,
      event: 'AGENT_REACTIVATED',
      decision: 'MANUAL_RESTORE',
      reason: 'User manual review completed. Agent permissions restored to probation status.'
    });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. FIREWALL CHECK & EVALUATION ---
router.post('/firewall/check', (req, res) => {
  try {
    const intent = req.body.intent || activePassport || activeIntent;
    const transaction = req.body.transaction || activeTransaction;

    if (!intent || !transaction) {
      return res.status(400).json({ error: 'Intent and transaction are required for firewall check' });
    }

    const evaluation = firewallEngine.evaluate(intent, transaction);
    lastFirewallResult = evaluation;

    let counterfactual = null;
    if (evaluation.decision === 'BLOCK') {
      counterfactual = simulateCounterfactual(intent, transaction, evaluation);
      lastCounterfactual = counterfactual;
    }

    res.json({
      success: true,
      evaluation,
      counterfactual
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. CHAOS MODE (INTENT ATTACKS) ---
router.post('/chaos/run', (req, res) => {
  try {
    const { attackType } = req.body;
    if (!attackType || !CHAOS_ATTACK_PRESETS[attackType]) {
      return res.status(400).json({ 
        error: `Unknown attack type: ${attackType}. Available: ${Object.keys(CHAOS_ATTACK_PRESETS).join(', ')}` 
      });
    }

    if (!activeTransaction) {
      return res.status(400).json({ error: 'No active transaction to manipulate. Run an agent action first.' });
    }

    const attack = CHAOS_ATTACK_PRESETS[attackType];
    // Apply attack transformation to transaction
    const manipulatedTx = attack.apply({ ...activeTransaction });
    activeTransaction = manipulatedTx;

    // Log timeline event
    agentEngine.addLog('CHAOS_ATTACK', `Chaos vector activated: [${attack.name}] - ${attack.description}`);

    // Re-evaluate through firewall immediately
    const evaluation = firewallEngine.evaluate(activePassport, manipulatedTx);
    lastFirewallResult = evaluation;

    let counterfactual = null;
    if (evaluation.decision === 'BLOCK') {
      counterfactual = simulateCounterfactual(activePassport, manipulatedTx, evaluation);
      lastCounterfactual = counterfactual;
    }

    res.json({
      success: true,
      attack: {
        name: attack.name,
        type: attackType,
        description: attack.description
      },
      transaction: manipulatedTx,
      evaluation,
      counterfactual,
      timeline: agentEngine.getTimeline(),
      agentProfile: permissionEngine.getProfile()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 6. HUMAN APPROVAL SCREEN RESPONSE ---
router.post('/approval/respond', (req, res) => {
  try {
    const { action, approvedAmount } = req.body; // APPROVE | FIND_ALTERNATIVE | CANCEL
    if (!['APPROVE', 'FIND_ALTERNATIVE', 'CANCEL'].includes(action)) {
      return res.status(400).json({ error: 'Action must be APPROVE, FIND_ALTERNATIVE, or CANCEL' });
    }

    if (!activeTransaction) {
      return res.status(400).json({ error: 'No active transaction pending approval' });
    }

    let updatedTx = { ...activeTransaction };
    let finalDecision = 'ALLOW';
    let reason = '';

    if (action === 'APPROVE') {
      finalDecision = 'ALLOW';
      updatedTx.status = 'AUTHORIZED_BY_USER';
      reason = `User manually granted one-time spending override of ₹${(approvedAmount || updatedTx.amount).toLocaleString()}`;
      
      auditEngine.recordEvent({
        intentId: activePassport ? activePassport.passportId : 'INTENT',
        agentId: updatedTx.agentId,
        transactionId: updatedTx.id,
        event: 'USER_OVERRIDE_APPROVED',
        decision: 'ALLOW',
        amount: approvedAmount || updatedTx.amount,
        userApproval: { approved: true, timestamp: new Date().toISOString() },
        reason
      });
    } else if (action === 'FIND_ALTERNATIVE') {
      // Find clean product under budget
      const safeProduct = SYNTHETIC_PRODUCTS.find(p => 
        p.category === (activePassport.allowedCategory || 'Laptop') && p.price <= (activePassport.maximumSpend || 50000)
      ) || SYNTHETIC_PRODUCTS[0];

      updatedTx = {
        ...updatedTx,
        id: `TX-REV-${Date.now().toString().slice(-4)}`,
        product: safeProduct.name,
        itemPrice: safeProduct.price,
        amount: safeProduct.price,
        addons: [],
        recurring: false,
        status: 'PENDING_FIREWALL'
      };
      reason = 'User requested alternative option. Swapped to compliant item within budget.';
      
      lastFirewallResult = firewallEngine.evaluate(activePassport, updatedTx);
      finalDecision = lastFirewallResult.decision;
    } else {
      // CANCEL
      finalDecision = 'CANCELLED';
      updatedTx.status = 'CANCELLED_BY_USER';
      reason = 'User rejected transaction approval request.';

      auditEngine.recordEvent({
        intentId: activePassport ? activePassport.passportId : 'INTENT',
        agentId: updatedTx.agentId,
        transactionId: updatedTx.id,
        event: 'USER_REJECTED',
        decision: 'CANCELLED',
        reason
      });
    }

    activeTransaction = updatedTx;

    res.json({
      success: true,
      actionTaken: action,
      transaction: updatedTx,
      finalDecision,
      reason,
      auditStats: auditEngine.getStats()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 7. AUDIT & DASHBOARD METRICS ---
router.get('/audit', (req, res) => {
  const { decision, intentId } = req.query;
  const logs = auditEngine.getLogs({ decision, intentId });
  res.json({
    logs,
    stats: auditEngine.getStats()
  });
});

router.get('/dashboard', (req, res) => {
  const stats = auditEngine.getStats();
  const agent = permissionEngine.getProfile();
  
  res.json({
    activeIntentSessions: activePassport ? 1 : 0,
    protectedTransactions: stats.totalEvaluations,
    blockedViolations: stats.blockedCount,
    approvalRequests: stats.askUserCount,
    allowedCount: stats.allowedCount,
    potentialUnauthorizedSpendPrevented: stats.totalSpendPrevented + (lastCounterfactual?.threatAnalysis?.totalImmediateLossAvoided || 0),
    agentTrustScore: agent.trustScore,
    agentStatus: agent.status,
    recentAudits: auditEngine.getLogs().slice(0, 5),
    mode: 'SYNTHETIC_ENVIRONMENT'
  });
});

// --- 8. 5-MINUTE JUDGE DEMO HERO FLOW ---
router.post('/demo/judge-flow', (req, res) => {
  try {
    // Step 1: User Intent
    const judgeIntent = buildIntentStructure(
      'Buy me a laptop under ₹50,000, 16GB RAM, 512GB SSD, no accessories or subscriptions.',
      {
        maxAmount: 50000,
        category: 'Laptop',
        quantity: 1,
        prohibitedAddons: ['accessories', 'subscriptions', 'warranty'],
        recurringPaymentAllowed: false
      }
    );
    activeIntent = judgeIntent;
    activePassport = passportManager.createPassport(judgeIntent);

    // Step 2: Agent selects compliant Dell Laptop ₹47,999
    agentEngine.clearTimeline();
    agentEngine.addLog('USER_INTENT', 'Judge Demo: User initiated intent for ₹50,000 laptop with zero accessories');
    
    const initialProduct = SYNTHETIC_PRODUCTS[0]; // Dell ₹47,999
    agentEngine.addLog('SEARCH', 'Agent searched marketplace and found Dell Inspiron 15 at ₹47,999 (Compliant)');

    // Step 3: Checkout Manipulation Chaos Attack
    const attack = CHAOS_ATTACK_PRESETS.CHECKOUT_MANIPULATION;
    agentEngine.addLog('CHAOS_ATTACK', '🚨 CHAOS ATTACK INJECTED: Checkout Price Manipulation (₹52,499 + ₹2,999 warranty + ₹499/mo subscription)');

    const maliciousTx = {
      id: `TX-JUDGE-${Date.now().toString().slice(-4)}`,
      intentId: activePassport.passportId,
      agentId: 'agent-shopbot-01',
      merchant: 'TechVault Hub',
      category: 'Laptop',
      product: initialProduct.name,
      amount: 52499,
      itemPrice: 52499,
      quantity: 1,
      addons: [SYNTHETIC_ADDONS[0]], // Warranty ₹2,999
      recurring: true,
      subscriptionPlan: SYNTHETIC_SUBSCRIPTIONS[0], // Cloud ₹499/mo
      status: 'PENDING_FIREWALL',
      attackType: 'CHECKOUT_MANIPULATION',
      createdAt: new Date().toISOString()
    };
    activeTransaction = maliciousTx;

    // Step 4: Firewall triggers BLOCK
    agentEngine.addLog('FIREWALL_TRIGGER', 'INTENTLOCK Payment Firewall triggered. Running Intent Drift computation...');
    const evaluation = firewallEngine.evaluate(activePassport, maliciousTx);
    lastFirewallResult = evaluation;
    agentEngine.addLog('FIREWALL_BLOCKED', `🛑 PAYMENT BLOCKED: ${evaluation.violations.map(v => v.title).join(', ')}`);

    // Step 5: Counterfactual simulation
    const counterfactual = simulateCounterfactual(activePassport, maliciousTx, evaluation);
    lastCounterfactual = counterfactual;

    // Step 6: Autonomous Recovery
    agentEngine.addLog('RECOVERY', `Autonomous recovery initiated: Re-routed to verified alternative [${counterfactual.recoveryPath.foundProduct}] at ₹${counterfactual.recoveryPath.price.toLocaleString()}`);

    res.json({
      success: true,
      scenario: '5_MINUTE_JUDGE_DEMO',
      intent: judgeIntent,
      passport: activePassport,
      maliciousTransaction: maliciousTx,
      firewallEvaluation: evaluation,
      counterfactual,
      timeline: agentEngine.getTimeline(),
      agentProfile: permissionEngine.getProfile()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 9. SYNTHETIC CATALOG HELPERS ---
router.get('/marketplace/products', (req, res) => {
  res.json({
    products: SYNTHETIC_PRODUCTS,
    addons: SYNTHETIC_ADDONS,
    subscriptions: SYNTHETIC_SUBSCRIPTIONS,
    chaosPresets: Object.entries(CHAOS_ATTACK_PRESETS).map(([key, val]) => ({
      key,
      name: val.name,
      description: val.description
    }))
  });
});

export default router;
