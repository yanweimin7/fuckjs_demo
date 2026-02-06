import React from "react";
import { Column, Container, Scaffold, AppBar } from "fuickjs";

export default function ColumnDemo() {
  return (
    <Scaffold appBar={<AppBar title="Column Demo" />}>
      <Column crossAxisAlignment="center" mainAxisAlignment="center">
        <Container color="#ff0000" width={100} height={100} />
        <Container color="#00ff00" width={100} height={100} />
        <Container color="#0000ff" width={100} height={100} />
      </Column>
    </Scaffold>
  );
}
