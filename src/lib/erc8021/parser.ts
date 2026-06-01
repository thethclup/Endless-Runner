import { ERC8021_MAGIC_BYTES } from './constants';

export interface ParsedAttribution {
    hasSuffix: boolean;
    rawSuffix?: string;
}

/**
 * Attempt to parse an ERC-8021 suffix from raw calldata.
 */
export function parseCalldata(calldata: string): ParsedAttribution {
    const hasSuffix = calldata.includes(ERC8021_MAGIC_BYTES);
    if (!hasSuffix) return { hasSuffix: false };
    
    const index = calldata.lastIndexOf(ERC8021_MAGIC_BYTES);
    const rawSuffix = calldata.substring(index);
    
    return {
        hasSuffix: true,
        rawSuffix
    };
}
