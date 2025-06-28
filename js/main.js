// Application Initializer
class AppInitializer {
    static async initialize() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Wait for Three.js
        let attempts = 0;
        while (!window.THREE && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        // Create and start app
        const app = new PortfolioApp();
        window.portfolioApp = app;

        try {
            await app.init();
        } catch (error) {
            console.error('Failed to initialize:', error);
            
            // Emergency fallback
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('classic-view').style.display = 'block';
            }, 1000);
        }
    }
}

// Start the application
AppInitializer.initialize();