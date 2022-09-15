let laststep = null;
let observer = new Car();
let cars = [];
let lanes = [-3,0,3];

function init() {
    for (let i = 0; i < 200; i++) {
        const car = new Car();
        car.pos = new V2d(lanes[Math.floor(Math.random()*lanes.length)],i*50);
        const mph = Math.random()*40 + 50;
        car.vel = new V2d(0, mph * 1600 / 3600);
        if (Math.random() < 0.5) {
            car.vel.y = -car.vel.y;
            car.pos.x += 14;
        }
        cars.push(car);
    }

    observer.vel.y = 70 * 1600/3600; // 70 mph observer

    render();
}

function render() {
    step();

    const canvas = document.getElementById('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const scene = new Scene(ctx);
    scene.viewpoint = observer.pos;
    scene.viewz = 1.0; // 1 metre off ground

    for (car of cars) {
        car.render(scene);
    }

    window.requestAnimationFrame(render);
}

function step() {
    const now = Date.now();
    if (!laststep) {
        laststep = now;
        return;
    }

    const dt = (now - laststep) / 1000;
    laststep = now;

    observer.step(dt);

    for (car of cars) {
        car.step(dt);
    }
}

init();
