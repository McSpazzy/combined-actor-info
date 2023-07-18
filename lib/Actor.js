"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const ActorMatrix_1 = require("./ActorMatrix");
class Actor {
    Name;
    SubName;
    Main;
    Sub;
    Sub2;
    fuseInfo = 0;
    flag = 0;
    Unknown1;
    Unknown2;
    BondStartIndex; // Usually self?
    BondEndIndex; // Whatever item glued to
    State; // Most Likely. Contains spring state for example;
    constructor(name, primaryMatrix, secondaryMatrix, tertiaryMatrix) {
        this.Name = name;
        this.Main = new ActorMatrix_1.ActorMatrix(primaryMatrix);
        if (secondaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub = new ActorMatrix_1.ActorMatrix(secondaryMatrix);
        }
        if (tertiaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub2 = new ActorMatrix_1.ActorMatrix(tertiaryMatrix);
        }
        this.Unknown1 = 0;
        this.Unknown2 = 0;
        this.BondStartIndex = 0;
        this.BondEndIndex = 0;
        this.State = 0;
    }
}
exports.Actor = Actor;
