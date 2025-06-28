// Environment Builder Module
class EnvironmentBuilder {
    constructor(scene, debugLogger) {
        this.scene = scene;
        this.debugLogger = debugLogger;
    }

    createEnvironment() {
        // Add trees
        for (let i = 0; i < CONSTANTS.WORLD.TREES_COUNT; i++) {
            ObjectFactory.createTree(
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.7,
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.7,
                this.scene
            );
        }

        // Add rocks
        for (let i = 0; i < CONSTANTS.WORLD.ROCKS_COUNT; i++) {
            ObjectFactory.createRock(
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.8,
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.8,
                this.scene
            );
        }

        // Add decorative glowing orbs
        for (let i = 0; i < 10; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.8),
                transparent: true,
                opacity: 0.6
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.9,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.9
            );
            this.scene.add(orb);
        }

        this.debugLogger.log('🌳 Environment created');
    }
}