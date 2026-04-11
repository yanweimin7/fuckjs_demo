import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  Center,
  SizedBox,
  Padding,
  Button,
  AnimatedCrossFade,
  FlutterProps,
  Divider,
  Icon,
} from "fuickjs";

export default function AnimatedCrossFadeDemo() {
  const [showFirst1, setShowFirst1] = useState(true);
  const [showFirst2, setShowFirst2] = useState(true);

  return (
    <Scaffold appBar={<AppBar title={<Text text="AnimatedCrossFade" />} />}>
      <Padding padding={16}>
        <Column crossAxisAlignment="center">
          <Text text="基本交叉淡入淡出" fontSize={18} fontWeight="bold" />
          <SizedBox height={8} />
          <Text text="两个子组件之间平滑过渡" fontSize={14} color="#666" />
          <SizedBox height={16} />

          <AnimatedCrossFade
            crossFadeState={showFirst1 ? "showFirst" : "showSecond"}
            duration={600}
          >
            <FlutterProps propsKey="firstChild">
              <Container
                width={240}
                height={120}
                decoration={{ color: "#4CAF50", borderRadius: 16 }}
                alignment="center"
              >
                <Column mainAxisAlignment="center">
                  <Icon data="home" size={36} color="white" />
                  <SizedBox height={8} />
                  <Text text="First Child" fontSize={20} color="white" fontWeight="bold" />
                </Column>
              </Container>
            </FlutterProps>
            <FlutterProps propsKey="secondChild">
              <Container
                width={240}
                height={160}
                decoration={{ color: "#FF9800", borderRadius: 16 }}
                alignment="center"
              >
                <Column mainAxisAlignment="center">
                  <Icon data="settings" size={36} color="white" />
                  <SizedBox height={8} />
                  <Text text="Second Child" fontSize={20} color="white" fontWeight="bold" />
                  <Text text="(更高)" fontSize={14} color="white" />
                </Column>
              </Container>
            </FlutterProps>
          </AnimatedCrossFade>
          <SizedBox height={16} />
          <Button
            text={showFirst1 ? "Show Second" : "Show First"}
            onTap={() => setShowFirst1(!showFirst1)}
          />

          <Divider margin={{ top: 32, bottom: 32 }} />

          <Text text="自定义 Curve" fontSize={18} fontWeight="bold" />
          <SizedBox height={8} />
          <Text text="firstCurve: easeIn, secondCurve: easeOut" fontSize={14} color="#666" />
          <SizedBox height={16} />

          <AnimatedCrossFade
            crossFadeState={showFirst2 ? "showFirst" : "showSecond"}
            duration={800}
            firstCurve="easeIn"
            secondCurve="easeOut"
            sizeCurve="fastOutSlowIn"
          >
            <FlutterProps propsKey="firstChild">
              <Container
                width={200}
                height={80}
                decoration={{ color: "#2196F3", borderRadius: 12 }}
                alignment="center"
              >
                <Text text="Compact" fontSize={18} color="white" fontWeight="bold" />
              </Container>
            </FlutterProps>
            <FlutterProps propsKey="secondChild">
              <Container
                width={280}
                height={140}
                decoration={{ color: "#E91E63", borderRadius: 12 }}
                alignment="center"
              >
                <Column mainAxisAlignment="center">
                  <Text text="Expanded" fontSize={22} color="white" fontWeight="bold" />
                  <SizedBox height={4} />
                  <Text text="More content here" fontSize={14} color="white" />
                  <Text text="With multiple lines" fontSize={14} color="white" />
                </Column>
              </Container>
            </FlutterProps>
          </AnimatedCrossFade>
          <SizedBox height={16} />
          <Button
            text={showFirst2 ? "Expand" : "Compact"}
            onTap={() => setShowFirst2(!showFirst2)}
          />
        </Column>
      </Padding>
    </Scaffold>
  );
}
