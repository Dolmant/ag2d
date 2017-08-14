/**
 * Modules: Scene
 */

// Class: Scene
class Scene {

    // Constructor
    constructor (name = 'Default') {

        // Set `name`
        this.name = name;

        // Set `enteredCount` and `exitedCount`
        this.enterCount = 0;
        this.exitCount = 0;

        console.log(`Init: ${this.name}`);
    }

    // Method: render
    render () {
        console.log(`Render: ${this.name}`);
    }

    // Method: sceneEnter
    sceneEnter () {
        console.log(`Scene Enter: ${this.name}`);
    }

    // Method: sceneExit
    sceneExit () {
        console.log(`Scene Exit: ${this.name}`);
    }

    // Method: update
    update () {
        console.log(`Update: ${this.name}`);
    }
}

// Export `Scene`
export default Scene;