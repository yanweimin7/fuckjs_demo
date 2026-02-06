
import 'package:flutter_test/flutter_test.dart';
import 'package:bip39/bip39.dart' as bip39;
import 'package:bip32/bip32.dart' as bip32;
import 'package:web3dart/web3dart.dart';
import 'package:hex/hex.dart';

void main() {
  test('Wallet creation logic', () async {
    final mnemonic = bip39.generateMnemonic();
    print("Mnemonic: $mnemonic");
    expect(mnemonic, isNotEmpty);

    final seed = bip39.mnemonicToSeed(mnemonic);
    final root = bip32.BIP32.fromSeed(seed);
    final child = root.derivePath("m/44'/60'/0'/0/0");
    final privateKeyList = child.privateKey!;
    
    final privateKey = EthPrivateKey(privateKeyList);
    final address = privateKey.address;

    print("Address: ${address.hex}");
    print("Private Key: ${HEX.encode(privateKeyList)}");

    expect(address.hex, startsWith("0x"));
    expect(privateKeyList.length, 32);
  });
}
