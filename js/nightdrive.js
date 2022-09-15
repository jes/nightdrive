let laststep = null;
let observer = new Car();

function render() {
    step();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,640,480);

    const scene = new Scene(ctx);
    scene.viewpoint = new V2d(0,0); // standing at origin
    scene.viewz = 1.0; // 1 metre off ground

    observer.render(scene);

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
}

render();
