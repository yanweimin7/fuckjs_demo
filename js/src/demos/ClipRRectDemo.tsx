import * as React from 'react';
import {
  Container,
  Text,
  Scaffold,
  AppBar,
  Center,
} from 'fuickjs';

const ClipRRect = 'ClipRRect' as any;

export default function ClipRRectDemo() {
  return (
    <Scaffold
      appBar={<AppBar title="ClipRRect Demo" />}
    >
      <Center>
        <ClipRRect borderRadius={20} clipBehavior="hardEdge">
          <Container
            width={200}
            height={200}
            color="#FF5722"
            alignment="center"
          >
            <Text text="Rounded Corners" color="#FFFFFF" fontWeight="bold" fontSize={24} />
          </Container>
        </ClipRRect>
      </Center>
    </Scaffold>
  );
}
