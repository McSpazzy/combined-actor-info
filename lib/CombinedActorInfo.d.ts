import { Box3, Matrix4 } from 'three';
import { Actor } from './Actor';
export declare class CombinedActorInfo {
    entryCount: number;
    actors: Actor[];
    boundingBox?: Box3;
    unknownData: number[];
    constructor();
    static FromArrayLike(arrayLike: Iterable<number>): CombinedActorInfo;
    static FromArrayBuffer(buffer: ArrayBufferLike): CombinedActorInfo;
    static ReadMatrix4X4(buffer: DataView, offset: number): Matrix4;
}
