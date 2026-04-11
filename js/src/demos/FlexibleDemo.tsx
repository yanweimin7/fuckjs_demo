import React from "react";
import {
  Column,
  Row,
  Flexible,
  Container,
  Text,
  Scaffold,
  AppBar,
  Padding,
} from "fuickjs";

export default function FlexibleDemo() {
  return (
    <Scaffold appBar={<AppBar title="Flexible Demo" />}>
      <Padding padding={20}>
        <Column>
          <Text text="Flexible in Row" fontSize={18} fontWeight="bold" />
          <Row>
            <Flexible flex={1}>
              <Container color="#ff0000" height={50}>
                <Text text="Flex 1" color="#ffffff" />
              </Container>
            </Flexible>
            <Flexible flex={2}>
              <Container color="#00ff00" height={50}>
                <Text text="Flex 2" color="#ffffff" />
              </Container>
            </Flexible>
            <Container color="#0000ff" width={50} height={50} />
          </Row>

          <Padding padding={{ top: 40 }}>
            <Text text="Flexible in Column" fontSize={18} fontWeight="bold" />
          </Padding>
          <Container height={200} color="#eeeeee">
            <Column>
              <Flexible flex={1}>
                <Container color="#ff0000" width={100}>
                  <Text text="Flex 1" color="#ffffff" />
                </Container>
              </Flexible>
              <Flexible flex={3}>
                <Container color="#00ff00" width={100}>
                  <Text text="Flex 3" color="#ffffff" />
                </Container>
              </Flexible>
            </Column>
          </Container>
        </Column>
      </Padding>
    </Scaffold>
  );
}
