import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  Center,
  SizedBox,
  Padding,
  SingleChildScrollView,
  AspectRatio,
} from "fuickjs";

export default function AspectRatioDemo() {
  return (
    <Scaffold appBar={<AppBar title={<Text text="AspectRatio" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="16:9" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container color="#E3F2FD" width={300}>
              <AspectRatio aspectRatio={16 / 9}>
                <Container
                  decoration={{ color: "#2196F3", borderRadius: 8 }}
                  alignment="center"
                >
                  <Text text="16 : 9" color="white" fontSize={18} fontWeight="bold" />
                </Container>
              </AspectRatio>
            </Container>

            <SizedBox height={24} />
            <Text text="4:3" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container color="#E8F5E9" width={300}>
              <AspectRatio aspectRatio={4 / 3}>
                <Container
                  decoration={{ color: "#4CAF50", borderRadius: 8 }}
                  alignment="center"
                >
                  <Text text="4 : 3" color="white" fontSize={18} fontWeight="bold" />
                </Container>
              </AspectRatio>
            </Container>

            <SizedBox height={24} />
            <Text text="1:1" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container color="#FFF3E0" width={150}>
              <AspectRatio aspectRatio={1}>
                <Container
                  decoration={{ color: "#FF9800", borderRadius: 8 }}
                  alignment="center"
                >
                  <Text text="1 : 1" color="white" fontSize={18} fontWeight="bold" />
                </Container>
              </AspectRatio>
            </Container>

            <SizedBox height={24} />
            <Text text="2:1 (宽屏)" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container color="#F3E5F5" width={300}>
              <AspectRatio aspectRatio={2}>
                <Container
                  decoration={{ color: "#9C27B0", borderRadius: 8 }}
                  alignment="center"
                >
                  <Text text="2 : 1" color="white" fontSize={18} fontWeight="bold" />
                </Container>
              </AspectRatio>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
