import React, { useState } from "react";
import {
  Scaffold, AppBar, Column, Text, Container, Padding, Center, Row,
  FloatingActionButton, Icon,
} from "fuickjs";

export default function FloatingActionButtonDemo() {
  const [count, setCount] = useState(0);

  return (
    <Scaffold
      appBar={<AppBar title="FloatingActionButton Demo" />}
      floatingActionButton={
        <FloatingActionButton onPressed={() => setCount((c) => c + 1)}>
          <Icon icon="add" color="white" size={24} />
        </FloatingActionButton>
      }
    >
      <Center>
        <Column crossAxisAlignment="center">
          <Text text="点击右下角 FAB 按钮" fontSize={16} color="#616161" />
          <Padding padding={{ top: 16 }}>
            <Container
              padding={{ horizontal: 32, vertical: 16 }}
              decoration={{
                color: "#E3F2FD",
                borderRadius: 12,
                border: { color: "#90CAF9", width: 1 },
              }}
            >
              <Text
                text={`${count}`}
                fontSize={48}
                fontWeight="bold"
                color="#1565C0"
                textAlign="center"
              />
            </Container>
          </Padding>
          <Padding padding={{ top: 12 }}>
            <Text text="点击次数" fontSize={14} color="#9E9E9E" />
          </Padding>

          <Padding padding={{ top: 32 }}>
            <Row>
              <FloatingActionButton onPressed={() => setCount((c) => Math.max(0, c - 1))}>
                <Icon icon="remove" color="white" size={24} />
              </FloatingActionButton>
              <Container width={16} />
              <FloatingActionButton onPressed={() => setCount(0)}>
                <Icon icon="refresh" color="white" size={24} />
              </FloatingActionButton>
            </Row>
          </Padding>
          <Text text="减少 / 重置" fontSize={12} color="#9E9E9E" margin={{ top: 8 }} />
        </Column>
      </Center>
    </Scaffold>
  );
}
