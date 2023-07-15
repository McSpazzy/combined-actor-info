import { Matrix4, Quaternion, Vector3 } from 'three';
export declare class ActorMatrix {
    #private;
    position: Vector3;
    rotation: Vector3;
    quaternion?: Quaternion;
    matrix?: Matrix4;
    constructor(matrix: Matrix4);
    static rebuildMatrix(actorMatrix: ActorMatrix): Matrix4;
    radToDeg(rad: number): number;
}
