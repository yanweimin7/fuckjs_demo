import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  SizedBox,
  Padding,
  SingleChildScrollView,
  FractionallySizedBox,
} from "fuickjs";

export default function FractionallySizedBoxDemo() {
  const items = [
    { factor: 0.25, label: "25%", color: "#E91E63" },
    { factor: 0.5, label: "50%", color: "#FF9800" },
    { factor: 0.75, label: "75%", color: "#4CAF50" },
    { factor: 1.0, label: "100%", color: "#2196F3" },
  ];

  return (
    <Scaffold appBar={<AppBar title={<Text text="FractionallySizedBox" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="widthFactor 示例" fontSize={18} fontWeight="bold" />
            <SizedBox height={12} />

            {items.map((item) => (
              <Column key={item.label} crossAxisAlignment="start">
                <Text text={item.label} fontSize={14} color="#666" />
                <SizedBox height={4} />
                <Container height={50} color="#F5F5F5">
                  <FractionallySizedBox widthFactor={item.factor} alignment="centerLeft">
                    <Container
                      decoration={{ color: item.color, borderRadius: 4 }}
                      alignment="center"
                    >
                      <Text text={item.label} color="white" fontWeight="bold" />
                    </Container>
                  </FractionallySizedBox>
                </Container>
                <SizedBox height={12} />
              </Column>
            ))}

            <SizedBox height={16} />
            <Text text="heightFactor 示例" fontSize={18} fontWeight="bold" />
            <SizedBox height={12} />
            <Container height={200} color="#F5F5F5">
              <FractionallySizedBox
                widthFactor={0.6}
                heightFactor={0.5}
                alignment="center"
              >
                <Container
                  decoration={{ color: "#673AB7", borderRadius: 8 }}
                  alignment="center"
                >
                  <Text text="60% x 50%" color="white" fontWeight="bold" />
                </Container>
              </FractionallySizedBox>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
