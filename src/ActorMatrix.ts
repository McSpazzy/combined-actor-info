import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from 'three';

export class ActorMatrix {
    public position: Vector3;
    public rotation: Vector3;
    public quaternion?: Quaternion;
    public matrix?: Matrix4;

    #matrix: Matrix4;

    constructor(matrix: Matrix4) {
        this.#matrix = matrix;
        var radianRotation = new Vector3().setFromEuler(new Euler().setFromRotationMatrix(matrix));
        this.rotation = new Vector3(this.radToDeg(radianRotation.x), this.radToDeg(radianRotation.y), this.radToDeg(radianRotation.z));
        this.position = new Vector3(matrix.elements[3], matrix.elements[7], matrix.elements[11])
    }

    public static rebuildMatrix(actorMatrix: ActorMatrix): Matrix4 {
        var euler = new Euler(MathUtils.degToRad(actorMatrix.rotation.x), MathUtils.degToRad(actorMatrix.rotation.y), MathUtils.degToRad(actorMatrix.rotation.z))
        var newMatrix = new Matrix4();
        newMatrix.makeRotationFromEuler(euler);
        newMatrix.elements[3] = actorMatrix.position.x;
        newMatrix.elements[7] = actorMatrix.position.y;
        newMatrix.elements[11] = actorMatrix.position.z;
        return newMatrix;
    }

    // This also rounds conversions to the nearest 0, 0.5, or integer value. if less than 0.001 off.
    // Since amounts that small are most likely due to float conversion bs
    radToDeg(rad: number): number {

        var float = MathUtils.radToDeg(rad);

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
