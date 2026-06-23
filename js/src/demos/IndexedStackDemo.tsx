import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  IndexedStack,
  Container,
  SizedBox,
  Padding,
  Wrap,
  Button,
  ListView,
} from "fuickjs";

/**
 * IndexedStack：所有子节点都会被构建（state 保留），
 * 但仅显示 index 指定的那个。
 *
 * 与 TabBarView 不同的是：切走后再切回来，原有滚动位置、输入框内容等依然在。
 */
export default function IndexedStackDemo() {
  const [index, setIndex] = useState(0);
  const [sizing, setSizing] = useState<"stack" | "loose">("loose");
  const [alignment, setAlignment] = useState<
    "topLeft" | "center" | "bottomRight"
  >("center");

  const pages = [
    {
      label: "Home",
      color: "#E3F2FD",
      tag: "#1565C0",
      list: Array.from({ length: 30 }, (_, i) => `Home item #${i + 1}`),
    },
    {
      label: "Messages",
      color: "#FFF3E0",
      tag: "#E65100",
      list: Array.from({ length: 30 }, (_, i) => `Message #${i + 1}`),
    },
    {
      label: "Profile",
      color: "#E8F5E9",
      tag: "#2E7D32",
      list: Array.from({ length: 30 }, (_, i) => `Profile row #${i + 1}`),
    },
  ];

  return (
    <Scaffold appBar={<AppBar title={<Text text="IndexedStack" />} />}>
      <Column crossAxisAlignment="stretch">
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="IndexedStack 切换不重建"
              fontSize={15}
              fontWeight="bold"
            />
            <SizedBox height={4} />
            <Text
              text="切到 Messages 滚到中间，再切到 Home 然后切回 Messages，滚动位置依然保留。"
              fontSize={13}
              color="#666666"
            />
          </Column>
        </Padding>

        <Container color="#F5F5F5" height={1} />

        <Padding padding={{ horizontal: 16, top: 12, bottom: 8 }}>
          <Row mainAxisAlignment="spaceBetween">
            {pages.map((p, i) => (
              <Button
                key={p.label}
                text={p.label}
                onTap={() => setIndex(i)}
                backgroundColor={i === index ? p.tag : "#9E9E9E"}
              />
            ))}
          </Row>
        </Padding>

        <Container
          width={300}
          height={300}
          color="#FFFFFF"
          decoration={{ borderRadius: 8 }}
          margin={{ horizontal: 16 }}
        >
          <IndexedStack index={index} alignment={alignment} sizing={sizing}>
            {pages.map((p) => (
              <Container key={p.label} color={p.color} width={300} height={300}>
                <ListView padding={12}>
                  {p.list.map((item) => (
                    <Container
                      key={item}
                      padding={{ vertical: 8, horizontal: 12 }}
                      margin={{ bottom: 6 }}
                      decoration={{
                        color: "#FFFFFF",
                        borderRadius: 6,
                        border: { width: 1, color: "#E0E0E0" },
                      }}
                    >
                      <Text text={item} fontSize={14} color="#333333" />
                    </Container>
                  ))}
                </ListView>
              </Container>
            ))}
          </IndexedStack>
        </Container>

        <Container color="#F5F5F5" height={1} margin={{ top: 16 }} />

        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="sizing 控制布局行为" fontSize={14} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              <Button
                text="stack (expand)"
                onTap={() => setSizing("stack")}
                backgroundColor={sizing === "stack" ? "#1976D2" : "#9E9E9E"}
              />
              <Button
                text="loose (按子节点)"
                onTap={() => setSizing("loose")}
                backgroundColor={sizing === "loose" ? "#1976D2" : "#9E9E9E"}
              />
            </Wrap>

            <SizedBox height={16} />

            <Text text="alignment 对齐锚点" fontSize={14} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              {(
                ["topLeft", "center", "bottomRight"] as Array<
                  "topLeft" | "center" | "bottomRight"
                >
              ).map((a) => (
                <Button
                  key={a}
                  text={a}
                  onTap={() => setAlignment(a)}
                  backgroundColor={a === alignment ? "#9C27B0" : "#9E9E9E"}
                />
              ))}
            </Wrap>
          </Column>
        </Padding>
      </Column>
    </Scaffold>
  );
}
