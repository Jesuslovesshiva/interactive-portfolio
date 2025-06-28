// Object Factory Module
class ObjectFactory {
    static createCar() {
        const carGroup = new THREE.Group();

        // Enhanced car body
        const bodyGeometry = new THREE.BoxGeometry(5, 2, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2196F3,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        carGroup.add(body);

        // Car roof
        const roofGeometry = new THREE.BoxGeometry(3.5, 1.5, 2.5);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x1976D2 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 2.8;
        roof.castShadow = true;
        carGroup.add(roof);

        // Wheels with rims
        const wheelPositions = [
            [-2, 0.8, 1.8], [2, 0.8, 1.8],
            [-2, 0.8, -1.8], [2, 0.8, -1.8]
        ];

        wheelPositions.forEach(pos => {
            const wheelGroup = new THREE.Group();
            
            const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 12);
            const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheelGroup.add(wheel);
            
            const rimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 12);
            const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC, shininess: 100 });
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);
            
            wheelGroup.position.set(pos[0], pos[1], pos[2]);
            wheelGroup.castShadow = true;
            carGroup.add(wheelGroup);
        });

        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });

        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-1.5, 1.5, 2.8);
        carGroup.add(leftHeadlight);

        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(1.5, 1.5, 2.8);
        carGroup.add(rightHeadlight);

        return carGroup;
    }

    static createStation(data) {
        const stationGroup = new THREE.Group();

        // Enhanced pillar
        const pillarGeometry = new THREE.CylinderGeometry(1.5, 2, 8, 12);
        const pillarMaterial = new THREE.MeshPhongMaterial({ 
            color: data.color,
            shininess: 50
        });
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.y = 4;
        pillar.castShadow = true;
        stationGroup.add(pillar);

        // Decorative rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(2.2, 0.2, 8, 16);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(data.color).multiplyScalar(1.2),
                emissive: data.color,
                emissiveIntensity: 0.2
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.y = 2 + i * 3;
            ring.rotation.x = Math.PI / 2;
            stationGroup.add(ring);
        }

        // Glowing top
        const topGeometry = new THREE.OctahedronGeometry(2, 1);
        const topMaterial = new THREE.MeshPhongMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.9
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 10;
        top.castShadow = true;
        stationGroup.add(top);

        // Floating particles
        const particleCount = 20;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 10;
            particlePositions[i3 + 1] = Math.random() * 15;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: data.color,
            size: 0.5,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        stationGroup.add(particles);

        stationGroup.position.set(data.position[0], data.position[1], data.position[2]);
        stationGroup.userData = { 
            id: data.id, 
            modal: data.modal, 
            originalEmissive: 0.4,
            particles: particles
        };

        return stationGroup;
    }

    static createTree(x, z, scene) {
        const treeGroup = new THREE.Group();

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8, 6);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 4;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(4, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.25, 0.6, Math.random() * 0.3 + 0.3)
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 10;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        treeGroup.position.set(x, 0, z);
        treeGroup.scale.setScalar(Math.random() * 0.5 + 0.8);
        scene.add(treeGroup);
    }

    static createRock(x, z, scene) {
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1, 0);
        const rockMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0, 0, Math.random() * 0.3 + 0.4)
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, Math.random() * 2, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
    }

    static createGlobalParticles(scene) {
        const particleCount = 100;
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
            size: 1,
            transparent: true,
            opacity: 0.3
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        return particles;
    }
}