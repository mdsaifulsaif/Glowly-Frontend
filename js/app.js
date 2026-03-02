// get product function
async function fetchProducts(containerSelector, limit = null, page = 1) {
  const productGrid = document.querySelector(containerSelector);
  if (!productGrid) return;

  try {

    let url = `${CONFIG.API_BASE_URL}/products?page=${page}`;
    if (limit) url += `&limit=${limit}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      const products = result.data;
      productGrid.innerHTML = "";

      products.forEach((product) => {
        const productHTML = `
                    <div class="product-card">
                        <div class="image-wrapper">
                            <img src="${product.thumbnail}" alt="${product.name}" class="card-image" />
                            <button class="add-to-cart-btn">
                                <img src="assets/icons/bag.svg" alt="" /> Add to Cart
                            </button>
                        </div>
                        <div class="card-content">
                            <span class="card-category">${product.categoryID ? product.categoryID.name : "General"}</span>
                            <h3 class="card-title">${product.name}</h3>
                            <p class="card-price">$${product.salePrice}</p>
                            <div class="rating-container">
                                <span>4.9 ★</span> <span style="color: var(--text-muted)">(120)</span>
                            </div>
                        </div>
                    </div>`;
        productGrid.innerHTML += productHTML;
      });

      if (!limit && result.totalPages > 1) {
        renderPagination(
          result.totalPages,
          result.currentPage,
          containerSelector,
        );
      } else {

        const oldPagination = document.querySelector(".pagination-container");
        if (oldPagination) oldPagination.remove();
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}


// pagantion fucntion
function renderPagination(totalPages, currentPage, selector) {
  let paginationHTML = `<div class="pagination-container" style="display:flex; gap:10px; margin-top:20px; justify-content:center;">`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
            <button onclick="fetchProducts('${selector}', null, ${i})" 
                    style="padding: 8px 16px; cursor:pointer; background: ${i === currentPage ? "var(--primary-color)" : "#fff"}; color: ${i === currentPage ? "#fff" : "#000"}; border: 1px solid #ddd;">
                ${i}
            </button>`;
  }
  paginationHTML += `</div>`;

  const gridElement = document.querySelector(selector);
  const existingPagination = document.querySelector(".pagination-container");
  if (existingPagination) existingPagination.remove();
  gridElement.insertAdjacentHTML("afterend", paginationHTML);
}

fetchProducts(".product-grid", 4);

// category function
async function fetchCategories() {
  const categoryContainer = document.getElementById("category-container");

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/categories`);
    const result = await response.json();

    if (result.success) {
      const categories = result.data;
      categoryContainer.innerHTML = "";

      categories.forEach((cat) => {
        if (cat.name.toLowerCase() === "test") return;
        const catHTML = `
                    <div class="category-card">
                        <img src="${cat.image}" alt="${cat.name}">
                        <div class="category-overlay">
                            <h3 class="category-name">${cat.name}</h3>
                        </div>
                    </div>
                `;
        categoryContainer.insertAdjacentHTML("beforeend", catHTML);
      });
    }
  } catch (error) {
    console.error("Category Fetch Error:", error);
    categoryContainer.innerHTML = "<p>Failed to load categories.</p>";
  }
}
fetchCategories();













