// agentEngine.js - Autonomous Shopping Agent Simulator
// INTENTLOCK AI: Simulates agent decision pipeline against synthetic marketplace

import { SYNTHETIC_PRODUCTS } from './syntheticData.js';

export class AgentEngine {
  constructor() {
    this.currentState = 'IDLE'; // IDLE | SEARCHING | COMPARING | SELECTING | ADDING_TO_CART | CHECKOUT | COMPLETED
    this.timeline = [];
    this.currentTransaction = null;
  }

  addLog(stage, message, metadata = {}) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const entry = {
      timestamp,
      stage,
      message,
      metadata,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    this.timeline.push(entry);
    return entry;
  }

  getTimeline() {
    return this.timeline;
  }

  clearTimeline() {
    this.timeline = [];
  }

  // Simulate agent autonomously locating products for an intent
  executeTask(intent, options = {}) {
    this.clearTimeline();
    this.currentState = 'SEARCHING';
    this.addLog('USER_INTENT', `User created intent: "${intent.userRequest || intent.category}" with max ₹${intent.maxAmount.toLocaleString()}`, { intentId: intent.id });

    // Step 1: Search products matching category
    this.addLog('SEARCH', `Agent initiated semantic catalog search for: "${intent.category}"`);
    const candidates = SYNTHETIC_PRODUCTS.filter(p => 
      p.category.toLowerCase() === (intent.category || '').toLowerCase()
    );

    if (candidates.length === 0) {
      this.currentState = 'IDLE';
      this.addLog('ERROR', `No synthetic marketplace inventory found for ${intent.category}`);
      return { success: false, reason: 'No matching products' };
    }

    // Step 2: Compare products
    this.currentState = 'COMPARING';
    this.addLog('COMPARE', `Comparing ${candidates.length} matching candidate items against constraints`, { candidates: candidates.map(c => c.name) });

    // Step 3: Select product (Default: Best matching within budget, e.g. Dell Laptop ₹47,999 or flight ₹7,450)
    this.currentState = 'SELECTING';
    const selected = options.forceProduct || candidates.find(c => c.price <= intent.maxAmount) || candidates[0];
    this.addLog('SELECT', `Agent selected optimal match: ${selected.name} at ₹${selected.price.toLocaleString()}`, { selected });

    // Step 4: Add to Cart
    this.currentState = 'ADDING_TO_CART';
    this.addLog('CART', `Added 1x ${selected.name} to shopping cart from merchant "${selected.merchant}"`);

    // Step 5: Checkout initialization
    this.currentState = 'CHECKOUT';
    this.addLog('CHECKOUT', `Agent navigating to merchant checkout. Base transaction total: ₹${selected.price.toLocaleString()}`);

    const transaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      intentId: intent.id,
      agentId: 'agent-shopbot-01',
      merchant: selected.merchant,
      category: selected.category,
      product: selected.name,
      itemPrice: selected.price,
      quantity: 1,
      addons: [],
      recurring: false,
      subscriptionPlan: null,
      amount: selected.price,
      currency: 'INR',
      status: 'PENDING_FIREWALL',
      attributes: selected.attributes || {},
      createdAt: new Date().toISOString()
    };

    this.currentTransaction = transaction;
    return {
      success: true,
      transaction,
      timeline: this.timeline
    };
  }
}

export const agentEngine = new AgentEngine();
