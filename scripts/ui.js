// Example: Add ARIA labels dynamically
function updateNavAria() {
  document.querySelectorAll("button").forEach(btn => {
    if (!btn.hasAttribute("aria-label")) {
      btn.setAttribute("aria-label", btn.innerText || "Button");
    }
  });
}
