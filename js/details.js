const API_BASE_URL = "http://127.0.0.1:5001/api";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    fetchProductDetails(productId);
  } else {
    document.getElementById("product-details").innerHTML =
      "<h2>Product not found!</h2>";
  }
});

async function fetchProductDetails(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`);
    const result = await response.json();

    if (result.success) {
      renderDetails(result.data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderDetails(product) {
  const container = document.getElementById("product-details");

  // ডিসকাউন্ট ক্যালকুলেশন
  const discount = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100,
  );

  container.innerHTML = `
        <div class="product-images">
            <div class="thumbnail-stack">
                <img src="${product.thumbnail}" class="thumb-img" onclick="changeImage('${product.thumbnail}')">
                ${product.images.map((img) => `<img src="${img}" class="thumb-img" onclick="changeImage('${img}')">`).join("")}
            </div>
            <div class="main-image-container">
                <img src="${product.thumbnail}" id="mainView" class="main-img">
            </div>
        </div>

        <div class="product-info">
            <h1 class="product-name">${product.name}</h1>
            <div class="rating">★★★★★ 157 Reviews</div>

            <div class="price-container">
                <span class="sale-price">$${product.salePrice}</span>
                <span class="reg-price">$${product.regularPrice}</span>
                <span class="discount-badge">Save ${discount}% right now</span>
            </div>

            <span class="details-title">Details</span>
            <p class="description">${product.description}</p>
            
            <p><strong>Category:</strong> ${product.categoryID ? product.categoryID.name : "N/A"}</p>
            <p><strong>Stock:</strong> ${product.stock > 0 ? "In Stock" : "Out of Stock"}</p>

            <div class="quantity-control">
                <button class="qty-btn" onclick="updateQty(-1)">-</button>
                <input type="text" value="1" id="qty" class="qty-input" readonly>
                <button class="qty-btn" onclick="updateQty(1)">+</button>
                <button class="add-to-cart-big">Add to Bag →</button>
            </div>
        </div>
    `;
}

// ... আগের কোড (fetchProductDetails ইত্যাদি) থাকবে ...

function renderDetails(product) {
  const container = document.getElementById("product-details");
  const discount = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100,
  );

  container.innerHTML = `
        <div class="product-images">
            <div class="thumbnail-stack">
                <img src="${product.thumbnail}" class="thumb-img" onclick="changeImage('${product.thumbnail}')">
                ${product.images.map((img) => `<img src="${img}" class="thumb-img" onclick="changeImage('${img}')">`).join("")}
            </div>
            <div class="main-image-container">
                <img src="${product.thumbnail}" id="mainView" class="main-img">
            </div>
        </div>

        <div class="product-info">
            <h1 class="product-name">${product.name}</h1>
            <div class="rating">★★★★★ 157 Reviews</div>

            <div class="price-container">
                <span class="sale-price">$${product.salePrice}</span>
                <span class="reg-price">$${product.regularPrice}</span>
                <span class="discount-badge">Save ${discount}% right now</span>
            </div>

            <span class="details-title">Details</span>
            <p class="description">${product.description}</p>
            
            <p><strong>Category:</strong> ${product.categoryID ? product.categoryID.name : "N/A"}</p>
            <p><strong>Stock:</strong> ${product.stock > 0 ? "In Stock" : "Out of Stock"}</p>

            <div class="quantity-control">
                <div class="qty-group">
                    <button class="qty-btn" onclick="updateQty(-1)">-</button>
                    <input type="text" value="1" id="qty" class="qty-input" readonly>
                    <button class="qty-btn" onclick="updateQty(1)">+</button>
                </div>
                <button class="add-to-cart-big" onclick="addToCart('${encodeURIComponent(JSON.stringify(product))}')">
                    Add to Bag &rarr;
                </button>
            </div>
        </div>
    `;
}

function addToCart(productData) {
  const product = JSON.parse(decodeURIComponent(productData));
  const selectedQty = parseInt(document.getElementById("qty").value);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex = cart.findIndex(
    (item) => item._id === product._id,
  );

  if (existingProductIndex > -1) {
    cart[existingProductIndex].qty += selectedQty;
  } else {
    const cartItem = {
      _id: product._id,
      name: product.name,
      salePrice: product.salePrice,
      thumbnail: product.thumbnail,
      qty: selectedQty,
      category: product.categoryID ? product.categoryID.name : "General",
    };
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${product.name} added to bag!`);

  updateCartCount();
}

function updateQty(val) {
  let qtyInput = document.getElementById("qty");
  let currentQty = parseInt(qtyInput.value);
  if (currentQty + val >= 1) {
    qtyInput.value = currentQty + val;
  }
}

function changeImage(src) {
  document.getElementById("mainView").src = src;
}

// ======================



const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
let selectedRating = 0;


const stars = document.querySelectorAll("#star-input i");
stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");
    stars.forEach((s, index) => {
      if (index < selectedRating) {
        s.classList.replace("fa-regular", "fa-solid");
      } else {
        s.classList.replace("fa-solid", "fa-regular");
      }
    });
  });
});


document.getElementById("review-submit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (selectedRating === 0) return alert("Please select a rating!");

  const reviewData = {
    productId: productId,
    rating: Number(selectedRating),
    comment: document.getElementById("review-comment").value,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/review/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    const result = await res.json();
    if (result.success) {
      alert("Review added!");
      location.reload();
    } else {
      alert(result.message); 
    }
  } catch (err) {
    console.error("Submit failed", err);
  }
});


async function loadReviews() {
  const list = document.getElementById("reviews-display-list");
  try {
    const res = await fetch(`${API_BASE_URL}/review/${productId}`);
    const result = await res.json();
    console.log("rviw data ", result)
    if (result.success) {
      document.querySelector(".review-count").innerText = `${result.count} Reviews`;
      list.innerHTML = result.data.map(review => `
        <div class="review-card">
          <div class="review-header">
            <img src="https://ui-avatars.com/api/?name=${review.user.name}&background=random" class="user-img">
            <div class="user-meta">
              <div class="review-rating">
                ${Array(5).fill(0).map((_, i) => `<i class="${i < review.rating ? 'fa-solid' : 'fa-regular'} fa-star"></i>`).join('')}
              </div>
              <span class="name">${review.user.name}</span>
              <span class="date">${new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <p>${review.comment}</p>
        </div>
      `).join('');
    }
  } catch (err) { console.error(err); }
}

document.addEventListener("DOMContentLoaded", loadReviews);