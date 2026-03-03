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
// export function renderOrderList() {
//   const container = document.getElementById("orderItemsContainer");
//   if (!container) return;

//   if (orderList.length === 0) {
//     container.innerHTML =
//       '<p class="text-center text-gray-500 py-10 font-display">YOUR LIST IS EMPTY</p>';
//     updateTotals(0);
//     // Hide the clear button if the cart is empty
//     const clearBtn = document.getElementById("clear-cart-btn");
//     if (clearBtn) clearBtn.classList.add("hidden");
//     return;
//   }

//   // Render the items
//   container.innerHTML = orderList
//     .map((item) => {
//       // FIX: Convert price to number in case it was saved as a string (e.g. "$25.00")
//       const numericPrice =
//         typeof item.price === "number"
//           ? item.price
//           : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

//       return `
//         <div class="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5 mb-3">
//           <div class="flex-1 pr-4">
//             <h4 class="font-bold text-white uppercase text-sm leading-tight">${item.name}</h4>
//             <p class="text-primary font-bold text-xs">$${numericPrice.toFixed(2)} ea</p>
//           </div>

//           <div class="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10 mx-4">
//             <button onclick="updateQuantity('${item.name}', -1)" class="w-8 h-8 flex items-center justify-center text-white hover:bg-primary transition-colors rounded">-</button>
//             <span class="text-white font-bold w-4 text-center text-sm">${item.quantity}</span>
//             <button onclick="updateQuantity('${item.name}', 1)" class="w-8 h-8 flex items-center justify-center text-white hover:bg-primary transition-colors rounded">+</button>
//           </div>

//           <div class="text-right min-w-[60px]">
//             <p class="text-white font-bold text-sm">$${(numericPrice * item.quantity).toFixed(2)}</p>
//             <button onclick="removeFromOrder(${item.orderId})" class="text-gray-500 hover:text-red-500 text-xs mt-1 transition-colors">
//               Remove
//             </button>
//           </div>
//         </div>
//       `;
//     })
//     .join("");

//   // 2. Calculate Subtotal (Safely)
//   const subtotal = orderList.reduce((sum, item) => {
//     // We define a local price variable here so it doesn't rely on the map's variable
//     const p =
//       typeof item.price === "number"
//         ? item.price
//         : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
//     return sum + p * (item.quantity || 1);
//   }, 0);

//   updateTotals(subtotal);

//   // Add the Empty Cart button at the bottom of the list if it doesn't exist
//   if (!document.getElementById("clear-cart-btn") && orderList.length > 0) {
//     const clearBtnHtml = `
//         <button id="clear-cart-btn" onclick="clearCart()" class="w-full mt-2 mb-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg uppercase text-xs font-bold tracking-widest">
//           <i class="fa-solid fa-trash-can mr-2"></i> Empty Order List
//         </button>
//       `;
//     container.insertAdjacentHTML("beforeend", clearBtnHtml);
//   }
// }

export function renderOrderList() {
  const container = document.getElementById("orderItemsContainer");
  if (!container) return;

  if (orderList.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-gray-500">
        <i class="fa-solid fa-cart-shopping text-5xl mb-4 opacity-20"></i>
        <p class="text-lg uppercase tracking-widest">Your list is empty</p>
      </div>`;
    updateTotals(0);
    return;
  }

  container.innerHTML = orderList
    .map((item) => {
      const numericPrice =
        typeof item.price === "number"
          ? item.price
          : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

      return `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 mb-4 gap-4">
        <div class="flex-1">
          <h4 class="font-bold text-white uppercase text-lg leading-tight">${item.name}</h4>
          <p class="text-primary font-bold">$${numericPrice.toFixed(2)} ea</p>
        </div>

        <div class="flex items-center justify-between w-full sm:w-auto gap-4">
          <div class="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
            <button onclick="updateQuantity('${item.name}', -1)" class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md text-xl">-</button>
            <span class="text-white font-bold w-6 text-center text-lg">${item.quantity || 1}</span>
            <button onclick="updateQuantity('${item.name}', 1)" class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md text-xl">+</button>
          </div>

          <div class="text-right">
            <p class="text-white font-black text-xl">$${(numericPrice * (item.quantity || 1)).toFixed(2)}</p>
            <button onclick="removeFromOrder(${item.orderId})" class="text-red-500/70 hover:text-red-500 text-xs uppercase mt-1 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Re-calculate totals
  const subtotal = orderList.reduce((sum, item) => {
    const p =
      typeof item.price === "number"
        ? item.price
        : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + p * (item.quantity || 1);
  }, 0);

  updateTotals(subtotal);

  // Clear Cart Button - subtle but accessible
  if (!document.getElementById("clear-cart-btn")) {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <button id="clear-cart-btn" onclick="clearCart()" class="w-full mt-4 mb-6 py-3 border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white transition-all rounded-lg uppercase text-xs font-bold tracking-widest">
        Clear All Items
      </button>
     `,
    );
  }
}

// function updateTotals(subtotal) {
//   const footer = document.getElementById("orderFooter");
//   if (!footer) return;

//   const tax = subtotal * 0.1; // 10% GST
//   const netAmount = subtotal - tax;

//   // If cart is empty, show a simple "Continue Shopping" button instead
//   if (subtotal === 0) {
//     footer.innerHTML = `
//       <button onclick="closeOrderModal()" class="w-full py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
//         Continue Shopping
//       </button>
//     `;
//     return;
//   }

//   footer.innerHTML = `
//       <div class="space-y-4 mb-6">
//         <div class="space-y-2">
//           <input type="text" id="custName" placeholder="YOUR NAME" class="w-full p-4 bg-black/40 border-2 border-white/10 rounded-xl text-white font-bold focus:border-primary outline-none">
//           <input type="tel" id="custPhone" placeholder="MOBILE NUMBER" class="w-full p-4 bg-black/40 border-2 border-white/10 rounded-xl text-white font-bold focus:border-primary outline-none">
//         </div>

//         <div class="pt-2 border-t border-white/10">
//           <div class="flex justify-between text-gray-400"><span>Subtotal</span><span>$${(subtotal - tax).toFixed(2)}</span></div>
//           <div class="flex justify-between items-center mt-1">
//             <span class="text-xl font-black text-white uppercase">Total</span>
//             <span class="text-3xl font-black text-primary">$${subtotal.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       <button onclick="handlePlaceOrder()" class="w-full py-5 bg-green-600 text-white text-xl font-black uppercase rounded-xl shadow-2xl hover:bg-green-500 transition-all flex items-center justify-center gap-3">
//         <i class="fa-brands fa-whatsapp text-2xl"></i>
//         SEND ORDER VIA WHATSAPP
//       </button>
//     `;
// }

function updateTotals(subtotal) {
  const footer = document.getElementById("orderFooter");
  if (!footer) return;

  if (subtotal === 0) {
    footer.innerHTML = `
      <button onclick="closeOrderModal()" class="w-full py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
        Continue Shopping
      </button>`;
    return;
  }

  const tax = subtotal * 0.1;

  footer.innerHTML = `
    <div class="space-y-4 mb-4">
      <div class="relative">
        <input type="text" id="custName" placeholder="ENTER YOUR NAME"
               class="w-full p-5 bg-black/40 border-2 border-white/20 rounded-2xl text-white text-xl font-black focus:border-primary outline-none placeholder:text-gray-600">
        <span class="absolute -top-3 left-4 bg-smoke px-2 text-primary text-xs font-bold tracking-widest uppercase">Required for Pickup</span>
      </div>

      <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
        <div class="flex justify-between text-gray-400 font-bold">
          <span>SUBTOTAL</span>
          <span>$${(subtotal - tax).toFixed(2)}</span>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-2xl font-black text-white uppercase tracking-tighter">Total Amount</span>
          <span class="text-4xl font-black text-primary">$${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <button onclick="handlePlaceOrder()"
            class="w-full py-6 bg-green-600 text-white text-2xl font-black uppercase rounded-2xl shadow-[0_10px_40px_rgba(22,163,74,0.3)] hover:bg-green-500 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
      <i class="fa-brands fa-whatsapp text-3xl"></i>
      ORDER VIA WHATSAPP
    </button>
  `;
}

window.handlePlaceOrder = function () {
  const nameInput = document.getElementById("custName");
  const name = nameInput ? nameInput.value.trim() : "";

  if (!name) {
    alert("Please enter your Name so we know who the order is for!");
    if (nameInput) nameInput.focus();
    return;
  }

  // BUILD THE MESSAGE USING STANDARD EMOJIS
  let message = `🔥 *NEW BBQ ORDER* 🔥\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Order For:* ${name}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  orderList.forEach((item) => {
    const p =
      typeof item.price === "number"
        ? item.price
        : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

    // Use the "Check Box" emoji (✅) or "Small Orange Diamond" (🔸)
    message += `🔸 ${item.quantity}x ${item.name} - $${(p * item.quantity).toFixed(2)}\n`;
  });

  const total = orderList.reduce((sum, item) => {
    const p =
      typeof item.price === "number"
        ? item.price
        : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + p * item.quantity;
  }, 0);

  message += `\n💰 *TOTAL AMOUNT: $${total.toFixed(2)}*`;
  message += `\n\n_Please confirm if you've received this order!_`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappNumber = "61491098073";

  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
};

// window.handlePlaceOrder = function () {
//   const name = document.getElementById("custName").value.trim();

//   if (!name) {
//     alert("Please enter your name so we know who the order is for!");
//     return;
//   }

//   // --- BUILD THE WHATSAPP MESSAGE ---
//   // We use Emojis (🔥, 👤, 💰) because WhatsApp treats them as text.
//   let message = `🔥 *NEW BBQ ORDER* 🔥\n`;
//   message += `--------------------------\n`;
//   message += `👤 *Order For:* ${name}\n`;
//   message += `--------------------------\n\n`;

//   orderList.forEach((item) => {
//     // Using a "Box" emoji (▪️) or "Check" (✅) works best for lists
//     message += `✅ ${item.quantity}x ${item.name}\n`;
//   });

//   const total = orderList.reduce((sum, item) => {
//     const p =
//       typeof item.price === "number"
//         ? item.price
//         : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
//     return sum + p * (item.quantity || 1);
//   }, 0);

//   message += `\n💰 *TOTAL PAYABLE: $${total.toFixed(2)}*`;
//   message += `\n\n_Sent via BBQ Heaven Online_`;

//   // --- SEND TO WHATSAPP ---
//   const whatsappNumber = "61491098073"; // Ensure this is your number
//   const encodedMsg = encodeURIComponent(message);

//   window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
// };

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
