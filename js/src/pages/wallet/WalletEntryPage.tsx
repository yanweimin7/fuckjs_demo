import React from "react";
import { AppBar, Button, Center, Column, Scaffold, useNavigator, Container } from "fuickjs";

export default function WalletEntryPage() {
  const navigator = useNavigator();

  return (
    <Scaffold appBar={<AppBar title="Fuick Wallet" />}>
      <Center>
        <Column crossAxisAlignment="center" mainAxisAlignment="center">
          <Button 
            text="Create New Wallet" 
            onTap={() => navigator.push("/wallet/create", {})} 
          />
          <Container height={20} />
          <Button 
            text="Import Wallet" 
            onTap={() => navigator.push("/wallet/import", {})} 
          />
        </Column>
      </Center>
    </Scaffold>
  );
}
