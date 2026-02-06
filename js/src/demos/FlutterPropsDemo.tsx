import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Icon,
  Column,
  Button,
  GestureDetector,
  Center,
} from "fuickjs";

// Mock FloatingActionButton since it's not exported
const FloatingActionButton = (props: {
  onPressed?: () => void;
  child?: React.ReactNode;
}) =>
  React.createElement(
    "FloatingActionButton",
    { ...props, isBoundary: true },
    props.child,
  );

export default function FlutterPropsDemo() {
  const [count, setCount] = useState(0);
  const [showAction, setShowAction] = useState(true);
  const [fabVisible, setFabVisible] = useState(true);

  return (
    <Scaffold
      appBar={
        <AppBar
          title={<Text text={`FlutterProps Demo ${count}`} />}
          actions={
            showAction
              ? [
                  <GestureDetector
                    key="btn1"
                    onTap={() => console.log("Action 1 pressed")}
                  >
                    <Icon name="add" />
                  </GestureDetector>,
                  <GestureDetector
                    key="btn2"
                    onTap={() => console.log("Action 2 pressed")}
                  >
                    <Icon name="remove" />
                  </GestureDetector>,
                ]
              : []
          }
        />
      }
      floatingActionButton={
        fabVisible ? (
          <FloatingActionButton
            onPressed={() => {
              setCount((c) => c + 1);
            }}
            child={<Icon name="add" />}
          />
        ) : null
      }
    >
      <Center>
        <Column mainAxisAlignment="center">
          <Text text={`Count: ${count}`} />
          <Button
            text="Toggle Actions"
            onTap={() => setShowAction((s) => !s)}
          />
          <Button text="Toggle FAB" onTap={() => setFabVisible((v) => !v)} />
        </Column>
      </Center>
    </Scaffold>
  );
}
