import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class WalletDemoPage extends StatelessWidget {
  const WalletDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fuick Web3 Wallet'),
      ),
      body: const FuickAppView(
        appName: 'wallet_app', // Using shared bundle, but logically separating
        initialRoute: '/wallet/entry',
        initialParams: {},
      ),
    );
  }
}
