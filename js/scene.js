function Scene(ctx) {
    this.ctx = ctx;
    this.viewpoint = new V2d(0,0);
    this.viewz = 1.0;
    this.viewscale = 500;
    this.distscale = 1;
}

Scene.prototype.drawCircle = function(pos, z, r) {
    [screenx, screeny, screenr] = this.project(pos, z, r);

    this.ctx.beginPath();
    this.ctx.arc(screenx, screeny, screenr, 0, 180*Math.PI);
    this.ctx.fill();
};

Scene.prototype.project = function(pos, z, r) {
    const posrel = pos.sub(this.viewpoint);

    z = z + terrain(pos.y);

    const zrel = z - (this.viewz + terrain(this.viewpoint.y));

    // things behind the viewer are not visible
    if (posrel.y <= 0) return [null, null, null];

    const dist = this.distscale * Math.sqrt(posrel.x*posrel.x + posrel.y*posrel.y + zrel*zrel);

    // things too close are not visible
    if (dist < 0.5) return [null, null, null];

    const scaleratio = this.viewscale * this.ctx.canvas.width / 640;

    const screenx = (this.ctx.canvas.width/2) + scaleratio * (posrel.x / dist);
    const screeny = (this.ctx.canvas.height/2) - scaleratio *(zrel / dist);
    const screenr = scaleratio * (r / dist); // px

    return [screenx, screeny, screenr];
};

function terrain(y) {
    return 10*Math.sin(y/1000) + 5*Math.cos(y/527) + 2*Math.sin(y/219);
}
