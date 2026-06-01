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
 * Format generally involves magic bytes, schema id, and the packed identifiers.
 */
export function generateERC8021Suffix(config: ERC8021Config): string {
    const schemaHex = SCHEMA_ID_0; 
    
    // Convert codes to hex
    const attrHex = stringToHex(config.attributionCode);
    const builderHex = config.builderCode ? stringToHex(config.builderCode) : "";
    
    // Build suffix (simplified Schema 0)
    const suffix = `${ERC8021_MAGIC_BYTES}${schemaHex}${attrHex}${builderHex}`;
    
    return suffix;
}

/**
 * Appends the standard ERC-8021 suffix to the given base calldata.
 */
export function appendERC8021Calldata(baseCalldata: `0x${string}`, config: ERC8021Config): `0x${string}` {
    const suffix = generateERC8021Suffix(config);
    return `${baseCalldata}${suffix}` as `0x${string}`;
}
