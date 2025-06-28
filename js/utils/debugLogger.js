// Debug Logger Utility
class DebugLogger {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
        this.setupUI();
    }

    log(message) {
        if (this.debugMode) {
            console.log(message);
        }
        this.updateUI(message);
    }

    error(message, error) {
        console.error(message, error);
        this.updateUI(`ERROR: ${message}`);
    }

    updateUI(message) {
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            debugLog.innerHTML += '<br>' + message;
            debugLog.scrollTop = debugLog.scrollHeight;
        }
    }

    setupUI() {
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo && this.debugMode) {
            debugInfo.style.display = 'block';
        }

        const closeBtn = debugInfo?.querySelector('.debug-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                debugInfo.style.display = 'none';
            });
        }
    }
}