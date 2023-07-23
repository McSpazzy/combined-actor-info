import { Euler, Matrix4, Vector3 } from "./threeish";

export class ActorMatrix {
    public position?: Vector3;
    public rotation?: Vector3;

    constructor(matrix: Matrix4) {
        var radianRotation = new Vector3().setFromEuler(new Euler().setFromRotationMatrix(matrix));
        this.rotation = radianRotation.radToDeg();
        this.position = new Vector3().setFromMatrixPosition(matrix);
    }
}
