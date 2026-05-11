import React, { useState, useEffect, useRef } from "react";
import {
  ListView,
  ListTile,
  Text,
  Scaffold,
  AppBar,
  Icon,
  Container,
  Column,
  Row,
  Button,
  Switch,
  Expanded,
} from "fuickjs";

/**
 * 带独立 useState 的列表项 — 验证 reconciler sub-root 生命周期
 * 每个列表项拥有自己的 state，点击可独立切换，不会影响其他项。
 */
function CounterItem({ index }: { index: number }) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);

  return (
    <Container padding={{ left: 16, right: 8, top: 10, bottom: 10 }}>
      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
        <Row crossAxisAlignment="center">
          <Container
            width={36}
            height={36}
            alignment="center"
            margin={{ right: 12 }}
            decoration={{
              color: active ? "#E3F2FD" : "#F5F5F5",
              borderRadius: 18,
              border: { width: 1, color: active ? "#2196F3" : "#E0E0E0" },
            }}
            onTap={() => setActive((a: boolean) => !a)}
          >
            <Text text={String(count)} fontSize={14} fontWeight="bold" color={active ? "#2196F3" : "#757575"} />
          </Container>
          <Column crossAxisAlignment="start">
            <Text text={`Item ${index + 1}`} fontSize={14} />
            <Text text={active ? "Active" : "Inactive"} fontSize={11} color="#999" />
          </Column>
        </Row>
        <Row crossAxisAlignment="center">
          <Container
            width={28}
            height={28}
            alignment="center"
            margin={{ right: 6 }}
            decoration={{ color: "#FFEBEE", borderRadius: 14 }}
            onTap={() => setCount((c: number) => c - 1)}
          >
            <Text text="−" fontSize={16} color="#E53935" />
          </Container>
          <Container
            width={28}
            height={28}
            alignment="center"
            decoration={{ color: "#E8F5E9", borderRadius: 14 }}
            onTap={() => setCount((c: number) => c + 1)}
          >
            <Text text="+" fontSize={16} color="#43A047" />
          </Container>
        </Row>
      </Row>
    </Container>
  );
}

/**
 * 带自动计时器的列表项 — 验证 useEffect cleanup 在 disposeItem 时触发
 * useEffect 内部 setInterval 递增计数，当列表项被回收时应自动清理。
 */
function TimerItem({ index }: { index: number }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s: number) => s + 1);
    }, 1000);
    console.log(`[TimerItem ${index}] setInterval started: ${id}`);
    return () => {
      console.log(`[TimerItem ${index}] clearInterval: ${id}`);
      clearInterval(id);
    };
  }, [running]);

  return (
    <Container padding={{ left: 16, right: 16, top: 8, bottom: 8 }}>
      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
        <Column crossAxisAlignment="start">
          <Text text={`Timer #${index + 1}`} fontSize={14} fontWeight="bold" />
          <Text text={`${seconds}s elapsed`} fontSize={12} color={running ? "#4CAF50" : "#9E9E9E"} />
        </Column>
        <Container
          padding={{ left: 12, right: 12, top: 6, bottom: 6 }}
          decoration={{
            color: running ? "#E8F5E9" : "#FFF3E0",
            borderRadius: 16,
          }}
          onTap={() => setRunning((r: boolean) => !r)}
        >
          <Text text={running ? "Pause" : "Resume"} fontSize={12} color={running ? "#2E7D32" : "#E65100"} />
        </Container>
      </Row>
    </Container>
  );
}

/**
 * 带加载动画的列表项 — 验证 useEffect 初始化行为
 * 组件挂载后模拟异步加载，1.5s 后显示内容。
 */
function LoadingItem({ index }: { index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setData(`Item ${index + 1} data loaded`);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      padding={16}
      margin={{ bottom: 1 }}
      color={loaded ? "#FFFFFF" : "#FAFAFA"}
    >
      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
        <Text
          text={data}
          fontSize={14}
          color={loaded ? "#333333" : "#BDBDBD"}
        />
        <Container
          width={8}
          height={8}
          decoration={{
            color: loaded ? "#4CAF50" : "#FFC107",
            borderRadius: 4,
          }}
        />
      </Row>
    </Container>
  );
}

type DemoTab = "counter" | "timer" | "loading";

export default function ReactManagedListDemo() {
  const [tab, setTab] = useState<DemoTab>("counter");
  const [itemCount, setItemCount] = useState(15);

  const tabs: { key: DemoTab; label: string }[] = [
    { key: "counter", label: "Counter (useState)" },
    { key: "timer", label: "Timer (useEffect)" },
    { key: "loading", label: "Loading (useEffect init)" },
  ];

  const itemBuilder = (index: number) => {
    switch (tab) {
      case "counter":
        return <CounterItem index={index} />;
      case "timer":
        return <TimerItem index={index} />;
      case "loading":
        return <LoadingItem index={index} />;
    }
  };

  return (
    <Scaffold
      appBar={<AppBar title="React Managed List" />}
    >
      <Column>
        {/* Tab 切换 */}
        <Container
          padding={8}
          color="#F5F5F5"
        >
          <Row mainAxisAlignment="center" crossAxisAlignment="center">
            {tabs.map((t) => (
              <Container
                key={t.key}
                padding={{ left: 12, right: 12, top: 8, bottom: 8 }}
                margin={{ left: 4, right: 4 }}
                decoration={{
                  color: tab === t.key ? "#2196F3" : "#FFFFFF",
                  borderRadius: 16,
                }}
                onTap={() => {
                  setTab(t.key);
                  setItemCount(15);
                }}
              >
                <Text
                  text={t.label}
                  fontSize={12}
                  color={tab === t.key ? "#FFFFFF" : "#666666"}
                />
              </Container>
            ))}
          </Row>
        </Container>

        {/* 数量控制 */}
        <Container
          padding={{ left: 16, right: 16, top: 8, bottom: 8 }}
          color="#FAFAFA"
        >
          <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
            <Text text={`Items: ${itemCount}`} fontSize={14} color="#666" />
            <Row>
              <Container
                width={36}
                height={36}
                alignment="center"
                margin={{ right: 8 }}
                decoration={{ color: "#FFEBEE", borderRadius: 18 }}
                onTap={() => setItemCount((n: number) => Math.max(1, n - 5))}
              >
                <Text text="−5" fontSize={12} color="#E53935" />
              </Container>
              <Container
                width={36}
                height={36}
                alignment="center"
                decoration={{ color: "#E8F5E9", borderRadius: 18 }}
                onTap={() => setItemCount((n: number) => n + 5)}
              >
                <Text text="+5" fontSize={12} color="#43A047" />
              </Container>
            </Row>
          </Row>
        </Container>

        {/* 列表 */}
        <Expanded>
          <ListView
            itemCount={itemCount}
            itemBuilder={itemBuilder}
            cacheKey={tab}
            stateful={true}
          />
        </Expanded>
      </Column>
    </Scaffold>
  );
}
