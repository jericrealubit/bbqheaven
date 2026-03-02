// Global state for the cart
export let orderList = JSON.parse(localStorage.getItem("bbqOrder")) || [];

/**
 * Updates the floating cart badge count by summing total quantities
 */
export function updateOrderCounter() {
  const badge = document.getElementById("order-count-badge");
  if (!badge) return;

  const totalItems = orderList.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}

/**
 * Adds an item or increments quantity.
 * Ensures price is always a clean number to avoid NaN.
 */
export function addToOrderList(item, selectedOption = null) {
  const finalName = selectedOption
    ? `${item.name} (${selectedOption.label})`
    : item.name;

  // Sanitize price: convert "$26.00" or 26 to 26.00
  let rawPrice = selectedOption ? selectedOption.price : item.price;
  const finalPrice =
    typeof rawPrice === "string"
      ? parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0
      : parseFloat(rawPrice) || 0;

  const existingItem = orderList.find((i) => i.name === finalName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    orderList.push({
      name: finalName,
      price: finalPrice,
      quantity: 1,
      orderId: Date.now() + Math.random(),
    });
  }

  saveAndSync();
  showNotification(`${finalName} added to list!`);
}

/**
 * Saves to localStorage and updates the UI badge
 */
function saveAndSync() {
  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
}

window.updateQuantity = function (itemName, change) {
  const item = orderList.find((i) => i.name === itemName);
  if (!item) return;

  item.quantity = (item.quantity || 0) + change;

  if (item.quantity <= 0) {
    orderList = orderList.filter((i) => i.name !== itemName);
  }

  saveAndSync();
  renderOrderList();
};

window.removeFromOrder = function (orderId) {
  orderList = orderList.filter((item) => item.orderId !== orderId);
  saveAndSync();
  renderOrderList();
};

/**
 * Clears all items from the cart and updates the UI
 */
window.clearCart = function () {
  if (orderList.length === 0) return;

  // Optional: Add a confirmation dialog
  if (confirm("Are you sure you want to clear your entire order list?")) {
    orderList = [];
    localStorage.removeItem("bbqOrder");
    updateOrderCounter();
    renderOrderList();
    showNotification("Order list cleared");
  }
};

/**
 * Updated Render Function with Empty Cart Button
 */
export function renderOrderList() {
  const container = document.getElementById("orderItemsContainer");
  if (!container) return;

  if (orderList.length === 0) {
    container.innerHTML =
      '<p class="text-center text-gray-500 py-10 font-display">YOUR LIST IS EMPTY</p>';
    updateTotals(0);
    // Hide the clear button if the cart is empty
    const clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) clearBtn.classList.add("hidden");
    return;
  }

  // Render the items
  container.innerHTML = orderList
    .map(
      (item) => `
    <div class="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5 mb-3">
      <div class="flex-1 pr-4">
        <h4 class="font-bold text-white uppercase text-sm leading-tight">${item.name}</h4>
        <p class="text-primary font-bold text-xs">$${item.price.toFixed(2)} ea</p>
      </div>

      <div class="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10 mx-4">
        <button onclick="updateQuantity('${item.name}', -1)" class="w-8 h-8 flex items-center justify-center text-white hover:bg-primary transition-colors rounded">-</button>
        <span class="text-white font-bold w-4 text-center text-sm">${item.quantity}</span>
        <button onclick="updateQuantity('${item.name}', 1)" class="w-8 h-8 flex items-center justify-center text-white hover:bg-primary transition-colors rounded">+</button>
      </div>

      <div class="text-right min-w-[60px]">
        <p class="text-white font-bold text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeFromOrder(${item.orderId})" class="text-gray-500 hover:text-red-500 text-xs mt-1 transition-colors">
          Remove
        </button>
      </div>
    </div>
  `,
    )
    .join("");

  // Add the Empty Cart button at the bottom of the list if it doesn't exist
  if (!document.getElementById("clear-cart-btn") && orderList.length > 0) {
    const clearBtnHtml = `
      <button id="clear-cart-btn" onclick="clearCart()" class="w-full mt-2 mb-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg uppercase text-xs font-bold tracking-widest">
        <i class="fa-solid fa-trash-can mr-2"></i> Empty Order List
      </button>
    `;
    container.insertAdjacentHTML("beforeend", clearBtnHtml);
  }

  const subtotal = orderList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  const tax = subtotal * 0.1;
  const subtotalEl = document.getElementById("order-subtotal");
  const taxEl = document.getElementById("order-tax");
  const totalEl = document.getElementById("order-total");

  if (subtotalEl) subtotalEl.textContent = `$${(subtotal - tax).toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

window.openOrderModal = function () {
  renderOrderList();
  document.getElementById("orderModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeOrderModal = function () {
  document.getElementById("orderModal").classList.add("hidden");
  document.body.style.overflow = "";
};

function showNotification(message) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all duration-500";
  toast.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 20px)";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}
