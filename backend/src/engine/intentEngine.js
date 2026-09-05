// intentEngine.js - Natural Language Constraint Extraction Engine
// INTENTLOCK AI: Deterministic NLP Extractor with optional LLM enhancement

export function extractIntentFromPrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string') {
    throw new Error('User prompt is required for intent extraction');
  }

  const prompt = userPrompt.trim();
  const lower = prompt.toLowerCase();

  // 1. Category extraction
  let category = 'General';
  let product = 'Item';
  if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('macbook') || lower.includes('thinkpad')) {
    category = 'Laptop';
    product = 'Laptop';
  } else if (lower.includes('flight') || lower.includes('ticket') || lower.includes('airline') || lower.includes('fly')) {
    category = 'Flight';
    product = 'Flight Ticket';
  } else if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('earbuds') || lower.includes('audio')) {
    category = 'Headphones';
    product = 'Wireless Headphones';
  } else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone')) {
    category = 'Smartphone';
    product = 'Smartphone';
  }

  // 2. Maximum amount extraction
  // Matches ₹50,000, Rs 50000, 50,000, under 50000, below 5000, max 8000
  let maxAmount = 50000; // default fallback
  const currencyMatch = prompt.match(/(?:₹|rs\.?|inr|\$)?\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{2,7})(?:\s*(?:inr|rs|rupees))?/i);
  const underMatch = prompt.match(/(?:under|below|less than|max|maximum|budget(?: of)?)\s*(?:₹|rs\.?|inr|\$)?\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{2,7})/i);

  if (underMatch && underMatch[1]) {
    maxAmount = parseInt(underMatch[1].replace(/,/g, ''), 10);
  } else if (currencyMatch && currencyMatch[1]) {
    maxAmount = parseInt(currencyMatch[1].replace(/,/g, ''), 10);
  }

  // 3. Destination extraction (for flights / travel)
  let destination = null;
  const destMatch = prompt.match(/(?:to|visit|fly to|reach)\s+([A-Za-z]+)/i);
  if (destMatch && destMatch[1] && !['the', 'buy', 'a', 'an', 'tomorrow', 'me'].includes(destMatch[1].toLowerCase())) {
    destination = destMatch[1];
  }

  // 4. Quantity extraction
  let quantity = 1;
  const qtyMatch = prompt.match(/(\d+)\s*(?:passenger|item|qty|piece|laptop|ticket|headphone)s?/i);
  const wordQtyMatch = prompt.match(/(one|two|three|single)\s*(?:passenger|item|item only|laptop|ticket)/i);
  if (qtyMatch && qtyMatch[1]) {
    quantity = parseInt(qtyMatch[1], 10);
  } else if (wordQtyMatch && wordQtyMatch[1]) {
    const wordMap = { one: 1, single: 1, two: 2, three: 3 };
    quantity = wordMap[wordQtyMatch[1].toLowerCase()] || 1;
  }

  // 5. Preferred attributes extraction
  const preferredAttributes = [];
  if (lower.includes('16gb') || lower.includes('16 gb')) preferredAttributes.push('16GB RAM');
  if (lower.includes('32gb') || lower.includes('32 gb')) preferredAttributes.push('32GB RAM');
  if (lower.includes('8gb') || lower.includes('8 gb')) preferredAttributes.push('8GB RAM');
  if (lower.includes('512gb') || lower.includes('512 gb')) preferredAttributes.push('512GB SSD');
  if (lower.includes('1tb') || lower.includes('1 tb')) preferredAttributes.push('1TB SSD');
  if (lower.includes('wireless') || lower.includes('bluetooth')) preferredAttributes.push('Wireless');
  if (lower.includes('economy')) preferredAttributes.push('Economy');
  if (lower.includes('cheapest')) preferredAttributes.push('Lowest Price');

  // 6. Prohibited Add-ons & Subscriptions
  const prohibitedAddons = [];
  if (lower.includes('no accessories') || lower.includes('not add accessories') || lower.includes('without accessories')) {
    prohibitedAddons.push('accessories');
  }
  if (lower.includes('no subscription') || lower.includes('not add subscription') || lower.includes('no recurring') || lower.includes('no recurring plans')) {
    prohibitedAddons.push('subscriptions');
  }
  if (lower.includes('no warranty') || lower.includes('no extended warranty')) {
    prohibitedAddons.push('warranty');
  }
  if (lower.includes('no insurance') || lower.includes('no travel insurance')) {
    prohibitedAddons.push('travel insurance');
  }

  // If user says "do not add accessories or subscriptions", catch both
  if (lower.includes('accessories') && (lower.includes('not') || lower.includes('no ') || lower.includes('without'))) {
    if (!prohibitedAddons.includes('accessories')) prohibitedAddons.push('accessories');
  }
  if (lower.includes('subscriptions') && (lower.includes('not') || lower.includes('no ') || lower.includes('without'))) {
    if (!prohibitedAddons.includes('subscriptions')) prohibitedAddons.push('subscriptions');
  }

  // 7. Recurring payment authority
  const recurringPaymentAllowed = lower.includes('allow recurring') || lower.includes('recurring allowed');

  // 8. Soft approval threshold (triggers ASK USER if price is slightly high but < 105% of budget)
  const approvalRequiredAbove = Math.round(maxAmount * 0.98);

  return {
    rawPrompt: prompt,
    category,
    product,
    destination,
    maxAmount,
    minAmount: 0,
    quantity,
    preferredAttributes,
    prohibitedAddons: prohibitedAddons.length > 0 ? prohibitedAddons : ['accessories', 'subscriptions'],
    recurringPaymentAllowed,
    merchantRestrictions: ['Verified Merchants Only'],
    approvalRequiredAbove,
    hardSpendingLimit: maxAmount,
    autoPaymentAllowed: true,
    expirationMinutes: 30
  };
}

export function buildIntentStructure(prompt, extractedOverrides = {}) {
  const base = extractIntentFromPrompt(prompt);
  const merged = { ...base, ...extractedOverrides };
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (merged.expirationMinutes || 30) * 60 * 1000);

  return {
    id: `INTENT-${now.getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
    userRequest: merged.rawPrompt,
    owner: 'Demo User (Fintech Security Lab)',
    category: merged.category,
    product: merged.product,
    destination: merged.destination,
    maxAmount: merged.maxAmount,
    minAmount: merged.minAmount || 0,
    quantity: merged.quantity || 1,
    preferredAttributes: merged.preferredAttributes || [],
    prohibitedAddons: merged.prohibitedAddons || ['accessories', 'subscriptions'],
    recurringPaymentAllowed: Boolean(merged.recurringPaymentAllowed),
    merchantRestrictions: merged.merchantRestrictions || ['Verified Merchants Only'],
    approvalRequiredAbove: merged.approvalRequiredAbove || merged.maxAmount,
    hardSpendingLimit: merged.maxAmount,
    autoPaymentAllowed: Boolean(merged.autoPaymentAllowed),
    status: 'ACTIVE',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}
