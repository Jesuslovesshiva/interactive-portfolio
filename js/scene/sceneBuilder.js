// Enhanced Scene Builder Module
class SceneBuilder {
    constructor(scene, debugLogger) {
        this.scene = scene;
        this.debugLogger = debugLogger;
        this.clouds = [];
    }

    createSkybox() {
        this.scene.background = new THREE.Color(0x87CEEB);
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

    // 🆕 ENHANCED LIGHTING SYSTEM
    createEnhancedLighting() {
        // Remove any existing lights first
        const existingLights = [];
        this.scene.traverse((object) => {
            if (object.isLight) {
                existingLights.push(object);
            }
        });
        existingLights.forEach(light => this.scene.remove(light));

        // 🆕 1. MAIN SUN LIGHT (Key Light)
        const sunLight = new THREE.DirectionalLight(0xfff4e6, 2.5); // Warm sunlight
        sunLight.position.set(150, 150, 50);
        sunLight.castShadow = true;
        
        // 🆕 PROFESSIONAL SHADOW SETTINGS
        sunLight.shadow.mapSize.width = 4096;  // High resolution shadows
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        sunLight.shadow.bias = -0.0001; // Reduces shadow acne
        sunLight.shadow.normalBias = 0.02; // Better shadow quality
        
        this.scene.add(sunLight);

        // 🆕 2. SKY LIGHT (Ambient)
        const skyLight = new THREE.HemisphereLight(
            0x87CEEB, // Sky color (light blue)
            0x98FB98, // Ground color (light green)
            0.6       // Intensity
        );
        skyLight.position.set(0, 50, 0);
        this.scene.add(skyLight);

        // 🆕 3. FILL LIGHT (Softer ambient)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // 🆕 4. RIM LIGHT (Dramatic back lighting)
        const rimLight = new THREE.DirectionalLight(0x4488ff, 1.2);
        rimLight.position.set(-100, 50, -100);
        // No shadows for rim light to keep performance good
        this.scene.add(rimLight);

        // 🆕 5. STATION AREA LIGHTS (Dynamic lighting near buildings)
        this.createStationLights();

        this.debugLogger.log('✅ Enhanced lighting system created');
    }

    // 🆕 Add station-specific lighting
    createStationLights() {
        CONSTANTS.STATIONS.POSITIONS.forEach(stationData => {
            // Create a soft point light for each station
            const stationLight = new THREE.PointLight(
                stationData.color, // Use station's color
                1.5,              // Intensity
                30,               // Distance
                2                 // Decay
            );
            
            stationLight.position.set(
                stationData.position[0],
                stationData.position[1] + 15, // Above the building
                stationData.position[2]
            );
            
            // Only cast shadows for some lights to maintain performance
            if (stationData.id === 'experience' || stationData.id === 'skills') {
                stationLight.castShadow = true;
                stationLight.shadow.mapSize.width = 1024;
                stationLight.shadow.mapSize.height = 1024;
                stationLight.shadow.camera.near = 0.1;
                stationLight.shadow.camera.far = 25;
            }
            
            this.scene.add(stationLight);
            
            // Store reference for later animation
            stationLight.userData = {
                originalIntensity: 1.5,
                stationId: stationData.id,
                isStationLight: true
            };
        });
    }

    // 🆕 Add this method to animate the lights
    animateLights(time) {
        this.scene.traverse((object) => {
            if (object.isLight && object.userData.isStationLight) {
                // Gentle pulsing effect
                const pulse = Math.sin(time * 2) * 0.2 + 1;
                object.intensity = object.userData.originalIntensity * pulse;
            }
        });
    }

    // Keep the old lighting method for fallback
    createLighting() {
        // Soft ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Hemisphere light for a natural gradient
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x98FB98, 0.6);
        this.scene.add(hemisphereLight);

        // Strong directional light from the sun
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(150, 150, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -CONSTANTS.WORLD.SIZE / 2;
        directionalLight.shadow.camera.right = CONSTANTS.WORLD.SIZE / 2;
        directionalLight.shadow.camera.top = CONSTANTS.WORLD.SIZE / 2;
        directionalLight.shadow.camera.bottom = -CONSTANTS.WORLD.SIZE / 2;
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
    }

    createTerrain() {
        const terrainGeometry = new THREE.PlaneGeometry(CONSTANTS.WORLD.SIZE, CONSTANTS.WORLD.SIZE, 100, 100);
        
        // Add variation to ground vertices
        const vertices = terrainGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.random() * 2 - 1;
        }
        terrainGeometry.attributes.position.needsUpdate = true;
        terrainGeometry.computeVertexNormals();

        const terrainMaterial = new THREE.MeshLambertMaterial({
            color: 0x7CB342,
            transparent: true,
            opacity: 0.9
        });

        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        this.scene.add(terrain);

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
// Add these enhanced methods to your SceneBuilder class

// 🆕 Enhanced terrain creation
createTerrain() {
    const terrainGeometry = new THREE.PlaneGeometry(CONSTANTS.WORLD.SIZE, CONSTANTS.WORLD.SIZE, 100, 100);
    
    // Add variation to ground vertices
    const vertices = terrainGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.random() * 2 - 1;
    }
    terrainGeometry.attributes.position.needsUpdate = true;
    terrainGeometry.computeVertexNormals();

    // 🆕 Professional terrain material
    const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x7CB342,
        roughness: 0.8,
        metalness: 0.0,
    });

    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    this.createEnhancedHills();
    this.createEnhancedRoad();
}

// 🆕 Enhanced hills
createEnhancedHills() {
    for (let i = 0; i < CONSTANTS.WORLD.HILLS_COUNT; i++) {
        const hillGeometry = new THREE.SphereGeometry(
            Math.random() * 15 + 10,
            8,
            6
        );
        const hillMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced hill material
            color: new THREE.Color().setHSL(0.25, 0.4, Math.random() * 0.3 + 0.4),
            roughness: 0.9,
            metalness: 0.0,
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

// 🆕 Enhanced road
createEnhancedRoad() {
    const roadGeometry = new THREE.PlaneGeometry(6, CONSTANTS.WORLD.SIZE * 1.2);
    const roadMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced road material
        color: 0x666666,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
    });

    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.y = 0.1;
    road1.receiveShadow = true;
    this.scene.add(road1);

    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.y = Math.PI / 2;
    road2.position.y = 0.1;
    road2.receiveShadow = true;
    this.scene.add(road2);
}

// Update the mountain materials in the existing createMountains method
// Replace the mountainMaterial creation with this:
createMountains() {
    // Create clean, beautiful mountain ranges
    const mountainRanges = 3;
    const mountains = [];
    
    for (let range = 0; range < mountainRanges; range++) {
        const distanceFromCenter = CONSTANTS.WORLD.SIZE / 2 + range * 100;
        const mountainsInRange = 12 - range * 2;
        const heightMultiplier = 1 - range * 0.3;
        
        for (let i = 0; i < mountainsInRange; i++) {
            const angle = (i / mountainsInRange) * Math.PI * 2;
            const mountainGroup = new THREE.Group();
            
            // Create clean, natural-looking mountains
            const baseHeight = (Math.random() * 200 + 150) * heightMultiplier;
            const baseRadius = (Math.random() * 60 + 40) * heightMultiplier;
            
            // Main mountain with subtle natural variation
            const mountainGeometry = this.createCleanMountainGeometry(baseRadius, baseHeight);
            const mountainMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced mountain material
                color: this.getCleanMountainColor(range, baseHeight),
                flatShading: true,
                roughness: 0.9,
                metalness: 0.0,
            });
            
            const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
            mountain.userData.isMountain = true;
            mountain.castShadow = true;
            mountain.receiveShadow = true;
            mountainGroup.add(mountain);
            
            // Add beautiful snow caps with enhanced materials
            this.addEnhancedSnowCap(mountainGroup, baseRadius, baseHeight, range);
            
            // Add a few clean rock details with enhanced materials
            this.addEnhancedRockFeatures(mountainGroup, baseRadius, baseHeight, range);
            
            // Position mountains naturally
            mountainGroup.position.set(
                Math.cos(angle) * distanceFromCenter,
                -20,
                Math.sin(angle) * distanceFromCenter
            );
            mountainGroup.rotation.y = Math.random() * Math.PI;
            
            mountainGroup.userData = {
                id: `mountain_${range}_${i}`,
                type: 'mountain',
                isMountain: true,
                height: baseHeight,
                range: range
            };
            
            this.scene.add(mountainGroup);
            mountains.push(mountainGroup);
        }
    }
    
    return mountains;
}

// 🆕 Enhanced snow caps
addEnhancedSnowCap(mountainGroup, baseRadius, baseHeight, range) {
    if (baseHeight > 200) {
        const snowHeight = baseHeight * 0.3;
        const snowRadius = baseRadius * 0.6;
        
        const snowGeometry = new THREE.ConeGeometry(snowRadius, snowHeight, 12);
        const positions = snowGeometry.attributes.position.array;
        
        // Add gentle irregularity to snow
        for (let i = 0; i < positions.length; i += 3) {
            if (positions[i + 1] > 0) {
                const heightFactor = positions[i + 1] / snowHeight;
                const variation = (Math.random() - 0.5) * snowRadius * 0.1 * heightFactor;
                positions[i] += variation;
                positions[i + 2] += variation;
            }
        }
        snowGeometry.computeVertexNormals();
        
        const snowMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced snow material
            color: range === 0 ? 0xFFFAFA : new THREE.Color(0xFFFAFA).multiplyScalar(0.9 - range * 0.1),
            roughness: 0.1,
            metalness: 0.0,
        });
        
        const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
        snowCap.position.y = baseHeight * 0.7;
        snowCap.castShadow = true;
        snowCap.receiveShadow = true;
        mountainGroup.add(snowCap);
    }
}

// 🆕 Enhanced rock features
addEnhancedRockFeatures(mountainGroup, baseRadius, baseHeight, range) {
    // Add just a few clean rock outcrops
    const rockCount = range === 0 ? 3 : 1;
    
    for (let i = 0; i < rockCount; i++) {
        const rockSize = Math.random() * 8 + 5;
        const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced rock material
            color: new THREE.Color(0x555555).multiplyScalar(0.7 + Math.random() * 0.3),
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1,
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        const rockAngle = Math.random() * Math.PI * 2;
        const rockDistance = Math.random() * baseRadius * 0.6;
        
        rock.position.set(
            Math.cos(rockAngle) * rockDistance,
            Math.random() * baseHeight * 0.3,
            Math.sin(rockAngle) * rockDistance
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.scale.setScalar(0.8 + Math.random() * 0.4);
        
        rock.userData.isRock = true;
        rock.castShadow = true;
        rock.receiveShadow = true;
        mountainGroup.add(rock);
    }
}
    createSun() {
        // Sun object
        const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 1 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(150, 150, 50);
        this.scene.add(sun);

        // Lens flare effect (requires Lensflare.js from three.js examples, assuming not present so keeping it simple)
        // For now, a simple PointLight will add a glow.
        const sunGlow = new THREE.PointLight(0xFFD700, 1.5, 2000);
        sun.add(sunGlow);
    }

    createMountains() {
        // Create clean, beautiful mountain ranges
        const mountainRanges = 3;
        const mountains = [];
        
        for (let range = 0; range < mountainRanges; range++) {
            const distanceFromCenter = CONSTANTS.WORLD.SIZE / 2 + range * 100;
            const mountainsInRange = 12 - range * 2;
            const heightMultiplier = 1 - range * 0.3;
            
            for (let i = 0; i < mountainsInRange; i++) {
                const angle = (i / mountainsInRange) * Math.PI * 2;
                const mountainGroup = new THREE.Group();
                
                // Create clean, natural-looking mountains
                const baseHeight = (Math.random() * 200 + 150) * heightMultiplier;
                const baseRadius = (Math.random() * 60 + 40) * heightMultiplier;
                
                // Main mountain with subtle natural variation
                const mountainGeometry = this.createCleanMountainGeometry(baseRadius, baseHeight);
                const mountainMaterial = new THREE.MeshLambertMaterial({
                    color: this.getCleanMountainColor(range, baseHeight),
                    flatShading: true
                });
                
                const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
                mountain.userData.isMountain = true;
                mountain.castShadow = true;
                mountain.receiveShadow = true;
                mountainGroup.add(mountain);
                
                // Add beautiful snow caps
                this.addCleanSnowCap(mountainGroup, baseRadius, baseHeight, range);
                
                // Add a few clean rock details
                this.addCleanRockFeatures(mountainGroup, baseRadius, baseHeight, range);
                
                // Position mountains naturally
                mountainGroup.position.set(
                    Math.cos(angle) * distanceFromCenter,
                    -20,
                    Math.sin(angle) * distanceFromCenter
                );
                mountainGroup.rotation.y = Math.random() * Math.PI;
                
                mountainGroup.userData = {
                    id: `mountain_${range}_${i}`,
                    type: 'mountain',
                    isMountain: true,
                    height: baseHeight,
                    range: range
                };
                
                this.scene.add(mountainGroup);
                mountains.push(mountainGroup);
            }
        }
        
        return mountains;
    }
    
    createCleanMountainGeometry(radius, height) {
        // Use higher resolution for smoother mountains
        const geometry = new THREE.ConeGeometry(radius, height, 16, 8);
        const positions = geometry.attributes.position.array;
        
        // Add subtle, natural variation
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            if (y > 0) { // Don't modify base
                const heightFactor = y / height;
                const angle = Math.atan2(z, x);
                
                // Create gentle peaks and valleys
                const peakVariation = Math.sin(angle * 3) * height * 0.1 * heightFactor;
                const gentleNoise = (Math.random() - 0.5) * height * 0.05 * heightFactor;
                
                positions[i + 1] += peakVariation + gentleNoise;
                
                // Slight horizontal variation for natural shape
                const horizontalVariation = (Math.random() - 0.5) * radius * 0.15 * (1 - heightFactor);
                positions[i] += horizontalVariation;
                positions[i + 2] += horizontalVariation;
            }
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }
    
    getCleanMountainColor(range, height) {
        let baseColor;
        
        if (height > 300) {
            // High peaks - rocky gray
            baseColor = new THREE.Color(0x666666);
        } else if (height > 200) {
            // Mid elevation - brown rock
            baseColor = new THREE.Color(0x8B7355);
        } else {
            // Lower - more green
            baseColor = new THREE.Color(0x7B8B3E);
        }
        
        // Atmospheric perspective for distant mountains
        if (range > 0) {
            baseColor.multiplyScalar(0.8 - range * 0.2);
            baseColor.lerp(new THREE.Color(0x87CEEB), range * 0.2);
        }
        
        return baseColor;
    }
    
    addCleanSnowCap(mountainGroup, baseRadius, baseHeight, range) {
        if (baseHeight > 200) {
            const snowHeight = baseHeight * 0.3;
            const snowRadius = baseRadius * 0.6;
            
            const snowGeometry = new THREE.ConeGeometry(snowRadius, snowHeight, 12);
            const positions = snowGeometry.attributes.position.array;
            
            // Add gentle irregularity to snow
            for (let i = 0; i < positions.length; i += 3) {
                if (positions[i + 1] > 0) {
                    const heightFactor = positions[i + 1] / snowHeight;
                    const variation = (Math.random() - 0.5) * snowRadius * 0.1 * heightFactor;
                    positions[i] += variation;
                    positions[i + 2] += variation;
                }
            }
            snowGeometry.computeVertexNormals();
            
            const snowMaterial = new THREE.MeshLambertMaterial({
                color: range === 0 ? 0xFFFAFA : new THREE.Color(0xFFFAFA).multiplyScalar(0.9 - range * 0.1)
            });
            
            const snowCap = new THREE.Mesh(snowGeometry, snowMaterial);
            snowCap.position.y = baseHeight * 0.7;
            snowCap.castShadow = true;
            snowCap.receiveShadow = true;
            mountainGroup.add(snowCap);
        }
    }
    
    addCleanRockFeatures(mountainGroup, baseRadius, baseHeight, range) {
        // Add just a few clean rock outcrops
        const rockCount = range === 0 ? 3 : 1;
        
        for (let i = 0; i < rockCount; i++) {
            const rockSize = Math.random() * 8 + 5;
            const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 0);
            const rockMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color(0x555555).multiplyScalar(0.7 + Math.random() * 0.3),
                flatShading: true
            });
            
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            const rockAngle = Math.random() * Math.PI * 2;
            const rockDistance = Math.random() * baseRadius * 0.6;
            
            rock.position.set(
                Math.cos(rockAngle) * rockDistance,
                Math.random() * baseHeight * 0.3,
                Math.sin(rockAngle) * rockDistance
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rock.scale.setScalar(0.8 + Math.random() * 0.4);
            
            rock.userData.isRock = true;
            rock.castShadow = true;
            rock.receiveShadow = true;
            mountainGroup.add(rock);
        }
    }

    getClouds() {
        return this.scene.children.filter(obj => obj.userData.isCloud);
    }

    createSnowCapGeometry(radius, height) {
        const geometry = new THREE.ConeGeometry(radius, height, 12, 6);
        
        // Make snow cap more irregular and realistic
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            if (y > 0) {
                const heightFactor = y / height;
                const angleFactor = Math.atan2(z, x);
                
                // Add realistic snow accumulation patterns
                const windEffect = Math.sin(angleFactor * 3) * radius * 0.15 * heightFactor;
                const driftEffect = Math.cos(angleFactor * 5) * radius * 0.08 * heightFactor;
                const irregularity = (Math.random() - 0.5) * radius * 0.2 * heightFactor;
                
                positions[i] += windEffect + irregularity;
                positions[i + 2] += driftEffect + irregularity;
                
                // Make snow peaks slightly uneven
                positions[i + 1] += (Math.random() - 0.5) * height * 0.1 * heightFactor;
            }
        }
        
        geometry.computeVertexNormals();
        return geometry;
    }
}