/**
 * Mock interaction for an onchain code registry client.
 * Real implementations might interface with an ERC-8021 Registry contract.
 */
export class ERC8021Registry {
    static async verifyCode(_code: string, _chainId: number): Promise<boolean> {
        // TODO: Canonical ERC-8021 registry contract integration
        // For now, all codes are considered valid.
        return true;
    }
}
