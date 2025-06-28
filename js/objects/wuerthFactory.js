// Würth Factory Module - Integrated into Portfolio System
class WuerthFactory {
    
    // 🆕 Create professional materials for the factory
    static createFactoryMaterials() {
        const materials = {};

        // Office building material
        materials.officeBuildingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0, 
            roughness: 0.7, 
            metalness: 0.2 
        });

        // Red pillar material (Würth brand color)
        materials.redPillarMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xc12127,
            roughness: 0.4,
            metalness: 0.1
        });

        // Orange pod material (Würth accent color)
        materials.orangePodMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xfc4f00, 
            roughness: 0.4, 
            metalness: 0.1 
        });

        // Professional glass material
        materials.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xaaddff, 
            metalness: 0.1, 
            roughness: 0.1, 
            transmission: 0.8,
            transparent: true, 
            opacity: 0.2,
            ior: 1.5
        });

        // Dark glass material
        materials.darkGlassMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, 
            metalness: 0.2, 
            roughness: 0.2, 
            transparent: true, 
            opacity: 0.8 
        });

        // Frame material
        materials.frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444, 
            metalness: 0.8, 
            roughness: 0.4 
        });

        // Ground material
        materials.groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xaaaaaa, 
            roughness: 0.9,
            metalness: 0.0
        });

        // Roof material
        materials.roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            roughness: 0.8,
            metalness: 0.3
        });

        // Tree materials
        materials.treeTrunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.0
        });

        materials.leavesMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.9,
            metalness: 0.0
        });

        return materials;
    }

    // Main factory creation method
    static createWuerthFactory() {
        const buildingGroup = new THREE.Group();
        const materials = this.createFactoryMaterials();

        // Create the main factory complex
        this.createRectangularOfficeBuilding(buildingGroup, materials);
        this.createGlassCubeBuilding(buildingGroup, materials);
        this.createUfoPodBuilding(buildingGroup, materials);
        this.createConnectors(buildingGroup, materials);
        this.createPlazaAndLandscaping(buildingGroup, materials);

        // Scale and position the entire factory
        buildingGroup.scale.setScalar(0.8); // Scale down to fit better in your world
        
        // Add collision detection userData to main building components
        this.addCollisionData(buildingGroup);
        
        return buildingGroup;
    }

    // Helper method to add collision detection data
    static addCollisionData(group) {
        group.traverse((child) => {
            if (child.isMesh && child.geometry && (
                child.geometry.type === 'BoxGeometry' || 
                child.geometry.type === 'CylinderGeometry' ||
                child.geometry.type === 'LatheGeometry'
            )) {
                // Mark building components for collision
                child.userData.isBuilding = true;
            }
        });
    }

    // 1. Rectangular Office Building with detailed windows
    static createRectangularOfficeBuilding(buildingGroup, materials) {
        const rectBuilding = new THREE.Group();
        const rectWidth = 40, rectHeight = 14, rectDepth = 25;
        
        // Main building structure
        const rectGeom = new THREE.BoxGeometry(rectWidth, rectHeight, rectDepth);
        const rectMesh = new THREE.Mesh(rectGeom, materials.officeBuildingMaterial);
        rectMesh.castShadow = true;
        rectMesh.receiveShadow = true;
        rectMesh.position.y = 15;

        // Create detailed window rows
        const frontWindows = this.createWindowRow(rectWidth, rectDepth / 2 + 0.01, materials);
        const backWindows = this.createWindowRow(rectWidth, -rectDepth / 2 - 0.01, materials);
        rectMesh.add(frontWindows, backWindows);

        // Add roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(rectWidth + 0.5, 1, rectDepth + 0.5), 
            materials.roofMaterial
        );
        roof.position.y = 15 + rectHeight/2 + 0.5;
        rectBuilding.add(roof);

        // Add red support pillars (Würth brand feature)
        const pillarGeom = new THREE.CylinderGeometry(0.7, 0.7, 8, 24);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                const pillar = new THREE.Mesh(pillarGeom, materials.redPillarMaterial);
                pillar.castShadow = true;
                pillar.position.set(-15 + j * 10, 4, -8 + i * 16);
                rectBuilding.add(pillar);
            }
        }

        rectBuilding.add(rectMesh);
        rectBuilding.position.set(-25, 0, 0);
        buildingGroup.add(rectBuilding);
    }

    // Helper method to create window rows
    static createWindowRow(width, zPos, materials) {
        const rowGroup = new THREE.Group();
        
        for (let i = 0; i < 3; i++) {
            const y = -4 + i * 4;
            const windowCount = 12;
            const windowWidth = (width * 0.95) / windowCount;
            const spacing = width * 0.05 / (windowCount - 1);
            
            for (let j = 0; j < windowCount; j++) {
                const windowHeight = 2.4;
                
                // Window pane
                const windowPane = new THREE.Mesh(
                    new THREE.BoxGeometry(windowWidth, windowHeight, 0.3), 
                    materials.darkGlassMaterial
                );
                
                // Window frame
                const frame = new THREE.Mesh(
                    new THREE.BoxGeometry(windowWidth + 0.1, windowHeight + 0.1, 0.3), 
                    materials.frameMaterial
                );
                
                const windowGroup = new THREE.Group();
                windowGroup.add(windowPane, frame);
                windowGroup.position.set(
                    -width/2 + (width*0.025) + j * (windowWidth + spacing), 
                    y, 
                    zPos
                );
                rowGroup.add(windowGroup);
            }
        }
        return rowGroup;
    }

    // 2. Glass Cube Building with detailed frame
    static createGlassCubeBuilding(buildingGroup, materials) {
        const glassCube = new THREE.Group();
        const cubeSize = 20;

        // Main glass structure
        const glassPaneGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const glassMesh = new THREE.Mesh(glassPaneGeom, materials.glassMaterial);
        glassMesh.castShadow = true;
        glassCube.add(glassMesh);

        // Detailed frame system
        this.createGlassFramework(glassCube, cubeSize, materials);

        // Add roof
        const cubeRoof = new THREE.Mesh(
            new THREE.BoxGeometry(cubeSize + 0.5, 1, cubeSize + 0.5), 
            materials.roofMaterial
        );
        cubeRoof.position.y = cubeSize / 2 + 0.5;
        glassCube.add(cubeRoof);

        // Add entrance doors
        this.createEntranceDoors(glassCube, cubeSize, materials);

        glassCube.position.y = cubeSize / 2;
        buildingGroup.add(glassCube);
    }

    // Helper method to create glass framework
    static createGlassFramework(glassCube, cubeSize, materials) {
        const frameWidth = 0.4;
        const horizFrameGeom = new THREE.BoxGeometry(cubeSize + frameWidth, frameWidth, frameWidth);
        const vertFrameGeom = new THREE.BoxGeometry(frameWidth, cubeSize + frameWidth, frameWidth);

        for(let i = 0; i <= 4; i++){
            // Horizontal frames
            const hFrame = new THREE.Mesh(horizFrameGeom, materials.frameMaterial);
            hFrame.position.set(0, -cubeSize/2 + i * (cubeSize/4), cubeSize/2);
            glassCube.add(hFrame.clone());
            
            hFrame.position.z = -cubeSize/2;
            glassCube.add(hFrame.clone());
            
            hFrame.rotation.y = Math.PI/2;
            hFrame.position.z = 0;
            hFrame.position.x = cubeSize/2;
            glassCube.add(hFrame.clone());
            
            hFrame.position.x = -cubeSize/2;
            glassCube.add(hFrame.clone());

            // Vertical frames
            const vFrame = new THREE.Mesh(vertFrameGeom, materials.frameMaterial);
            vFrame.position.set(-cubeSize/2 + i * (cubeSize/4), 0, cubeSize/2);
            glassCube.add(vFrame.clone());
            
            vFrame.position.z = -cubeSize/2;
            glassCube.add(vFrame.clone());
        }
    }

    // Helper method to create entrance doors
    static createEntranceDoors(glassCube, cubeSize, materials) {
        const doorHeight = 7;
        const doorWidth = 5;
        
        const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(doorWidth, doorHeight, 0.5), 
            materials.frameMaterial
        );
        
        const leftDoor = new THREE.Mesh(
            new THREE.BoxGeometry(doorWidth/2 - 0.2, doorHeight - 0.2, 0.4), 
            materials.darkGlassMaterial
        );
        leftDoor.position.x = -doorWidth/4;
        
        const rightDoor = leftDoor.clone();
        rightDoor.position.x = doorWidth/4;
        
        const doorGroup = new THREE.Group();
        doorGroup.add(doorFrame, leftDoor, rightDoor);
        doorGroup.position.set(0, -cubeSize/2 + doorHeight/2, cubeSize/2);
        glassCube.add(doorGroup);
    }

    // 3. UFO/Mushroom Pod Building (Iconic Würth feature)
    static createUfoPodBuilding(buildingGroup, materials) {
        const podGroup = new THREE.Group();
        const podScale = 2.8;

        // Create the distinctive pod shape using LatheGeometry
        const podPoints = [
            new THREE.Vector2(0, -5 * podScale * 0.3),
            new THREE.Vector2(5.5 * podScale * 0.7, -4 * podScale * 0.3),
            new THREE.Vector2(5.5 * podScale, 0),
            new THREE.Vector2(5.5 * podScale, 3 * podScale * 0.3),
            new THREE.Vector2(5.0 * podScale, 4 * podScale * 0.3),
            new THREE.Vector2(4.5 * podScale, 4.5 * podScale * 0.3)
        ];

        const podGeom = new THREE.LatheGeometry(podPoints, 64);
        const pod = new THREE.Mesh(podGeom, materials.orangePodMaterial);
        pod.castShadow = true;
        podGroup.add(pod);

        // Add top roof
        const topPoint = podPoints[podPoints.length - 1];
        const roofRadius = topPoint.x;
        const roofY = topPoint.y;
        const podRoof = new THREE.Mesh(
            new THREE.CircleGeometry(roofRadius, 64), 
            materials.orangePodMaterial
        );
        podRoof.position.y = roofY;
        podRoof.rotation.x = -Math.PI / 2;
        podGroup.add(podRoof);

        // Curved windows around the pod
        this.createPodWindows(podGroup, materials);

        // Support pillars
        this.createPodSupportPillars(podGroup, materials);

        podGroup.position.set(18, 12, -5);
        buildingGroup.add(podGroup);
    }

    // Helper method for pod windows
    static createPodWindows(podGroup, materials) {
        const podWindowRadius = 13.5;
        const podWindowHeight = 4;
        
        const curvedWindow = new THREE.Mesh(
            new THREE.CylinderGeometry(podWindowRadius, podWindowRadius, podWindowHeight, 64, 1, true),
            materials.darkGlassMaterial
        );
        podGroup.add(curvedWindow);

        // Window mullions
        const mullionCount = 32;
        const mullionGeom = new THREE.CylinderGeometry(0.15, 0.15, podWindowHeight, 8);
        
        for (let i = 0; i < mullionCount; i++) {
            const angle = (i / mullionCount) * Math.PI * 2;
            const x = Math.cos(angle) * podWindowRadius;
            const z = Math.sin(angle) * podWindowRadius;
            const mullion = new THREE.Mesh(mullionGeom, materials.frameMaterial);
            mullion.position.set(x, 0, z);
            podGroup.add(mullion);
        }
    }

    // Helper method for pod support pillars
    static createPodSupportPillars(podGroup, materials) {
        const pillarHeight = 15;
        const angledPillarGeom = new THREE.CylinderGeometry(1.2, 1, pillarHeight, 20);
        angledPillarGeom.translate(0, -pillarHeight/2, 0);

        const angledPillar1 = new THREE.Mesh(angledPillarGeom, materials.officeBuildingMaterial);
        angledPillar1.position.set(0, -5, 0);
        angledPillar1.rotation.z = -Math.PI / 6;
        angledPillar1.rotation.x = -Math.PI / 6;
        angledPillar1.castShadow = true;
        podGroup.add(angledPillar1);

        const angledPillar2 = angledPillar1.clone();
        angledPillar2.rotation.z = Math.PI / 6;
        podGroup.add(angledPillar2);
    }

    // 4. Building connectors
    static createConnectors(buildingGroup, materials) {
        const connectorGeom = new THREE.BoxGeometry(10, 6, 6);
        const connectorMesh = new THREE.Mesh(connectorGeom, materials.officeBuildingMaterial);
        
        const connector1 = connectorMesh.clone();
        connector1.position.set(-5, 12, 0);
        connector1.castShadow = true;
        
        // Add windows to connector
        const connectorWindow = new THREE.Mesh(
            new THREE.BoxGeometry(10.1, 4, 0.2), 
            materials.glassMaterial
        );
        
        const conn1Win1 = connectorWindow.clone();
        conn1Win1.position.set(0, 0, 3);
        connector1.add(conn1Win1);
        
        const conn1Win2 = connectorWindow.clone();
        conn1Win2.position.set(0, 0, -3);
        connector1.add(conn1Win2);
        
        buildingGroup.add(connector1);
    }

    // 5. Plaza and landscaping
    static createPlazaAndLandscaping(buildingGroup, materials) {
        // Main plaza
        const plaza = new THREE.Mesh(
            new THREE.BoxGeometry(110, 0.2, 90), 
            materials.groundMaterial
        );
        plaza.position.y = 0.1;
        plaza.receiveShadow = true;
        buildingGroup.add(plaza);

        // Monument in plaza
        const monument = this.createMonument(materials);
        monument.position.set(-15, 0.2, -15);
        buildingGroup.add(monument);

        // Add trees around the complex
        this.addLandscapeTrees(buildingGroup, materials);
    }

    // Helper method to create monument
    static createMonument(materials) {
        const monument = new THREE.Group();
        
        const monumentBase = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 2, 0.4, 32), 
            materials.groundMaterial
        );
        
        const monumentStatue = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 2.5, 0.8), 
            materials.frameMaterial
        );
        monumentStatue.position.y = 1.45;
        
        monument.add(monumentBase, monumentStatue);
        return monument;
    }

    // Helper method to add landscape trees
    static addLandscapeTrees(buildingGroup, materials) {
        const treePositions = [
            [40, 30], [48, 28], [-40, 35], [-45, -20]
        ];

        treePositions.forEach(([x, z]) => {
            const tree = this.createTree(x, z, materials);
            buildingGroup.add(tree);
        });
    }

    // Helper method to create individual trees
    static createTree(x, z, materials) {
        const tree = new THREE.Group();
        
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 2, 8), 
            materials.treeTrunkMaterial
        );
        trunk.position.y = 1;
        trunk.castShadow = true;
        
        const canopy = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.5, 0), 
            materials.leavesMaterial
        );
        canopy.position.y = 3;
        canopy.castShadow = true;
        
        tree.add(trunk, canopy);
        tree.position.set(x, 0, z);
        
        return tree;
    }
}