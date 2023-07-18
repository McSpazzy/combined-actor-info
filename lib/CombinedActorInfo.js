"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedActorInfo = void 0;
const three_1 = require("three");
const Actor_1 = require("./Actor");
class CombinedActorInfo {
    unknownVal;
    entryCount;
    actors;
    boundingBox;
    unknownData;
    constructor() {
        this.unknownVal = 0;
        this.entryCount = 0;
        this.actors = [];
        this.unknownData = [];
    }
    static FromSaveFileArrayBuffer(saveBuffer, index) {
        const cbiHash = 2774999734;
        const magic = 16909060;
        var multiValue = Array.isArray(index);
        var values = Array.isArray(index) ? [...index] : [index];
        var data = new DataView(saveBuffer);
        if (data.getUint32(0, true) !== magic) {
            throw new Error("Magic Mismatch. Invalid File");
        }
        var dataOffset = data.getUint32(0x8, true);
        var offset = 0x28;
        while (offset < dataOffset) {
            var hash = data.getUint32(offset, true);
            offset += 4;
            var cbiOffset = data.getUint32(offset, true);
            offset += 4;
            if (hash === cbiHash) {
                offset = cbiOffset;
                break;
            }
        }
        var actorArray = [];
        var entryCount = data.getUint32(offset, true);
        offset += 4;
        for (let index = 0; index < entryCount; index++) {
            var length = data.getUint32(offset, true);
            offset += 4;
            actorArray.push(saveBuffer.slice(offset, offset + length));
            offset += length;
        }
        var cbi = values.map(v => this.FromArrayBuffer(actorArray[v - 1]));
        if (!multiValue && cbi.length > 0) {
            return cbi[0];
        }
        return cbi;
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
        // Validate magic
        if (enc.decode(new DataView(buffer, 0, 6)) !== "CmbAct") {
            throw new Error("Magic Mismatch. Invalid File");
        }
        var cai = new CombinedActorInfo();
        cai.entryCount = data.getUint8(0x09);
        cai.unknownVal = data.getUint16(0x0A, true);
        var offset = 0x0C;
        for (let index = 0; index < cai.entryCount; index++) {
            var primaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var secondaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var tertiaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var extraOne = data.getFloat32(offset, true);
            offset += 4;
            var extraTwo = data.getUint32(offset, true);
            offset += 4;
            var name = "";
            var charCode;
            while ((charCode = data.getUint8(offset++)) !== 0) {
                name += String.fromCharCode(charCode);
            }
            offset += (63 - name.length);
            var subComponent = "";
            while ((charCode = data.getUint8(offset++)) !== 0) {
                subComponent += String.fromCharCode(charCode);
            }
            offset += (63 - subComponent.length);
            var actor = new Actor_1.Actor(name, primaryMatrix, secondaryMatrix, tertiaryMatrix);
            actor.SubName = subComponent;
            // Maybe
            actor.fuseInfo = extraOne;
            // Probably
            actor.flag = extraTwo;
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
        // Bounding Box
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
    static ReadMatrix4X3(buffer, offset) {
        var r1 = buffer.getFloat32(offset, true);
        offset += 4;
        var r2 = buffer.getFloat32(offset, true);
        offset += 4;
        var r3 = buffer.getFloat32(offset, true);
        offset += 4;
        var x = buffer.getFloat32(offset, true);
        offset += 4;
        var r4 = buffer.getFloat32(offset, true);
        offset += 4;
        var r5 = buffer.getFloat32(offset, true);
        offset += 4;
        var r6 = buffer.getFloat32(offset, true);
        offset += 4;
        var y = buffer.getFloat32(offset, true);
        offset += 4;
        var r7 = buffer.getFloat32(offset, true);
        offset += 4;
        var r8 = buffer.getFloat32(offset, true);
        offset += 4;
        var r9 = buffer.getFloat32(offset, true);
        offset += 4;
        var z = buffer.getFloat32(offset, true);
        offset += 4;
        const m = new three_1.Matrix4();
        m.set(r1, r2, r3, x, r4, r5, r6, y, r7, r8, r9, z, 0, 0, 0, 0);
        return m;
    }
    static ToJson(cai, pretty = true) {
        if (pretty) {
            return JSON.stringify(cai, null, 4);
        }
        else {
            return JSON.stringify(cai);
        }
    }
    static Vector3DegToRad(vector3) {
        return new three_1.Vector3(three_1.MathUtils.degToRad(vector3.x), three_1.MathUtils.degToRad(vector3.y), three_1.MathUtils.degToRad(vector3.z));
    }
    static Matrix4ToWritableArray(matrix4) {
        if (!matrix4) {
            // Identity Matrix
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 0
            ];
        }
        var outNum = [];
        outNum.push(matrix4.elements[0]);
        outNum.push(matrix4.elements[4]);
        outNum.push(matrix4.elements[8]);
        outNum.push(matrix4.elements[12]);
        outNum.push(matrix4.elements[1]);
        outNum.push(matrix4.elements[5]);
        outNum.push(matrix4.elements[9]);
        outNum.push(matrix4.elements[13]);
        outNum.push(matrix4.elements[2]);
        outNum.push(matrix4.elements[6]);
        outNum.push(matrix4.elements[10]);
        outNum.push(matrix4.elements[14]);
        outNum.push(matrix4.elements[3]);
        outNum.push(matrix4.elements[7]);
        outNum.push(matrix4.elements[11]);
        outNum.push(matrix4.elements[15]);
        return outNum;
    }
    static RebuildMatrix(actorMatrix) {
        var matrix = new three_1.Matrix4();
        var rotationVector = CombinedActorInfo.Vector3DegToRad(actorMatrix.rotation ?? new three_1.Vector3());
        var quaternion = new three_1.Quaternion().setFromEuler(new three_1.Euler(rotationVector.x, rotationVector.y, rotationVector.z, "XYZ"));
        matrix.makeRotationFromQuaternion(quaternion);
        if (actorMatrix.position) {
            matrix.setPosition(actorMatrix.position.x, actorMatrix.position.y, actorMatrix.position.z);
        }
        return matrix;
    }
    static WriteMatrix(view, offset, matrix) {
        var writeableMatrix = CombinedActorInfo.Matrix4ToWritableArray(matrix);
        for (let index = 0; index < 12; index++) {
            view.setFloat32(offset, writeableMatrix[index], true);
            offset += 4;
        }
    }
    static ToArrayBuffer(cai) {
        const enc = new TextEncoder();
        const arrayBuffer = new ArrayBuffer(6688);
        const dataView = new DataView(arrayBuffer);
        const magic = [67, 109, 98, 65, 99, 116]; // CmbAct
        for (let i = 0; i < 6; i++) {
            dataView.setUint8(i, magic[i]);
        }
        dataView.setUint8(0x08, 2); // Version?
        dataView.setUint8(0x09, cai.entryCount);
        dataView.setUint16(0x0A, cai.unknownVal, true);
        var offset = 0x0C;
        cai.actors.forEach(a => {
            CombinedActorInfo.WriteMatrix(dataView, offset, CombinedActorInfo.RebuildMatrix(a.Main));
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, CombinedActorInfo.RebuildMatrix(a.Main));
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, CombinedActorInfo.RebuildMatrix(a.Main));
            offset += 48;
            dataView.setFloat32(offset, a.fuseInfo, true);
            offset += 4;
            dataView.setUint32(offset, a.flag, true);
            offset += 4;
            var paddedArray = new Uint8Array(64);
            paddedArray.set(enc.encode(a.Name));
            for (let index = 0; index < 64; index++) {
                dataView.setUint8(offset, paddedArray[index]);
                offset += 1;
            }
            paddedArray = new Uint8Array(64);
            paddedArray.set(enc.encode(a.SubName));
            for (let index = 0; index < 64; index++) {
                dataView.setUint8(offset, paddedArray[index]);
                offset += 1;
            }
        });
        for (let index = 0; index < 21 - cai.actors.length; index++) {
            var emtpyMatrix = new three_1.Matrix4().identity();
            CombinedActorInfo.WriteMatrix(dataView, offset, emtpyMatrix);
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, emtpyMatrix);
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, emtpyMatrix);
            offset += 48;
            dataView.setFloat32(offset, 1.0, true);
            offset += 4;
            dataView.setUint32(offset, 0, true);
            offset += 4;
            offset += 128;
        }
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
            offset += 2;
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
