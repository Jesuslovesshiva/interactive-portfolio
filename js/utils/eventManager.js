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

        this.app.debugLogger.log('🎧 Event listeners setup');
    }
}