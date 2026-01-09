import React, { useState } from 'react';
import { Container, Text, Center, GestureDetector, Column, Padding } from 'fuick_js_framework';

export const TestPage2 = () => {
  const [count, setCount] = useState(0);

  return (
    <Container color="#e3f2fd">
      <Center>
        <Container
          padding={30}
          color="#ffffff"
          borderRadius={20}
        >
          <Column crossAxisAlignment="center">
            <Text text="Interactive Test Page" fontSize={20} color="#1976d2" padding={{ bottom: 20 }} />

            <Text text={String(count)} fontSize={48} color="#0d47a1" />

            <GestureDetector onTap={() => setCount(count + 1)}>
              <Container
                padding={{ left: 40, right: 40, top: 15, bottom: 15 }}
                color="#2196f3"
                borderRadius={30}
                margin={{ top: 30 }}
              >
                <Text text="Tap to Increase" color="#ffffff" fontSize={18} />
              </Container>
            </GestureDetector>

            <GestureDetector onTap={() => setCount(0)}>
              <Padding padding={{ top: 20 }}>
                <Text text="Reset Counter" color="#9e9e9e" fontSize={14} />
              </Padding>
            </GestureDetector>
          </Column>
        </Container>
      </Center>
    </Container>
  );
};
