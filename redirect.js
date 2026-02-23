class TS3Redirector {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 3;
        this.redirectDelay = 1500;
        this.init();
    }

    init() {
        // Validate configuration
        if (!this.validateConfig()) {
            return;
        }

        // Build TS3 URL
        this.tsUrl = this.buildTS3Url();
        
        // Update UI elements
        this.updateUI();
        
        // Start redirect process
        this.startRedirect();
    }

    validateConfig() {
        if (!SERVER_CONFIG || !SERVER_CONFIG.address) {
            this.showError('Błąd konfiguracji: Brak adresu serwera');
            return false;
        }

        if (SERVER_CONFIG.address === 'YOURSERVER_ADDRESS') {
            this.showError('Błąd konfiguracji: Adres serwera nie został skonfigurowany');
            return false;
        }

        // Basic validation for server address
        const addressPattern = /^[a-zA-Z0-9.-]+$/;
        if (!addressPattern.test(SERVER_CONFIG.address)) {
            this.showError('Błąd konfiguracji: Nieprawidłowy format adresu serwera');
            return false;
        }

        return true;
    }

    buildTS3Url() {
        let url = `ts3server://${SERVER_CONFIG.address}`;
        
        if (SERVER_CONFIG.port && SERVER_CONFIG.port !== 9987) {
            url += `:${SERVER_CONFIG.port}`;
        }

        const params = [];
        if (SERVER_CONFIG.channelId) params.push(`cid=${SERVER_CONFIG.channelId}`);
        if (SERVER_CONFIG.channelPassword) params.push(`channelpassword=${encodeURIComponent(SERVER_CONFIG.channelPassword)}`);
        if (SERVER_CONFIG.nickname) params.push(`nickname=${encodeURIComponent(SERVER_CONFIG.nickname)}`);
        if (SERVER_CONFIG.serverPassword) params.push(`password=${encodeURIComponent(SERVER_CONFIG.serverPassword)}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return url;
    }

    updateUI() {
        // Update manual link
        const manualLink = document.getElementById('manual-link');
        if (manualLink) {
            manualLink.href = this.tsUrl;
        }

        // Show connection details
        this.showConnectionDetails();
    }

    showConnectionDetails() {
        const detailsEl = document.getElementById('connection-details');
        if (detailsEl) {
            const details = [
                `<strong>Serwer:</strong> ${SERVER_CONFIG.address}`,
                `<strong>Port:</strong> ${SERVER_CONFIG.port || 9987}`,
            ];

            if (SERVER_CONFIG.channelId) {
                details.push(`<strong>Kanał:</strong> ${SERVER_CONFIG.channelId}`);
            }
            if (SERVER_CONFIG.nickname) {
                details.push(`<strong>Nick:</strong> ${SERVER_CONFIG.nickname}`);
            }

            detailsEl.innerHTML = details.join('<br>');
            document.getElementById('info').style.display = 'block';
        }
    }

    startRedirect() {
        this.updateStatus('Przygotowywanie połączenia...');
        this.animateProgress();

        setTimeout(() => {
            this.attemptRedirect();
        }, this.redirectDelay);
    }

    attemptRedirect() {
        this.updateStatus('Łączenie z serwerem TeamSpeak...');
        
        try {
            window.location.href = this.tsUrl;
            
            // Show fallback after attempt
            setTimeout(() => {
                this.showFallback();
            }, 2000);
            
        } catch (error) {
            console.error('Redirect error:', error);
            this.handleRedirectError();
        }
    }

    showFallback() {
        this.updateStatus('Jeśli TeamSpeak się nie otworzył, użyj przycisku poniżej:');
        document.getElementById('fallback-text').style.display = 'block';
        document.getElementById('manual-link').style.display = 'inline-block';
        document.getElementById('troubleshooting').style.display = 'block';
    }

    handleRedirectError() {
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
            this.updateStatus(`Ponawiam próbę... (${this.retryCount}/${this.maxRetries})`);
            setTimeout(() => this.attemptRedirect(), 2000);
        } else {
            this.showError('Nie udało się automatycznie otworzyć TeamSpeak');
            this.showFallback();
        }
    }

    updateStatus(message) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    showError(message) {
        this.updateStatus(`❌ ${message}`);
        document.getElementById('troubleshooting').style.display = 'block';
    }

    animateProgress() {
        const progressEl = document.getElementById('progress');
        if (progressEl) {
            progressEl.style.animation = `progress ${this.redirectDelay / 1000}s ease-in-out forwards`;
        }
    }
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TS3Redirector();
});

// Handle visibility change (user returned to tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const statusEl = document.getElementById('status');
        if (statusEl && statusEl.textContent.includes('Łączenie')) {
            setTimeout(() => {
                new TS3Redirector().showFallback();
            }, 1000);
        }
    }
});