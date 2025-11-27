// ========== STATE MANAGEMENT ==========
let currentPage = 'landing';
let isLoginMode = true;
let selectedCategory = 'All';

const categories = ['All', 'Painting', 'Photography', 'Digital Art', 'Sculpture', 'Mixed Media', 'Drawing'];

// ========== AUTH MODAL FUNCTIONS ==========
function showLogin() {
  isLoginMode = true;
  updateAuthModal();
  document.getElementById('auth-modal').classList.add('active');
}

function showSignup() {
  isLoginMode = false;
  updateAuthModal();
  document.getElementById('auth-modal').classList.add('active');
}

function hideAuth() {
  document.getElementById('auth-modal').classList.remove('active');
}

function updateAuthModal() {
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleBtn = document.getElementById('auth-toggle');
  const nameField = document.getElementById('name-field');
  
  if (isLoginMode) {
    title.textContent = 'Welcome Back';
    subtitle.textContent = 'Continue your healing journey';
    submitBtn.textContent = 'Sign In';
    toggleBtn.textContent = "Don't have an account? Sign up";
    nameField.style.display = 'none';
  } else {
    title.textContent = 'Join the Community';
    subtitle.textContent = 'Start your transformation today';
    submitBtn.textContent = 'Sign Up';
    toggleBtn.textContent = 'Already have an account? Sign in';
    nameField.style.display = 'block';
  }
}

// ========== TOAST NOTIFICATION ==========
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// ========== USER DISPLAY ==========
function updateCurrentUserDisplay() {
  const user = getCurrentUser();
  if (user) {
    // Get initials
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Update display name in dashboard
    const displayName = document.getElementById('display-name');
    if (displayName) {
      displayName.textContent = user.name;
    }
    
    // Update all avatar elements
    const avatars = document.querySelectorAll('.avatar, #nav-avatar, #user-avatar, .post-avatar');
    avatars.forEach(avatar => {
      avatar.textContent = initials;
    });
    
    // Update dropdown name
    const dropdownName = document.getElementById('dropdown-name');
    if (dropdownName) {
      dropdownName.textContent = user.name;
    }
  }
}

// ========== NAVIGATION ==========
function navigate(page) {
  console.log("Navigating to:", page);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const pageElement = document.getElementById(`${page}-page`);
  if (pageElement) {
    pageElement.classList.add('active');
    currentPage = page;
    
    // Update nav links - remove all active classes first
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Render page content based on which page
    if (page === 'programs') {
      console.log("Rendering programs page...");
      renderProgramsPage();
      updateCurrentUserDisplay();
    } else if (page === 'community') {
      renderCommunityPage();
      updateCurrentUserDisplay();
    } else if (page === 'gallery') {
      renderGalleryPage();
      updateCurrentUserDisplay();
    } else if (page === 'profile') {
      renderProfilePage();
    } else if (page === 'dashboard') {
      updateCurrentUserDisplay();
      loadDashboardData();
    }
    
    // IMPORTANT: Initialize hamburger menu after page renders
    setTimeout(() => {
      setupPageListeners();
      initializeHamburgerMenu();
    }, 100);
  } else {
    console.error("Page element not found:", `${page}-page`);
  }
}

// ========== DASHBOARD DATA ==========
async function loadDashboardData() {
  // Show loading overlay on dashboard
  showDashboardLoading();
  
  loadProgramProgress();
  
  // Calculate active programs
  const activePrograms = programs.filter(p => calculateProgramProgress(p.id) > 0).length;
  
  // Calculate total completed chapters
  let completedChapters = 0;
  programs.forEach(program => {
    if (program.chapters) {
      completedChapters += program.chapters.filter(ch => 
        isChapterCompleted(program.id, ch.id)
      ).length;
    }
  });
  
  // Get artworks count
  const artworksResult = await getArtworks();
  const user = getCurrentUser();
  const myArtworks = artworksResult.success ? 
    artworksResult.data.filter(a => a.user.id === user.id).length : 0;
  
  // Get posts count
  const postsResult = await getPosts();
  const myPosts = postsResult.success ? 
    postsResult.data.filter(p => p.user.id === user.id).length : 0;
  
  // Update stats cards
  const statsCards = document.querySelectorAll('.stat-card');
  if (statsCards.length >= 3) {
    statsCards[0].querySelector('.stat-value').textContent = activePrograms || 0;
    statsCards[1].querySelector('.stat-value').textContent = completedChapters || 0;
    statsCards[2].querySelector('.stat-value').textContent = myPosts || 0;
    
    // Update labels
    statsCards[0].querySelector('.stat-label').textContent = 'Active Programs';
    statsCards[1].querySelector('.stat-label').textContent = 'Completed Chapters';
    statsCards[2].querySelector('.stat-label').textContent = 'Community Posts';
  }
  
  // Update programs list
  const programsList = document.querySelector('.programs-list');
  if (programsList) {
    programsList.innerHTML = '';
    
    // Get top 3 programs with progress
    const programsWithProgress = programs
      .map(p => ({ ...p, progress: calculateProgramProgress(p.id) }))
      .filter(p => p.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
    
    if (programsWithProgress.length === 0) {
      programsList.innerHTML = '<p class="text-muted-foreground">No active programs yet. <button class="text-link" onclick="navigate(\'programs\')">Start a program</button></p>';
    } else {
      programsWithProgress.forEach(program => {
        const programItem = document.createElement('div');
        programItem.className = 'program-item hover-lift';
        programItem.style.cursor = 'pointer';
        programItem.onclick = () => {
          navigate('programs');
          setTimeout(() => openProgram(program.id), 100);
        };
        
        programItem.innerHTML = `
          <div class="program-icon" style="background-color: ${program.color};">${program.icon}</div>
          <div class="program-details">
            <div class="program-header">
              <h4>${program.name}</h4>
              <span class="text-sm text-muted-foreground">${program.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${program.progress}%; background: ${program.color};"></div>
            </div>
          </div>
        `;
        programsList.appendChild(programItem);
      });
    }
  }
  
  // Load and display sessions
  await loadDashboardSessions();
  
  // Hide loading overlay
  hideDashboardLoading();
}

function showDashboardLoading() {
  // Create loading overlay if it doesn't exist
  let overlay = document.getElementById('dashboard-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dashboard-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(8px);
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #ec4899;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        "></div>
        <p style="color: #6b7280; font-size: 1rem;">Loading your dashboard...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = 'flex';
  }
}

function hideDashboardLoading() {
  const overlay = document.getElementById('dashboard-loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

async function loadDashboardSessions() {
  const sessionsList = document.querySelector('.sessions-list');
  if (!sessionsList) return;
  
  console.log("Loading dashboard sessions...");
  
  // Use API instead of localStorage
  const result = await getSessions();
  if (!result.success) {
    console.error("Failed to load sessions:", result.error);
    sessionsList.innerHTML = '<p class="text-muted-foreground">Failed to load sessions.</p>';
    return;
  }
  
  const sessions = result.data;
  const user = getCurrentUser();
  
  console.log("All sessions from API:", sessions);
  console.log("Current user:", user);
  
  if (!sessions || sessions.length === 0) {
    sessionsList.innerHTML = '<p class="text-muted-foreground">No sessions yet. <button class="text-link" onclick="navigate(\'community\'); setTimeout(() => switchCommunityTab(\'sessions\'), 100)">Create or join one</button></p>';
    return;
  }
  
  // Filter: sessions user is attending or created, and upcoming only
  const now = new Date();
  const upcomingSessions = sessions
    .filter(s => {
      // Parse session date - handle both formats
      let sessionDate;
      try {
        // If date is already a Date object or ISO string
        sessionDate = new Date(s.date);
        
        // If time is separate, we need to combine them
        if (s.time) {
          const dateStr = sessionDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
          sessionDate = new Date(`${dateStr}T${s.time}`);
        }
      } catch (e) {
        console.error("Error parsing date:", e, s);
        return false;
      }
      
      // Check if user is the creator OR is in attendees list
      const isCreator = s.userId === user.id;
      const isAttendee = s.attendees && s.attendees.some(a => a.userId === user.id);
      const isUpcoming = sessionDate > now;
      
      console.log(`Session "${s.title}":`, { 
        isCreator, 
        isAttendee, 
        isUpcoming,
        sessionDate: sessionDate.toISOString(),
        now: now.toISOString(),
        userId: s.userId,
        currentUserId: user.id,
        attendees: s.attendees
      });
      
      return isUpcoming && (isCreator || isAttendee);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    })
    .slice(0, 3);
  
  console.log("Filtered upcoming sessions:", upcomingSessions);
  
  sessionsList.innerHTML = '';
  
  if (upcomingSessions.length === 0) {
    sessionsList.innerHTML = '<p class="text-muted-foreground">No upcoming sessions. <button class="text-link" onclick="navigate(\'community\'); setTimeout(() => switchCommunityTab(\'sessions\'), 100)">Create or join one</button></p>';
    return;
  }
  
  upcomingSessions.forEach(session => {
    let sessionDate = new Date(session.date);
    if (session.time) {
      const dateStr = sessionDate.toISOString().split('T')[0];
      sessionDate = new Date(`${dateStr}T${session.time}`);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const sessionDay = new Date(sessionDate);
    sessionDay.setHours(0, 0, 0, 0);
    
    let dateText;
    if (sessionDay.getTime() === today.getTime()) {
      dateText = 'Today';
    } else if (sessionDay.getTime() === tomorrow.getTime()) {
      dateText = 'Tomorrow';
    } else {
      dateText = sessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
    
    const timeText = sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const sessionItem = document.createElement('div');
    sessionItem.className = 'session-item hover-lift';
    sessionItem.style.cursor = 'pointer';
    sessionItem.onclick = () => {
      navigate('community');
      setTimeout(() => switchCommunityTab('sessions'), 100);
    };
    
    sessionItem.innerHTML = `
      <h4 class="text-sm mb-1">${session.title}</h4>
      <p class="text-xs text-muted-foreground mb-2">${dateText} at ${timeText}</p>
      <div class="session-attendees">
        <svg class="attendee-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>${session.attendees ? session.attendees.length : 0} attending</span>
      </div>
    `;
    sessionsList.appendChild(sessionItem);
  });
}

// ========== HAMBURGER MENU ==========
function initializeHamburgerMenu() {
  console.log("Initializing hamburger menu...");
  
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  console.log("Toggle button:", mobileMenuToggle);
  console.log("Nav links:", navLinks);
  
  if (mobileMenuToggle && navLinks) {
    // Remove old listeners to avoid duplicates
    const newToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
    
    newToggle.addEventListener('click', function(e) {
      console.log("Hamburger clicked!");
      e.stopPropagation();
      
      const isActive = navLinks.classList.contains('active');
      console.log("Menu is currently:", isActive ? "active" : "inactive");
      
      navLinks.classList.toggle('active');
      newToggle.classList.toggle('active');
      
      console.log("Menu is now:", navLinks.classList.contains('active') ? "active" : "inactive");
    });
    
    // Close menu when clicking nav links
    const navLinkButtons = navLinks.querySelectorAll('.nav-link');
    navLinkButtons.forEach(link => {
      link.addEventListener('click', function() {
        console.log("Nav link clicked, closing menu");
        navLinks.classList.remove('active');
        newToggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-content')) {
        navLinks.classList.remove('active');
        newToggle.classList.remove('active');
      }
    });
    
    console.log("Hamburger menu initialized successfully");
  } else {
    console.error("Could not find hamburger menu elements!");
  }
}

function hideUploadModal() {
  document.getElementById('upload-modal').classList.remove('active');
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  
  // Check if user is logged in
  if (isLoggedIn()) {
    navigate('dashboard');
  } else {
    navigate('landing');
  }
  
  // Setup auth form handler ONCE
  setupAuthForm();
});

// Separate function to setup auth form
function setupAuthForm() {
  const authForm = document.getElementById('auth-form');
  if (authForm && !authForm.dataset.listenerAttached) {
    authForm.dataset.listenerAttached = 'true';
    
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const name = document.getElementById('name').value;
      
      let result;
      
      if (isLoginMode) {
        // Login
        result = await signin(email, password);
        
        if (result.success) {
          hideAuth();
          navigate('dashboard');
          showToast('Welcome back!');
        } else {
          showToast(result.error);
        }
      } else {
        // Signup
        if (!name) {
          showToast('Please enter your name');
          return;
        }
        
        result = await signup(email, password, name);
        
        if (result.success) {
          hideAuth();
          navigate('dashboard');
          showToast('Account created successfully!');
        } else {
          showToast(result.error);
        }
      }
    });
  }
}


// ========== DASHBOARD LISTENERS ==========
function setupPageListeners() {
  console.log("Setting up page listeners...");
  
  // Setup avatar dropdown
  const navAvatar = document.getElementById('nav-avatar');
  const dropdown = document.getElementById('profile-dropdown');
  
  console.log("Nav avatar:", navAvatar);
  console.log("Dropdown:", dropdown);
  
  if (navAvatar && dropdown) {
    // Remove the hidden class if it exists
    dropdown.classList.remove('hidden');
    dropdown.style.display = 'none';
    
    // Remove existing listener by cloning
    const newAvatar = navAvatar.cloneNode(true);
    navAvatar.parentNode.replaceChild(newAvatar, navAvatar);
    
    console.log("Setting up click listener on new avatar");
    newAvatar.addEventListener('click', (e) => {
      console.log("Avatar clicked!");
      e.stopPropagation();
      e.preventDefault();
      
      // Remove hidden class and toggle display
      dropdown.classList.remove('hidden');
      
      // Toggle display directly instead of using class
      if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        console.log("Dropdown now showing");
      } else {
        dropdown.style.display = 'none';
        console.log("Dropdown now hidden");
      }
    });
    
    // Close dropdown when clicking outside
    const clickOutsideHandler = (e) => {
      if (dropdown && !e.target.closest('.nav-user')) {
        dropdown.style.display = 'none';
        console.log("Dropdown closed by clicking outside");
      }
    };
    
    // Remove old listeners and add new one
    document.removeEventListener('click', clickOutsideHandler);
    setTimeout(() => {
      document.addEventListener('click', clickOutsideHandler);
    }, 100);
  } else {
    console.error("Could not find nav-avatar or profile-dropdown!");
  }
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log("Setting up logout button");
    
    // Remove any existing listeners
    logoutBtn.onclick = null;
    
    // Add new listener
    logoutBtn.addEventListener('click', function(e) {
      console.log("Logout clicked");
      e.preventDefault();
      e.stopPropagation();
      
      // Clear all user data directly
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userLocation');
      localStorage.removeItem('userBio');
      localStorage.removeItem('programProgress');
      
      console.log("User data cleared");
      
      // Navigate to landing
      navigate('landing');
      showToast('Signed out successfully');
    });
  } else {
    console.error("Could not find logout button!");
  }
}

// Profile Edit Functions
window.enterProfileEditMode = function() {
  console.log("Entering edit mode...");
  document.getElementById('name-display').style.display = 'none';
  document.getElementById('name-input').style.display = 'block';
  document.getElementById('location-display').style.display = 'none';
  document.getElementById('location-input').style.display = 'block';
  document.getElementById('bio-display').style.display = 'none';
  document.getElementById('bio-input').style.display = 'block';
  document.getElementById('edit-profile-btn').style.display = 'none';
  document.getElementById('profile-button-group').style.display = 'flex';
};

window.cancelProfileEdit = function() {
  console.log("Canceling edit...");
  const user = getCurrentUser();
  document.getElementById('name-input').value = user.name;
  
  // Get saved values or use defaults
  const savedLocation = localStorage.getItem('userLocation') || 'Not set';
  const savedBio = localStorage.getItem('userBio') || 'On a journey of healing and self-discovery. 🌱';
  
  document.getElementById('location-input').value = savedLocation;
  document.getElementById('bio-input').value = savedBio;
  
  document.getElementById('name-display').style.display = 'block';
  document.getElementById('name-input').style.display = 'none';
  document.getElementById('location-display').style.display = 'block';
  document.getElementById('location-input').style.display = 'none';
  document.getElementById('bio-display').style.display = 'block';
  document.getElementById('bio-input').style.display = 'none';
  document.getElementById('edit-profile-btn').style.display = 'block';
  document.getElementById('profile-button-group').style.display = 'none';
};

window.saveProfileChanges = function() {
  console.log("Saving profile changes...");
  const newName = document.getElementById('name-input').value;
  const newLocation = document.getElementById('location-input').value;
  const newBio = document.getElementById('bio-input').value;
  
  // Update localStorage
  const user = getCurrentUser();
  user.name = newName;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userLocation', newLocation);
  localStorage.setItem('userBio', newBio);
  
  // Update display
  document.getElementById('name-display').textContent = newName;
  document.getElementById('location-display').textContent = newLocation;
  document.getElementById('bio-display').textContent = newBio;
  document.getElementById('profile-display-name').textContent = newName;
  
  // Update avatar with new initials
  const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const avatars = document.querySelectorAll('.avatar, #nav-avatar');
  avatars.forEach(avatar => {
    avatar.textContent = initials;
  });
  
  cancelProfileEdit();
  showToast('Profile updated successfully!');
  updateCurrentUserDisplay();
};

// Profile sign out function
window.handleProfileSignout = function() {
  // Clear all user data
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('userLocation');
  localStorage.removeItem('userBio');
  localStorage.removeItem('programProgress');
  
  // Navigate to landing
  navigate('landing');
  showToast('Signed out successfully');
};

async function loadProfileStats() {
  console.log("Loading profile stats...");
  
  // Count active programs (programs with progress > 0)
  loadProgramProgress();
  const activePrograms = programs.filter(p => calculateProgramProgress(p.id) > 0).length;
  
  // Count completed chapters
  let completedChapters = 0;
  programs.forEach(program => {
    if (program.chapters) {
      completedChapters += program.chapters.filter(ch => 
        isChapterCompleted(program.id, ch.id)
      ).length;
    }
  });
  
  // Get artworks count
  const artworksResult = await getArtworks();
  const user = getCurrentUser();
  const myArtworks = artworksResult.success ? 
    artworksResult.data.filter(a => a.user.id === user.id).length : 0;
  
  // Get posts count  
  const postsResult = await getPosts();
  const myPosts = postsResult.success ? 
    postsResult.data.filter(p => p.user.id === user.id).length : 0;
  
  console.log("Stats:", { activePrograms, completedChapters, myArtworks, myPosts });
  
  // Update individual stat elements
  const statActivePrograms = document.getElementById('stat-active-programs');
  const statCompletedChapters = document.getElementById('stat-completed-chapters');
  const statArtworksShared = document.getElementById('stat-artworks-shared');
  const statCommunityPosts = document.getElementById('stat-community-posts');
  
  if (statActivePrograms) statActivePrograms.textContent = activePrograms;
  if (statCompletedChapters) statCompletedChapters.textContent = completedChapters;
  if (statArtworksShared) statArtworksShared.textContent = myArtworks;
  if (statCommunityPosts) statCommunityPosts.textContent = myPosts;
}

// ========== PROFILE PAGE ==========
function renderProfilePage() {
  console.log("renderProfilePage called");
  const user = getCurrentUser();
  if (!user) {
    console.log("No user found, navigating to landing");
    navigate('landing');
    return;
  }

  // Check if profile page exists, if not create it
  let profilePage = document.getElementById('profile-page');
  console.log("Profile page element:", profilePage);
  
  if (!profilePage) {
    console.log("Profile page not found, creating it...");
    profilePage = document.createElement('div');
    profilePage.id = 'profile-page';
    profilePage.className = 'page';
    document.body.appendChild(profilePage);
  }
  
  console.log("Rendering profile page content...");
  
  // Get user initials
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Get saved profile data
  const savedLocation = localStorage.getItem('userLocation') || 'Not set';
  const savedBio = localStorage.getItem('userBio') || 'On a journey of healing and self-discovery. 🌱';
  
  profilePage.innerHTML = `
    <!-- Navigation -->
     <class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-logo">
              <div class="logo-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="font-semibold">HeArtSpace</span>
            </div>

 <!-- Hamburger Menu Button -->
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button<nav>

            <div class="nav-links">
              <button class="nav-link" onclick="navigate('dashboard')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </button>
              <button class="nav-link" onclick="navigate('programs')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                Programs
              </button>
              <button class="nav-link" onclick="navigate('community')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Community
              </button>
              <button class="nav-link" onclick="navigate('gallery')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                </svg>
                Gallery
              </button>
            </div>
          </div>
          <div class="nav-user" style="position: relative;">
            <div id="nav-avatar" class="avatar clickable">${initials}</div>
            <div id="profile-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: white; border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 0.5rem; min-width: 200px; z-index: 1000;">
              <p id="dropdown-name" class="dropdown-name" style="padding: 0.5rem 1rem; font-weight: 600; border-bottom: 1px solid #e5e7eb;">${user.name}</p>
              <button class="dropdown-link" onclick="navigate('profile')" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; border-radius: 0.25rem; transition: background 0.2s;">View Profile</button>
              <button id="logout-btn" class="dropdown-link logout" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; color: #dc2626; border-radius: 0.25rem; transition: background 0.2s;">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-8 px-4">
        <div>
            <h1 class="page-title" style="font-size: 2.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                Your Profile
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" stroke-width="2">
                    <path d="M12 3l1.545 4.755L18 9.27l-4.455 3.24L15.09 21 12 17.755 8.91 21l1.545-8.49L6 9.27l4.455-1.515L12 3z"/>
                </svg>
            </h1>
            <p class="page-subtitle" style="color: #6b7280; margin-bottom: 2rem;">Manage your personal information and journey preferences</p>
        </div>

        <div style="display: grid; gap: 2rem; grid-template-columns: 1fr;">
            <!-- Profile Card -->
            <div>
                <div class="card" style="text-align: center;">
                    <div style="position: relative; display: inline-block; margin-bottom: 1.5rem;">
                        <div style="width: 128px; height: 128px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); background: linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: 600; margin: 0 auto;">
                            ${initials}
                        </div>
                    </div>

                    <div style="font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;" id="profile-display-name">
                        ${user.name}
                    </div>

                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; font-size: 0.875rem; color: #4b5563;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span>${user.email}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; font-size: 0.875rem; color: #4b5563;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>Joined ${new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <!-- Journey Stats -->
                <div style="display: grid; gap: 1rem; margin-top: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(187, 247, 208, 0.6) 0%, rgba(134, 239, 172, 0.6) 100%); border: 1px solid #86efac;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; background: rgba(74, 222, 128, 0.3);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937;" id="stat-active-programs">0</div>
                        <p style="font-size: 0.875rem; color: #374151;">Active Programs</p>
                    </div>

                    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(251, 207, 232, 0.6) 0%, rgba(249, 168, 212, 0.6) 100%); border: 1px solid #f9a8d4;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; background: rgba(244, 114, 182, 0.3);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#be185d" stroke-width="2">
                                <path d="M12 3l1.545 4.755L18 9.27l-4.455 3.24L15.09 21 12 17.755 8.91 21l1.545-8.49L6 9.27l4.455-1.515L12 3z"/>
                            </svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937;" id="stat-completed-chapters">0</div>
                        <p style="font-size: 0.875rem; color: #374151;">Chapters Completed</p>
                    </div>

                    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(191, 219, 254, 0.6) 0%, rgba(147, 197, 253, 0.6) 100%); border: 1px solid #93c5fd;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; background: rgba(96, 165, 250, 0.3);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937;" id="stat-artworks-shared">0</div>
                        <p style="font-size: 0.875rem; color: #374151;">Artworks Shared</p>
                    </div>

                    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(254, 215, 170, 0.6) 0%, rgba(253, 186, 116, 0.6) 100%); border: 1px solid #fdba74;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 0.75rem; background: rgba(251, 146, 60, 0.3);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #1f2937;" id="stat-community-posts">0</div>
                        <p style="font-size: 0.875rem; color: #374151;">Community Posts</p>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: grid; gap: 2rem; grid-template-columns: 1fr; margin-top: 2rem;">
            <!-- Edit Profile Section -->
            <div>
                <div class="card">
                    <div style="margin-bottom: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h2 style="font-size: 1.5rem; font-weight: 600; color: #1f2937;">Personal Information</h2>
                            <button class="btn btn-outline" id="edit-profile-btn" onclick="enterProfileEditMode()">Edit Profile</button>
                        </div>

                        <div style="display: grid; gap: 1.5rem; margin-bottom: 1.5rem;">
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="font-size: 0.875rem; font-weight: 500; color: #374151;">Full Name</label>
                                <div id="name-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; color: #1f2937;">${user.name}</div>
                                <input type="text" id="name-input" style="display: none; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 1rem;" value="${user.name}">
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="font-size: 0.875rem; font-weight: 500; color: #374151;">Email Address</label>
                                <div style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; color: #1f2937;">${user.email}</div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="font-size: 0.875rem; font-weight: 500; color: #374151;">Location</label>
                                <div id="location-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; color: #1f2937;">${savedLocation}</div>
                                <input type="text" id="location-input" style="display: none; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 1rem;" placeholder="e.g., San Francisco, CA" value="${savedLocation}">
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <label style="font-size: 0.875rem; font-weight: 500; color: #374151;">About Me</label>
                                <div id="bio-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; color: #1f2937;">${savedBio}</div>
                                <textarea id="bio-input" style="display: none; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 1rem; resize: none; min-height: 120px;" placeholder="Share your journey and what brings you to HeArtSpace...">${savedBio}</textarea>
                            </div>
                        </div>

                        <div id="profile-button-group" style="display: none; gap: 0.75rem; margin-top: 1.5rem;">
                            <button class="btn btn-primary" onclick="saveProfileChanges()" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 500; cursor: pointer; border: none; background: linear-gradient(135deg, #f472b6 0%, #c084fc 100%); color: white;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-right: 0.5rem;">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Save Changes
                            </button>
                            <button class="btn btn-outline" onclick="cancelProfileEdit()" style="flex: 1; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 500; cursor: pointer; background: white; border: 1px solid #d1d5db; color: #374151;">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Sign Out Section -->
        <div style="margin-top: 2rem;">
            <div class="card" style="text-align: center; padding: 2rem;">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;">Sign Out</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 0.875rem;">You'll need to sign in again to access your account</p>
                <button class="btn" onclick="handleProfileSignout()" style="padding: 0.75rem 2rem; border-radius: 9999px; font-weight: 500; cursor: pointer; border: 1px solid #dc2626; background: white; color: #dc2626; transition: all 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-right: 0.5rem;">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    </div>
  `;

  // Setup event listeners for profile page
  updateCurrentUserDisplay();
  loadProfileStats();
  setupPageListeners();
}

// ========== PROGRAMS PAGE ==========

// Programs data - MOVED OUTSIDE THE FUNCTION!
const programs = [
  {
    id: 1,
    name: 'Emotional Wellness',
    description: 'Build emotional resilience and inner peace',
    duration: '21 days',
    level: 'Beginner',
    enrolled: true,
    progress: 0,
    participants: 234,
    icon: '💚',
    color: '#A8C3A0',
    modules: 21,
    chapters: [
      {
        id: 'ew-1',
        title: 'Understanding Your Emotions',
        description: 'Learn to identify and name your emotional experiences',
        duration: '15 min'
      },
      {
        id: 'ew-2',
        title: 'Emotional Regulation Techniques',
        description: 'Practical tools for managing overwhelming feelings',
        duration: '20 min'
      },
      {
        id: 'ew-3',
        title: 'Building Emotional Resilience',
        description: 'Strengthen your ability to bounce back',
        duration: '18 min'
      },
      {
        id: 'ew-4',
        title: 'Healthy Emotional Expression',
        description: 'Communicate your feelings constructively',
        duration: '22 min'
      },
      {
        id: 'ew-5',
        title: 'Cultivating Inner Peace',
        description: 'Create lasting emotional balance',
        duration: '25 min'
      }
    ]
  },
  {
    id: 2,
    name: 'Self-Love Mastery',
    description: 'Develop deep self-compassion and confidence',
    duration: '30 days',
    level: 'Intermediate',
    enrolled: true,
    progress: 0,
    participants: 189,
    icon: '✨',
    color: '#D9A7A0',
    modules: 30,
    chapters: [
      {
        id: 'sl-1',
        title: 'The Foundation of Self-Love',
        description: 'Discover what self-love truly means',
        duration: '16 min'
      },
      {
        id: 'sl-2',
        title: 'Releasing Self-Judgment',
        description: 'Let go of harsh inner criticism',
        duration: '19 min'
      },
      {
        id: 'sl-3',
        title: 'Self-Care as a Practice',
        description: 'Create sustainable self-care rituals',
        duration: '21 min'
      },
      {
        id: 'sl-4',
        title: 'Setting Loving Boundaries',
        description: 'Honor your needs in relationships',
        duration: '23 min'
      },
      {
        id: 'sl-5',
        title: 'Embodying Self-Love Daily',
        description: 'Integrate self-love into your life',
        duration: '20 min'
      }
    ]
  },
  {
    id: 3,
    name: 'Authentic Expression',
    description: 'Embrace your true self and voice your truth',
    duration: '6 weeks',
    level: 'All Levels',
    enrolled: true,
    progress: 0,
    participants: 312,
    icon: '⭐',
    color: '#CFE6F5',
    modules: 42,
    chapters: [
      {
        id: 'ae-1',
        title: 'Discovering Your Authentic Self',
        description: 'Uncover who you truly are',
        duration: '17 min'
      },
      {
        id: 'ae-2',
        title: 'Breaking Free from Masks',
        description: 'Release personas that no longer serve you',
        duration: '20 min'
      },
      {
        id: 'ae-3',
        title: 'Finding Your Voice',
        description: 'Speak your truth with confidence',
        duration: '22 min'
      },
      {
        id: 'ae-4',
        title: 'Living Authentically',
        description: 'Align actions with your core values',
        duration: '24 min'
      },
      {
        id: 'ae-5',
        title: 'Embracing Your Uniqueness',
        description: 'Celebrate what makes you special',
        duration: '19 min'
      }
    ]
  }
];

// State for programs
let selectedProgram = null;
let selectedChapter = null;
let programProgress = {};

// Load progress from localStorage
function loadProgramProgress() {
  const saved = localStorage.getItem('programProgress');
  if (saved) {
    programProgress = JSON.parse(saved);
  }
}

// Save progress
function saveProgramProgress() {
  localStorage.setItem('programProgress', JSON.stringify(programProgress));
}

// Check if chapter is completed
function isChapterCompleted(programId, chapterId) {
  return programProgress[programId]?.[chapterId] || false;
}

// Mark chapter as complete
function completeChapter(programId, chapterId) {
  if (!programProgress[programId]) {
    programProgress[programId] = {};
  }
  programProgress[programId][chapterId] = true;
  saveProgramProgress();
  renderProgramChapters();
  showToast('Chapter completed! 🎉');
}

// Calculate program progress
function calculateProgramProgress(programId) {
  const program = programs.find(p => p.id === programId);
  if (!program || !program.chapters) return 0;
  
  const completed = program.chapters.filter(ch => 
    isChapterCompleted(programId, ch.id)
  ).length;
  
  return Math.round((completed / program.chapters.length) * 100);
}

// Render Programs Page
function renderProgramsPage() {
  console.log("renderProgramsPage called");
  const programsPage = document.getElementById('programs-page');
  
  if (!programsPage) {
    console.error("Programs page element not found!");
    return;
  }
  
  console.log("Programs page element found, rendering content...");
  
  programsPage.innerHTML = `
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-logo">
              <div class="logo-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="font-semibold">HeArtSpace</span>
            </div>

 <!-- Hamburger Menu Button -->
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div class="nav-links">
              <button class="nav-link" onclick="navigate('dashboard')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </button>
              <button class="nav-link active" onclick="navigate('programs')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                Programs
              </button>
              <button class="nav-link" onclick="navigate('community')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Community
              </button>
              <button class="nav-link" onclick="navigate('gallery')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                </svg>
                Gallery
              </button>
            </div>
          </div>
          <div class="nav-user" style="position: relative;">
            <div id="nav-avatar" class="avatar clickable">JD</div>
           <div id="profile-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: white; border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 0.5rem; min-width: 200px; z-index: 1000;">
    <p id="dropdown-name" class="dropdown-name" style="padding: 0.5rem 1rem; font-weight: 600; border-bottom: 1px solid #e5e7eb;">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; border-radius: 0.25rem; transition: background 0.2s;">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; color: #dc2626; border-radius: 0.25rem; transition: background 0.2s;">Sign Out</button>
  </div>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="container py-8 px-4">
      <!-- Header -->
      <div class="mb-8 fade-in-up">
        <h1 class="mb-2">Your Healing Programs</h1>
        <p class="text-muted-foreground">
          Choose a program to begin or continue your journey
        </p>
      </div>

      <!-- Programs View -->
      <div id="programs-view" class="programs-grid"></div>

      <!-- Chapters View -->
      <div id="chapters-view" style="display: none;">
        <button class="btn btn-ghost mb-6" onclick="backToPrograms()">
          ← Back to Programs
        </button>
        <div id="program-header"></div>
        <div id="chapters-list" class="mt-6"></div>
      </div>

      <!-- Chapter Content View -->
      <div id="content-view" style="display: none;">
        <button class="btn btn-ghost mb-6" onclick="backToChapters()">
          ← Back to Chapters
        </button>
        <div id="chapter-content"></div>
      </div>
    </div>
  `;

  updateCurrentUserDisplay();
  loadProgramProgress();
  renderProgramsList();
  
  // Setup listeners after a short delay to ensure DOM is ready
  setTimeout(() => {
    setupPageListeners();
  }, 100);
}

// Render Programs List
function renderProgramsList() {
  const container = document.getElementById('programs-view');
  if (!container) return;
  
  container.innerHTML = '';

  programs.forEach(program => {
    const progressPercent = calculateProgramProgress(program.id);
    
    const card = document.createElement('div');
    card.className = 'program-card-new';
    card.style.backgroundColor = program.color;
    card.style.cursor = 'pointer';
    
    // Icon SVG based on program
    let iconSvg = '';
    if (program.name === 'Emotional Wellness') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`;
    } else if (program.name === 'Self-Love Mastery') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>`;
    }
    
    card.innerHTML = `
      <div class="program-card-icon">
        ${iconSvg}
      </div>
      <div class="program-card-content">
        <h3 class="program-card-title">${program.name}</h3>
        <p class="program-card-description">${program.description}</p>
      </div>
      <div class="program-card-footer">
        <div class="program-card-progress-label">
          <span>Progress</span>
          <span>${progressPercent}%</span>
        </div>
        <div class="program-card-chapters">${program.chapters.length} chapters</div>
      </div>
    `;
    
    card.addEventListener('click', () => openProgram(program.id));
    container.appendChild(card);
  });
}

// Open Program (show chapters)
function openProgram(programId) {
  selectedProgram = programs.find(p => p.id === programId);
  if (!selectedProgram) return;

  document.getElementById('programs-view').style.display = 'none';
  document.getElementById('chapters-view').style.display = 'block';
  document.getElementById('content-view').style.display = 'none';

  renderProgramChapters();
}

// Render Program Chapters
function renderProgramChapters() {
  if (!selectedProgram) return;

  const headerContainer = document.getElementById('program-header');
  const chaptersContainer = document.getElementById('chapters-list');
  
  const progressPercent = calculateProgramProgress(selectedProgram.id);
  const completedCount = selectedProgram.chapters.filter(ch => 
    isChapterCompleted(selectedProgram.id, ch.id)
  ).length;

  // Header
  headerContainer.innerHTML = `
    <div class="program-detail-header" style="background: linear-gradient(135deg, ${selectedProgram.color}20, ${selectedProgram.color}40); padding: 30px; border-radius: 16px;">
      <div style="font-size: 3rem; margin-bottom: 16px;">${selectedProgram.icon}</div>
      <h1 class="mb-2">${selectedProgram.name}</h1>
      <p class="text-muted-foreground mb-4">${selectedProgram.description}</p>
      <div class="program-stats">
        <span>📚 ${selectedProgram.chapters.length} chapters</span>
        <span>⏱️ ${selectedProgram.duration}</span>
        <span>✅ ${completedCount} completed</span>
      </div>
      <div class="progress-section mt-4">
        <div class="progress-header">
          <span>Overall Progress</span>
          <span>${progressPercent}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressPercent}%; background: ${selectedProgram.color};"></div>
        </div>
      </div>
    </div>
  `;

  // Chapters
  chaptersContainer.innerHTML = '';
  selectedProgram.chapters.forEach((chapter, index) => {
    const isCompleted = isChapterCompleted(selectedProgram.id, chapter.id);
    
    const chapterCard = document.createElement('div');
    chapterCard.className = 'chapter-card';
    chapterCard.style.cursor = 'pointer';
    
    chapterCard.innerHTML = `
      <div class="chapter-number" style="background: ${isCompleted ? selectedProgram.color : '#e0e0e0'}; color: ${isCompleted ? 'white' : '#666'};">
        ${isCompleted ? '✓' : index + 1}
      </div>
      <div class="chapter-info">
        <h3>${chapter.title}</h3>
        <p class="text-muted-foreground">${chapter.description}</p>
        <div class="chapter-meta">
          <span>⏱️ ${chapter.duration}</span>
          ${isCompleted ? '<span class="badge" style="background: ' + selectedProgram.color + '20; color: ' + selectedProgram.color + ';">Completed</span>' : ''}
        </div>
      </div>
    `;
    
    chapterCard.addEventListener('click', () => openChapter(chapter.id));
    chaptersContainer.appendChild(chapterCard);
  });
}

// Open Chapter Content
function openChapter(chapterId) {
  console.log("Opening chapter:", chapterId);
  selectedChapter = selectedProgram.chapters.find(ch => ch.id === chapterId);
  if (!selectedChapter) {
    console.error("Chapter not found:", chapterId);
    return;
  }

  document.getElementById('programs-view').style.display = 'none';
  document.getElementById('chapters-view').style.display = 'none';
  document.getElementById('content-view').style.display = 'block';

  renderChapterContent();
  
  // Scroll to top when opening a new chapter
  window.scrollTo(0, 0);
}

// Chapter content library
const chapterContent = {
  // Emotional Wellness chapters
  'ew-1': {
    intro: `Imagine this: a soft, warm room filled with quiet light. The kind that invites you to breathe a little slower, to unclench your jaw, to simply be. This is where your feelings live — the full spectrum of them. You don't have to analyze or fix them here. You're only here to visit, to listen, to meet what's already been waiting for your attention.`,
    body: `Maybe you notice a trace of sadness that lingers at the edge of your chest, or perhaps a spark of joy you didn't realize was still glowing beneath your ribs. Every feeling carries a message, but not all messages need to be decoded immediately. Some only ask to be acknowledged.

It's natural to resist or label emotions as "good" or "bad." But when you allow yourself to meet your feelings rather than manage them, something magical happens — they soften. They become less overwhelming and more like gentle waves you can float on instead of fight against.`,
    exercise: `Close your eyes for a moment and visualize that feeling as a color, a shape, or a word. Draw it or write it down. Let it live on paper, safely outside of you — not as something to fix, but something to understand.`,
    reflection: `What feeling visited you today? Where in your body did it show up — in your shoulders, your chest, your stomach, your throat?`
  },
  'ew-2': {
    intro: `There are moments when emotions feel like storms — sudden, intense, and impossible to control. Your heart races, your thoughts spiral, and you feel like you're drowning in your own feelings. But here's the truth: you are not your emotions. You are the sky that holds the storm.`,
    body: `Emotional regulation isn't about suppressing what you feel. It's about learning to ride the waves with grace. When big feelings arise, your body is trying to protect you, even if it doesn't feel that way. The key is to work with your nervous system, not against it.

Breathing is your superpower. When you slow your breath, you send a signal to your brain that says, "I'm safe." Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8. Feel how your body responds. This simple practice can shift you from chaos to calm in moments.`,
    exercise: `Practice the STOP technique: Stop what you're doing. Take three deep breaths. Observe what you're feeling without judgment. Proceed with intention. Write down one situation this week where you can use this technique.`,
    reflection: `When was the last time you felt overwhelmed by emotion? What would it feel like to respond to that moment with compassion instead of criticism?`
  },
  'ew-3': {
    intro: `Resilience isn't about being unbreakable. It's about bending without breaking, falling and rising again, knowing that storms pass and the sun always returns. You've survived every difficult moment in your life so far — that alone is proof of your incredible strength.`,
    body: `Building emotional resilience is like strengthening a muscle. Each time you face a challenge and choose to show up anyway, you're building that muscle. Each time you acknowledge your pain without letting it define you, you grow stronger.

Think of resilience as your inner roots. The deeper they grow, the stronger you stand when life's winds blow. These roots are built through self-compassion, healthy connections, and the belief that you have the capacity to handle what comes your way.`,
    exercise: `Create a "Resilience Toolkit" — list 5 things that help you feel grounded when life gets tough. It could be a song, a person to call, a walk in nature, journaling, or a comforting ritual. Keep this list somewhere visible.`,
    reflection: `Think of a time you overcame something difficult. What inner strengths did you use? How can you call on those strengths today?`
  },
  'ew-4': {
    intro: `Your feelings are valid. All of them. Even the messy ones, the complicated ones, the ones that make you uncomfortable. But valid doesn't mean they need to control your actions or relationships. Learning to express emotions in healthy ways is one of the most powerful gifts you can give yourself.`,
    body: `Many of us learned to suppress our emotions or express them explosively. Neither serves us well. Healthy emotional expression is about finding the middle ground — being honest about what you feel while respecting yourself and others.

Use "I" statements: "I feel hurt when..." instead of "You always..." This shifts from blame to sharing your experience. It opens doors instead of slamming them. Practice saying what you need: "I need some time to process this" or "I need reassurance right now." Your needs matter.`,
    exercise: `Write a letter to someone (you don't have to send it) expressing something you've held back. Notice what emotions arise as you write. This practice helps you understand what you truly feel and need.`,
    reflection: `What emotion do you find hardest to express? What would it feel like to share that emotion in a safe, healthy way?`
  },
  'ew-5': {
    intro: `Inner peace isn't something you find once and keep forever. It's a practice, a daily return to center, a gentle reminder that you are more than your circumstances. Peace lives in the quiet moments — in your morning coffee, in a deep breath, in choosing stillness over chaos.`,
    body: `Cultivating inner peace means creating small rituals that anchor you. Maybe it's five minutes of meditation, a gratitude practice, or simply sitting in silence before the day begins. These moments aren't luxuries — they're necessities.

Peace also means accepting what you cannot control and releasing what no longer serves you. It's the art of letting go, again and again, until your hands are light enough to hold joy. When you stop fighting reality and start flowing with it, you discover a calm that external circumstances cannot disturb.`,
    exercise: `Create a "Peace Anchor" — a simple ritual you can do daily. It might be lighting a candle while setting an intention, doing gentle stretches, or writing three things you're grateful for. Commit to this practice for 7 days and notice how you feel.`,
    reflection: `If your life had more inner peace, what would change? What small step can you take today toward that vision?`
  },

  // Self-Love Mastery chapters
  'sl-1': {
    intro: `Self-love isn't selfish. It's not narcissistic. It's not about perfection or always feeling good about yourself. Self-love is the radical act of treating yourself with the same kindness, patience, and compassion you'd offer to someone you deeply care about.`,
    body: `We often confuse self-love with self-esteem. Self-esteem fluctuates based on achievements and external validation. Self-love is unconditional — it's there on your best days and your worst days. It's the voice that says, "You're worthy, simply because you exist."

Self-love means recognizing your inherent value, not because of what you do, but because of who you are. It's about meeting yourself where you are, with all your imperfections and humanness, and saying, "You're enough."`,
    exercise: `Stand in front of a mirror and say: "I am worthy of love and belonging exactly as I am." Notice any resistance that comes up. This isn't about believing it immediately — it's about practicing the words until they become true.`,
    reflection: `What would change in your life if you truly believed you were worthy of love? What stories would you need to release?`
  },
  'sl-2': {
    intro: `That voice in your head — the one that criticizes every mistake, magnifies every flaw, and keeps a running list of your failures — it's not protecting you. It's holding you hostage. Learning to release self-judgment is one of the most liberating things you'll ever do.`,
    body: `Self-judgment often stems from internalized messages we received growing up. Maybe you were told you weren't good enough, smart enough, or worthy enough. Those messages became the lens through which you see yourself. But they're not truth — they're just old programming.

When that critical voice appears, pause. Ask yourself: "Would I say this to a friend?" If not, why do you say it to yourself? Practice self-compassion instead. "I made a mistake, and that's okay. I'm learning and growing." Replace judgment with curiosity.`,
    exercise: `Keep a "Self-Compassion Journal" for one week. When you catch yourself in self-judgment, write down what you said to yourself, then rewrite it with compassion. Notice the difference in how each version makes you feel.`,
    reflection: `What harsh judgment do you carry about yourself? What would happen if you let it go?`
  },
  'sl-3': {
    intro: `Self-care isn't bubble baths and face masks (though those are nice). Real self-care is saying no when you mean no. It's going to therapy. It's setting boundaries. It's eating nourishing food and moving your body in ways that feel good. It's choosing rest over productivity.`,
    body: `Self-care is about creating a life that you don't need to escape from. It's the small, daily choices that honor your well-being — getting enough sleep, drinking water, taking breaks, asking for help. These aren't indulgences; they're how you sustain yourself.

Create a self-care practice that's sustainable, not performative. What do you actually need? Maybe it's quiet mornings, creative time, or regular connection with loved ones. Self-care looks different for everyone. What matters is that it replenishes you, not depletes you.`,
    exercise: `Create a "Weekly Self-Care Menu" with different categories: Physical (movement, rest), Emotional (journaling, therapy), Social (quality time), Creative (art, music), and Spiritual (meditation, nature). Pick one thing from each category to do this week.`,
    reflection: `What does your body, mind, and soul need right now? What's one way you can honor that need today?`
  },
  'sl-4': {
    intro: `Boundaries are not walls; they're bridges to healthier relationships. They're the practice of honoring your limits, protecting your energy, and teaching people how to treat you. Boundaries aren't about pushing people away — they're about creating space for authentic connection.`,
    body: `Many of us struggle with boundaries because we fear rejection or conflict. We say yes when we mean no. We tolerate behavior that hurts us. We give until we're empty. But here's the truth: people who love you will respect your boundaries. Those who don't... well, that tells you everything you need to know.

Setting boundaries is an act of self-love. "I can't take on that project right now." "I need some alone time to recharge." "That doesn't work for me." These phrases aren't selfish — they're honest. And honesty creates space for genuine relationships.`,
    exercise: `Identify one area where you need better boundaries (work, family, friendships, social media). Write down a specific boundary you want to set and how you'll communicate it. Practice saying it out loud until it feels natural.`,
    reflection: `Where in your life are you giving more than you have? What boundary would help you feel more respected and valued?`
  },
  'sl-5': {
    intro: `Self-love isn't a destination you reach and stay at forever. It's a daily practice, a returning to yourself, a choice to honor your worth even when the world tells you otherwise. Embodying self-love means integrating it into every aspect of your life — your choices, your relationships, your daily rituals.`,
    body: `Living from a place of self-love transforms everything. You stop seeking external validation because you've found it within. You stop tolerating mistreatment because you know your worth. You stop abandoning yourself to please others because you've learned that your needs matter too.

Self-love is reflected in how you speak to yourself, how you care for your body, how you spend your time, who you surround yourself with, and what you allow in your life. It's the quiet confidence that says, "I am enough, and I choose to live accordingly."`,
    exercise: `Create a "Self-Love Declaration" — a personal manifesto of how you'll treat yourself going forward. Include statements like "I will honor my needs," "I will speak kindly to myself," "I will set boundaries that protect my peace." Read it daily.`,
    reflection: `One year from now, how do you want to feel about yourself? What daily practices will help you get there?`
  },

  // Authentic Expression chapters
  'ae-1': {
    intro: `Underneath all the masks, the expectations, and the roles you play, there's a version of you that's been waiting to be seen. Your authentic self — the one who knows what you truly want, feel, and need. Discovering this self isn't about becoming someone new; it's about remembering who you've always been.`,
    body: `Society teaches us to hide parts of ourselves that don't fit. We learn to be smaller, quieter, or different to be accepted. But in doing so, we lose touch with our authentic essence. Rediscovering your authentic self means questioning: "What do I actually believe? What do I genuinely enjoy? What matters to me?"

Your authentic self speaks in whispers — in the things that light you up, the boundaries that feel necessary, the dreams you're afraid to voice. Start listening to these whispers. They're guiding you home to yourself.`,
    exercise: `Complete these sentences honestly (don't censor yourself): "I feel most like myself when..." "I've been pretending that..." "If I were truly authentic, I would..." "What I really want is..." Notice what surprises you.`,
    reflection: `When do you feel most like yourself? What parts of yourself have you been hiding, and why?`
  },
  'ae-2': {
    intro: `We all wear masks — carefully crafted personas that help us navigate the world. The "strong one," the "nice one," the "successful one." These masks protected us once, but now they're suffocating. It's time to let them fall and reveal the tender, imperfect, beautiful human underneath.`,
    body: `Your masks were survival strategies. Maybe you learned to be the peacekeeper to avoid conflict, or the overachiever to feel worthy, or the comedian to deflect pain. These roles served a purpose. But you're safe now to show up as you truly are.

Dropping the mask doesn't mean becoming reckless or unfiltered. It means being honest about who you are, what you feel, and what you need. It means saying "I don't know" instead of pretending. It means admitting vulnerability instead of projecting strength you don't feel.`,
    exercise: `Identify one mask you wear regularly. Journal about: Why did you create this mask? What are you afraid will happen if you drop it? What would it feel like to show up without it? Choose one small way to be more authentic this week.`,
    reflection: `Who would you be if you weren't afraid of judgment? What mask are you ready to release?`
  },
  'ae-3': {
    intro: `Your voice matters. Not the voice you think people want to hear, but your true voice — the one that speaks your truth, expresses your needs, and stands up for what matters to you. Finding your voice isn't about being loud; it's about being honest.`,
    body: `Many of us learned to silence ourselves to keep the peace, to avoid rejection, or to be "likable." We swallowed our words, our opinions, our boundaries. But your silence comes at a cost — resentment, disconnection from yourself, and relationships built on false pretenses.

Speaking your truth doesn't mean being harsh or unkind. It means saying, "This is how I feel," "This is what I need," "This doesn't align with my values." It means using your voice to advocate for yourself, even when your voice shakes.`,
    exercise: `Practice using your voice in low-stakes situations first. Share your genuine opinion about a movie, express a preference about where to eat, or say no to something small you don't want to do. Build the muscle of speaking truthfully.`,
    reflection: `What truth have you been holding back? What would it feel like to finally speak it?`
  },
  'ae-4': {
    intro: `Authenticity isn't just about knowing yourself — it's about living in alignment with that knowledge. It's making choices that honor your values, even when it's uncomfortable. It's building a life that reflects who you truly are, not who you think you should be.`,
    body: `Living authentically means your actions match your inner truth. If you value connection but spend all your time on social media, there's misalignment. If you claim to prioritize health but constantly neglect your needs, there's disconnection. Authenticity is closing these gaps.

Start small. Say no to invitations that drain you. Pursue hobbies that genuinely interest you, not what's trendy. Spend time with people who see and accept your real self. Each aligned choice builds momentum toward an authentic life.`,
    exercise: `Audit one area of your life (career, relationships, habits, schedule). Ask: "Does this align with my values? Does it honor who I really am?" Identify one thing that's out of alignment and one step you can take to realign it.`,
    reflection: `If you were living authentically, what would be different? What's one choice you can make today that aligns with your true self?`
  },
  'ae-5': {
    intro: `You are not like anyone else — and that's your superpower. Your quirks, your perspective, your experiences, your way of seeing the world... these are gifts, not flaws. Embracing your uniqueness isn't about being different for the sake of it; it's about celebrating the unrepeatable human you are.`,
    body: `The world benefits from your unique contribution. No one else has your combination of talents, experiences, and heart. When you hide your uniqueness to fit in, you rob the world of what only you can offer.

Embracing your uniqueness means letting go of comparison. Someone else's journey isn't a blueprint for yours. Your path is yours alone. Stop trying to be more like others and start being more like the most authentic version of yourself.`,
    exercise: `Write a letter to yourself titled "What Makes Me Unique." List your quirks, your passions, your perspectives, your strengths. Celebrate these parts of yourself. Read this letter whenever you feel pressure to conform.`,
    reflection: `What makes you uniquely you? How would your life change if you fully embraced and celebrated your uniqueness?`
  }
};

// Render Chapter Content
function renderChapterContent() {
  if (!selectedProgram || !selectedChapter) {
    console.error("Missing program or chapter:", selectedProgram, selectedChapter);
    return;
  }

  console.log("Rendering chapter:", selectedChapter.id);
  const container = document.getElementById('chapter-content');
  const isCompleted = isChapterCompleted(selectedProgram.id, selectedChapter.id);
  
  // Get chapter-specific content
  const content = chapterContent[selectedChapter.id] || {
    intro: 'Chapter content coming soon...',
    body: '',
    exercise: '',
    reflection: 'What insights did you gain from this chapter?'
  };
  
  // Find current chapter index and determine if there are prev/next chapters
  const currentChapterIndex = selectedProgram.chapters.findIndex(ch => ch.id === selectedChapter.id);
  console.log("Current chapter index:", currentChapterIndex, "out of", selectedProgram.chapters.length);
  
  const hasPrevious = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < selectedProgram.chapters.length - 1;
  const previousChapter = hasPrevious ? selectedProgram.chapters[currentChapterIndex - 1] : null;
  const nextChapter = hasNext ? selectedProgram.chapters[currentChapterIndex + 1] : null;
  
  console.log("Has previous:", hasPrevious, "Has next:", hasNext);
  if (previousChapter) console.log("Previous chapter:", previousChapter.id);
  if (nextChapter) console.log("Next chapter:", nextChapter.id);

  container.innerHTML = `
    <div class="chapter-content-header" style="background: ${selectedProgram.color}20; padding: 30px; border-radius: 16px; margin-bottom: 30px;">
      <div class="mb-3">
        <span class="badge" style="background: ${selectedProgram.color}20; color: ${selectedProgram.color};">
          ${selectedProgram.name}
        </span>
        <span class="badge ml-2">⏱️ ${selectedChapter.duration}</span>
      </div>
      <h1 class="mb-2">${selectedChapter.title}</h1>
      <p class="text-muted-foreground">${selectedChapter.description}</p>
    </div>

    <div class="chapter-content-body">
      <h2>Welcome to This Chapter</h2>
      <p>${content.intro}</p>
      
      ${content.body ? content.body.split('\n\n').map(para => `<p>${para}</p>`).join('') : ''}

      ${content.exercise ? `
        <h3>Creative Invitation:</h3>
        <p>${content.exercise}</p>
      ` : ''}

      <div class="reflection-box" style="background: ${selectedProgram.color}15; padding: 20px; border-radius: 12px; border-left: 4px solid ${selectedProgram.color};">
        <h4>💭 Reflection Prompt</h4>
        <p style="font-style: italic;">"${content.reflection}"</p>
      </div>

      <p class="mt-4">
        As you move through this chapter, remember to be gentle with yourself. Growth happens 
        in small, consistent steps. You're exactly where you need to be.
      </p>
    </div>

    <div class="chapter-actions mt-6" style="display: flex; gap: 12px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
      <div style="display: flex; gap: 12px;">
        <button class="btn btn-outline" onclick="backToChapters()">
          ← Back to Chapters
        </button>
        ${hasPrevious ? `
          <button class="btn btn-outline" onclick="openChapter('${previousChapter.id}')">
            ← Previous
          </button>
        ` : ''}
      </div>
      
      <div style="display: flex; gap: 12px; align-items: center;">
        ${!isCompleted 
          ? `<button class="btn btn-primary" style="background: ${selectedProgram.color};" onclick="markChapterComplete()">Mark as Complete</button>`
          : `<button class="btn" style="background: ${selectedProgram.color}; color: white;">✓ Completed</button>`
        }
        ${hasNext ? `
          <button class="btn btn-primary" style="background: ${selectedProgram.color}; color: white;" onclick="openChapter('${nextChapter.id}')">
            Next →
          </button>
        ` : `
          <button class="btn btn-primary" style="background: ${selectedProgram.color}; color: white;" onclick="backToChapters()">
            Finish Program →
          </button>
        `}
      </div>
    </div>
  `;
  
  console.log("Chapter content rendered successfully");
}

// Navigation functions
function backToPrograms() {
  selectedProgram = null;
  selectedChapter = null;
  document.getElementById('programs-view').style.display = 'grid';
  document.getElementById('chapters-view').style.display = 'none';
  document.getElementById('content-view').style.display = 'none';
}

function backToChapters() {
  selectedChapter = null;
  document.getElementById('programs-view').style.display = 'none';
  document.getElementById('chapters-view').style.display = 'block';
  document.getElementById('content-view').style.display = 'none';
}

function markChapterComplete() {
  if (selectedProgram && selectedChapter) {
    completeChapter(selectedProgram.id, selectedChapter.id);
    renderChapterContent();
  }
}

// ========== COMMUNITY TAB FUNCTIONS (MUST BE BEFORE renderCommunityPage) ==========

// Switch community tab function - make it global
window.switchCommunityTab = function(tab) {
  console.log("Switching to tab:", tab);
  const postsTab = document.getElementById('posts-tab');
  const sessionsTab = document.getElementById('sessions-tab');
  const postsContent = document.getElementById('posts-content');
  const sessionsContent = document.getElementById('sessions-content');
  
  console.log("Elements found:", { postsTab, sessionsTab, postsContent, sessionsContent });
  
  if (tab === 'posts') {
    postsTab.classList.add('active');
    postsTab.style.borderBottom = '2px solid #ec4899';
    postsTab.style.color = '#ec4899';
    sessionsTab.classList.remove('active');
    sessionsTab.style.borderBottom = 'none';
    sessionsTab.style.color = '#6b7280';
    postsContent.style.display = 'block';
    sessionsContent.style.display = 'none';
  } else {
    sessionsTab.classList.add('active');
    sessionsTab.style.borderBottom = '2px solid #ec4899';
    sessionsTab.style.color = '#ec4899';
    postsTab.classList.remove('active');
    postsTab.style.borderBottom = 'none';
    postsTab.style.color = '#6b7280';
    postsContent.style.display = 'none';
    sessionsContent.style.display = 'block';
    loadSessions();
  }
};

window.handleCreateSession = async function(e) {
  e.preventDefault();
  console.log("=== CREATE SESSION STARTED ===");
  
  const title = document.getElementById('session-title').value;
  const date = document.getElementById('session-date').value;
  const time = document.getElementById('session-time').value;
  const maxAttendees = document.getElementById('session-max-attendees').value;
  
  console.log("Form values:", { title, date, time, maxAttendees });
  console.log("User token:", localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
  
  // Use API function
  console.log("Calling createSessionAPI...");
  const result = await createSessionAPI(title, date, time, maxAttendees);
  
  console.log("API Response:", result);
  
  if (result.success) {
    console.log("✅ Session created successfully:", result.data);
    showToast('Session created successfully!');
    e.target.reset();
    await loadSessions();
  } else {
    console.error("❌ Failed to create session:", result.error);
    showToast('Failed to create session: ' + result.error);
  }
};

window.handleSessionAction = async function(sessionId, isAttending) {
  console.log("Session action:", sessionId, isAttending);
  
  let result;
  if (isAttending) {
    result = await leaveSessionAPI(sessionId);
    if (result.success) {
      showToast('Left session successfully');
      loadSessions();
    } else {
      showToast('Could not leave session: ' + result.error);
    }
  } else {
    result = await joinSessionAPI(sessionId);
    if (result.success) {
      showToast('Joined session successfully!');
      loadSessions();
    } else {
      showToast('Could not join session: ' + result.error);
    }
  }
};

window.handleDeleteSession = async function(sessionId) {
  console.log("Deleting session:", sessionId);
  if (!confirm('Are you sure you want to delete this session?')) return;
  
  const result = await deleteSessionAPI(sessionId);
  if (result.success) {
    showToast('Session deleted successfully');
    loadSessions();
  } else {
    showToast('Could not delete session: ' + result.error);
  }
};

async function loadSessions() {
  console.log("=== LOAD SESSIONS STARTED ===");
  const container = document.getElementById('sessions-container');
  if (!container) {
    console.error("❌ Sessions container not found");
    return;
  }
  
  container.innerHTML = '<p>Loading sessions...</p>';
  
  console.log("Calling getSessions API...");
  const result = await getSessions();
  console.log("getSessions result:", result);
  
  if (!result.success) {
    console.error("❌ Failed to load sessions:", result.error);
    container.innerHTML = '<p>Failed to load sessions. ' + result.error + '</p>';
    return;
  }
  
  console.log("✅ Sessions loaded:", result.data);
  const sessions = result.data;
  const user = getCurrentUser();
  
  console.log("Current user:", user);
  console.log("Total sessions:", sessions.length);
  
  console.log("Found sessions:", sessions);
  
  if (sessions.length === 0) {
    container.innerHTML = '<p>No sessions yet. Create the first one!</p>';
    return;
  }
  
  // Sort sessions by date/time
  sessions.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  
  container.innerHTML = '';
  
  sessions.forEach(session => {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'post-card';
    const isCreator = session.userId === user.id;
    const isAttending = session.attendees.some(a => a.userId === user.id);
    const isFull = session.attendees.length >= session.maxAttendees;
    
    const sessionDate = new Date(session.date + ' ' + session.time);
    const formattedDate = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    // Get creator name from user object
    const creatorName = session.user ? session.user.name : 'Unknown';
    
    sessionDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${session.title}</h3>
          <p style="color: #6b7280; font-size: 0.875rem;">Created by ${creatorName}</p>
        </div>
        ${isCreator ? `
          <button onclick="handleDeleteSession(${session.id})" style="padding: 0.5rem; background: none; border: none; cursor: pointer; color: #dc2626;" title="Delete session">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        ` : ''}
      </div>
      
      <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem; color: #374151;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${formattedDate} at ${formattedTime}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>${session.attendees.length} / ${session.maxAttendees} attending</span>
        </div>
      </div>
      
      ${!isCreator ? `
        <button 
          onclick="handleSessionAction(${session.id}, ${isAttending})" 
          class="btn ${isAttending ? 'btn-outline' : 'btn-primary'}"
          ${isFull && !isAttending ? 'disabled' : ''}
        >
          ${isAttending ? 'Leave Session' : (isFull ? 'Session Full' : 'Join Session')}
        </button>
      ` : `
        <span style="display: inline-block; padding: 0.5rem 1rem; background: #f3f4f6; border-radius: 0.5rem; color: #374151; font-size: 0.875rem;">
          You're hosting this session
        </span>
      `}
    `;
    container.appendChild(sessionDiv);
  });
  
  console.log("Sessions loaded successfully");
}

// ========== COMMUNITY PAGE ==========
function renderCommunityPage() {
  const communityPage = document.getElementById('community-page');
  communityPage.innerHTML = `
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-logo">
              <div class="logo-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="font-semibold">HeArtSpace</span>
            </div>

 <!-- Hamburger Menu Button -->
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div class="nav-links">
              <button class="nav-link" onclick="navigate('dashboard')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </button>
              <button class="nav-link" onclick="navigate('programs')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                Programs
              </button>
              <button class="nav-link active" onclick="navigate('community')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Community
              </button>
              <button class="nav-link" onclick="navigate('gallery')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                </svg>
                Gallery
              </button>
            </div>
          </div>
          <div class="nav-user" style="position: relative;">
            <div id="nav-avatar" class="avatar clickable">JD</div>
            <div id="profile-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: white; border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 0.5rem; min-width: 200px; z-index: 1000;">
    <p id="dropdown-name" class="dropdown-name" style="padding: 0.5rem 1rem; font-weight: 600; border-bottom: 1px solid #e5e7eb;">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; border-radius: 0.25rem; transition: background 0.2s;">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout" style="width: 100%; text-align: left; padding: 0.75rem 1rem; background: none; border: none; cursor: pointer; color: #dc2626; border-radius: 0.25rem; transition: background 0.2s;">Sign Out</button>
  </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container py-8 px-4">
      <div class="mb-8">
        <h1 class="mb-4">Community Circle</h1>
        <p class="text-muted-foreground">
          Share, connect, and support each other on this healing journey
        </p>
      </div>

      <!-- Tabs -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 2rem;">
        <button id="posts-tab" class="tab-button active" onclick="switchCommunityTab('posts')" style="padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; font-weight: 500; border-bottom: 2px solid #ec4899; margin-bottom: -2px; color: #ec4899;">
          Posts
        </button>
        <button id="sessions-tab" class="tab-button" onclick="switchCommunityTab('sessions')" style="padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; font-weight: 500; color: #6b7280;">
          Sessions
        </button>
      </div>

      <!-- Posts Tab Content -->
      <div id="posts-content">
        <!-- Create Post -->
        <div class="create-post-card mb-6">
          <div class="post-form">
            <div class="avatar" id="user-avatar"></div>
            <div style="flex: 1;">
              <textarea 
                id="new-post-textarea" 
                class="post-textarea" 
                placeholder="Share your thoughts, insights, or questions with the community..."
              ></textarea>
              <div class="post-actions mt-3">
                <button class="btn btn-primary" onclick="handleCreatePost()">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts Container -->
        <div id="posts-container"></div>
      </div>

      <!-- Sessions Tab Content -->
      <div id="sessions-content" style="display: none;">
        <!-- Create Session -->
        <div class="create-post-card mb-6">
          <h3 class="mb-4">Create a Session</h3>
          <form id="create-session-form" style="display: grid; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Session Title</label>
              <input type="text" id="session-title" class="form-input" placeholder="e.g., Group Meditation" required>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Date</label>
                <input type="date" id="session-date" class="form-input" required>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Time</label>
                <input type="time" id="session-time" class="form-input" required>
              </div>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Max Attendees</label>
              <input type="number" id="session-max-attendees" class="form-input" placeholder="e.g., 20" min="2" max="100" required>
            </div>
            <button type="submit" class="btn btn-primary">Create Session</button>
          </form>
        </div>

        <!-- Sessions List -->
        <div id="sessions-container"></div>
      </div>
    </div>
  `;
  
  updateCurrentUserDisplay();
  loadPosts();
  
  // Setup listeners after a short delay to ensure DOM is ready
  setTimeout(() => {

 const createSessionForm = document.getElementById('create-session-form');
    if (createSessionForm) {
      console.log("✅ Attaching submit handler to create-session-form");
      createSessionForm.addEventListener('submit', handleCreateSession);
    } else {
      console.error("❌ create-session-form not found!");
    }

    setupPageListeners();
  }, 100);
}

async function loadPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  container.innerHTML = '<p>Loading posts...</p>';
  
  const result = await getPosts();
  
  if (result.success) {
    container.innerHTML = '';
    
    if (result.data.length === 0) {
      container.innerHTML = '<p>No posts yet. Start the conversation!</p>';
      return;
    }
    
    result.data.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-card';
      
      const initials = post.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      const currentUser = getCurrentUser();
      const isMyPost = post.user.id === currentUser.id;
      
      postDiv.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">${initials}</div>
          <div class="post-info">
            <h4>${post.user.name}</h4>
            <small>${new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
          ${isMyPost ? `<button onclick="deletePost(${post.id})" style="margin-left: auto; padding: 0.5rem; background: none; border: none; cursor: pointer; color: #dc2626;" title="Delete post">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>` : ''}
        </div>
        <p class="post-content">${post.content}</p>
      `;
      container.appendChild(postDiv);
    });
  } else {
    container.innerHTML = '<p>Failed to load posts. ' + result.error + '</p>';
  }
}

async function handleCreatePost() {
  const textarea = document.getElementById('new-post-textarea');
  if (!textarea) return;
  
  const content = textarea.value.trim();
  if (!content) {
    showToast('Please write something');
    return;
  }
  
  const result = await createPost(content);
  
  if (result.success) {
    showToast('Post shared successfully!');
    textarea.value = '';
    loadPosts();
  } else {
    showToast('Failed to create post: ' + result.error);
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://heartspace-backend.vercel.app/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      showToast('Post deleted successfully');
      loadPosts();
    } else {
      showToast('Failed to delete post');
    }
  } catch (error) {
    showToast('Error deleting post');
  }
}

// ========== GALLERY PAGE ==========
function renderGalleryPage() {
  const galleryPage = document.getElementById('gallery-page');
  galleryPage.innerHTML = `
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <div class="nav-logo">
              <div class="logo-small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="font-semibold">HeArtSpace</span>
            </div>
            <div class="nav-links">
              <button class="nav-link" onclick="navigate('dashboard')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </button>
              <button class="nav-link" onclick="navigate('programs')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                Programs
              </button>
              <button class="nav-link" onclick="navigate('community')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Community
              </button>
              <button class="nav-link active" onclick="navigate('gallery')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                </svg>
                Gallery
              </button>
            </div>
          </div>
          <div class="nav-user">
            <div id="nav-avatar" class="avatar clickable">JD</div>
            <div id="profile-dropdown" class="dropdown hidden">
    <p id="dropdown-name" class="dropdown-name">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout">Sign Out</button>
  </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container py-8 px-4">
      <div class="gallery-header mb-6">
        <div>
          <h1 class="mb-2">Healing Through Art</h1>
          <p class="text-muted-foreground">
            A space where creativity becomes medicine and expression leads to healing
          </p>
        </div>
        <button class="btn btn-primary" onclick="showUploadModal()">
          Share Your Art
        </button>
      </div>

      <!-- Categories Filter -->
      <div class="categories-filter mb-6">
        ${categories.map(category => `
          <button 
            class="category-badge ${selectedCategory === category ? 'active' : ''}" 
            onclick="selectCategory('${category}')"
          >
            ${category}
          </button>
        `).join('')}
      </div>

      <!-- Artworks Container -->
      <div id="artworks-container" class="gallery-grid"></div>
    </div>

    <!-- Upload Modal -->
    <div id="upload-modal" class="modal">
      <div class="modal-content card" style="max-width: 600px;">
        <h2 class="mb-4">Share Your Art</h2>
        <form id="upload-form">
          <div class="form-group">
            <label for="artwork-title">Title</label>
            <input type="text" id="artwork-title" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="artwork-category">Category</label>
            <select id="artwork-category" class="form-input" required>
              <option value="">Select a category</option>
              ${categories.filter(c => c !== 'All').map(category => `
                <option value="${category}">${category}</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="artwork-description">Description</label>
            <textarea id="artwork-description" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="artwork-image">Image</label>
            <input type="file" id="artwork-image" accept="image/*" required>
          </div>
          <div class="button-group">
            <button type="button" class="btn btn-outline" onclick="hideUploadModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Upload</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  updateCurrentUserDisplay();
  loadGallery();
  
  // Setup listeners after a short delay to ensure DOM is ready
  setTimeout(() => {
    setupPageListeners();
  }, 100);
}

async function loadGallery() {
  const container = document.getElementById('artworks-container');
  if (!container) return;
  
  container.innerHTML = '<p>Loading artworks...</p>';
  
  const result = await getArtworks();
  
  if (result.success) {
    const currentUser = getCurrentUser();
    container.innerHTML = '';
    
    // Filter by selected category
    let filteredArtworks = result.data;
    if (selectedCategory !== 'All') {
      filteredArtworks = result.data.filter(artwork => artwork.category === selectedCategory);
    }
    
    if (filteredArtworks.length === 0) {
      container.innerHTML = `<p>No artworks in this category yet. ${selectedCategory === 'All' ? 'Be the first to share!' : ''}</p>`;
      return;
    }
    
    filteredArtworks.forEach(artwork => {
      const artworkDiv = document.createElement('div');
      artworkDiv.className = 'art-card';
      
      const isLiked = artwork.likes.some(like => like.userId === currentUser.id);
      const isMyArtwork = artwork.user.id === currentUser.id;
      
      const initials = artwork.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      artworkDiv.innerHTML = `
        <div class="art-image-container" style="position: relative;">
          <img src="${artwork.imageUrl}" alt="${artwork.title}" class="art-image">
          ${isMyArtwork ? `<button onclick="deleteArtwork(${artwork.id})" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.5rem; background: rgba(220, 38, 38, 0.9); border: none; border-radius: 0.5rem; cursor: pointer; color: white;" title="Delete artwork">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>` : ''}
        </div>
        <div class="art-details">
          <h3>${artwork.title}</h3>
          <div class="art-artist-row">
            <div class="art-avatar">${initials}</div>
            <span>${artwork.user.name}</span>
          </div>
          <p>${artwork.description || ''}</p>
          
          <div class="art-stats">
            <button onclick="toggleLikeArtwork(${artwork.id})" class="art-stat-btn ${isLiked ? 'liked' : ''}">
              ❤️ ${artwork.likes.length}
            </button>
            <span class="art-stat">
              💬 ${artwork.comments.length}
            </span>
          </div>
          
          <div class="comments">
            <h4>Comments</h4>
            <div class="comments-list">
              ${artwork.comments.map(c => {
                const commentInitials = c.user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                return `
                  <div class="comment">
                    <div class="comment-avatar">${commentInitials}</div>
                    <div>
                      <strong>${c.user.name}:</strong> ${c.content}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="add-comment">
              <input type="text" id="comment-${artwork.id}" placeholder="Add a comment...">
              <button onclick="addCommentToArtwork(${artwork.id})">Post</button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(artworkDiv);
    });
  } else {
    container.innerHTML = '<p>Failed to load artworks. ' + result.error + '</p>';
  }
}

async function toggleLikeArtwork(artworkId) {
  const result = await likeArtwork(artworkId);
  if (result.success) {
    loadGallery();
  }
}

async function deleteArtwork(artworkId) {
  if (!confirm('Are you sure you want to delete this artwork?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://heartspace-backend.vercel.app/api/artworks/${artworkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      showToast('Artwork deleted successfully');
      loadGallery();
    } else {
      showToast('Failed to delete artwork');
    }
  } catch (error) {
    showToast('Error deleting artwork');
  }
}

async function addCommentToArtwork(artworkId) {
  const input = document.getElementById(`comment-${artworkId}`);
  if (!input) return;
  
  const content = input.value.trim();
  if (!content) return;
  
  const result = await commentOnArtwork(artworkId, content);
  
  if (result.success) {
    input.value = '';
    loadGallery();
  } else {
    showToast('Failed to add comment');
  }
}

function selectCategory(category) {
  selectedCategory = category;
  renderGalleryPage();
}

// Upload Modal Functions
function showUploadModal() {
  document.getElementById('upload-modal').classList.add('active');
  
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm && !uploadForm.dataset.listenerAttached) {
    uploadForm.dataset.listenerAttached = 'true';
    
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('artwork-title').value;
      const category = document.getElementById('artwork-category').value;
      const description = document.getElementById('artwork-description').value;
      const imageFile = document.getElementById('artwork-image').files[0];
      
      if (!imageFile) {
        showToast('Please select an image');
        return;
      }
      
      if (!category) {
        showToast('Please select a category');
        return;
      }
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('image', imageFile);
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Uploading...';
      submitBtn.disabled = true;
      
      const result = await uploadArtwork(formData);
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      if (result.success) {
        showToast('Artwork uploaded successfully!');
        hideUploadModal();
        uploadForm.reset();
        loadGallery();
      } else {
        showToast('Failed to upload: ' + result.error);
      }
    });
  }
}