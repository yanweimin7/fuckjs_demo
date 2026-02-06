import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  ConstrainedBox,
  FittedBox,
  SingleChildScrollView,
  Padding,
  SizedBox,
  Divider,
  Center,
} from "fuickjs";

export default function BoxDemo() {
  return (
    <Scaffold appBar={<AppBar title={<Text text="Box Widgets Demo" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="Container with Constraints"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Text
              text="Min Width 100, Min Height 100"
              color="grey"
              margin={{ bottom: 10 }}
            />
            <Container
              color="blue"
              constraints={{
                minWidth: 100,
                minHeight: 100,
                maxWidth: 200,
                maxHeight: 200,
              }}
            >
              <Text text="Small Text" color="white" />
            </Container>

            <SizedBox height={20} />
            <Divider />
            <SizedBox height={20} />

            <Text
              text="ConstrainedBox"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Text
              text="Forces child to be at least 150x50"
              color="grey"
              margin={{ bottom: 10 }}
            />
            <ConstrainedBox
              constraints={{
                minWidth: 150,
                minHeight: 50,
              }}
            >
              <Container color="red" width={10} height={10}>
                <Center>
                  <Text text="I was 10x10" color="white" />
                </Center>
              </Container>
            </ConstrainedBox>

            <SizedBox height={20} />
            <Divider />
            <SizedBox height={20} />

            <Text
              text="FittedBox (BoxFit.contain)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Container width={200} height={100} color="yellow">
              <FittedBox fit="contain">
                <Container width={50} height={50} color="green" />
              </FittedBox>
            </Container>

            <SizedBox height={10} />

            <Text
              text="FittedBox (BoxFit.fill)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Container width={200} height={100} color="yellow">
              <FittedBox fit="fill">
                <Container width={50} height={50} color="green" />
              </FittedBox>
            </Container>

            <SizedBox height={10} />

            <Text
              text="FittedBox (BoxFit.fitWidth)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 10 }}
            />
            <Container width={200} height={100} color="yellow">
              <FittedBox fit="fitWidth">
                <Text
                  text="Very long text that should fit width"
                  fontSize={50}
                />
              </FittedBox>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
