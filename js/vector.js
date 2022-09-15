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
