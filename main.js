// Define currency and balance ranges
let currencySymbol = '£'; // Default to GBP temporarily
let currencyCode = 'GBP';
let minBalance = 5;
let maxBalance = 100;

// Function to fetch user country data using ipinfo
async function fetchUserLocation() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=81e788912b1532`);
        if (response.ok) {
            const data = await response.json();
            const countryCode = data.country;

            switch (countryCode) {
                case 'US': // United States
                    currencySymbol = '$';
                    currencyCode = 'USD';
                    minBalance = 5;
                    maxBalance = 100;
                    break;
                case 'GB': // United Kingdom
                    currencySymbol = '£';
                    currencyCode = 'GBP';
                    minBalance = 5;
                    maxBalance = 100;
                    break;
                case 'CA': // Canada
                    currencySymbol = 'C$';
                    currencyCode = 'CAD';
                    minBalance = 5;
                    maxBalance = 100;
                    break;
                case 'AU': // Australia
                    currencySymbol = 'A$';
                    currencyCode = 'AUD';
                    minBalance = 5;
                    maxBalance = 100;
                    break;
                default: // Other countries
                    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
                    if (euCountries.includes(countryCode)) {
                        currencySymbol = '€';
                        currencyCode = 'EUR';
                        minBalance = 5;
                        maxBalance = 100;
                    } else {
                        currencySymbol = '$';
                        currencyCode = 'USD';
                        minBalance = 5;
                        maxBalance = 100;
                    }
            }
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        // Default to USD if there's an error
        currencySymbol = '$';
        currencyCode = 'USD';
    }
}

// Update the generateRandomBalance function to use the correct currency
function generateRandomBalance() {
    const multiples = Array.from({ length: (maxBalance / 5) }, (_, i) => (i + 1) * 5);
    return `${currencySymbol}${multiples[Math.floor(Math.random() * multiples.length)]}`;
}

// Function to generate random code and balance animation
function animateCode(duration) {
    const startTime = Date.now();
    const balance = generateRandomBalance(); // This already includes the currency symbol
    const randomCode = generateRandomCode();
    const codeLength = randomCode.length;

    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let displayedCode = '';

        for (let i = 0; i < codeLength; i++) {
            if (i >= codeLength - 5) {
                displayedCode += '*';
            } else if (randomCode[i] === '-') {
                displayedCode += '-';
            } else {
                displayedCode += getRandomChar();
            }
        }

        codeElement.textContent = displayedCode;

        if (elapsed >= duration) {
            clearInterval(interval);
            codeElement.textContent = randomCode.slice(0, -5) + '*****';
            balanceElement.textContent = `Gift Card Balance: ${balance}`; // Use 'balance' directly
            balanceElement.style.display = 'block';
            redeemBtn.classList.remove('hidden');
            infoText.innerHTML = "<strong>Your code is ready!</strong>";
            setLastGenerated();
        }
    }, 100);
}

// Get references to modal elements
const codeElement = document.getElementById('giftCardCode');
const balanceElement = document.getElementById('giftCardBalance');
const generateBtn = document.getElementById('generateBtn');
const redeemBtn = document.getElementById('redeemBtn');
const infoText = document.getElementById('infoText');
const redeemModal = document.getElementById('redeemModal');
const redeemItemText = document.getElementById('redeemItemText');
const confirmBtn = document.getElementById('confirmBtn');

// Helper functions
function getRandomChar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return chars[Math.floor(Math.random() * chars.length)];
}

function generateRandomCode() {
    let code = '';
    for (let i = 0; i < 5; i++) {
        if (i > 0) code += '-';
        for (let j = 0; j < 5; j++) {
            code += getRandomChar();
        }
    }
    return code;
}

function canGenerateCode() {
    const lastGenerated = localStorage.getItem('lastGenerated');
    if (!lastGenerated) return true;
    const now = new Date().getTime();
    const waitTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return (now - lastGenerated) >= waitTime;
}

function setLastGenerated() {
    localStorage.setItem('lastGenerated', new Date().getTime());
}

// Make sure the location is fetched before allowing code generation
generateBtn.addEventListener('click', async () => {
    await fetchUserLocation(); // Ensure the location data is fetched before proceeding
    
    if (!canGenerateCode()) {
    const lastGenerated = new Date(parseInt(localStorage.getItem('lastGenerated')));
    const remainingTime = 5 * 60 * 1000 - (new Date().getTime() - lastGenerated.getTime());
    const minutesRemaining = Math.ceil(remainingTime / (1000 * 60));
    infoText.innerHTML = `<strong class="error">Please wait ${minutesRemaining} minute(s) before generating a new code.</strong>`;
    return;
}

    infoText.innerHTML = "<strong>Please wait a moment, the code is being generated...</strong>";
    generateBtn.classList.add('hidden');
    codeElement.classList.remove('hidden');

    const duration = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000; // Duration for animation
    animateCode(duration);
});

// Update the modal with the balance when "REDEEM NOW" is clicked
redeemBtn.addEventListener('click', () => {
    redeemItemText.textContent = `Xbox Digital Gift Card - ${currencySymbol}${balanceElement.textContent.split(currencySymbol)[1]}`;
    redeemModal.classList.remove('hidden'); // Show the modal
});



// Initial call to fetch the user's location when the page loads
fetchUserLocation();


// IPInfo API token
const ipinfoToken = '81e788912b1532';

// Fetch user's location based on IP
fetch(`https://ipinfo.io/json?token=${ipinfoToken}`)
    .then(response => response.json())
    .then(data => {
        const country = data.country;
        const supportedLanguages = {
            'DE': 'de', // German for Germany
            'FR': 'fr', // French for France
            'ES': 'es', // Spanish for Spain
            'IT': 'it', // Italian for Italy
            'NL': 'nl', // Dutch for Netherlands
            'PT': 'pt', // Portuguese for Portugal
            'SE': 'sv', // Swedish for Sweden
            'NO': 'no', // Norwegian for Norway
            'FI': 'fi', // Finnish for Finland
            'DK': 'da', // Danish for Denmark
            'RU': 'ru', // Russian for Russia
            'PL': 'pl', // Polish for Poland
            'TR': 'tr', // Turkish for Turkey
            'GR': 'el', // Greek for Greece
            'HU': 'hu', // Hungarian for Hungary
            'CZ': 'cs', // Czech for Czech Republic
            'RO': 'ro', // Romanian for Romania
            'BG': 'bg', // Bulgarian for Bulgaria
            'US': 'en', // English for USA
            'CA': 'fr', // French for Canada (default to French)
            'MX': 'es', // Spanish for Mexico
            // Add more countries and languages if needed
        };

        // Check if the user's country is in the supported list
        const userLanguage = supportedLanguages[country] || 'en'; // Default to English if not listed

        // Load the language file dynamically (assuming translations are in JSON files)
        fetch(`/assets/lang/${userLanguage}.json`)
            .then(response => response.json())
            .then(translation => {
                // Replace all placeholders with translated text
                document.querySelectorAll('[data-translate]').forEach(element => {
                    const key = element.getAttribute('data-translate');
                    if (translation[key]) {
                        element.textContent = translation[key];
                    }
                });
            })
            .catch(error => console.error('Error loading language file:', error));
    })
    .catch(error => console.error('Error fetching IPInfo data:', error));
