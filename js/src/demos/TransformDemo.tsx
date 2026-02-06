import * as React from 'react';
import {
  Container,
  Text,
  Column,
  Scaffold,
  AppBar,
  SizedBox,
  Center,
  SingleChildScrollView,
} from 'fuickjs';

const Transform = 'Transform' as any;

export default function TransformDemo() {
  return (
    <Scaffold
      appBar={<AppBar title="Transform Demo" />}
    >
      <SingleChildScrollView>
        <Center>
          <Column padding={20} crossAxisAlignment="center">
            <Text text="Rotate (45 deg)" margin={{ bottom: 10 }} fontSize={16} />
            <Transform rotate={0.785} alignment="center">
              <Container width={100} height={100} color="#9C27B0" alignment="center">
                 <Text text="Rotated" color="white" />
              </Container>
            </Transform>

            <SizedBox height={60} />

            <Text text="Scale (1.5x)" margin={{ bottom: 10 }} fontSize={16} />
            <Transform scale={1.5} alignment="center">
              <Container width={80} height={80} color="#3F51B5" alignment="center">
                <Text text="Scaled" color="white" />
              </Container>
            </Transform>

            <SizedBox height={60} />

            <Text text="Translate (x: 20, y: 10)" margin={{ bottom: 10 }} fontSize={16} />
            <Container color="#DDDDDD" width={150} height={120}>
              <Transform translate={{ x: 20, y: 10 }}>
                <Container width={80} height={80} color="#009688" alignment="center">
                  <Text text="Translated" color="white" />
                </Container>
              </Transform>
            </Container>
          </Column>
        </Center>
      </SingleChildScrollView>
    </Scaffold>
  );
}
