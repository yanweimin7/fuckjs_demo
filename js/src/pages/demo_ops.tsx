import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  Container,
  Padding,
  Center,
  Divider,
  SizedBox,
  Switch,
  SingleChildScrollView,
  Expanded,
  Icon,
  ListView,
} from "fuickjs";

export const DemoOpsPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [compact, setCompact] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [progress, setProgress] = useState(0.35);
  const [stats, setStats] = useState([
    { id: 1, label: "活跃", value: 12, color: "#4CAF50" },
    { id: 2, label: "告警", value: 3, color: "#FF7043" },
    { id: 3, label: "工单", value: 28, color: "#42A5F5" },
    { id: 4, label: "延迟", value: 6, color: "#AB47BC" },
  ]);
  const [items, setItems] = useState([
    { id: 101, title: "订单同步", count: 2, color: "#FF7043", active: true },
    { id: 102, title: "库存检查", count: 4, color: "#42A5F5", active: true },
    { id: 103, title: "消息分发", count: 1, color: "#26A69A", active: false },
    { id: 104, title: "日志归档", count: 5, color: "#7E57C2", active: true },
  ]);

  const palette =
    theme === "dark"
      ? {
          bg: "#121212",
          card: "#1E1E1E",
          text: "#F5F5F5",
          sub: "#BDBDBD",
          border: "#333333",
          accent: "#64B5F6",
        }
      : {
          bg: "#F5F5F5",
          card: "#FFFFFF",
          text: "#212121",
          sub: "#757575",
          border: "#E0E0E0",
          accent: "#1976D2",
        };
  const itemPadding = compact ? 8 : 14;

  const addItem = () => {
    const newId = Date.now();
    const newItems = [
      ...items,
      {
        id: newId,
        title: `任务 ${items.length + 1}`,
        count: 1,
        color: "#FFA726",
        active: true,
      },
    ];
    setItems(newItems);
  };

  const deleteItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  const updateItem = (id: number) => {
    const newItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            title: `${item.title} · ${Date.now() % 1000}`,
            count: item.count + 1,
            color: item.active ? "#EF5350" : "#9E9E9E",
            active: !item.active,
          }
        : item,
    );
    setItems(newItems);
  };

  const toggleItem = (id: number) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item,
    );
    setItems(newItems);
  };

  const reverseItems = () => {
    const newItems = [...items].reverse();
    setItems(newItems);
  };

  const shuffleItems = () => {
    const newItems = [...items].sort(() => Math.random() - 0.5);
    setItems(newItems);
  };

  const bumpProgress = () => {
    setProgress((p) => (p + 0.17) % 1);
  };

  const randomizeStats = () => {
    setStats(
      stats.map((s) => ({ ...s, value: Math.floor(Math.random() * 100) })),
    );
  };

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="PatchOps 复杂页面" />} />}
      backgroundColor={palette.bg}
    >
      <SingleChildScrollView>
        <Padding padding={{ all: 16 }}>
          <Column crossAxisAlignment="stretch">
            <Text
              text="实时看板"
              fontSize={22}
              fontWeight="bold"
              color={palette.text}
            />
            <SizedBox height={8} />
            <Text
              text="切换模式并更新不同节点属性，验证 patchOps"
              color={palette.sub}
            />
            <SizedBox height={16} />

            <Container
              padding={12}
              decoration={{
                color: palette.card,
                borderRadius: 12,
                border: { color: palette.border, width: 1 },
              }}
            >
              <Column>
                <Row mainAxisAlignment="spaceBetween">
                  <Row>
                    <Icon name="palette" color={palette.accent} size={18} />
                    <SizedBox width={8} />
                    <Text
                      text={`主题: ${theme === "dark" ? "Dark" : "Light"}`}
                      color={palette.text}
                    />
                  </Row>
                  <Switch
                    value={theme === "dark"}
                    onChanged={(v) => setTheme(v ? "dark" : "light")}
                  />
                </Row>
                <SizedBox height={10} />
                <Row mainAxisAlignment="spaceBetween">
                  <Row>
                    <Icon
                      name="density_medium"
                      color={palette.accent}
                      size={18}
                    />
                    <SizedBox width={8} />
                    <Text
                      text={`紧凑布局: ${compact ? "开启" : "关闭"}`}
                      color={palette.text}
                    />
                  </Row>
                  <Switch value={compact} onChanged={setCompact} />
                </Row>
                <SizedBox height={10} />
                <Row mainAxisAlignment="spaceBetween">
                  <Row>
                    <Icon name="campaign" color={palette.accent} size={18} />
                    <SizedBox width={8} />
                    <Text
                      text={`横幅: ${showBanner ? "显示" : "隐藏"}`}
                      color={palette.text}
                    />
                  </Row>
                  <Switch value={showBanner} onChanged={setShowBanner} />
                </Row>
              </Column>
            </Container>

            {showBanner && (
              <Container
                margin={{ top: 16 }}
                padding={12}
                decoration={{
                  color: theme === "dark" ? "#1E3A5F" : "#E3F2FD",
                  borderRadius: 10,
                  border: { color: palette.border, width: 1 },
                }}
              >
                <Row mainAxisAlignment="spaceBetween">
                  <Text
                    text="今天的系统负载处于良好区间"
                    color={palette.text}
                  />
                  <Button text="刷新" onTap={randomizeStats} />
                </Row>
              </Container>
            )}

            <SizedBox height={20} />
            <Row mainAxisAlignment="spaceBetween">
              <Text
                text="关键指标"
                fontSize={18}
                fontWeight="bold"
                color={palette.text}
              />
              <Button text="随机更新" onTap={randomizeStats} />
            </Row>
            <SizedBox height={12} />

            <Column>
              <Row>
                {stats.slice(0, 2).map((stat) => (
                  <Expanded key={stat.id}>
                    <Container
                      padding={12}
                      margin={{ right: stat.id === 1 ? 8 : 0 }}
                      decoration={{
                        color: palette.card,
                        borderRadius: 10,
                        border: { color: palette.border, width: 1 },
                      }}
                    >
                      <Row>
                        <Text text={stat.label} color={palette.sub} />
                        <SizedBox height={6} />
                        <Text
                          text={`${stat.value}`}
                          fontSize={20}
                          fontWeight="bold"
                          color={stat.color}
                        />
                      </Row>
                    </Container>
                  </Expanded>
                ))}
              </Row>
              <SizedBox height={8} />
              <Row>
                {stats.slice(2, 4).map((stat) => (
                  <Expanded key={stat.id}>
                    <Container
                      padding={12}
                      margin={{ right: stat.id === 3 ? 8 : 0 }}
                      decoration={{
                        color: palette.card,
                        borderRadius: 10,
                        border: { color: palette.border, width: 1 },
                      }}
                    >
                      <Row>
                        <Text text={stat.label} color={palette.sub} />
                        <SizedBox height={6} />
                        <Text
                          text={`${stat.value}`}
                          fontSize={20}
                          fontWeight="bold"
                          color={stat.color}
                        />
                      </Row>
                    </Container>
                  </Expanded>
                ))}
              </Row>
            </Column>

            <SizedBox height={20} />
            <Container
              padding={12}
              decoration={{
                color: palette.card,
                borderRadius: 12,
                border: { color: palette.border, width: 1 },
              }}
            >
              <Column>
                <Row mainAxisAlignment="spaceBetween">
                  <Text text="进度" color={palette.text} />
                  <Button text="推进" onTap={bumpProgress} />
                </Row>
                <SizedBox height={10} />
                <Container
                  height={10}
                  color={theme === "dark" ? "#2C2C2C" : "#EEEEEE"}
                  decoration={{ borderRadius: 8 }}
                >
                  <Container
                    height={10}
                    width={260 * progress}
                    decoration={{ color: palette.accent, borderRadius: 8 }}
                  />
                </Container>
                <SizedBox height={6} />
                <Text
                  text={`${Math.round(progress * 100)}%`}
                  color={palette.sub}
                />
              </Column>
            </Container>

            <SizedBox height={20} />
            <Row mainAxisAlignment="spaceBetween">
              <Text
                text="任务列表"
                fontSize={18}
                fontWeight="bold"
                color={palette.text}
              />
              <Row>
                <Button text="反转" onTap={reverseItems} />
                <SizedBox width={8} />
                <Button text="打乱" onTap={shuffleItems} />
                <SizedBox width={8} />
                <Button text="添加" onTap={addItem} />
              </Row>
            </Row>

            <Divider height={16} />

            <ListView>
              {items.map((item) => (
                <Container
                  key={item.id}
                  id={item.id}
                  padding={{ all: itemPadding }}
                  margin={{ bottom: compact ? 8 : 12 }}
                  decoration={{
                    color: item.active ? item.color + "1A" : palette.card,
                    borderRadius: 12,
                    border: {
                      color: item.active ? item.color : palette.border,
                      width: 1,
                    },
                  }}
                >
                  <Row mainAxisAlignment="spaceBetween">
                    <Column crossAxisAlignment="start">
                      <Text
                        text={item.title}
                        fontSize={16}
                        fontWeight="bold"
                        color={palette.text}
                      />
                      <SizedBox height={6} />
                      <Row>
                        <Container
                          padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
                          decoration={{
                            color: item.active ? item.color : "#BDBDBD",
                            borderRadius: 10,
                          }}
                        >
                          <Text
                            text={item.active ? "运行中" : "暂停"}
                            color="white"
                            fontSize={12}
                          />
                        </Container>
                        <SizedBox width={8} />
                        <Text text={`次数 ${item.count}`} color={palette.sub} />
                      </Row>
                    </Column>
                    <Column crossAxisAlignment="end">
                      <Row>
                        <Button text="更新" onTap={() => updateItem(item.id)} />
                        <SizedBox width={8} />
                        <Button text="切换" onTap={() => toggleItem(item.id)} />
                        <SizedBox width={8} />
                        <Button text="删除" onTap={() => deleteItem(item.id)} />
                      </Row>
                      <SizedBox height={8} />
                      <Text
                        text={`优先级 ${item.active ? "高" : "低"}`}
                        color={item.active ? item.color : palette.sub}
                      />
                    </Column>
                  </Row>
                </Container>
              ))}
            </ListView>

            {items.length === 0 && (
              <Center>
                <Padding padding={{ top: 40 }}>
                  <Text text="列表为空" color={palette.sub} />
                </Padding>
              </Center>
            )}
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
};
