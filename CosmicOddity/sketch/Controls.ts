class Controls {
    frameRate: number;
    particles: number;
    renderSpheres: () => void;
    saveImg: () => void;
    stopLoop: () => void;
    startLoop: () => void;
    constructor() {
        this.frameRate = 0;
        this.particles = 0;
        this.renderSpheres = function () {
            spheres.forEach(sphere => {
                sphere.drawSphere();
            });
            image(g, 0, 0, width, height);
        };
        this.saveImg = function () {
            saveCanvas(g, "canvas.png");
        };
        this.stopLoop = function () {
            noLoop();
        };
        this.startLoop = function () {
            loop();
        };

    };
}

function updateGui() {
    controls.frameRate = frameRate();
    controls.particles = particles.length;
}

function setupGui() {
    var perfControls = gui.addFolder("Performance");
    perfControls.open();
    perfControls.add(controls, "frameRate").name("Framerate").listen();
    perfControls.add(controls, "particles").name("Particles").listen();

    var perfControls = gui.addFolder("Misc");
    perfControls.open();
    perfControls.add(controls, "renderSpheres").name("Render Spheres").listen();
    perfControls.add(controls, "saveImg").name("Save Image").listen();
    perfControls.add(controls, "startLoop").name("Start Loop").listen();
    perfControls.add(controls, "stopLoop").name("Stop Loop").listen();
}