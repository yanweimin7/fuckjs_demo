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
  Stack,
  BackdropFilter,
  ClipRRect,
  Row,
} from "fuickjs";

export default function BackdropFilterDemo() {
  return (
    <Scaffold appBar={<AppBar title={<Text text="BackdropFilter" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="Blur 效果" fontSize={18} fontWeight="bold" />
            <SizedBox height={8} />
            <Text text="sigmaX=5, sigmaY=5" fontSize={14} color="#666" />
            <SizedBox height={12} />
            <Container width={320} height={200}>
              <Stack>
                <Container
                  decoration={{ color: "#E8F5E9", borderRadius: 12 }}
                  alignment="center"
                  padding={16}
                >
                  <Column mainAxisAlignment="center">
                    <Text text="Background" fontSize={28} fontWeight="bold" color="#2E7D32" />
                    <Text text="这段文字在模糊层后面" fontSize={16} color="#388E3C" />
                    <SizedBox height={8} />
                    <Row mainAxisAlignment="center">
                      <Container width={30} height={30} color="#F44336" margin={4} />
                      <Container width={30} height={30} color="#FF9800" margin={4} />
                      <Container width={30} height={30} color="#4CAF50" margin={4} />
                      <Container width={30} height={30} color="#2196F3" margin={4} />
                    </Row>
                  </Column>
                </Container>
                <Container alignment="center">
                  <ClipRRect borderRadius={8}>
                    <BackdropFilter sigmaX={5} sigmaY={5}>
                      <Container
                        width={180}
                        height={70}
                        color="#ffffff55"
                        alignment="center"
                      >
                        <Text text="模糊区域" fontSize={16} color="#333" fontWeight="bold" />
                      </Container>
                    </BackdropFilter>
                  </ClipRRect>
                </Container>
              </Stack>
            </Container>

            <SizedBox height={32} />
            <Text text="强模糊" fontSize={18} fontWeight="bold" />
            <SizedBox height={8} />
            <Text text="sigmaX=15, sigmaY=15" fontSize={14} color="#666" />
            <SizedBox height={12} />
            <Container width={320} height={200}>
              <Stack>
                <Container
                  decoration={{ color: "#FFF3E0", borderRadius: 12 }}
                  alignment="center"
                  padding={16}
                >
                  <Column mainAxisAlignment="center">
                    <Text text="Sharp Text" fontSize={28} fontWeight="bold" color="#E65100" />
                    <Text text="Clear details here" fontSize={16} color="#F57C00" />
                  </Column>
                </Container>
                <Container alignment="center">
                  <ClipRRect borderRadius={12}>
                    <BackdropFilter sigmaX={15} sigmaY={15}>
                      <Container
                        width={200}
                        height={100}
                        color="#ffffff44"
                        alignment="center"
                      >
                        <Text text="Heavy Blur" fontSize={18} color="#333" fontWeight="bold" />
                      </Container>
                    </BackdropFilter>
                  </ClipRRect>
                </Container>
              </Stack>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
