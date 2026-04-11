import React, { useState } from "react";
import { Switch, Text, Scaffold, AppBar, Row, Padding, Center } from "fuickjs";

export default function SwitchDemo() {
  const [value, setValue] = useState(false);

  return (
    <Scaffold appBar={<AppBar title="Switch Demo" />}>
      <Center>
        <Row crossAxisAlignment="center">
          <Text text={`Status: ${value ? "ON" : "OFF"}`} fontSize={18} />
          <Padding padding={{ left: 10 }}>
            <Switch value={value} onChanged={(v) => setValue(v)} />
          </Padding>
        </Row>
      </Center>
    </Scaffold>
  );
}
