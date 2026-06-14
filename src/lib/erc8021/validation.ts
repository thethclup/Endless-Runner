import { ERC8021Config, ValidationResult, SecurityLevel } from './types';
import { ATTRIBUTION_CODE_PLACEHOLDER, BUILDER_CODE_PLACEHOLDER } from './constants';
import { parseERC8021Calldata } from './parser';

/**
 * Validates an ERC-8021 configuration according to the specified security level.
 */
export function validateERC8021Config(config: ERC8021Config, level: SecurityLevel = 'Standard'): ValidationResult {
    const errors: string[] = [];

    if (!config.attributionCode) {
        errors.push("Attribution code is strictly required.");
    }

    if (level === 'Strict') {
        if (config.attributionCode === ATTRIBUTION_CODE_PLACEHOLDER) {
            errors.push("Placeholder attribution code cannot be used in Strict mode.");
        }
        if (config.builderCode === BUILDER_CODE_PLACEHOLDER) {
            errors.push("Placeholder builder code cannot be used in Strict mode.");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates an ERC-8021 suffix based on raw calldata parsing.
 */
export function validateERC8021Suffix(calldata: string, level: SecurityLevel = 'Standard'): ValidationResult {
    const parsed = parseERC8021Calldata(calldata);
    const errors: string[] = [];
    
    if (!parsed.hasSuffix) {
        errors.push("No ERC-8021 suffix found in calldata.");
        return { isValid: false, errors };
    }
    
    if (parsed.schema !== 0) {
        if (level === 'Strict') {
             errors.push(`Strict mode implies Schema 0, but found ${parsed.schema}.`);
        }
    } else {
        if (!parsed.codes || parsed.codes.length === 0) {
            errors.push("Schema 0 requires at least one code.");
        } else {
            const hasAttribution = parsed.codes.length > 0 && parsed.codes[0].trim() !== "";
            if (!hasAttribution) {
                errors.push("Attribution code is strictly required.");
            }
            if (level === 'Strict') {
                if (parsed.codes.includes(ATTRIBUTION_CODE_PLACEHOLDER) || parsed.codes.includes(BUILDER_CODE_PLACEHOLDER)) {
                     errors.push("Placeholder codes are not allowed in Strict mode.");
                }
            }
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}
