let laststep = null;
let observer;
let cars = [];
let lanes = [-10,-7,-4];
let speed = [40,70,100]; // mph
let catseyedist = 40; // metres
let started = Date.now();

function init() {
    observer = new Car();
    observer.pos.x = lanes[1];
    observer.vel.y = speed[1] * 1600/3600;

    for (let i = 0; i < 40; i++) {
        const car = new Car();
        const lane = Math.floor(Math.random()*lanes.length);
        car.pos = new V2d(lanes[lane],i*25);
        const mph = speed[lane];
        car.vel = new V2d(0, mph * 1600 / 3600);
        if (Math.random() < 0.5) {
            car.vel.y = -car.vel.y;
            car.pos.x = -car.pos.x;
        }
        cars.push(car);
    }

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

    catseyes(scene, lanes[0]-1.5);
    for (lanex of lanes) {
        catseyes(scene, lanex+1.5);
    }

    for (car of cars) {
        car.render(scene);
    }

    const label = document.getElementById('clickformusic');
    label.style.top = `${canvas.height/2 - 100}px`;
    label.style.left = `${canvas.width/2 - label.clientWidth/2}px`;

    const time = Date.now() - started;
    if (time < 3000) {
        const col = (3000-time) * (200/3000);
        label.style.color = `rgb(${col}, ${col}, ${col})`;
    } else {
        label.style.display = 'none';
    }

    window.requestAnimationFrame(render);
}

function catseyes(scene, x) {
    const numlines = Math.floor(observer.pos.y / catseyedist);
    const starty = (numlines-1)*catseyedist;
    for (let y = starty; y < observer.pos.y+50; y += catseyedist) {
        scene.ctx.fillStyle = '#444';
        scene.drawCircle(new V2d(x-0.02, y), 0, 0.01);
        scene.drawCircle(new V2d(x+0.02, y), 0, 0.01);
    }
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

let playing = false;
document.getElementById('canvas').onclick = function() {
    if (playing) document.getElementById('audio').pause();
    else document.getElementById('audio').play();
    playing = !playing;
}
