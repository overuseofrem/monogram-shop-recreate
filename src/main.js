// Import styles
import './style.css'

/* =======================================================================
   SIDEBAR NAVIGATION SYSTEM
   ======================================================================= */

/**
 * Generic sidebar management system for both mobile menu and shopping cart
 * Handles opening, closing, and overlay functionality
 */

// Get the background overlay element used by both sidebars
const sidebarOverlay = document.getElementById('sidebar-overlay');

/**
 * Opens a sidebar by removing transform classes and showing overlay
 * @param {HTMLElement} sidebarElement - The sidebar element to open
 */
const openSidebar = (sidebarElement) => {
  if (sidebarElement) {
    // Different sidebars slide from different directions
    if (sidebarElement.id === 'shopping-cart') {
      // Shopping cart slides in from the right
      sidebarElement.classList.remove('translate-x-full');
    } else {
      // Mobile menu slides in from the left
      sidebarElement.classList.remove('-translate-x-full');
    }
    
    // Prevent background scrolling and show overlay
    document.body.classList.add('overflow-hidden');
    sidebarOverlay.classList.remove('invisible', 'opacity-0');
  }
};

/**
 * Closes a sidebar by adding transform classes and hiding overlay
 * @param {HTMLElement} sidebarElement - The sidebar element to close
 */
const closeSidebar = (sidebarElement) => {
  if (sidebarElement) {
    // Move sidebar off-screen in appropriate direction
    if (sidebarElement.id === 'shopping-cart') {
      sidebarElement.classList.add('translate-x-full');
    } else {
      sidebarElement.classList.add('-translate-x-full');
    }
    
    // Start overlay fade-out animation
    sidebarOverlay.classList.add('opacity-0');
    document.body.classList.remove('overflow-hidden');
    
    // Hide overlay completely after animation completes
    setTimeout(() => {
      sidebarOverlay.classList.add('invisible');
    }, 400); // Must match CSS transition duration
  }
};

/* -----------------------------------------------------------------------
   MOBILE MENU SIDEBAR
   ----------------------------------------------------------------------- */

// Get mobile menu elements
const mobileMenu = document.getElementById('sidebar');
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');

// Set up mobile menu event listeners
openMenuBtn.addEventListener('click', () => openSidebar(mobileMenu));
closeMenuBtn.addEventListener('click', () => closeSidebar(mobileMenu));

/* -----------------------------------------------------------------------
   SHOPPING CART SIDEBAR
   ----------------------------------------------------------------------- */

// Get shopping cart elements
const shoppingCart = document.getElementById('shopping-cart');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

// Set up shopping cart event listeners
openCartBtn.addEventListener('click', () => openSidebar(shoppingCart));
closeCartBtn.addEventListener('click', () => closeSidebar(shoppingCart));

/* -----------------------------------------------------------------------
   OVERLAY CLICK TO CLOSE
   ----------------------------------------------------------------------- */

// Close any open sidebar when clicking on the background overlay
sidebarOverlay.addEventListener('click', () => {
  closeSidebar(mobileMenu);
  closeSidebar(shoppingCart);
});

/* =======================================================================
   WORKFLOW DROPDOWN MENU
   ======================================================================= */

/**
 * Desktop navigation dropdown for workflow options
 * Shows/hides workflow menu and manages button states
 */

// Get workflow dropdown elements
const workflowDropdown = document.getElementById('workflow-open-dropdown');
const workflowMenu = document.getElementById('workflow-menu');

/**
 * Shows the workflow dropdown menu and updates button styling
 */
const openDropdown = () => {
  workflowMenu.classList.remove('hidden');
  // Change button appearance when dropdown is open
  workflowDropdown.classList.add('text-white!');
  workflowDropdown.classList.remove('hover:text-blue-100!');
};

/**
 * Hides the workflow dropdown menu and resets button styling
 */
const closeDropdown = () => {
  workflowMenu.classList.add('hidden');
  // Reset button appearance when dropdown is closed
  workflowDropdown.classList.remove('text-white!');
  workflowDropdown.classList.add('hover:text-blue-100!');
};

// Toggle dropdown when button is clicked
workflowDropdown.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent event from bubbling up
  
  if (workflowMenu.classList.contains('hidden')) {
    openDropdown();
  } else {
    closeDropdown();
  }
});

// Close dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  if (!workflowMenu.contains(event.target)) {
    closeDropdown();
  }
});

/* =======================================================================
   CURRENCY DROPDOWN & PRICE CONVERSION SYSTEM
   ======================================================================= */

/**
 * Dynamic currency conversion system with live exchange rates
 * Fetches current rates from API and updates all product prices
 */

/* -----------------------------------------------------------------------
   ELEMENT REFERENCES
   ----------------------------------------------------------------------- */

// Get currency dropdown elements
const currencyDropdownButton = document.getElementById('currency-dropdown-button');
const currencyMenu = document.getElementById('currency-menu');
const currencyLinks = currencyMenu.querySelectorAll('.dropdown-link');

// Get display elements for current currency
const currencySymbolSpan = document.getElementById('currency-symbol');
const currencyCodeSpan = document.getElementById('currency-code');

// Get all product price elements that need updating
const priceElements = document.querySelectorAll('.prod-price');

/* -----------------------------------------------------------------------
   STATE MANAGEMENT
   ----------------------------------------------------------------------- */

// Store fetched exchange rates for currency conversion
let exchangeRates = {};

/* -----------------------------------------------------------------------
   EXCHANGE RATE API INTEGRATION
   ----------------------------------------------------------------------- */

/**
 * Fetches current exchange rates from external API
 * Falls back to hardcoded rates if API is unavailable
 */
const fetchExchangeRates = async () => {
  const apiUrl = 'https://open.er-api.com/v6/latest/USD';
  
  try {
    console.log('Fetching exchange rates from API...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    exchangeRates = data.rates;
    console.log('Exchange rates loaded successfully!', exchangeRates);
    
    // Initialize prices in USD
    updatePrices('USD', '$');
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    console.log('Using fallback exchange rates...');
    
    // Fallback rates for basic functionality if API fails
    exchangeRates = {
      'USD': 1.0,
      'CAD': 1.37,
      'EUR': 0.92,
      'AUD': 1.55,
      'GBP': 0.79,
      'KRW': 1340,
      'JPY': 157
    };
    
    // Still initialize prices even with fallback rates
    updatePrices('USD', '$');
  }
};

/* -----------------------------------------------------------------------
   PRICE UPDATE SYSTEM
   ----------------------------------------------------------------------- */

/**
 * Updates all product prices to the selected currency
 * @param {string} currencyCode - Three-letter currency code (e.g., 'EUR')
 * @param {string} currencySymbol - Currency symbol to display (e.g., '€')
 */
const updatePrices = (currencyCode, currencySymbol) => {
  // Check if we have the exchange rate for this currency
  if (!exchangeRates[currencyCode]) {
    console.error(`Exchange rate for ${currencyCode} not found.`);
    return;
  }
  
  const rate = exchangeRates[currencyCode];
  console.log(`Updating prices to ${currencyCode} (rate: ${rate})`);
  
  // Update each product price element
  priceElements.forEach(span => {
    const basePriceUSD = parseFloat(span.dataset.priceUsd);
    
    if (!isNaN(basePriceUSD)) {
      // Convert USD price to selected currency and round to whole number
      const convertedPrice = (basePriceUSD * rate).toFixed(0);
      span.textContent = `${currencySymbol}${convertedPrice}`;
    }
  });
};

/* -----------------------------------------------------------------------
   DROPDOWN UI MANAGEMENT
   ----------------------------------------------------------------------- */

/**
 * Closes the currency dropdown menu
 */
const closeCurrencyDropdown = () => {
  currencyMenu.classList.add('hidden');
};

// Toggle dropdown when button is clicked
currencyDropdownButton.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent event bubbling
  currencyMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideDropdown = currencyMenu.contains(event.target);
  const isClickOnButton = currencyDropdownButton.contains(event.target);
  
  if (!isClickInsideDropdown && !isClickOnButton) {
    closeCurrencyDropdown();
  }
});

/* -----------------------------------------------------------------------
   CURRENCY SELECTION HANDLING
   ----------------------------------------------------------------------- */

// Handle currency selection from dropdown
currencyLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    
    const selectedLink = event.currentTarget;
    
    // Extract currency info from link text and data attributes
    const newCode = selectedLink.textContent.split(' ')[0]; // e.g., "USD" from "USD ($)"
    const newSymbol = selectedLink.dataset.symbol; // e.g., "$"
    
    console.log(`Currency changed to: ${newCode} (${newSymbol})`);
    
    // Update the dropdown button display
    currencySymbolSpan.textContent = newSymbol;
    currencyCodeSpan.textContent = newCode;
    
    // Convert all prices to new currency
    updatePrices(newCode, newSymbol);
    
    // Update visual state of dropdown items
    currencyLinks.forEach(l => l.classList.remove('text-white!', 'bg-primary!'));
    selectedLink.classList.add('text-white!', 'bg-primary!');
    
    // Close the dropdown
    closeCurrencyDropdown();
  });
});

/* -----------------------------------------------------------------------
   INITIALIZATION
   ----------------------------------------------------------------------- */

/**
 * Initialize the application when page loads
 * Fetch exchange rates and set up initial price display
 */
console.log('Initializing currency system...');
fetchExchangeRates();