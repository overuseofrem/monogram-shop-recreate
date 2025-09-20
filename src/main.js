import './style.css'

// --- Open sidebar nav menu ---
const sidebar = document.getElementById('sidebar');
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const openSidebar = () => {
  sidebar.classList.remove('-translate-x-full');
  document.body.classList.add('overflow-hidden');
  sidebarOverlay.classList.remove('invisible');
  sidebarOverlay.classList.remove('opacity-0');
};
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

// -- Dropdown --
const workflowDropdown = document.getElementById('workflow-open-dropdown');
const workflowMenu = document.getElementById('workflow-menu');

const openDropdown = () => {
  workflowMenu.classList.remove('hidden');
  workflowDropdown.classList.remove('hover:text-blue-100!');
  workflowDropdown.classList.add('text-white!');
}
const closeDropdown = () => {
  workflowMenu.classList.add('hidden');
  workflowDropdown.classList.add('hover:text-blue-100!');
  workflowDropdown.classList.remove('text-white!');
}

workflowDropdown.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent the document click listener from firing immediately

  // Check if the menu is currently hidden (closed)
  if (workflowMenu.classList.contains('hidden')) {
    openDropdown(); // If closed, open it
  } else {
    closeDropdown(); // If open, close it
  }
});

document.addEventListener('click', (event) => {
  // If the clicked element is not inside the workflowMenu, close the dropdown
  // We no longer need to check for workflowDropdown here, as its click handler handles its toggle
  if (!workflowMenu.contains(event.target)) {
    closeDropdown();
  }
});