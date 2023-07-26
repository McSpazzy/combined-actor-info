import { gzipSync, gunzipSync, gunzip, gzip } from 'fflate';
import { CombinedActorInfo } from './CombinedActorInfo';

export type ConvertError = { error: string; innerError?: any };

/**
 * Cheap and dirty hash. Probably unreliable. Use only if you hate yourself. 
 * @param {any} obj The object
 * @param {number} hash start number if you want. but you don't have to. you know, whatever. 
 * @returns {number} signed int32 hash
 */
export function hashCode(obj: any, hash: number = 0) {
    var str = JSON.stringify(obj);
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}

/**
 * Asynchronously converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {PromiseLike<CombinedActorInfo>}
 */
export async function base64ToCai(base64: string): Promise<CombinedActorInfo> {
    return new Promise((resolve, reject: (reason?: ConvertError) => void) => {
        var data: Uint8Array | undefined = undefined;
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

        gunzip(data, (err, data) => {
            if (err) {
                reject({ error: 'Unable To Decompress', innerError: err });
                return;
            }
            try {
                var cai = CombinedActorInfo.FromArrayBuffer(data.buffer);
                resolve(cai);
            } catch (error) {
                reject({ error: 'Unable To Load CAI', innerError: error });
            }
        });
    });
}

/**
 * Asynchronously converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {PromiseLike<string>}
 */
export async function caiToBase64(cai: CombinedActorInfo): Promise<string> {
    return new Promise((resolve, reject: (reason?: ConvertError) => void) => {
        var data: Uint8Array = new Uint8Array(CombinedActorInfo.ToArrayBuffer(cai));
        gzip(data, (err, data) => {
            if (err) {
                reject({ error: 'Unable To Compress', innerError: err });
                return;
            }
            try {
                var charData = data.reduce((value, char) => value + String.fromCharCode(char), "");
                var base64String = btoa(charData);
                resolve(base64String);
            } catch (error) {
                reject({ error: 'Unable To Load CAI', innerError: error });
            }
        });
    });
}


/**
 * Converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {CombinedActorInfo}
 */
export function base64ToCaiSync(base64: string): CombinedActorInfo {
    try {
        return CombinedActorInfo.FromArrayBuffer(gunzipSync(Uint8Array.from([...atob(base64)].map(c => c.charCodeAt(0)))).buffer);
    }
    catch (e) {
        throw { error: 'Unable to convert Base64 String to CAI', innerError: e }
    }
}

/**
 * Converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {string}
 */
export function caiToBase64Sync(cai: CombinedActorInfo): string {
    try {
        return btoa(gzipSync(new Uint8Array(CombinedActorInfo.ToArrayBuffer(cai)), { level: 9 }).reduce((value, char) => value + String.fromCharCode(char), ""));
    }
    catch (e) {
        throw { error: 'Unable to convert CAI to Base64 String', innerError: e }
    };
}
