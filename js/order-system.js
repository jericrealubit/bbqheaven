export let orderList = JSON.parse(localStorage.getItem("bbqOrder")) || [];

export function updateOrderCounter() {
  const badge = document.getElementById("order-count-badge");
  if (badge) {
    badge.textContent = orderList.length;
    badge.style.display = orderList.length > 0 ? "flex" : "none";
  }
}

export function calculateSubtotal() {
  return orderList.reduce((sum, item) => {
    const priceValue =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + priceValue;
  }, 0);
}

// ... Add your removeFromOrder and updateTotals functions here
window.removeFromOrder = function (orderId) {
  orderList = orderList.filter((item) => item.orderId !== orderId);
  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
  renderOrderList(); // Refresh the list view
};

export function updateTotals(subtotal) {
  const tax = subtotal * 0.1; // 10% GST
  const total = subtotal; // If price includes tax, otherwise subtotal + tax

  document.getElementById("order-subtotal").textContent =
    `$${(subtotal - tax).toFixed(2)}`;
  document.getElementById("order-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("order-total").textContent =
    `$${subtotal.toFixed(2)}`;
}
