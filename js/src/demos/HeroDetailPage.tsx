import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Hero,
  Container,
  Center,
  SizedBox,
  Padding,
  Button,
  useNavigator,
} from "fuickjs";

const HERO_TAG = "hero-demo-circle";

export default function HeroDetailPage() {
  const navigator = useNavigator();

  return (
    <Scaffold
      appBar={
        <AppBar title={<Text text="Hero 目标页" />} />
      }
    >
      <Padding padding={16}>
        <Column crossAxisAlignment="start">
          <Text
            text="本页 Hero 与源页 tag 一致。点击返回会看到飞行回弹动画。"
            fontSize={14}
            color="#555555"
          />

          <SizedBox height={24} />

          <Text text="2. 目标 Hero（大）" fontSize={16} fontWeight="bold" />
          <SizedBox height={8} />

          <Container
            color="#FFF3E0"
            width={300}
            height={220}
            decoration={{ color: "#FFF3E0", borderRadius: 8 }}
          >
            <Center>
              <Hero tag={HERO_TAG}>
                <Container
                  width={150}
                  height={150}
                  decoration={{
                    color: "#1976D2",
                    borderRadius: 75,
                  }}
                >
                  <Center>
                    <Text text="BIG" color="white" fontSize={24} fontWeight="bold" />
                  </Center>
                </Container>
              </Hero>
            </Center>
          </Container>

          <SizedBox height={16} />

          <Button
            text="返回 (看飞行动画)"
            onTap={() => navigator.pop()}
            backgroundColor="#9C27B0"
          />
        </Column>
      </Padding>
    </Scaffold>
  );
}
