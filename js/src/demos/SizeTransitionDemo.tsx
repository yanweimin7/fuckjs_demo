import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  SizeTransition,
  Container,
  Center,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Divider,
  Button,
  Row,
  Wrap,
} from "fuickjs";

const sizeOptions = [0.0, 0.25, 0.5, 0.75, 1.0];
const axisOptions: { value: "horizontal" | "vertical"; label: string }[] = [
  { value: "vertical", label: "vertical" },
  { value: "horizontal", label: "horizontal" },
];
const alignmentOptions = [
  "topLeft",
  "center",
  "bottomRight",
];

export default function SizeTransitionDemo() {
  const [sizeFactor, setSizeFactor] = useState(1.0);
  const [axis, setAxis] = useState<"horizontal" | "vertical">("vertical");
  const [axisAlignment, setAxisAlignment] = useState<string>("center");

  return (
    <Scaffold appBar={<AppBar title={<Text text="SizeTransition" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="SizeTransition 在静态终态下通过 sizeFactor 控制子节点沿 axis 方向缩放，axisAlignment 控制另一轴对齐。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={16} />

            <Text text="1. sizeFactor 调节" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#FFF3E0"
              width={300}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Center>
                <SizeTransition
                  sizeFactor={sizeFactor}
                  axis={axis}
                  axisAlignment={axisAlignment}
                >
                  <Container
                    width={180}
                    height={120}
                    decoration={{ color: "#1976D2", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="child 180x120" color="white" />
                    </Center>
                  </Container>
                </SizeTransition>
              </Center>
            </Container>

            <SizedBox height={8} />
            <Text text={`sizeFactor = ${sizeFactor.toFixed(2)}`} />
            <SizedBox height={8} />
            <Wrap spacing={8}>
              {sizeOptions.map((s) => (
                <Button
                  key={s}
                  text={s.toString()}
                  onTap={() => setSizeFactor(s)}
                  backgroundColor={
                    Math.abs(s - sizeFactor) < 0.01 ? "#1976D2" : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>

            <Divider />

            <Text text="2. axis 切换" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Row>
              {axisOptions.map((a) => (
                <Button
                  key={a.value}
                  text={a.label}
                  onTap={() => setAxis(a.value)}
                  backgroundColor={axis === a.value ? "#43A047" : "#9E9E9E"}
                />
              ))}
            </Row>

            <Divider />

            <Text text="3. axisAlignment 切换" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="值映射: top* -> 0.0, center* -> 0.5, bottom* -> 1.0"
              fontSize={12}
              color="#888888"
            />
            <SizedBox height={8} />
            <Row>
              {alignmentOptions.map((a) => (
                <Button
                  key={a}
                  text={a}
                  onTap={() => setAxisAlignment(a)}
                  backgroundColor={
                    axisAlignment === a ? "#9C27B0" : "#9E9E9E"
                  }
                />
              ))}
            </Row>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
