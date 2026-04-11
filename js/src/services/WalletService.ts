export interface WalletAccount {
    mnemonic?: string;
    address: string;
    privateKey: string;
}

export class WalletService {
    static ping(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.ping', {});
    }

    static createWallet(): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.createWallet', {});
    }

    static importWallet(mnemonic: string): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.importWallet', { mnemonic });
    }

    static getBalance(rpcUrl: string, address: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.getBalance', { rpcUrl, address });
    }

    static transfer(rpcUrl: string, privateKey: string, to: string, amount: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.transfer', { rpcUrl, privateKey, to, amount });
    }
}
