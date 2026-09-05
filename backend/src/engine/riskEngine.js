// riskEngine.js - Multi-Factor Risk Assessment Engine
// INTENTLOCK AI: Aggregates drift metrics, agent trust profile and transaction volatility

export function evaluateRisk(driftResult, agentProfile, transaction) {
  let riskScore = driftResult.driftScore; // 0 - 100 base from drift
  const riskFactors = [];

  // 1. Agent trust penalty
  if (agentProfile) {
    if (agentProfile.trustScore < 50) {
      riskScore = Math.min(100, riskScore + 25);
      riskFactors.push({ factor: 'Degraded Agent Trust', impact: '+25 Risk', note: `Agent trust score is ${agentProfile.trustScore}/100` });
    } else if (agentProfile.trustScore < 75) {
      riskScore = Math.min(100, riskScore + 10);
      riskFactors.push({ factor: 'Moderate Agent Trust', impact: '+10 Risk', note: `Agent trust score is ${agentProfile.trustScore}/100` });
    }

    if (agentProfile.status === 'SUSPENDED') {
      riskScore = 100;
      riskFactors.push({ factor: 'Agent Suspended', impact: 'MAX RISK', note: 'Agent currently has an active suspension lockout' });
    }
  }

  // 2. High absolute transaction value
  if (transaction && transaction.amount > 100000) {
    riskScore = Math.min(100, riskScore + 15);
    riskFactors.push({ factor: 'High Value Threshold', impact: '+15 Risk', note: 'Transaction exceeds ₹100,000 threshold' });
  }

  // 3. Hidden recurring threat factor
  if (transaction && transaction.recurring) {
    riskFactors.push({ factor: 'Recurring Liability', impact: '+Critical', note: 'Ongoing automated recurring charges detected' });
  }

  let finalRiskLevel = 'LOW';
  if (riskScore >= 75) {
    finalRiskLevel = 'CRITICAL';
  } else if (riskScore >= 50) {
    finalRiskLevel = 'HIGH';
  } else if (riskScore >= 25) {
    finalRiskLevel = 'MEDIUM';
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel: finalRiskLevel,
    riskFactors,
    isSuspicious: riskScore >= 50,
    timestamp: new Date().toISOString()
  };
}
