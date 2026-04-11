import React from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Container,
  Text,
  Padding,
  Center,
  Expanded,
  Flexible,
  Divider,
  SingleChildScrollView,
} from "fuickjs";

export default function LayoutBasicsDemo() {
  return (
    <Scaffold appBar={<AppBar title="Layout Basics Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            {/* Expanded & Flexible */}
            <Text
              text="Expanded vs Flexible in Row"
              fontWeight="bold"
              fontSize={18}
            />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container height={60} color="#EEEEEE" width={350}>
                <Row>
                  <Container width={50} color="#F44336" />
                  <Expanded>
                    <Container color="#2196F3">
                      <Center>
                        <Text
                          text="Expanded (takes all)"
                          color="white"
                          fontSize={12}
                        />
                      </Center>
                    </Container>
                  </Expanded>
                  <Container width={50} color="#4CAF50" />
                </Row>
              </Container>
            </Padding>

            <Padding padding={{ bottom: 16 }}>
              <Container height={60} color="#EEEEEE" width={350}>
                <Row>
                  <Container width={50} color="#F44336" />
                  <Flexible>
                    <Container width={100} color="#9C27B0">
                      <Center>
                        <Text text="Flexible" color="white" fontSize={12} />
                      </Center>
                    </Container>
                  </Flexible>
                  <Container width={50} color="#4CAF50" />
                </Row>
              </Container>
            </Padding>

            <Divider height={32} color="transparent" />

            {/* Column Alignment */}
            <Text text="Column Alignment" fontWeight="bold" fontSize={18} />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container height={150} color="#EEEEEE" width={350}>
                <Column
                  mainAxisAlignment="spaceEvenly"
                  crossAxisAlignment="center"
                >
                  <Container width={100} height={30} color="#FF9800" />
                  <Container width={150} height={30} color="#FF9800" />
                  <Container width={80} height={30} color="#FF9800" />
                </Column>
              </Container>
            </Padding>

            <Divider height={32} color="transparent" />

            {/* Center */}
            <Text text="Center Widget" fontWeight="bold" fontSize={18} />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container height={100} color="#EEEEEE" width={350}>
                <Center>
                  <Container
                    width={60}
                    height={60}
                    color="#009688"
                    borderRadius={30}
                  />
                </Center>
              </Container>
            </Padding>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
