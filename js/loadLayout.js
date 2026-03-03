

async function includeLayout() {
  try {
    const navRes = await fetch("/shared/navber.html");
    const footRes = await fetch("/shared/footer.html");

    if (!navRes.ok) throw new Error("Navbar not found");

    // ==========================
    // Inject Navbar
    // ==========================
    const navData = await navRes.text();
    document.getElementById("navbar-placeholder").innerHTML = navData;

    // ==========================
    // Inject Footer (optional)
    // ==========================
    if (footRes.ok) {
      const footData = await footRes.text();
      document.getElementById("footer-placeholder").innerHTML = footData;
    }

    console.log("Layout injected successfully.");

    // ==========================
    // IMPORTANT ORDER
    // ==========================
    // 1️ আগে localStorage থেকে UI দেখাও
    if (typeof updateUI === "function") {
      updateUI();
    }

    // 2️ তারপর backend session verify করো
    if (typeof checkAuth === "function") {
      await checkAuth();
    }
  } catch (error) {
    console.error("Layout loading error:", error);
  }
}

document.addEventListener("DOMContentLoaded", includeLayout);
