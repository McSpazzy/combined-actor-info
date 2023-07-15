"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
const ActorMatrix_1 = require("./ActorMatrix");
class Actor {
    Name;
    PrimaryMatrix;
    SecondaryMatrix;
    TertiaryMatrix;
    Unknown1;
    Unknown2;
    BondStartIndex; // Usually self?
    BondEndIndex; // Whatever item glued to
    State; // Most Likely. Contains spring state for example;
    constructor(name, primaryMatrix, secondaryMatrix) {
        this.Name = name;
        this.PrimaryMatrix = new ActorMatrix_1.ActorMatrix(primaryMatrix);
        this.SecondaryMatrix = new ActorMatrix_1.ActorMatrix(secondaryMatrix);
        this.TertiaryMatrix = [];
        this.Unknown1 = 0;
        this.Unknown2 = 0;
        this.BondStartIndex = 0;
        this.BondEndIndex = 0;
        this.State = 0;
    }
}
exports.Actor = Actor;
