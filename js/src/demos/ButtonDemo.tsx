import React, { useState } from "react";
import { Button, Text, Scaffold, AppBar, Column, Center } from "fuickjs";

export default function ButtonDemo() {
  const [count, setCount] = useState(0);

  return (
    <Scaffold appBar={<AppBar title="Button Demo" />}>
      <Center>
        <Column crossAxisAlignment="center">
          <Text text={`Count: ${count}`} fontSize={24} />
          <Button onTap={() => setCount(count + 1)} text="Click Me" />
        </Column>
      </Center>
    </Scaffold>
  );
}
