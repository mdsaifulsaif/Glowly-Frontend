document.addEventListener("DOMContentLoaded", renderCart);

function renderCart() {
  const cartItemsList = document.getElementById("cart-items-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsList.innerHTML = "<h3>Your cart is empty!</h3>";
    updateSummary(0);
    return;
  }

  cartItemsList.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <img src="${item.thumbnail}" class="item-img">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-qty-text">Quantity: ${item.qty}</div>
                
                <div class="qty-group">
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    <input type="text" value="${item.qty}" class="qty-input" readonly>
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                </div>
            </div>
            <div class="item-price">$${(item.salePrice * item.qty).toFixed(2)}</div>
           <button class="remove-btn" onclick="removeItem(${index})">
    <i class="fa-regular fa-trash-can"></i> 
</button>
        </div>
    `,
    )
    .join("");

  calculateTotal(cart);
}

function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart[index].qty + change >= 1) {
    cart[index].qty += change;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    
    if (typeof updateCartCount === "function") updateCartCount();
  }
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
  if (typeof updateCartCount === "function") updateCartCount();
}

function calculateTotal(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.qty,
    0,
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  document.getElementById("subtotal-amount").innerText =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("total-price").innerText = `$${total.toFixed(2)}`;
}
