export type SecurityLevel = 'Basic' | 'Standard' | 'Strict';

export interface ERC8021Config {
    schema?: 0 | 1 | 2;
    attributionCode: string;
    builderCode?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
