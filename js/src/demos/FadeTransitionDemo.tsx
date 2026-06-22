import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  FadeTransition,
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

const opacities = [0.0, 0.25, 0.5, 0.75, 1.0];

export default function FadeTransitionDemo() {
  const [opacity, setOpacity] = useState(1.0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    const id = setInterval(() => {
      setOpacity((o) => {
        const next = o - 0.05;
        return next < 0 ? 1.0 : next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [animating]);

  return (
    <Scaffold appBar={<AppBar title={<Text text="FadeTransition" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="FadeTransition 在静态终态模式下使用 AlwaysStoppedAnimation。下列交互可即时改变 opacity。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={16} />

            <Text text="1. 静态 opacity" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#FFF3E0"
              width={300}
              height={120}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Center>
                <FadeTransition opacity={opacity}>
                  <Container
                    width={80}
                    height={80}
                    decoration={{ color: "#1976D2", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="box" color="white" />
                    </Center>
                  </Container>
                </FadeTransition>
              </Center>
            </Container>

            <SizedBox height={8} />
            <Text text={`opacity = ${opacity.toFixed(2)}`} />
            <SizedBox height={8} />
            <Wrap spacing={8}>
              {opacities.map((o) => (
                <Button
                  key={o}
                  text={o.toString()}
                  onTap={() => setOpacity(o)}
                  backgroundColor={
                    Math.abs(o - opacity) < 0.01 ? "#1976D2" : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>

            <Divider />

            <Text text="2. 自动呼吸 (setInterval 模拟动画)" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="点击下方按钮可启停一段自驱动的 opacity 动画。框架默认用静态 Animation；本 demo 用 useState + setInterval 模拟。"
              fontSize={13}
              color="#666666"
            />
            <SizedBox height={8} />
            <Row>
              <Button
                text={animating ? "停止" : "开始"}
                onTap={() => setAnimating((v) => !v)}
                backgroundColor={animating ? "#E53935" : "#43A047"}
              />
            </Row>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
