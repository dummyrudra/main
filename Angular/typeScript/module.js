"use strict";
exports.__esModule = true;
exports.Point = void 0;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
        this.x = x ? x : 1;
        this.y = y;
    }
    Point.prototype.drawPoint = function () {
        console.log("X: ".concat(this.x, ", Y: ").concat(this.y));
    };
    return Point;
}());
exports.Point = Point;
