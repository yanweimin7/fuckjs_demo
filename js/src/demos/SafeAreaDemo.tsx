import React from "react";
import { SafeArea, Container, Text, Column, Expanded } from "fuickjs";

export default function SafeAreaDemo() {
  return (
    <Container color="#2196F3" height={1000}>
      <SafeArea>
        <Container color="#ffffff">
          <Column crossAxisAlignment="center">
            <Container height={50} color="#E3F2FD">
              <Text text="This is inside SafeArea" fontSize={18} />
            </Container>
            <Expanded>
              <Container alignment="center">
                <Text text="SafeArea avoids notches and status bars" />
              </Container>
            </Expanded>
            <Container height={50} color="#E3F2FD">
              <Text text="Bottom of SafeArea" fontSize={18} />
            </Container>
          </Column>
        </Container>
      </SafeArea>
    </Container>
  );
}
