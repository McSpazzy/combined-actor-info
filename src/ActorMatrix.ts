import { Euler, MathUtils, Matrix4, Vector3 } from 'three';

export class ActorMatrix {
    public position?: Vector3;
    public rotation?: Vector3;

    constructor(matrix: Matrix4) {       
        var radianRotation = new Vector3().setFromEuler(new Euler().setFromRotationMatrix(matrix));
        this.rotation = new Vector3(ActorMatrix.radToDeg(radianRotation.x), ActorMatrix.radToDeg(radianRotation.y), ActorMatrix.radToDeg(radianRotation.z));
        this.position = new Vector3().setFromMatrixPosition(matrix);
    }

    // This also rounds conversions to the nearest 0, 0.5, or integer value. if less than 0.001 off.
    // Since amounts that small are most likely due to float conversion bs
    static radToDeg(rad: number): number {

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
