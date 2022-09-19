let laststep = null;
let observer;
let cars = [];
let planes = [];

let lastwidth;
let lastheight;

const lanes = [-10,-7,-4];
const speed = [60,66,80]; // mph
const catseyedist = 20; // metres
const streetlightdist = 107; // metres
const started = Date.now();
const musiclabeltime = 5000; // ms

function init() {
    observer = new Car();
    observer.pos.x = lanes[1];
    observer.vel.y = speed[1] * 1600/3600;
    observer.lanes = lanes;

    const ourlanes = lanes;
    const theirlanes = ourlanes.map((x) => -x);

    for (let i = 0; i < 100; i++) {
        const car = new Car();
        const lane = Math.floor(Math.random()*lanes.length);
        car.pos = new V2d(lanes[lane],i*25);
        const mph = speed[lane];
        car.vel = new V2d(0, mph * 1600 / 3600);
        car.lanes = ourlanes;
        if (Math.random() < 0.5) {
            car.vel.y = -car.vel.y;
            car.pos.x = -car.pos.x;
            car.lanes = theirlanes;
        }
        car.vel.y += Math.random() * 20 - 10;
        cars.push(car);
    }

    cars.push(observer);

    const canvas = document.getElementById('canvas');
    resize(canvas);

    render();
}

function render() {
    step();

    const canvas = document.getElementById('canvas');
    if (canvas.clientWidth != lastwidth || canvas.clientHeight != lastheight) {
        resize(canvas);
    }
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(1,1,1,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scene = new Scene(ctx);
    scene.viewpoint = observer.pos;
    scene.viewz = 1.0; // 1 metre off ground

    catseyes(scene, lanes[0]-1.5, '#811');
    catseyes(scene, lanes[0]+1.5, '#666');
    catseyes(scene, lanes[1]+1.5, '#666');
    catseyes(scene, lanes[2]+1.5, '#861');
    streetlights(scene, lanes[0]-3.5);
    streetlights(scene, -0.5);
    streetlights(scene, -(lanes[0]-3.5));
    streetlights(scene, 0.5);

    for (car of cars) {
        car.render(scene);
    }
    for (plane of planes) {
        plane.render(scene);
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

function catseyes(scene, x, col) {
    const numlines = Math.floor(observer.pos.y / catseyedist);
    const starty = (numlines-1)*catseyedist;
    for (let y = starty; y < observer.pos.y+100; y += catseyedist) {
        scene.drawCircle(new V2d(x-0.02, y), 0.01, 0.015, col, {no_occlude: true});
        scene.drawCircle(new V2d(x+0.02, y), 0.01, 0.015, col, {no_occlude: true});
    }
}

function streetlights(scene, x) {
    const numlines = Math.floor(observer.pos.y / streetlightdist);
    const starty = (numlines-1)*streetlightdist;
    for (let y = starty; y < observer.pos.y+3000; y += streetlightdist) {
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

    for (car of cars) {
        car.step(dt);
    }
    for (plane of planes) {
        plane.step(dt);
    }
    // delete planes that are behind the viewer
    planes = planes.filter((p) => p.pos.y > observer.pos.y);
    // add new planes occasionally
    if (Math.random() < 0.00005 && planes.length < 4) {
        let plane = new Plane();
        plane.pos = new V2d(observer.pos.x-10000-Math.random()*2000, observer.pos.y+20000+Math.random()*5000);
        plane.vel = new V2d(30+Math.random()*20, Math.random()*10-5);
        if (Math.random() < 0.5) {
            plane.pos = new V2d(-plane.pos.x, plane.pos.y);
            plane.vel.x = -plane.vel.x;
        }
        plane.z = 3000+Math.random()*2000;
        planes.push(plane);
    }
}

function resize(canvas) {
    lastwidth = canvas.width = canvas.clientWidth;
    lastheight = canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

init();

let playing = false;
document.getElementById('canvas').onclick = function() {
    if (playing) document.getElementById('audio').pause();
    else document.getElementById('audio').play();
    playing = !playing;
}
