// intentPassport.js - Cryptographically Signed Intent Passport System
// Source of truth for what autonomous agents are authorized to transact

import crypto from 'crypto';

export class IntentPassportManager {
  constructor() {
    this.passports = new Map();
  }

  createPassport(intent) {
    const passportId = intent.id || `INTENT-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const issuedAt = new Date().toISOString();
    const expiresAt = intent.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const payload = {
      passportId,
      owner: intent.owner || 'Demo User',
      purpose: `Purchase ${intent.category || 'Product'} (${intent.userRequest || 'Custom Intent'})`,
      maximumSpend: intent.maxAmount,
      currency: 'INR',
      quantity: intent.quantity || 1,
      allowedCategory: intent.category,
      preferredAttributes: intent.preferredAttributes || [],
      restrictedAddons: intent.prohibitedAddons || ['accessories', 'subscriptions'],
      recurringAllowed: Boolean(intent.recurringPaymentAllowed),
      paymentAuthority: intent.maxAmount,
      softApprovalThreshold: intent.approvalRequiredAbove || intent.maxAmount,
      merchantWhitelist: intent.merchantRestrictions || ['Verified Merchants Only'],
      issuedAt,
      expiresAt,
      status: 'ACTIVE'
    };

    // Deterministic simulation hash for tamper detection
    const signature = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload) + 'INTENTLOCK_SECRET_SALT')
      .digest('hex');

    const fullPassport = {
      ...payload,
      signature: `0x${signature.substring(0, 32)}...${signature.substring(56)}`,
      fullSignature: signature,
      verificationToken: `ILK-AUTH-${passportId}-${signature.substring(0, 8).toUpperCase()}`
    };

    this.passports.set(passportId, fullPassport);
    return fullPassport;
  }

  getPassport(id) {
    return this.passports.get(id);
  }

  listPassports() {
    return Array.from(this.passports.values());
  }

  revokePassport(id, reason = 'Manually revoked by user') {
    const p = this.passports.get(id);
    if (p) {
      p.status = 'REVOKED';
      p.revokedReason = reason;
      p.revokedAt = new Date().toISOString();
      return p;
    }
    return null;
  }

  verifyPassport(id) {
    const p = this.passports.get(id);
    if (!p) return { valid: false, reason: 'Passport not found' };

    if (p.status === 'REVOKED') {
      return { valid: false, reason: `Passport was revoked: ${p.revokedReason}` };
    }

    const now = new Date();
    if (new Date(p.expiresAt) < now || p.status === 'EXPIRED') {
      p.status = 'EXPIRED';
      return { valid: false, reason: 'Passport authorization expired (30m window elapsed)' };
    }

    return { valid: true, passport: p };
  }
}

export const passportManager = new IntentPassportManager();
