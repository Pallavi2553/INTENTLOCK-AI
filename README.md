# INTENTLOCK AI
> **"The payment firewall for autonomous AI."**

[![Fintech Security](https://img.shields.io/badge/Security-Fintech_Firewall-06b6d4.svg)]()
[![Deterministic Rules](https://img.shields.io/badge/Decision_Engine-100%25_Deterministic-10b981.svg)]()
[![Demo Environment](https://img.shields.io/badge/Environment-Synthetic_Demo-f59e0b.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

---

> [!IMPORTANT]
> **SYNTHETIC DEMONSTRATION NOTICE**:  
> This is a hackathon/demo security prototype using **ONLY synthetic and simulated transaction data**. It **DOES NOT** connect to real banking accounts, process real credit cards, invoke UPI credentials, or execute live financial payments.

---

## 1. Problem: The Blindspot of Autonomous AI Commerce

Autonomous AI agents (shopping bots, travel concierges, procurement agents) are gaining the ability to search, compare, add items to carts, and execute financial checkouts.

However, existing payment security is designed around traditional fraud detection:
- It asks: *"Is the credit card stolen?"*
- It asks: *"Is the IP address anomalous?"*
- It asks: *"Is the merchant legitimate?"*

**This fails completely for Autonomous AI.**  
When an AI agent authorized to buy a laptop for ₹50,000 gets manipulated by a merchant checkout that inflates the price to ₹52,499, slips in a ₹2,999 warranty, and injects a ₹499/month recurring cloud backup, the bank sees a **100% legitimate, authenticated purchase** at an authorized retailer and approves it.

The question is **not**: *"Is this transaction fraudulent?"*  
The question is: **"Does the final payment still match what the human originally intended?"**

---

## 2. Solution: INTENTLOCK AI

**INTENTLOCK AI** acts as a zero-trust payment firewall stationed directly between autonomous AI agents, merchant checkout states, and the financial settlement gateway.

```
USER INTENT
    ↓
AI AGENT ACTIONS
    ↓
CHECKOUT STATE
    ↓
INTENT DRIFT ENGINE
    ↓
PAYMENT FIREWALL
    ↓
┌───────────────┬───────────────┬───────────────┐
│               │               │
ALLOW          ASK USER         BLOCK
│               │               │
▼               ▼               ▼
Safe Payment    Human Approval   Payment Prevented
                Required         & Safe Recovery
```

The system continuously evaluates **INTENT DRIFT** before money is allowed to move.

---

## 3. What is "Intent Drift"?

**Intent Drift** is the delta between what the human authorized in plain language and the exact financial debit payload presented at final checkout.

### Transparent Drift Scoring System (0–100 Normalized)
- **Price Violation**: Base $+30$ points plus scaled excess percentage (up to $+45$).
- **Quantity Violation**: $+20$ points (e.g., cart quantity doubles without authorization).
- **Unauthorized Add-on**: $+20$ points (e.g., extended warranty, accessories, express packaging).
- **Recurring Subscription Injection**: $+25$ points (e.g., sneaky recurrent monthly charges).
- **Category Mismatch**: $+30$ points (e.g., agent swaps requested laptop for a smart watch).
- **Unverified Merchant**: $+15$ points (e.g., transaction routed through non-whitelisted store).
- **Expired Authorization**: $+35$ points (e.g., transaction attempted after 30-minute time window).

### Interpretation Tiers
| Drift Score | Risk Classification | Action Triggered |
| :--- | :--- | :--- |
| **0 – 15%** | `SAFE` | **ALLOW**: Safe autonomous settlement |
| **16 – 35%** | `LOW DRIFT` | **ASK USER**: Soft preference shift or near budget ceiling |
| **36 – 60%** | `MEDIUM DRIFT` | **BLOCK**: Unauthorized add-ons or minor budget breaches |
| **61 – 80%** | `HIGH DRIFT` | **BLOCK**: Direct budget violation or recurring payment |
| **81 – 100%** | `CRITICAL DRIFT` | **BLOCK**: Combined manipulation & agent trust degradation |

---

## 4. Architecture: Decoupled Dual-Layer Security

INTENTLOCK enforces strict separation between probabilistic language models and deterministic payment enforcement:

```
[ PROBABILISTIC LLM LAYER ]
  • Natural Language Intent Extraction (User Prompt → Structured Constraints)
  • Autonomous Marketplace Semantic Search & Catalog Matching
  • Human-Readable Threat & Decision Explanations
           │
           │ (Strict Non-Authority: LLM NEVER touches funds)
           ▼
[ DETERMINISTIC SAFETY & RULE LAYER ]
  • Intent Passport Issuance (Cryptographically signed bounds & 30-min window)
  • Agent Permission Passport & Capability Masks
  • Mathematical Intent Drift Engine (Transparent 0–100 scoring)
  • Hard Spending Limits (amount <= authorizedLimit)
  • Tri-State Payment Firewall (ALLOW | ASK USER | BLOCK)
  • Counterfactual Threat & Recovery Simulator
  • Immutable Audit Ledger (Forensic SHA-256 event trail)
```

> **Core Principle**:  
> **LLM** = Understands and explains intent.  
> **RULE ENGINE** = Decides whether payment is allowed.  
> *An LLM can never override a deterministic spending limit.*

---

## 5. Core Features

1. **Natural Language Intent**: Freeform text prompt parser converting human intent into structured constraints (max amount, quantity, prohibited add-ons, excluded recurring charges).
2. **Intent Passport**: Tamper-resistant credential (`INTENT-2026-XXX`) with 30-minute time validity, hard spending ceiling, and SHA-256 signature simulation.
3. **Autonomous Agent Simulator**: Simulates ShoppingBot executing search, compare, select, add-to-cart, and checkout actions against a synthetic catalog.
4. **Agent Permissions & Trust Governance**: Granular permission matrix, trust score ($92 \rightarrow 78 \rightarrow 61 \rightarrow 35$), and automatic suspension lockout after 3 strikes.
5. **Live 7-Stage Pipeline**: Visual animated state transitions:  
   `USER → INTENT → AI AGENT → MERCHANT → CHECKOUT → FIREWALL → PAYMENT`.
6. **Intent vs. Transaction Comparator**: Central side-by-side split screen showing User Intent on the left, Current Checkout on the right, and the Drift Engine dial in the center.
7. **Human Approval Gateway**: Interactive modal with `[Approve (One-Time Override)]`, `[Find Alternative]`, and `[Cancel]` for soft drifts.
8. **Chaos Mode (Intent Attack Lab)**: 8 one-click attack vectors:
   - Price Drift
   - Quantity Drift
   - Unauthorized Add-on
   - Subscription Injection
   - Product Swap
   - Merchant Swap
   - Combined Checkout Manipulation
   - Expired Authorization
9. **Counterfactual Simulator ("What Would Have Happened?")**: Shows avoided financial leakage (e.g. ₹5,498 direct loss $+$ ₹5,988/year subscription) alongside autonomous safe recovery to compliant options (e.g. ₹48,490 with 97% intent match).
10. **Immutable Audit Ledger**: Forensic compliance record with timestamps, intent IDs, agent IDs, violation details, and exportable JSON.
11. **5-Minute Judge Demo Hero Flow**: One-click guided presentation walking judges through Intent Creation $\rightarrow$ Initial Match $\rightarrow$ Chaos Manipulation $\rightarrow$ Firewall Block $\rightarrow$ Autonomous Safe Recovery.

---

## 6. Project Structure

```
my pr/
├── backend/
│   ├── package.json
│   ├── server.js                        # Express server entrypoint (port 5001)
│   ├── src/
│   │   ├── engine/
│   │   │   ├── syntheticData.js         # Synthetic products, merchants, add-ons, subscriptions
│   │   │   ├── intentEngine.js          # NLP constraint extractor & regex engine
│   │   │   ├── intentPassport.js        # Passport issuance & signature verification
│   │   │   ├── agentEngine.js           # Autonomous shopping bot simulator & action timeline
│   │   │   ├── driftEngine.js           # Transparent 0-100 Intent Drift score calculator
│   │   │   ├── permissionEngine.js      # Agent capabilities, caps, trust score & suspension
│   │   │   ├── riskEngine.js            # Multi-factor risk aggregator
│   │   │   ├── firewallEngine.js        # Deterministic tri-state firewall (ALLOW | ASK | BLOCK)
│   │   │   ├── counterfactualEngine.js  # "What would have happened?" threat & recovery simulator
│   │   │   └── auditEngine.js           # Append-only immutable audit ledger
│   │   └── routes/
│   │       └── api.js                   # REST API routes
│   └── tests/
│       └── firewall.test.js             # Automated 9-scenario verification test suite
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js                   # Vite config with backend proxy
│   ├── index.html                       # HTML entrypoint with fonts and favicon
│   └── src/
│       ├── main.jsx                     # React root mount
│       ├── App.jsx                      # Main app controller and navigation
│       ├── index.css                    # Fintech dark cyber design system with glassmorphism
│       ├── api/
│       │   └── client.js                # Typed API client connecting to backend
│       └── components/
│           ├── Header.jsx               # Navigation tabs, trust badge, Judge Demo button
│           ├── DashboardView.jsx        # Metrics cards, hero, live state, audit preview
│           ├── CreateIntentView.jsx     # Natural language input & structured constraint cards
│           ├── IntentPassportView.jsx   # Visual credential badge with time validity
│           ├── AgentPermissionsView.jsx # Capabilities, caps, trust score meter & lockout
│           ├── LiveTransactionView.jsx  # 7-stage animated pipeline & event timeline
│           ├── FirewallComparatorView.jsx # Left-Center-Right comparator & decision banner
│           ├── ApprovalModal.jsx        # Human approval screen for soft drifts
│           ├── CounterfactualView.jsx   # Threat analysis vs. autonomous recovery
│           ├── ChaosModeView.jsx        # 8 Chaos attack vector buttons
│           ├── AuditLogView.jsx         # Searchable audit table with JSON export
│           ├── ArchitectureView.jsx     # Technical dual-layer explanation
│           └── JudgeDemoModal.jsx       # 5-Minute Judge Demo automated walkthrough
│
├── package.json                         # Unified root scripts
└── README.md                            # Comprehensive documentation
```

---

## 7. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, uptime, and mode |
| `GET` | `/api/dashboard` | Top-level protected metrics, trust scores, and prevented spend |
| `POST` | `/api/intent/extract` | Parses raw natural language into structured constraints |
| `POST` | `/api/intent/create` | Issues an Intent Passport and initializes agent task |
| `GET` | `/api/intent/active` | Retrieves current runtime intent, transaction, and firewall state |
| `GET` | `/api/intent/:id` | Looks up a specific Intent Passport by ID |
| `GET` | `/api/agent/permissions` | Returns agent capability masks, spending limits, and trust score |
| `PUT` | `/api/agent/permissions` | Updates agent permission settings |
| `POST` | `/api/agent/reactivate` | Restores a suspended agent after lockout review |
| `POST` | `/api/agent/action` | Autonomous agent searches, selects, and stages checkout item |
| `POST` | `/api/firewall/check` | Runs deterministic intent drift and evaluates firewall verdict |
| `POST` | `/api/chaos/run` | Injects one of 8 chaos vectors and evaluates immediate firewall response |
| `POST` | `/api/approval/respond` | Processes user decision on soft drifts (`APPROVE`, `FIND_ALTERNATIVE`, `CANCEL`) |
| `GET` | `/api/audit` | Retrieves append-only immutable audit trail |
| `POST` | `/api/demo/judge-flow` | Executes full 5-minute Judge Demo scenario end-to-end |
| `GET` | `/api/marketplace/products` | Lists synthetic marketplace inventory and chaos presets |

---

## 8. Setup & Running Instructions

### Prerequisites
- Node.js (v18+ recommended, tested on v22.18.0)
- npm (v9+)

### Installation
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5001
```

### Running Frontend Development Server
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 9. Automated Verification Test Suite

Run the automated test suite verifying all 9 core security scenarios:
```bash
cd backend
npm test
```

### Test Coverage Results
```
╔══════════════════════════════════════════════════════════════╗
║               INTENTLOCK AI TEST HARNESS                     ║
║         Automated Verification of 9 Core Scenarios           ║
╚══════════════════════════════════════════════════════════════╝

TEST 1: Exact match within limits -> ALLOW ... PASSED ✓
TEST 2: Small soft preference change (near ceiling ₹49,499) -> ASK USER ... PASSED ✓
TEST 3: Budget exceeded (₹52,499 > ₹50,000) -> BLOCK ... PASSED ✓
TEST 4: Quantity increased (2 items requested vs 1 authorized) -> BLOCK ... PASSED ✓
TEST 5: Unauthorized subscription injection (₹499/mo) -> BLOCK ... PASSED ✓
TEST 6: Unauthorized add-on (₹2,999 Extended Warranty) -> BLOCK ... PASSED ✓
TEST 7: Expired intent passport -> BLOCK ... PASSED ✓
TEST 8: Repeated agent violations -> Agent Trust degraded & SUSPENDED ... PASSED ✓
TEST 9: Valid transaction after correction and agent reactivation -> ALLOW ... PASSED ✓

--------------------------------------------------------------
TEST SUMMARY: 9/9 Scenarios Passed
ALL 9 FIREWALL VERIFICATION TESTS PASSED SUCCESSFULLY!
```

---

## 10. Future Scope & Production Roadmap
- **Real MPC (Multi-Party Computation) Key Vault**: Ephemeral single-use virtual cards created strictly upon firewall `ALLOW` verdict.
- **W3C Web Payments Standard Extension**: Standardized Intent Passport header injected during browser agent checkouts.
- **Federated Merchant Whitelisting**: Decentralized consensus on merchant compliance and checkout tamper history.
