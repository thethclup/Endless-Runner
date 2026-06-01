import { ERC8021Config, ValidationResult, SecurityLevel } from './types';
import { ATTRIBUTION_CODE_PLACEHOLDER, BUILDER_CODE_PLACEHOLDER } from './constants';

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
