function Scene(ctx) {
    this.ctx = ctx;
    this.viewpoint = new V2d(0,0);
    this.viewz = 1.0;
    this.viewscale = 500;
    this.distscale = 0.5;
    this.viewcentre = new V2d(320,240);
}

Scene.prototype.drawCircle = function(pos, z, r) {
    [screenx, screeny, screenr] = this.project(pos, z, r);

    this.ctx.beginPath();
    this.ctx.arc(screenx, screeny, screenr, 0, 180*Math.PI);
    this.ctx.fill();
};

Scene.prototype.project = function(pos, z, r) {
    const posrel = pos.sub(this.viewpoint);
    const zrel = z - this.viewz;

    // things behind the viewer are not visible
    if (posrel.y <= 0) return [null, null, null];

    const dist = this.distscale * Math.sqrt(posrel.x*posrel.x + posrel.y*posrel.y + zrel*zrel);

    // things too close are not visible
    if (dist < 0.5) return [null, null, null];

    const screenx = this.viewcentre.x + this.viewscale * (posrel.x / dist);
    const screeny = this.viewcentre.y - this.viewscale * (zrel / dist);
    const screenr = this.viewscale * (r / dist); // px
    return [screenx, screeny, screenr];
};
