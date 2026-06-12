// Replace the empty string below with your real attribution code from base.dev Settings
const metaEnv = (import.meta as any).env || {};
export const ATTRIBUTION_CODE = metaEnv.VITE_ATTRIBUTION_CODE ?? '';
export const BUILDER_CODE = metaEnv.VITE_BUILDER_CODE ?? 'bc_1aw46v36';
// Keep old placeholder export for validation logic only:
export const ATTRIBUTION_CODE_PLACEHOLDER = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE_PLACEHOLDER = "bc_1aw46v36";

export const ERC8021_MAGIC_BYTES = "80218021802180218021802180218021"; // 16 bytes marker
export const SCHEMA_ID_0 = "00"; // hex representation of 0
export const SCHEMA_ID_1 = "01"; 
export const SCHEMA_ID_2 = "02"; 

