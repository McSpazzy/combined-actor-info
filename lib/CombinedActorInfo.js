"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedActorInfo = void 0;
const threeish_1 = require("./threeish");
const Actor_1 = require("./Actor");
const Bond_1 = require("./Bond");
class CombinedActorInfo {
    #entryCount = 0;
    #bondCount = 0;
    actors = [];
    bonds = [];
    boundingBox = new threeish_1.Box3(new threeish_1.Vector3(-1, -1, 1), new threeish_1.Vector3(1, 1, 1));
    unknownData;
    constructor() {
    }
    static FromSaveFileArrayBuffer(saveBuffer, index = undefined) {
        const cbiHash = 2774999734;
        const cbiIndexHash = 3531572817;
        const magic = 16909060;
        var data = new DataView(saveBuffer);
        if (data.getUint32(0, true) !== magic) {
            throw new Error("Magic Mismatch. Invalid File");
        }
        var dataOffset = data.getUint32(0x8, true);
        var offset = 0x28;
        var caiPosition = 0;
        var caiIndexPosition = 0;
        while (offset < dataOffset) {
            var hash = data.getUint32(offset, true);
            offset += 4;
            var cbiOffset = data.getUint32(offset, true);
            offset += 4;
            if (hash === cbiHash) {
                caiPosition = cbiOffset;
            }
            if (hash === cbiIndexHash) {
                caiIndexPosition = cbiOffset;
            }
            if (caiPosition > 0 && caiIndexPosition > 0) {
                break;
            }
        }
        var entryPositionCount = data.getUint32(caiIndexPosition, true);
        caiIndexPosition += 4;
        var positionArray = [entryPositionCount];
        for (let pIndex = 0; pIndex < entryPositionCount; pIndex++) {
            positionArray[data.getUint32(caiIndexPosition + (pIndex * 4), true)] = pIndex;
        }
        var actorArray = [];
        var entryCount = data.getUint32(caiPosition, true);
        caiPosition += 4;
        for (let index = 0; index < entryCount; index++) {
            var length = data.getUint32(caiPosition, true);
            caiPosition += 4;
            actorArray.push(saveBuffer.slice(caiPosition, caiPosition + length));
            caiPosition += length;
        }
        var cbaArray = actorArray.map((a, i) => {
            var cai = this.FromArrayBuffer(a);
            return cai;
        });
        if (!index) {
            return cbaArray;
        }
        if (Array.isArray(index)) {
            return index.map((v) => cbaArray[positionArray[v - 1]]);
        }
        else {
            console.log(positionArray[index - 1]);
            return cbaArray[positionArray[index - 1]];
        }
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
        cai.#entryCount = data.getUint8(0x09);
        cai.#bondCount = data.getUint8(0x0A);
        var offset = 0x0C;
        for (let index = 0; index < cai.#entryCount; index++) {
            var primaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var secondaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var tertiaryMatrix = CombinedActorInfo.ReadMatrix4X3(data, offset);
            offset += 48;
            var fuseData = data.getFloat32(offset, true);
            offset += 4;
            var flagData = data.getUint32(offset, true);
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
            actor.Index = index;
            actor.fuseInfo = fuseData;
            actor.flag = flagData;
            cai.actors.push(actor);
        }
        // Skip Empty
        offset += 280 * (21 - cai.#entryCount);
        for (let index = 0; index < cai.#bondCount; index++) {
            var bond = new Bond_1.Bond();
            var sourceMatrix = data.getUint32(offset, true);
            offset += 4;
            var targetMatrix = data.getUint32(offset, true);
            offset += 4;
            var sourceIndex = data.getUint8(offset);
            offset += 1;
            var targetIndex = data.getUint8(offset);
            offset += 3;
            bond.Source.Index = sourceIndex;
            bond.Target.Index = targetIndex;
            bond.Source.Matrix = sourceMatrix;
            bond.Target.Matrix = targetMatrix;
            cai.bonds.push(bond);
        }
        // Skip Empty
        offset += 12 * (21 - cai.#bondCount);
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
        cai.boundingBox = new threeish_1.Box3(new threeish_1.Vector3(xMin, yMin, zMin), new threeish_1.Vector3(xMax, yMax, zMax));
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
        const m = new threeish_1.Matrix4();
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
        var matrix = new threeish_1.Matrix4();
        var rotationVector = actorMatrix.rotation?.degToRad() ?? new threeish_1.Vector3();
        var quaternion = new threeish_1.Quaternion().setFromEuler(new threeish_1.Euler(rotationVector.x, rotationVector.y, rotationVector.z));
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
        dataView.setUint8(0x09, cai.actors.length);
        dataView.setUint8(0x0A, cai.bonds.length);
        var offset = 0x0C;
        cai.actors.forEach(a => {
            CombinedActorInfo.WriteMatrix(dataView, offset, CombinedActorInfo.RebuildMatrix(a.Main));
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, a.Sub ? CombinedActorInfo.RebuildMatrix(a.Sub) : undefined);
            offset += 48;
            CombinedActorInfo.WriteMatrix(dataView, offset, a.Sub2 ? CombinedActorInfo.RebuildMatrix(a.Sub2) : undefined);
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
            var emtpyMatrix = new threeish_1.Matrix4().identity();
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
        cai.bonds.forEach(a => {
            dataView.setUint32(offset, a.Source.Matrix, true);
            offset += 4;
            dataView.setUint32(offset, a.Target.Matrix, true);
            offset += 4;
            dataView.setUint8(offset, a.Source.Index);
            offset += 1;
            dataView.setUint8(offset, a.Target.Index);
            offset += 1;
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
