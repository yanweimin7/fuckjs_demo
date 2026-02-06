import React, { useState } from "react";
import {
  GestureDetector,
  Container,
  Text,
  Scaffold,
  AppBar,
  Center,
  Column,
  Padding,
} from "fuickjs";

export default function GestureDetectorDemo() {
  const [status, setStatus] = useState("Idle");
  const [color, setColor] = useState("#2196F3");

  return (
    <Scaffold appBar={<AppBar title="GestureDetector Demo" />}>
      <Center>
        <Column crossAxisAlignment="center">
          <Text text={`Status: ${status}`} fontSize={20} />
          <Padding padding={20}>
            <GestureDetector
              onTap={() => {
                setStatus("Tapped!");
                setColor("#4CAF50");
              }}
              onLongPress={() => {
                setStatus("Long Pressed!");
                setColor("#F44336");
              }}
              onDoubleTap={() => {
                setStatus("Double Tapped!");
                setColor("#FFEB3B");
              }}
            >
              <Container
                width={200}
                height={200}
                color={color}
                borderRadius={100}
              >
                <Center>
                  <Text text="Interact Me" color="#000000" fontWeight="bold" />
                </Center>
              </Container>
            </GestureDetector>
          </Padding>
          <Text
            text="Tap, Long Press or Double Tap"
            fontSize={14}
            color="#666666"
          />
        </Column>
      </Center>
    </Scaffold>
  );
}
