import { Matrix4 } from 'three';
import { ActorMatrix } from './ActorMatrix';

export class Actor {

    public Name: string;
    public SubName?: string;

    public Main: ActorMatrix;
    public Sub?: ActorMatrix;
    public Sub2?: ActorMatrix;

    public fuseInfo: number = 0;
    public flag: number = 0;

    public Unknown1: number;
    public Unknown2: number;
    public BondStartIndex: number; // Usually self?
    public BondEndIndex: number; // Whatever item glued to
    public State: number; // Most Likely. Contains spring state for example;

    constructor(name: string, primaryMatrix: Matrix4, secondaryMatrix: Matrix4, tertiaryMatrix: Matrix4) {
        this.Name = name;
        this.Main = new ActorMatrix(primaryMatrix);

        if (secondaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub = new ActorMatrix(secondaryMatrix);
        }
        if (tertiaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub2 = new ActorMatrix(tertiaryMatrix);
        }

        this.Unknown1 = 0;
        this.Unknown2 = 0;
        this.BondStartIndex = 0;
        this.BondEndIndex = 0;
        this.State = 0;
    }
}
