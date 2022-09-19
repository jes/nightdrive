function Car() {
    // physics
    this.pos = new V2d(0,1);
    this.vel = new V2d(0,0.005);

    // lights
    this.braking = false;
    this.mainbeam = false;
    this.leftindicator = false;
    this.rightindicator = false;
    this.indicatorperiod = 0.9 + Math.random()*0.2; // seconds
    this.indication = 0;
    this.lanes = [0]; // x coordinates of lanes
    this.lane = 0;

    // car configuration
    const lightheight = Math.random()*0.2+0.4;
    const lightwidth = Math.random()*0.3+1.3;
    const lightradius = Math.random()*0.05+0.1;

    const rearlightcolour = colour(180,255, 0,50, 0,50);
    this.rearlights = [
        {xy: new V2d(-lightwidth/2, 0.0), z: lightheight, r: lightradius, col: rearlightcolour},
        {xy: new V2d( lightwidth/2, 0.0), z: lightheight, r: lightradius, col: rearlightcolour},
    ];

    const headlightcolour = colour(180,255, 180,255, 180,255);
    this.headlights = [
        {xy: new V2d(-lightwidth/2, 0.0), z: lightheight, r: lightradius, col: headlightcolour},
        {xy: new V2d( lightwidth/2, 0.0), z: lightheight, r: lightradius, col: headlightcolour},
    ];

    const indicatorcolour = colour(180,255, 100,200, 0,100);
    const indicatorwidth = lightwidth + 0.2 + Math.random()*0.1;
    const indicatorheight = lightheight - 0.1 + Math.random()*0.2;
    const indicatorradius = lightradius - (0.04 + Math.random()*0.03);
    this.leftindicatorlights = [
        {xy: new V2d(-indicatorwidth/2, 0.0), z: indicatorheight, r: indicatorradius, col: indicatorcolour},
    ];
    this.rightindicatorlights = [
        {xy: new V2d( indicatorwidth/2, 0.0), z: indicatorheight, r: indicatorradius, col: indicatorcolour},
    ];
};

Car.prototype.render = function(scene) {
    if (this.vel.y > 0) {
        // moving in same direction as viewer: draw rearlights
        this.drawLights(scene, this.rearlights);
    } else {
        // moving in opposite direction to viewer: draw headlights
        this.drawLights(scene, this.headlights);
    }

    if (this.leftindicator && this.indication > (this.indicatorperiod/2)) this.drawLights(scene, this.leftindicatorlights);
    if (this.rightindicator && this.indication > (this.indicatorperiod/2)) this.drawLights(scene, this.rightindicatorlights);
};

Car.prototype.drawLights = function(scene, lights) {
    for (l of lights) {
        scene.drawCircle(this.pos.add(l.xy), l.z, l.r, l.col);
    }
};

Car.prototype.step = function(dt) {
    this.pos = this.pos.add(this.vel.mul(dt));

    this.indication += dt;
    while (this.indication > this.indicatorperiod)
        this.indication -= this.indicatorperiod;

    const wrapy = 2500;
    while (this.pos.y > observer.pos.y+wrapy && this.vel.y > observer.vel.y)
        this.pos.y -= wrapy;
    while (this.pos.y < observer.pos.y && this.vel.y < observer.vel.y)
        this.pos.y += wrapy;

    // which lane are we in?
    let mylane = 0;
    for (let i = 0; i < this.lanes.length; i++) {
        if (Math.abs(this.pos.x-this.lanes[i]) < (Math.abs(this.pos.x-this.lanes[mylane]))) mylane = i;
    }
    this.lane = mylane;

    const k = Math.sign(this.vel.y);

    if (this.changelane) {
        const m = this.targetlane - this.sourcelane;

        if (this.lane == this.targetlane) {
            // decelerate in x
            this.vel = new V2d(this.vel.x-k*m*0.7*dt, this.vel.y);
        } else {
            // accelerate in x
            this.vel = new V2d(this.vel.x+k*m*0.8*dt, this.vel.y);
        }

        // once we reach the centre of the target lane, snap to centre and stop changing lane
        if (Math.sign(this.pos.x-this.lanes[this.targetlane]) != Math.sign(this.pos.x+this.vel.x*4*dt - this.lanes[this.targetlane])) {
            this.lane = this.targetlane;
            this.pos = new V2d(this.lanes[this.lane], this.pos.y);
            this.vel = new V2d(0, this.vel.y);
            this.changelane = false;
        }
    }

    const collision_secs = 7.0;

    const min_clearance = 2.0; // metres

    let leftlanesafe = this.lane > 0;

    loop:
    //for (car of cars) {
    for (let j = 0; j < cars.length; j++) {
        const car = cars[j];
        if (car == this) continue;
        if (Math.sign(car.vel.y*this.vel.y) == -1) continue;

        for (let i = -1; i <= 1; i++) {
            const yoff = i*wrapy;

            // if we're not in the fast lane, and we're behind this car, and it's in our lane, and we're going faster, and we'll hit it within N seconds, change lanes
            if (Math.sign(car.vel.y)==k && this.lane < this.lanes.length-1 && this.lane<=car.lane && k*(this.pos.y+yoff) < k*car.pos.y && k*this.vel.y > k*car.vel.y && k*(this.pos.y+yoff+this.vel.y*collision_secs+min_clearance) > k*(car.pos.y+car.vel.y*collision_secs)) {
                this.changelane = true;
                this.sourcelane = this.lane;
                this.targetlane = this.lane+1;
                break loop;
            }

            // the left lane is not safe if there is a car in it that we'd hit within 3N seconds
            if (Math.sign(car.vel.y)==k && car.lane==this.lane-1 && k*(this.pos.y+yoff) < k*car.pos.y && k*this.vel.y > k*car.vel.y && k*(this.pos.y+yoff+this.vel.y*collision_secs*3) > k*(car.pos.y+car.vel.y*collision_secs*3+min_clearance)) {
                leftlanesafe = false;
            }
        }
    }

    // move left if we're not changing lane and the left lane is safe
    if (!this.changelane && leftlanesafe) {
        this.changelane = true;
        this.sourcelane = this.lane;
        this.targetlane = this.lane-1;
    }

    if (this.changelane) {
        this.rightindicator = this.targetlane > this.sourcelane;
        this.leftindicator = this.targetlane < this.sourcelane;
    } else {
        this.indication = 0;
        this.leftindicator = false;
        this.rightindicator = false;
    }
};

function colour(r1,r2, g1,g2, b1,b2) {
    const r = r1 + Math.random() * (r2-r1);
    const g = g1 + Math.random() * (g2-g1);
    const b = b1 + Math.random() * (b2-b1);
    return `rgb(${r},${g},${b})`;
}
