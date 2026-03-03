// ===============================
// Global Auth State
// ===============================
const savedUser = localStorage.getItem("user");

window.userState = {
  isLoggedIn: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : null,
};

// ===============================
// Set Auth State
// ===============================
function setAuthState(userData) {
  window.userState.isLoggedIn = true;
  window.userState.user = userData;

  localStorage.setItem("user", JSON.stringify(userData));

  updateUI();
}

// ===============================
// Update Navbar UI
// ===============================
// function updateUI() {
//   const container = document.getElementById("auth-status-container");

//   if (!container) return;

//   if (window.userState.isLoggedIn && window.userState.user) {
//     const user = window.userState.user;

//     container.innerHTML = `
//       <div style="display:flex;align-items:center;gap:10px;">
//         <span>Hi, ${user.name}</span>
//         <button onclick="logoutUser()"
//           style="cursor:pointer;background:#ff4757;color:white;border:none;padding:5px 10px;border-radius:4px;">
//           Logout
//         </button>
//       </div>
//     `;
//   } else {
//     container.innerHTML = `<a href="login.html" class="login-btn">Login</a>`;
//   }
// }

function updateUI() {
  const container = document.getElementById("auth-status-container");
  if (!container) return;

  if (window.userState.isLoggedIn && window.userState.user) {
    const user = window.userState.user;

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
      
        <button id="logout-btn"
          style="cursor:pointer;background:#ff4757;color:white;border:none;padding:5px 10px;border-radius:4px;">
          Logout
        </button>
      </div>
    `;

    // EventListener bind
    document.getElementById("logout-btn").addEventListener("click", logoutUser);
  } else {
    container.innerHTML = `<a href="login.html" class="login-btn">Login</a>`;
  }
}

// ===============================
// Check Server Session
// ===============================
async function checkAuth() {
  try {
    const response = await fetch("http://127.0.0.1:5001/api/auth/logged-user", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      setAuthState(result.data);
    } else {
      console.log("Session invalid from backend");
      // clearAuth() call করো না
    }
  } catch (error) {
    console.log("Network error, keeping local session");
  }
}

// ===============================
// Clear Auth
// ===============================
function clearAuth() {
  localStorage.removeItem("user");
  window.userState = { isLoggedIn: false, user: null };
  updateUI();
}

// ===============================
// Logout
// ===============================
async function logoutUser() {
  console.log("click logout fucntion");
  try {
    await fetch("http://127.0.0.1:5001/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.log("Logout API failed");
  }

  clearAuth();
  window.location.href = "login.html";
}
