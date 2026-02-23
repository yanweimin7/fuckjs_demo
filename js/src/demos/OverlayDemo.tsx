import React, { useContext } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Button,
  Container,
  Text,
  Center,
  GestureDetector,
  Stack,
  Positioned,
  Overlay,
  PageContext,
  Material
} from "fuickjs";

export default function OverlayDemo() {
  const { pageId } = useContext(PageContext);

  const showSimpleOverlay = () => {
    Overlay.show(
      "simple_overlay",
      
      <Center>
        <Material>
        <Container
          color="#AA000000"
          padding={20}
          borderRadius={8}
        >
          <Text text="This is a simple overlay" color="white" />
          <Button
            text="Close"
            onTap={() => Overlay.hide("simple_overlay")}
          />
        </Container>
        </Material>
      </Center>,
      pageId
    );
  };

  const showFullScreenOverlay = () => {
    Overlay.show(
      "fullscreen_overlay",
      <GestureDetector onTap={() => Overlay.hide("fullscreen_overlay")}>
        <Container color="#88000000">
          <Center>
            <Container
              color="white"
              padding={30}
              borderRadius={16}
            >
              <Column>
                <Text
                  text="Full Screen Overlay"
                  fontSize={20}
                  fontWeight="bold"
                  margin={{ bottom: 20 }}
                />
                <Text text="Tap anywhere to close" color="grey" />
              </Column>
            </Container>
          </Center>
        </Container>
      </GestureDetector>,
      pageId
    );
  };

  return (
    <Scaffold appBar={<AppBar title="Overlay Demo" />}>
      <Column>
        <Container padding={20}>
          <Button text="Show Simple Overlay" onTap={showSimpleOverlay} />
        </Container>
        <Container padding={20}>
          <Button text="Show Full Screen Overlay" onTap={showFullScreenOverlay} />
        </Container>
      </Column>
    </Scaffold>
  );
}
