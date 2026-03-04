import { db, auth } from "./firebase-config.js";
import {
  ref,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut, // Add this line
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const adminList = document.getElementById("admin-list");

function startOrderListener() {
  const ordersRef = ref(db, "orders");
  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    renderOrders(data);
  });
}

function renderOrders(data) {
  if (!data) {
    adminList.innerHTML =
      '<p class="text-zinc-500 italic">No active orders.</p>';
    return;
  }

  const sortedOrders = Object.entries(data).sort(
    (a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0),
  );

  adminList.innerHTML = sortedOrders
    .map(([id, order]) => {
      const isReady = order.status === "ready";
      return `
      <div class="bg-zinc-900 border ${isReady ? "border-green-500/50" : "border-white/10"} p-6 rounded-2xl shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-2xl font-black text-white uppercase">${order.customerName}</h3>
            <p class="text-xs text-zinc-500">${order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : "Recent"}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase ${isReady ? "bg-green-500" : "bg-red-500 animate-pulse"}">
            ${order.status}
          </span>
        </div>
        <ul class="space-y-2 mb-6 border-y border-white/5 py-4">
          ${order.items
            .map(
              (item) => `
            <li class="flex justify-between text-lg">
              <span class="text-zinc-400 font-bold">${item.quantity}x</span>
              <span class="text-white flex-1 ml-3 font-medium uppercase">${item.name}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
        <div class="flex gap-2">
          <button onclick="updateOrderStatus('${id}', '${isReady ? "pending" : "ready"}')"
                  class="flex-1 py-4 rounded-xl font-black uppercase text-sm ${isReady ? "bg-zinc-800 text-zinc-400" : "bg-green-600 text-white"}">
            ${isReady ? "Undo Ready" : "Mark Ready"}
          </button>
          <button onclick="deleteOrder('${id}')" class="px-4 bg-zinc-800 text-zinc-600 hover:text-red-500 rounded-xl">
             ✕
          </button>
        </div>
      </div>`;
    })
    .join("");
}

window.updateOrderStatus = (id, newStatus) => {
  update(ref(db, `orders/${id}`), { status: newStatus });
};

window.deleteOrder = (id) => {
  if (confirm("Clear this order?")) remove(ref(db, `orders/${id}`));
};

// Replace section #6 in admin-logic.js with this:
const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");

// 6. Auth Protection Logic
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Admin Authenticated:", user.email);
    // Hide overlay when logged in
    loginOverlay.classList.add("hidden");
    startOrderListener();
  } else {
    // Show overlay when logged out
    loginOverlay.classList.remove("hidden");
  }
});

// Handle Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("admin-email").value.trim();
  const pass = document.getElementById("admin-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    console.error("Login Error:", err.code);
    alert("Access Denied: Check your email and password.");
  }
});

// 7. Logout Logic
const logoutBtn = document.getElementById("logout-btn");
const adminEmailDisplay = document.getElementById("admin-email-display");

// Update the display when logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginOverlay.classList.add("hidden");
    adminEmailDisplay.innerText = `Logged in as: ${user.email}`; // Show who is logged in
    startOrderListener();
  } else {
    loginOverlay.classList.remove("hidden");
    adminList.innerHTML = ""; // Clear orders on logout
  }
});

// Sign Out Logic
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to sign out?")) {
    signOut(auth).then(() => {
      console.log("Admin logged out");
      window.location.reload(); // Refresh to show login screen
    });
  }
});
