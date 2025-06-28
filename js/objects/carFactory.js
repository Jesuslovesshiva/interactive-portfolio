// Enhanced Car Factory Module with Professional Materials
class CarFactory {
    
    // 🆕 Create professional materials for the car
    static createProfessionalMaterials() {
        const materials = {};

        // 🆕 Car Body - Metallic Paint (PBR)
        materials.carBody = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.15, 0.08, 0.05), // Dark brown base
            metalness: 0.9,           // Very metallic
            roughness: 0.1,           // Smooth paint finish
            clearcoat: 1.0,           // Car clear coat
            clearcoatRoughness: 0.05, // Smooth clear coat
        });

        // 🆕 Chrome/Metal Parts
        materials.chrome = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.05,
        });

        // 🆕 Dark Metal (grille, bumpers)
        materials.darkMetal = new THREE.MeshStandardMaterial({
            color: 0x2C2C2C,
            metalness: 0.8,
            roughness: 0.3,
        });

        // 🆕 Tire Rubber
        materials.tire = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.0,
            roughness: 0.95, // Very rough rubber
        });

        // 🆕 Glass/Windows (Physical Material for realism)
        materials.glass = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.9,    // Glass transparency
            transparent: true,
            opacity: 0.15,
            ior: 1.5,            // Index of refraction for glass
            thickness: 0.1,      // Glass thickness
        });

        // 🆕 Headlights
        materials.headlight = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
        });

        // 🆕 Taillights
        materials.taillight = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            metalness: 0.0,
            roughness: 0.2,
            emissive: 0xff0000,
            emissiveIntensity: 0.4,
        });

        // 🆕 Plastic Parts
        materials.plastic = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.0,
            roughness: 0.7,
        });

        return materials;
    }

    static createCar() {
        const carGroup = new THREE.Group();
        
        // 🆕 Get professional materials
        const materials = this.createProfessionalMaterials();

        // Land Cruiser main body - higher and more boxy
        const bodyGeometry = new THREE.BoxGeometry(6, 2.5, 4);
        const body = new THREE.Mesh(bodyGeometry, materials.carBody); // 🆕 Use professional material
        body.position.y = 2.5;
        body.castShadow = true;
        carGroup.add(body);

        // Hood (longer and more prominent)
        const hoodGeometry = new THREE.BoxGeometry(6, 0.3, 1.5);
        const hood = new THREE.Mesh(hoodGeometry, materials.carBody); // 🆕 Same body material
        hood.position.set(0, 3.9, 1.25);
        hood.castShadow = true;
        carGroup.add(hood);

        // Cabin/Roof - more angular and tall
        const roofGeometry = new THREE.BoxGeometry(5.5, 2, 3.5);
        const roof = new THREE.Mesh(roofGeometry, materials.carBody); // 🆕 Body material
        roof.position.y = 4.25;
        roof.castShadow = true;
        carGroup.add(roof);

        // Sunroof
        const sunroofGeometry = new THREE.PlaneGeometry(2.5, 2);
        const sunroof = new THREE.Mesh(sunroofGeometry, materials.glass); // 🆕 Glass material
        sunroof.position.set(0, 5.26, 0);
        sunroof.rotation.x = -Math.PI / 2;
        carGroup.add(sunroof);

        // Window Frames
        const frontFrameTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 0.1), materials.darkMetal); // 🆕 Dark metal
        frontFrameTop.position.set(0, 5.15, 1.76);
        carGroup.add(frontFrameTop);
        const frontFrameBottom = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 0.1), materials.darkMetal);
        frontFrameBottom.position.set(0, 3.25, 1.76);
        carGroup.add(frontFrameBottom);

        // Rear windshield frame
        const rearFrameTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 0.1), materials.darkMetal);
        rearFrameTop.position.set(0, 5.15, -1.76);
        carGroup.add(rearFrameTop);
        const rearFrameBottom = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 0.1), materials.darkMetal);
        rearFrameBottom.position.set(0, 3.25, -1.76);
        carGroup.add(rearFrameBottom);

        // Front windshield
        const windshieldGeometry = new THREE.PlaneGeometry(5, 1.8);
        const windshield = new THREE.Mesh(windshieldGeometry, materials.glass); // 🆕 Glass material
        windshield.position.set(0, 4.2, 1.76);
        windshield.rotation.x = -0.1;
        carGroup.add(windshield);

        // Side windows
        const sideWindowGeometry = new THREE.PlaneGeometry(3, 1.5);

        // Left side window
        const leftWindow = new THREE.Mesh(sideWindowGeometry, materials.glass); // 🆕 Glass material
        leftWindow.position.set(-2.76, 4.2, 0);
        leftWindow.rotation.y = Math.PI / 2;
        carGroup.add(leftWindow);

        // Right side window
        const rightWindow = new THREE.Mesh(sideWindowGeometry, materials.glass); // 🆕 Glass material
        rightWindow.position.set(2.76, 4.2, 0);
        rightWindow.rotation.y = -Math.PI / 2;
        carGroup.add(rightWindow);

        // Door handles
        const handleGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.4);
        const frontLeftHandle = new THREE.Mesh(handleGeometry, materials.chrome); // 🆕 Chrome material
        frontLeftHandle.position.set(-2.8, 3.5, 1.2);
        carGroup.add(frontLeftHandle);

        const rearLeftHandle = new THREE.Mesh(handleGeometry, materials.chrome);
        rearLeftHandle.position.set(-2.8, 3.5, -1.2);
        carGroup.add(rearLeftHandle);
        
        const frontRightHandle = new THREE.Mesh(handleGeometry, materials.chrome);
        frontRightHandle.position.set(2.8, 3.5, 1.2);
        carGroup.add(frontRightHandle);

        const rearRightHandle = new THREE.Mesh(handleGeometry, materials.chrome);
        rearRightHandle.position.set(2.8, 3.5, -1.2);
        carGroup.add(rearRightHandle);

        // Side mirrors
        const mirrorGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.8);
        const leftMirror = new THREE.Mesh(mirrorGeometry, materials.plastic); // 🆕 Plastic material
        leftMirror.position.set(-2.9, 4.5, 1.5);
        carGroup.add(leftMirror);

        const rightMirror = new THREE.Mesh(mirrorGeometry, materials.plastic);
        rightMirror.position.set(2.9, 4.5, 1.5);
        carGroup.add(rightMirror);

        // Door seams (keep as lines)
        const seamMaterial = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 2 });
        
        // Left door seam
        const leftDoorPoints = [];
        leftDoorPoints.push(new THREE.Vector3(-2.7, 5, 0));
        leftDoorPoints.push(new THREE.Vector3(-2.7, 1.5, 0));
        const leftDoorGeometry = new THREE.BufferGeometry().setFromPoints(leftDoorPoints);
        const leftDoorLine = new THREE.Line(leftDoorGeometry, seamMaterial);
        carGroup.add(leftDoorLine);

        // Right door seam
        const rightDoorPoints = [];
        rightDoorPoints.push(new THREE.Vector3(2.7, 5, 0));
        rightDoorPoints.push(new THREE.Vector3(2.7, 1.5, 0));
        const rightDoorGeometry = new THREE.BufferGeometry().setFromPoints(rightDoorPoints);
        const rightDoorLine = new THREE.Line(rightDoorGeometry, seamMaterial);
        carGroup.add(rightDoorLine);

        // Rear windshield
        const rearWindshieldGeometry = new THREE.PlaneGeometry(5, 1.8);
        const rearWindshield = new THREE.Mesh(rearWindshieldGeometry, materials.glass); // 🆕 Glass material
        rearWindshield.position.set(0, 4.2, -1.76);
        rearWindshield.rotation.x = 0.1;
        carGroup.add(rearWindshield);

        // Off-road wheels (larger and chunkier)
        const wheelPositions = [
            [-2.5, 1.2, 2.2], [2.5, 1.2, 2.2],   // Front wheels
            [-2.5, 1.2, -2.2], [2.5, 1.2, -2.2]  // Rear wheels
        ];

        wheelPositions.forEach(pos => {
            const wheelGroup = new THREE.Group();
            
            // This entire group will be the wheel, and we will rotate it to spin.
            const wheelAssembly = new THREE.Group();
            wheelGroup.add(wheelAssembly);
            
            // Create realistic tire (torus shape), stands up in YZ plane
            const tireGeometry = new THREE.TorusGeometry(1.1, 0.4, 12, 24);
            const tire = new THREE.Mesh(tireGeometry, materials.tire); // 🆕 Professional tire material
            tire.rotation.y = Math.PI / 2;
            wheelAssembly.add(tire);
            
            // Create wheel rim (cylinder), axis along X
            const rimGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
            const rim = new THREE.Mesh(rimGeometry, materials.chrome); // 🆕 Chrome material
            rim.rotation.z = Math.PI / 2;
            wheelAssembly.add(rim);

            // Add spokes to the rim, radiating from the center X-axis
            for (let i = 0; i < 5; i++) {
                const spokeGeometry = new THREE.BoxGeometry(1.4, 0.08, 0.08);
                const spoke = new THREE.Mesh(spokeGeometry, materials.chrome); // 🆕 Chrome material
                const angle = (i * Math.PI * 2) / 5;
                spoke.rotation.y = angle;
                wheelAssembly.add(spoke);
            }

            // Add center cap
            const capGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 12);
            const cap = new THREE.Mesh(capGeometry, materials.chrome); // 🆕 Chrome material
            cap.rotation.z = Math.PI / 2;
            wheelAssembly.add(cap);
            
            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            wheelGroup.castShadow = true;
            carGroup.add(wheelGroup);
        });

        // Front grille (iconic Land Cruiser look)
        const grilleGeometry = new THREE.BoxGeometry(4.5, 1.5, 0.2);
        const grille = new THREE.Mesh(grilleGeometry, materials.darkMetal); // 🆕 Dark metal
        grille.position.set(0, 2.8, 2.9);
        carGroup.add(grille);

        // Grille bars
        for (let i = 0; i < 6; i++) {
            const barGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
            const bar = new THREE.Mesh(barGeometry, materials.chrome); // 🆕 Chrome material
            bar.position.set(-2 + i * 0.8, 2.8, 2.95);
            carGroup.add(bar);
        }

        // Off-road headlights (round and robust)
        const headlightGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const leftHeadlight = new THREE.Mesh(headlightGeometry, materials.headlight); // 🆕 Professional headlight
        leftHeadlight.position.set(-1.8, 2.8, 2.8);
        carGroup.add(leftHeadlight);

        const rightHeadlight = new THREE.Mesh(headlightGeometry, materials.headlight);
        rightHeadlight.position.set(1.8, 2.8, 2.8);
        carGroup.add(rightHeadlight);

        // Fog lights
        const fogLightGeometry = new THREE.SphereGeometry(0.25, 6, 6);
        const fogLightMaterial = new THREE.MeshStandardMaterial({ // 🆕 Enhanced fog lights
            color: 0xFFFF99,
            metalness: 0.1,
            roughness: 0.2,
            emissive: 0xFFFF99,
            emissiveIntensity: 0.3,
        });

        const leftFogLight = new THREE.Mesh(fogLightGeometry, fogLightMaterial);
        leftFogLight.position.set(-2.2, 2.2, 2.7);
        carGroup.add(leftFogLight);

        const rightFogLight = new THREE.Mesh(fogLightGeometry, fogLightMaterial);
        rightFogLight.position.set(2.2, 2.2, 2.7);
        carGroup.add(rightFogLight);

        // Roof rack
        const rackGeometry = new THREE.BoxGeometry(5, 0.1, 3);
        const roofRack = new THREE.Mesh(rackGeometry, materials.darkMetal); // 🆕 Dark metal
        roofRack.position.y = 5.3;
        carGroup.add(roofRack);

        // Roof rack rails
        for (let i = 0; i < 4; i++) {
            const railGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 6);
            const rail = new THREE.Mesh(railGeometry, materials.darkMetal); // 🆕 Dark metal
            rail.position.set(-1.5 + i * 1, 5.35, 0);
            rail.rotation.z = Math.PI / 2;
            carGroup.add(rail);
        }

        // Spare tire on back (standing upright)
        const spareTireGroup = new THREE.Group();
        
        // Create realistic spare tire using torus
        const spareTireGeometry = new THREE.TorusGeometry(0.9, 0.3, 8, 16);
        const spareTire = new THREE.Mesh(spareTireGeometry, materials.tire); // 🆕 Professional tire
        spareTire.rotation.x = Math.PI / 2; // Rotate to stand upright
        spareTireGroup.add(spareTire);

        // Spare tire rim (standing upright)
        const spareRimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 12);
        const spareRim = new THREE.Mesh(spareRimGeometry, materials.chrome); // 🆕 Chrome material
        spareTireGroup.add(spareRim);

        // Add spokes to spare rim
        for (let i = 0; i < 5; i++) {
            const spokeGeometry = new THREE.BoxGeometry(0.03, 1.0, 0.05);
            const spoke = new THREE.Mesh(spokeGeometry, materials.chrome); // 🆕 Chrome material
            spoke.rotation.z = (i * Math.PI * 2) / 5;
            spareTireGroup.add(spoke);
        }

        // Spare tire mounting bracket
        const bracketGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
        const bracket = new THREE.Mesh(bracketGeometry, materials.darkMetal); // 🆕 Dark metal
        bracket.position.z = -0.15;
        spareTireGroup.add(bracket);

        spareTireGroup.userData.isSpare = true; // Mark this group as the spare tire
        spareTireGroup.position.set(0, 3, -2.6);
        spareTireGroup.castShadow = true;
        carGroup.add(spareTireGroup);

        // Front bull bar/bumper
        const bullBarGeometry = new THREE.BoxGeometry(5.5, 0.3, 0.3);
        const bullBar = new THREE.Mesh(bullBarGeometry, materials.darkMetal); // 🆕 Dark metal
        bullBar.position.set(0, 1.8, 3.2);
        carGroup.add(bullBar);

        // Side steps
        const stepGeometry = new THREE.BoxGeometry(6, 0.2, 0.4);

        const leftStep = new THREE.Mesh(stepGeometry, materials.darkMetal); // 🆕 Dark metal
        leftStep.position.set(0, 1.2, -3);
        carGroup.add(leftStep);

        const rightStep = new THREE.Mesh(stepGeometry, materials.darkMetal);
        rightStep.position.set(0, 1.2, 3);
        carGroup.add(rightStep);

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 4);
        const antenna = new THREE.Mesh(antennaGeometry, materials.darkMetal); // 🆕 Dark metal
        antenna.position.set(2.5, 6, -1);
        carGroup.add(antenna);

        // Taillights
        const taillightGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
        const leftTaillight = new THREE.Mesh(taillightGeometry, materials.taillight); // 🆕 Professional taillight
        leftTaillight.position.set(-2.5, 3, -2.05);
        carGroup.add(leftTaillight);

        const rightTaillight = new THREE.Mesh(taillightGeometry, materials.taillight);
        rightTaillight.position.set(2.5, 3, -2.05);
        carGroup.add(rightTaillight);

        // Exhaust pipe
        const exhaustGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        const exhaustPipe = new THREE.Mesh(exhaustGeometry, materials.chrome); // 🆕 Chrome material
        exhaustPipe.position.set(-1.5, 1.5, -2.2);
        exhaustPipe.rotation.x = Math.PI / 2;
        carGroup.add(exhaustPipe);

        return carGroup;
    }
}