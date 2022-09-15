function Car() {
    // physics
    this.pos = new V2d(0,1);
    this.vel = new V2d(0,0.005);

    // lights
    this.braking = false;
    this.mainbeam = false;
    this.leftindicator = false;
    this.rightindicator = false;
    this.indicatorperiod = 1.0;
    this.indication = 0;

    // car configuration
    this.rearlights = [
        {xy: new V2d(-0.8, 0.0), z: 0.6, r: 0.1, col: '#ff0000'},
        {xy: new V2d( 0.8, 0.0), z: 0.6, r: 0.1, col: '#ff0000'},
    ];
    this.headlights = [
        {xy: new V2d(-0.8, 0.0), z: 0.6, r: 0.1, col: '#ffffff'},
        {xy: new V2d( 0.8, 0.0), z: 0.6, r: 0.1, col: '#ffffff'},
    ];
};

Car.prototype.render = function(scene) {
    if (this.vel.y > 0) {
        // moving in same direction as viewer: draw read lights
        for (l of this.rearlights) {
            scene.ctx.fillStyle = l.col;
            scene.drawCircle(this.pos.sub(l.xy), l.z, l.r);
        }
    } else {
        // moving in opposite direction to viewer: draw headlights
        for (l of this.headlights) {
            scene.ctx.fillStyle = l.col;
            scene.drawCircle(this.pos.sub(l.xy), l.z, l.r);
        }
    }
};

Car.prototype.step = function(dt) {
    this.pos = this.pos.add(this.vel.mul(dt));

    if (this.pos.y > 1000) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = 1000;

    this.indication += dt;
    while (this.indication > this.indicatorperiod)
        this.indication -= this.indicatorperiod;
};
