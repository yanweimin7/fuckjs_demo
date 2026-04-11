import React from "react";
import { Row, Container, Scaffold, AppBar } from "fuickjs";

export default function RowDemo() {
  return (
    <Scaffold appBar={<AppBar title="Row Demo" />}>
      <Row crossAxisAlignment="center" mainAxisAlignment="spaceEvenly">
        <Container color="#ff0000" width={80} height={80} />
        <Container color="#00ff00" width={80} height={80} />
        <Container color="#0000ff" width={80} height={80} />
      </Row>
    </Scaffold>
  );
}
