import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Dismissible,
  Container,
  SizedBox,
  Padding,
  Wrap,
  Button,
  ListView,
} from "fuickjs";

type Item = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
};

const initial: Item[] = [
  {
    id: "1",
    title: "收件箱 · 飞书",
    subtitle: "今天 09:12",
    tag: "#1976D2",
  },
  {
    id: "2",
    title: "GitHub · 4 PR 待 review",
    subtitle: "昨天 18:30",
    tag: "#43A047",
  },
  {
    id: "3",
    title: "Notion · 周报",
    subtitle: "昨天 12:01",
    tag: "#FB8C00",
  },
  {
    id: "4",
    title: "Calendar · 团队周会",
    subtitle: "周一 10:00",
    tag: "#8E24AA",
  },
  {
    id: "5",
    title: "Slack · #design 频道",
    subtitle: "今天 08:45",
    tag: "#E53935",
  },
  {
    id: "6",
    title: "邮件 · 产品反馈",
    subtitle: "前天 21:20",
    tag: "#00897B",
  },
  {
    id: "7",
    title: "知乎 · 推荐",
    subtitle: "今天 07:30",
    tag: "#3949AB",
  },
  {
    id: "8",
    title: "掘金 · 沸点",
    subtitle: "今天 11:08",
    tag: "#F4511E",
  },
];

type DirectionKey = "horizontal" | "vertical" | "endToStart" | "startToEnd";

/**
 * Dismissible：可滑动删除/归档的列表项。
 *
 * 通常搭配 `ListView` 使用，监听 `onDismissed` 同步从数据源移除该项。
 * 关键：必须传 `key={id}` 给 Dismissible，否则同层会冲突。
 */
export default function DismissibleDemo() {
  const [items, setItems] = useState<Item[]>(initial);
  const [direction, setDirection] = useState<DirectionKey>("horizontal");
  const [lastEvent, setLastEvent] = useState<string>("（无）");

  const reset = () => {
    setItems(initial);
    setLastEvent("已重置");
  };

  const onItemDismissed = (id: string) => (dirName: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setLastEvent(`dismissed id=${id} dir=${dirName}`);
  };

  const isHorizontalLike =
    direction === "horizontal" ||
    direction === "endToStart" ||
    direction === "startToEnd";

  return (
    <Scaffold appBar={<AppBar title={<Text text="Dismissible" />} />}>
      <Column crossAxisAlignment="stretch">
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text
              text="Dismissible：滑动列表项执行操作（删除/归档）。"
              fontSize={14}
              color="#666666"
            />
            <SizedBox height={6} />
            <Text
              text={`当前列表 ${items.length} 条 · 最近事件：${lastEvent}`}
              fontSize={12}
              color="#999999"
            />
          </Column>
        </Padding>

        <Container color="#F5F5F5" height={1} />

        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Text text="direction" fontSize={14} fontWeight="bold" />
            <SizedBox height={6} />
            <Wrap spacing={8}>
              {(
                [
                  "horizontal",
                  "vertical",
                  "endToStart",
                  "startToEnd",
                ] as DirectionKey[]
              ).map((d) => (
                <Button
                  key={d}
                  text={d}
                  onTap={() => setDirection(d)}
                  backgroundColor={d === direction ? "#1976D2" : "#9E9E9E"}
                />
              ))}
              <Button text="重置" onTap={reset} backgroundColor="#9E9E9E" />
            </Wrap>
          </Column>
        </Padding>

        <Container color="#F5F5F5" height={1} />

        <ListView padding={0}>
          {items.length === 0 ? (
            <Container height={200} color="#FAFAFA" alignment="center">
              <Column crossAxisAlignment="center">
                <Text text="🗑️ 列表已清空" fontSize={16} color="#999" />
                <SizedBox height={8} />
                <Button text="重置" onTap={reset} backgroundColor="#1976D2" />
              </Column>
            </Container>
          ) : (
            items.map((it) => (
              <Dismissible
                key={it.id}
                direction={direction}
                movementDuration={150}
                resizeDuration={250}
                background={
                  isHorizontalLike
                    ? {
                        type: "Container",
                        props: {
                          color: "#4CAF50",
                          alignment: "centerLeft",
                          padding: { horizontal: 20 },
                        },
                        children: [
                          {
                            type: "Text",
                            props: {
                              text: "✓ 标为已读",
                              color: "white",
                              fontSize: 14,
                              fontWeight: "bold",
                            },
                          },
                        ],
                      }
                    : undefined
                }
                secondaryBackground={
                  isHorizontalLike
                    ? {
                        type: "Container",
                        props: {
                          color: "#F44336",
                          alignment: "centerRight",
                          padding: { horizontal: 20 },
                        },
                        children: [
                          {
                            type: "Text",
                            props: {
                              text: "🗑 删除",
                              color: "white",
                              fontSize: 14,
                              fontWeight: "bold",
                            },
                          },
                        ],
                      }
                    : undefined
                }
                onDismissed={onItemDismissed(it.id)}
              >
                <Container
                  color="#FFFFFF"
                  padding={16}
                  decoration={{
                    color: "#FFFFFF",
                    border: { width: 0.5, color: "#E0E0E0" },
                  }}
                >
                  <Row>
                    <Container
                      width={36}
                      height={36}
                      decoration={{ color: it.tag, borderRadius: 18 }}
                      alignment="center"
                    >
                      <Text
                        text={it.title.charAt(0)}
                        color="white"
                        fontSize={14}
                        fontWeight="bold"
                      />
                    </Container>
                    <SizedBox width={12} />
                    <Column crossAxisAlignment="start">
                      <Text
                        text={it.title}
                        fontSize={15}
                        color="#333"
                        fontWeight="bold"
                      />
                      <SizedBox height={2} />
                      <Text text={it.subtitle} fontSize={12} color="#999" />
                    </Column>
                  </Row>
                </Container>
              </Dismissible>
            ))
          )}
        </ListView>
      </Column>
    </Scaffold>
  );
}
