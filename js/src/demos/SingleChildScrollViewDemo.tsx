import React from "react";
import {
  SingleChildScrollView,
  Column,
  Container,
  Text,
  Scaffold,
  AppBar,
  Padding,
} from "fuickjs";

export default function SingleChildScrollViewDemo() {
  const items = Array.from({ length: 30 }, (_, i) => `Scroll Item ${i + 1}`);

  return (
    <Scaffold appBar={<AppBar title="SingleChildScrollView Demo" />}>
      <SingleChildScrollView>
        <Padding padding={20}>
          <Column crossAxisAlignment="stretch">
            <Text text="Header Section" fontSize={24} fontWeight="bold" />
            <Container height={100} color="#FFCDD2" margin={{ vertical: 10 }} />

            {items.map((item, index) => (
              <Container
                key={index}
                height={50}
                color={index % 2 === 0 ? "#E1F5FE" : "#B3E5FC"}
                margin={{ bottom: 5 }}
                padding={{ left: 10 }}
                alignment="topLeft"
              >
                <Text text={item} />
              </Container>
            ))}

            <Text text="Footer Section" fontSize={24} fontWeight="bold" />
            <Container height={100} color="#C8E6C9" margin={{ vertical: 10 }} />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
