// ERC-8021 — re-export from canonical modules
export { generateERC8021Suffix, appendERC8021Calldata } from './utils';
export { parseERC8021Calldata } from './parser';
export { validateERC8021Config, validateERC8021Suffix } from './validation';
export { ERC8021Registry } from './registry';
export type { ERC8021Config, ValidationResult, SecurityLevel } from './types';
export { ATTRIBUTION_CODE_PLACEHOLDER, BUILDER_CODE_PLACEHOLDER, ERC8021_MAGIC_BYTES } from './constants';