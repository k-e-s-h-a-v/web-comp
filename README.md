# 🍽️ VueVerse Connect 2026 - Web Components Demo

A visual demo that explains Web Components using a restaurant metaphor. The **Restaurant (Vue)** owns state and business logic, while the **Customer Table (Web Component)** is a framework-agnostic component that communicates via events and properties.

**Live Demo:** [https://k-e-s-h-a-v.github.io/web-comp/](https://k-e-s-h-a-v.github.io/web-comp/)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## 📦 Using the CustomerTable Component

The `CustomerTable` is a **framework-agnostic Web Component** that works anywhere.

### In Plain HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Restaurant Demo</title>
</head>
<body>
  <customer-table id="table"></customer-table>

  <script type="module">
    // Import the Web Component
    import './src/web-components/CustomerTable.js';

    const table = document.getElementById('table');
    
    // Listen to events (customer intent)
    table.addEventListener('request-menu', () => {
      console.log('Customer wants menu');
      // Provide menu via property
      table.menu = [
        { id: 1, name: '🍕 Pizza', price: 12.99 },
        { id: 2, name: '🍝 Pasta', price: 14.99 }
      ];
    });

    table.addEventListener('place-order', (e) => {
      console.log('Order placed:', e.detail.itemIds);
      table.orderStatus = 'confirmed';
    });

    table.addEventListener('request-bill', () => {
      table.bill = {
        items: [{ name: '🍕 Pizza', price: 12.99 }],
        total: 12.99
      };
    });

    table.addEventListener('pay-bill', () => {
      console.log('Payment received');
      // Reset the table
      table.menu = null;
      table.orderStatus = null;
      table.bill = null;
    });
  </script>
</body>
</html>
```

### In React

```jsx
import { useEffect, useRef, useState } from 'react';
// Register the Web Component
import './web-components/CustomerTable.js';

function App() {
  const tableRef = useRef(null);

  // Static menu (does not change)
  const menu = [
    { id: 1, name: '🍕 Pizza', price: 12.99 },
    { id: 2, name: '🍝 Pasta', price: 14.99 }
  ];

  // React-owned state
  const [customerMenu, setCustomerMenu] = useState(null);
  const [orderItemIds, setOrderItemIds] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [bill, setBill] = useState(null);

  /**
   * Web Component → React
   * (listen to custom DOM events)
   */
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const onRequestMenu = () => {
      setCustomerMenu(menu);
    };

    const onPlaceOrder = (e) => {
      setOrderItemIds(e.detail.itemIds);
      setOrderStatus('confirmed');
    };

    const onRequestBill = () => {
      const items = menu.filter(item =>
        orderItemIds.includes(item.id)
      );

      setBill({
        items,
        total: items.reduce((sum, item) => sum + item.price, 0)
      });
    };

    const onPayBill = () => {
      setCustomerMenu(null);
      setOrderItemIds([]);
      setOrderStatus(null);
      setBill(null);
    };

    table.addEventListener('request-menu', onRequestMenu);
    table.addEventListener('place-order', onPlaceOrder);
    table.addEventListener('request-bill', onRequestBill);
    table.addEventListener('pay-bill', onPayBill);

    return () => {
      table.removeEventListener('request-menu', onRequestMenu);
      table.removeEventListener('place-order', onPlaceOrder);
      table.removeEventListener('request-bill', onRequestBill);
      table.removeEventListener('pay-bill', onPayBill);
    };
  }, [menu, orderItemIds]);

  /**
   * React → Web Component
   * (push state via element properties)
   */
  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    table.menu = customerMenu;
    table.orderStatus = orderStatus;
    table.bill = bill;
  }, [customerMenu, orderStatus, bill]);

  return (
    <div>
      <h1>Restaurant Demo</h1>

      <customer-table
        ref={(el) => {
          tableRef.current = el;
        }}
      />
    </div>
  );
}

export default App;
```

### In Vue 3

```vue
<script setup>
import { ref } from 'vue';
import './web-components/CustomerTable.js';

const menu = [
  { id: 1, name: '🍕 Pizza', price: 12.99 },
  { id: 2, name: '🍝 Pasta', price: 14.99 }
];

const customerMenu = ref(null);
const orderStatus = ref(null);
const bill = ref(null);

function handleRequestMenu() {
  customerMenu.value = menu;
}

function handlePlaceOrder(event) {
  console.log('Order:', event.detail.itemIds);
  orderStatus.value = 'confirmed';
}

function handleRequestBill() {
  bill.value = {
    items: [{ name: '🍕 Pizza', price: 12.99 }],
    total: 12.99
  };
}

function handlePayBill() {
  customerMenu.value = null;
  orderStatus.value = null;
  bill.value = null;
}
</script>

<template>
  <customer-table
    :menu="customerMenu"
    :orderStatus="orderStatus"
    :bill="bill"
    @request-menu="handleRequestMenu"
    @place-order="handlePlaceOrder"
    @request-bill="handleRequestBill"
    @pay-bill="handlePayBill"
  />
</template>
```

## 🔌 Component API

### Properties (Data In)
- `menu` - Array of `{ id, name, price }` objects
- `orderStatus` - String indicating order confirmation
- `bill` - Object with `{ items, total }`

### Events (Intent Out)
- `request-menu` - Customer wants to see the menu
- `place-order` - Customer places order (includes `detail.itemIds`)
- `request-bill` - Customer requests the bill
- `pay-bill` - Customer pays the bill

## 🎯 Key Concept

**Intent goes up ⬆️, Data comes down ⬇️**

The Web Component never directly accesses your app's data. It only:
1. **Emits events** to express what the customer wants
2. **Receives properties** with the data your app provides

This creates a clean boundary that works with any framework (or no framework).

## 📄 License

MIT

---

Built for VueVerse Connect 2026 🎉
