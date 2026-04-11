import React, { useState } from "react";
import {
  Scaffold, AppBar, SingleChildScrollView, Column, Text, Container, Padding, Row,
  Radio,
} from "fuickjs";

const FRUITS = ["苹果", "香蕉", "橙子", "葡萄"];
const COLORS = [
  { label: "红色", value: "red", color: "#F44336" },
  { label: "蓝色", value: "blue", color: "#2196F3" },
  { label: "绿色", value: "green", color: "#4CAF50" },
];

export default function RadioDemo() {
  const [fruit, setFruit] = useState("苹果");
  const [color, setColor] = useState("red");

  return (
    <Scaffold appBar={<AppBar title="Radio Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">

          <Text text="基础 Radio" fontSize={16} fontWeight="bold" />
          <Padding padding={{ top: 8 }}>
            <Column>
              {FRUITS.map((f) => (
                <Row key={f} crossAxisAlignment="center" padding={{ vertical: 4 }}>
                  <Radio
                    value={f}
                    groupValue={fruit}
                    onChanged={(v) => setFruit(v)}
                  />
                  <Text text={f} margin={{ left: 8 }} fontSize={15} />
                </Row>
              ))}
            </Column>
          </Padding>
          <Container
            padding={8}
            margin={{ top: 8 }}
            decoration={{ color: "#F5F5F5", borderRadius: 6 }}
          >
            <Text text={`选中: ${fruit}`} fontSize={13} color="#616161" />
          </Container>

          <Padding padding={{ top: 24 }}>
            <Text text="自定义 activeColor" fontSize={16} fontWeight="bold" />
          </Padding>
          <Padding padding={{ top: 8 }}>
            <Column>
              {COLORS.map((c) => (
                <Row key={c.value} crossAxisAlignment="center" padding={{ vertical: 4 }}>
                  <Radio
                    value={c.value}
                    groupValue={color}
                    activeColor={c.color}
                    onChanged={(v) => setColor(v)}
                  />
                  <Text text={c.label} margin={{ left: 8 }} color={c.color} fontSize={15} />
                </Row>
              ))}
            </Column>
          </Padding>
          <Container
            padding={8}
            margin={{ top: 8 }}
            decoration={{ color: "#F5F5F5", borderRadius: 6 }}
          >
            <Text text={`选中: ${color}`} fontSize={13} color="#616161" />
          </Container>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
