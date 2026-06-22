import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Align,
  Container,
  Center,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Divider,
  Wrap,
  Button,
} from "fuickjs";

type AlignmentKey =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "centerLeft"
  | "center"
  | "centerRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

const alignments: AlignmentKey[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "center",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

const factorOptions: (number | null)[] = [null, 0.5, 0.25];

export default function AlignDemo() {
  const [align, setAlign] = useState<AlignmentKey>("center");
  const [widthFactor, setWidthFactor] = useState<number | null>(null);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Align" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="Align 通过 alignment / widthFactor / heightFactor 精确控制子组件在父容器内的位置。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={16} />

            <Text text="1. alignment 切换" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />

            <Container
              color="#FFF3E0"
              width={300}
              height={180}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Align alignment={align}>
                <Container
                  width={70}
                  height={50}
                  decoration={{ color: "#1976D2", borderRadius: 6 }}
                >
                  <Center>
                    <Text text="box" color="white" fontSize={13} />
                  </Center>
                </Container>
              </Align>
            </Container>

            <SizedBox height={8} />
            <Wrap spacing={8}>
              {alignments.map((a) => (
                <Button
                  key={a}
                  text={a}
                  onTap={() => setAlign(a)}
                  backgroundColor={a === align ? "#1976D2" : "#9E9E9E"}
                />
              ))}
            </Wrap>

            <Divider />

            <Text
              text="2. widthFactor 缩紧容器"
              fontSize={16}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text="widthFactor 非 null 时，Align 自身宽度 = 子节点宽度 × factor。"
              fontSize={13}
              color="#666666"
            />
            <SizedBox height={8} />
            <Row>
              <Text text={`widthFactor: ${widthFactor ?? "null"}`} />
              <Padding padding={{ left: 12 }}>
                <Wrap spacing={8}>
                  {factorOptions.map((f) => (
                    <Button
                      key={String(f)}
                      text={`set ${f ?? "null"}`}
                      onTap={() => setWidthFactor(f)}
                      backgroundColor={
                        f === widthFactor ? "#9C27B0" : "#9E9E9E"
                      }
                    />
                  ))}
                </Wrap>
              </Padding>
            </Row>
            <SizedBox height={8} />
            <Container
              color="#FAFAFA"
              width={300}
              decoration={{ color: "#FAFAFA", borderRadius: 8 }}
            >
              <Align alignment="center" widthFactor={widthFactor}>
                <Container
                  width={120}
                  height={40}
                  decoration={{ color: "#9C27B0", borderRadius: 4 }}
                >
                  <Center>
                    <Text text="child 120x40" color="white" fontSize={12} />
                  </Center>
                </Container>
              </Align>
            </Container>
            <SizedBox height={8} />
            <Text
              text="外层 Container 灰色背景便于观察 Align 实际占位（widthFactor 生效时灰色区域也会被压缩）。"
              fontSize={12}
              color="#888888"
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
