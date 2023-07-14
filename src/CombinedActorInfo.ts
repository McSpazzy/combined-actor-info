import { Box3, Matrix4, Vector3 } from 'three';
import { Actor } from './Actor';
import { ActorMatrix } from './ActorMatrix';

export class CombinedActorInfo {

    entryCount: number;
    actors: Actor[];
    boundingBox?: Box3;
    unknownData: number[]

    constructor() {
        this.entryCount = 0;
        this.actors = [];
        this.unknownData = [];
    }

    public static FromArrayLike(arrayLike: Iterable<number>): CombinedActorInfo {
        return CombinedActorInfo.FromArrayBuffer(Uint8Array.from(arrayLike))
    }

    public static FromArrayBuffer(buffer: ArrayBufferLike): CombinedActorInfo {

        var cai = new CombinedActorInfo();
        const enc = new TextDecoder("utf-8");

        var data = new DataView(buffer);
        var offset = 0;

        // Check for old totkab format and be sad about it.
        if (enc.decode(new DataView(buffer, 0, 6)) === "TOTKAu") {
            offset = 48;
        }

        // Validate magic
        if (enc.decode(new DataView(buffer, offset, 6)) !== "CmbAct") {
            throw new Error("Magic Mismatch. Invalid File");
        } else {
            console.log("File Read OK");
        }

        var offset = 9;
        cai.entryCount = data.getUint8(offset);
        offset += 3;

        for (let index = 0; index < cai.entryCount; index++) {

            var primaryMatrix = CombinedActorInfo.ReadMatrix4X4(data, offset);
            offset += 64;
            var secondaryMatrix = CombinedActorInfo.ReadMatrix4X4(data, offset);
            offset += 64;

            var tertiaryArray: number[] = [];
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
            var actor = new Actor(name);
            actor.PrimaryMatrix = new ActorMatrix(primaryMatrix);
            actor.SecondaryMatrix = new ActorMatrix(secondaryMatrix);
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

        // Pretty sure its a bounding box or something similar
        cai.boundingBox = new Box3(new Vector3(xMin, yMin, zMin), new Vector3(xMax, yMax, zMax));

        // No idea what this data is. Ignoring for now.
        // cai.unknownData = Array.from(new Uint8Array(buffer.slice(offset, offset + 520)));
        return cai;
    }

    public static ReadMatrix4X4(buffer: DataView, offset: number): Matrix4 {
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
        const m = new Matrix4();
        m.set(r1, r2, r3, a4, r4, r5, r6, a3, r7, r8, r9, a2, t1, t2, t3, a1);
        return m;
    }
}
