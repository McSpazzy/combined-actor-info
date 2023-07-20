import { Matrix4 } from 'three';
import { ActorMatrix } from './ActorMatrix';

export class Actor {

    public Index: number = 0;
    public Name: string;
    public SubName?: string;

    public Main: ActorMatrix;
    public Sub?: ActorMatrix;
    public Sub2?: ActorMatrix;

    public fuseInfo: number = 0; // 1.0 usually, but higher when a fused item. 
    public flag: number = 0; // Eg 1 for open spring

    constructor(name: string, primaryMatrix: Matrix4, secondaryMatrix: Matrix4, tertiaryMatrix: Matrix4) {
        this.Name = name;
        this.Main = new ActorMatrix(primaryMatrix);

        if (secondaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub = new ActorMatrix(secondaryMatrix);
        }
        if (tertiaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub2 = new ActorMatrix(tertiaryMatrix);
        }
    }
}
