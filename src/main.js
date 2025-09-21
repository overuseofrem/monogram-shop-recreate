import './style.css'

// =================================================================================
// --- 1. SIDEBAR NAVIGATION ---
// =================================================================================
const sidebar = document.getElementById('sidebar');
const openMenuBtn = document.getElementById('open-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const openSidebar = () => {
  sidebar.classList.remove('-translate-x-full');
  document.body.classList.add('overflow-hidden');
  sidebarOverlay.classList.remove('invisible', 'opacity-0');
};

const closeSidebar = () => {
  sidebar.classList.add('-translate-x-full');
  sidebarOverlay.classList.add('opacity-0');
  document.body.classList.remove('overflow-hidden');
  setTimeout(() => {
    sidebarOverlay.classList.add('invisible');
  }, 400); // Must match CSS transition duration
};

openMenuBtn.addEventListener('click', openSidebar);
closeMenuBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);


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
// --- 3. CURRENCY DROPDOWN & CONVERSION ---
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
  // Using a free, no-key-required API for exchange rates
  const apiUrl = 'https://open.er-api.com/v6/latest/USD';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    exchangeRates = data.rates;
    console.log('Exchange rates loaded successfully!', exchangeRates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Provide fallback rates in case the API fails
    exchangeRates = { 'USD': 1.0, 'EUR': 0.9, 'JPY': 145, 'CAD': 1.35, 'GBP': 0.8 };
  }
};

// --- Price Update Function ---
const updatePrices = (newCurrency) => {
  if (!exchangeRates[newCurrency]) {
    console.error(`Exchange rate for ${newCurrency} not found.`);
    return;
  }

  const rate = exchangeRates[newCurrency];

  priceElements.forEach(span => {
    const basePriceUSD = parseFloat(span.dataset.priceUsd);
    if (!isNaN(basePriceUSD)) {
      const convertedPrice = (basePriceUSD * rate).toFixed(0); // Using toFixed(0) for whole numbers
      span.textContent = convertedPrice;
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

    // --- Get New Currency Info ---
    const newCode = selectedLink.textContent.split(' ')[0];
    const newSymbol = selectedLink.dataset.symbol;

    // --- 1. Update the Button Text ---
    currencySymbolSpan.textContent = newSymbol;
    currencyCodeSpan.textContent = newCode;
    
    // --- 2. Update Prices ---
    updatePrices(newCode);

    // --- 3. Update Active Classes ---
    currencyLinks.forEach(l => l.classList.remove('text-white!', 'bg-primary!'));
    selectedLink.classList.add('text-white!', 'bg-primary!');

    // --- 4. Close Dropdown ---
    closeCurrencyDropdown();
  });
});

// --- Initial Fetch ---
// Fetch rates when the page loads
fetchExchangeRates();