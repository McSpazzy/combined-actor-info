"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
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
    constructor(name) {
        this.Name = name;
    }
}
exports.Actor = Actor;
