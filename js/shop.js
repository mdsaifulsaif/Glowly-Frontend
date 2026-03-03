function toggleMenu() {
    const links = document.getElementById("filterLinks");
    const arrow = document.querySelector(".arrow-down");
    
    // 'show' ক্লাসটি টগল করবে
    links.classList.toggle("show");

    // অ্যারো বাটন অ্যানিমেশন (অপশনাল)
    if (links.classList.contains("show")) {
        arrow.style.transform = "rotate(180deg)";
    } else {
        arrow.style.transform = "rotate(0deg)";
    }
}

// মেনু আইটেমে ক্লিক করলে মেনু বন্ধ হয়ে যাবে (মোবাইলের জন্য)
document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.getElementById("filterLinks").classList.remove("show");
        }
    });
});