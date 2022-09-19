function Plane() {
    // physics
    this.pos = new V2d(0,0);
    this.vel = new V2d(25,15);
    this.z = 3000;
    this.t = 0;
    this.period = 1.2+Math.random()*0.2;
};

Plane.prototype.render = function(scene) {
    // red when moving left, green when moving right
    const col = this.vel.x > 0 ? '#585' : '#855';

    if (this.t > this.period/2)
        scene.drawCircle(this.pos, this.z, 12, col);
};

Plane.prototype.step = function(dt) {
    this.pos = this.pos.add(this.vel.mul(dt));

    this.t += dt;
    while (this.t > this.period)
        this.t -= this.period;
};
