import React from 'react';
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  SizedBox,
  Button,
  Row,
  Container,
  SoundService,
} from 'fuickjs';

export default function SoundServiceDemo() {
  const handleMove = () => {
    SoundService.play('move');
  };

  const handleCapture = () => {
    SoundService.play('capture');
  };

  const handleCheck = () => {
    SoundService.play('check');
  };

  const handleWin = () => {
    SoundService.play('win');
  };

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="Sound Service Demo" />} />}
    >
      <Column
        padding={20}
        crossAxisAlignment="center"
        mainAxisAlignment="center"
      >
        <Text text="Sound & Haptic Feedback" fontSize={20} fontWeight="bold" />
        <SizedBox height={10} />
        <Text text="Each button triggers a haptic + sound combo" fontSize={14} color="#666" />
        <SizedBox height={30} />

        <Row mainAxisAlignment="spaceEvenly">
          <Button text="Move (light)" onTap={handleMove} />
          <Button text="Capture (medium)" onTap={handleCapture} />
        </Row>

        <SizedBox height={20} />

        <Row mainAxisAlignment="spaceEvenly">
          <Button text="Check (heavy)" onTap={handleCheck} />
          <Button text="Win (heavy)" onTap={handleWin} />
        </Row>

        <SizedBox height={30} />
        <Container
          width={200}
          padding={10}
          color="#f0f0f0"
          alignment="center"
        >
          <Text
            text="SoundService.play(type)\nmove / capture / check / win"
            fontSize={12}
            textAlign="center"
            color="#555"
          />
        </Container>
      </Column>
    </Scaffold>
  );
}