/**
 * Models: Animation
 */

// Dependencies
var PropertyValidator = require('../modules/PropertyValidator');

// Constructor: Animation
var Animation = new PropertyValidator({

    // Context
    'context': {
        'type': 'any',
        'required': true
    },

    // Fps
    'fps': {
        'type': 'number',
        'default': 60
    },

    // Frames
    'frames': {
        'type': 'array',
        'required': true
    },

    // Loop
    'loop': {
        'type': 'boolean',
        'default': true
    },

    // Name
    'name': {
        'type': 'string',
        'required': true
    },

    // Sprite sheet
    'spriteSheet': {
        'type': 'object',
        'required': true
    }
});

// Export `Animation`
module.exports = Animation;