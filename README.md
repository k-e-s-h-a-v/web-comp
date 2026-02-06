# 🍽️ VueConf 2026 - Web Components Demo

A conference demo application that visually explains Web Components as a boundary using a restaurant metaphor.

## 🎯 Concept

This demo uses a **restaurant metaphor** to explain how Web Components work as boundaries:

- **Restaurant (Vue)** = Host application that owns state and business logic
- **Customer Table (Web Component)** = Independent component that expresses intent
- **Waiter** = Visual representation of communication across the boundary

### Key Teaching Points

1. **Intent goes up, data comes down** - The customer requests a menu (event), the restaurant provides it (prop)
2. **Loose coupling** - The customer never talks to the kitchen directly
3. **Business logic in host** - Prices and calculations are owned by Vue, not the Web Component
4. **Framework independence** - The Web Component works without Vue

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

Visit `http://localhost:5173` to see the demo.

## 📁 Project Structure

```
src/
├── main.js                    # Entry point
├── App.vue                    # Restaurant (Vue host app)
├── style.css                  # Global styles
├── assets/                    # Background images
│   ├── kitchen.jpg
│   ├── table.jpg
│   └── cashier.jpg
└── web-components/
    └── CustomerTable.js       # Web Component (framework-agnostic)
```

## 🎭 Demo Flow

### 1️⃣ Request Menu
- Customer clicks "Request Menu"
- Waiter moves: TABLE → KITCHEN
- Restaurant sends menu as prop
- Waiter returns with menu

### 2️⃣ Place Order
- Customer selects items and clicks "Place Order"
- Waiter moves: TABLE → KITCHEN
- Restaurant processes order
- Waiter returns with confirmation

### 3️⃣ Request Bill
- Customer clicks "Request Bill"
- Waiter moves: TABLE → CASHIER
- Restaurant calculates bill (owns pricing logic)
- Waiter returns with bill

### 4️⃣ Pay Bill
- Customer clicks "Pay Bill"
- Waiter moves: TABLE → CASHIER
- Payment processed
- Everything resets

## 🔧 Technical Details

### Web Component API

```html
<customer-table
  .menu="menu"
  .orderStatus="orderStatus"
  .bill="bill"
  @request-menu="handleRequestMenu"
  @place-order="handlePlaceOrder"
  @request-bill="handleRequestBill"
  @pay-bill="handlePayBill"
/>
```

**Properties (downward communication):**
- `menu` - Array of menu items
- `orderStatus` - Order confirmation status
- `bill` - Bill details with items and total

**Events (upward communication):**
- `request-menu` - Customer wants to see the menu
- `place-order` - Customer places an order (includes selected item IDs)
- `request-bill` - Customer requests the bill
- `pay-bill` - Customer pays the bill

### Architecture Principles

✅ **DO:**
- Vue owns all state and business logic
- Web Component communicates via events (up) and props (down)
- Waiter movement is deterministic and sequential
- All animations complete cleanly

❌ **DON'T:**
- No Vue code inside the Web Component
- No direct communication between customer and kitchen
- No concurrent waiter movements
- No framework assumptions in the Web Component

## 🎨 Design Decisions

### Waiter Animation
- Only ONE animation at a time (prevents race conditions)
- Buttons disabled during movement (prevents spam clicks)
- Smooth CSS transitions (700ms cubic-bezier)
- Deterministic positions (no randomness)

### Visual Layout
- Three-column grid (Kitchen | Table | Cashier)
- Real background images with dark overlays
- Clear section labels
- Responsive design for mobile

## 🎓 Teaching Goals

This demo is successful if:
- ✅ Audience understands the boundary without explanation
- ✅ Presenter can narrate while animations run
- ✅ Web Component feels independent
- ✅ Vue feels authoritative
- ✅ The metaphor explains itself

## 🛠️ Tech Stack

- **Vite** - Build tool
- **Vue 3** - Host application (Composition API, `<script setup>`)
- **Native Web Components** - Custom Elements + Shadow DOM
- **CSS Transitions** - Animations (no libraries)

## 📝 Notes for Presenters

1. **Start fresh** - Reload the page before each demo
2. **Click slowly** - Let animations complete
3. **Explain as you go** - Narrate the waiter's journey
4. **Highlight the boundary** - Point out events going up, props coming down
5. **Show independence** - Mention the Web Component has no Vue imports

## 🔍 Code Highlights

### Web Component (Framework-Agnostic)
```javascript
// No framework imports!
class CustomerTable extends HTMLElement {
  // Communicates via Custom Events
  requestMenu() {
    this.dispatchEvent(new CustomEvent('request-menu', {
      bubbles: true,
      composed: true
    }));
  }
  
  // Receives data via properties
  set menu(value) {
    this._menu = value;
    this.render();
  }
}
```

### Vue Host (Owns State)
```javascript
// Restaurant owns the menu and prices
const menu = [
  { id: 1, name: '🍕 Margherita Pizza', price: 12.99 },
  // ...
]

// Restaurant controls waiter movement
async function moveWaiter(from, to, delay = 500) {
  isWaiterMoving.value = true
  waiterPosition.value = { ...POSITIONS[to] }
  // ... animation logic
}
```

## 📄 License

MIT - Feel free to use this demo for your own presentations!

---

Built for VueConf 2026 🎉
