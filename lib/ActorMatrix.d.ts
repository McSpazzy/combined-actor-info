import { Matrix4, Vector3 } from 'three';
export declare class ActorMatrix {
    position?: Vector3;
    rotation?: Vector3;
    constructor(matrix: Matrix4);
    static radToDeg(rad: number): number;
}
