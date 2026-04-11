import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  SingleChildScrollView,
  Column,
  Container,
  IntrinsicWidth,
  IntrinsicHeight,
  Row,
  SizedBox,
  Center,
} from "fuickjs";

export default class IntrinsicDemo extends React.Component {
  render() {
    return (
      <Scaffold
        appBar={<AppBar title={<Text text="Intrinsic Widgets Demo" />} />}
      >
        <SingleChildScrollView>
          <Column padding={{ all: 16 }}>
            <Text
              text="IntrinsicWidth Demo"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Text
              text="Without IntrinsicWidth (Column expands to max width):"
              margin={{ bottom: 5 }}
            />
            <Container color="#e0e0e0" padding={{ all: 10 }}>
              <Column crossAxisAlignment="stretch">
                <Container color="#ffcdd2" height={50} margin={{ bottom: 5 }}>
                  <Center>
                    <Text text="Short" />
                  </Center>
                </Container>
                <Container color="#ef9a9a" height={50} margin={{ bottom: 5 }}>
                  <Center>
                    <Text text="Medium Length" />
                  </Center>
                </Container>
                <Container color="#e57373" height={50}>
                  <Center>
                    <Text text="Very Long Text Content" />
                  </Center>
                </Container>
              </Column>
            </Container>

            <SizedBox height={20} />
            <Text
              text="With IntrinsicWidth (Column matches widest child):"
              margin={{ bottom: 5 }}
            />
            <Center>
              <IntrinsicWidth>
                <Column crossAxisAlignment="stretch">
                  <Container color="#c8e6c9" height={50} margin={{ bottom: 5 }}>
                    <Center>
                      <Text text="Short" />
                    </Center>
                  </Container>
                  <Container color="#a5d6a7" height={50} margin={{ bottom: 5 }}>
                    <Center>
                      <Text text="Medium Length" />
                    </Center>
                  </Container>
                  <Container color="#81c784" height={50}>
                    <Center>
                      <Text text="Very Long Text Content" />
                    </Center>
                  </Container>
                </Column>
              </IntrinsicWidth>
            </Center>

            <SizedBox height={30} />
            <Text
              text="IntrinsicHeight Demo"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Text
              text="With IntrinsicHeight (Row items stretch to tallest):"
              margin={{ bottom: 5 }}
            />
            <IntrinsicHeight>
              <Row crossAxisAlignment="stretch">
                <Container color="#bbdefb" width={100}>
                  <Center>
                    <Text text="Height depends on neighbor" />
                  </Center>
                </Container>
                <Container color="#90caf9" width={100} padding={{ all: 20 }}>
                  <Text text="This is a taller item\nthat forces the height\nof the row to increase." />
                </Container>
                <Container color="#64b5f6" width={100}>
                  <Center>
                    <Text text="Me too" />
                  </Center>
                </Container>
              </Row>
            </IntrinsicHeight>
          </Column>
        </SingleChildScrollView>
      </Scaffold>
    );
  }
}
