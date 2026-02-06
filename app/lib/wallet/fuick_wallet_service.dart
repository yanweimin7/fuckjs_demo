import 'package:bip32/bip32.dart' as bip32;
import 'package:bip39/bip39.dart' as bip39;
import 'package:flutter/foundation.dart';
import 'package:fuickjs_flutter/core/service/BaseFuickService.dart';
import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

// Top-level function for compute
Future<Map<String, String>> _generateWalletTask(String? mnemonic) async {
  final validMnemonic = mnemonic ?? bip39.generateMnemonic();
  final seed = bip39.mnemonicToSeed(validMnemonic);

  // Use BIP32 for standard Ethereum derivation path
  final root = bip32.BIP32.fromSeed(seed);
  // m/44'/60'/0'/0/0
  final child = root.derivePath("m/44'/60'/0'/0/0");
  final privateKeyList = child.privateKey!;

  final privateKey = EthPrivateKey(privateKeyList);
  final address = privateKey.address;

  return {
    'mnemonic': validMnemonic,
    'address': address.hex,
    'privateKey': HEX.encode(privateKeyList),
  };
}

class FuickWalletService extends BaseFuickService {
  @override
  String get name => "Wallet";

  FuickWalletService() {
    registerAsyncMethod('ping', (args) async {
      return "pong";
    });

    registerAsyncMethod('createWallet', (args) async {
      try {
        // Run in a separate isolate to avoid blocking the UI thread
        final result = await compute<String?, Map<String, String>>(
            _generateWalletTask, null);
        return result;
      } catch (e, stack) {
        print(stack);
        rethrow;
      }
    });

    registerAsyncMethod('importWallet', (args) async {
      if (args is Map) {
        final mnemonic = args['mnemonic'];
        try {
          // Run in a separate isolate
          final result = await compute<String?, Map<String, String>>(
              _generateWalletTask, mnemonic);
          return result;
        } catch (e, stack) {
          print(stack);
          rethrow;
        }
      }
      return null;
    });

    registerAsyncMethod('getBalance', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final address = args['address'];
        if (rpcUrl != null && address != null) {
          final client = Web3Client(rpcUrl, Client());
          try {
            final ethAddress = EthereumAddress.fromHex(address);
            final balance = await client.getBalance(ethAddress);
            return balance.getValueInUnit(EtherUnit.ether).toString();
          } catch (e) {
            print("Get balance error: $e");
            rethrow;
          } finally {
            client.dispose();
          }
        }
      }
      return "0";
    });

    registerAsyncMethod('transfer', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final privateKey = args['privateKey'];
        final to = args['to'];
        final amount = args['amount'];

        if (rpcUrl != null &&
            privateKey != null &&
            to != null &&
            amount != null) {
          final client = Web3Client(rpcUrl, Client());
          try {
            final credentials = EthPrivateKey.fromHex(privateKey);
            final toAddress = EthereumAddress.fromHex(to);
            final amountEther = EtherAmount.fromUnitAndValue(
                EtherUnit.ether, double.parse(amount.toString()));

            final transaction = Transaction(
              to: toAddress,
              value: amountEther,
              maxGas: 21000,
            );

            // Send transaction
            // Note: In production you should estimate gas, get gas price etc.
            // For simple transfer, sendTransaction handles signing and broadcasting
            final txHash = await client.sendTransaction(
              credentials,
              transaction,
              chainId: null, // Let the client figure it out or pass it if known
            );
            return txHash;
          } catch (e) {
            print("Transfer error: $e");
            rethrow;
          } finally {
            client.dispose();
          }
        }
      }
      return null;
    });
  }
}
