"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const ActorMatrix_1 = require("./ActorMatrix");
class Actor {
    Index = 0;
    Name;
    SubName;
    Main;
    Sub;
    Sub2;
    fuseInfo = 0; // 1.0 usually, but higher when a fused item. 
    flag = 0; // Eg 1 for open spring
    constructor(name, primaryMatrix, secondaryMatrix, tertiaryMatrix) {
        this.Name = name;
        this.Main = new ActorMatrix_1.ActorMatrix(primaryMatrix);
        if (secondaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub = new ActorMatrix_1.ActorMatrix(secondaryMatrix);
        }
        if (tertiaryMatrix.elements.toString() !== '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0') {
            this.Sub2 = new ActorMatrix_1.ActorMatrix(tertiaryMatrix);
        }
    }
}
exports.Actor = Actor;
