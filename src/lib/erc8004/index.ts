// ERC-8004 Trustless Agents Utilities

export const ERC8004_AGENT_ABI = [
  // ABI for standard operations regarding Smart Agents / Trustless execution
];

export function createAgentCall(target: string, data: string) {
    // Generate standard agent execution payload
    return {
        target,
        data,
    }
}
