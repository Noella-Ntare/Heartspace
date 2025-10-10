// Track login state
let isLoggedIn = false;

// Firebase Auth state listener
auth.onAuthStateChanged(async (user) => {
  isLoggedIn = !!user;

  if (user) {
    try {
      // Fetch user info from Firestore (for display name)
      const docSnap = await db.collection("users").doc(user.uid).get();
      const userName = docSnap.exists ? docSnap.data().name : user.displayName || "User";
      setUserNameInUI(userName);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUserNameInUI(user.displayName || "User");
    }
  } else {
    setUserNameInUI("Guest");
  }

  renderNav(); // Update navigation UI based on login

    if (user) {
    // If user is logged in, show the dashboard or main page
    renderProgramsPage(); // or renderDashboard();
  } else {
    // If logged out, show landing page
    // (optional — if your landing page is index.html)
    if (window.location.pathname !== "/index.html") {
      window.location.href = "index.html";
    }
  }

});

// -------------------------------
// Signup function
// -------------------------------
function handleSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const name = document.getElementById("name").value;

  if (!email || !password) {
    toast("Email and password cannot be empty", "error");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // 1️⃣ Update Firebase Auth profile with name
      await user.updateProfile({ displayName: name });

      // 2️⃣ Save name + email to Firestore
      await db.collection("users").doc(user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log("User registered with name:", name);
      showToast(`Welcome, ${name}! 🌿`);

      // 🔁 Force reload to ensure displayName is updated in Auth state
      await auth.currentUser.reload();
      setUserNameInUI(name);
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showToast("Signup failed: " + error.message, "error");
    });
}

// -------------------------------
// Login function
// -------------------------------
function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    toast("Email and password cannot be empty", "error");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      const docSnap = await db.collection("users").doc(user.uid).get();
      const userName = docSnap.exists ? docSnap.data().name : user.displayName || "User";

      setUserNameInUI(userName);
      isLoggedIn = true;
      updateAuthModal();
      toast("Logged in successfully!", "success");
    })
    .catch((error) => {
      toast(error.message, "error");
    });
}

// -------------------------------
// Logout function
// -------------------------------
function handleLogout() {
  auth.signOut()
    .then(() => {
      isLoggedIn = false;
      toast("Logged out successfully", "success");
      window.location.href = "index.html"; // Redirect to landing page
    })
    .catch((error) => {
      console.error("Logout error:", error);
      toast("Error logging out: " + error.message, "error");
    });
}

// -------------------------------
// Update displayed name and avatars
// -------------------------------
function setUserNameInUI(name) {
  const displayEl = document.getElementById("display-name");
  const profileEl = document.getElementById("profile-name");
  const navAvatarEl = document.getElementById("nav-avatar");
  const profileAvatarEl = document.getElementById("profile-avatar-large");

  if (displayEl) displayEl.textContent = name || "Guest";
  if (profileEl) profileEl.textContent = name || "Guest";

  const initials = (name || "JD")
    .split(" ")
    .map((s) => s[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (navAvatarEl) navAvatarEl.textContent = initials || "JD";
  if (profileAvatarEl) profileAvatarEl.textContent = initials || "JD";
}

// -------------------------------
// Avatar dropdown logic
// -------------------------------
const avatarEl = document.getElementById("nav-avatar");
const dropdownEl = document.getElementById("profile-dropdown");
const logoutBtn = document.getElementById("logout-btn");

// Toggle dropdown
if (avatarEl && dropdownEl) {
  avatarEl.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownEl.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!avatarEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.classList.add("hidden");
    }
  });
}

function updateDropdownName(name) {
  const nameEl = document.getElementById("dropdown-name");
  if (nameEl) nameEl.textContent = name || "Guest";
}

// Extend setUserNameInUI to also update dropdown
const originalSetUserNameInUI = setUserNameInUI;
setUserNameInUI = function (name) {
  originalSetUserNameInUI(name);
  updateDropdownName(name);
};

// Logout from dropdown
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    handleLogout();
    if (dropdownEl) dropdownEl.classList.add("hidden");
  });
}

function renderNav() {
  console.log("Navigation updated (placeholder)");
}
