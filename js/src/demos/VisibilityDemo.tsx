import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Container,
  Visibility,
  SingleChildScrollView,
  Padding,
  SizedBox,
  Divider,
  Center,
  Switch,
} from "fuickjs";

export default function VisibilityDemo() {
  const [isVisible, setIsVisible] = useState(true);
  const [maintainSize, setMaintainSize] = useState(false);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Visibility Demo" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="Basic Visibility"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Is Visible?" />
              <Switch value={isVisible} onChanged={setIsVisible} />
            </Row>

            <Container color="grey" padding={10} margin={{ vertical: 10 }}>
              <Visibility visible={isVisible}>
                <Container width={100} height={100} color="blue">
                  <Center>
                    <Text text="I am Visible" color="white" />
                  </Center>
                </Container>
              </Visibility>
            </Container>

            <SizedBox height={20} />
            <Divider />
            <SizedBox height={20} />

            <Text
              text="Replacement"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Container color="grey" padding={10} margin={{ vertical: 10 }}>
              <Visibility
                visible={isVisible}
                replacement={
                  <Container width={100} height={100} color="red">
                    <Center>
                      <Text text="I am Replacement" color="white" />
                    </Center>
                  </Container>
                }
              >
                <Container width={100} height={100} color="blue">
                  <Center>
                    <Text text="I am Visible" color="white" />
                  </Center>
                </Container>
              </Visibility>
            </Container>

            <SizedBox height={20} />
            <Divider />
            <SizedBox height={20} />

            <Text
              text="Maintain Size (Invisible but takes space)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Maintain Size?" />
              <Switch value={maintainSize} onChanged={setMaintainSize} />
            </Row>
            <Container color="grey" padding={10} margin={{ vertical: 10 }}>
              <Column>
                <Text text="Item Above" />
                <Visibility
                  visible={isVisible}
                  maintainSize={maintainSize}
                  maintainAnimation={maintainSize}
                  maintainState={maintainSize}
                >
                  <Container width={100} height={100} color="green">
                    <Center>
                      <Text text="Maintain Size" color="white" />
                    </Center>
                  </Container>
                </Visibility>
                <Text text="Item Below" />
              </Column>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
