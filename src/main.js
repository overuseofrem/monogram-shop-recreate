import './style.css'

// =================================================================================
// --- 1. GENERIC SIDEBAR NAVIGATION ---
// =================================================================================
const sidebarOverlay = document.getElementById('sidebar-overlay');

const openSidebar = (sidebarElement) => {
  if (sidebarElement) {
    if (sidebarElement.id === 'shopping-cart') {
      sidebarElement.classList.remove('translate-x-full');
    } else {
      sidebarElement.classList.remove('-translate-x-full');
    }
    document.body.classList.add('overflow-hidden');
    sidebarOverlay.classList.remove('invisible', 'opacity-0');
  }
};

const closeSidebar = (sidebarElement) => {
  if (sidebarElement) {
    if (sidebarElement.id === 'shopping-cart') {
      sidebarElement.classList.add('translate-x-full');
    } else {
      sidebarElement.classList.add('-translate-x-full');
    }
    sidebarOverlay.classList.add('opacity-0');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      sidebarOverlay.classList.add('invisible');
    }, 400); // Must match CSS transition duration
  }
};

// --- Mobile Menu ---
const mobileMenu = document.getElementById('sidebar');
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');

openMenuBtn.addEventListener('click', () => openSidebar(mobileMenu));
closeMenuBtn.addEventListener('click', () => closeSidebar(mobileMenu));

// --- Shopping Cart ---
const shoppingCart = document.getElementById('shopping-cart');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

openCartBtn.addEventListener('click', () => openSidebar(shoppingCart));
closeCartBtn.addEventListener('click', () => closeSidebar(shoppingCart));

// --- Overlay to close any open sidebar ---
sidebarOverlay.addEventListener('click', () => {
    closeSidebar(mobileMenu);
    closeSidebar(shoppingCart);
});


// =================================================================================
// --- 2. WORKFLOW DROPDOWN ---
// =================================================================================
const workflowDropdown = document.getElementById('workflow-open-dropdown');
const workflowMenu = document.getElementById('workflow-menu');

const openDropdown = () => {
  workflowMenu.classList.remove('hidden');
  workflowDropdown.classList.add('text-white!');
  workflowDropdown.classList.remove('hover:text-blue-100!');
};

const closeDropdown = () => {
  workflowMenu.classList.add('hidden');
  workflowDropdown.classList.remove('text-white!');
  workflowDropdown.classList.add('hover:text-blue-100!');
};

workflowDropdown.addEventListener('click', (event) => {
  event.stopPropagation();
  if (workflowMenu.classList.contains('hidden')) {
    openDropdown();
  } else {
    closeDropdown();
  }
});

document.addEventListener('click', (event) => {
  if (!workflowMenu.contains(event.target)) {
    closeDropdown();
  }
});


// =================================================================================
// --- 3. CURRENCY DROPDOWN & CONVERSION (FINAL) ---
// =================================================================================

// --- Element References ---
const currencyDropdownButton = document.getElementById('currency-dropdown-button');
const currencyMenu = document.getElementById('currency-menu');
const currencyLinks = currencyMenu.querySelectorAll('.dropdown-link');
const currencySymbolSpan = document.getElementById('currency-symbol');
const currencyCodeSpan = document.getElementById('currency-code');
const priceElements = document.querySelectorAll('.prod-price');

// --- State Variables ---
let exchangeRates = {}; // To store the fetched exchange rates

// --- API Function ---
const fetchExchangeRates = async () => {
  const apiUrl = 'https://open.er-api.com/v6/latest/USD';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    exchangeRates = data.rates;
    console.log('Exchange rates loaded successfully!');
    updatePrices('USD', '$'); // Set initial prices to USD
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Using fallback rates
    exchangeRates = { 'USD': 1.0, 'EUR': 0.92, 'JPY': 157, 'CAD': 1.37, 'GBP': 0.79 };
    updatePrices('USD', '$'); // Still set initial prices even if API fails
  }
};

// --- Price Update Function ---
const updatePrices = (currencyCode, currencySymbol) => {
  if (!exchangeRates[currencyCode]) {
    console.error(`Exchange rate for ${currencyCode} not found.`);
    return;
  }

  const rate = exchangeRates[currencyCode];

  priceElements.forEach(span => {
    const basePriceUSD = parseFloat(span.dataset.priceUsd);
    if (!isNaN(basePriceUSD)) {
      const convertedPrice = (basePriceUSD * rate).toFixed(0);
      span.textContent = `${currencySymbol}${convertedPrice}`;
    }
  });
};


// --- Dropdown Logic ---
const closeCurrencyDropdown = () => {
  currencyMenu.classList.add('hidden');
};

currencyDropdownButton.addEventListener('click', (event) => {
  event.stopPropagation();
  currencyMenu.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!currencyMenu.contains(event.target) && !currencyDropdownButton.contains(event.target)) {
    closeCurrencyDropdown();
  }
});

currencyLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedLink = event.currentTarget;

    const newCode = selectedLink.textContent.split(' ')[0];
    const newSymbol = selectedLink.dataset.symbol;

    // --- 1. Update the Button Text ---
    currencySymbolSpan.textContent = newSymbol;
    currencyCodeSpan.textContent = newCode;
    
    // --- 2. Update Prices ---
    updatePrices(newCode, newSymbol);

    // --- 3. Update Active Classes ---
    currencyLinks.forEach(l => l.classList.remove('text-white!', 'bg-primary!'));
    selectedLink.classList.add('text-white!', 'bg-primary!');

    // --- 4. Close Dropdown ---
    closeCurrencyDropdown();
  });
});

// --- Initial Fetch ---
// Fetch rates and format initial prices when the page loads
fetchExchangeRates();