import React from "react";
import {
  Column,
  Text,
  CircularProgressIndicator,
  Scaffold,
  AppBar,
  Center,
  Padding,
} from "fuickjs";

export default function ProgressDemo() {
  return (
    <Scaffold appBar={<AppBar title="Progress Demo" />}>
      <Center>
        <Column crossAxisAlignment="center">
          <Padding padding={20}>
            <CircularProgressIndicator />
          </Padding>
          <Text text="Loading..." fontSize={16} />

          <Padding padding={40}>
            <CircularProgressIndicator color="#FF0000" strokeWidth={5} />
          </Padding>
          <Text text="Custom Progress" fontSize={16} />
        </Column>
      </Center>
    </Scaffold>
  );
}
