// Constants Module - 4 Buildings Configuration - FIXED PROXIMITY
const CONSTANTS = {
    DEBUG_MODE: true,
    INSTRUCTION_TIMEOUT: 6000,
    SCENE: {
        BACKGROUND_COLOR: 0x87CEEB,
        FOG_COLOR: 0xB0E0E6,
        FOG_NEAR: 200,
        FOG_FAR: 800
    },
    CAMERA: {
        FOV: 80,
        NEAR: 0.1,
        FAR: 1000,
        FOLLOW_OFFSET: { x: 0, y: 8, z: 20 }
    },
    CAR: {
        SPEED: 0.25,
        ROTATION_SPEED: 0.015,
        MAX_SPEED: 0.8,
        ACCELERATION: 0.02,
        DECELERATION: 0.015,
        BRAKE_STRENGTH: 0.03,
        TURN_DAMPING: 0.85,
        MAX_TURN_SPEED: 0.03
    },
    STATIONS: {
        PROXIMITY_DISTANCE: 25, // 🚨 INCREASED from 10 to 25
        POSITIONS: [
            // 🆕 Experience = Würth Factory (NE - top right)
            { id: 'experience', position: [40, 0, 40], color: 0xc12127, modal: 'experience-modal' },
            // Skills = Tech Pyramid (NW - top left)
            { id: 'skills', position: [-40, 0, 40], color: 0x4ecdc4, modal: 'skills-modal' },
            // Projects = Creative Studio (SE - bottom right)
            { id: 'projects', position: [40, 0, -40], color: 0x45b7d1, modal: 'projects-modal' },
            // About = Modern House (SW - bottom left)
            { id: 'about', position: [-40, 0, -40], color: 0x96ceb4, modal: 'about-modal' }
        ]
    },
    WORLD: {
        SIZE: 300,
        HILLS_COUNT: 15,
        TREES_COUNT: 25,
        ROCKS_COUNT: 20
    }
};