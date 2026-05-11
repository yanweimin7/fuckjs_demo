import React, { useState } from 'react';
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  Button,
  Center,
  Overlay,
} from 'fuickjs';

export default function OverlayDemo() {
  const [showSimple, setShowSimple] = useState(false);
  const [showFull, setShowFull] = useState(false);

  return (
    <Scaffold appBar={<AppBar title="Overlay Demo" />}>
      <Column padding={16} crossAxisAlignment="center">
        <Button
          text={showSimple ? 'Hide Simple Overlay' : 'Show Simple Overlay'}
          onTap={() => setShowSimple(!showSimple)}
          margin={{ bottom: 10 }}
        />
        <Button
          text={showFull ? 'Hide Full Overlay' : 'Show Full Overlay'}
          onTap={() => setShowFull(!showFull)}
        />
      </Column>

      <Overlay visible={showSimple} overlayKey="simple">
        <Center>
          <Container
            color="#AA000000"
            padding={20}
            borderRadius={8}
          >
            <Text text="Simple Overlay" color="white" />
            <Button
              text="Close"
              onTap={() => setShowSimple(false)}
            />
          </Container>
        </Center>
      </Overlay>

      <Overlay visible={showFull} overlayKey="fullscreen">
        <Container color="#88000000">
          <Center>
            <Container
              color="white"
              padding={30}
              borderRadius={16}
            >
              <Column>
                <Text
                  text="Full Screen Overlay"
                  fontSize={20}
                  fontWeight="bold"
                  margin={{ bottom: 20 }}
                />
                <Button
                  text="Close"
                  onTap={() => setShowFull(false)}
                />
              </Column>
            </Container>
          </Center>
        </Container>
      </Overlay>
    </Scaffold>
  );
}
