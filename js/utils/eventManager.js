// Event Manager
class EventManager {
    constructor(app) {
        this.app = app;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.app.keys[event.code] = true;

            if (event.code === 'KeyE' && this.app.currentStation) {
                this.app.openModal(this.app.currentStation.userData.modal);
            }

            if (event.code === 'Escape') {
                this.app.closeAllModals();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.app.keys[event.code] = false;
        });

        // Mouse events
        document.addEventListener('mousemove', (event) => {
            this.app.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.app.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (this.app.camera && this.app.renderer) {
                this.app.camera.aspect = window.innerWidth / window.innerHeight;
                this.app.camera.updateProjectionMatrix();
                this.app.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // UI buttons
        document.getElementById('bypass-btn')?.addEventListener('click', () => {
            this.app.showClassicView();
        });

        document.getElementById('back-to-3d')?.addEventListener('click', () => {
            this.app.show3DView();
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.app.closeAllModals());
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.app.closeAllModals();
                }
            });
        });

        // Portfolio tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('portfolio-tab')) {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchPortfolioTab(targetTab);
            }
        });

        this.app.debugLogger.log('🎧 Event listeners setup');
    }

    switchPortfolioTab(targetTab) {
        // Hide all content sections
        document.querySelectorAll('.portfolio-content').forEach(content => {
            content.style.display = 'none';
        });

        // Remove active class from all tabs
        document.querySelectorAll('.portfolio-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = '#f1f5f9';
            tab.style.color = 'var(--gray-600)';
        });

        // Show target content
        const targetContent = document.getElementById(`${targetTab}-content`);
        if (targetContent) {
            targetContent.style.display = 'block';
        }

        // Activate target tab
        const targetTabElement = document.querySelector(`[data-tab="${targetTab}"]`);
        if (targetTabElement) {
            targetTabElement.classList.add('active');
            targetTabElement.style.background = 'var(--primary-blue)';
            targetTabElement.style.color = 'white';
        }
    }
}