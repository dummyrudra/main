"use strict";
exports.__esModule = true;
exports.LikeComponent = void 0;
var LikeComponent = /** @class */ (function () {
    function LikeComponent(likesCount, isLiked) {
        this.likesCount = likesCount;
        this.isLiked = isLiked;
    }
    LikeComponent.prototype.like = function (isLiked) {
        this.likesCount += isLiked ? -1 : 1;
        this.isLiked = !isLiked;
    };
    LikeComponent.prototype.showLike = function () {
        console.log("Total Like:" + this.likesCount);
    };
    return LikeComponent;
}());
exports.LikeComponent = LikeComponent;
