"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedActorInfo = void 0;
const three_1 = require("three");
const Actor_1 = require("./Actor");
const ActorMatrix_1 = require("./ActorMatrix");
class CombinedActorInfo {
    entryCount;
    actors;
    boundingBox;
    unknownData;
    constructor() {
        this.entryCount = 0;
        this.actors = [];
        this.unknownData = [];
    }
    static FromJson(jsonString) {
        return JSON.parse(jsonString);
    }
    static FromArrayLike(arrayLike) {
        return CombinedActorInfo.FromArrayBuffer(Uint8Array.from(arrayLike));
    }
    static FromArrayBuffer(buffer) {
        const enc = new TextDecoder("utf-8");
        var data = new DataView(buffer);
        // Quick and dirty check for json input. Don't judge me. You don't know my life.
        if (data.getUint8(0) === 123) {
            return CombinedActorInfo.FromJson(enc.decode(buffer));
        }
        var cai = new CombinedActorInfo();
        var offset = 0;
        // Check for old totkab format and be sad about it.
        if (enc.decode(new DataView(buffer, 0, 6)) === "TOTKAu") {
            offset = 48;
        }
        // Validate magic
        if (enc.decode(new DataView(buffer, offset, 6)) !== "CmbAct") {
            throw new Error("Magic Mismatch. Invalid File");
        }
        var offset = 9;
        cai.entryCount = data.getUint8(offset);
        offset += 3;
        for (let index = 0; index < cai.entryCount; index++) {
            var primaryMatrix = CombinedActorInfo.ReadMatrix4X4(data, offset);
            offset += 64;
            var secondaryMatrix = CombinedActorInfo.ReadMatrix4X4(data, offset);
            offset += 64;
            var tertiaryArray = [];
            for (let index = 0; index < 6; index++) {
                tertiaryArray.push(data.getFloat32(offset, true));
                offset += 4;
            }
            var offSetName = offset;
            var name = "";
            var charCode;
            while ((charCode = data.getUint8(offSetName++)) !== 0) {
                name += String.fromCharCode(charCode);
            }
            offset += 128;
            var actor = new Actor_1.Actor(name, primaryMatrix, secondaryMatrix);
            actor.TertiaryMatrix = tertiaryArray;
            cai.actors.push(actor);
        }
        // Skip Empty
        offset += 280 * (21 - cai.entryCount);
        for (let index = 0; index < cai.entryCount; index++) {
            cai.actors[index].Unknown1 = data.getUint32(offset, true);
            offset += 4;
            cai.actors[index].Unknown2 = data.getUint32(offset, true);
            offset += 4;
            cai.actors[index].BondStartIndex = data.getUint8(offset);
            offset += 1;
            cai.actors[index].BondEndIndex = data.getUint8(offset);
            offset += 1;
            cai.actors[index].State = data.getUint16(offset);
            offset += 2;
        }
        // Skip Empty
        offset += 12 * (21 - cai.entryCount);
        var xMin = data.getFloat32(offset, true);
        offset += 4;
        var yMin = data.getFloat32(offset, true);
        offset += 4;
        var zMin = data.getFloat32(offset, true);
        offset += 4;
        var xMax = data.getFloat32(offset, true);
        offset += 4;
        var yMax = data.getFloat32(offset, true);
        offset += 4;
        var zMax = data.getFloat32(offset, true);
        offset += 4;
        cai.boundingBox = new three_1.Box3(new three_1.Vector3(xMin, yMin, zMin), new three_1.Vector3(xMax, yMax, zMax));
        // No idea what this data is. Ignoring for now.
        // cai.unknownData = Array.from(new Uint8Array(buffer.slice(offset, offset + 520)));
        return cai;
    }
    static ReadMatrix4X4(buffer, offset) {
        var r1 = buffer.getFloat32(offset, true);
        offset += 4;
        var r2 = buffer.getFloat32(offset, true);
        offset += 4;
        var r3 = buffer.getFloat32(offset, true);
        offset += 4;
        var t1 = buffer.getFloat32(offset, true);
        offset += 4;
        var r4 = buffer.getFloat32(offset, true);
        offset += 4;
        var r5 = buffer.getFloat32(offset, true);
        offset += 4;
        var r6 = buffer.getFloat32(offset, true);
        offset += 4;
        var t2 = buffer.getFloat32(offset, true);
        offset += 4;
        var r7 = buffer.getFloat32(offset, true);
        offset += 4;
        var r8 = buffer.getFloat32(offset, true);
        offset += 4;
        var r9 = buffer.getFloat32(offset, true);
        offset += 4;
        var t3 = buffer.getFloat32(offset, true);
        offset += 4;
        var a1 = buffer.getFloat32(offset, true);
        offset += 4;
        var a2 = buffer.getFloat32(offset, true);
        offset += 4;
        var a3 = buffer.getFloat32(offset, true);
        offset += 4;
        var a4 = buffer.getFloat32(offset, true);
        offset += 4;
        const m = new three_1.Matrix4();
        m.set(r1, r2, r3, a4, r4, r5, r6, a3, r7, r8, r9, a2, t1, t2, t3, a1);
        return m;
    }
    ToJson(pretty = true) {
        if (pretty) {
            return JSON.stringify(this, null, 4);
        }
        else {
            return JSON.stringify(this);
        }
    }
    static ToArrayBuffer(cai) {
        const enc = new TextEncoder();
        const arrayBuffer = new ArrayBuffer(6688);
        const dataView = new DataView(arrayBuffer);
        var offset = 0;
        const magic = [67, 109, 98, 65, 99, 116]; // CmbAct
        for (let i = 0; i < 6; i++) {
            dataView.setUint8(i, magic[i]);
        }
        offset += 6;
        dataView.setUint16(offset, 0, true);
        offset += 2;
        dataView.setUint8(offset, 2); // Version?
        offset += 1;
        dataView.setUint8(offset, cai.entryCount); // Version?
        offset += 3;
        cai.actors.forEach(a => {
            var m1 = ActorMatrix_1.ActorMatrix.rebuildMatrix(a.PrimaryMatrix);
            for (let index = 0; index < 16; index++) {
                dataView.setFloat32(offset, m1.elements[index], true);
                offset += 4;
            }
            var m2 = ActorMatrix_1.ActorMatrix.rebuildMatrix(a.SecondaryMatrix);
            for (let index = 0; index < 16; index++) {
                dataView.setFloat32(offset, m2.elements[index], true);
                offset += 4;
            }
            for (let index = 0; index < 6; index++) {
                dataView.setFloat32(offset, a.TertiaryMatrix[index], true);
                offset += 4;
            }
            const paddedArray = new Uint8Array(128);
            paddedArray.set(enc.encode(a.Name));
            for (let index = 0; index < 128; index++) {
                dataView.setUint8(offset, paddedArray[index]);
                offset += 1;
            }
        });
        /*
        for (let index = 0; index < 21 - this.actors.length; index++) {
            var newMatrix = new Matrix4();
            var newTertiary = [0, 0, 1, 0, 1, 0];
            for (let index = 0; index < 16; index++) {
                dataView.setFloat32(offset, 0, true);
                offset += 4;
            }
            for (let index = 0; index < 16; index++) {
                dataView.setFloat32(offset, 0, true);
                offset += 4;
            }
            for (let index = 0; index < 6; index++) {
                dataView.setFloat32(offset, newTertiary[index], true);
                offset += 4;
            }
            for (let index = 0; index < 128; index++) {
                dataView.setUint8(offset, 0);
                offset += 1;
            }
        }
        */
        offset = 0x1704;
        cai.actors.forEach(a => {
            dataView.setUint32(offset, a.Unknown1, true);
            offset += 4;
            dataView.setUint32(offset, a.Unknown2, true);
            offset += 4;
            dataView.setUint8(offset, a.BondStartIndex);
            offset += 1;
            dataView.setUint8(offset, a.BondEndIndex);
            offset += 1;
            dataView.setUint16(offset, a.State, true);
        });
        offset = 0x1800;
        dataView.setFloat32(offset, cai.boundingBox?.min.x ?? 0, true);
        offset += 4;
        dataView.setFloat32(offset, cai.boundingBox?.min.y ?? 0, true);
        offset += 4;
        dataView.setFloat32(offset, cai.boundingBox?.min.z ?? 0, true);
        offset += 4;
        dataView.setFloat32(offset, cai.boundingBox?.max.x ?? 0, true);
        offset += 4;
        dataView.setFloat32(offset, cai.boundingBox?.max.y ?? 0, true);
        offset += 4;
        dataView.setFloat32(offset, cai.boundingBox?.max.z ?? 0, true);
        offset += 4;
        dataView.setUint8(offset, 1);
        return arrayBuffer;
    }
}
exports.CombinedActorInfo = CombinedActorInfo;
