document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();

  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", renderCheckoutSummary);
  });
});

function renderCheckoutSummary() {
  const list = document.getElementById("checkout-items-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const shippingCost = parseFloat(
    document.querySelector('input[name="shipping"]:checked').value,
  );

  list.innerHTML = cart
    .map(
      (item) => `
        <div class="summary-item">
            <img src="${item.thumbnail}" class="sum-img">
            <div class="sum-details">
                <div class="sum-name">${item.name}</div>
                <div class="sum-qty">Quantity: ${item.qty}</div>
            </div>
            <div class="sum-price">$${(item.salePrice * item.qty).toFixed(2)}</div>
        </div>
    `,
    )
    .join("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.qty,
    0,
  );
  const total = subtotal + shippingCost;

  document.getElementById("summary-subtotal").innerText =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("summary-shipping").innerText =
    `$${shippingCost.toFixed(2)}`;
  document.getElementById("summary-total").innerText = `$${total.toFixed(2)}`;
}

// document.addEventListener("DOMContentLoaded", () => {

//   renderCheckoutSummary();

//   const checkoutForm = document.getElementById("checkout-form");

//   if (checkoutForm) {
//     checkoutForm.addEventListener("submit", (e) => {
//       e.preventDefault();

//       const formData = {
//         firstName: checkoutForm.querySelector('input[placeholder="Full name"]')
//           .value,
//         lastName: checkoutForm.querySelector('input[placeholder="Last name"]')
//           .value,
//         email: checkoutForm.querySelector('input[placeholder="Email"]').value,
//         phone: checkoutForm.querySelector('input[placeholder="Phone"]').value,
//         address: checkoutForm.querySelector(
//           'input[placeholder="Apartment, suite, etc. (optional)"]',
//         ).value,
//         city: checkoutForm.querySelector('input[placeholder="City"]').value,
//         state: checkoutForm.querySelector("select").value,
//         postalCode: checkoutForm.querySelector(
//           'input[placeholder="Postal Code"]',
//         ).value,
//         country: checkoutForm.querySelectorAll("select")[1].value,
//         shippingMethod: document.querySelector('input[name="shipping"]:checked')
//           .value,
//         cartItems: JSON.parse(localStorage.getItem("cart")) || [],
//         totalAmount: document.getElementById("summary-total").innerText,
//       };

//       console.log("--- Checkout Form Data ---");
//       console.log(formData);

//       alert("Order data captured! Check console for details.");

//       // window.location.href = "payment.html";
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();

  const checkoutForm = document.getElementById("checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      // async add kora hoyeche
      e.preventDefault();

      const formData = {
        firstName: checkoutForm.querySelector('input[placeholder="Full name"]')
          .value,
        lastName: checkoutForm.querySelector('input[placeholder="Last name"]')
          .value,
        email: checkoutForm.querySelector('input[placeholder="Email"]').value,
        phone: checkoutForm.querySelector('input[placeholder="Phone"]').value,
        address: checkoutForm.querySelector(
          'input[placeholder="Apartment, suite, etc. (optional)"]',
        ).value,
        city: checkoutForm.querySelector('input[placeholder="City"]').value,
        state: checkoutForm.querySelector("select").value,
        postalCode: checkoutForm.querySelector(
          'input[placeholder="Postal Code"]',
        ).value,
        country: checkoutForm.querySelectorAll("select")[1].value,
        shippingMethod: document.querySelector('input[name="shipping"]:checked')
          .value,
        cartItems: JSON.parse(localStorage.getItem("cart")) || [],
        totalAmount: document.getElementById("summary-total").innerText,
      };

      try {
        // API Call
        const response = await fetch(
          "https://glowly-server.vercel.app/api/order-create",
          
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const result = await response.json();

        if (response.ok) {
          alert("Order placed successfully!");
          console.log("Success:", result);

          // Order success hole cart clear kore deya bhalo
          localStorage.removeItem("cart");

          // Redirect to payment or success page
          // window.location.href = "payment.html";
        } else {
          alert(
            "Failed to place order: " + (result.message || "Unknown error"),
          );
        }
      } catch (error) {
        console.error("Error sending order:", error);
        alert("Something went wrong. Please try again later.");
      }
    });
  }
});

document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
  radio.addEventListener("change", renderCheckoutSummary);
});

function renderCheckoutSummary() {
  const list = document.getElementById("checkout-items-list");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const shippingRadio = document.querySelector(
    'input[name="shipping"]:checked',
  );
  const shippingCost = shippingRadio ? parseFloat(shippingRadio.value) : 0;

  if (list) {
    list.innerHTML = cart
      .map(
        (item) => `
            <div class="summary-item" style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                <img src="${item.thumbnail}" style="width: 50px; height: 50px; object-fit: cover;">
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="font-size: 12px; color: #666;">Qty: ${item.qty}</div>
                </div>
                <div style="font-weight: bold;">$${(item.salePrice * item.qty).toFixed(2)}</div>
            </div>
        `,
      )
      .join("");
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.qty,
    0,
  );
  const total = subtotal + shippingCost;

  if (document.getElementById("summary-subtotal"))
    document.getElementById("summary-subtotal").innerText =
      `$${subtotal.toFixed(2)}`;
  if (document.getElementById("summary-shipping"))
    document.getElementById("summary-shipping").innerText =
      `$${shippingCost.toFixed(2)}`;
  if (document.getElementById("summary-total"))
    document.getElementById("summary-total").innerText = `$${total.toFixed(2)}`;
}
