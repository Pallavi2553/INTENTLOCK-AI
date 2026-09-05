// firewallEngine.js - Deterministic Payment Firewall Decision Engine
// INTENTLOCK AI: Tri-State Safety Gate (ALLOW | ASK USER | BLOCK)

import { evaluateIntentDrift } from './driftEngine.js';
import { evaluateRisk } from './riskEngine.js';
import { permissionEngine } from './permissionEngine.js';
import { auditEngine } from './auditEngine.js';

export class PaymentFirewallEngine {
  evaluate(intent, transaction, options = {}) {
    if (!intent || !transaction) {
      throw new Error('Both intent and transaction are required for firewall evaluation');
    }

    // 1. Evaluate Intent Drift
    const drift = evaluateIntentDrift(intent, transaction);

    // 2. Check Agent Permissions
    const agentProfile = permissionEngine.getProfile();
    const authorityCheck = permissionEngine.checkAgentAuthority(transaction);

    // 3. Evaluate Multi-factor Risk
    const risk = evaluateRisk(drift, agentProfile, transaction);

    // 4. Deterministic Tri-State Decision Tree
    let decision = 'ALLOW';
    let decisionCode = 'DECISION_ALLOW';
    let decisionTitle = 'Payment Allowed';
    let primaryReason = 'Transaction matches all verified constraints within authorized spending limits.';
    let requiresApproval = false;
    let approvalPayload = null;

    // RULE 1: HARD BLOCK CONDITIONS
    const criticalViolations = drift.violations.filter(v => 
      ['PRICE_BUDGET_EXCEEDED', 'UNAUTHORIZED_SUBSCRIPTION', 'CATEGORY_MISMATCH', 'EXPIRED_AUTHORIZATION'].includes(v.type)
    );

    if (!authorityCheck.authorized) {
      decision = 'BLOCK';
      decisionCode = 'DECISION_BLOCKED_AGENT_UNAUTHORIZED';
      decisionTitle = 'Payment Blocked';
      primaryReason = authorityCheck.reason;
    } else if (criticalViolations.length > 0) {
      decision = 'BLOCK';
      decisionCode = 'DECISION_BLOCKED_CRITICAL_VIOLATION';
      decisionTitle = 'Payment Blocked';
      primaryReason = criticalViolations.map(v => v.message).join(' | ');
    } else if (drift.violations.some(v => v.type === 'UNAUTHORIZED_ADDON')) {
      // Prohibited add-ons explicitly violate intent
      decision = 'BLOCK';
      decisionCode = 'DECISION_BLOCKED_PROHIBITED_ADDON';
      decisionTitle = 'Payment Blocked';
      primaryReason = 'Transaction includes prohibited accessories or warranties expressly forbidden by user intent.';
    } else if (drift.violations.some(v => v.type === 'QUANTITY_MISMATCH')) {
      decision = 'BLOCK';
      decisionCode = 'DECISION_BLOCKED_QUANTITY_VIOLATION';
      decisionTitle = 'Payment Blocked';
      primaryReason = 'Cart quantity deviates from original user authorization.';
    } else if (drift.driftScore > 35) {
      decision = 'BLOCK';
      decisionCode = 'DECISION_BLOCKED_HIGH_DRIFT';
      decisionTitle = 'Payment Blocked';
      primaryReason = `Overall intent drift score (${drift.driftScore}%) exceeds safe autonomous tolerance.`;
    } 
    // RULE 2: SOFT DEVIATION -> ASK USER
    else if (drift.warnings.some(w => w.type === 'PRICE_SOFT_THRESHOLD') || (drift.driftScore > 15 && drift.driftScore <= 35)) {
      decision = 'ASK_USER';
      decisionCode = 'DECISION_ASK_USER_CONFIRMATION';
      decisionTitle = 'Human Approval Required';
      requiresApproval = true;
      primaryReason = 'Transaction is within absolute ceiling but exceeds soft approval threshold or contains subtle preference shift.';
      
      const maxBudget = intent.maximumSpend || intent.maxAmount;
      const difference = Math.max(0, transaction.amount - (intent.approvalRequiredAbove || maxBudget * 0.95));
      
      approvalPayload = {
        originalLimit: maxBudget,
        currentPrice: transaction.amount,
        difference,
        reason: `The selected ${transaction.product || 'item'} price (₹${transaction.amount.toLocaleString()}) approaches or slightly shifts beyond your primary baseline budget.`,
        suggestedActions: ['APPROVE', 'FIND_ALTERNATIVE', 'CANCEL']
      };
    }
    // RULE 3: CLEAN MATCH -> ALLOW
    else {
      decision = 'ALLOW';
      decisionCode = 'DECISION_ALLOW_SAFE';
      decisionTitle = 'Payment Authorized';
      primaryReason = 'All hard constraints, pricing caps, quantities, and merchant verifications satisfied.';
    }

    // 5. Build Comprehensive Natural Language Explanation
    const explanation = this.buildExplanation({
      decision,
      drift,
      intent,
      transaction,
      primaryReason,
      agentProfile
    });

    // 6. Record in Agent Trust & Audit Log
    if (decision === 'BLOCK') {
      permissionEngine.recordViolation(primaryReason);
    }

    const evaluationResult = {
      decision,
      decisionCode,
      decisionTitle,
      primaryReason,
      explanation,
      requiresApproval,
      approvalPayload,
      intentMatchScore: drift.intentMatchScore,
      driftScore: drift.driftScore,
      riskLevel: drift.riskLevel,
      violations: drift.violations,
      warnings: drift.warnings,
      breakdown: drift.breakdown,
      transactionSummary: {
        id: transaction.id,
        amount: transaction.amount,
        product: transaction.product,
        merchant: transaction.merchant,
        quantity: transaction.quantity,
        addons: transaction.addons || [],
        recurring: Boolean(transaction.recurring)
      },
      intentSummary: {
        id: intent.id || intent.passportId,
        maximumSpend: intent.maximumSpend || intent.maxAmount,
        category: intent.allowedCategory || intent.category,
        quantity: intent.quantity || 1,
        restrictedAddons: intent.restrictedAddons || intent.prohibitedAddons || [],
        recurringAllowed: Boolean(intent.recurringAllowed || intent.recurringPaymentAllowed)
      },
      evaluatedAt: new Date().toISOString()
    };

    // Log to audit trail
    auditEngine.recordEvent({
      intentId: intent.id || intent.passportId,
      agentId: transaction.agentId || 'agent-shopbot-01',
      transactionId: transaction.id,
      event: `FIREWALL_${decision}`,
      decision,
      driftScore: drift.driftScore,
      intentMatchScore: drift.intentMatchScore,
      amount: transaction.amount,
      violations: drift.violations.map(v => v.title),
      reason: primaryReason,
      metadata: {
        merchant: transaction.merchant,
        product: transaction.product
      }
    });

    return evaluationResult;
  }

  buildExplanation({ decision, drift, intent, transaction, primaryReason }) {
    if (decision === 'ALLOW') {
      return `Payment authorized. The transaction of ₹${transaction.amount.toLocaleString()} on ${transaction.merchant} strictly complies with the original limit of ₹${(intent.maximumSpend || intent.maxAmount).toLocaleString()}, with zero unauthorized add-ons or subscriptions.`;
    }

    if (decision === 'ASK_USER') {
      return `Human approval requested. The price of ₹${transaction.amount.toLocaleString()} is within the maximum cap of ₹${(intent.maximumSpend || intent.maxAmount).toLocaleString()} but has reached the soft verification threshold. Please confirm before funds are dispatched.`;
    }

    // BLOCKED
    const violationDescriptions = drift.violations.map(v => v.message);
    return `Payment was BLOCKED by INTENTLOCK AI Firewall. Reason: ${violationDescriptions.join('. ')}. Autonomous movement of funds has been halted to prevent unauthorized spend.`;
  }
}

export const firewallEngine = new PaymentFirewallEngine();
