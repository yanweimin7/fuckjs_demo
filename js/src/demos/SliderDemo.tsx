import React, { useState } from "react";
import {
  Scaffold, AppBar, SingleChildScrollView, Column, Text, Container, Padding, Row,
  Slider, LinearProgressIndicator,
} from "fuickjs";

export default function SliderDemo() {
  const [val1, setVal1] = useState(0.5);
  const [val2, setVal2] = useState(30);
  const [val3, setVal3] = useState(0);

  return (
    <Scaffold appBar={<AppBar title="Slider Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">

          <Text text="基础 Slider（0.0 ~ 1.0）" fontSize={16} fontWeight="bold" />
          <Padding padding={{ top: 8, bottom: 4 }}>
            <Slider value={val1} min={0} max={1} onChanged={(v) => setVal1(v)} />
          </Padding>
          <Text text={`值: ${val1.toFixed(2)}`} fontSize={13} color="#616161" />

          <Padding padding={{ top: 20 }}>
            <Text text="自定义范围（0 ~ 100，step=5）" fontSize={16} fontWeight="bold" />
          </Padding>
          <Padding padding={{ top: 8, bottom: 4 }}>
            <Slider value={val2} min={0} max={100} step={5} onChanged={(v) => setVal2(v)} />
          </Padding>
          <Text text={`值: ${val2}`} fontSize={13} color="#616161" />

          <Padding padding={{ top: 20 }}>
            <Text text="自定义颜色" fontSize={16} fontWeight="bold" />
          </Padding>
          <Padding padding={{ top: 8, bottom: 4 }}>
            <Slider
              value={val3}
              min={0}
              max={1}
              activeColor="#E91E63"
              inactiveColor="#F8BBD0"
              onChanged={(v) => setVal3(v)}
            />
          </Padding>
          <Text text={`值: ${val3.toFixed(2)}`} fontSize={13} color="#E91E63" />

          <Padding padding={{ top: 24 }}>
            <Text text="LinearProgressIndicator（跟随 val2）" fontSize={16} fontWeight="bold" />
          </Padding>
          <Padding padding={{ top: 12 }}>
            <Row crossAxisAlignment="center">
              <Text text="进度：" />
              <Container width={200}>
                <LinearProgressIndicator
                  value={val2 / 100}
                  color="#1976D2"
                  backgroundColor="#BBDEFB"
                  strokeWidth={8}
                  borderRadius={4}
                />
              </Container>
              <Text text={`${val2}%`} margin={{ left: 8 }} fontSize={13} color="#1976D2" />
            </Row>
          </Padding>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
