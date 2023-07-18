"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorMatrix = void 0;
const three_1 = require("three");
class ActorMatrix {
    position;
    rotation;
    constructor(matrix) {
        var radianRotation = new three_1.Vector3().setFromEuler(new three_1.Euler().setFromRotationMatrix(matrix));
        this.rotation = new three_1.Vector3(ActorMatrix.radToDeg(radianRotation.x), ActorMatrix.radToDeg(radianRotation.y), ActorMatrix.radToDeg(radianRotation.z));
        this.position = new three_1.Vector3().setFromMatrixPosition(matrix);
    }
    static Vector3DegToRad(vector3) {
        return new three_1.Vector3(three_1.MathUtils.degToRad(vector3.x), three_1.MathUtils.degToRad(vector3.y), three_1.MathUtils.degToRad(vector3.z));
    }
    // This also rounds conversions to the nearest 0, 0.5, or integer value. if less than 0.001 off.
    // Since amounts that small are most likely due to float conversion bs
    static radToDeg(rad) {
        var float = three_1.MathUtils.radToDeg(rad);
        if (Math.abs(float) < 1E-3) {
            return 0;
        }
        if (Math.abs(float - 0.5) < 1E-3) {
            return 0.5;
        }
        if (Math.abs(float - Math.round(float)) < 1E-3) {
            return Math.round(float);
        }
        return float;
    }
}
exports.ActorMatrix = ActorMatrix;
