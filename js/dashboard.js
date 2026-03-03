
const BASE_URL = "http://127.0.0.1:5001/api";

// ================= Auth Guard =================
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return (window.location.href = "login.html");

  const user = JSON.parse(savedUser);
  if (user.role !== "admin") {
    alert("Access Denied!");
    return (window.location.href = "index.html");
  }

  // load default view
  loadView("overview", document.querySelector(".nav-item.active"));
});

// ================= Views =================
const views = {
  overview: `
    <h2>Dashboard Overview</h2>
    <div class="stats-grid">
      <div class="stat-card"><h3>Total Products</h3><p id="stat-p-count">...</p></div>
      <div class="stat-card"><h3>Orders</h3><p>0</p></div>
      <div class="stat-card"><h3>Categories</h3><p id="stat-c-count">...</p></div>
    </div>
  `,
  "add-category": `
    <h2>Manage Category</h2>
    <div class="grid-layout">
      <div class="form-container">
        <h3>Create Category</h3>
        <div class="form-group"><label>Category Name</label><input type="text" id="catName"></div>
        <div class="form-group"><label>Category Image</label><input type="file" id="catImageFile"></div>
        <button class="btn" onclick="handleCategorySubmit()">Save Category</button>
      </div>
      <div>
        <table>
          <thead><tr><th>Image</th><th>Name</th><th>Date</th><th></th><th>Action</th></tr></thead>
          <tbody id="categoryList"></tbody>
        </table>
        <div id="catPagination" class="pagination"></div>
      </div>
    </div>
  `,
  "add-product": `
    <h2>Product Management</h2>
    <div class="grid-layout">
      <div class="form-container">
        <h3>Add New Product</h3>
        <div class="form-grid">
          <div class="form-group"><label>Name</label><input type="text" id="pName"></div>
          <div class="form-group"><label>Category</label><select id="pCategory"></select></div>
          <div class="form-group"><label>Regular Price</label><input type="number" id="pRegPrice"></div>
          <div class="form-group"><label>Sale Price</label><input type="number" id="pSalePrice"></div>
          <div class="form-group"><label>Stock Count</label><input type="number" id="pStock"></div>
          <div class="form-group"><label>Thumbnail</label><input type="file" id="pThumbnail"></div>
          <div class="form-group full-width"><label>Description</label><textarea id="pDesc"></textarea></div>
          <div class="form-group full-width"><label>Multiple Images</label><input type="file" id="pImages" multiple></div>
        </div>
        <button class="btn" onclick="handleProductSubmit()">Publish Product</button>
      </div>
      <div>
        <h3>All Products List</h3>
        <table>
          <thead><tr><th>Image</th><th>Name</th><th>Reg Price</th><th>Stock</th><th>Action</th></tr></thead>
          <tbody id="productList"></tbody>
        </table>
        <div id="prodPagination" class="pagination"></div>
      </div>
    </div>
  `,
};

// ================= Navigation =================
function loadView(viewName, element) {
  const displayArea = document.getElementById("dashboard-view");
  displayArea.innerHTML = views[viewName] || "<h2>Not Found</h2>";

  if (element) {
    document
      .querySelectorAll(".nav-item")
      .forEach((item) => item.classList.remove("active"));
    element.classList.add("active");
  }

  // Load extra data
  if (viewName === "add-category") fetchCategories();
  if (viewName === "add-product") {
    loadCategoryDropdown();
    fetchProducts();
  }
}

// ================= Category APIs =================
async function handleCategorySubmit() {
  const name = document.getElementById("catName").value;
  const imageFile = document.getElementById("catImageFile").files[0];
  if (!name || !imageFile) return alert("Please fill all fields!");

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", imageFile);

  try {
    const res = await fetch(`${BASE_URL}/create-category`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      alert("Category Saved!");
      fetchCategories();
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchCategories(page = 1) {
  const res = await fetch(`${BASE_URL}/categories?page=${page}&limit=5`, {
    credentials: "include",
  });
  const result = await res.json();
  if (result.success) {
    renderTable("categoryList", result.data, "category");
    renderPagination(
      "catPagination",
      result.totalPages,
      result.currentPage,
      "fetchCategories",
    );
  }
}

// ================= Product APIs =================
async function handleProductSubmit() {
  const formData = new FormData();
  formData.append("name", document.getElementById("pName").value);
  formData.append("description", document.getElementById("pDesc").value);
  formData.append("regularPrice", document.getElementById("pRegPrice").value);
  formData.append("salePrice", document.getElementById("pSalePrice").value);
  formData.append("categoryID", document.getElementById("pCategory").value);
  formData.append("stock", document.getElementById("pStock").value);

  const thumbnail = document.getElementById("pThumbnail").files[0];
  if (thumbnail) formData.append("thumbnail", thumbnail);

  const images = document.getElementById("pImages").files;
  for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

  try {
    const res = await fetch(`${BASE_URL}/create-product`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.ok) {
      alert("Product Published!");
      fetchProducts();
    } else alert("Error publishing product!");
  } catch (err) {
    console.error(err);
  }
}

async function fetchProducts(page = 1) {
  const res = await fetch(`${BASE_URL}/products?page=${page}&limit=5`, {
    credentials: "include",
  });
  const result = await res.json();
  if (result.success) {
    renderTable("productList", result.data, "product");
    renderPagination(
      "prodPagination",
      result.totalPages,
      result.currentPage,
      "fetchProducts",
    );
  }
}

// ================= Helpers =================
function renderTable(elementId, data, type) {
  const tbody = document.getElementById(elementId);
  if (!tbody) return;
  tbody.innerHTML = data
    .map(
      (item) => `
    <tr>
      <td><img src="${item.thumbnail || item.image}" class="table-img"></td>
      <td>${item.name}</td>
      <td>${type === "product" ? "$" + item.regularPrice : item.createdAt.split("T")[0]}</td>
      <td>${type === "product" ? item.stock : "-"}</td>
      <td><button class="del-btn" onclick="deleteItem('${type}','${item._id}')">Delete</button></td>
    </tr>
  `,
    )
    .join("");
}

function renderPagination(elementId, total, current, funcName) {
  const container = document.getElementById(elementId);
  if (!container) return;
  container.innerHTML = Array.from(
    { length: total },
    (_, i) =>
      `<button style="margin:2px; padding:5px 10px; cursor:pointer; background:${i + 1 === current ? "#333" : "#fff"}; color:${i + 1 === current ? "#fff" : "#333"}" onclick="${funcName}(${i + 1})">${i + 1}</button>`,
  ).join("");
}

async function loadCategoryDropdown() {
  const res = await fetch(`${BASE_URL}/categories`, { credentials: "include" });
  const result = await res.json();
  const select = document.getElementById("pCategory");
  if (select && result.success)
    select.innerHTML = result.data
      .map((c) => `<option value="${c._id}">${c.name}</option>`)
      .join("");
}

async function deleteItem(type, id) {
  if (!confirm("Are you sure?")) return;
  const api =
    type === "category"
      ? `${BASE_URL}/delete-cat/${id}`
      : `${BASE_URL}/product-delete/${id}`;
  const res = await fetch(api, { method: "DELETE", credentials: "include" });
  if (res.ok) type === "category" ? fetchCategories() : fetchProducts();
}

// ================= Logout =================
function logoutUser() {
  fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  }).finally(() => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
