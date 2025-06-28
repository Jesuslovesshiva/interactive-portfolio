// Constants Module
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
        FOV: 75,
        NEAR: 0.1,
        FAR: 1000,
        FOLLOW_OFFSET: { x: 0, y: 12, z: 20 }
    },
    CAR: {
        SPEED: 0.4,
        ROTATION_SPEED: 0.035
    },
    STATIONS: {
        PROXIMITY_DISTANCE: 10,
        POSITIONS: [
            { id: 'experience', position: [40, 0, 40], color: 0xff6b6b, modal: 'experience-modal' },
            { id: 'skills', position: [-40, 0, 40], color: 0x4ecdc4, modal: 'skills-modal' },
            { id: 'projects', position: [40, 0, -40], color: 0x45b7d1, modal: 'projects-modal' },
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