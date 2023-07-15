import { Box3, Matrix4 } from 'three';
import { Actor } from './Actor';
export declare class CombinedActorInfo {
    entryCount: number;
    actors: Actor[];
    boundingBox?: Box3;
    unknownData: number[];
    constructor();
    static FromJson(jsonString: string): CombinedActorInfo;
    static FromArrayLike(arrayLike: Iterable<number>): CombinedActorInfo;
    static FromArrayBuffer(buffer: ArrayBufferLike): CombinedActorInfo;
    static ReadMatrix4X4(buffer: DataView, offset: number): Matrix4;
    ToJson(pretty?: boolean): string;
    static ToArrayBuffer(cai: CombinedActorInfo): ArrayBufferLike;
}
