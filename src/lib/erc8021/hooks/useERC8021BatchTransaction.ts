/**
 * useERC8021BatchTransaction — NOT IMPLEMENTED (stub only).
 * Real batch sending requires Multicall3 or an ERC-4337 bundler.
 * Do NOT use in production until properly implemented.
 */
export function useERC8021BatchTransaction() {
  const sendBatch = async (_transactions: unknown[]): Promise<never> => {
    throw new Error(
      'useERC8021BatchTransaction is not implemented. ' +
      'Wire up Multicall3 (0xcA11bde05977b3631167028862bE2a173976CA11) ' +
      'or an ERC-4337 bundler before using this hook.'
    );
  };
  return { sendBatch };
}
