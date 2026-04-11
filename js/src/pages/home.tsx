import React from "react";
import {
  Column,
  Container,
  Text,
  Padding,
  Row,
  SizedBox,
  useNavigator,
  InkWell,
  Scaffold,
  AppBar,
  Icon,
  Expanded,
  SingleChildScrollView,
} from "fuickjs";
import { useGlobalValue } from "../store/global";

export default function HomePage() {
  const navigator = useNavigator();
  const { value, setValue } = useGlobalValue();
  const menuItems = [
    {
      title: "航天新闻",
      subtitle: "查看最新的航天资讯与研究报告",
      icon: "newspaper",
      path: "/news",
      color: "#2196F3",
    },
    {
      title: "行情中心",
      subtitle: "自动轮播、金刚位与实时价格列表",
      icon: "show_chart",
      path: "/market",
      color: "#FF9800",
    },
    {
      title: "组件示例",
      subtitle: "探索所有已支持的 Flutter 组件 Demo",
      icon: "category",
      path: "/demos",
      color: "#4CAF50",
    },
    {
      title: "PatchOps 验证",
      subtitle: "复杂页面增量更新与节点变更",
      icon: "analytics",
      path: "/demo/ops",
      color: "#03A9F4",
    },
    {
      title: "混合导航",
      subtitle: "Flutter与React Native混合栈管理",
      icon: "sync_alt",
      path: "/hybrid_demo",
      color: "#9C27B0",
    },
  ];

  return (
    <Scaffold appBar={<AppBar title="FuickJS 探索" />}>
      <Padding padding={16}>
        <SingleChildScrollView>
          <Column crossAxisAlignment="stretch">
            <SizedBox height={20} />
            <Text text="欢迎体验动态化渲染" fontSize={24} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="基于 React 语法的 Flutter 高性能动态化框架"
              color="#666666"
            />
            <SizedBox height={20} />
            <InkWell
              onTap={() =>
                setValue(
                  `Updated from Home: ${Math.floor(Math.random() * 100)}`,
                )
              }
            >
              <Container
                padding={10}
                decoration={{
                  color: "#E3F2FD",
                  borderRadius: 8,
                  border: { color: "#2196F3", width: 1 },
                }}
              >
                <Text text={`Global Value: ${value}`} color="#1565C0" />
              </Container>
            </InkWell>
            <SizedBox height={40} />

            {menuItems.map((item, index) => (
              <Padding key={index} padding={{ bottom: 16 }}>
                <InkWell
                  onTap={async () => {
                    const result = await navigator.push(item.path, {});
                    if (result) {
                      setValue(
                        `Result from ${item.title}: ${JSON.stringify(result)}`,
                      );
                    }
                  }}
                >
                  <Container
                    padding={20}
                    decoration={{
                      color: "#FFFFFF",
                      borderRadius: 12,
                      boxShadow: {
                        color: "#0000001A",
                        blurRadius: 8,
                        offset: { dx: 0, dy: 4 },
                      },
                    }}
                  >
                    <Row>
                      <Container
                        width={48}
                        height={48}
                        decoration={{
                          color: item.color + "1A",
                          borderRadius: 24,
                        }}
                        alignment="center"
                      >
                        <Icon name={item.icon} color={item.color} size={24} />
                      </Container>
                      <SizedBox width={16} />
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text
                            text={item.title}
                            fontSize={18}
                            fontWeight="bold"
                          />
                          <SizedBox height={4} />
                          <Text
                            text={item.subtitle}
                            fontSize={14}
                            color="#757575"
                          />
                        </Column>
                      </Expanded>
                      <Icon name="chevron_right" color="#BDBDBD" />
                    </Row>
                  </Container>
                </InkWell>
              </Padding>
            ))}
          </Column>
        </SingleChildScrollView>
      </Padding>
    </Scaffold>
  );
}
