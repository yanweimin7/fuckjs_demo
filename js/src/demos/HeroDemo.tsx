import React, { useEffect } from "react";
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
  SingleChildScrollView,
  Divider,
  NavigationLink,
  NavigatorService,
} from "fuickjs";

const HERO_TAG = "hero-demo-circle";
const TARGET_PATH = "/demo/hero_detail";

export default function HeroDemo() {
  // 关键：源页挂载时主动预渲染目标页（fire-and-forget，零阻塞）。
  // Hero 飞行动画要求目标页 Hero 在 transition 启动那一刻已在 tree 中，
  // 不预渲染则目标页第一帧是 loading 圈，Hero 飞行静默失效。
  // 这里在挂载时 + 后续每 200ms 补一发，最大 5 次（覆盖 1s 内未就绪的边界情况）。
  useEffect(() => {
    NavigatorService.prewarm(TARGET_PATH, {});
    const timers: number[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(
        window.setTimeout(() => {
          NavigatorService.prewarm(TARGET_PATH, {});
        }, i * 200),
      );
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Hero" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="两个相同 tag 的 Hero 在路由切换时自动播放飞行动画。本 demo 在本页放一个小 Hero，目标页放一个大 Hero，tag 相同。"
              fontSize={14}
              color="#555555"
            />

            <SizedBox height={16} />

            <Text text="1. 源 Hero（小）" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#FFF3E0"
              width={300}
              height={140}
              decoration={{ color: "#FFF3E0", borderRadius: 8 }}
            >
              <Center>
                <Hero tag={HERO_TAG}>
                  <Container
                    width={50}
                    height={50}
                    decoration={{
                      color: "#1976D2",
                      borderRadius: 25,
                    }}
                  />
                </Hero>
              </Center>
            </Container>

            <SizedBox height={8} />
            {/* 使用 NavigationLink 而不是 Button + onTap：onTapDown 时立即触发 prewarm。 */}
            <NavigationLink url={TARGET_PATH} prewarmMs={300}>
              <Container
                width={300}
                height={44}
                decoration={{ color: "#1976D2", borderRadius: 8 }}
              >
                <Center>
                  <Text
                    text="打开目标页 (tag 相同)"
                    color="white"
                    fontSize={16}
                  />
                </Center>
              </Container>
            </NavigationLink>

            <Divider />

            <Text text="2. 飞行动画原理" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Container
              color="#E3F2FD"
              decoration={{ color: "#E3F2FD", borderRadius: 8 }}
            >
              <Padding padding={16}>
                <Column crossAxisAlignment="start">
                  <Text text="• Hero 的 tag 是它的唯一标识，源/目标页 tag 一致即匹配。" />
                  <Text text="• 切换页面时，Flutter 会在 Overlay 中生成一个临时飞行体（flightShuttle），按 RectTween 在两端位置之间插值。" />
                  <Text text="• 子节点必须存在；tag 缺失时退化为子节点渲染（不抛错）。" />
                  <Text text="• 推荐把 Hero 放在能感知尺寸的容器内，否则飞行体可能没目标位置。" />
                </Column>
              </Padding>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
