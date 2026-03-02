// ১. এপিআই ইউআরএল (তোমার বেস ইউআরএল অনুযায়ী চেঞ্জ করো)
const API_URL = "http://localhost:5001/api/products";

// ২. প্রোডাক্ট লোড করার মেইন ফাংশন
async function fetchProducts() {
  const productGrid = document.querySelector(".product-grid");

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      const products = result.data;

      // গ্রিড খালি করা (যদি আগে কোনো ডামি ডাটা থাকে)
      productGrid.innerHTML = "";

      // ৩. লুপ চালিয়ে প্রতিটি প্রোডাক্টের কার্ড তৈরি করা
      products.forEach((product) => {
        const productHTML = `
                    <div class="product-card">
                        <div class="image-wrapper">
                            <img
                                src="${product.thumbnail}"
                                alt="${product.name}"
                                class="card-image"
                            />
                            <button class="add-to-cart-btn">
                                <img src="assets/icons/bag.svg" alt="" /> Add to Cart
                            </button>
                        </div>
                        <div class="card-content">
                            <span class="card-category">${product.categoryID ? product.categoryID.name : "General"}</span>
                            <h3 class="card-title">${product.name}</h3>
                            <p class="card-price">$${product.salePrice}</p>
                            <div class="rating-container">
                                <span>4.9</span>
                                <span class="star">★</span>
                                <span style="color: var(--text-muted)">(120)</span>
                            </div>
                        </div>
                    </div>
                `;

        // গ্রিডে কার্ডটি যোগ করা
        productGrid.innerHTML += productHTML;
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
  }
}

// ৪. পেজ লোড হলে ফাংশনটি কল করা
document.addEventListener("DOMContentLoaded", fetchProducts);
