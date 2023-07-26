"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caiToBase64Sync = exports.base64ToCaiSync = exports.caiToBase64 = exports.base64ToCai = exports.hashCode = void 0;
const fflate_1 = require("fflate");
const CombinedActorInfo_1 = require("./CombinedActorInfo");
/**
 * Cheap and dirty hash. Probably unreliable. Use only if you hate yourself.
 * @param {any} obj The object
 * @param {number} hash start number if you want. but you don't have to. you know, whatever.
 * @returns {number} signed int32 hash
 */
function hashCode(obj, hash = 0) {
    var str = JSON.stringify(obj);
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}
exports.hashCode = hashCode;
/**
 * Asynchronously converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {PromiseLike<CombinedActorInfo>}
 */
async function base64ToCai(base64) {
    return new Promise((resolve, reject) => {
        var data = undefined;
        try {
            var base64data = [...atob(base64)];
            data = Uint8Array.from(base64data.map(c => c.charCodeAt(0)));
        }
        catch (e) {
            reject({ error: 'Unable To Decode Base64', innerError: e });
        }
        if (!data) {
            reject({ error: 'No Data' });
            return;
        }
        (0, fflate_1.gunzip)(data, (err, data) => {
            if (err) {
                reject({ error: 'Unable To Decompress', innerError: err });
                return;
            }
            try {
                var cai = CombinedActorInfo_1.CombinedActorInfo.FromArrayBuffer(data.buffer);
                resolve(cai);
            }
            catch (error) {
                reject({ error: 'Unable To Load CAI', innerError: error });
            }
        });
    });
}
exports.base64ToCai = base64ToCai;
/**
 * Asynchronously converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {PromiseLike<string>}
 */
async function caiToBase64(cai) {
    return new Promise((resolve, reject) => {
        var data = new Uint8Array(CombinedActorInfo_1.CombinedActorInfo.ToArrayBuffer(cai));
        (0, fflate_1.gzip)(data, (err, data) => {
            if (err) {
                reject({ error: 'Unable To Compress', innerError: err });
                return;
            }
            try {
                var charData = data.reduce((value, char) => value + String.fromCharCode(char), "");
                var base64String = btoa(charData);
                resolve(base64String);
            }
            catch (error) {
                reject({ error: 'Unable To Load CAI', innerError: error });
            }
        });
    });
}
exports.caiToBase64 = caiToBase64;
/**
 * Converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {CombinedActorInfo}
 */
function base64ToCaiSync(base64) {
    try {
        return CombinedActorInfo_1.CombinedActorInfo.FromArrayBuffer((0, fflate_1.gunzipSync)(Uint8Array.from([...atob(base64)].map(c => c.charCodeAt(0)))).buffer);
    }
    catch (e) {
        throw { error: 'Unable to convert Base64 String to CAI', innerError: e };
    }
}
exports.base64ToCaiSync = base64ToCaiSync;
/**
 * Converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {string}
 */
function caiToBase64Sync(cai) {
    try {
        return btoa((0, fflate_1.gzipSync)(new Uint8Array(CombinedActorInfo_1.CombinedActorInfo.ToArrayBuffer(cai)), { level: 9 }).reduce((value, char) => value + String.fromCharCode(char), ""));
    }
    catch (e) {
        throw { error: 'Unable to convert CAI to Base64 String', innerError: e };
    }
    ;
}
exports.caiToBase64Sync = caiToBase64Sync;
