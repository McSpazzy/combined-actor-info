"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorMatrix = void 0;
const threeish_1 = require("./threeish");
class ActorMatrix {
    position;
    rotation;
    constructor(matrix) {
        var radianRotation = new threeish_1.Vector3().setFromEuler(new threeish_1.Euler().setFromRotationMatrix(matrix));
        this.rotation = radianRotation.radToDeg();
        this.position = new threeish_1.Vector3().setFromMatrixPosition(matrix);
    }
}
exports.ActorMatrix = ActorMatrix;
