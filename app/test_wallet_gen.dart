import 'package:bip39/bip39.dart' as bip39;
import 'package:bip32/bip32.dart' as bip32;
import 'package:hex/hex.dart';
import 'package:web3dart/web3dart.dart';

void main() {
  try {
    print("Start generating...");
    // 1. Generate Mnemonic
    final mnemonic = bip39.generateMnemonic();
    print("Mnemonic: $mnemonic");

    // 2. Seed
    final seed = bip39.mnemonicToSeed(mnemonic);
    print("Seed generated, length: ${seed.length}");

    // 3. BIP32 Root
    final root = bip32.BIP32.fromSeed(seed);
    print("Root key generated");

    // 4. Derive Path
    final child = root.derivePath("m/44'/60'/0'/0/0");
    print("Derived path m/44'/60'/0'/0/0");

    final privateKeyList = child.privateKey!;
    print("Private key bytes: ${privateKeyList.length}");

    // 5. Eth Address
    final privateKey = EthPrivateKey(privateKeyList);
    final address = privateKey.address;
    print("Address: ${address.hex}");
    print("Private Key Hex: ${HEX.encode(privateKeyList)}");

    print("Test passed successfully!");
  } catch (e, stack) {
    print("Error: $e");
    print(stack);
  }
}
