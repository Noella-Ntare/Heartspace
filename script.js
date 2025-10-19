// You don't need to import anything because compat scripts are loaded in HTML

// Auth Modal Functions (must be at top for inline onclick handlers)
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

//State Management
let currentPage = 'landing';
let isLoginMode = true;
let likedPosts = new Set();
let likedArt = new Set();
let selectedCategory = 'All';
let programFilter = 'all';

// Data
const programs = [
  {
    id: 1,
    name: 'Mindful Mornings',
    description: 'Start each day with intention, clarity, and peace through guided morning practices.',
    duration: '21 days',
    level: 'Beginner',
    enrolled: true,
    progress: 75,
    participants: 234,
    icon: '🌅',
    color: '#A8C3A0',
    modules: 21
  },
  {
    id: 2,
    name: 'Inner Peace Journey',
    description: 'Explore meditation, breathwork, and mindfulness to cultivate lasting inner peace.',
    duration: '30 days',
    level: 'Intermediate',
    enrolled: true,
    progress: 45,
    participants: 189,
    icon: '🧘',
    color: '#D9A7A0',
    modules: 30
  },
  {
    id: 3,
    name: 'Emotional Wellness',
    description: 'Learn tools to process emotions healthily and build emotional resilience.',
    duration: '6 weeks',
    level: 'All Levels',
    enrolled: true,
    progress: 60,
    participants: 312,
    icon: '💙',
    color: '#CFE6F5',
    modules: 42
  },
  {
    id: 4,
    name: 'Heart Healing',
    description: 'A compassionate journey through healing past wounds and opening to love.',
    duration: '8 weeks',
    level: 'Intermediate',
    enrolled: false,
    progress: 0,
    participants: 156,
    icon: '💗',
    color: '#D9A7A0',
    modules: 56
  },
  {
    id: 5,
    name: 'Self-Love Mastery',
    description: 'Develop a deep, authentic relationship with yourself through daily practices.',
    duration: '4 weeks',
    level: 'Beginner',
    enrolled: false,
    progress: 0,
    participants: 278,
    icon: '✨',
    color: '#F3E5D0',
    modules: 28
  },
  {
    id: 6,
    name: 'Authentic Expression',
    description: 'Find your voice and express your truth with confidence and clarity.',
    duration: '5 weeks',
    level: 'All Levels',
    enrolled: false,
    progress: 0,
    participants: 198,
    icon: '🎨',
    color: '#A8C3A0',
    modules: 35
  }
];

const posts = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    avatar: 'SM',
    time: '2 hours ago',
    content: 'Just completed my first week of the Mindful Mornings program and I already feel such a shift in my energy. Starting the day with intention has been transformative. 🌅✨',
    likes: 24,
    comments: 7,
    badge: 'Journey Guide'
  },
  {
    id: 2,
    author: 'Alex Chen',
    avatar: 'AC',
    time: '5 hours ago',
    content: 'Reminder: Your healing journey is unique to you. Comparison is the thief of joy. Celebrate every small victory, every moment of awareness, every breath taken with intention. 💙',
    likes: 42,
    comments: 12,
    badge: 'Wellness Warrior'
  },
  {
    id: 3,
    author: 'Maya Rodriguez',
    avatar: 'MR',
    time: '1 day ago',
    content: 'Grateful for this community. You all inspire me every single day to show up for myself, even when it\'s hard. Thank you for being a safe space. 🙏',
    likes: 56,
    comments: 18,
    badge: 'Heart Healer'
  },
  {
    id: 4,
    author: 'Jordan Davis',
    avatar: 'JD',
    time: '2 days ago',
    content: 'Today I chose rest over productivity, and it felt like an act of rebellion. Learning that self-care isn\'t selfish—it\'s necessary. 💗',
    likes: 38,
    comments: 9,
    badge: 'Level 5 Seeker'
  }
];

const artworks = [
  {
    id: 1,
    title: 'Breaking Free',
    artist: 'Sarah Mitchell',
    artistAvatar: 'SM',
    category: 'Painting',
    imageQuery: 'abstract-colorful-painting',
    description: 'This piece represents my journey of breaking free from past trauma. Each color represents a different emotion I processed.',
    story: 'Creating this helped me express feelings I couldn\'t put into words. The act of painting became my therapy.',
    likes: 142,
    views: 1203,
    comments: 28,
    featured: true
  },
  {
    id: 2,
    title: 'Inner Light',
    artist: 'Alex Chen',
    artistAvatar: 'AC',
    category: 'Photography',
    imageQuery: 'sunset-golden-light',
    description: 'A photograph capturing the moment I realized my own inner strength.',
    story: 'Photography taught me to see beauty in darkness and find light within myself.',
    likes: 98,
    views: 856,
    comments: 15
  },
  {
    id: 3,
    title: 'Rebirth',
    artist: 'Maya Rodriguez',
    artistAvatar: 'MR',
    category: 'Digital Art',
    imageQuery: 'phoenix-transformation',
    description: 'Digital illustration of transformation and renewal.',
    story: 'This represents my journey of rising from the ashes of depression into a new version of myself.',
    likes: 203,
    views: 1542,
    comments: 42
  },
  {
    id: 4,
    title: 'Layers of Healing',
    artist: 'Jordan Davis',
    artistAvatar: 'JD',
    category: 'Mixed Media',
    imageQuery: 'layered-texture-art',
    description: 'Each layer represents a stage of healing - peeling back to reveal what\'s underneath.',
    story: 'Working with textures helped me understand that healing happens in layers, not all at once.',
    likes: 167,
    views: 1104,
    comments: 31
  },
  {
    id: 5,
    title: 'Ocean of Emotions',
    artist: 'Emma Wilson',
    artistAvatar: 'EW',
    category: 'Painting',
    imageQuery: 'ocean-waves-watercolor',
    description: 'Watercolor piece exploring the depths of emotion.',
    story: 'Painting water taught me that emotions, like waves, come and go. Nothing is permanent.',
    likes: 189,
    views: 1367,
    comments: 37
  },
  {
    id: 6,
    title: 'Garden of Growth',
    artist: 'Lucas Kim',
    artistAvatar: 'LK',
    category: 'Photography',
    imageQuery: 'garden-flowers-bloom',
    description: 'A photographic study of growth and new beginnings.',
    story: 'Watching plants grow taught me patience with my own healing journey.',
    likes: 124,
    views: 932,
    comments: 19
  },
  {
    id: 7,
    title: 'Fractured but Whole',
    artist: 'Olivia Park',
    artistAvatar: 'OP',
    category: 'Sculpture',
    imageQuery: 'kintsugi-pottery-gold',
    description: 'Inspired by kintsugi, finding beauty in brokenness.',
    story: 'This piece taught me that my scars don\'t diminish my worth - they add to my story.',
    likes: 256,
    views: 1876,
    comments: 53,
    featured: true
  },
  {
    id: 8,
    title: 'Mindful Moments',
    artist: 'Noah Anderson',
    artistAvatar: 'NA',
    category: 'Digital Art',
    imageQuery: 'meditation-zen-mandala',
    description: 'Digital mandala created during meditation practice.',
    story: 'Creating mandalas became my moving meditation, helping me stay present.',
    likes: 145,
    views: 1089,
    comments: 24
  }
];

const categories = ['All', 'Painting', 'Photography', 'Digital Art', 'Sculpture', 'Mixed Media', 'Drawing'];

// Navigation
function navigate(page) {
  console.log("Navigating to:", page); // Debug log
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const pageElement = document.getElementById(`${page}-page`);
  if (pageElement) {
    pageElement.classList.add('active');
    currentPage = page;
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Render page content if needed
    if (page === 'programs' || page === 'dashboard') {
      renderProgramsPage();
    } else if (page === 'community') {
      renderCommunityPage();
    } else if (page === 'gallery') {
      renderGalleryPage();
    }
    
    // Update user display after rendering (small delay to ensure DOM is ready)
    setTimeout(() => {
      if (typeof updateCurrentUserDisplay === 'function') {
        updateCurrentUserDisplay();
      }
    }, 100);
  }
}


// Hamburger Menu Functionality
// Add this code to your existing script.js file

// Initialize hamburger menu on page load and after navigation
function initializeHamburgerMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a nav link
    const navLinkButtons = navLinks.querySelectorAll('.nav-link');
    navLinkButtons.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-left') && !e.target.closest('.mobile-menu-toggle')) {
        navLinks.classList.remove('active');
        if (mobileMenuToggle) {
          mobileMenuToggle.classList.remove('active');
        }
      }
    });
  }
}

// Call this function when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  initializeHamburgerMenu();
});

// Also re-initialize after each page navigation
// Modify your existing navigate function to call this after rendering
const originalNavigate = window.navigate;
if (originalNavigate) {
  window.navigate = function(page) {
    originalNavigate(page);
    setTimeout(initializeHamburgerMenu, 100);
  };
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Programs Page
function renderProgramsPage() {
  const filteredPrograms = programFilter === 'enrolled' 
    ? programs.filter(p => p.enrolled)
    : programs;
  
  const programsPage = document.getElementById('programs-page');
  programsPage.innerHTML = `
    <div class="min-h-screen gradient-bg">
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
                <!-- ADD THIS MOBILE MENU BUTTON -->
  <button class="mobile-menu-toggle" id="mobile-menu-toggle">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
              <div class="nav-links">
                <button class="nav-link" onclick="navigate('dashboard')">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Home
                </button>
                <button class="nav-link active">
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
            <div class="avatar" id="user-avatar"></div>
          </div>
        </div>
      </nav>

      <div class="container py-8 px-4">
        <!-- Header -->
        <div class="mb-8 fade-in-up">
          <h1 class="mb-2">Healing Programs</h1>
          <p class="text-muted-foreground mb-6">
            Structured pathways designed to support your transformation and growth
          </p>

          <div class="filter-buttons">
            <button class="btn ${programFilter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="filterPrograms('all')">
              All Programs
            </button>
            <button class="btn ${programFilter === 'enrolled' ? 'btn-primary' : 'btn-outline'}" onclick="filterPrograms('enrolled')">
              My Programs
            </button>
          </div>
        </div>

        <!-- Programs Grid -->
        <div class="programs-grid">
          ${filteredPrograms.map((program, index) => `
            <div class="program-card" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
              <div class="program-header-visual" style="background-color: ${program.color};">
                ${program.icon}
              </div>
              <div class="program-content">
                <div class="program-title-row">
                  <div>
                    <h3 class="mb-1">${program.name}</h3>
                    <div class="badge">${program.level}</div>
                  </div>
                  ${program.enrolled ? `
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ` : ''}
                </div>
                
                <p class="text-sm text-muted-foreground mb-4">
                  ${program.description}
                </p>

                ${program.enrolled && program.progress > 0 ? `
                  <div class="mb-4">
                    <div class="program-header">
                      <span class="text-sm text-muted-foreground">Progress</span>
                      <span class="text-sm font-semibold">${program.progress}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${program.progress}%;"></div>
                    </div>
                  </div>
                ` : ''}

                <div class="program-meta">
                  <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${program.duration}</span>
                  </div>
                  <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>${program.participants}</span>
                  </div>
                </div>

                <button class="btn ${program.enrolled ? 'btn-primary' : 'btn-outline'} w-full mt-4" onclick="handleProgramAction(${program.id})">
                  ${program.enrolled ? `
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Continue
                  ` : `
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Enroll Now
                  `}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Message Section -->
        <div class="message-card" style="animation: fadeInUp 0.8s ease-out 0.5s both;">
          <div class="max-w-4xl mx-auto">
            <h2 class="mb-4">Every Journey Begins With a Single Step</h2>
            <p class="mb-6">
              These programs are designed with care and intention to support you wherever you are 
              on your path. Remember: healing is not linear, and every step forward is progress.
            </p>
            <div class="message-footer">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Choose compassion. Choose growth. Choose yourself.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

}

function filterPrograms(filter) {
  programFilter = filter;
  renderProgramsPage();
}

function handleProgramAction(programId) {
  const program = programs.find(p => p.id === programId);
  if (program.enrolled) {
    showToast('Continuing your journey...');
  } else {
    showToast('Successfully enrolled in the program!');
  }
}

// Community Page
function renderCommunityPage() {
  const communityPage = document.getElementById('community-page');
  communityPage.innerHTML = `
    <div class="min-h-screen gradient-bg">
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
                <!-- ADD THIS MOBILE MENU BUTTON -->
  <button class="mobile-menu-toggle" id="mobile-menu-toggle">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
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
                <button class="nav-link active">
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
            <div class="avatar" id="user-avatar"></div>
          </div>
        </div>
      </nav>

      <div class="container py-8 px-4 community-container">
        <!-- Header -->
        <div class="mb-8 fade-in-up">
          <h1 class="mb-2">Community Circle</h1>
          <p class="text-muted-foreground">
            Share, connect, and support each other on this healing journey
          </p>
        </div>

        <!-- Reflection Notice -->
        <div class="notice-card fade-in-up">
          <div class="notice-header">
            <div class="notice-content">
              <div class="notice-title">
                <svg class="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                </svg>
                <h3>Weekly Reflection Check-in</h3>
              </div>
              <p class="text-muted-foreground mb-3">
                Take a moment to reflect on your journey this week. What insights have you gained? What challenges have you faced?
              </p>
              <div class="badge-warning">
                Due in 3 days
              </div>
            </div>
            <button class="btn-warning">
              Start Reflection
            </button>
          </div>
        </div>

        <!-- Create Post -->
        <div class="create-post-card fade-in-up">
          <div class="post-form">
            <div class="avatar" id="user-avatar"></div>
            <div style="flex: 1;">
              <textarea 
                id="new-post-textarea" 
                class="post-textarea" 
                placeholder="Share your thoughts, insights, or questions with the community..."
              ></textarea>
              <div class="post-actions">
                <button class="btn btn-primary" onclick="handleCreatePost()">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts Feed -->
        <div class="posts-feed">
          ${posts.map((post, index) => `
            <div class="post-card" style="animation: fadeInUp 0.5s ease-out ${0.3 + index * 0.1}s both;">
              <div class="post-header">
                <div class="post-avatar">${post.avatar}</div>
                <div class="post-content">
                  <div class="post-author-row">
                    <div class="post-author-info">
                      <h4>${post.author}</h4>
                      <div class="badge">${post.badge}</div>
                    </div>
                    <button class="btn-more">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                  <p class="post-time">${post.time}</p>
                  
                  <p class="post-text">${post.content}</p>

                  <div class="post-actions-row">
                    <button class="post-action-btn ${likedPosts.has(post.id) ? 'liked' : ''}" onclick="toggleLikePost(${post.id})">
                      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>${post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button class="post-action-btn">
                      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>${post.comments}</span>
                    </button>
                    <button class="post-action-btn">
                      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Encouragement Message -->
        <div class="encouragement-card" style="animation: fadeInUp 0.8s ease-out 0.8s both;">
          <svg class="encouragement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3 class="mb-2">You Are Not Alone</h3>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            This is a space of compassion, understanding, and growth. Share your journey, 
            support others, and remember that every voice here matters.
          </p>
        </div>
      </div>
    </div>
  `;
  ;
}

function handleCreatePost() {
  const textarea = document.getElementById('new-post-textarea');
  if (textarea && textarea.value.trim()) {
    showToast('Your thoughts have been shared with the community!');
    textarea.value = '';
  }
}

function toggleLikePost(postId) {
  if (likedPosts.has(postId)) {
    likedPosts.delete(postId);
  } else {
    likedPosts.add(postId);
    showToast('Post liked!');
  }
  renderCommunityPage();
}

// Gallery Page
function renderGalleryPage() {
  const filteredArtworks = selectedCategory === 'All' 
    ? artworks 
    : artworks.filter(art => art.category === selectedCategory);
  
  const galleryPage = document.getElementById('gallery-page');
  galleryPage.innerHTML = `
    <div class="min-h-screen gradient-bg">
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
                <!-- ADD THIS MOBILE MENU BUTTON -->
  <button class="mobile-menu-toggle" id="mobile-menu-toggle">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
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
                <button class="nav-link" onclick="navigate('community')">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Community
                </button>
                <button class="nav-link active">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
                  </svg>
                  Gallery
                </button>
              </div>
            </div>
            <div class="avatar" id="user-avatar"></div>
          </div>
        </div>
      </nav>

      <div class="container py-8 px-4">
        <!-- Header -->
        <div class="gallery-header fade-in-up">
          <div>
            <h1 class="mb-2">Healing Through Art</h1>
            <p class="text-muted-foreground">
              A space where creativity becomes medicine and expression leads to healing
            </p>
          </div>
          <button class="btn btn-primary" onclick="handleShareArt()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Share Your Art
          </button>
        </div>

        <!-- Featured Banner -->
        <div class="featured-banner fade-in-up">
          <div class="featured-header">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
            </svg>
            <h2>Art of the Week</h2>
          </div>
          <p class="mb-4">
            Featured artwork selected by our community for its powerful healing message and creative expression.
          </p>
          <div class="badge badge-white">
            Community Choice
          </div>
        </div>

        <!-- Categories -->
        <div class="categories-filter fade-in-up">
          ${categories.map(category => `
            <button 
              class="category-badge ${selectedCategory === category ? 'active' : ''}" 
              onclick="selectCategory('${category}')"
            >
              ${category}
            </button>
          `).join('')}
        </div>

        <!-- Gallery Grid -->
        <div class="gallery-grid">
          ${filteredArtworks.map((artwork, index) => `
            <div class="art-card" style="animation: fadeInUp 0.5s ease-out ${index * 0.05}s both;" onclick="viewArtwork(${artwork.id})">
              <div class="art-image-container">
                <img 
                  src="https://source.unsplash.com/800x800/?${artwork.imageQuery}" 
                  alt="${artwork.title}"
                  class="art-image"
                  onerror="this.src='https://via.placeholder.com/800x800/F3E5D0/505A5B?text=${encodeURIComponent(artwork.title)}'"
                />
                ${artwork.featured ? `
                  <div class="featured-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                    </svg>
                    Featured
                  </div>
                ` : ''}
              </div>
              <div class="art-details">
                <h3 class="art-title">${artwork.title}</h3>
                <div class="art-artist-row">
                  <div class="art-avatar">${artwork.artistAvatar}</div>
                  <span class="text-sm text-muted-foreground">${artwork.artist}</span>
                </div>
                <p class="art-description">${artwork.description}</p>
                <div class="art-stats">
                  <div class="art-stat ${likedArt.has(artwork.id) ? 'liked' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${artwork.likes + (likedArt.has(artwork.id) ? 1 : 0)}</span>
                  </div>
                  <div class="art-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>${artwork.views}</span>
                  </div>
                  <div class="art-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>${artwork.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- About Art Therapy -->
        <div class="about-art-card fade-in-up">
          <svg class="art-therapy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2Z"></path>
          </svg>
          <h2 class="mb-4">The Healing Power of Art</h2>
          <p class="text-muted-foreground leading-relaxed mb-6 max-w-4xl mx-auto">
            Art therapy is a powerful tool for emotional healing and self-expression. 
            Through creating and sharing art, we process emotions, tell our stories, 
            and connect with others on a deeply authentic level. Every piece in this 
            gallery represents a journey of courage, vulnerability, and transformation.
          </p>
          <div class="art-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Your art matters. Your story matters. You matter.</span>
          </div>
        </div>
      </div>
    </div>
  `;


}

function selectCategory(category) {
  selectedCategory = category;
  renderGalleryPage();
}

function viewArtwork(artworkId) {
  const artwork = artworks.find(a => a.id === artworkId);
  if (artwork) {
    showToast(`Viewing: ${artwork.title}`);
  }
}

function handleShareArt() {
  showToast('Upload feature coming soon!');
}

// Event Listeners
// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Auth form
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (isLoginMode) {
        handleLogin();
      } else {
        handleSignup();
      }
    });
  }
  
  // Auth toggle
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
});

// Mobile Menu Toggle
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.mobile-menu-toggle');
  if (toggle) {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.classList.toggle('mobile-active');
    }
  }
  
  // Close menu when clicking outside
  if (!e.target.closest('.nav-left')) {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.classList.remove('mobile-active');
    }
  }
});

// Close mobile menu when nav link is clicked
document.addEventListener('click', (e) => {
  if (e.target.closest('.nav-link')) {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.classList.remove('mobile-active');
    }
  }
});
  




  
