import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  RotationTransition,
  ScaleTransition,
  SlideTransition,
  Container,
  Center,
  SizedBox,
  SingleChildScrollView,
  Padding,
  Row,
  Switch,
  Divider,
} from "fuickjs";

export default function TransitionDemo() {
  const [animating, setAnimating] = useState(false);
  const [turns, setTurns] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (animating) {
      interval = setInterval(() => {
        setTurns((t) => (t + 0.01) % 1);
        setScale((s) => {
          const newScale = s + 0.01;
          return newScale > 1.5 ? 0.5 : newScale;
        });
        setOffset((o) => {
          let newDx = o.dx + 0.01;
          if (newDx > 0.5) newDx = -0.5;
          return { dx: newDx, dy: 0 };
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Transition Widgets" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="center">
            <Row mainAxisAlignment="center">
              <Text text="Animate" />
              <SizedBox width={10} />
              <Switch value={animating} onChanged={(v) => setAnimating(v)} />
            </Row>

            <Divider />

            <Text text="RotationTransition" fontSize={18} margin={10} />
            <RotationTransition turns={turns}>
              <Container width={100} height={100} color="#2196F3">
                <Center>
                  <Text text="Rotate" color="white" />
                </Center>
              </Container>
            </RotationTransition>
            <Text text={`Turns: ${turns.toFixed(2)}`} margin={10} />

            <Divider />

            <Text text="ScaleTransition" fontSize={18} margin={10} />
            <ScaleTransition scale={scale}>
              <Container width={100} height={100} color="#4CAF50">
                <Center>
                  <Text text="Scale" color="white" />
                </Center>
              </Container>
            </ScaleTransition>
            <Text text={`Scale: ${scale.toFixed(2)}`} margin={10} />

            <Divider />

            <Text text="SlideTransition" fontSize={18} margin={10} />
            <Container width={200} height={100} color="#EEEEEE">
              <SlideTransition position={offset}>
                <Container width={100} height={100} color="#FF9800">
                  <Center>
                    <Text text="Slide" color="white" />
                  </Center>
                </Container>
              </SlideTransition>
            </Container>
            <Text
              text={`Offset: ${offset.dx.toFixed(2)}, ${offset.dy.toFixed(2)}`}
              margin={10}
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
