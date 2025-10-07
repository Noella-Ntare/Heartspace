// Track login state
let isLoggedIn = false;

auth.onAuthStateChanged((user) => {
  isLoggedIn = !!user;
  renderNav(); // Update navigation UI based on login
});

// Signup function
function handleSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    toast("Email and password cannot be empty", "error");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      isLoggedIn = true;
      updateAuthModal(); // Hide modal
      toast("Signup successful!", "success");
    })
    .catch((error) => {
      toast(error.message, "error");
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
    .then((userCredential) => {
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
