import { Box3, Matrix4, Vector3 } from 'three';
import { Actor } from './Actor';
import { ActorMatrix } from './ActorMatrix';
export declare class CombinedActorInfo {
    unknownVal: number;
    entryCount: number;
    actors: Actor[];
    boundingBox?: Box3;
    unknownData: number[];
    constructor();
    static FromSaveFileArrayBuffer(saveBuffer: ArrayBufferLike, index: number): CombinedActorInfo;
    static FromSaveFileArrayBuffer(saveBuffer: ArrayBufferLike, indexes: number[]): CombinedActorInfo[];
    static FromJson(jsonString: string): CombinedActorInfo;
    static FromArrayLike(arrayLike: Iterable<number>): CombinedActorInfo;
    static FromArrayBuffer(buffer: ArrayBufferLike): CombinedActorInfo;
    static ReadMatrix4X3(buffer: DataView, offset: number): Matrix4;
    static ToJson(cai: CombinedActorInfo, pretty?: boolean): string;
    static Vector3DegToRad(vector3: Vector3): Vector3;
    static Matrix4ToWritableArray(matrix4?: Matrix4): number[];
    static RebuildMatrix(actorMatrix: ActorMatrix): Matrix4;
    static WriteMatrix(view: DataView, offset: number, matrix: Matrix4): void;
    static ToArrayBuffer(cai: CombinedActorInfo): ArrayBufferLike;
}
