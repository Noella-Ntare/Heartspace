// Track login state
let isLoggedIn = false;

// Firebase Auth state listener
auth.onAuthStateChanged(async (user) => {
  isLoggedIn = !!user;

  if (user) {
    // Fetch user info from Firestore on refresh
    const docSnap = await db.collection("users").doc(user.uid).get();
    const userName = docSnap.exists ? docSnap.data().name : "User";
    setUserNameInUI(userName);
  } else {
    setUserNameInUI("Guest");
  }

  renderNav(); // Update navigation UI based on login
});

// Signup function
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
    return user.updateProfile({
      displayName: name
    }).then(() => {
      // 2️⃣ Save name + email to Firestore (optional but nice)
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  })
  .then(() => {
    console.log("User registered with name:", name);
    showToast(`Welcome, ${name}! 🌿`);
  })
  .catch((error) => {
    console.error("Signup error:", error);
    showToast("Signup failed: " + error.message, "error");
  });
  
auth.onAuthStateChanged((user) => {
  if (user) {
    const displayName = user.displayName || "Guest";

    document.getElementById("display-name").textContent = displayName;
    document.getElementById("dropdown-name").textContent = displayName;

    // Also update avatar initials
    const initials = displayName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
    document.getElementById("nav-avatar").textContent = initials;
  }
});
}

// Login function
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

      // Fetch name from Firestore
      const docSnap = await db.collection("users").doc(user.uid).get();
      const userName = docSnap.exists ? docSnap.data().name : "User";

      // Update UI
      setUserNameInUI(userName);

      isLoggedIn = true;
      updateAuthModal();
      toast("Logged in successfully!", "success");
    })
    .catch((error) => {
      toast(error.message, "error");
    });
}

// Logout function
function handleLogout() {
  auth.signOut().then(() => {
    isLoggedIn = false;
    toast("Logged out successfully", "success");
    navigate("home"); // Redirect to home page
  });
}

// Update displayed name and avatars
function setUserNameInUI(name) {
  const displayEl = document.getElementById('display-name');
  const profileEl = document.getElementById('profile-name');
  const navAvatarEl = document.getElementById('nav-avatar');
  const profileAvatarEl = document.getElementById('profile-avatar-large');

  if (displayEl) displayEl.textContent = name || 'Guest';
  if (profileEl) profileEl.textContent = name || 'Guest';

  const initials = (name || 'JD').split(' ')
    .map(s => s[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (navAvatarEl) navAvatarEl.textContent = initials || 'JD';
  if (profileAvatarEl) profileAvatarEl.textContent = initials || 'JD';
}

// -------------------------------
// Avatar dropdown logic
// -------------------------------

// Elements
const avatarEl = document.getElementById('nav-avatar');
const dropdownEl = document.getElementById('profile-dropdown');
const logoutBtn = document.getElementById('logout-btn');

// Toggle dropdown visibility when avatar is clicked
if (avatarEl && dropdownEl) {
  avatarEl.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownEl.classList.toggle('hidden');
  });

  // Close dropdown if clicking outside
  document.addEventListener('click', (e) => {
    if (!avatarEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.classList.add('hidden');
    }
  });
}

// Update name inside dropdown
function updateDropdownName(name) {
  const nameEl = document.getElementById('dropdown-name');
  if (nameEl) nameEl.textContent = name || 'Guest';
}

// Modify existing setUserNameInUI to also update dropdown
const originalSetUserNameInUI = setUserNameInUI;
setUserNameInUI = function(name) {
  originalSetUserNameInUI(name);
  updateDropdownName(name);
};

// Logout from dropdown
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    handleLogout();
    dropdownEl.classList.add('hidden');
  });
}

function renderNav() {
  console.log("Navigation updated (placeholder)");
}
