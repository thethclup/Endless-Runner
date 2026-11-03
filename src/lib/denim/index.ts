// Base Denim Migration Module
// Replaces Flashblocks subscriptions & pending states with canonical 200ms blocks.

export * from './constants';

/**
 * Validates that an RPC request or options object does not use the deprecated 'pending' block tag
 * as per Base Denim upgrade specification.
 */
export function assertDenimCanonicalBlockTag(tag?: string): void {
  if (tag === 'pending') {
    throw new Error(
      `[Denim Migration Violation]: The 'pending' block tag has no equivalent after the Denim upgrade. ` +
      `Use canonical 200ms block tag ('latest') instead.`
    );
  }
}

/**
 * Returns canonical block parameters for Denim RPC calls.
 */
export function getDenimBlockTag(): 'latest' {
  return 'latest';
}

/**
 * Denim ultra-fast polling utility for receipt confirmation.
 * Given Denim's 200ms block interval, polls every 200ms.
 */
export async function waitForDenimConfirmation<T>(
  checkFn: () => Promise<T | null | undefined>,
  maxAttempts: number = 60, // 60 * 200ms = 12 seconds max
  intervalMs: number = 200
): Promise<T> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const result = await checkFn();
    if (result) return result;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
  }
  throw new Error(`Transaction confirmation timed out after ${maxAttempts * intervalMs}ms on Denim 200ms blocks`);
}
