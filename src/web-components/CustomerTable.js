/**
 * CustomerTable Web Component
 * 
 * Represents the customer's table in the restaurant.
 * Communicates with the Vue host app ONLY via:
 * - Custom Events (upward communication - intent)
 * - Properties (downward communication - data)
 * 
 * This component is framework-agnostic and works in plain HTML.
 */
class CustomerTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Internal state
        this._menu = null;
        this._orderStatus = null;
        this._bill = null;
        this._selectedItems = new Set();
    }

    // Properties that Vue can set
    set menu(value) {
        this._menu = value;
        this.render();
    }

    get menu() {
        return this._menu;
    }

    set orderStatus(value) {
        this._orderStatus = value;
        this.render();
    }

    get orderStatus() {
        return this._orderStatus;
    }

    set bill(value) {
        this._bill = value;
        this.render();
    }

    get bill() {
        return this._bill;
    }

    connectedCallback() {
        this.render();
    }

    // Event emitters - these send intent to the restaurant
    requestMenu() {
        this.dispatchEvent(new CustomEvent('request-menu', {
            bubbles: true,
            composed: true
        }));
    }

    placeOrder() {
        this.dispatchEvent(new CustomEvent('place-order', {
            bubbles: true,
            composed: true,
            detail: { itemIds: Array.from(this._selectedItems) }
        }));
    }

    requestBill() {
        this.dispatchEvent(new CustomEvent('request-bill', {
            bubbles: true,
            composed: true
        }));
    }

    payBill() {
        this.dispatchEvent(new CustomEvent('pay-bill', {
            bubbles: true,
            composed: true
        }));
    }

    toggleItem(itemId) {
        if (this._orderStatus) {
            // Order already placed, can't change selection
            return;
        }

        if (this._selectedItems.has(itemId)) {
            this._selectedItems.delete(itemId);
        } else {
            this._selectedItems.add(itemId);
        }
        this.render();
    }

    resetTable() {
        this._selectedItems.clear();
        this._menu = null;
        this._orderStatus = null;
        this._bill = null;
        this.render();
    }

    render() {
        const hasMenu = this._menu && this._menu.length > 0;
        const hasOrder = !!this._orderStatus;
        const hasBill = !!this._bill;
        const canOrder = hasMenu && this._selectedItems.size > 0 && !hasOrder;

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .table-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        h2 {
          margin: 0 0 16px 0;
          color: #2c3e50;
          font-size: 24px;
          text-align: center;
        }

        .status {
          padding: 12px;
          background: #e8f4f8;
          border-radius: 8px;
          text-align: center;
          color: #2c3e50;
          font-weight: 500;
        }

        .status.success {
          background: #d4edda;
          color: #155724;
        }

        button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .menu-item:hover {
          background: #e9ecef;
        }

        .menu-item.selected {
          background: #e8f4f8;
          border: 2px solid #667eea;
        }

        .menu-item.locked {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .menu-item input[type="checkbox"] {
          margin-right: 12px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .menu-item.locked input[type="checkbox"] {
          cursor: not-allowed;
        }

        .menu-item label {
          flex: 1;
          cursor: pointer;
          font-size: 16px;
          color: #2c3e50;
        }

        .menu-item.locked label {
          cursor: not-allowed;
        }

        .bill-details {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-top: 8px;
        }

        .bill-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .bill-total {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-weight: bold;
          font-size: 18px;
          color: #2c3e50;
          margin-top: 8px;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }
      </style>

      <div class="table-container">
        <h2>🪑 Customer Table</h2>

        ${!hasMenu ? `
          <div class="status">Ready to order!</div>
          <div class="actions">
            <button id="request-menu-btn">Request Menu</button>
          </div>
        ` : ''}

        ${hasMenu && !hasOrder ? `
          <div class="status">Select your items</div>
          <div class="menu-list">
            ${this._menu.map(item => `
              <div class="menu-item ${this._selectedItems.has(item.id) ? 'selected' : ''}">
                <input 
                  type="checkbox" 
                  id="item-${item.id}" 
                  ${this._selectedItems.has(item.id) ? 'checked' : ''}
                  data-item-id="${item.id}"
                >
                <label for="item-${item.id}">${item.name}</label>
              </div>
            `).join('')}
          </div>
          <div class="actions">
            <button id="place-order-btn" ${!canOrder ? 'disabled' : ''}>
              Place Order (${this._selectedItems.size} items)
            </button>
          </div>
        ` : ''}

        ${hasOrder && !hasBill ? `
          <div class="status success">Order confirmed! ✓</div>
          <div class="menu-list">
            ${this._menu.filter(item => this._selectedItems.has(item.id)).map(item => `
              <div class="menu-item locked selected">
                <input type="checkbox" checked disabled>
                <label>${item.name}</label>
              </div>
            `).join('')}
          </div>
          <div class="actions">
            <button id="request-bill-btn">Request Bill</button>
          </div>
        ` : ''}

        ${hasBill ? `
          <div class="status">Your bill is ready</div>
          <div class="bill-details">
            ${this._bill.items.map(item => `
              <div class="bill-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="bill-total">
              <span>Total</span>
              <span>$${this._bill.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="actions">
            <button id="pay-bill-btn">Pay Bill</button>
          </div>
        ` : ''}
      </div>
    `;

        // Attach event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const requestMenuBtn = this.shadowRoot.getElementById('request-menu-btn');
        const placeOrderBtn = this.shadowRoot.getElementById('place-order-btn');
        const requestBillBtn = this.shadowRoot.getElementById('request-bill-btn');
        const payBillBtn = this.shadowRoot.getElementById('pay-bill-btn');

        if (requestMenuBtn) {
            requestMenuBtn.addEventListener('click', () => this.requestMenu());
        }

        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => this.placeOrder());
        }

        if (requestBillBtn) {
            requestBillBtn.addEventListener('click', () => this.requestBill());
        }

        if (payBillBtn) {
            payBillBtn.addEventListener('click', () => this.payBill());
        }

        // Checkbox listeners
        const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]:not([disabled])');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const itemId = parseInt(e.target.dataset.itemId);
                this.toggleItem(itemId);
            });
        });
    }
}

// Register the custom element
customElements.define('customer-table', CustomerTable);

export default CustomerTable;
