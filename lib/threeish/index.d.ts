export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    setFromMatrixPosition(m: {
        elements: number[];
    }): this;
    setFromEuler(e: {
        _x: any;
        _y: any;
        _z: any;
    }): this;
    degToRad(): Vector3;
    radToDeg(): Vector3;
}
export declare class Box3 {
    min: Vector3;
    max: Vector3;
    constructor(min?: Vector3, max?: Vector3);
}
export declare class Euler {
    _x: number;
    _y: number;
    _z: number;
    constructor(x?: number, y?: number, z?: number);
    clamp(value: number, min: number, max: number): number;
    setFromRotationMatrix(m: Matrix4): this;
}
export declare class Quaternion {
    _x: number;
    _y: number;
    _z: number;
    _w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    setFromEuler(euler: Euler): this;
}
export declare class Matrix4 {
    elements: number[];
    constructor();
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
    identity(): this;
    makeRotationFromQuaternion(q: Quaternion): this;
    setPosition(x: number, y: number, z: number): this;
    compose(position: Vector3, quaternion: Quaternion, scale: Vector3): this;
}
