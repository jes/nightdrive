let laststep = null;
let observer;
let cars = [];

const lanes = [-10,-7,-4];
const speed = [40,70,100]; // mph
const catseyedist = 40; // metres
const streetlightdist = 107; // metres
const started = Date.now();
const musiclabeltime = 5000; // ms

function init() {
    observer = new Car();
    observer.pos.x = lanes[1];
    observer.vel.y = speed[1] * 1600/3600;

    for (let i = 0; i < 400; i++) {
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
    streetlights(scene, lanes[0]-3.5);
    streetlights(scene, -0.5);
    streetlights(scene, -(lanes[0]-3.5));
    streetlights(scene, 0.5);

    for (car of cars) {
        car.render(scene);
    }

    const label = document.getElementById('clickformusic');
    label.style.top = `${canvas.height/2 - 100}px`;
    label.style.left = `${canvas.width/2 - label.clientWidth/2}px`;

    const time = Date.now() - started;
    if (time < musiclabeltime) {
        const col = (musiclabeltime-time) * (200/musiclabeltime);
        label.style.color = `rgb(${col}, ${col}, ${col})`;
    } else {
        label.style.display = 'none';
    }

    scene.render();

    window.requestAnimationFrame(render);
}

function catseyes(scene, x) {
    const numlines = Math.floor(observer.pos.y / catseyedist);
    const starty = (numlines-1)*catseyedist;
    for (let y = starty; y < observer.pos.y+100; y += catseyedist) {
        scene.drawCircle(new V2d(x-0.02, y), 0.01, 0.01, '#444', {no_occlude: true});
        scene.drawCircle(new V2d(x+0.02, y), 0.01, 0.01, '#444', {no_occlude: true});
    }
}

function streetlights(scene, x) {
    const numlines = Math.floor(observer.pos.y / streetlightdist);
    const starty = (numlines-1)*streetlightdist;
    for (let y = starty; y < observer.pos.y+5000; y += streetlightdist) {
        const col = `rgb(255,255,${150+((99*x)+(31*y))%101})`;
        scene.drawCircle(new V2d(x, y), 5, 0.2, col);
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
