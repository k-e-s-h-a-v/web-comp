<script setup>
import { ref, computed } from 'vue'
import kitchenImg from './assets/kitchen.jpg'
import tableImg from './assets/table.jpg'
import cashierImg from './assets/cashier.jpg'

// Restaurant data - owned by Vue
const menu = [
  { id: 1, name: '🍕 Margherita Pizza', price: 12.99 },
  { id: 2, name: '🍝 Spaghetti Carbonara', price: 14.99 },
  { id: 3, name: '🥗 Caesar Salad', price: 8.99 },
  { id: 4, name: '🍔 Cheeseburger', price: 11.99 },
  { id: 5, name: '🍰 Tiramisu', price: 6.99 }
]

// Waiter positions (in percentages for responsiveness)
const POSITIONS = {
  TABLE: { x: 50, y: 50 },
  KITCHEN: { x: 15, y: 50 },
  CASHIER: { x: 85, y: 50 }
}

// State
const waiterPosition = ref({ ...POSITIONS.TABLE })
const isWaiterMoving = ref(false)
const customerMenu = ref(null)
const orderStatus = ref(null)
const currentOrder = ref(null)
const billData = ref(null)

// Computed
const waiterStyle = computed(() => ({
  left: `${waiterPosition.value.x}%`,
  top: `${waiterPosition.value.y}%`,
  transform: 'translate(-50%, -50%)',
  transition: isWaiterMoving.value ? 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
}))

// Waiter movement helper
async function moveWaiter(from, to, delay = 500) {
  if (isWaiterMoving.value) return // Prevent concurrent movements
  
  isWaiterMoving.value = true
  waiterPosition.value = { ...POSITIONS[to] }
  
  await new Promise(resolve => setTimeout(resolve, 700)) // Animation duration
  await new Promise(resolve => setTimeout(resolve, delay)) // Simulated work
  
  waiterPosition.value = { ...POSITIONS[from] }
  await new Promise(resolve => setTimeout(resolve, 700)) // Return animation
  
  isWaiterMoving.value = false
}

// Event handlers - these respond to customer intent
async function handleRequestMenu() {
  // Waiter goes to kitchen to get menu
  await moveWaiter('TABLE', 'KITCHEN', 500)
  
  // Restaurant provides menu to customer
  customerMenu.value = menu
}

async function handlePlaceOrder(event) {
  const { itemIds } = event.detail
  
  // Waiter takes order to kitchen
  await moveWaiter('TABLE', 'KITCHEN', 800)
  
  // Restaurant processes order
  currentOrder.value = menu.filter(item => itemIds.includes(item.id))
  orderStatus.value = 'confirmed'
}

async function handleRequestBill() {
  // Waiter goes to cashier to prepare bill
  await moveWaiter('TABLE', 'CASHIER', 500)
  
  // Restaurant calculates bill (business logic in host)
  const items = currentOrder.value
  const total = items.reduce((sum, item) => sum + item.price, 0)
  
  billData.value = {
    items,
    total
  }
}

async function handlePayBill() {
  // Waiter goes to cashier to process payment
  await moveWaiter('TABLE', 'CASHIER', 500)
  
  // Payment successful - reset everything
  setTimeout(() => {
    resetRestaurant()
  }, 500)
}

function resetRestaurant() {
  customerMenu.value = null
  orderStatus.value = null
  currentOrder.value = null
  billData.value = null
  waiterPosition.value = { ...POSITIONS.TABLE }
}
</script>

<template>
  <div class="restaurant">
    <!-- Kitchen Section -->
    <div class="section kitchen">
      <img :src="kitchenImg" alt="Kitchen" class="background-image" />
      <div class="overlay"></div>
      <div class="label">🧑‍🍳 Restaurant Kitchen (Vue)</div>
      <div class="content">
        <h3>Menu</h3>
        <ul class="menu-display">
          <li v-for="item in menu" :key="item.id">
            {{ item.name }} - ${{ item.price.toFixed(2) }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Table Section (Web Component) -->
    <div class="section table">
      <img :src="tableImg" alt="Table" class="background-image" />
      <div class="overlay"></div>
      <div class="label">🪑 Customer Table (Web Component)</div>
      <div class="content">
        <customer-table
          :menu="customerMenu"
          :orderStatus="orderStatus"
          :bill="billData"
          @request-menu="handleRequestMenu"
          @place-order="handlePlaceOrder"
          @request-bill="handleRequestBill"
          @pay-bill="handlePayBill"
        />
      </div>
    </div>

    <!-- Cashier Section -->
    <div class="section cashier">
      <img :src="cashierImg" alt="Cashier" class="background-image" />
      <div class="overlay"></div>
      <div class="label">💳 Cashier (Vue)</div>
      <div class="content">
        <h3>Current Order</h3>
        <div v-if="currentOrder && currentOrder.length > 0" class="order-display">
          <div v-for="item in currentOrder" :key="item.id" class="order-item">
            {{ item.name }}
          </div>
          <div class="order-total">
            Total: ${{ currentOrder.reduce((sum, item) => sum + item.price, 0).toFixed(2) }}
          </div>
        </div>
        <div v-else class="empty-state">
          No active orders
        </div>
      </div>
    </div>

    <!-- Waiter (animated element) -->
    <div class="waiter" :style="waiterStyle">
      <div class="waiter-icon">🚶</div>
    </div>
  </div>
</template>

<style scoped>
.restaurant {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.label {
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 3px solid #667eea;
}

.content {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  color: white;
}

.content h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  text-align: center;
}

.menu-display {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-display li {
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.order-display {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.order-item {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.order-total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 32px;
  opacity: 0.6;
  font-style: italic;
}

/* Waiter animation */
.waiter {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}

.waiter-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: bounce 0.5s ease-in-out infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-8px);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .restaurant {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .section {
    min-height: 400px;
  }
}
</style>
