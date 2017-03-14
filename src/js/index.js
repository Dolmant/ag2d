/**
 * AG2D
 *
 * @desc A 2D game engine
 */

// Dependencies
var KeyManager = require('./modules/KeyManager');
var SceneManager = require('./modules/SceneManager');
var AssetLoader = require('./modules/AssetLoader');
var Animator = require('./modules/Animator');

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
    this.waitForAssets = this.options.options.waitForAssets || false;
    this.backgroundColour = this.options.options.backgroundColour || 'transparent';
    this.size = this.options.options.size || {
        'height': 150,
        'width': 300
    };
    this.lastUpdate = window.performance.now();
    this.lastDraw = window.performance.now();
    this.interval = 1000 / this.fps;

    // Call `init`
    this.init();
};

// Method: init
AG2D.prototype.init = function () {
    'use strict';

    // Store reference to `this`
    var _this = this;

    // Call `loadModules`
    this.loadModules();

    // `waitForAssets` is `true`
    if (this.waitForAssets && this.options.options.assets) {

        // Add `assets` to `assetLoader`
        this.assetLoader.addAssets(this.options.options.assets);

        // Load assets
        this.assetLoader.loadAssets(function () {

            // Call `setUpCanvas`
            _this.setUpCanvas();
        });
    }

    // `waitForAssets` is `false
    else {

        // Call `setUpCanvas`
        this.setUpCanvas();
    }
};

// Method: loadModules
AG2D.prototype.loadModules = function () {
    'use strict';

    // Create `assetLoader`
    this.assetLoader = new AssetLoader();

    // Create `keyManager`
    this.keyManager = new KeyManager();

    // Create `sceneManager`
    this.sceneManager = new SceneManager();

    // Create `animator`
    this.animator = new Animator();
};

// Method: setUpCanvas
AG2D.prototype.setUpCanvas = function () {
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

    // Call `update` on `animator`
    this.animator.update(deltaTime);

    // Call `options.update` and pass delta time
    this.options.update(deltaTime);
};

// Method: draw
AG2D.prototype.draw = function () {
    'use strict';

    // Save `context`
    this.context.save();

    // Scale `context` by `devicePixelRatio`
    this.context.scale(window.devicePixelRatio * this.ratio, window.devicePixelRatio * this.ratio);

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

    // Store reference to current time
    var timeNow = window.performance.now();

    // Calculate delta times
    var drawDeltaTime = timeNow - this.lastDraw;
    var updateDeltaTime = timeNow - this.lastUpdate;

    // Call `update` and pass `deltaTime`
    this.update(updateDeltaTime);

    // Update `lastUpdate`
    this.lastUpdate = window.performance.now();

    // If `deltaTime` is higher than `interval`
    if (drawDeltaTime > this.interval) {

        // Call `draw`
        this.draw();

        // Update `lastDraw`
        this.lastDraw = window.performance.now() - (drawDeltaTime % this.interval);
    }
};

// Method: clearCanvas
AG2D.prototype.clearCanvas = function () {
    'use strict';

    // Clear canvas
    this.context.clearRect(0, 0, this.size.width, this.size.height);

    // If `this.backgroundColour` is not `transparent`
    if (this.backgroundColour !== 'transparent') {

        // Set backgroundColour
        this.context.fillStyle = this.backgroundColour;
        this.context.fillRect(0, 0, this.size.width, this.size.height);
    }
};

// Method: resizeCanvas
AG2D.prototype.resizeCanvas = function (width, height) {
    'use strict';

    // Calculate the ratios
    var ratio = width / height;
    var destRatio = this.size.width / this.size.height;

    // `ratio` is larger than `destRatio`
    if (ratio > destRatio) {

        // Crop width
        width = Math.floor(height * destRatio);
    }

    // `ratio` is smaller than `destRatio`
    else {

        // Crop height
        height = Math.floor(width / destRatio);
    }

    // Update `ratio`
    this.options.ratio = this.ratio = width / this.size.width;

    // Set attributes `height` and `width`
    this.canvas.setAttribute('height', Math.round(height * window.devicePixelRatio));
    this.canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));

    // Set styles `height` and `width`
    this.canvas.style.height = height + 'px';
    this.canvas.style.width = width + 'px';

    // Set canvasBounds
    this.options.canvasBounds = this.canvasBounds = this.canvas.getBoundingClientRect();
};

// Method: inject
AG2D.prototype.inject = function () {
    'use strict';

    // Inject `canvas`
    this.options.canvas = this.canvas;

    // Inject `context`
    this.options.context = this.context;

    // Inject `assetLoader`
    this.options.assetLoader = this.assetLoader;

    // Inject `keyManager`
    this.options.keyManager = this.keyManager;

    // Inject `sceneManager`
    this.options.sceneManager = this.sceneManager;

    // Inject `animator`
    this.options.animator = this.animator;

    // Inject `resizeCanvas`
    this.options.resizeCanvas = this.resizeCanvas.bind(this);
};

// Method: bindEventListeners
AG2D.prototype.bindEventListeners = function () {
    'use strict';

    // Store reference to `this`
    var _this = this;

    // Add keydown listener
    window.addEventListener('keydown', function (e) {

        // Call `keyManager.keyDown`
        _this.keyManager.keyDown(e);
    });

    // Add keyup listener
    window.addEventListener('keyup', function (e) {

        // Call `keyManager.keyUp`
        _this.keyManager.keyUp(e);
    });

    // Add resize listener
    window.addEventListener('resize', function (e) {

        // Check for `resize`
        if (_this.options.resize) {

            // Call `resize`
            _this.options.resize(e);
        }
    });
};

// Export `AG2D`
module.exports = AG2D;