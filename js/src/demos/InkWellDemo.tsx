import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  InkWell,
  Container,
  Center,
  Text,
  Column,
  Padding,
} from "fuickjs";

export default function InkWellDemo() {
  const [count, setCount] = useState(0);

  return (
    <Scaffold appBar={<AppBar title="InkWell Demo" />}>
      <Center>
        <Column mainAxisAlignment="center">
          <Text text={`Count: ${count}`} fontSize={24} fontWeight="bold" />

          <Padding padding={20}>
            <InkWell onTap={() => setCount(count + 1)}>
              <Container
                width={200}
                height={60}
                color="#2196F3"
                borderRadius={8}
              >
                <Center>
                  <Text text="Click with Ripple" color="white" />
                </Center>
              </Container>
            </InkWell>
          </Padding>

          <Padding padding={10}>
            <InkWell onTap={() => setCount(0)}>
              <Container
                width={150}
                height={40}
                border={{ color: "#F44336", width: 1 }}
                borderRadius={20}
              >
                <Center>
                  <Text text="Reset" color="#F44336" />
                </Center>
              </Container>
            </InkWell>
          </Padding>
        </Column>
      </Center>
    </Scaffold>
  );
}
