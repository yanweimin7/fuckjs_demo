import React, { useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, useNavigator, Container, Text, TextField, Padding } from "fuickjs";
import { WalletService, WalletAccount } from "../../services/WalletService";

export default function ImportWalletPage() {
  const navigator = useNavigator();
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }
    setLoading(true);
    setError("");

    WalletService.importWallet(mnemonic)
      .then(wallet => {
        setLoading(false);
        if (wallet && wallet.address) {
          // Navigate to wallet home or show success
          console.log("Wallet imported:", wallet);
          // Navigate to wallet home, passing wallet properties directly as props
          navigator.push("/wallet/home", wallet);
        } else {
          setError("Invalid mnemonic or import failed");
        }
      })
      .catch(e => {
        console.error("Import failed", e);
        setLoading(false);
        setError("Import failed: " + (e.message || "Unknown error"));
      });
  };

  return (
    <Scaffold appBar={<AppBar title="Import Wallet" />}>
      <Padding padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="Enter Mnemonic Phrase:" fontWeight="bold" />
          <Container height={10} />
          <TextField
            text={mnemonic}
            onChanged={(val) => setMnemonic(val)}
            maxLines={3}
            decoration={{
              hintText: "separate words with spaces",
              border: { width: 1, color: "#cccccc" }
            }}
          />
          <Container height={20} />
          {error ? <Text text={error} color="red" /> : null}
          <Container height={20} />
          <Button
            text={loading ? "Importing..." : "Import Wallet"}
            onTap={loading ? undefined : handleImport}
          />
        </Column>
      </Padding>
    </Scaffold>
  );
}
