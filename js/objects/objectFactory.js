// Enhanced Object Factory Module with Professional Materials
class ObjectFactory {
    
    // 🆕 Create professional building materials
    static createProfessionalBuildingMaterials() {
        const materials = {};

        // 🆕 Glass for modern buildings
        materials.modernGlass = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.0,
            roughness: 0.05,
            transmission: 0.8,
            transparent: true,
            opacity: 0.2,
            ior: 1.5,
            thickness: 0.1,
        });

        // 🆕 Concrete/Stone
        materials.concrete = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.9,
            metalness: 0.1,
        });

        // 🆕 Metal panels
        materials.metalPanel = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.3,
            metalness: 0.8,
        });

        // 🆕 Tech materials
        materials.techSurface = new THREE.MeshStandardMaterial({
            color: 0x334455,
            roughness: 0.2,
            metalness: 0.7,
        });

        // 🆕 Warm house materials
        materials.houseSiding = new THREE.MeshStandardMaterial({
            color: 0xF5F5DC,
            roughness: 0.8,
            metalness: 0.0,
        });

        return materials;
    }

    static createStation(data) {
        const stationGroup = new THREE.Group();

        // Create different building based on station type
        switch(data.id) {
            case 'experience':
                // Use the detailed Würth building for the experience station
                const wuerthFactory = WuerthFactory.createWuerthFactory();
                stationGroup.add(wuerthFactory);
                break;
            case 'skills':
                this.createTechPyramid(stationGroup, data.color);
                break;
            case 'projects':
                this.createCreativeStudio(stationGroup, data.color);
                break;
            case 'about':
                this.createModernHouse(stationGroup, data.color);
                break;
            default:
                this.createDefaultBuilding(stationGroup, data.color);
        }

        // Add floating particles around building
        const particleCount = 25;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 15;
            particlePositions[i3 + 1] = Math.random() * 20 + 5;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: data.color,
            size: 0.8,
            transparent: true,
            opacity: 0.7
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        stationGroup.add(particles);

        stationGroup.position.set(data.position[0], data.position[1], data.position[2]);
        stationGroup.userData = { 
            id: data.id, 
            modal: data.modal, 
            originalEmissive: 0.3,
            particles: particles
        };

        return stationGroup;
    }

    // Experience Station: Modern Office Tower (Enhanced)
    static createOfficeTower(group, color) {
        const materials = this.createProfessionalBuildingMaterials();

        // Main tower base (bigger)
        const baseGeometry = new THREE.BoxGeometry(20, 10, 20);
        const base = new THREE.Mesh(baseGeometry, materials.concrete); // 🆕 Professional concrete
        base.position.y = 5;
        base.castShadow = true;
        group.add(base);

        // Tower levels (5 levels, bigger)
        for (let i = 0; i < 5; i++) {
            const levelSize = 16 - i * 2.5;
            const levelHeight = 7;
            const levelGeometry = new THREE.BoxGeometry(levelSize, levelHeight, levelSize);
            const level = new THREE.Mesh(levelGeometry, materials.metalPanel); // 🆕 Professional metal
            level.position.y = 10 + (i + 1) * levelHeight + i * 1.5;
            level.castShadow = true;
            group.add(level);

            // Add more windows to each level with professional glass
            for (let side = 0; side < 4; side++) {
                for (let window = 0; window < 8; window++) {
                    const windowGeometry = new THREE.PlaneGeometry(1.5, 2.5);
                    const windowMesh = new THREE.Mesh(windowGeometry, materials.modernGlass); // 🆕 Professional glass
                    const angle = (side * Math.PI) / 2;
                    const radius = levelSize / 2 + 0.01;
                    windowMesh.position.x = Math.sin(angle) * radius;
                    windowMesh.position.z = Math.cos(angle) * radius;
                    windowMesh.position.y = level.position.y + (window - 3.5) * 2.2;
                    windowMesh.rotation.y = -angle;
                    group.add(windowMesh);
                }
            }
        }

        // Glowing antenna on top (bigger)
        const antennaGeometry = new THREE.CylinderGeometry(0.3, 0.5, 10, 16);
        const antennaMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced antenna
            color: color,
            emissive: color,
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 55;
        group.add(antenna);

        // Rotating satellite dish (bigger)
        const dishGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
        const dish = new THREE.Mesh(dishGeometry, materials.metalPanel); // 🆕 Professional metal
        dish.position.y = 60;
        dish.userData.rotatingElement = true;
        group.add(dish);

        // Add entrance doors
        const doorGeometry = new THREE.BoxGeometry(3, 6, 0.5);
        const door = new THREE.Mesh(doorGeometry, materials.metalPanel); // 🆕 Professional door
        door.position.set(0, 3, 10.25);
        group.add(door);

        // Add decorative lights
        for (let i = 0; i < 8; i++) {
            const light = new THREE.PointLight(0x87CEEB, 0.7, 15);
            light.position.set(Math.sin(i * Math.PI / 4) * 10, 2, Math.cos(i * Math.PI / 4) * 10);
            group.add(light);
        }
    }

    // Skills Station: Tech Pyramid (Enhanced)
    static createTechPyramid(group, color) {
        const materials = this.createProfessionalBuildingMaterials();

        // Base platform (bigger)
        const platformGeometry = new THREE.CylinderGeometry(15, 15, 2.5, 16);
        const platform = new THREE.Mesh(platformGeometry, materials.techSurface); // 🆕 Tech material
        platform.position.y = 1.25;
        platform.castShadow = true;
        group.add(platform);

        // Pyramid levels (5 levels, bigger)
        for (let i = 0; i < 5; i++) {
            const size = 13 - i * 2.2;
            const height = 5;
            const pyramidGeometry = new THREE.CylinderGeometry(size * 0.6, size, height, 10);
            const pyramidMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced pyramid material
                color: new THREE.Color(color).multiplyScalar(0.7 + i * 0.07),
                metalness: 0.6,
                roughness: 0.3,
                emissive: new THREE.Color(color).multiplyScalar(0.1),
            });
            const pyramidLevel = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
            pyramidLevel.position.y = 2.5 + (i + 1) * height;
            pyramidLevel.castShadow = true;
            group.add(pyramidLevel);

            // Add more tech details - circuit-like patterns
            for (let j = 0; j < 12; j++) {
                const angle = (j * Math.PI * 2) / 12;
                const radius = size * 0.9;
                const detailGeometry = new THREE.BoxGeometry(0.4, 0.4, size * 0.7);
                const detailMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced tech details
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.5,
                    metalness: 0.9,
                    roughness: 0.1,
                });
                const detail = new THREE.Mesh(detailGeometry, detailMaterial);
                detail.position.x = Math.cos(angle) * radius;
                detail.position.z = Math.sin(angle) * radius;
                detail.position.y = pyramidLevel.position.y;
                detail.rotation.y = angle;
                group.add(detail);
            }
        }

        // Holographic top element (bigger)
        const holoGeometry = new THREE.OctahedronGeometry(3.5, 2);
        const holoMaterial = new THREE.MeshPhysicalMaterial({ // 🆕 Enhanced hologram
            color: color,
            transparent: true,
            opacity: 0.7,
            transmission: 0.3,
            emissive: color,
            emissiveIntensity: 0.7,
            metalness: 0.0,
            roughness: 0.0,
        });
        const holo = new THREE.Mesh(holoGeometry, holoMaterial);
        holo.position.y = 32;
        holo.userData.floatingElement = true;
        group.add(holo);

        // Add glowing tech rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(8 - i * 2, 0.25, 16, 100);
            const ringMaterial = new THREE.MeshStandardMaterial({ 
                color: color, 
                emissive: color, 
                emissiveIntensity: 0.3,
                metalness: 0.8,
                roughness: 0.2,
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.y = 8 + i * 7;
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
        }
    }

    // Projects Station: Creative Studio (Enhanced)
    static createCreativeStudio(group, color) {
        const materials = this.createProfessionalBuildingMaterials();

        // Main building - irregular shape (bigger)
        const mainGeometry = new THREE.BoxGeometry(18, 15, 12);
        const mainBuilding = new THREE.Mesh(mainGeometry, materials.concrete); // 🆕 Professional concrete
        mainBuilding.position.y = 7.5;
        mainBuilding.castShadow = true;
        group.add(mainBuilding);

        // Curved extension (bigger)
        const curveGeometry = new THREE.CylinderGeometry(7, 10, 12, 16);
        const curveMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced curved section
            color: new THREE.Color(color).multiplyScalar(0.9),
            metalness: 0.4,
            roughness: 0.6,
        });
        const curveBuilding = new THREE.Mesh(curveGeometry, curveMaterial);
        curveBuilding.position.set(16, 6, 0);
        curveBuilding.castShadow = true;
        group.add(curveBuilding);

        // Angular roof (bigger)
        const roofGeometry = new THREE.ConeGeometry(10, 7, 8);
        const roofMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced roof
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.1,
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 18.5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);

        // Floating geometric shapes (bigger, more)
        const shapes = [
            new THREE.TetrahedronGeometry(2),
            new THREE.OctahedronGeometry(2),
            new THREE.IcosahedronGeometry(2)
        ];
        for (let i = 0; i < 12; i++) {
            const shapeGeometry = shapes[i % shapes.length];
            const shapeMaterial = new THREE.MeshPhysicalMaterial({ // 🆕 Enhanced floating shapes
                color: color,
                transparent: true,
                opacity: 0.6,
                transmission: 0.4,
                emissive: color,
                emissiveIntensity: 0.3,
                metalness: 0.2,
                roughness: 0.1,
            });
            const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
            const angle = (i * Math.PI * 2) / 12;
            const radius = 18 + Math.sin(i) * 4;
            shape.position.x = Math.cos(angle) * radius;
            shape.position.z = Math.sin(angle) * radius;
            shape.position.y = 18 + Math.sin(i * 2) * 6;
            shape.userData.orbitingElement = true;
            shape.userData.orbitAngle = angle;
            shape.userData.orbitRadius = radius;
            group.add(shape);
        }

        // Large display screen (bigger)
        const screenGeometry = new THREE.PlaneGeometry(8, 6);
        const screenMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced screen
            color: 0x000033,
            emissive: color,
            emissiveIntensity: 0.3,
            metalness: 0.0,
            roughness: 0.1,
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 8, 6.51);
        group.add(screen);

        // Add entrance door
        const doorGeometry = new THREE.BoxGeometry(2.5, 5, 0.5);
        const door = new THREE.Mesh(doorGeometry, materials.metalPanel); // 🆕 Professional door
        door.position.set(-4, 2.5, 6.51);
        group.add(door);

        // Add rooftop solar panels
        for (let i = 0; i < 4; i++) {
            const panelGeometry = new THREE.BoxGeometry(2, 0.2, 4);
            const panelMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced solar panels
                color: 0x2222FF, 
                metalness: 0.9, 
                roughness: 0.1,
                emissive: 0x001122,
                emissiveIntensity: 0.2,
            });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.set(-4 + i * 2.5, 20, 0);
            panel.rotation.x = -Math.PI / 8;
            group.add(panel);
        }
    }

    // About Station: Modern House (Enhanced)
    static createModernHouse(group, color) {
        const materials = this.createProfessionalBuildingMaterials();

        // House base (bigger)
        const baseGeometry = new THREE.BoxGeometry(18, 8, 14);
        const base = new THREE.Mesh(baseGeometry, materials.houseSiding); // 🆕 Professional house material
        base.position.y = 4;
        base.castShadow = true;
        group.add(base);

        // Second floor (bigger)
        const secondFloorGeometry = new THREE.BoxGeometry(12, 6, 10);
        const secondFloorMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced second floor
            color: new THREE.Color(color).multiplyScalar(0.7),
            roughness: 0.7,
            metalness: 0.1,
        });
        const secondFloor = new THREE.Mesh(secondFloorGeometry, secondFloorMaterial);
        secondFloor.position.y = 13;
        secondFloor.castShadow = true;
        group.add(secondFloor);

        // Modern angled roof (bigger)
        const roofGeometry = new THREE.BoxGeometry(14, 1, 12);
        const roofMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced roof
            color: 0x555555,
            roughness: 0.9,
            metalness: 0.2,
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 17;
        roof.rotation.x = Math.PI / 12;
        roof.castShadow = true;
        group.add(roof);

        // Entrance door (bigger)
        const doorGeometry = new THREE.BoxGeometry(2.5, 5, 0.4);
        const doorMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced door
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.0,
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 2.5, 7.21);
        group.add(door);

        // Windows (bigger, more) with professional glass
        const windowPositions = [
            [-5, 4, 7.21], [5, 4, 7.21], // Front windows
            [-5, 13, 6.01], [5, 13, 6.01], // Second floor front
            [-9.01, 4, 0], [9.01, 4, 0], // Side windows
            [0, 13, 7.21], // Center top window
            [0, 4, -7.21], // Back window
        ];
        windowPositions.forEach(pos => {
            const windowGeometry = new THREE.PlaneGeometry(2.2, 2.5);
            const window = new THREE.Mesh(windowGeometry, materials.modernGlass); // 🆕 Professional glass
            window.position.set(pos[0], pos[1], pos[2]);
            if (pos[2] === 0) window.rotation.y = Math.PI / 2;
            group.add(window);
        });

        // Garden elements (bigger, more)
        for (let i = 0; i < 8; i++) {
            const bushGeometry = new THREE.SphereGeometry(2, 12, 8);
            const bushMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced vegetation
                color: 0x228B22,
                roughness: 0.9,
                metalness: 0.0,
            });
            const bush = new THREE.Mesh(bushGeometry, bushMaterial);
            const angle = (i * Math.PI * 2) / 8;
            bush.position.x = Math.cos(angle) * 12;
            bush.position.z = Math.sin(angle) * 8;
            bush.position.y = 1;
            bush.scale.y = 0.8;
            group.add(bush);
        }

        // Chimney with smoke effect (bigger)
        const chimneyGeometry = new THREE.BoxGeometry(2, 8, 2);
        const chimneyMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced chimney
            color: 0x8B0000,
            roughness: 0.8,
            metalness: 0.0,
        });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(4, 22, 2);
        group.add(chimney);

        // Glowing house number (bigger)
        const numberGeometry = new THREE.PlaneGeometry(2, 2);
        const numberMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced house number
            color: color,
            emissive: color,
            emissiveIntensity: 0.7,
            metalness: 0.1,
            roughness: 0.2,
        });
        const houseNumber = new THREE.Mesh(numberGeometry, numberMaterial);
        houseNumber.position.set(2, 6, 7.25);
        group.add(houseNumber);

        // Add modern fence
        for (let i = 0; i < 12; i++) {
            const fenceGeometry = new THREE.BoxGeometry(0.3, 2, 1.5);
            const fence = new THREE.Mesh(fenceGeometry, materials.metalPanel); // 🆕 Professional fence
            const angle = (i * Math.PI * 2) / 12;
            fence.position.x = Math.cos(angle) * 15;
            fence.position.z = Math.sin(angle) * 10;
            fence.position.y = 1;
            group.add(fence);
        }
    }

    // Default building (fallback)
    static createDefaultBuilding(group, color) {
        const materials = this.createProfessionalBuildingMaterials();
        const geometry = new THREE.CylinderGeometry(1.5, 2, 8, 12);
        const material = new THREE.MeshStandardMaterial({ // 🆕 Enhanced default
            color: color,
            metalness: 0.3,
            roughness: 0.7,
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = 4;
        building.castShadow = true;
        group.add(building);
    }

    // Rest of the methods remain the same...
    static createTree(x, z, scene) {
        const trunkHeight = Math.random() * 8 + 6;
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced tree trunk
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.0,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, trunkHeight / 2, z);
        trunk.castShadow = true;
        trunk.userData.isTree = true;
        scene.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(Math.random() * 3 + 3, 8, 6);
        const foliageMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced foliage
            color: 0x228B22,
            roughness: 0.9,
            metalness: 0.0,
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, trunkHeight + 2, z);
        foliage.castShadow = true;
        foliage.userData.isTree = true;
        scene.add(foliage);
    }

    static createRock(x, z, scene) {
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced rock
            color: new THREE.Color(0.4, 0.4, 0.4).multiplyScalar(0.5 + Math.random() * 0.5),
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1,
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, 1, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.userData.isRock = true;
        scene.add(rock);
    }

    static createGlobalParticles(scene) {
        const particleCount = 120;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE;
            particlePositions[i3 + 1] = Math.random() * 50 + 10;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * CONSTANTS.WORLD.SIZE;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 1.2,
            transparent: true,
            opacity: 0.4
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        return particles;
    }
}