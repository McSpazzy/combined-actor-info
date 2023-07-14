import { ActorMatrix } from './ActorMatrix';
export declare class Actor {
    Name: string;
    PrimaryMatrix?: ActorMatrix;
    SecondaryMatrix?: ActorMatrix;
    TertiaryMatrix?: number[];
    Unknown1?: number;
    Unknown2?: number;
    BondStartIndex?: number;
    BondEndIndex?: number;
    State?: number;
    constructor(name: string);
}
