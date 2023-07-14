import { ActorMatrix } from './ActorMatrix';

export class Actor {

    public Name: string;
    public PrimaryMatrix?: ActorMatrix;
    public SecondaryMatrix?: ActorMatrix;
    public TertiaryMatrix?: number[];

    public Unknown1?: number;
    public Unknown2?: number;
    public BondStartIndex?: number; // Usually self?
    public BondEndIndex?: number; // Whatever item glued to
    public State?: number; // Most Likely. Contains spring state for example;

    constructor(name: string) {
        this.Name = name;
    }
}
