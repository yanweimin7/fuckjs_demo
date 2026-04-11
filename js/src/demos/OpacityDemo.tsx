import React, { useState } from "react";
import {
  Column,
  Text,
  Opacity,
  Scaffold,
  AppBar,
  Padding,
  Container,
  Button,
} from "fuickjs";

export default function OpacityDemo() {
  const [opacity, setOpacity] = useState(1.0);

  return (
    <Scaffold appBar={<AppBar title="Opacity Demo" />}>
      <Padding padding={20}>
        <Column crossAxisAlignment="center">
          <Opacity opacity={opacity}>
            <Container color="#ff0000" width={200} height={200} />
          </Opacity>
          <Padding padding={{ top: 20 }}>
            <Text text={`Opacity: ${opacity.toFixed(1)}`} fontSize={18} />
          </Padding>
          <Padding padding={{ top: 20 }}>
            <Button
              onTap={() => setOpacity(opacity > 0.1 ? opacity - 0.2 : 1.0)}
              text="Change Opacity"
            />
          </Padding>
        </Column>
      </Padding>
    </Scaffold>
  );
}
