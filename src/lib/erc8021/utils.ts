import { ERC8021Config } from './types';
import { ERC8021_MAGIC_BYTES, SCHEMA_ID_0 } from './constants';

/**
 * Encodes strings into hex for the calldata suffix.
 */
function stringToHex(str: string): string {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return hex;
}

/**
 * Generates an ERC-8021 compliant suffix (Schema 0).
 */
export function generateERC8021Suffix(config: ERC8021Config): string {
    const schemaHex = config.schema === 1 ? '01' : config.schema === 2 ? '02' : SCHEMA_ID_0;
    const codes: string[] = [];
    if (config.attributionCode) codes.push(config.attributionCode);
    if (config.builderCode) codes.push(config.builderCode);
    const codesString = codes.join(',');
    const codesHex = stringToHex(codesString);
    const byteLength = new TextEncoder().encode(codesString).length;
    const codesLengthHex = byteLength.toString(16).padStart(2, '0');
    return codesHex + codesLengthHex + schemaHex + ERC8021_MAGIC_BYTES;
}

/**
 * Appends the standard ERC-8021 suffix to the given base calldata.
 */
export function appendERC8021Calldata(baseCalldata: `0x${string}`, config: ERC8021Config): `0x${string}` {
    const suffix = generateERC8021Suffix(config);
    // ensure baseCalldata has 0x prefix if needed
    const cleanBase = baseCalldata.startsWith("0x") ? baseCalldata : `0x${baseCalldata}`;
    return `${cleanBase}${suffix}` as `0x${string}`;
}
