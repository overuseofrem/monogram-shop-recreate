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

// --- Currency Dropdown ---

// 1. Get references to all the necessary HTML elements
const currencyDropdownButton = document.getElementById('currency-dropdown-button');
const currencyMenu = document.getElementById('currency-menu');
const currencyLinks = currencyMenu.querySelectorAll('.dropdown-link');
const currencySymbolSpan = document.getElementById('currency-symbol');
const currencyCodeSpan = document.getElementById('currency-code');

// Function to close the dropdown
const closeCurrencyDropdown = () => {
  currencyMenu.classList.add('hidden');
}

// 2. Add a click listener to the button to toggle the dropdown
currencyDropdownButton.addEventListener('click', (event) => {
  // Stop the click from bubbling up to the document
  event.stopPropagation();
  // Toggle the 'hidden' class to show/hide the menu
  currencyMenu.classList.toggle('hidden');
});

// 3. Add a click listener to the whole document to close the menu
document.addEventListener('click', (event) => {
  // If the click is outside the menu AND outside the button, close it
  if (!currencyMenu.contains(event.target) && !currencyDropdownButton.contains(event.target)) {
    closeCurrencyDropdown();
  }
});

// 4. Loop through each currency link and add a click listener
currencyLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    // Prevent the link from navigating away (the default <a> tag behavior)
    event.preventDefault();

    const selectedLink = event.currentTarget;

    // --- Update the Button Text ---
    const selectedText = selectedLink.textContent; // e.g., "CAD ($)"
    const newCode = selectedText.split(' ')[0];    // "CAD"
    const newSymbol = selectedLink.dataset.symbol; // Gets the symbol from our data attribute

    currencySymbolSpan.textContent = newSymbol;
    currencyCodeSpan.textContent = newCode;

    // --- Update Active Classes ---
    // First, remove the active classes from ALL links
    currencyLinks.forEach(l => {
      l.classList.remove('text-white!', 'bg-primary!');
    });

    // Then, add the active classes to ONLY the one that was clicked
    selectedLink.classList.add('text-white!', 'bg-primary!');

    // Finally, close the dropdown after making a selection
    closeCurrencyDropdown();
  });
});