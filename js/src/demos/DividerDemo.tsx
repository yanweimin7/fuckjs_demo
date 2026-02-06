import React from "react";
import { Column, Text, Divider, Scaffold, AppBar, Padding } from "fuickjs";

export default function DividerDemo() {
  return (
    <Scaffold appBar={<AppBar title="Divider Demo" />}>
      <Padding padding={20}>
        <Column>
          <Text text="Item 1" fontSize={18} />
          <Divider height={20} thickness={2} color="#eeeeee" />
          <Text text="Item 2" fontSize={18} />
          <Divider height={40} thickness={5} color="#2196F3" />
          <Text text="Item 3" fontSize={18} />
        </Column>
      </Padding>
    </Scaffold>
  );
}
