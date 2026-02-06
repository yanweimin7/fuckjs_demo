import React from "react";
import { PageView, Container, Text, Scaffold, AppBar, Center } from "fuickjs";

export default function PageViewDemo() {
  return (
    <Scaffold appBar={<AppBar title="PageView Demo" />}>
      <PageView>
        <Container color="#FFEBEE">
          <Center>
            <Text text="Page 1" fontSize={32} />
            <Text text="Swipe Left" fontSize={16} />
          </Center>
        </Container>
        <Container color="#E3F2FD">
          <Center>
            <Text text="Page 2" fontSize={32} />
          </Center>
        </Container>
        <Container color="#E8F5E9">
          <Center>
            <Text text="Page 3" fontSize={32} />
          </Center>
        </Container>
      </PageView>
    </Scaffold>
  );
}
