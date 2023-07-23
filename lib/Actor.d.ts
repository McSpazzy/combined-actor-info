import { ActorMatrix } from './ActorMatrix';
import { Matrix4 } from './threeish';
export declare class Actor {
    Index: number;
    Name: string;
    SubName?: string;
    Main: ActorMatrix;
    Sub?: ActorMatrix;
    Sub2?: ActorMatrix;
    fuseInfo: number;
    flag: number;
    constructor(name: string, primaryMatrix: Matrix4, secondaryMatrix: Matrix4, tertiaryMatrix: Matrix4);
}
