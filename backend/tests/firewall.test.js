// tests/firewall.test.js - Comprehensive Automated Verification Test Suite
// Verifies all 9 core security and firewall scenarios for INTENTLOCK AI

import assert from 'assert';
import { extractIntentFromPrompt, buildIntentStructure } from '../src/engine/intentEngine.js';
import { passportManager } from '../src/engine/intentPassport.js';
import { firewallEngine } from '../src/engine/firewallEngine.js';
import { permissionEngine } from '../src/engine/permissionEngine.js';
import { SYNTHETIC_PRODUCTS, SYNTHETIC_ADDONS, SYNTHETIC_SUBSCRIPTIONS } from '../src/engine/syntheticData.js';

console.log(`
╔══════════════════════════════════════════════════════════════╗
║               INTENTLOCK AI TEST HARNESS                     ║
║         Automated Verification of 9 Core Scenarios           ║
╚══════════════════════════════════════════════════════════════╝
`);

let passedCount = 0;
let totalTests = 9;

function runTest(testNumber, name, fn) {
  try {
    process.stdout.write(`TEST ${testNumber}: ${name} ... `);
    fn();
    console.log(`\x1b[32mPASSED ✓\x1b[0m`);
    passedCount++;
  } catch (err) {
    console.log(`\x1b[31mFAILED ✗\x1b[0m`);
    console.error(`   Error: ${err.message}`);
  }
}

// Reset permission engine before running tests
permissionEngine.reactivateAgent();

// Base Test Intent: Laptop under ₹50,000, 1 qty, no add-ons or subscriptions
const baseIntent = buildIntentStructure(
  'Buy me a laptop under ₹50,000 with 16GB RAM and 512GB SSD. Do not add accessories or subscriptions.',
  {
    maxAmount: 50000,
    category: 'Laptop',
    quantity: 1,
    prohibitedAddons: ['accessories', 'subscriptions', 'warranty'],
    recurringPaymentAllowed: false,
    approvalRequiredAbove: 49000 // soft threshold
  }
);
const basePassport = passportManager.createPassport(baseIntent);

// TEST 1: Exact Match -> ALLOW
runTest(1, 'Exact match within limits -> ALLOW', () => {
  const transaction = {
    id: 'TX-TEST-001',
    agentId: 'agent-shopbot-01',
    amount: 47999,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'ALLOW', `Expected ALLOW but got ${result.decision}`);
  assert.strictEqual(result.driftScore <= 15, true, `Expected low drift <= 15, got ${result.driftScore}`);
});

// TEST 2: Small soft preference change -> ASK USER
runTest(2, 'Small soft preference change (near ceiling ₹49,499) -> ASK USER', () => {
  const transaction = {
    id: 'TX-TEST-002',
    agentId: 'agent-shopbot-01',
    amount: 49499, // exceeds soft approval threshold ₹49,000 but < ₹50,000 max
    product: 'Lenovo IdeaPad Slim 3',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'ASK_USER', `Expected ASK_USER but got ${result.decision}`);
  assert.strictEqual(result.requiresApproval, true, 'Expected requiresApproval to be true');
});

// TEST 3: Budget exceeded -> BLOCK
runTest(3, 'Budget exceeded (₹52,499 > ₹50,000) -> BLOCK', () => {
  const transaction = {
    id: 'TX-TEST-003',
    agentId: 'agent-shopbot-01',
    amount: 52499,
    product: 'HP Pavilion 15',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    merchant: 'CloudMart India'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'BLOCK', `Expected BLOCK but got ${result.decision}`);
  assert.ok(result.violations.some(v => v.type === 'PRICE_BUDGET_EXCEEDED'), 'Expected PRICE_BUDGET_EXCEEDED violation');
});

// TEST 4: Quantity increased -> BLOCK
runTest(4, 'Quantity increased (2 items requested vs 1 authorized) -> BLOCK', () => {
  const transaction = {
    id: 'TX-TEST-004',
    agentId: 'agent-shopbot-01',
    amount: 47999,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 2, // Intent authorized 1
    addons: [],
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'BLOCK', `Expected BLOCK but got ${result.decision}`);
  assert.ok(result.violations.some(v => v.type === 'QUANTITY_MISMATCH'), 'Expected QUANTITY_MISMATCH violation');
});

// TEST 5: Unauthorized subscription -> BLOCK
runTest(5, 'Unauthorized subscription injection (₹499/mo) -> BLOCK', () => {
  const transaction = {
    id: 'TX-TEST-005',
    agentId: 'agent-shopbot-01',
    amount: 48498,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: true, // Stealth recurring injection
    subscriptionPlan: SYNTHETIC_SUBSCRIPTIONS[0],
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'BLOCK', `Expected BLOCK but got ${result.decision}`);
  assert.ok(result.violations.some(v => v.type === 'UNAUTHORIZED_SUBSCRIPTION'), 'Expected UNAUTHORIZED_SUBSCRIPTION violation');
});

// TEST 6: Unauthorized add-on -> BLOCK
runTest(6, 'Unauthorized add-on (₹2,999 Extended Warranty) -> BLOCK', () => {
  const transaction = {
    id: 'TX-TEST-006',
    agentId: 'agent-shopbot-01',
    amount: 47999,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 1,
    addons: [SYNTHETIC_ADDONS[0]], // Warranty added
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'BLOCK', `Expected BLOCK but got ${result.decision}`);
  assert.ok(result.violations.some(v => v.type === 'UNAUTHORIZED_ADDON'), 'Expected UNAUTHORIZED_ADDON violation');
});

// TEST 7: Expired intent -> BLOCK
runTest(7, 'Expired intent passport -> BLOCK', () => {
  const transaction = {
    id: 'TX-TEST-007',
    agentId: 'agent-shopbot-01',
    amount: 47999,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    intentExpired: true, // Expired flag
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, transaction);
  assert.strictEqual(result.decision, 'BLOCK', `Expected BLOCK but got ${result.decision}`);
  assert.ok(result.violations.some(v => v.type === 'EXPIRED_AUTHORIZATION'), 'Expected EXPIRED_AUTHORIZATION violation');
});

// TEST 8: Repeated agent violations -> SUSPEND AGENT
runTest(8, 'Repeated agent violations -> Agent Trust degraded & SUSPENDED', () => {
  // We trigger additional violations to trip the 3-strike lockout
  permissionEngine.recordViolation('Violation 1');
  permissionEngine.recordViolation('Violation 2');
  const profile = permissionEngine.recordViolation('Violation 3');

  assert.strictEqual(profile.status, 'SUSPENDED', `Expected agent status SUSPENDED, got ${profile.status}`);
  assert.ok(profile.trustScore <= 40, `Expected trust score <= 40, got ${profile.trustScore}`);

  // Test that suspended agent is blocked from any transaction
  const validTx = {
    id: 'TX-TEST-008',
    agentId: 'agent-shopbot-01',
    amount: 47999,
    product: 'Dell Inspiron 15',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, validTx);
  assert.strictEqual(result.decision, 'BLOCK', 'Expected suspended agent transaction to be BLOCKED');
  assert.ok(result.primaryReason.includes('AGENT SUSPENDED'), 'Expected primaryReason to mention AGENT SUSPENDED');
});

// TEST 9: Valid transaction after correction & reactivation -> ALLOW
runTest(9, 'Valid transaction after correction and agent reactivation -> ALLOW', () => {
  // Reactivate agent
  const restoredProfile = permissionEngine.reactivateAgent();
  assert.strictEqual(restoredProfile.status, 'ACTIVE', 'Agent should be ACTIVE after reactivation');

  // Compliant clean alternative
  const compliantTx = {
    id: 'TX-TEST-009',
    agentId: 'agent-shopbot-01',
    amount: 48490, // Under ₹50k, safe match
    product: 'Acer Swift Go',
    category: 'Laptop',
    quantity: 1,
    addons: [],
    recurring: false,
    merchant: 'TechVault Hub'
  };

  const result = firewallEngine.evaluate(basePassport, compliantTx);
  assert.strictEqual(result.decision, 'ALLOW', `Expected ALLOW but got ${result.decision}`);
  assert.strictEqual(result.driftScore <= 15, true, `Expected low drift, got ${result.driftScore}`);
});

console.log(`\n--------------------------------------------------------------`);
console.log(`TEST SUMMARY: ${passedCount}/${totalTests} Scenarios Passed`);
if (passedCount === totalTests) {
  console.log(`\x1b[32mALL 9 FIREWALL VERIFICATION TESTS PASSED SUCCESSFULLY!\x1b[0m\n`);
  process.exit(0);
} else {
  console.log(`\x1b[31mSOME TESTS FAILED. PLEASE INSPECT LOGS ABOVE.\x1b[0m\n`);
  process.exit(1);
}
