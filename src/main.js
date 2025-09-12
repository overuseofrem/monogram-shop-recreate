import './style.css'

// --- Open sidebar nav menu ---
const sidebar = document.getElementById('sidebar');
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// This function remains the same
const openSidebar = () => {
  sidebar.classList.remove('-translate-x-full');
  document.body.classList.add('overflow-hidden');
  sidebarOverlay.classList.remove('invisible');
  sidebarOverlay.classList.remove('opacity-0');
};

// --- THIS IS THE UPDATED FUNCTION ---
const closeSidebar = () => {
  // 1. Start the animations immediately
  sidebar.classList.add('-translate-x-full'); // Start sidebar slide-out
  sidebarOverlay.classList.add('opacity-0'); // Start overlay fade-out
  document.body.classList.remove('overflow-hidden'); // Re-enable scrolling

  // 2. Wait for the animations to finish, THEN hide the overlay
  setTimeout(() => {
    sidebarOverlay.classList.add('invisible');
  }, 400); // IMPORTANT: Must match CSS
};

// Event listeners remain the same
openMenuBtn.addEventListener('click', openSidebar);
closeMenuBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);