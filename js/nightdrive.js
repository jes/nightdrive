let laststep = null;
let observer = new Car();
let cars = [];
let lanes = [-3,0,3];

function init() {
    for (let i = 0; i < 20; i++) {
        const car = new Car();
        car.pos = new V2d(lanes[Math.floor(Math.random()*lanes.length)],i*50);
        car.vel = new V2d(0,0.002+i*0.002);
        if (Math.random() < 0.5) {
            car.vel.y = -car.vel.y;
            car.pos.x += 12;
        }
        cars.push(car);
    }

    render();
}

function render() {
    step();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,640,480);

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

    const dt = now - laststep;
    laststep = now;

    observer.step(dt);

    for (car of cars) {
        car.step(dt);
    }
}

init();
