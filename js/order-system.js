import { db } from "../dashboard/firebase-config.js"; // Adjust path if necessary
import {
  ref,
  push,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
// Global state for the cart
export let orderList = JSON.parse(localStorage.getItem("bbqOrder")) || [];

/**
 * UTILITY: Centralized price sanitizer to ensure consistent math
 */
const getNumericPrice = (price) => {
  if (typeof price === "number") return price;
  return parseFloat(String(price || "0").replace(/[^0-9.]/g, "")) || 0;
};

/**
 * UTILITY: Save state and refresh UI
 */
function saveAndSync() {
  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
  // If the modal is currently open, re-render it
  const modal = document.getElementById("orderModal");
  if (modal && !modal.classList.contains("hidden")) {
    renderOrderList();
  }
}

/**
 * UTILITY: Displays a temporary popup message to the user
 */
function showNotification(message) {
  // Create the notification element
  const toast = document.createElement("div");

  // Style it using Tailwind classes for a sleek, mobile-friendly look
  toast.className = `
    fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]
    bg-green-600 text-white px-6 py-4 rounded-2xl
    font-black uppercase tracking-widest shadow-2xl
    transition-all duration-500 flex items-center gap-3
  `;

  toast.innerHTML = `<i class="fa-solid fa-circle-check text-xl"></i> ${message}`;

  document.body.appendChild(toast);

  // Animate out and remove after 2 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 20px)";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

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

export function addToOrderList(item, selectedOption = null) {
  const finalName = selectedOption
    ? `${item.name} (${selectedOption.label})`
    : item.name;
  const rawPrice = selectedOption ? selectedOption.price : item.price;
  const finalPrice = getNumericPrice(rawPrice);

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
 * MODAL CONTROL: Bridges the module to the HTML onclick events
 */
window.openOrderModal = function () {
  renderOrderList();
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
};

window.closeOrderModal = function () {
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = ""; // Restore scrolling
  }
};

window.updateQuantity = function (itemName, change) {
  const item = orderList.find((i) => i.name === itemName);
  if (!item) return;

  item.quantity = (item.quantity || 0) + change;
  if (item.quantity <= 0) {
    orderList = orderList.filter((i) => i.name !== itemName);
  }

  saveAndSync();
};

window.removeFromOrder = function (orderId) {
  orderList = orderList.filter((item) => item.orderId !== orderId);
  saveAndSync();
};

window.clearCart = function () {
  if (orderList.length === 0) return;
  if (confirm("Are you sure you want to clear your entire order list?")) {
    orderList = [];
    saveAndSync();
    showNotification("Order list cleared");
  }
};

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
      const price = getNumericPrice(item.price);
      return `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 mb-4 gap-4">
        <div class="flex-1">
          <h4 class="font-bold text-white uppercase text-lg leading-tight">${item.name}</h4>
          <p class="text-primary font-bold">$${price.toFixed(2)} ea</p>
        </div>
        <div class="flex items-center justify-between w-full sm:w-auto gap-4">
          <div class="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
            <button onclick="updateQuantity('${item.name}', -1)" class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md text-xl">-</button>
            <span class="text-white font-bold w-6 text-center text-lg">${item.quantity}</span>
            <button onclick="updateQuantity('${item.name}', 1)" class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md text-xl">+</button>
          </div>
          <div class="text-right">
            <p class="text-white font-black text-xl">$${(price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromOrder(${item.orderId})" class="text-red-500/70 hover:text-red-500 text-xs uppercase mt-1 transition-colors">Remove</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  const subtotal = orderList.reduce(
    (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
    0,
  );
  updateTotals(subtotal);

  if (!document.getElementById("clear-cart-btn")) {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <button id="clear-cart-btn" onclick="clearCart()" class="w-full mt-4 mb-6 py-3 border border-red-500/20 text-red-500/50 hover:bg-red-500 hover:text-white transition-all rounded-lg uppercase text-xs font-bold tracking-widest">
        Clear All Items
      </button>`,
    );
  }
}

// function updateTotals(subtotal) {
//   const footer = document.getElementById("orderFooter");
//   if (!footer) return;

//   if (subtotal === 0) {
//     footer.innerHTML = `<button onclick="closeOrderModal()" class="w-full py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Continue Shopping</button>`;
//     return;
//   }

//   const tax = subtotal * 0.1;
//   footer.innerHTML = `
//     <div class="space-y-4 mb-4">
//       <div class="relative">
//         <input type="text" id="custName" placeholder="ENTER YOUR NAME" class="w-full p-5 bg-black/40 border-2 border-white/20 rounded-2xl text-white text-xl font-black focus:border-primary outline-none placeholder:text-gray-600 uppercase">
//         <span class="absolute -top-3 left-4 bg-smoke px-2 text-primary text-xs font-bold tracking-widest uppercase">Required for Pickup</span>
//       </div>
//       <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
//         <div class="flex justify-between text-gray-400 font-bold"><span>SUBTOTAL</span><span>$${(subtotal - tax).toFixed(2)}</span></div>
//         <div class="flex justify-between items-center mt-2">
//           <span class="text-2xl font-black text-white uppercase tracking-tighter">Total Amount</span>
//           <span class="text-4xl font-black text-primary">$${subtotal.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//     <button onclick="handlePlaceOrder()" class="w-full py-6 bg-green-600 text-white text-2xl font-black uppercase rounded-2xl shadow-lg hover:bg-green-500 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
//       <i class="fa-brands fa-whatsapp text-3xl"></i> ORDER VIA WHATSAPP
//     </button>`;
// }

function updateTotals(subtotal) {
  const footer = document.getElementById("orderFooter");
  if (!footer) return;

  if (subtotal === 0) {
    footer.innerHTML = `<button onclick="closeOrderModal()" class="w-full py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all">Still Hungry?</button>`;
    return;
  }

  const tax = subtotal * 0.1;
  footer.innerHTML = `
    <div class="space-y-4 mb-4 text-left">
      <div class="relative">
        <input type="text" id="custName" placeholder="ENTER YOUR NAME" class="w-full p-5 bg-black/40 border-2 border-white/20 rounded-2xl text-white text-xl font-black focus:border-primary outline-none placeholder:text-gray-600 uppercase">
        <span class="absolute -top-3 left-4 bg-[#1a1a1a] px-2 text-primary text-[10px] font-black tracking-widest uppercase">Required for Pickup</span>
      </div>

      <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
        <div class="flex justify-between items-center">
          <span class="text-xl font-black text-white uppercase tracking-tighter">Total Amount</span>
          <span class="text-4xl font-black text-primary">$${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <button onclick="handlePlaceOrder()" id="submitOrderBtn" class="w-full py-6 bg-primary text-white text-2xl font-black uppercase rounded-2xl shadow-xl hover:bg-red-500 active:scale-[0.97] transition-all flex flex-col items-center justify-center leading-tight">
      <span>PLACE ORDER</span>
      <span class="text-[10px] opacity-80 font-bold tracking-[0.2em]">SENDS TO KITCHEN DASHBOARD</span>
    </button>

    <p class="text-center text-[10px] text-zinc-500 uppercase mt-4 font-bold tracking-widest">
      No WhatsApp? No problem. Just watch the screen!
    </p>`;
}

// Make sure this is attached to window so the HTML button can find it
// window.handlePlaceOrder = async function () {
//   const nameInput = document.getElementById("custName");
//   const name = nameInput ? nameInput.value.trim() : "";

//   if (!name) return alert("Please enter your name for the kitchen board!");

//   const newOrder = {
//     customerName: name.toUpperCase(),
//     items: orderList,
//     total: orderList.reduce(
//       (sum, i) => sum + Number(i.price) * Number(i.quantity),
//       0,
//     ),
//     status: "pending",
//     timestamp: serverTimestamp(), // This requires the import from step 1
//   };

//   try {
//     // This 'db' variable comes from your import in step 1
//     await push(ref(db, "orders"), newOrder);

//     showNotification("ORDER RECEIVED! WATCH THE SCREEN.");

//     orderList = [];
//     localStorage.removeItem("bbqOrder");
//     closeOrderModal();
//     updateOrderCounter();
//   } catch (error) {
//     console.error("Firebase Error:", error);
//     alert("Connection error. Please try again!");
//   }
// };

window.handlePlaceOrder = async function () {
  const nameInput = document.getElementById("custName");
  const name = nameInput ? nameInput.value.trim() : "";

  if (!name) return alert("Please enter your name for the kitchen board!");
  if (orderList.length === 0) return alert("Your order is empty!");

  // 1. SANITIZE & CALCULATE TOTAL
  const safeTotal = orderList.reduce((sum, item) => {
    // Strip everything except numbers and decimals (removes $ or extra spaces)
    const cleanPrice =
      typeof item.price === "string"
        ? item.price.replace(/[^0-9.]/g, "")
        : item.price;

    const price = parseFloat(cleanPrice) || 0;
    const qty = parseInt(item.quantity) || 1;

    return sum + price * qty;
  }, 0);

  // 2. FINAL VALIDATION: Ensure the total is a valid number for Firebase
  if (isNaN(safeTotal)) {
    console.error("Order Calculation Error: Total is NaN", orderList);
    return alert("There was an error calculating your total. Please refresh.");
  }

  const newOrder = {
    customerName: name.toUpperCase(),
    items: orderList,
    total: safeTotal, // Now guaranteed to be a valid Number
    status: "pending",
    timestamp: serverTimestamp(),
  };

  try {
    // 3. PUSH TO FIREBASE
    await push(ref(db, "orders"), newOrder);

    showNotification("ORDER RECEIVED! WATCH THE SCREEN.");

    // 4. CLEANUP
    orderList = [];
    localStorage.removeItem("bbqOrder");

    if (typeof closeOrderModal === "function") closeOrderModal();
    if (typeof updateOrderCounter === "function") updateOrderCounter();

    // Optional: Refresh the UI list if you have a render function
    if (typeof renderOrderList === "function") renderOrderList();
  } catch (error) {
    console.error("Firebase Error:", error);
    alert("Connection error. Please check your internet and try again!");
  }
};

// Legacy WhatsApp order function (kept for reference or backup)admin-dashboard.htmladmin-dashboard.html
// window.handlePlaceOrder = function () {
//   const nameInput = document.getElementById("custName");
//   const name = nameInput ? nameInput.value.trim() : "";
//   if (!name) {
//     alert("Please enter your Name so we know who the order is for!");
//     if (nameInput) nameInput.focus();
//     return;
//   }

//   let message = `* NEW ORDER: ${name.toUpperCase()} *\n`;
//   message += `━━━━━━━━━━━━━━━━━━\n\n`;

//   orderList.forEach((item) => {
//     const p = getNumericPrice(item.price);
//     message += `${item.quantity} x *${item.name.toUpperCase()}*\n`;
//     message += `     Subtotal: $${(p * item.quantity).toFixed(2)}\n\n`;
//   });

//   const total = orderList.reduce(
//     (sum, item) => sum + getNumericPrice(item.price) * item.quantity,
//     0,
//   );
//   message += `━━━━━━━━━━━━━━━━━━\n`;
//   message += `*TOTAL TO PAY: $${total.toFixed(2)}*\n`;
//   message += `━━━━━━━━━━━━━━━━━━\n`;
//   message += `Sent via BBQ Heaven Online`;

//   window.open(
//     `https://wa.me/61491098073?text=${encodeURIComponent(message)}`,
//     "_blank",
//   );
// };
