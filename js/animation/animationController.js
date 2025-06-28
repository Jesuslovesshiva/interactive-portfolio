// Animation Controller Module
class AnimationController {
    constructor(app) {
        this.app = app;
        this.clock = new THREE.Clock();
    }

    updateCarMovement() {
        if (!this.app.car) return;

        const speed = CONSTANTS.CAR.SPEED;
        const rotationSpeed = CONSTANTS.CAR.ROTATION_SPEED;

        if (this.app.keys['KeyW'] || this.app.keys['ArrowUp']) {
            this.app.car.translateZ(-speed);
        }
        if (this.app.keys['KeyS'] || this.app.keys['ArrowDown']) {
            this.app.car.translateZ(speed);
        }
        if (this.app.keys['KeyA'] || this.app.keys['ArrowLeft']) {
            this.app.car.rotation.y += rotationSpeed;
        }
        if (this.app.keys['KeyD'] || this.app.keys['ArrowRight']) {
            this.app.car.rotation.y -= rotationSpeed;
        }

        // Animate wheels
        this.app.car.children.forEach(child => {
            if (child.children && child.children.length > 0) {
                if (this.app.keys['KeyW'] || this.app.keys['ArrowUp'] || 
                    this.app.keys['KeyS'] || this.app.keys['ArrowDown']) {
                    child.rotation.x += speed * 2;
                }
            }
        });

        // Update camera
        const idealOffset = new THREE.Vector3(
            CONSTANTS.CAMERA.FOLLOW_OFFSET.x,
            CONSTANTS.CAMERA.FOLLOW_OFFSET.y,
            CONSTANTS.CAMERA.FOLLOW_OFFSET.z
        );
        idealOffset.applyQuaternion(this.app.car.quaternion);
        const idealPosition = this.app.car.position.clone().add(idealOffset);

        this.app.camera.position.lerp(idealPosition, 0.08);

        const lookAtTarget = this.app.car.position.clone();
        lookAtTarget.x += this.app.mouseX * 8;
        lookAtTarget.y += this.app.mouseY * 5;
        this.app.camera.lookAt(lookAtTarget);
    }

    checkStationProximity() {
        if (!this.app.car || this.app.stations.length === 0) return;

        let nearStation = null;
        const proximityDistance = CONSTANTS.STATIONS.PROXIMITY_DISTANCE;

        this.app.stations.forEach(station => {
            const distance = this.app.car.position.distanceTo(station.position);

            if (distance < proximityDistance) {
                nearStation = station;
                const top = station.children.find(child => 
                    child.geometry && child.geometry.type === 'OctahedronGeometry');
                if (top && top.material.emissiveIntensity < 0.8) {
                    top.material.emissiveIntensity += 0.02;
                }
            } else {
                const top = station.children.find(child => 
                    child.geometry && child.geometry.type === 'OctahedronGeometry');
                if (top && top.material.emissiveIntensity > station.userData.originalEmissive) {
                    top.material.emissiveIntensity -= 0.02;
                }
            }
        });

        if (nearStation !== this.app.currentStation) {
            this.app.currentStation = nearStation;
            const prompt = document.getElementById('interaction-prompt');

            if (this.app.currentStation) {
                prompt.style.opacity = '1';
            } else {
                prompt.style.opacity = '0';
            }
        }
    }

    animateScene() {
        const time = this.clock.getElapsedTime();

        // Animate clouds
        if (this.app.sceneBuilder && this.app.sceneBuilder.getClouds) {
            this.app.sceneBuilder.getClouds().forEach((cloud, index) => {
                cloud.rotation.y += 0.001;
                cloud.position.x += Math.sin(time * 0.1 + index) * 0.02;
            });
        }

        // Animate stations
        this.app.stations.forEach((station, index) => {
            const top = station.children.find(child => 
                child.geometry && child.geometry.type === 'OctahedronGeometry');
            if (top) {
                top.rotation.y += 0.02;
                top.rotation.x += 0.01;
                top.position.y = 10 + Math.sin(time + index) * 0.5;
            }

            // Animate station particles
            if (station.userData.particles) {
                const positions = station.userData.particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] += Math.sin(time + i) * 0.01;
                }
                station.userData.particles.geometry.attributes.position.needsUpdate = true;
                station.userData.particles.rotation.y += 0.005;
            }
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
}