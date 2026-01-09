import React from 'react';
import { Container, Text, Center, Button, Column, Navigator } from 'fuick_js_framework';

export const TestPage1 = () => {
  return (
    <Container color="#f0f2f5">
      <Center>

        <Column crossAxisAlignment="center">
          <Text text="Test Page 1" fontSize={24} color="#1a1a1a" />
          <Text text="This is a page from the new test project." fontSize={16} color="#666666" padding={{ top: 10, bottom: 20 }} />
          <Button text="Click Me" onTap={() => Navigator.push('/test2', {})} />
        </Column>

      </Center>
    </Container>
  );
};
