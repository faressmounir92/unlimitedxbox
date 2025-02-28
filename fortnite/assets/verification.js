// Global state
const state = {
    verificationCode: null,
    timerInterval: null,
    codeRevealed: false
};

// Timer functionality
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    
    function updateDisplay() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.minutes.textContent = minutes;
        display.seconds.textContent = seconds;

        if (--timer < 0) {
            // Reset timer when it expires
            timer = duration;
            if (state.codeRevealed) {
                // Generate new code when timer expires
                state.verificationCode = generateVerificationCode();
                updateCodeDisplay();
            }
        }
    }
    
    updateDisplay();
    return setInterval(updateDisplay, 1000);
}

// Generate random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Update the code display after survey completion
function updateCodeDisplay() {
    const codePlaceholder = document.querySelector('.code-placeholder');
    const codeReveal = document.querySelector('.code-reveal');
    const copyButton = document.getElementById('copy-button');
    
    if (state.codeRevealed) {
        codeReveal.style.display = 'none';
        codePlaceholder.textContent = state.verificationCode;
        
        // Enable copy button
        copyButton.classList.remove('disabled');
        copyButton.removeAttribute('disabled');
        
        // Start timer if not already running
        if (!state.timerInterval) {
            const display = {
                minutes: document.getElementById('minutes'),
                seconds: document.getElementById('seconds')
            };
            state.timerInterval = startTimer(300, display); // 5 minutes = 300 seconds
        }
    }
}

// Copy code to clipboard
function copyCodeToClipboard() {
    if (!state.codeRevealed) return;
    
    navigator.clipboard.writeText(state.verificationCode)
        .then(() => {
            const copyButton = document.getElementById('copy-button');
            const originalText = copyButton.innerHTML;
            
            copyButton.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

// These functions are no longer needed since the modal was removed

// Show loading overlay
function showLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Process verification directly
function processVerification(event) {
    event.preventDefault();
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate processing delay
    setTimeout(() => {
        // Generate verification code
        state.verificationCode = generateVerificationCode();
        state.codeRevealed = true;
        
        // Update UI
        updateCodeDisplay();
        
        // Hide loading overlay
        hideLoadingOverlay();
        
        // Update button text
        const surveyButton = document.getElementById('survey-button');
        surveyButton.innerHTML = '<i class="fas fa-check-circle"></i><span>VERIFICATION COMPLETED</span>';
        surveyButton.style.background = 'linear-gradient(135deg, var(--success-color), #00cc00)';
        surveyButton.style.pointerEvents = 'none';
        
        // Add success animation
        addSuccessEffects();
    }, 3000);
}

// Add success effects after verification
function addSuccessEffects() {
    // Create glow effect around the code
    const codePlaceholder = document.querySelector('.code-placeholder');
    codePlaceholder.style.boxShadow = '0 0 20px var(--glow-secondary)';
    codePlaceholder.style.transition = 'box-shadow 0.5s ease';
    
    // Add pulsing animation to the code
    const animateCode = () => {
        codePlaceholder.animate([
            { transform: 'scale(1)', boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' },
            { transform: 'scale(1.03)', boxShadow: '0 0 25px rgba(0, 255, 0, 0.5)' },
            { transform: 'scale(1)', boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }
        ], {
            duration: 2000,
            iterations: 3
        });
    };
    
    animateCode();
    
    // Success message
    const codeSection = document.querySelector('.verification-code-section');
    const successMsg = document.createElement('div');
    successMsg.className = 'alert-message';
    successMsg.style.background = 'rgba(0, 255, 0, 0.1)';
    successMsg.style.border = '1px solid var(--success-color)';
    successMsg.style.marginTop = '20px';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
        <div class="alert-text">
            Verification successful! Your code has been generated. Return to the generator to claim your V-Bucks.
        </div>
    `;
    
    // Add with animation
    successMsg.style.opacity = '0';
    codeSection.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.transition = 'opacity 0.5s ease';
        successMsg.style.opacity = '1';
    }, 100);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Copy button
    document.getElementById('copy-button').addEventListener('click', copyCodeToClipboard);
    
    // Generate initial verification code but don't reveal it
    state.verificationCode = generateVerificationCode();
    
    // Start timer display without ticking
    const display = {
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    
    // Don't start the interval yet - just show the initial time
    display.minutes.textContent = "05";
    display.seconds.textContent = "00";
});

// Prevent form submission when pressing Enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && 
        event.target.tagName !== 'TEXTAREA' && 
        event.target.type !== 'submit') {
        event.preventDefault();
        return false;
    }
});