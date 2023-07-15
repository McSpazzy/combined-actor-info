"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorMatrix = void 0;
const three_1 = require("three");
class ActorMatrix {
    position;
    rotation;
    quaternion;
    matrix;
    #matrix;
    constructor(matrix) {
        this.#matrix = matrix;
        var radianRotation = new three_1.Vector3().setFromEuler(new three_1.Euler().setFromRotationMatrix(matrix));
        this.rotation = new three_1.Vector3(this.radToDeg(radianRotation.x), this.radToDeg(radianRotation.y), this.radToDeg(radianRotation.z));
        this.position = new three_1.Vector3(matrix.elements[3], matrix.elements[7], matrix.elements[11]);
    }
    static rebuildMatrix(actorMatrix) {
        var euler = new three_1.Euler(three_1.MathUtils.degToRad(actorMatrix.rotation.x), three_1.MathUtils.degToRad(actorMatrix.rotation.y), three_1.MathUtils.degToRad(actorMatrix.rotation.z));
        var newMatrix = new three_1.Matrix4();
        newMatrix.makeRotationFromEuler(euler);
        newMatrix.elements[3] = actorMatrix.position.x;
        newMatrix.elements[7] = actorMatrix.position.y;
        newMatrix.elements[11] = actorMatrix.position.z;
        return newMatrix;
    }
    // This also rounds conversions to the nearest 0, 0.5, or integer value. if less than 0.001 off.
    // Since amounts that small are most likely due to float conversion bs
    radToDeg(rad) {
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
