import React, { useEffect, useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, useNavigator, Container, Text, CircularProgressIndicator, Padding } from "fuickjs";
import { WalletService, WalletAccount } from "../../services/WalletService";

export default function CreateWalletPage() {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Debug: Check connectivity
    WalletService.ping().then(res => console.log("Wallet Service Ping:", res)).catch(e => console.error("Wallet Service Ping Failed:", e));

    WalletService.createWallet().then(w => {
      if (w) {
        setWallet(w);
      } else {
        setError("Wallet creation returned null");
      }
      setLoading(false);
    }).catch(e => {
      console.error("Failed to create wallet", e);
      setError("Failed: " + (e.message || e.toString()));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Scaffold appBar={<AppBar title="Create Wallet" />}>
        <Center>
          <CircularProgressIndicator />
          <Container height={20} />
          <Text text="Generating Wallet..." />
        </Center>
      </Scaffold>
    );
  }

  if (error) {
    return (
      <Scaffold appBar={<AppBar title="Error" />}>
        <Center>
          <Text text={error} color="red" />
          <Container height={20} />
          <Button text="Retry" onTap={() => navigator.pop()} />
        </Center>
      </Scaffold>
    );
  }

  return (
    <Scaffold appBar={<AppBar title="New Wallet Created" />}>
      <Padding padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="Mnemonic (Keep Secret!):" fontWeight="bold" />
          <Container padding={10} color="#eeeeee">
            <Text text={wallet?.mnemonic || ""} />
          </Container>

          <Container height={20} />

          <Text text="Address:" fontWeight="bold" />
          <Text text={wallet?.address || ""} />

          <Container height={20} />

          <Text text="Private Key:" fontWeight="bold" />
          <Text text={wallet?.privateKey || ""} />

          <Container height={40} />

          <Center>
            <Button
              text="Go to Wallet Home"
              onTap={() => navigator.push("/wallet/home", { ...wallet })}
            />
          </Center>
        </Column>
      </Padding>
    </Scaffold>
  );
}
