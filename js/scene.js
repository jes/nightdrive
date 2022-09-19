const fullcircle = 180*Math.PI;

function Scene(ctx) {
    this.ctx = ctx;
    this.viewpoint = new V2d(0,0);
    this.viewz = 1.0;
    this.viewscale = 1200;
    this.distscale = 2;
    this.circles = [];
}

Scene.prototype.drawCircle = function(pos, z, r, col, opts) {
    let circle = this.project(pos, z, r);
    if (!circle) return;
    circle.col = col;
    circle.roady = pos.y;

    let ground = this.project(pos, 0, 0);
    circle.yground = ground.y;

    if (opts && opts.no_occlude) circle.no_occlude = true;

    this.circles.push(circle);
};

Scene.prototype.render = function() {
    // get the nearest circles first
    this.circles.sort((a,b) => {
        return a.roady - b.roady;
    });

    // work out which circles are occluded by the road
    let highestroad = this.ctx.canvas.height;
    for (circle of this.circles) {
        if (circle.yground < highestroad) highestroad = circle.yground;
        if (circle.y > highestroad && !circle.no_occlude) circle.occluded = true;
    }

    // draw the furthest circles first
    this.circles.reverse();

    for (circle of this.circles) {
        if (circle.occluded) continue;

        this.ctx.fillStyle = circle.col;
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.r, 0, fullcircle);
        this.ctx.fill();
    }
};

Scene.prototype.project = function(pos, z, r) {
    const dy = 0.1;
    const dx = bend(this.viewpoint.y+dy) - bend(this.viewpoint.y);
    const theta = Math.atan2(dx,dy);
    const posrel1 = pos.add(new V2d(bend(pos.y),0)).sub(this.viewpoint.add(new V2d(bend(this.viewpoint.y),0)));
    const posrel = new V2d(Math.cos(theta)*posrel1.x - Math.sin(theta)*posrel1.y, Math.sin(theta)*posrel1.x + Math.cos(theta)*posrel1.y);

    z = z + terrain(pos.y);

    const zrel = z - (this.viewz + terrain(this.viewpoint.y));

    // things behind the viewer are not visible
    if (posrel.y <= 0) return null;

    const dist = this.distscale * Math.sqrt(posrel.y*posrel.y + zrel*zrel);

    // things too close are not visible
    if (dist < 0.5) return null;

    const scaleratio = this.viewscale * this.ctx.canvas.width / 640;

    const screenx = (this.ctx.canvas.width/2) + scaleratio * (posrel.x / dist);
    const screeny = (this.ctx.canvas.height/2) - scaleratio * (zrel / dist);
    const screenr = scaleratio * (r / dist); // px

    return {
        x: screenx,
        y: screeny,
        r: screenr,
    };
};

function terrain(y) {
    return 10*Math.sin(y/1000) + 5*Math.cos(y/527) + 2*Math.sin(y/219);
}

function bend(y) {
    return 200*Math.sin(y/909) + 51*Math.cos(y/517) + 23*Math.sin(y/201);
}
