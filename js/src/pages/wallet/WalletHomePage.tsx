import React, { useEffect, useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, Container, Text, TextField, Padding, CircularProgressIndicator, Row } from "fuickjs";
import { WalletService, WalletAccount } from "../../services/WalletService";

// Default RPC (Sepolia)
const RPC_URL = "https://sepolia.drpc.org"; 

export default function WalletHomePage(props: WalletAccount) {
  const [balance, setBalance] = useState("Loading...");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      fetchBalance();
  }, []);

  const fetchBalance = () => {
      WalletService.getBalance(RPC_URL, props.address)
        .then(setBalance)
        .catch(e => setBalance("Error"));
  };

  const handleTransfer = async () => {
      if (!toAddress || !amount) return;
      setLoading(true);
      setTxHash("");
      try {
          const hash = await WalletService.transfer(RPC_URL, props.privateKey, toAddress, amount);
          setTxHash(hash);
          setLoading(false);
          fetchBalance();
      } catch (e) {
          console.error("Transfer failed", e);
          setLoading(false);
          setTxHash("Failed");
      }
  };

  return (
    <Scaffold appBar={<AppBar title="My Wallet" />}>
      <Padding padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="Address:" fontWeight="bold" />
          <Container padding={10} color="#eeeeee">
            <Text text={props.address} fontSize={12} />
          </Container>
          
          <Container height={20} />
          
          <Text text="Balance (ETH):" fontWeight="bold" />
          <Row mainAxisAlignment="spaceBetween">
              <Text text={balance} fontSize={20} color="green" />
              <Button text="Refresh" onTap={fetchBalance} />
          </Row>
          
          <Container height={40} />
          <Text text="Transfer:" fontWeight="bold" fontSize={18} />
          <Container height={10} />
          
          <TextField 
             hintText="To Address" 
             onChanged={setToAddress}
          />
          <Container height={10} />
          <TextField 
             hintText="Amount (ETH)" 
             onChanged={setAmount}
          />
          
          <Container height={20} />
          
          {loading ? (
              <Center><CircularProgressIndicator /></Center>
          ) : (
              <Center>
                <Button 
                    text="Send Transaction" 
                    onTap={handleTransfer} 
                />
              </Center>
          )}
          
          {txHash && (
              <Column>
                  <Container height={20} />
                  <Text text="Transaction Hash:" fontWeight="bold" />
                  <Text text={txHash} fontSize={10} />
              </Column>
          )}
        </Column>
      </Padding>
    </Scaffold>
  );
}
