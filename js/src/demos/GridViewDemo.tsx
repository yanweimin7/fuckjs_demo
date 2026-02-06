import React from "react";
import { GridView, Container, Text, Scaffold, AppBar, Center } from "fuickjs";

export default function GridViewDemo() {
  const items = Array.from({ length: 20 }, (_, i) => `G ${i + 1}`);

  return (
    <Scaffold appBar={<AppBar title="GridView Demo" />}>
      <GridView
        crossAxisCount={3}
        mainAxisSpacing={10}
        crossAxisSpacing={10}
        itemCount={items.length}
        itemBuilder={(index) => (
          <Container color="#E3F2FD" borderRadius={8}>
            <Center>
              <Text text={items[index]} fontSize={16} fontWeight="bold" />
            </Center>
          </Container>
        )}
      />
    </Scaffold>
  );
}
