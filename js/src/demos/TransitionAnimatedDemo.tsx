import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  FadeTransition,
  ScaleTransition,
  RotationTransition,
  SlideTransition,
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

/**
 * 演示带 `duration` 参数的隐式动画驱动 Transition 组件。
 *
 * 与已有的静态终态 demo（FadeTransitionDemo 等）的区别：
 * - 未传 duration：常显目标值（AlwaysStoppedAnimation），瞬切
 * - 传 duration：内部 TweenAnimationBuilder 在前一次值与当前值之间插值
 *
 * 同一 props 切换会触发丝滑过渡，无需 JS 端自驱 setInterval。
 */
const opacityOptions = [0.0, 0.3, 0.6, 1.0];
const scaleOptions = [0.5, 0.8, 1.0, 1.3];
const turnsOptions = [0.0, 0.25, 0.5, 0.75];
const sizeOptions = [0.2, 0.5, 0.8, 1.0];
const offsetOptions = [
  { dx: 0, dy: 0 },
  { dx: 0.5, dy: 0 },
  { dx: -0.5, dy: 0 },
  { dx: 0, dy: 0.3 },
];
const curveOptions = ["linear", "ease", "easeInOut", "bounceOut", "elasticOut"];

export default function TransitionAnimatedDemo() {
  const [opacity, setOpacity] = useState(1.0);
  const [scale, setScale] = useState(1.0);
  const [turns, setTurns] = useState(0.0);
  const [sizeFactor, setSizeFactor] = useState(1.0);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [duration, setDuration] = useState(600);
  const [curve, setCurve] = useState("easeInOut");

  return (
    <Scaffold appBar={<AppBar title={<Text text="Transition Animated" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="传 duration 后，Transition 组件内部走 TweenAnimationBuilder，props 变化时自动补间。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={12} />

            <Text text="全局配置" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Row>
              <Text text="duration:" />
              <SizedBox width={8} />
              <Wrap spacing={6}>
                {[0, 300, 600, 1200].map((d) => (
                  <Button
                    key={d}
                    text={d === 0 ? "static" : `${d}ms`}
                    onTap={() => setDuration(d)}
                    backgroundColor={
                      duration === d ? "#1976D2" : "#9E9E9E"
                    }
                  />
                ))}
              </Wrap>
            </Row>
            <SizedBox height={8} />
            <Row>
              <Text text="curve:" />
              <SizedBox width={8} />
              <Wrap spacing={6}>
                {curveOptions.map((c) => (
                  <Button
                    key={c}
                    text={c}
                    onTap={() => setCurve(c)}
                    backgroundColor={curve === c ? "#43A047" : "#9E9E9E"}
                  />
                ))}
              </Wrap>
            </Row>

            <Divider />

            {/* 1. FadeTransition */}
            <Text text="1. FadeTransition" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              width={300}
              height={120}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Center>
                <FadeTransition
                  opacity={opacity}
                  duration={duration}
                  curve={curve}
                >
                  <Container
                    width={80}
                    height={80}
                    decoration={{ color: "#1976D2", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="fade" color="white" />
                    </Center>
                  </Container>
                </FadeTransition>
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={`opacity = ${opacity.toFixed(2)}`} />
            <Wrap spacing={6}>
              {opacityOptions.map((o) => (
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

            {/* 2. ScaleTransition */}
            <Text text="2. ScaleTransition" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              width={300}
              height={140}
              decoration={{ color: "#E8F5E9", borderRadius: 8 }}
            >
              <Center>
                <ScaleTransition
                  scale={scale}
                  duration={duration}
                  curve={curve}
                >
                  <Container
                    width={80}
                    height={80}
                    decoration={{ color: "#43A047", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="scale" color="white" />
                    </Center>
                  </Container>
                </ScaleTransition>
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={`scale = ${scale.toFixed(2)}`} />
            <Wrap spacing={6}>
              {scaleOptions.map((s) => (
                <Button
                  key={s}
                  text={s.toString()}
                  onTap={() => setScale(s)}
                  backgroundColor={
                    Math.abs(s - scale) < 0.01 ? "#43A047" : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>

            <Divider />

            {/* 3. RotationTransition */}
            <Text text="3. RotationTransition" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              width={300}
              height={140}
              decoration={{ color: "#FCE4EC", borderRadius: 8 }}
            >
              <Center>
                <RotationTransition
                  turns={turns}
                  duration={duration}
                  curve={curve}
                >
                  <Container
                    width={80}
                    height={80}
                    decoration={{ color: "#C2185B", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="rot" color="white" />
                    </Center>
                  </Container>
                </RotationTransition>
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={`turns = ${turns.toFixed(2)}`} />
            <Wrap spacing={6}>
              {turnsOptions.map((t) => (
                <Button
                  key={t}
                  text={t.toString()}
                  onTap={() => setTurns(t)}
                  backgroundColor={
                    Math.abs(t - turns) < 0.01 ? "#C2185B" : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>

            <Divider />

            {/* 4. SizeTransition */}
            <Text text="4. SizeTransition" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              width={300}
              height={140}
              decoration={{ color: "#EDE7F6", borderRadius: 8 }}
            >
              <Center>
                <SizeTransition
                  sizeFactor={sizeFactor}
                  axis="vertical"
                  duration={duration}
                  curve={curve}
                >
                  <Container
                    width={140}
                    height={120}
                    decoration={{ color: "#5E35B1", borderRadius: 8 }}
                  >
                    <Center>
                      <Text text="size" color="white" />
                    </Center>
                  </Container>
                </SizeTransition>
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={`sizeFactor = ${sizeFactor.toFixed(2)}`} />
            <Wrap spacing={6}>
              {sizeOptions.map((s) => (
                <Button
                  key={s}
                  text={s.toString()}
                  onTap={() => setSizeFactor(s)}
                  backgroundColor={
                    Math.abs(s - sizeFactor) < 0.01 ? "#5E35B1" : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>

            <Divider />

            {/* 5. SlideTransition */}
            <Text text="5. SlideTransition" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              width={300}
              height={140}
              decoration={{ color: "#FFF8E1", borderRadius: 8 }}
            >
              <Center>
                <SlideTransition
                  position={offset}
                  duration={duration}
                  curve={curve}
                >
                  <Container
                    width={60}
                    height={60}
                    decoration={{ color: "#FB8C00", borderRadius: 30 }}
                  >
                    <Center>
                      <Text text="slide" color="white" fontSize={11} />
                    </Center>
                  </Container>
                </SlideTransition>
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={`offset = (${offset.dx.toFixed(2)}, ${offset.dy.toFixed(2)})`} />
            <Wrap spacing={6}>
              {offsetOptions.map((o, i) => (
                <Button
                  key={i}
                  text={`(${o.dx},${o.dy})`}
                  onTap={() => setOffset(o)}
                  backgroundColor={
                    o.dx === offset.dx && o.dy === offset.dy
                      ? "#FB8C00"
                      : "#9E9E9E"
                  }
                />
              ))}
            </Wrap>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
