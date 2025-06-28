// Scene Builder Module
class SceneBuilder {
    constructor(scene, debugLogger) {
        this.scene = scene;
        this.debugLogger = debugLogger;
        this.clouds = [];
    }

    createSkybox() {
        // Create a beautiful gradient sky
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        this.createClouds();
    }

    createClouds() {
        const cloudGeometry = new THREE.SphereGeometry(10, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });

        for (let i = 0; i < 20; i++) {
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                Math.random() * 50 + 80,
                Math.random() * 800 - 400
            );
            cloud.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            cloud.scale.setScalar(Math.random() * 2 + 1);
            this.clouds.push(cloud);
            this.scene.add(cloud);
        }
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x87CEEB, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);

        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
        fillLight.position.set(-50, 50, -50);
        this.scene.add(fillLight);
    }

    createTerrain() {
        // Create main ground
        const groundGeometry = new THREE.PlaneGeometry(CONSTANTS.WORLD.SIZE, CONSTANTS.WORLD.SIZE, 50, 50);
        
        // Add variation to ground vertices
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.random() * 2 - 1;
        }
        groundGeometry.attributes.position.needsUpdate = true;
        groundGeometry.computeVertexNormals();

        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x7CB342,
            transparent: true,
            opacity: 0.9
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        this.createHills();
        this.createRoad();
    }

    createHills() {
        for (let i = 0; i < CONSTANTS.WORLD.HILLS_COUNT; i++) {
            const hillGeometry = new THREE.SphereGeometry(
                Math.random() * 15 + 10,
                8,
                6
            );
            const hillMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.25, 0.4, Math.random() * 0.3 + 0.4)
            });

            const hill = new THREE.Mesh(hillGeometry, hillMaterial);
            hill.position.set(
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.8,
                -5,
                (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE * 0.8
            );
            hill.scale.y = 0.3;
            hill.receiveShadow = true;
            this.scene.add(hill);
        }
    }

    createRoad() {
        const roadGeometry = new THREE.PlaneGeometry(6, CONSTANTS.WORLD.SIZE * 1.2);
        const roadMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.8
        });

        const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
        road1.rotation.x = -Math.PI / 2;
        road1.position.y = 0.1;
        this.scene.add(road1);

        const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
        road2.rotation.x = -Math.PI / 2;
        road2.rotation.y = Math.PI / 2;
        road2.position.y = 0.1;
        this.scene.add(road2);
    }

    getClouds() {
        return this.clouds;
    }
}