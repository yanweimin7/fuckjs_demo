import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  AnimatedSize,
  Container,
  Center,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Wrap,
  Button,
  Divider,
} from "fuickjs";

/**
 * AnimatedSize：子节点尺寸变化时自动插值过渡。
 *
 * 使用方式：包裹一个会动态改变 size 的子节点（通过 state 控制 width/height），
 * 切换状态时即触发动画。常用于展开/折叠、显示/隐藏容器。
 */
export default function AnimatedSizeDemo() {
  const [expanded, setExpanded] = useState(false);
  const [boxSize, setBoxSize] = useState(120);
  const [duration, setDuration] = useState(300);
  const [curve, setCurve] = useState<
    "easeInOut" | "easeIn" | "easeOut" | "linear" | "fastOutSlowIn"
  >("easeInOut");
  const [axis, setAxis] = useState<"none" | "horizontal" | "vertical">("none");

  return (
    <Scaffold appBar={<AppBar title={<Text text="AnimatedSize" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="AnimatedSize：包裹动态尺寸子节点，切换时自动过渡。"
              fontSize={14}
              color="#666666"
            />
          </Column>
        </Padding>

        <Container color="#F5F5F5" height={1} />

        {/* 1. 展开/折叠 */}
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="1. 展开 / 折叠（受控 visibility）"
              fontSize={15}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text="通过 width/height 0↔target 触发尺寸插值。"
              fontSize={13}
              color="#666666"
            />
            <SizedBox height={12} />

            <Container
              width={350}
              padding={12}
              color="#FAFAFA"
              decoration={{ borderRadius: 8 }}
            >
              <Center>
                <AnimatedSize
                  duration={duration}
                  curve={curve}
                  alignment="center"
                >
                  <Container
                    width={expanded ? 220 : 0}
                    height={expanded ? 120 : 0}
                    color="#1976D2"
                    decoration={{ borderRadius: 8 }}
                    alignment="center"
                  >
                    {expanded ? (
                      <Text
                        text="👋 我在这里"
                        color="white"
                        fontSize={18}
                        fontWeight="bold"
                      />
                    ) : null}
                  </Container>
                </AnimatedSize>
              </Center>
            </Container>

            <SizedBox height={12} />
            <Row>
              <Button
                text={expanded ? "折叠" : "展开"}
                onTap={() => setExpanded(!expanded)}
                backgroundColor={expanded ? "#E91E63" : "#1976D2"}
              />
            </Row>
          </Column>
        </Padding>

        <Divider />

        {/* 2. 尺寸循环 */}
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="2. 尺寸循环（手动调节）"
              fontSize={15}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text={`当前 boxSize: ${boxSize}px`}
              fontSize={13}
              color="#666666"
            />
            <SizedBox height={12} />

            <Container
              width={300}
              height={300}
              color="#FAFAFA"
              decoration={{ borderRadius: 8 }}
              alignment="center"
            >
              <AnimatedSize
                duration={duration}
                curve={curve}
                alignment="center"
                axis={axis === "none" ? undefined : axis}
              >
                <Container
                  width={boxSize}
                  height={boxSize}
                  color="#FF9800"
                  decoration={{ borderRadius: 12 }}
                  alignment="center"
                >
                  <Text
                    text={`${boxSize}`}
                    color="white"
                    fontSize={20}
                    fontWeight="bold"
                  />
                </Container>
              </AnimatedSize>
            </Container>

            <SizedBox height={12} />
            <Wrap spacing={8}>
              <Button
                text="小"
                onTap={() => setBoxSize(80)}
                backgroundColor="#9E9E9E"
              />
              <Button
                text="中"
                onTap={() => setBoxSize(160)}
                backgroundColor="#9E9E9E"
              />
              <Button
                text="大"
                onTap={() => setBoxSize(240)}
                backgroundColor="#9E9E9E"
              />
            </Wrap>
          </Column>
        </Padding>

        <Divider />

        {/* 3. 参数控制 */}
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="3. 参数控制" fontSize={15} fontWeight="bold" />
            <SizedBox height={8} />

            <Text text="duration (ms)" fontSize={13} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              {[150, 300, 600, 1000].map((d) => (
                <Button
                  key={d}
                  text={`${d}`}
                  onTap={() => setDuration(d)}
                  backgroundColor={d === duration ? "#1976D2" : "#9E9E9E"}
                />
              ))}
            </Wrap>

            <SizedBox height={12} />

            <Text text="curve" fontSize={13} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              {(
                [
                  "easeInOut",
                  "easeIn",
                  "easeOut",
                  "linear",
                  "fastOutSlowIn",
                ] as Array<
                  | "easeInOut"
                  | "easeIn"
                  | "easeOut"
                  | "linear"
                  | "fastOutSlowIn"
                >
              ).map((c) => (
                <Button
                  key={c}
                  text={c}
                  onTap={() => setCurve(c)}
                  backgroundColor={c === curve ? "#9C27B0" : "#9E9E9E"}
                />
              ))}
            </Wrap>

            <SizedBox height={12} />

            <Text text="axis" fontSize={13} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              {(["none", "horizontal", "vertical"] as const).map((a) => (
                <Button
                  key={a}
                  text={a}
                  onTap={() => setAxis(a)}
                  backgroundColor={a === axis ? "#009688" : "#9E9E9E"}
                />
              ))}
            </Wrap>
          </Column>
        </Padding>

        <Container height={40} />
      </SingleChildScrollView>
    </Scaffold>
  );
}
