function toast(message, type = "info") {
  const toastEl = document.createElement("div");
  toastEl.className = `toast toast-${type}`;
  toastEl.innerText = message;
  document.body.appendChild(toastEl);

  setTimeout(() => toastEl.remove(), 3000);
}
