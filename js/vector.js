function V2d(x,y) {
    this.x = x;
    this.y = y;
}

V2d.prototype.add = function(v) {
    return new V2d(this.x + v.x, this.y + v.y);
};

V2d.prototype.sub = function(v) {
    return new V2d(this.x - v.x, this.y - v.y);
};

V2d.prototype.mul = function(k) {
    return new V2d(this.x * k, this.y * k);
};

V2d.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

V2d.prototype.angle = function() {
    return Math.atan2(this.x, this.y);
};

V2d.prototype.rotate = function(theta) {
    return new V2d(Math.cos(theta)*this.x - Math.sin(theta)*this.y, Math.sin(theta)*this.x + Math.cos(theta)*this.y);
};
