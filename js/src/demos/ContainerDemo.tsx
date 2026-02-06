import React from "react";
import {
  Scaffold,
  AppBar,
  Container,
  Center,
  Text,
  Column,
  Padding,
  SingleChildScrollView,
} from "fuickjs";

export default function ContainerDemo() {
  return (
    <Scaffold appBar={<AppBar title="Container Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="Basic Colors and Sizes"
              fontWeight="bold"
              fontSize={18}
            />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container width={100} height={100} color="#2196F3">
                <Center>
                  <Text text="100x100" color="white" />
                </Center>
              </Container>
            </Padding>

            <Text text="Rounded Corners" fontWeight="bold" fontSize={18} />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container
                width={200}
                height={60}
                color="#4CAF50"
                borderRadius={12}
              >
                <Center>
                  <Text text="borderRadius: 12" color="white" />
                </Center>
              </Container>
            </Padding>

            <Text text="Border" fontWeight="bold" fontSize={18} />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container
                width={200}
                height={60}
                color="#FFFFFF"
                borderRadius={8}
                border={{ color: "#2196F3", width: 2 }}
              >
                <Center>
                  <Text text="With Border" color="#2196F3" />
                </Center>
              </Container>
            </Padding>

            <Text
              text="BoxShadow (Decoration)"
              fontWeight="bold"
              fontSize={18}
            />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container
                width={200}
                height={80}
                decoration={{
                  color: "white",
                  borderRadius: 8,
                  boxShadow: {
                    color: "rgba(0,0,0,0.2)",
                    blurRadius: 10,
                    offset: { dx: 0, dy: 5 },
                  },
                }}
              >
                <Center>
                  <Text text="With Shadow" />
                </Center>
              </Container>
            </Padding>

            <Text text="Alignment" fontWeight="bold" fontSize={18} />
            <Padding padding={{ top: 8, bottom: 16 }}>
              <Container
                width={300}
                height={100}
                color="#EEEEEE"
                alignment="bottomRight"
                padding={8}
              >
                <Container width={50} height={50} color="#FF9800">
                  <Center>
                    <Text text="BR" color="white" />
                  </Center>
                </Container>
              </Container>
            </Padding>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
