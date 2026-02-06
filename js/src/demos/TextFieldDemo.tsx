import React, { useState } from "react";
import { TextField, Text, Scaffold, AppBar, Column, Padding } from "fuickjs";

export default function TextFieldDemo() {
  const [text, setText] = useState("");

  return (
    <Scaffold appBar={<AppBar title="TextField Demo" />}>
      <Padding padding={20}>
        <Column>
          <TextField
            hintText="Type something..."
            onChanged={(v) => setText(v)}
          />
          <Padding padding={{ top: 20 }}>
            <Text text={`Input: ${text}`} fontSize={18} />
          </Padding>
        </Column>
      </Padding>
    </Scaffold>
  );
}
