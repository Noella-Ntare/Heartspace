// Track login state
let isLoggedIn = false;
let currentUserName = "Guest";

// Firebase Auth state listener

auth.onAuthStateChanged(async (user) => {
  isLoggedIn = !!user;

  if (user) {
    try {
      const docSnap = await db.collection("users").doc(user.uid).get();
      const userName = docSnap.exists ? docSnap.data().name : user.displayName || "User";
      
      currentUserName = userName;
      setUserNameInUI(userName);
      
      console.log("User logged in:", userName);
      
     
      // Only navigate to dashboard if on landing page
      const landingPage = document.getElementById('landing-page');
      if (landingPage && landingPage.classList.contains('active')) {
        navigate('dashboard');  
      }

      // Close auth modal if open
      const authModal = document.getElementById('auth-modal');
      if (authModal && authModal.classList.contains('active')) {
        authModal.classList.remove('active');
      }
      
    } catch (err) {
      console.error("Error fetching user info:", err);
      currentUserName = user.displayName || "User";
      setUserNameInUI(currentUserName);
    }
  } else {
    currentUserName = "Guest";
    setUserNameInUI("Guest");
  }
});

// -------------------------------
// Signup function
// -------------------------------
function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  console.log("Signup attempt with name:", name); // Debug log

  if (!email || !password) {
    showToast("Email and password cannot be empty");
    return;
  }

  if (!name || name.trim() === "") {
    showToast("Please enter your name");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // 1️⃣ Update Firebase Auth profile with name
      await user.updateProfile({ displayName: name });

      // 2️⃣ Save name + email to Firestore
      await db.collection("users").doc(user.uid).set({
        name: name.trim(),
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log("User registered with name:", name); // Debug log

      showToast(`Welcome, ${name}! 🌿`);

      // 🔁 Force reload to ensure displayName is updated in Auth state
      await auth.currentUser.reload();
      
      currentUserName = name;
      setUserNameInUI(name);
      hideAuth();
      
      // Navigate to programs page
      navigate('dashboard');
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showToast("Signup failed: " + error.message);
    });
}

// -------------------------------
// Login function
// -------------------------------
function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Login attempt"); // Debug log

  if (!email || !password) {
    showToast("Email and password cannot be empty");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      const docSnap = await db.collection("users").doc(user.uid).get();
      const userName = docSnap.exists ? docSnap.data().name : user.displayName || "User";

      console.log("Login successful, user name:", userName); // Debug log

      currentUserName = userName;
      setUserNameInUI(userName);
      isLoggedIn = true;
      
      showToast("Logged in successfully!");
      hideAuth();
      
      // Navigate to programs page
      navigate('dashboard');
    })
    .catch((error) => {
      console.error("Login error:", error);
      showToast("Login failed: " + error.message);
    });
}

// -------------------------------
// Logout function
// -------------------------------
function handleLogout() {
  auth.signOut()
    .then(() => {
      isLoggedIn = false;
      currentUserName = "Guest";
      showToast("Logged out successfully");
      navigate('landing');
    })
    .catch((error) => {
      console.error("Logout error:", error);
      showToast("Error logging out: " + error.message);
    });
}

// -------------------------------
// Update displayed name and avatars
// -------------------------------

function updateDropdownName(name) {
  const nameEl = document.getElementById("dropdown-name");
  if (nameEl) nameEl.textContent = name || "Guest";
}

function setUserNameInUI(name) {
  console.log("Setting UI name to:", name); // Debug log
  
  // Get initials from name
  const initials = (name || "Guest")
    .split(" ")
    .map((s) => s[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  console.log("Initials:", initials); // Debug log

  // Update ALL avatar elements on the page
 const updateAvatars = () => {
    const avatarElements = document.querySelectorAll('.avatar, #user-avatar, #nav-avatar, .post-avatar');
    console.log("Found avatar elements:", avatarElements.length);
  
  avatarElements.forEach(el => {
    el.textContent = initials;
  });

  // Update text name displays
  const displayEl = document.getElementById("display-name");
  const profileEl = document.getElementById("profile-name");
  
  if (displayEl) displayEl.textContent = name || "Guest";
  if (profileEl) profileEl.textContent = name || "Guest";

  // Update dropdown name
  updateDropdownName(name);
}
  updateAvatars();

  setTimeout(updateAvatars, 100);
  setTimeout(updateAvatars, 500);
}

// -------------------------------
// Helper function to update current user display
// -------------------------------
function updateCurrentUserDisplay() {
  if (auth.currentUser) {
    db.collection("users").doc(auth.currentUser.uid).get()
      .then(docSnap => {
        const userName = docSnap.exists ? docSnap.data().name : auth.currentUser.displayName || "User";
        currentUserName = userName;
        setUserNameInUI(userName);
      })
      .catch(err => {
        console.error("Error fetching user info:", err);
        const userName = auth.currentUser.displayName || "User";
        currentUserName = userName;
        setUserNameInUI(userName);
      });
  } else {
    currentUserName = "Guest";
    setUserNameInUI("Guest");
  }
}

// Make it globally accessible
window.updateCurrentUserDisplay = updateCurrentUserDisplay;

// -------------------------------
// Avatar dropdown logic
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const avatarEl = document.querySelector('.avatar, #nav-avatar');
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

  // Logout from dropdown
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      handleLogout();
      if (dropdownEl) dropdownEl.classList.add("hidden");
    });
  }
});