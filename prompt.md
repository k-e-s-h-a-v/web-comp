🍽️ VUE + WEB COMPONENT DEMO — CODING AGENT PROMPT
ROLE

You are a senior frontend engineer building a conference demo app for VueVerse Connect 2026.

The demo visually explains Web Components as a boundary using a restaurant metaphor with:

real photos (kitchen, table, cashier)

a moving waiter animation

a Web Component representing a Customer Table

Vue acting as the Restaurant (host app)

This demo must be:

visually intuitive

extremely stable for live demos

easy to explain while animations are running

CORE CONCEPT (DO NOT DEVIATE)

The Restaurant (Vue) owns state and rules.
The Customer (Web Component) expresses intent.
The Waiter visualizes communication across the boundary.

The waiter is the only thing that moves.

No diagrams.
No arrows.
No abstract animations.

TECH STACK (MANDATORY)

Vite

Vue 3 (Composition API, <script setup>)

Native Web Components (Custom Elements + Shadow DOM)

CSS transitions / transforms only

NO animation libraries

NO UI frameworks

VISUAL SCENE REQUIREMENTS (VERY IMPORTANT)
Backgrounds (static images)

Use real photos (or placeholders) for:

🧑‍🍳 Kitchen (left)

🪑 Table (center)

💳 Cashier (right)

Each section must:

have a subtle dark overlay

be clearly labeled

“Restaurant Kitchen (Vue)”

“Customer Table (Web Component)”

“Cashier (Vue)”

Waiter (animated element)

Single waiter image or emoji

Absolutely positioned

Moves via transform: translate(x, y)

Predefined anchor positions:

const TABLE_POS
const KITCHEN_POS
const CASHIER_POS


Movement duration: 600–800ms

Always deterministic (no randomness)

The waiter visually represents:

events

async delay

prop updates

ARCHITECTURE
Vue App (Restaurant – Host)

Responsibilities:

owns menu data

owns prices

owns order lifecycle

owns billing

controls waiter movement

passes props to Web Component

Vue must not render inside the Web Component.

Web Component (Customer Table)

Responsibilities:

renders table UI

requests menu

selects items

places order

requests bill

pays bill

Constraints:

NO Vue imports

NO framework assumptions

Communicates ONLY via:

CustomEvents (upward)

properties / attributes (downward)

The Web Component must work if dropped into plain HTML.

INTERACTION FLOW (EXACT ORDER)
1️⃣ Customer requests menu

Button: “Request Menu”

Web Component emits:

request-menu


Vue:

moves waiter: TABLE → KITCHEN

simulates async delay (500ms)

sends menu back as prop

Waiter returns: KITCHEN → TABLE

Menu appears as checkbox list

🎯 Teaching goal: Intent goes up, data comes down

2️⃣ Customer places order

User selects menu items

Clicks “Place Order”

Web Component emits:

place-order { itemIds }


Vue:

moves waiter: TABLE → KITCHEN

processes order

sends order confirmation prop

Waiter returns

Table UI locks selections

🎯 Teaching goal: Customer never talks to kitchen directly

3️⃣ Customer requests bill

Button: “Request Bill”

Event:

request-bill


Vue:

moves waiter: TABLE → CASHIER

calculates bill (prices owned by Vue)

Waiter returns with bill data

🎯 Teaching goal: Business logic lives in host

4️⃣ Customer pays bill

Button: “Pay Bill”

Event:

pay-bill


Vue:

moves waiter: TABLE → CASHIER

confirms payment

Success animation

Table resets

🎯 Teaching goal: Workflow completes without tight coupling

ANIMATION RULES (CRITICAL FOR LIVE DEMO)

Only ONE animation at a time

Disable buttons during waiter movement

All transitions must:

finish cleanly

reset reliably

No chained promises without guards

If the presenter clicks repeatedly, nothing breaks.

FILE STRUCTURE
src/
  main.js
  App.vue              // Restaurant host
  assets/
    kitchen.jpg
    table.jpg
    cashier.jpg
    waiter.png
  web-components/
    CustomerTable.js   // Web Component

WEB COMPONENT API (PUBLIC CONTRACT)
<customer-table
  .menu="menu"
  .orderStatus="orderStatus"
  .bill="bill"
></customer-table>


Emitted events:

request-menu

place-order

request-bill

pay-bill

CODE STYLE REQUIREMENTS

Readable > clever

Minimal reactivity

Explicit state transitions

Comments explain why, not syntax

Variables named for teaching clarity

NON-GOALS (ABSOLUTELY DO NOT DO)

No counters

No dummy diagrams

No global state libs

No router

No micro-frontend tooling

No framework comparisons

This is a teaching demo, not production code.

SUCCESS CRITERIA

This demo is successful if:

Audience understands boundary without explanation

Presenter can narrate while animations run

Web Component feels independent

Vue feels authoritative

The metaphor explains itself

FINAL INSTRUCTION

Optimize for:

Clarity on stage, not cleverness in code

If something is cool but risky — remove it.