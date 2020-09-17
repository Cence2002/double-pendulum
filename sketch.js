let canvas, gui;

function setupGUI() {
    gui = new dat.GUI({autoPlace: false, width: 250});
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = 'absolute';
    gui.closed = true;
    gui.updateDisplay();
}

//////////////////////////////////////////////////

let params = {
    save: () => saveCanvas('frame-' + nf(frameCount, 5) + '.png'),
    N: 50,
    T: 5,
    S: 3,
    m1: 4,
    m2: 1,
    l1: 200,
    l2: 150,
    a1: 1.2995,
    a2: 2,
    v1: 0,
    v2: 0,
    g: 0.5
};

class Pendulum {
    constructor(m1, m2, l1, l2, a1, a2, v1, v2, g) {
        this.m1 = m1;
        this.m2 = m2;
        this.l1 = l1;
        this.l2 = l2;
        this.a1 = a1;
        this.a2 = a2;
        this.v1 = v1;
        this.v2 = v2;
        this.g = g;
    }

    step(t) {
        for (let i = 0; i < t; i++) {
            let dv1 = (-this.g * (2 * this.m1 + this.m2) * sin(this.a1) - this.m2 * this.g * sin(this.a1 - 2 * this.a2) - 2 * sin(this.a1 - this.a2) * this.m2 * (this.v2 * this.v2 * this.l2 + this.v1 * this.v1 * this.l1 * cos(this.a1 - this.a2))) /
                (this.l1 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.a1 - 2 * this.a2)));
            let dv2 = (2 * sin(this.a1 - this.a2) * (this.v1 * this.v1 * this.l1 * (this.m1 + this.m2) + this.g * (this.m1 + this.m2) * cos(this.a1) + this.v2 * this.v2 * this.l2 * this.m2 * cos(this.a1 - this.a2))) /
                (this.l2 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.a1 - 2 * this.a2)));
            this.v1 += dv1 / t;
            this.v2 += dv2 / t;
            this.a1 += this.v1 / t;
            this.a2 += this.v2 / t;
        }
    }

    show() {
        let x1 = this.l1 * sin(this.a1),
            y1 = this.l1 * cos(this.a1),
            x2 = x1 + this.l2 * sin(this.a2),
            y2 = y1 + this.l2 * cos(this.a2);
        stroke(0, 0, 1, 0.1);
        line(0, 0, x1, y1);
        stroke(0, 0, 1, 0.5);
        line(x1, y1, x2, y2);
        noStroke();
        fill(0.3, 1, 0, 0.9);
        circle(x1, y1, 5);
        circle(x2, y2, 6);
    }
}

let p = [];

function setup() {
    canvas = createCanvas(800, 500);
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    setupGUI();
    windowResized();
    pixelDensity(2);
    colorMode(RGB, 1);
    background(0);
    frameRate(60);

    restart();

    gui.add(params, 'save').name('Save canvas');
    let visual_folder = gui.addFolder('Visual settings');
    visual_folder.add(params, 'N', 1, 100, 1).name('# of Pendulums').onChange(restart);
    visual_folder.add(params, 'T', 1, 10, 1).name('Accuracy').onChange(restart);
    visual_folder.add(params, 'S', 1, 5, 1).name('Quality').onChange(restart);
    let pendulum_folder = gui.addFolder('Pendulum settings');
    pendulum_folder.add(params, 'm1', 1, 10, 1).name('Mass 1').onChange(restart);
    pendulum_folder.add(params, 'm2', 1, 10, 1).name('Mass 2').onChange(restart);
    pendulum_folder.add(params, 'l1', 50, 200).name('Length 1').onChange(restart);
    pendulum_folder.add(params, 'l2', 50, 200).name('Length 2').onChange(restart);
    pendulum_folder.add(params, 'a1', -2, 2).name('Acceleration 1').onChange(restart);
    pendulum_folder.add(params, 'a2', -2, 2).name('Acceleration 2').onChange(restart);
    pendulum_folder.add(params, 'v1', -2, 2).name('Velocity 1').onChange(restart);
    pendulum_folder.add(params, 'v2', -2, 2).name('Velocity 2').onChange(restart);
    pendulum_folder.add(params, 'g', 0, 1).name('Gravity').onChange(restart);
}

function draw() {
    background(0, 0.4);
    translate(width / 2, 100);
    for (let i = 0; i < params.S; i++) {
        p.forEach(p => {
            p.step(params.T);
            p.show();
        })
    }
    noStroke();
    fill(0, 1, 0);
    circle(0, 0, 10);

    clog(frameRate());
}

function restart() {
    p = [];
    for (let i = 0; i < params.N; i++) {
        p[i] = new Pendulum(params.m1, params.m2, params.l1, params.l2, params.a1, params.a2 + map(i, 0, params.N, 0, 0.0001), params.v1 / 100, params.v2 / 100, params.g / (params.S * params.S));
    }
}

function windowResized() {
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    gui.domElement.style.left = canvas.x + canvas.width - gui.width + 'px';
    gui.domElement.style.top = canvas.y + 'px';
}

function clog(object) {
    console.log(object);
}
