// Fetch products with sorting support
// async function fetchProducts(
//   containerSelector,
//   limit = null,
//   page = 1,
//   sortType = "latest",
// ) {
//   const productGrid = document.querySelector(containerSelector);
//   if (!productGrid) return;

//   try {
//     let url = `${CONFIG.API_BASE_URL}/products?page=${page}&sort=${sortType}`;
//     if (limit) url += `&limit=${limit}`;

//     const response = await fetch(url);
//     const result = await response.json();

//     if (result.success) {
//       const products = result.data;
//       productGrid.innerHTML = "";

//       // Generate product cards
//       products.forEach((product) => {
//         const productHTML = `
//                     <div class="product-card">
//                         <div class="image-wrapper">
//                             <img src="${product.thumbnail}" alt="${product.name}" class="card-image" />
//                             <button class="add-to-cart-btn">
//                                 <img src="assets/icons/bag.svg" alt="" /> Add to Cart
//                             </button>
//                         </div>
//                         <div class="card-content">
//                             <span class="card-category">${product.categoryID ? product.categoryID.name : "General"}</span>
//                             <h3 class="card-title">${product.name}</h3>
//                             <p class="card-price">$${product.salePrice}</p>
//                             <div class="rating-container">
//                                 <span>4.9 ★</span> <span style="color: var(--text-muted)">(120)</span>
//                             </div>
//                         </div>
//                     </div>`;
//         productGrid.innerHTML += productHTML;
//       });

//       // Pagination
//       if (!limit && result.totalPages > 1) {
//         renderPagination(
//           result.totalPages,
//           result.currentPage,
//           containerSelector,
//           sortType, // Pass sortType
//         );
//       } else {
//         // Remove pagination if a limit is set or only 1 page exists
//         const oldPagination = document.querySelector(".pagination-container");
//         if (oldPagination) oldPagination.remove();
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     productGrid.innerHTML = "<p>Failed to load products.</p>";
//   }
// }

async function fetchProducts(
  containerSelector,
  limit = null,
  page = 1,
  sortType = "latest",
) {
  const productGrid = document.querySelector(containerSelector);
  if (!productGrid) return;

  try {
    let url = `${CONFIG.API_BASE_URL}/products?page=${page}&sort=${sortType}`;
    if (limit) url += `&limit=${limit}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      const products = result.data;
      productGrid.innerHTML = "";

      products.forEach((product) => {
        // onclick a event add kora ache click korlei details page a jabe
        const productHTML = `
                    <div class="product-card" onclick="window.location.href='product-details.html?id=${product._id}'" style="cursor: pointer;">
                        <div class="image-wrapper">
                            <img src="${product.thumbnail}" alt="${product.name}" class="card-image" />
                            <button class="add-to-cart-btn" onclick="window.location.href='product-details.html?id=${product._id}'">
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

      // Pagination Logic...
      if (!limit && result.totalPages > 1) {
        renderPagination(
          result.totalPages,
          result.currentPage,
          containerSelector,
          sortType,
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

// Pagination function
function renderPagination(totalPages, currentPage, selector, sortType) {
  let paginationHTML = `<div class="pagination-container" style="display:flex; gap:10px; margin-top:20px; justify-content:center;">`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
            <button onclick="fetchProducts('${selector}', null, ${i}, '${sortType}')" 
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

fetchProducts("#bestsellers", 4, 2, "random");
fetchProducts("#new-arrivale", 4, 1, "latest");
fetchProducts("#shop");
fetchProducts("#related-products", 4, 1, "random");

// fetchProducts(".product-grid", 4, "latest")
// category function

async function fetchCategories() {
  const categoryContainer = document.getElementById("category-container");

  try {
    const response = await fetch(
      `https://glowly-server.vercel.app/api/categories`,
    );
    const result = await response.json();

    if (result.success) {
      const filteredCategories = result.data.filter(
        (cat) => cat.name.toLowerCase() !== "test",
      );

      const categories = filteredCategories.slice(0, 4);

      console.log("Home page top 4 categories", categories);
      categoryContainer.innerHTML = "";

      categories.forEach((cat) => {
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

function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");

  if (!cartCountElement) {
    console.warn("Cart element not found yet, retrying...");
    setTimeout(updateCartCount, 100);
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((total, item) => total + item.qty, 0);

  console.log("Cart element found! Total Qty:", totalQty);

  cartCountElement.innerText = totalQty;
  cartCountElement.style.display = totalQty > 0 ? "flex" : "none";
}

console.log("total card ", updateCartCount());
