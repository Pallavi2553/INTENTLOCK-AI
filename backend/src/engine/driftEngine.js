// driftEngine.js - Transparent Intent Drift & Constraint Verification Engine
// INTENTLOCK AI: Mathematical comparison between User Intent & Checkout State

export function evaluateIntentDrift(intent, transaction) {
  if (!intent || !transaction) {
    throw new Error('Both intent and transaction are required for drift evaluation');
  }

  const violations = [];
  const warnings = [];
  let rawDriftPoints = 0;
  const breakdown = [];

  const maxAmount = intent.maximumSpend || intent.maxAmount || 0;
  const approvedQuantity = intent.quantity || 1;
  const category = (intent.allowedCategory || intent.category || '').toLowerCase();
  const txCategory = (transaction.category || '').toLowerCase();
  const prohibited = (intent.restrictedAddons || intent.prohibitedAddons || []).map(p => p.toLowerCase());
  const recurringAllowed = Boolean(intent.recurringAllowed || intent.recurringPaymentAllowed);

  // 1. PRICE VIOLATION (+30 base + scaled delta)
  const actualAmount = Number(transaction.amount) || 0;
  if (actualAmount > maxAmount) {
    const diff = actualAmount - maxAmount;
    const excessPct = diff / (maxAmount || 1);
    const scaledPriceScore = Math.min(45, Math.round(30 + excessPct * 30));
    rawDriftPoints += scaledPriceScore;
    violations.push({
      type: 'PRICE_BUDGET_EXCEEDED',
      severity: 'CRITICAL',
      title: 'Budget Exceeded',
      message: `Final price ₹${actualAmount.toLocaleString()} exceeds approved limit ₹${maxAmount.toLocaleString()} by ₹${diff.toLocaleString()}`,
      excessAmount: diff,
      scoreAdded: scaledPriceScore
    });
    breakdown.push({ factor: 'Price Violation', points: scaledPriceScore, detail: `+₹${diff.toLocaleString()} over budget` });
  } else if (actualAmount > (intent.softApprovalThreshold || intent.approvalRequiredAbove || maxAmount)) {
    // Soft price threshold reached (within budget, but near ceiling)
    rawDriftPoints += 12;
    warnings.push({
      type: 'PRICE_SOFT_THRESHOLD',
      severity: 'MODERATE',
      title: 'Soft Budget Threshold',
      message: `Price ₹${actualAmount.toLocaleString()} is within budget but exceeds soft approval threshold ₹${(intent.softApprovalThreshold || intent.approvalRequiredAbove).toLocaleString()}`
    });
    breakdown.push({ factor: 'Soft Budget Alert', points: 12, detail: 'Near upper budget ceiling' });
  }

  // 2. QUANTITY VIOLATION (+20)
  const txQuantity = Number(transaction.quantity) || 1;
  if (txQuantity !== approvedQuantity) {
    const qtyScore = 20;
    rawDriftPoints += qtyScore;
    violations.push({
      type: 'QUANTITY_MISMATCH',
      severity: 'HIGH',
      title: 'Quantity Changed',
      message: `Cart quantity changed to ${txQuantity} (Authorized: ${approvedQuantity})`,
      scoreAdded: qtyScore
    });
    breakdown.push({ factor: 'Quantity Violation', points: qtyScore, detail: `Requested ${txQuantity} vs authorized ${approvedQuantity}` });
  }

  // 3. UNAUTHORIZED ADD-ON (+20)
  if (transaction.addons && Array.isArray(transaction.addons) && transaction.addons.length > 0) {
    const prohibitedFound = transaction.addons.filter(addon => {
      const addonName = (addon.name || '').toLowerCase();
      const addonCat = (addon.category || '').toLowerCase();
      return (
        prohibited.includes('accessories') ||
        prohibited.includes('warranty') ||
        prohibited.includes('all') ||
        prohibited.some(p => addonName.includes(p) || addonCat.includes(p))
      );
    });

    if (prohibitedFound.length > 0) {
      const addonScore = Math.min(25, 20 + (prohibitedFound.length - 1) * 5);
      rawDriftPoints += addonScore;
      violations.push({
        type: 'UNAUTHORIZED_ADDON',
        severity: 'HIGH',
        title: 'Unauthorized Add-on',
        message: `Detected unapproved add-on item: "${prohibitedFound.map(a => a.name).join(', ')}"`,
        addons: prohibitedFound,
        scoreAdded: addonScore
      });
      breakdown.push({ factor: 'Unauthorized Add-on', points: addonScore, detail: prohibitedFound.map(a => a.name).join(', ') });
    }
  }

  // 4. RECURRING SUBSCRIPTION INJECTION (+25)
  if (transaction.recurring && !recurringAllowed) {
    const subScore = 25;
    rawDriftPoints += subScore;
    const subPlan = transaction.subscriptionPlan;
    const monthly = subPlan ? subPlan.pricePerMonth : 499;
    const annual = monthly * 12;
    violations.push({
      type: 'UNAUTHORIZED_SUBSCRIPTION',
      severity: 'CRITICAL',
      title: 'Unauthorized Recurring Payment',
      message: `Subscription stealthily injected: ₹${monthly}/month (₹${annual}/year annualized cost)`,
      monthlyCost: monthly,
      annualCost: annual,
      scoreAdded: subScore
    });
    breakdown.push({ factor: 'Recurring Subscription', points: subScore, detail: `₹${monthly}/mo recurring charge` });
  }

  // 5. CATEGORY MISMATCH (+30)
  if (category && txCategory && category !== txCategory) {
    const catScore = 30;
    rawDriftPoints += catScore;
    violations.push({
      type: 'CATEGORY_MISMATCH',
      severity: 'CRITICAL',
      title: 'Category Mismatch',
      message: `Attempted purchase in category "${transaction.category}" (Intent authorized "${intent.allowedCategory || intent.category}")`,
      scoreAdded: catScore
    });
    breakdown.push({ factor: 'Category Mismatch', points: catScore, detail: `${txCategory} ≠ ${category}` });
  }

  // 6. MERCHANT MISMATCH (+10)
  if (transaction.merchant) {
    const isUntrusted = transaction.merchant.toLowerCase().includes('shady') ||
                        transaction.merchant.toLowerCase().includes('untrusted') ||
                        transaction.merchant.toLowerCase().includes('unknown');
    if (isUntrusted) {
      const merchScore = 15;
      rawDriftPoints += merchScore;
      violations.push({
        type: 'UNTRUSTED_MERCHANT',
        severity: 'HIGH',
        title: 'Unverified Merchant',
        message: `Transaction routed to unverified/high-risk vendor: "${transaction.merchant}"`,
        scoreAdded: merchScore
      });
      breakdown.push({ factor: 'Merchant Mismatch', points: merchScore, detail: transaction.merchant });
    }
  }

  // 7. EXPIRED PASSPORT AUTHORIZATION (+35)
  const isExpired = Boolean(transaction.intentExpired) || 
    (intent.expiresAt && new Date(intent.expiresAt) < new Date());
  if (isExpired) {
    const expScore = 35;
    rawDriftPoints += expScore;
    violations.push({
      type: 'EXPIRED_AUTHORIZATION',
      severity: 'CRITICAL',
      title: 'Expired Authorization',
      message: 'Intent Passport validity has expired. Autonomous execution window closed.',
      scoreAdded: expScore
    });
    breakdown.push({ factor: 'Expired Authorization', points: expScore, detail: 'Window closed' });
  }

  // NORMALIZE FINAL DRIFT SCORE (0 - 100)
  const driftScore = Math.min(100, Math.max(0, Math.round(rawDriftPoints)));
  const intentMatchScore = Math.max(0, 100 - driftScore);

  // INTERPRETATION TIERS
  let riskLevel = 'SAFE';
  if (driftScore > 80) {
    riskLevel = 'CRITICAL DRIFT';
  } else if (driftScore > 60) {
    riskLevel = 'HIGH DRIFT';
  } else if (driftScore > 35) {
    riskLevel = 'MEDIUM DRIFT';
  } else if (driftScore > 15) {
    riskLevel = 'LOW DRIFT';
  } else {
    riskLevel = 'SAFE';
  }

  return {
    rawPoints: rawDriftPoints,
    driftScore,
    intentMatchScore,
    riskLevel,
    violations,
    warnings,
    breakdown,
    violationCount: violations.length,
    evaluatedAt: new Date().toISOString()
  };
}
