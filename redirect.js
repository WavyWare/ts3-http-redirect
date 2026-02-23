class TS3Redirector {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 3;
        this.redirectDelay = 1500;
        this.handleUrlParams();
        this.init();
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('username');
        if (username) {
            SERVER_CONFIG.nickname = username;
        }
    }

    init() {
        if (!this.validateConfig()) {
            return;
        }

        this.tsUrl = this.buildTS3Url();
        this.updateUI();
        this.startRedirect();
    }

    validateConfig() {
        if (!SERVER_CONFIG || !SERVER_CONFIG.address) {
            this.showError('Configuration Error: Missing server address');
            return false;
        }

        if (SERVER_CONFIG.address === 'YOURSERVER_ADDRESS') {
            this.showError('Configuration Error: Server address not configured');
            return false;
        }

        const addressPattern = /^[a-zA-Z0-9.-]+$/;
        if (!addressPattern.test(SERVER_CONFIG.address)) {
            this.showError('Configuration Error: Invalid server address format');
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
        const manualLink = document.getElementById('manual-link');
        if (manualLink) {
            manualLink.href = this.tsUrl;
        }

        this.showConnectionDetails();
    }

    showConnectionDetails() {
        const detailsEl = document.getElementById('connection-details');
        if (detailsEl) {
            const details = [
                `<strong>Server:</strong> ${SERVER_CONFIG.address}`,
                `<strong>Port:</strong> ${SERVER_CONFIG.port || 9987}`,
            ];

            if (SERVER_CONFIG.channelId) {
                details.push(`<strong>Channel:</strong> ${SERVER_CONFIG.channelId}`);
            }
            if (SERVER_CONFIG.nickname) {
                details.push(`<strong>Nickname:</strong> ${SERVER_CONFIG.nickname}`);
            }

            detailsEl.innerHTML = details.join('<br>');
            document.getElementById('info').style.display = 'block';
        }
    }

    startRedirect() {
        this.updateStatus('Preparing connection...');
        this.animateProgress();

        setTimeout(() => {
            this.attemptRedirect();
        }, this.redirectDelay);
    }

    attemptRedirect() {
        this.updateStatus('Connecting to TeamSpeak server...');

        try {
            window.location.href = this.tsUrl;

            setTimeout(() => {
                this.showFallback();
            }, 2000);

        } catch (error) {
            console.error('Redirect error:', error);
            this.handleRedirectError();
        }
    }

    showFallback() {
        this.updateStatus('If TeamSpeak didn\'t open, use the button below:');
        document.getElementById('fallback-text').style.display = 'block';
        document.getElementById('manual-link').style.display = 'inline-block';
        document.getElementById('troubleshooting').style.display = 'block';
    }

    handleRedirectError() {
        this.retryCount++;

        if (this.retryCount < this.maxRetries) {
            this.updateStatus(`Retrying... (${this.retryCount}/${this.maxRetries})`);
            setTimeout(() => this.attemptRedirect(), 2000);
        } else {
            this.showError('Failed to automatically open TeamSpeak');
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

document.addEventListener('DOMContentLoaded', () => {
    new TS3Redirector();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const statusEl = document.getElementById('status');
        if (statusEl && (statusEl.textContent.includes('Connecting') || statusEl.textContent.includes('Łączenie'))) {
            setTimeout(() => {
                new TS3Redirector().showFallback();
            }, 1000);
        }
    }
});