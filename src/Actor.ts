import { Matrix4 } from 'three';
import { ActorMatrix } from './ActorMatrix';

export class Actor {

    public Name: string;
    public PrimaryMatrix: ActorMatrix;
    public SecondaryMatrix: ActorMatrix;
    public TertiaryMatrix: number[];

    public Unknown1: number;
    public Unknown2: number;
    public BondStartIndex: number; // Usually self?
    public BondEndIndex: number; // Whatever item glued to
    public State: number; // Most Likely. Contains spring state for example;

    constructor(name: string, primaryMatrix: Matrix4, secondaryMatrix: Matrix4) {
        this.Name = name;
        this.PrimaryMatrix = new ActorMatrix(primaryMatrix);
        this.SecondaryMatrix = new ActorMatrix(secondaryMatrix);
        this.TertiaryMatrix = [];
        this.Unknown1 = 0;
        this.Unknown2 = 0;
        this.BondStartIndex = 0;
        this.BondEndIndex = 0;
        this.State = 0;
    }
}
