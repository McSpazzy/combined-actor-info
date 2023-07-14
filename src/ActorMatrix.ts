import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

export class ActorMatrix {
    public position?: Vector3;
    public rotation: Vector3;
    public quaternion: Quaternion;
    public matrix: Matrix4;

    constructor(matrix: Matrix4) {
        this.matrix = matrix;
        this.quaternion = new Quaternion().setFromRotationMatrix(matrix);
        this.rotation = new Vector3().setFromEuler(new Euler().setFromRotationMatrix(matrix));
        this.position = new Vector3(matrix.elements[3], matrix.elements[7], matrix.elements[11])
    }
}
