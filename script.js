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
      console.log("Rendering programs page..."); // Debug log
      renderProgramsPage();
      updateCurrentUserDisplay();
    } else if (page === 'community') {
      renderCommunityPage();
    } else if (page === 'gallery') {
      renderGalleryPage();
    } else if (page === 'dashboard') {
      updateCurrentUserDisplay();
    }
  } else {
    console.error("Page element not found:", `${page}-page`);
  }
  
  // Re-initialize hamburger menu
  setTimeout(initializeHamburgerMenu, 100);
}

// ========== HAMBURGER MENU ==========
function initializeHamburgerMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    // Remove old listeners to avoid duplicates
    const newToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
    
    newToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      newToggle.classList.toggle('active');
    });
    
    const navLinkButtons = navLinks.querySelectorAll('.nav-link');
    navLinkButtons.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        newToggle.classList.remove('active');
      });
    });
    
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-left') && !e.target.closest('.mobile-menu-toggle')) {
        navLinks.classList.remove('active');
        newToggle.classList.remove('active');
      }
    });
  }
}


// ========== PROFILE PAGE ==========
function renderProfilePage() {
  const user = getCurrentUser();
  if (!user) {
    navigate('landing');
    return;
  }

  const profilePage = document.getElementById('profile-page');
  
  // Get initials
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  profilePage.innerHTML = `
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
              <button class="nav-link" onclick="navigate('gallery')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                </svg>
                Gallery
              </button>
            </div>
          </div>
          <div class="nav-user">
            <div id="nav-avatar" class="avatar clickable">${initials}</div>
            <div id="profile-dropdown" class="dropdown hidden">
              <p id="dropdown-name" class="dropdown-name">${user.name}</p>
              <button class="dropdown-link" onclick="navigate('profile')">View Profile</button>
              <button id="logout-btn" class="dropdown-link logout">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-8 px-4">
      <div>
        <h1 class="page-title" style="font-size: 2.25rem; font-weight: 700; margin-bottom: 0.5rem;">
          Your Profile
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" stroke-width="2" style="display: inline;">
            <path d="M12 3l1.545 4.755L18 9.27l-4.455 3.24L15.09 21 12 17.755 8.91 21l1.545-8.49L6 9.27l4.455-1.515L12 3z"/>
          </svg>
        </h1>
        <p class="text-muted-foreground mb-8">Manage your personal information and journey preferences</p>
      </div>

      <div style="display: grid; gap: 2rem; grid-template-columns: 1fr;">
        <!-- Profile Card -->
        <div>
          <div class="card" style="text-align: center;">
            <div style="position: relative; display: inline-block; margin-bottom: 1.5rem;">
              <div class="profile-avatar-large" id="profile-avatar" style="width: 128px; height: 128px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); background: linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: 600; margin: 0 auto;">
                ${initials}
              </div>
            </div>

            <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;" id="profile-name-display">${user.name}</div>

            <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <div class="info-item" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; font-size: 0.875rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>${user.email}</span>
              </div>
              <div class="info-item" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem; font-size: 0.875rem;">
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
        </div>

        <!-- Edit Form -->
        <div>
          <div class="card">
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="font-size: 1.5rem; font-weight: 600;">Personal Information</h2>
                <button class="btn btn-outline" id="edit-profile-btn" onclick="enterProfileEditMode()">Edit Profile</button>
              </div>

              <div style="display: grid; gap: 1.5rem;">
                <div>
                  <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.5rem;">Full Name</label>
                  <div class="form-display" id="name-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem;">${user.name}</div>
                  <input type="text" id="name-input" class="form-input" value="${user.name}" style="display: none; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem;">
                </div>

                <div>
                  <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.5rem;">Email Address</label>
                  <div class="form-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem;">${user.email}</div>
                </div>

                <div>
                  <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.5rem;">Bio</label>
                  <div class="form-display" id="bio-display" style="padding: 0.75rem; background: #f9fafb; border-radius: 0.75rem;">On a journey of healing and self-discovery. 🌱</div>
                  <textarea id="bio-input" class="form-input" style="display: none; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem; min-height: 100px;">On a journey of healing and self-discovery. 🌱</textarea>
                </div>
              </div>

              <div id="profile-button-group" style="display: none; gap: 0.75rem; margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="saveProfileChanges()">Save Changes</button>
                <button class="btn btn-outline" onclick="cancelProfileEdit()">Cancel</button>
              </div>
            </div>
          </div>

          <!-- Journey Stats -->
          <div id="profile-stats" style="display: grid; gap: 1rem; margin-top: 1.5rem; grid-template-columns: repeat(2, 1fr);"></div>
        </div>
      </div>
    </div>
  `;

  updateCurrentUserDisplay();
  loadProfileStats();
}

// Profile Edit Functions
window.enterProfileEditMode = function() {
  document.getElementById('name-display').style.display = 'none';
  document.getElementById('name-input').style.display = 'block';
  document.getElementById('bio-display').style.display = 'none';
  document.getElementById('bio-input').style.display = 'block';
  document.getElementById('edit-profile-btn').style.display = 'none';
  document.getElementById('profile-button-group').style.display = 'flex';
};

window.cancelProfileEdit = function() {
  const user = getCurrentUser();
  document.getElementById('name-input').value = user.name;
  document.getElementById('bio-input').value = 'On a journey of healing and self-discovery. 🌱';
  
  document.getElementById('name-display').style.display = 'block';
  document.getElementById('name-input').style.display = 'none';
  document.getElementById('bio-display').style.display = 'block';
  document.getElementById('bio-input').style.display = 'none';
  document.getElementById('edit-profile-btn').style.display = 'block';
  document.getElementById('profile-button-group').style.display = 'none';
};

window.saveProfileChanges = function() {
  const newName = document.getElementById('name-input').value;
  const newBio = document.getElementById('bio-input').value;
  
  // Update localStorage
  const user = getCurrentUser();
  user.name = newName;
  localStorage.setItem('user', JSON.stringify(user));
  
  // Update display
  document.getElementById('name-display').textContent = newName;
  document.getElementById('bio-display').textContent = newBio;
  document.getElementById('profile-name-display').textContent = newName;
  
  // Update avatar
  const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('profile-avatar').textContent = initials;
  
  cancelProfileEdit();
  showToast('Profile updated successfully!');
  updateCurrentUserDisplay();
};

async function loadProfileStats() {
  const statsContainer = document.getElementById('profile-stats');
  if (!statsContainer) return;
  
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
  
  statsContainer.innerHTML = `
    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(187, 247, 208, 0.6) 0%, rgba(134, 239, 172, 0.6) 100%); border: 1px solid #86efac;">
      <div style="font-size: 2rem; font-weight: 700; color: #1f2937;">${activePrograms}</div>
      <p style="font-size: 0.875rem; color: #374151;">Active Programs</p>
    </div>

    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(251, 207, 232, 0.6) 0%, rgba(249, 168, 212, 0.6) 100%); border: 1px solid #f9a8d4;">
      <div style="font-size: 2rem; font-weight: 700; color: #1f2937;">${completedChapters}</div>
      <p style="font-size: 0.875rem; color: #374151;">Chapters Completed</p>
    </div>

    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(191, 219, 254, 0.6) 0%, rgba(147, 197, 253, 0.6) 100%); border: 1px solid #93c5fd;">
      <div style="font-size: 2rem; font-weight: 700; color: #1f2937;">${myArtworks}</div>
      <p style="font-size: 0.875rem; color: #374151;">Artworks Shared</p>
    </div>

    <div class="stat-card" style="padding: 1.5rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(254, 215, 170, 0.6) 0%, rgba(253, 186, 116, 0.6) 100%); border: 1px solid #fdba74;">
      <div style="font-size: 2rem; font-weight: 700; color: #1f2937;">${myPosts}</div>
      <p style="font-size: 0.875rem; color: #374151;">Community Posts</p>
    </div>
  `;
}

// ========== PROFILE PAGE ==========
function renderProfilePage() {
  const user = getCurrentUser();
  if (!user) {
    navigate('landing');
    return;
  }

  const profilePage = document.getElementById('profile-page');
  
  profilePage.innerHTML = `
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
              <button class="nav-link" onclick="navigate('gallery')">
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
      <div class="profile-container">
        <!-- Profile Header -->
        <div class="profile-header card">
          <div class="profile-header-content">
            <div class="profile-avatar-large" id="profile-avatar-large">
              ${user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div class="profile-info">
              <h1>${user.name}</h1>
              <p class="text-muted-foreground">${user.email}</p>
              <p class="profile-joined">Member since ${new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <button class="btn btn-outline" onclick="showEditProfileModal()">Edit Profile</button>
        </div>
        
        <!-- Profile Stats -->
        <div class="profile-stats card">
          <div class="stat-item">
            <div class="stat-number" id="stat-active-programs">0</div>
            <div class="stat-label">Active Programs</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="stat-completed-chapters">0</div>
            <div class="stat-label">Chapters Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="stat-artworks-shared">0</div>
            <div class="stat-label">Artworks Shared</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="stat-community-posts">0</div>
            <div class="stat-label">Community Posts</div>    
          </div>
        </div>
      </div>
    </div>
  `;


// ========== PROGRAMS PAGE ==========

// Programs data
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
  console.log("renderProgramsPage called"); // Debug
  const programsPage = document.getElementById('programs-page');
  
  if (!programsPage) {
    console.error("Programs page element not found!");
    return;
  }
  
  console.log("Programs page element found, rendering content..."); // Debug
  
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
          <div class="nav-user">
            <div id="nav-avatar" class="avatar clickable">JD</div>
           <!-- Hidden dropdown -->
  <div id="profile-dropdown" class="dropdown hidden">
    <p id="dropdown-name" class="dropdown-name">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout" a href="index.html">Sign Out</button>
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
  selectedChapter = selectedProgram.chapters.find(ch => ch.id === chapterId);
  if (!selectedChapter) return;

  document.getElementById('programs-view').style.display = 'none';
  document.getElementById('chapters-view').style.display = 'none';
  document.getElementById('content-view').style.display = 'block';

  renderChapterContent();
}

// Render Chapter Content
function renderChapterContent() {
  if (!selectedProgram || !selectedChapter) return;

  const container = document.getElementById('chapter-content');
  const isCompleted = isChapterCompleted(selectedProgram.id, selectedChapter.id);

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
      <p>
        This is where your chapter content would be displayed. You can add text, images, videos, 
        exercises, and interactive elements to guide your users through their healing journey.
      </p>

      <h3>Key Concepts</h3>
      <ul>
        <li>Understanding the foundation of this topic</li>
        <li>Practical techniques you can apply immediately</li>
        <li>Tools for self-reflection and growth</li>
        <li>Building sustainable habits for lasting change</li>
      </ul>

      <h3>Practice Exercise</h3>
      <p>
        Take a few moments to reflect on what resonates with you. Consider journaling about your 
        thoughts and feelings as you work through this material. Remember, healing is a journey, 
        not a destination.
      </p>

      <div class="reflection-box" style="background: ${selectedProgram.color}15; padding: 20px; border-radius: 12px; border-left: 4px solid ${selectedProgram.color};">
        <h4>💭 Reflection Prompt</h4>
        <p style="font-style: italic;">
          "What is one small step I can take today to honor myself and my journey?"
        </p>
      </div>

      <p class="mt-4">
        As you move through this chapter, remember to be gentle with yourself. Growth happens 
        in small, consistent steps. You're exactly where you need to be.
      </p>
    </div>

    <div class="chapter-actions mt-6" style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn btn-outline" onclick="backToChapters()">
        Back to Chapters
      </button>
      ${isCompleted 
        ? `<button class="btn" style="background: ${selectedProgram.color}; color: white;">✓ Completed</button>`
        : `<button class="btn btn-primary" style="background: ${selectedProgram.color};" onclick="markChapterComplete()">Mark as Complete</button>`
      }
    </div>
  `;
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
          <div class="nav-user">
            <div id="nav-avatar" class="avatar clickable">JD</div>
            <!-- Hidden dropdown -->
  <div id="profile-dropdown" class="dropdown hidden">
    <p id="dropdown-name" class="dropdown-name">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout" a href="index.html">Sign Out</button>
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
  `;
  
  // Update user avatar in create post section
  updateCurrentUserDisplay();
  
  // Load posts from backend
  loadPosts();
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
      
      // Get initials for post author
      const initials = post.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      postDiv.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">${initials}</div>
          <div class="post-info">
            <h4>${post.user.name}</h4>
            <small>${new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
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
    loadPosts(); // Reload posts
  } else {
    showToast('Failed to create post: ' + result.error);
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
            <!-- Hidden dropdown -->
  <div id="profile-dropdown" class="dropdown hidden">
    <p id="dropdown-name" class="dropdown-name">User Name</p>
    <button class="dropdown-link" onclick="navigate('profile')">View Profile</button>
    <button id="logout-btn" class="dropdown-link logout" a href="index.html">Sign Out</button>
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
}

async function loadGallery() {
  const container = document.getElementById('artworks-container');
  if (!container) return;
  
  container.innerHTML = '<p>Loading artworks...</p>';
  
  const result = await getArtworks();
  
  if (result.success) {
    const currentUser = getCurrentUser();
    container.innerHTML = '';
    
    if (result.data.length === 0) {
      container.innerHTML = '<p>No artworks yet. Be the first to share!</p>';
      return;
    }
    
    result.data.forEach(artwork => {
      const artworkDiv = document.createElement('div');
      artworkDiv.className = 'art-card';
      
      const isLiked = artwork.likes.some(like => like.userId === currentUser.id);
      
      // Get initials
      const initials = artwork.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      artworkDiv.innerHTML = `
        <div class="art-image-container">
          <img src="${artwork.imageUrl}" alt="${artwork.title}" class="art-image">
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
  
  // Attach upload form handler (only once)
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm && !uploadForm.dataset.listenerAttached) {
    uploadForm.dataset.listenerAttached = 'true';
    
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('artwork-title').value;
      const description = document.getElementById('artwork-description').value;
      const imageFile = document.getElementById('artwork-image').files[0];
      
      if (!imageFile) {
        showToast('Please select an image');
        return;
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', imageFile);
      
      // Show loading
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Uploading...';
      submitBtn.disabled = true;
      
      const result = await uploadArtwork(formData);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      if (result.success) {
        showToast('Artwork uploaded successfully!');
        hideUploadModal();
        uploadForm.reset();
        loadGallery(); // Reload gallery to show new artwork
      } else {
        showToast('Failed to upload: ' + result.error);
      }
    });
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
  
  // Auth form handler
  const authForm = document.getElementById('auth-form');
  if (authForm) {
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
  
  // Auth toggle button
  const authToggle = document.getElementById('auth-toggle');
  if (authToggle) {
    authToggle.addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      updateAuthModal();
    });
  }
  
  // Close modal on background click
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal') {
        hideAuth();
      }
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      signout(); // Clear token and user data
      navigate('landing'); // Go to landing page
      showToast('Logged out successfully');
      
      // Hide all pages and show landing
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('landing-page').classList.add('active');
    });
  }
  
  // Profile dropdown toggle
  const navAvatar = document.getElementById('nav-avatar');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  if (navAvatar && profileDropdown) {
    navAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-user')) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
  
  // Initialize hamburger menu
  initializeHamburgerMenu();
});
}