import React from "react";
import { Stack, Positioned, Container, Text, Scaffold, AppBar } from "fuickjs";

export default function StackDemo() {
  return (
    <Scaffold appBar={<AppBar title="Stack Demo" />}>
      <Stack>
        <Container color="#ff0000" width={200} height={200} />
        <Positioned top={50} left={50}>
          <Container color="#00ff00" width={100} height={100} />
        </Positioned>
        <Positioned bottom={20} right={20}>
          <Container color="#0000ff" width={50} height={50}>
            <Text text="Top" color="#ffffff" />
          </Container>
        </Positioned>
      </Stack>
    </Scaffold>
  );
}
