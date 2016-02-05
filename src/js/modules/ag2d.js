/**
 * AG2D
 *
 * @desc A 2D game engine
 */

// Constructor: AG2D
var AG2D = function (canvas, options) {
    'use strict';

    // If this is being called for the first time, make it an instance
    if (!(this instanceof AG2D)) {
        return new AG2D(canvas, options);
    }

    // Defaults
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.options = options || {};
    this.fps = this.options.options.fps || 60;
    this.backgroundColour = this.options.options.backgroundColour || 'transparent';
    this.size = this.options.options.size || {
        'height': 150,
        'width': 300
    };
    this.lastDraw = window.performance.now();
    this.interval = 1000 / this.fps;

    // Call `init`
    this.init();
};

// Method: init
AG2D.prototype.init = function () {
    'use strict';

    // Call `resizeCanvas`
    this.resizeCanvas(this.size.width, this.size.height);

    // Call `inject`
    this.inject();

    // Call `bindEventListeners`
    this.bindEventListeners();

    // Call `options.init`
    this.options.init();

    // Call `options.draw`
    this.options.draw();

    // Call `renderLoop`
    this.renderLoop();
};

// Method: update
AG2D.prototype.update = function (deltaTime) {
    'use strict';

    // Call `options.update` and pass delta time
    this.options.update(deltaTime);
};

// Method: draw
AG2D.prototype.draw = function () {
    'use strict';

    // Save `context`
    this.context.save();

    // Scale `context` by `devicePixelRatio`
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Call `clearCanvas`
    this.clearCanvas();

    // Call `options.draw`
    this.options.draw();

    // Restore `context`
    this.context.restore();
};

// Method: renderLoop
AG2D.prototype.renderLoop = function () {
    'use strict';

    // Call `renderLoop` on next tick
    window.requestAnimationFrame(this.renderLoop.bind(this));

    // Get current time
    var timeNow = window.performance.now();

    // Calculate delta time
    var deltaTime = timeNow - this.lastDraw;

    // Call `update` and pass `deltaTime`
    this.update(deltaTime);

    // If `deltaTime` is higher than `this.interval`
    if (deltaTime > this.interval) {

        // Call `draw`
        this.draw();

        // Update `lastDraw`
        this.lastDraw = timeNow - (deltaTime % this.interval);
    }
};

// Method: clearCanvas
AG2D.prototype.clearCanvas = function () {
    'use strict';

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

    // If `this.backgroundColour` is not `transparent`
    if (this.backgroundColour !== 'transparent') {

        // Set backgroundColour
        this.context.fillStyle = this.backgroundColour;
        this.context.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    }
};

// Method: resizeCanvas
AG2D.prototype.resizeCanvas = function (width, height) {
    'use strict';

    // Set attributes `height` and `width`
    this.canvas.setAttribute('height', Math.round(height * window.devicePixelRatio));
    this.canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));

    // Set styles `height` and `width`
    this.canvas.style.height = height + 'px';
    this.canvas.style.width = width + 'px';
};

// Method: inject
AG2D.prototype.inject = function () {
    'use strict';

    // Inject canvas
    this.options.canvas = this.canvas;

    // Inject context
    this.options.context = this.context;

    // Inject resizeCanvas
    this.options.resizeCanvas = this.resizeCanvas;
};

// Method: bindEventListeners
AG2D.prototype.bindEventListeners = function () {
    'use strict';

    // Store reference to `this`
    var _this = this;

    // Add keydown listener
    window.addEventListener('keydown', function (e) {
        _this.options.keydown(e.keyCode, e);
    });

    // Add keyup listener
    window.addEventListener('keyup', function (e) {
        _this.options.keyup(e.keyCode, e);
    });

    // Add resize listener
    window.addEventListener('resize', function (e) {
        _this.options.resize(e);
    });
};

// Export `AG2D`
module.exports = AG2D;
