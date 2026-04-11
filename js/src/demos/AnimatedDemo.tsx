import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  AnimatedContainer,
  AnimatedOpacity,
  AnimatedAlign,
  AnimatedPositioned,
  AnimatedPadding,
  Button,
  Container,
  Center,
  SizedBox,
  Stack,
  SingleChildScrollView,
  AnimatedScale,
  AnimatedRotation,
  AnimatedSlide,
  Divider,
  Padding,
  RotationTransition,
  ScaleTransition,
  SlideTransition,
  Row,
  Switch,
} from "fuickjs";

export default function AnimatedDemo() {
  // --- Part 1: Implicitly Animated Widgets State ---
  const [selected, setSelected] = useState(false);
  const [opacity, setOpacity] = useState(1.0);
  const [alignment, setAlignment] = useState("topLeft");
  const [positioned, setPositioned] = useState(false);
  const [padding, setPadding] = useState(10);

  // Extra Implicit states (merged from previous version)
  const [scaleImplicit, setScaleImplicit] = useState(1.0);
  const [rotationImplicit, setRotationImplicit] = useState(0.0);
  const [slideImplicit, setSlideImplicit] = useState({ dx: 0.0, dy: 0.0 });

  // --- Part 2: Explicitly Animated Widgets State (Transition) ---
  const [animating, setAnimating] = useState(false);
  const [turns, setTurns] = useState(0);
  const [scaleExplicit, setScaleExplicit] = useState(1);
  const [offsetExplicit, setOffsetExplicit] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (animating) {
      interval = setInterval(() => {
        setTurns((t) => (t + 0.01) % 1);
        setScaleExplicit((s) => {
          const newScale = s + 0.01;
          return newScale > 1.5 ? 0.5 : newScale;
        });
        setOffsetExplicit((o) => {
          let newDx = o.dx + 0.01;
          if (newDx > 0.5) newDx = -0.5;
          return { dx: newDx, dy: 0 };
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Animated & Transition" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="center">
            {/* ========================================= */}
            {/* Part 1: Implicitly Animated Widgets       */}
            {/* ========================================= */}

            <Text
              text="Implicit Animations"
              fontSize={24}
              fontWeight="bold"
              margin={{ bottom: 20 }}
            />

            {/* AnimatedContainer */}
            <Text text="AnimatedContainer" fontSize={18} margin={10} />
            <AnimatedContainer
              width={selected ? 200 : 100}
              height={selected ? 100 : 200}
              color={selected ? "#FF0000" : "#0000FF"}
              alignment={selected ? "center" : "topCenter"}
              duration={1000}
              curve="fastOutSlowIn"
            >
              <Center>
                <Text text="Click me!" color="#FFFFFF" />
              </Center>
            </AnimatedContainer>
            <SizedBox height={10} />
            <Button
              text="Toggle Container"
              onTap={() => setSelected(!selected)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedOpacity */}
            <Text text="AnimatedOpacity" fontSize={18} margin={10} />
            <AnimatedOpacity opacity={opacity} duration={1000}>
              <Container width={100} height={100} color="#00FF00" />
            </AnimatedOpacity>
            <SizedBox height={10} />
            <Button
              text="Fade In/Out"
              onTap={() => setOpacity(opacity === 1.0 ? 0.0 : 1.0)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedAlign */}
            <Text text="AnimatedAlign" fontSize={18} margin={10} />
            <Container width={200} height={200} color="#EEEEEE">
              <AnimatedAlign
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                alignment={alignment as any}
                duration={1000}
                curve="easeInOut"
              >
                <Container width={50} height={50} color="#FF00FF" />
              </AnimatedAlign>
            </Container>
            <SizedBox height={10} />
            <Button
              text="Move Align"
              onTap={() => {
                const aligns = [
                  "topLeft",
                  "topRight",
                  "bottomRight",
                  "bottomLeft",
                  "center",
                ];
                const currentIdx = aligns.indexOf(alignment);
                const nextIdx = (currentIdx + 1) % aligns.length;
                setAlignment(aligns[nextIdx]);
              }}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedPadding */}
            <Text text="AnimatedPadding" fontSize={18} margin={10} />
            <Container color="#EEEEEE">
              <AnimatedPadding
                padding={padding}
                duration={500}
                curve="easeInOut"
              >
                <Container width={100} height={100} color="#00FFFF" />
              </AnimatedPadding>
            </Container>
            <SizedBox height={10} />
            <Button
              text="Change Padding"
              onTap={() => setPadding(padding === 10 ? 50 : 10)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedPositioned */}
            <Text text="AnimatedPositioned" fontSize={18} margin={10} />
            <Container width={300} height={200} color="#EEEEEE">
              <Stack>
                <AnimatedPositioned
                  left={positioned ? 10 : 150}
                  top={positioned ? 10 : 100}
                  width={positioned ? 200 : 50}
                  height={positioned ? 50 : 80}
                  duration={1000}
                  curve="elasticInOut"
                >
                  <Container color="#FFA500" />
                </AnimatedPositioned>
              </Stack>
            </Container>
            <SizedBox height={10} />
            <Button
              text="Move Positioned"
              onTap={() => setPositioned(!positioned)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedScale */}
            <Text text="AnimatedScale" fontSize={18} margin={10} />
            <Center>
              <AnimatedScale
                scale={scaleImplicit}
                duration={500}
                curve="easeInOut"
              >
                <Container
                  width={100}
                  height={100}
                  decoration={{ color: "blue", borderRadius: 10 }}
                >
                  <Center>
                    <Text text="Scale" color="white" />
                  </Center>
                </Container>
              </AnimatedScale>
            </Center>
            <SizedBox height={10} />
            <Button
              text="Toggle Scale"
              onTap={() => setScaleImplicit(scaleImplicit === 1.0 ? 1.5 : 1.0)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedRotation */}
            <Text text="AnimatedRotation" fontSize={18} margin={10} />
            <Center>
              <AnimatedRotation
                turns={rotationImplicit}
                duration={500}
                curve="easeInOut"
              >
                <Container
                  width={100}
                  height={100}
                  decoration={{ color: "green", borderRadius: 10 }}
                >
                  <Center>
                    <Text text="Rotate" color="white" />
                  </Center>
                </Container>
              </AnimatedRotation>
            </Center>
            <SizedBox height={10} />
            <Button
              text="Add 0.25 Turns"
              onTap={() => setRotationImplicit(rotationImplicit + 0.25)}
            />

            <Divider margin={{ top: 20, bottom: 20 }} />

            {/* AnimatedSlide */}
            <Text text="AnimatedSlide" fontSize={18} margin={10} />
            <Center>
              <Container
                width={200}
                height={150}
                decoration={{ border: { color: "#ccc", width: 1 } }}
              >
                <AnimatedSlide
                  offset={slideImplicit}
                  duration={500}
                  curve="easeInOut"
                >
                  <Container
                    width={50}
                    height={50}
                    decoration={{ color: "orange", borderRadius: 25 }}
                  />
                </AnimatedSlide>
              </Container>
            </Center>
            <SizedBox height={10} />
            <Button
              text="Toggle Slide"
              onTap={() =>
                setSlideImplicit(
                  slideImplicit.dx === 0
                    ? { dx: 1.0, dy: 0.5 }
                    : { dx: 0, dy: 0 },
                )
              }
            />

            {/* ========================================= */}
            {/* Part 2: Explicitly Animated Widgets       */}
            {/* ========================================= */}

            <Divider
              margin={{ top: 40, bottom: 20 }}
              color="black"
              thickness={2}
            />
            <Text
              text="Explicit Transitions (JS Driven)"
              fontSize={24}
              fontWeight="bold"
              margin={{ bottom: 20 }}
            />

            <Row mainAxisAlignment="center">
              <Text text="Animate Loop" fontSize={18} />
              <SizedBox width={10} />
              <Switch value={animating} onChanged={(v) => setAnimating(v)} />
            </Row>

            <SizedBox height={20} />

            <Text text="RotationTransition" fontSize={18} margin={10} />
            <RotationTransition turns={turns}>
              <Container width={100} height={100} color="#2196F3">
                <Center>
                  <Text text="Rotate" color="white" />
                </Center>
              </Container>
            </RotationTransition>
            <Text text={`Turns: ${turns.toFixed(2)}`} margin={10} />

            <SizedBox height={10} />

            <Text text="ScaleTransition" fontSize={18} margin={10} />
            <ScaleTransition scale={scaleExplicit}>
              <Container width={100} height={100} color="#4CAF50">
                <Center>
                  <Text text="Scale" color="white" />
                </Center>
              </Container>
            </ScaleTransition>
            <Text text={`Scale: ${scaleExplicit.toFixed(2)}`} margin={10} />

            <SizedBox height={10} />

            <Text text="SlideTransition" fontSize={18} margin={10} />
            <Container width={200} height={100} color="#EEEEEE">
              <SlideTransition position={offsetExplicit}>
                <Container width={100} height={100} color="#FF9800">
                  <Center>
                    <Text text="Slide" color="white" />
                  </Center>
                </Container>
              </SlideTransition>
            </Container>
            <Text
              text={`Offset: ${offsetExplicit.dx.toFixed(2)}, ${offsetExplicit.dy.toFixed(2)}`}
              margin={10}
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
