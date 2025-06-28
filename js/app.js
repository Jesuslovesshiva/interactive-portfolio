// Main Application Module - Enhanced Version - FIXED
class PortfolioApp {
    constructor() {
        this.debugLogger = new DebugLogger(CONSTANTS.DEBUG_MODE);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.car = null;
        this.stations = [];
        this.mountains = []; // Store mountain references like buildings
        this.currentStation = null;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        this.particles = null;
        this.textureLoader = null; // 🆕 Add texture loader
        
        // Module instances
        this.sceneBuilder = null;
        this.environmentBuilder = null;
        this.animationController = null;
        this.eventManager = null;
    }

    async init() {
        try {
            this.debugLogger.log('🚀 Initializing Enhanced Portfolio App...');
            
            if (!window.THREE) {
                throw new Error('Three.js not loaded');
            }
            
            this.debugLogger.log('✅ Three.js loaded');
            this.init3DScene();
            this.start();
            
        } catch (error) {
            this.debugLogger.error('❌ Initialization failed', error);
            this.fallbackToClassic();
        }
    }

    init3DScene() {
        this.debugLogger.log('🎮 Creating Enhanced 3D Scene...');

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(CONSTANTS.SCENE.FOG_COLOR, CONSTANTS.SCENE.FOG_NEAR, CONSTANTS.SCENE.FOG_FAR);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            CONSTANTS.CAMERA.FOV,
            window.innerWidth / window.innerHeight,
            CONSTANTS.CAMERA.NEAR,
            CONSTANTS.CAMERA.FAR
        );
        this.camera.position.set(0, 15, 25);

        // 🆕 ENHANCED RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance" // Use dedicated GPU if available
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit to 2x for performance
        
        // 🆕 PROFESSIONAL SHADOW SETTINGS
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
        this.renderer.shadowMap.autoUpdate = true;
        
        // 🆕 PROFESSIONAL TONE MAPPING
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2; // Slightly brighter
        
        // 🆕 BETTER COLOR MANAGEMENT
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer.appendChild(this.renderer.domElement);

        // 🆕 Initialize texture loader
        this.createTextureLoader();

        // Initialize modules
        this.sceneBuilder = new SceneBuilder(this.scene, this.debugLogger);
        this.environmentBuilder = new EnvironmentBuilder(this.scene, this.debugLogger);
        this.animationController = new AnimationController(this);
        this.eventManager = new EventManager(this);

        // Build scene with enhanced methods
        this.sceneBuilder.createSkybox();
        this.sceneBuilder.createEnhancedLighting(); // 🆕 Enhanced lighting
        this.sceneBuilder.createTerrain();
        this.sceneBuilder.createSun();
        this.mountains = this.sceneBuilder.createMountains();
        this.environmentBuilder.createEnvironment();

        // Create objects
        this.createCar();
        this.createStations();
        this.particles = ObjectFactory.createGlobalParticles(this.scene);

        this.animate();
        this.debugLogger.log('✅ Enhanced 3D Scene created');
    }

    // 🆕 Create texture loader with error handling
    createTextureLoader() {
        if (!this.textureLoader) {
            this.textureLoader = new THREE.TextureLoader();
            
            // Set up error handling
            this.textureLoader.manager.onError = (url) => {
                console.warn(`Failed to load texture: ${url}`);
            };
        }
        return this.textureLoader;
    }

    createCar() {
        this.car = CarFactory.createCar();
        this.car.position.set(0, 0, 0);
        this.scene.add(this.car);
        this.camera.position.set(0, 12, 20);
        this.camera.lookAt(this.car.position);
    }

    createStations() {
        CONSTANTS.STATIONS.POSITIONS.forEach(data => {
            const station = ObjectFactory.createStation(data);
            this.stations.push(station);
            this.scene.add(station);
        });
    }

    // 🚨 CRITICAL FIX: This is the main animation loop that was missing the proximity check!
    animate() {
        requestAnimationFrame(() => this.animate());

        // Main animation calls
        this.animationController.updateCarMovement();
        this.animationController.checkStationProximity();
        this.animationController.animateScene();

        this.renderer.render(this.scene, this.camera);
    }

    // UI Methods
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        });
    }

    showClassicView() {
        document.getElementById('canvas-container').style.display = 'none';
        document.getElementById('classic-view').style.display = 'block';
        this.debugLogger.log('📄 Classic view shown');
    }

    show3DView() {
        document.getElementById('classic-view').style.display = 'none';
        document.getElementById('canvas-container').style.display = 'block';
        this.debugLogger.log('🎮 3D view shown');
    }

    start() {
        this.debugLogger.log('🎉 Enhanced Application started successfully');

        // Hide loading screen
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);

        // Show instructions
        const instructions = document.getElementById('instructions');
        instructions.style.opacity = '1';

        // Hide instructions after timeout
        setTimeout(() => {
            instructions.style.opacity = '0';
        }, CONSTANTS.INSTRUCTION_TIMEOUT);

        this.isInitialized = true;
    }

    fallbackToClassic() {
        this.debugLogger.log('🔄 Falling back to Classic View');

        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
            this.showClassicView();
        }, 500);
    }   
}                