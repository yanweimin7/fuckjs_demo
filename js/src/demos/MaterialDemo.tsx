import React from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Container,
  Text,
  Center,
  Material,
  SizedBox,
  SingleChildScrollView
} from "fuickjs";

export default function MaterialDemo() {
  return (
    <Scaffold appBar={<AppBar title="Material Demo" />}>
      <SingleChildScrollView>
        <Column>
          <Container padding={20}>
            <Text text="Standard Material (Canvas)" fontSize={16} fontWeight="bold" />
            <SizedBox height={10} />
            <Material
              elevation={4}
              color="white"
              borderRadius={8}
            >
              <Container padding={20}>
                <Text text="Elevation: 4, Radius: 8" />
              </Container>
            </Material>
          </Container>

          <Container padding={20}>
            <Text text="Circle Material" fontSize={16} fontWeight="bold" />
            <SizedBox height={10} />
            <Center>
              <Material
                type="circle"
                elevation={8}
                color="blue"
              >
                 <Container width={100} height={100} alignment="center">
                    <Text text="Circle" color="white" />
                 </Container>
              </Material>
            </Center>
          </Container>

          <Container padding={20}>
            <Text text="Card Material" fontSize={16} fontWeight="bold" />
            <SizedBox height={10} />
            <Material
              type="card"
              elevation={2}
              color="#f0f0f0"
              borderRadius={12}
              clipBehavior="antiAlias"
            >
              <Column>
                <Container height={100} color="grey" alignment="center">
                   <Text text="Image Placeholder" color="white"/>
                </Container>
                <Container padding={10}>
                   <Text text="Card Content" />
                </Container>
              </Column>
            </Material>
          </Container>

           <Container padding={20}>
            <Text text="Transparency Material" fontSize={16} fontWeight="bold" />
            <SizedBox height={10} />
            <Container color="grey" padding={20}>
                <Material
                  type="transparency"
                >
                  <Text text="Transparent Text on Grey Background" color="white" />
                </Material>
            </Container>
          </Container>
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
