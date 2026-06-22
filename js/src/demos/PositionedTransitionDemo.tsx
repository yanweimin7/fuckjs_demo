import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Stack,
  PositionedTransition,
  Container,
  Center,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Divider,
  Button,
  Row,
} from "fuickjs";

interface RectInput {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const presets: { label: string; value: RectInput }[] = [
  { label: "原点", value: { left: 0, top: 0, right: 0, bottom: 0 } },
  { label: "左上", value: { left: 20, top: 20, right: 0, bottom: 0 } },
  { label: "居中", value: { left: 80, top: 60, right: 80, bottom: 60 } },
  { label: "右下", value: { left: 0, top: 0, right: 20, bottom: 20 } },
];

export default function PositionedTransitionDemo() {
  const [end, setEnd] = useState<RectInput>({ left: 0, top: 0, right: 0, bottom: 0 });

  return (
    <Scaffold appBar={<AppBar title={<Text text="PositionedTransition" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="PositionedTransition 必须放在 Stack 内；本 demo 用静态终态版（AlwaysStoppedAnimation），begin 默认 RelativeRect.zero。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={16} />

            <Text text="1. end 矩形选择" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#FFF3E0"
              width={300}
              height={220}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Stack>
                <PositionedTransition end={end}>
                  <Container
                    width={100}
                    height={100}
                    decoration={{ color: "#1976D2", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="100x100" color="white" fontSize={12} />
                    </Center>
                  </Container>
                </PositionedTransition>
              </Stack>
            </Container>

            <SizedBox height={8} />
            <Text
              text={`end = { left: ${end.left}, top: ${end.top}, right: ${end.right}, bottom: ${end.bottom} }`}
              fontSize={12}
            />
            <SizedBox height={8} />
            <Row>
              {presets.map((p) => (
                <Button
                  key={p.label}
                  text={p.label}
                  onTap={() => setEnd(p.value)}
                  backgroundColor="#9C27B0"
                />
              ))}
            </Row>

            <Divider />

            <Text text="2. 端点含义" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#E3F2FD"
              decoration={{ color: "#E3F2FD", borderRadius: 8 }}
            >
              <Padding padding={16}>
                <Column crossAxisAlignment="start">
                  <Text text="• left/top: 子节点距 Stack 左/上边的偏移（像素）。" />
                  <Text text="• right/bottom: 子节点距 Stack 右/下边的偏移；为 0 表示贴边。" />
                  <Text text="• 实际位置 = Stack 边长 - 子节点尺寸 - 对应端点值。" />
                </Column>
              </Padding>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
