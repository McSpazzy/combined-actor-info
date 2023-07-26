import { CombinedActorInfo } from './CombinedActorInfo';
export type ConvertError = {
    error: string;
    innerError?: any;
};
/**
 * Cheap and dirty hash. Probably unreliable. Use only if you hate yourself.
 * @param {any} obj The object
 * @param {number} hash start number if you want. but you don't have to. you know, whatever.
 * @returns {number} signed int32 hash
 */
export declare function hashCode(obj: any, hash?: number): number;
/**
 * Asynchronously converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {PromiseLike<CombinedActorInfo>}
 */
export declare function base64ToCai(base64: string): Promise<CombinedActorInfo>;
/**
 * Asynchronously converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {PromiseLike<string>}
 */
export declare function caiToBase64(cai: CombinedActorInfo): Promise<string>;
/**
 * Converts a base64 string to a CombinedActorInfo instance
 * @param {string} base64 input string
 * @return {CombinedActorInfo}
 */
export declare function base64ToCaiSync(base64: string): CombinedActorInfo;
/**
 * Converts a CombinedActorInfo instance to base64 string
 * @param {CombinedActorInfo} cai input cai
 * @returns {string}
 */
export declare function caiToBase64Sync(cai: CombinedActorInfo): string;
