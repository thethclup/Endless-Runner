// ERC-8021 Transaction Attribution Utilities
// Placeholder for standard implementation

export const ERC8021_ABI = [
  // Relevant ABI fragments depending on how attribution is stored
  // Usually this involves passing standard calldata or explicit attribution params
];

export const BUILDER_CODE = "bc_1aw46v36";

export function formatAttributionData(attributionCode: string, builderCode: string) {
  return {
    attribution: attributionCode,
    builder: builderCode,
  };
}

export function appendAttributionToCalldata(baseCalldata: `0x${string}`, attributionCode: string, builderCode: string = BUILDER_CODE): `0x${string}` {
  // Mock logic to append codes to calldata.
  // In a real implementation this might involve abi encoding.
  return `${baseCalldata}000000${builderCode}` as `0x${string}`; // placeholder
}
