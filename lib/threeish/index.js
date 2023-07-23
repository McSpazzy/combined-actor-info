"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix4 = exports.Quaternion = exports.Euler = exports.Box3 = exports.Vector3 = void 0;
class Vector3 {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    setFromMatrixPosition(m) {
        const e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }
    setFromEuler(e) {
        this.x = e._x;
        this.y = e._y;
        this.z = e._z;
        return this;
    }
    degToRad() {
        return new Vector3(degToRad(this.x), degToRad(this.y), degToRad(this.z));
    }
    radToDeg() {
        return new Vector3(radToDeg(this.x, true), radToDeg(this.y, true), radToDeg(this.z, true));
    }
}
exports.Vector3 = Vector3;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
function degToRad(degrees) {
    return degrees * DEG2RAD;
}
function radToDeg(radians, round = false) {
    if (!round) {
        return radians * RAD2DEG;
    }
    var float = radians * RAD2DEG;
    if (Math.abs(float) < 1E-3) {
        return 0;
    }
    if (Math.abs(float - 0.5) < 1E-3) {
        return 0.5;
    }
    if (Math.abs(float - Math.round(float)) < 1E-3) {
        return Math.round(float);
    }
    return float;
}
class Box3 {
    min;
    max;
    constructor(min = new Vector3(+Infinity, +Infinity, +Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }
}
exports.Box3 = Box3;
class Euler {
    _x;
    _y;
    _z;
    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    setFromRotationMatrix(m) {
        const te = m.elements;
        const m11 = te[0], m12 = te[4], m13 = te[8];
        const m21 = te[1], m22 = te[5], m23 = te[9];
        const m31 = te[2], m32 = te[6], m33 = te[10];
        this._y = Math.asin(this.clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
            this._x = Math.atan2(-m23, m33);
            this._z = Math.atan2(-m12, m11);
        }
        else {
            this._x = Math.atan2(m32, m22);
            this._z = 0;
        }
        return this;
    }
}
exports.Euler = Euler;
class Quaternion {
    _x;
    _y;
    _z;
    _w;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }
    setFromEuler(euler) {
        const x = euler._x, y = euler._y, z = euler._z;
        // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m
        const cos = Math.cos;
        const sin = Math.sin;
        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);
        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);
        this._x = s1 * c2 * c3 + c1 * s2 * s3;
        this._y = c1 * s2 * c3 - s1 * c2 * s3;
        this._z = c1 * c2 * s3 + s1 * s2 * c3;
        this._w = c1 * c2 * c3 - s1 * s2 * s3;
        return this;
    }
}
exports.Quaternion = Quaternion;
class Matrix4 {
    elements;
    constructor() {
        this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
    }
    identity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    }
    makeRotationFromQuaternion(q) {
        return this.compose(new Vector3(0, 0, 0), q, new Vector3(1, 1, 1));
    }
    setPosition(x, y, z) {
        const te = this.elements;
        te[12] = x;
        te[13] = y;
        te[14] = z;
        return this;
    }
    compose(position, quaternion, scale) {
        const te = this.elements;
        const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = scale.x, sy = scale.y, sz = scale.z;
        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;
        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;
        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;
        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;
        return this;
    }
}
exports.Matrix4 = Matrix4;
