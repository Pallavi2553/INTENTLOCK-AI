// syntheticData.js - Synthetic Marketplace, Merchants, Add-ons & Catalog
// INTENTLOCK AI: DEMO & SYNTHETIC ENVIRONMENT

export const SYNTHETIC_PRODUCTS = [
  {
    id: 'prod-lap-001',
    name: 'Dell Inspiron 15 (16GB RAM, 512GB SSD)',
    category: 'Laptop',
    price: 47999,
    currency: 'INR',
    merchant: 'TechVault Hub',
    attributes: {
      ram: '16GB',
      storage: '512GB SSD',
      processor: 'Intel Core i5',
      screen: '15.6 inch'
    },
    inStock: true,
    rating: 4.6
  },
  {
    id: 'prod-lap-002',
    name: 'Lenovo IdeaPad Slim 3 (16GB RAM, 1TB SSD)',
    category: 'Laptop',
    price: 49499,
    currency: 'INR',
    merchant: 'TechVault Hub',
    attributes: {
      ram: '16GB',
      storage: '1TB SSD',
      processor: 'AMD Ryzen 5',
      screen: '15.6 inch'
    },
    inStock: true,
    rating: 4.5
  },
  {
    id: 'prod-lap-003',
    name: 'HP Pavilion 15 (32GB RAM, 1TB SSD)',
    category: 'Laptop',
    price: 52999,
    currency: 'INR',
    merchant: 'CloudMart India',
    attributes: {
      ram: '32GB',
      storage: '1TB SSD',
      processor: 'Intel Core i7',
      screen: '15.6 inch'
    },
    inStock: true,
    rating: 4.7
  },
  {
    id: 'prod-lap-alt',
    name: 'Acer Swift Go (16GB RAM, 512GB SSD) - Safe Counterfactual Alternative',
    category: 'Laptop',
    price: 48490,
    currency: 'INR',
    merchant: 'TechVault Hub',
    attributes: {
      ram: '16GB',
      storage: '512GB SSD',
      processor: 'Intel Core i5',
      screen: '14 inch OLED'
    },
    inStock: true,
    rating: 4.6
  },
  {
    id: 'prod-head-001',
    name: 'Sony WH-CH520 Wireless Bluetooth Headphones',
    category: 'Headphones',
    price: 4799,
    currency: 'INR',
    merchant: 'GadgetBazaar',
    attributes: {
      wireless: true,
      batteryLife: '50h',
      noiseCanceling: false
    },
    inStock: true,
    rating: 4.4
  },
  {
    id: 'prod-head-002',
    name: 'JBL Tune 760NC Wireless ANC Headphones',
    category: 'Headphones',
    price: 5499,
    currency: 'INR',
    merchant: 'GadgetBazaar',
    attributes: {
      wireless: true,
      batteryLife: '35h',
      noiseCanceling: true
    },
    inStock: true,
    rating: 4.3
  },
  {
    id: 'prod-flt-001',
    name: 'IndiGo Flight 6E-204 (BLR → DEL) Economy',
    category: 'Flight',
    price: 7450,
    currency: 'INR',
    merchant: 'JetAirways Direct',
    attributes: {
      origin: 'Bengaluru',
      destination: 'Delhi',
      class: 'Economy',
      passengers: 1,
      departure: '06:30 AM Tomorrow'
    },
    inStock: true,
    rating: 4.5
  },
  {
    id: 'prod-flt-002',
    name: 'Air India AI-804 (BLR → DEL) Economy',
    category: 'Flight',
    price: 7850,
    currency: 'INR',
    merchant: 'JetAirways Direct',
    attributes: {
      origin: 'Bengaluru',
      destination: 'Delhi',
      class: 'Economy',
      passengers: 1,
      departure: '10:15 AM Tomorrow'
    },
    inStock: true,
    rating: 4.2
  },
  {
    id: 'prod-flt-003',
    name: 'Vistara UK-812 (BLR → DEL) Premium Economy',
    category: 'Flight',
    price: 8450,
    currency: 'INR',
    merchant: 'JetAirways Direct',
    attributes: {
      origin: 'Bengaluru',
      destination: 'Delhi',
      class: 'Premium Economy',
      passengers: 1,
      departure: '05:45 PM Tomorrow'
    },
    inStock: true,
    rating: 4.7
  }
];

export const SYNTHETIC_ADDONS = [
  { id: 'addon-warranty', name: '2-Year Extended Hardware Protection', price: 2999, category: 'warranty' },
  { id: 'addon-accidental', name: 'Accidental Spill & Damage Coverage', price: 2499, category: 'warranty' },
  { id: 'addon-sleeve', name: 'Premium Neoprene Laptop Sleeve & Tech Kit', price: 1299, category: 'accessories' },
  { id: 'addon-express', name: 'Guaranteed 2-Hour Express Delivery', price: 499, category: 'shipping' }
];

export const SYNTHETIC_SUBSCRIPTIONS = [
  { id: 'sub-cloud-01', name: '2TB Cloud Backup & Device Sync', pricePerMonth: 499, annualCost: 5988, billingCycle: 'monthly' },
  { id: 'sub-support-01', name: '24/7 AI Concierge & Priority Tech Support', pricePerMonth: 299, annualCost: 3588, billingCycle: 'monthly' },
  { id: 'sub-security-01', name: 'Antivirus & Firewall Security Suite', pricePerMonth: 199, annualCost: 2388, billingCycle: 'monthly' }
];

export const SAMPLE_INTENTS = [
  {
    id: 'sample-01',
    title: 'Budget Work Laptop',
    prompt: 'Buy me a laptop under ₹50,000 with at least 16GB RAM and 512GB SSD. Do not add accessories or subscriptions.',
    category: 'Laptop',
    maxAmount: 50000,
    quantity: 1,
    preferredAttributes: ['16GB RAM', '512GB SSD'],
    prohibitedAddons: ['accessories', 'subscriptions', 'warranty'],
    recurringPaymentAllowed: false,
    approvalRequiredAbove: 49500
  },
  {
    id: 'sample-02',
    title: 'Emergency Flight to Delhi',
    prompt: 'Book the cheapest flight to Delhi tomorrow under ₹8,000. One passenger. Economy.',
    category: 'Flight',
    destination: 'Delhi',
    maxAmount: 8000,
    quantity: 1,
    preferredAttributes: ['Economy', 'Delhi'],
    prohibitedAddons: ['travel insurance', 'meal upgrade', 'subscriptions'],
    recurringPaymentAllowed: false,
    approvalRequiredAbove: 7900
  },
  {
    id: 'sample-03',
    title: 'Wireless Audio Gear',
    prompt: 'Buy wireless headphones below ₹5,000. One item only. No recurring plans.',
    category: 'Headphones',
    maxAmount: 5000,
    quantity: 1,
    preferredAttributes: ['wireless'],
    prohibitedAddons: ['extended warranty', 'subscriptions'],
    recurringPaymentAllowed: false,
    approvalRequiredAbove: 4800
  }
];

export const CHAOS_ATTACK_PRESETS = {
  PRICE_DRIFT: {
    name: 'Price Drift',
    description: 'Merchant sneaks in an elevated price above approved budget (+₹2,499)',
    apply: (tx) => ({
      ...tx,
      amount: tx.amount + 2499,
      itemPrice: (tx.itemPrice || tx.amount) + 2499,
      attackType: 'PRICE_DRIFT'
    })
  },
  QUANTITY_DRIFT: {
    name: 'Quantity Drift',
    description: 'Cart quantity automatically doubles from 1 to 2 items without consent',
    apply: (tx) => ({
      ...tx,
      quantity: 2,
      amount: tx.amount * 2,
      attackType: 'QUANTITY_DRIFT'
    })
  },
  UNAUTHORIZED_ADDON: {
    name: 'Unauthorized Add-on',
    description: 'Merchant slips in ₹2,999 Extended Warranty package at checkout',
    apply: (tx) => ({
      ...tx,
      addons: [...(tx.addons || []), SYNTHETIC_ADDONS[0]],
      amount: tx.amount + SYNTHETIC_ADDONS[0].price,
      attackType: 'UNAUTHORIZED_ADDON'
    })
  },
  SUBSCRIPTION_INJECTION: {
    name: 'Subscription Injection',
    description: 'Stealth recurrent cloud subscription (₹499/mo = ₹5,988/year) injected',
    apply: (tx) => ({
      ...tx,
      recurring: true,
      subscriptionPlan: SYNTHETIC_SUBSCRIPTIONS[0],
      amount: tx.amount + SYNTHETIC_SUBSCRIPTIONS[0].pricePerMonth,
      attackType: 'SUBSCRIPTION_INJECTION'
    })
  },
  PRODUCT_SWAP: {
    name: 'Product Swap',
    description: 'Agent selects an inferior or unauthorized category item (e.g. Smart Watch instead of Laptop)',
    apply: (tx) => ({
      ...tx,
      product: 'Smart Watch Gen 3 (Unauthorized Category Swap)',
      category: 'Wearables',
      amount: 42000,
      attackType: 'PRODUCT_SWAP'
    })
  },
  MERCHANT_SWAP: {
    name: 'Merchant Swap',
    description: 'Routing payment through an unverified, unapproved third-party merchant',
    apply: (tx) => ({
      ...tx,
      merchant: 'ShadyStore247-Express-Global',
      attackType: 'MERCHANT_SWAP'
    })
  },
  CHECKOUT_MANIPULATION: {
    name: 'Checkout Price Manipulation (Combined Attack)',
    description: 'Hero Judge Scenario: Price jump to ₹52,499 + ₹2,999 warranty + ₹499/mo subscription',
    apply: (tx) => ({
      ...tx,
      amount: 52499,
      addons: [SYNTHETIC_ADDONS[0]],
      recurring: true,
      subscriptionPlan: SYNTHETIC_SUBSCRIPTIONS[0],
      attackType: 'CHECKOUT_MANIPULATION'
    })
  },
  EXPIRED_AUTHORIZATION: {
    name: 'Expired Authorization',
    description: 'Attempting payment after the 30-minute Intent Passport has expired',
    apply: (tx) => ({
      ...tx,
      intentExpired: true,
      attackType: 'EXPIRED_AUTHORIZATION'
    })
  }
};
