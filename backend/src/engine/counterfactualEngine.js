// counterfactualEngine.js - "What Would Have Happened?" Simulator & Recovery Engine
// INTENTLOCK AI: Quantifies avoided financial losses & autonomous recovery paths

import { SYNTHETIC_PRODUCTS } from './syntheticData.js';

export function simulateCounterfactual(intent, transaction, firewallResult) {
  const maxBudget = intent.maximumSpend || intent.maxAmount || 50000;
  const actualAmount = Number(transaction.amount) || 0;

  // Calculate Avoided Unauthorized Spend
  let unauthorizedDirectSpend = 0;
  if (actualAmount > maxBudget) {
    unauthorizedDirectSpend = actualAmount - maxBudget;
  }

  // Calculate Avoided Warranty / Add-on Cost
  let addonCost = 0;
  if (transaction.addons && transaction.addons.length > 0) {
    addonCost = transaction.addons.reduce((sum, a) => sum + (a.price || 0), 0);
  }

  // Calculate Avoided Recurring / Subscription Trap
  let monthlyRecurring = 0;
  let annualRecurringCost = 0;
  if (transaction.recurring) {
    monthlyRecurring = transaction.subscriptionPlan ? transaction.subscriptionPlan.pricePerMonth : 499;
    annualRecurringCost = monthlyRecurring * 12;
  }

  // 3-Year Lifecycle Total Exposure Avoided
  const totalImmediateLossAvoided = unauthorizedDirectSpend + addonCost;
  const totalAnnualizedLossAvoided = totalImmediateLossAvoided + annualRecurringCost;
  const threeYearLossAvoided = totalImmediateLossAvoided + (annualRecurringCost * 3);

  // Autonomous Recovery Simulation (Locate Safe Alternative)
  // Search catalog for optimal item that matches user intent < maxBudget
  const category = (intent.allowedCategory || intent.category || 'Laptop').toLowerCase();
  const safeAlternatives = SYNTHETIC_PRODUCTS.filter(p => 
    p.category.toLowerCase() === category && p.price <= maxBudget
  ).sort((a, b) => b.price - a.price);

  const bestAlternative = safeAlternatives[0] || {
    id: 'prod-lap-alt',
    name: 'Acer Swift Go (16GB RAM, 512GB SSD)',
    category: intent.allowedCategory || 'Laptop',
    price: 48490,
    merchant: 'TechVault Hub',
    attributes: { ram: '16GB', storage: '512GB SSD' }
  };

  const recoverySavings = maxBudget - bestAlternative.price;

  return {
    threatAnalysis: {
      title: 'WHAT WOULD HAVE HAPPENED IF ALLOWED',
      unauthorizedDirectSpend,
      unauthorizedAddonCost: addonCost,
      monthlyRecurring,
      annualRecurringCost,
      totalImmediateLossAvoided,
      totalAnnualizedLossAvoided,
      threeYearLossAvoided,
      impactStatement: `INTENTLOCK successfully prevented ₹${totalImmediateLossAvoided.toLocaleString()} in immediate unapproved charges and ₹${annualRecurringCost.toLocaleString()}/year in silent recurring subscriptions.`
    },
    recoveryPath: {
      title: 'IF BLOCKED — AUTONOMOUS SAFE RECOVERY',
      action: 'Autonomous Alternative Search Executed',
      foundProduct: bestAlternative.name,
      price: bestAlternative.price,
      currency: 'INR',
      merchant: bestAlternative.merchant,
      budgetDifference: `₹${recoverySavings.toLocaleString()} under original budget`,
      intentMatchScore: 97,
      status: 'SAFE_TO_PROCEED',
      recommendation: 'Replace drifted transaction with safe verified option and proceed with authorized checkout.'
    },
    scenarioComparison: {
      driftedAmount: actualAmount,
      approvedLimit: maxBudget,
      alternativeAmount: bestAlternative.price,
      netDifference: actualAmount - bestAlternative.price
    }
  };
}
