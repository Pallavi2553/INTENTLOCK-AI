// permissionEngine.js - Agent Permission Passport & Enforcement Rules
// INTENTLOCK AI: Deterministic authority constraints for autonomous agents

export const DEFAULT_AGENT_PERMISSIONS = {
  agentId: 'agent-shopbot-01',
  agentName: 'ShoppingBot AI (Autonomous Buyer)',
  version: '2.4.0',
  status: 'ACTIVE', // ACTIVE | SUSPENDED
  trustScore: 92,
  violationCount: 0,
  suspensionReason: null,
  capabilities: {
    searchProducts: true,
    compareProducts: true,
    addToCart: true,
    checkout: true,
    autoPayment: true
  },
  constraints: {
    maxAutoPaymentLimit: 50000,
    currency: 'INR',
    maxQuantity: 1,
    recurringPaymentsAllowed: false,
    addonsAllowed: false,
    highRiskCategoriesAllowed: false,
    allowedMerchantsOnly: true
  },
  lastUpdated: new Date().toISOString()
};

export class PermissionEngine {
  constructor() {
    this.agentProfile = { ...DEFAULT_AGENT_PERMISSIONS };
  }

  getProfile() {
    return { ...this.agentProfile };
  }

  updatePermissions(newPermissions) {
    this.agentProfile = {
      ...this.agentProfile,
      ...newPermissions,
      constraints: {
        ...this.agentProfile.constraints,
        ...(newPermissions.constraints || {})
      },
      capabilities: {
        ...this.agentProfile.capabilities,
        ...(newPermissions.capabilities || {})
      },
      lastUpdated: new Date().toISOString()
    };
    return this.getProfile();
  }

  recordViolation(reason = 'Violation detected by Payment Firewall') {
    this.agentProfile.violationCount += 1;

    // Trust score degradation formula
    if (this.agentProfile.violationCount === 1) {
      this.agentProfile.trustScore = 78;
    } else if (this.agentProfile.violationCount === 2) {
      this.agentProfile.trustScore = 61;
    } else {
      this.agentProfile.trustScore = Math.max(15, this.agentProfile.trustScore - 26);
    }

    if (this.agentProfile.violationCount >= 3 || this.agentProfile.trustScore <= 40) {
      this.agentProfile.status = 'SUSPENDED';
      this.agentProfile.suspensionReason = `Agent attempted ${this.agentProfile.violationCount} transactions outside its authorization. Automatic safety lockout activated.`;
    }

    return this.getProfile();
  }

  reactivateAgent() {
    this.agentProfile.status = 'ACTIVE';
    this.agentProfile.suspensionReason = null;
    this.agentProfile.violationCount = 0;
    this.agentProfile.trustScore = 88; // Restored with probation score
    this.agentProfile.lastUpdated = new Date().toISOString();
    return this.getProfile();
  }

  checkAgentAuthority(transaction) {
    if (this.agentProfile.status === 'SUSPENDED') {
      return {
        authorized: false,
        reason: `AGENT SUSPENDED: ${this.agentProfile.suspensionReason}`
      };
    }

    const { constraints, capabilities } = this.agentProfile;

    if (!capabilities.checkout) {
      return { authorized: false, reason: 'Agent permission denied: Checkout capability is disabled' };
    }

    if (!capabilities.autoPayment && transaction.amount > 0) {
      return { authorized: false, reason: 'Agent permission denied: Auto payment capability is disabled' };
    }

    if (transaction.amount > constraints.maxAutoPaymentLimit) {
      return {
        authorized: false,
        reason: `Agent spending cap exceeded: Requested ₹${transaction.amount.toLocaleString()} exceeds permission limit ₹${constraints.maxAutoPaymentLimit.toLocaleString()}`
      };
    }

    if (transaction.quantity > constraints.maxQuantity) {
      return {
        authorized: false,
        reason: `Agent quantity limit exceeded: Requested ${transaction.quantity}, maximum permitted is ${constraints.maxQuantity}`
      };
    }

    if (transaction.recurring && !constraints.recurringPaymentsAllowed) {
      return {
        authorized: false,
        reason: 'Agent permission denied: Recurring/subscription payments are strictly prohibited'
      };
    }

    if (transaction.addons && transaction.addons.length > 0 && !constraints.addonsAllowed) {
      return {
        authorized: false,
        reason: 'Agent permission denied: Add-on items and warranties are prohibited'
      };
    }

    return { authorized: true };
  }
}

export const permissionEngine = new PermissionEngine();
