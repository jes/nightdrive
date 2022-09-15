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
    const lightheight = Math.random()*0.2+0.4;
    const lightradius = Math.random()*0.05+0.1;

    const rearlightcolour = colour(180,255, 0,50, 0,50);
    this.rearlights = [
        {xy: new V2d(-0.8, 0.0), z: lightheight, r: lightradius, col: rearlightcolour},
        {xy: new V2d( 0.8, 0.0), z: lightheight, r: lightradius, col: rearlightcolour},
    ];

    const headlightcolour = colour(180,255, 180,255, 180,255);
    this.headlights = [
        {xy: new V2d(-0.8, 0.0), z: lightheight, r: lightradius, col: headlightcolour},
        {xy: new V2d( 0.8, 0.0), z: lightheight, r: lightradius, col: headlightcolour},
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

    if (this.pos.y > 10000) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = 10000;

    this.indication += dt;
    while (this.indication > this.indicatorperiod)
        this.indication -= this.indicatorperiod;
};

function colour(r1,r2, g1,g2, b1,b2) {
    const r = r1 + Math.random() * (r2-r1);
    const g = g1 + Math.random() * (g2-g1);
    const b = b1 + Math.random() * (b2-b1);
    return `rgb(${r},${g},${b})`;
}
