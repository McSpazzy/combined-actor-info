"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorMatrix = void 0;
const three_1 = require("three");
class ActorMatrix {
    position;
    rotation;
    quaternion;
    matrix;
    constructor(matrix) {
        this.matrix = matrix;
        this.quaternion = new three_1.Quaternion().setFromRotationMatrix(matrix);
        this.rotation = new three_1.Vector3().setFromEuler(new three_1.Euler().setFromRotationMatrix(matrix));
        this.position = new three_1.Vector3(matrix.elements[3], matrix.elements[7], matrix.elements[11]);
    }
}
exports.ActorMatrix = ActorMatrix;
