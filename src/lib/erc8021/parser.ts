import { ERC8021_MAGIC_BYTES } from './constants';

export interface ParsedAttribution {
    hasSuffix: boolean;
    schema?: number;
    codes?: string[];
    rawSuffix?: string;
}

function hexToString(hex: string): string {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    }
    return str;
}

/**
 * Attempt to parse an ERC-8021 suffix from raw calldata.
 */
export function parseERC8021Calldata(calldata: string): ParsedAttribution {
    const cleanCalldata = calldata.toLowerCase().startsWith('0x') ? calldata.slice(2) : calldata;
    const magicBytesLower = ERC8021_MAGIC_BYTES.toLowerCase();
    
    if (!cleanCalldata.endsWith(magicBytesLower)) {
        return { hasSuffix: false };
    }
    
    // Parse backwards: marker (32 hex chars = 16 bytes)
    const schemaStr = cleanCalldata.slice(-34, -32);
    const schemaId = parseInt(schemaStr, 16);
    
    if (schemaId === 0) {
        const codesLenStr = cleanCalldata.slice(-36, -34);
        const codesLen = parseInt(codesLenStr, 16);
        
        const codesHex = cleanCalldata.slice(-36 - (codesLen * 2), -36);
        const codesAscii = hexToString(codesHex);
        const codes = codesAscii.split(',');
        
        const rawSuffix = cleanCalldata.slice(-36 - (codesLen * 2));
        
        return {
            hasSuffix: true,
            schema: schemaId,
            codes,
            rawSuffix: "0x" + rawSuffix
        };
    }
    
    const rawSuffix = cleanCalldata.slice(-34);
    return {
        hasSuffix: true,
        schema: schemaId,
        rawSuffix: "0x" + rawSuffix
    };
}
