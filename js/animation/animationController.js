// Enhanced Animation Controller Module - FIXED VERSION
class AnimationController {
    constructor(app) {
        this.app = app;
        this.clock = new THREE.Clock();
        this.carVelocity = 0;
        this.carTurnVelocity = 0;
    }

    updateCarMovement() {
        if (!this.app.car) return;

        const maxSpeed = CONSTANTS.CAR.MAX_SPEED;
        const acceleration = CONSTANTS.CAR.ACCELERATION;
        const deceleration = CONSTANTS.CAR.DECELERATION;
        const brakeStrength = CONSTANTS.CAR.BRAKE_STRENGTH;
        const rotationSpeed = CONSTANTS.CAR.ROTATION_SPEED;
        const turnDamping = CONSTANTS.CAR.TURN_DAMPING;
        const maxTurnSpeed = CONSTANTS.CAR.MAX_TURN_SPEED;

        // Store current position for collision rollback
        const previousPosition = this.app.car.position.clone();

        // Simple forward/backward movement (like W and S in most games)
        let targetVelocity = 0;

        // Forward movement
        if (this.app.keys['KeyW'] || this.app.keys['ArrowUp']) {
            targetVelocity = maxSpeed;
        }
        // Backward movement (simple reverse, not braking)
        else if (this.app.keys['KeyS'] || this.app.keys['ArrowDown']) {
            targetVelocity = -maxSpeed * 0.7; // Reverse is slightly slower
        }

        // Apply acceleration/deceleration
        if (targetVelocity !== 0) {
            // Accelerating in either direction
            this.carVelocity = THREE.MathUtils.lerp(this.carVelocity, targetVelocity, acceleration);
        } else {
            // Natural deceleration when no keys pressed
            this.carVelocity = THREE.MathUtils.lerp(this.carVelocity, 0, deceleration);
        }

        // Improved Collision Detection: Only bounce if moving into a new collision
        const wasColliding = this.checkCollisions();

        // Apply movement
        if (Math.abs(this.carVelocity) > 0.01) {
            this.app.car.translateZ(this.carVelocity);
        }

        const isColliding = this.checkCollisions();
        if (!wasColliding && isColliding) {
            // Only bounce if we just entered a collision
            this.app.car.position.copy(previousPosition);
            this.carVelocity *= -0.3;
            this.carTurnVelocity *= 0.5;
        }

        // Smooth steering system
        let targetTurnVelocity = 0;
        if (Math.abs(this.carVelocity) > 0.05) {
            const speedFactor = Math.abs(this.carVelocity) / maxSpeed;
            const adjustedRotationSpeed = rotationSpeed * speedFactor; // Steering is speed-dependent
            
            if (this.app.keys['KeyA'] || this.app.keys['ArrowLeft']) {
                // A = turn left
                targetTurnVelocity = adjustedRotationSpeed * (this.carVelocity > 0 ? 1 : -1);
            }
            if (this.app.keys['KeyD'] || this.app.keys['ArrowRight']) {
                // D = turn right
                targetTurnVelocity = -adjustedRotationSpeed * (this.carVelocity > 0 ? 1 : -1);
            }
        }

        // Apply turn damping and limit max turn speed
        this.carTurnVelocity = THREE.MathUtils.lerp(this.carTurnVelocity, targetTurnVelocity, 0.15);
        this.carTurnVelocity = THREE.MathUtils.clamp(this.carTurnVelocity, -maxTurnSpeed, maxTurnSpeed);
        
        // Apply turn damping when not actively steering
        if (targetTurnVelocity === 0) {
            this.carTurnVelocity *= turnDamping;
        }
        
        this.app.car.rotation.y += this.carTurnVelocity;

        // Animate wheels and spare tire based on speed
        this.animateWheels();

        // Update racing-style camera
        this.updateRacingCamera();
    }

    checkCollisions() {
        const carPosition = this.app.car.position;
        
        // Check collisions with stations/buildings
        for (const station of this.app.stations) {
            const distance = carPosition.distanceTo(station.position);
            
            // 🆕 Special handling for Würth Factory (experience station)
            let collisionDistance = 12; // Default collision distance
            
            if (station.userData.id === 'experience') {
                // Würth factory is much larger, needs bigger collision area
                collisionDistance = 25;
            }
            
            if (distance < collisionDistance) {
                return true;
            }
        }

        // Check collisions with mountains (treat them like buildings)
        if (this.app.mountains) {
            for (const mountain of this.app.mountains) {
                const distance = carPosition.distanceTo(mountain.position);
                if (distance < 35) { // Mountains have large collision area
                    return true;
                }
            }
        }

        // Check collisions with individual trees and rocks in the scene
        for (const object of this.app.scene.children) {
            // Only check trees and rocks, not mountains (mountains are handled above)
            if (object.userData.isTree || object.userData.isRock) {
                const distance = carPosition.distanceTo(object.position);
                const collisionDistance = this.getCollisionDistance(object);
                if (distance < collisionDistance) {
                    return true;
                }
            }
            
            // Check children of grouped objects for trees and rocks
            if (object.children) {
                for (const child of object.children) {
                    if ((child.userData.isTree || child.userData.isRock) && !child.userData.isMountain) {
                        const distance = carPosition.distanceTo(child.position);
                        const collisionDistance = this.getCollisionDistance(child);
                        if (distance < collisionDistance) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    getCollisionDistance(object) {
        if (object.userData.isTree) return 3;     // Trees have small collision
        if (object.userData.isRock) return 1;     // Rocks have tiny collision
        if (object.userData.isMountain) return 35; // Mountains have large collision
        return 3; // Default
    }

checkStationProximity() {
    if (!this.app.car || this.app.stations.length === 0) return;

    let nearStation = null;
    
    this.app.stations.forEach(station => {
        const distance = this.app.car.position.distanceTo(station.position);
        
        // 🚨 FIXED: Much larger proximity distances that make sense for your world scale
        let adjustedProximityDistance = 30; // Default proximity distance
        
        if (station.userData.id === 'experience') {
            adjustedProximityDistance = 35; // Larger for Würth Factory
        }

                 if (distance < adjustedProximityDistance) {
             nearStation = station;
             this.enhanceStationProximity(station, distance, adjustedProximityDistance);
        } else {
            this.resetStationEffects(station);
        }
    });

    if (nearStation !== this.app.currentStation) {
        this.app.currentStation = nearStation;
        const prompt = document.getElementById('interaction-prompt');

                 if (this.app.currentStation) {
             prompt.style.opacity = '1';
             prompt.textContent = this.getProximityText(this.app.currentStation.userData.id);
         } else {
             prompt.style.opacity = '0';
             prompt.textContent = 'Press [E] to Explore';
         }
    }
}
    enhanceStationProximity(station, distance, maxDistance) {
        const intensity = 1 - (distance / maxDistance);
        
        // Find special elements and enhance them
        station.children.forEach(child => {
            // Enhance emissive materials
            if (child.material && child.material.emissive) {
                const targetIntensity = station.userData.originalEmissive + intensity * 0.5;
                child.material.emissiveIntensity = Math.min(targetIntensity, 0.8);
            }
            
            // Enhance glowing elements
            if (child.material && child.material.transparent && child.material.opacity < 1) {
                child.material.opacity = Math.min(0.4 + intensity * 0.4, 0.9);
            }
        });

        // Make particles more active
        if (station.userData.particles) {
            station.userData.particles.material.opacity = 0.5 + intensity * 0.3;
            station.userData.particles.material.size = 0.8 + intensity * 0.4;
        }
    }

    resetStationEffects(station) {
        station.children.forEach(child => {
            if (child.material && child.material.emissive) {
                if (child.material.emissiveIntensity > station.userData.originalEmissive) {
                    child.material.emissiveIntensity -= 0.02;
                }
            }
            
            if (child.material && child.material.transparent && child.material.opacity > 0.4) {
                child.material.opacity -= 0.01;
            }
        });

        if (station.userData.particles) {
            if (station.userData.particles.material.opacity > 0.5) {
                station.userData.particles.material.opacity -= 0.01;
            }
            if (station.userData.particles.material.size > 0.8) {
                station.userData.particles.material.size -= 0.01;
            }
        }
    }

    // 🆕 Updated proximity text for Würth Factory
    getProximityText(stationId) {
        const texts = {
            'experience': 'Press [E] to Explore Würth Factory',
            'skills': 'Press [E] to Access Tech Pyramid',
            'projects': 'Press [E] to Visit Creative Studio',
            'about': 'Press [E] to Enter Modern House'
        };
        return texts[stationId] || 'Press [E] to Explore';
    }

    animateWheels() {
        this.app.car.children.forEach(child => {
            // Check if this is a wheel group (a Group containing another Group)
            if (child.type === 'Group' && child.children[0]?.type === 'Group') {
                const wheelAssembly = child.children[0];
                if (Math.abs(this.carVelocity) > 0.01) {
                    // Rotate the inner assembly for a realistic spin
                    wheelAssembly.rotation.x += this.carVelocity * -5;
                }
            } 
            // Check if this is the spare tire group
            else if (child.userData.isSpare) {
                 if (Math.abs(this.carVelocity) > 0.01) {
                    // The spare tire is mounted vertically, so it spins on its Z axis
                    child.rotation.z += this.carVelocity * -5;
                }
            }
        });
    }

    updateRacingCamera() {
        if (!this.app.car || !this.app.camera) return;

        // GTA-style camera configuration
        const baseDistance = 20;
        const cameraHeight = 8;
        const lookAheadDistance = 8;
        const cameraSpeed = 0.08;
        
        // Dynamic camera distance based on speed (further back when going faster)
        const speedFactor = Math.abs(this.carVelocity) / CONSTANTS.CAR.MAX_SPEED;
        const cameraDistance = baseDistance + (speedFactor * 10);
        
        // Calculate ideal camera position behind the car
        const carDirection = new THREE.Vector3(0, 0, 1);
        carDirection.applyQuaternion(this.app.car.quaternion);
        
        // Position camera behind the car
        const idealCameraPosition = this.app.car.position.clone()
            .sub(carDirection.multiplyScalar(cameraDistance));
        idealCameraPosition.y = this.app.car.position.y + cameraHeight + (speedFactor * 3);
        
        // Smooth camera movement (slower when turning for cinematic effect)
        const turnInfluence = Math.abs(this.carTurnVelocity) * 10;
        const adjustedCameraSpeed = cameraSpeed * (1 - turnInfluence * 0.3);
        this.app.camera.position.lerp(idealCameraPosition, adjustedCameraSpeed);
        
        // Look ahead of the car based on speed and direction
        const lookAtTarget = this.app.car.position.clone()
            .add(carDirection.multiplyScalar(lookAheadDistance + speedFactor * 5));
        lookAtTarget.y = this.app.car.position.y + 1;
        
        // Add mouse influence for manual camera control
        lookAtTarget.x += this.app.mouseX * 5;
        lookAtTarget.y += Math.max(-2, Math.min(4, this.app.mouseY * 3));
        
        // Smooth camera look-at
        this.app.camera.lookAt(lookAtTarget);
        
        // Add subtle camera shake when braking hard
        if (Math.abs(this.carVelocity) > 0.3 && this.app.keys['KeyS']) {
            const shake = (Math.random() - 0.5) * 0.1;
            this.app.camera.position.x += shake;
            this.app.camera.position.y += shake * 0.5;
        }
    }

    // 🚨 CRITICAL FIX: This method must call checkStationProximity!
    animateScene() {
        const time = this.clock.getElapsedTime();

        // 🆕 Animate enhanced lights
        if (this.app.sceneBuilder && this.app.sceneBuilder.animateLights) {
            this.app.sceneBuilder.animateLights(time);
        }

        // Animate clouds
        if (this.app.sceneBuilder && this.app.sceneBuilder.getClouds) {
            this.app.sceneBuilder.getClouds().forEach((cloud, index) => {
                cloud.rotation.y += 0.001;
                cloud.position.x += Math.sin(time * 0.1 + index) * 0.02;
            });
        }

        // Animate buildings with unique behaviors
        this.app.stations.forEach((station, index) => {
            this.animateBuilding(station, time, index);
            this.animateStationParticles(station, time, index);
        });

        // Animate global particles
        if (this.app.particles) {
            this.app.particles.rotation.y += 0.001;
            const positions = this.app.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i * 0.1) * 0.01;
            }
            this.app.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    animateBuilding(station, time, index) {
        const stationId = station.userData.id;
        
        station.children.forEach(child => {
            // Common building animations
            if (child.userData.rotatingElement) {
                child.rotation.y += 0.02;
            }
            
            if (child.userData.floatingElement) {
                child.position.y = 15 + Math.sin(time * 2 + index) * 1.5;
                child.rotation.x += 0.01;
                child.rotation.y += 0.02;
            }

            // Building-specific animations
            switch(stationId) {
                case 'experience':
                    this.animateWuerthBuilding(child, time, index);
                    break;
                case 'skills':
                    this.animateTechPyramid(child, time, index);
                    break;
                case 'projects':
                    this.animateCreativeStudio(child, time, index);
                    break;
                case 'about':
                    this.animateModernHouse(child, time, index);
                    break;
            }
        });
    }

    // 🆕 Animation for Würth Factory
    animateWuerthBuilding(child, time, index) {
        // Animate orange/red pod materials with subtle glow
        if (child.material && child.material.color && (
            child.material.color.getHex() === 0xfc4f00 || // Orange
            child.material.color.getHex() === 0xc12127    // Red
        )) {
            const pulse = Math.sin(time * 2 + index * 0.3) * 0.1 + 0.9;
            child.material.emissiveIntensity = pulse * 0.2;
            child.material.emissive = child.material.color.clone().multiplyScalar(0.1);
        }

        // Animate glass materials (transmission effects)
        if (child.material && child.material.transmission) {
            const shimmer = Math.sin(time * 3 + index) * 0.1 + 0.8;
            child.material.transmission = shimmer;
        }

        // Animate rotating elements (like satellite dishes)
        if (child.userData.rotatingElement) {
            child.rotation.y += 0.02;
        }

        // Animate floating/hovering elements
        if (child.userData.floatingElement) {
            child.position.y += Math.sin(time * 2 + index) * 0.1;
            child.rotation.y += 0.01;
        }

        // Animate dark glass windows (office lighting effects)
        if (child.material && child.material.color && child.material.color.getHex() === 0x2c3e50) {
            const office = Math.sin(time * 4 + index * 0.7) * 0.2 + 0.7;
            child.material.opacity = office;
        }

        // Animate any emissive materials (lights, signs, etc.)
        if (child.material && child.material.emissive && child.material.emissiveIntensity > 0) {
            const glow = Math.sin(time * 1.5 + index) * 0.3 + 0.5;
            child.material.emissiveIntensity = glow;
        }
    }

    animateTechPyramid(child, time, index) {
        // Animate circuit patterns
        if (child.material && child.material.emissive && child.geometry.type === 'BoxGeometry') {
            const circuit = Math.sin(time * 5 + index) * 0.2 + 0.3;
            child.material.emissiveIntensity = circuit;
        }

        // Spin the holographic element
        if (child.userData.floatingElement) {
            child.rotation.z += 0.01;
            
            // Add color cycling effect
            if (child.material && child.material.emissive) {
                const hue = (time * 0.1 + index) % 1;
                child.material.emissive.setHSL(hue, 0.8, 0.5);
                child.material.color.setHSL(hue, 0.8, 0.7);
            }
        }
    }

    animateCreativeStudio(child, time, index) {
        // Animate orbiting geometric shapes
        if (child.userData.orbitingElement) {
            const orbitSpeed = 0.5;
            const newAngle = child.userData.orbitAngle + time * orbitSpeed;
            const radius = child.userData.orbitRadius + Math.sin(time * 2 + index) * 1;
            
            child.position.x = Math.cos(newAngle) * radius;
            child.position.z = Math.sin(newAngle) * radius;
            child.position.y = 8 + Math.sin(time * 1.5 + index) * 2;
            
            // Rotate the shapes themselves
            child.rotation.x += 0.02;
            child.rotation.y += 0.015;
            child.rotation.z += 0.01;
        }

        // Animate the display screen
        if (child.material && child.material.emissive && child.geometry.type === 'PlaneGeometry') {
            const screenEffect = Math.sin(time * 6) * 0.1 + 0.2;
            child.material.emissiveIntensity = screenEffect;
            
            // Color cycling effect for the screen
            const hue = (time * 0.2) % 1;
            child.material.emissive.setHSL(hue, 0.6, 0.3);
        }
    }

    animateModernHouse(child, time, index) {
        // Animate garden bushes (slight sway)
        if (child.material && child.material.color && child.material.color.getHex() === 0x228B22) {
            const sway = Math.sin(time * 2 + index) * 0.02;
            child.rotation.z = sway;
        }

        // Animate windows (warm light effect)
        if (child.material && child.material.color && child.material.color.getHex() === 0x87CEEB) {
            const warmth = Math.sin(time * 1.5) * 0.1 + 0.7;
            child.material.opacity = warmth;
            
            // Add warm color tint in evening
            const timeOfDay = Math.sin(time * 0.1) * 0.5 + 0.5;
            if (timeOfDay > 0.7) {
                child.material.color.setRGB(1, 0.8, 0.6);
            } else {
                child.material.color.setHex(0x87CEEB);
            }
        }

        // Animate house number glow
        if (child.material && child.material.emissive && child.geometry.type === 'PlaneGeometry') {
            const glow = Math.sin(time * 2) * 0.3 + 0.5;
            child.material.emissiveIntensity = glow;
        }

        // Smoke effect from chimney (simple particle-like movement)
        if (child.position.y > 10 && child.material && child.material.color) {
            const drift = Math.sin(time + index) * 0.1;
            child.position.x += drift * 0.01;
        }
    }

    animateStationParticles(station, time, index) {
        if (station.userData.particles) {
            const positions = station.userData.particles.geometry.attributes.position.array;
            
            // Different particle behaviors for different buildings
            switch(station.userData.id) {
                case 'experience':
                    // Upward flowing particles (like data streams)
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 1] += Math.sin(time * 3 + i) * 0.02 + 0.01;
                        if (positions[i + 1] > 25) positions[i + 1] = 5;
                    }
                    break;
                    
                case 'skills':
                    // Circular swirling particles
                    for (let i = 0; i < positions.length; i += 3) {
                        const angle = time + i * 0.1;
                        positions[i] += Math.cos(angle) * 0.02;
                        positions[i + 2] += Math.sin(angle) * 0.02;
                        positions[i + 1] += Math.sin(time * 2 + i) * 0.01;
                    }
                    break;
                    
                case 'projects':
                    // Chaotic creative particles
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i] += Math.sin(time * 4 + i) * 0.03;
                        positions[i + 1] += Math.cos(time * 3 + i) * 0.02;
                        positions[i + 2] += Math.sin(time * 5 + i) * 0.025;
                    }
                    break;
                    
                case 'about':
                    // Gentle floating particles (like cozy atmosphere)
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 1] += Math.sin(time + i) * 0.015;
                        positions[i] += Math.cos(time * 0.5 + i) * 0.01;
                    }
                    break;
            }
            
            station.userData.particles.geometry.attributes.position.needsUpdate = true;
            station.userData.particles.rotation.y += 0.005;
        }
    }
}