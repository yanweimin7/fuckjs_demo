import React, { useEffect, useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  Container,
  SingleChildScrollView,
  Padding,
  Divider,
  NativeEvent,
} from "fuickjs";
import { Connectivity } from "@fuickjs-community/connectivity";
import type { NetworkType } from "@fuickjs-community/connectivity";

const typeColor: Record<string, string> = {
  wifi: "#4CAF50",
  "4g": "#2196F3",
  ethernet: "#9C27B0",
  none: "#F44336",
  unknown: "#9E9E9E",
};

export default function ConnectivityDemo() {
  const [current, setCurrent] = useState<NetworkType>("unknown");
  const [listening, setListening] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  const refresh = async () => {
    const t = await Connectivity.getNetworkType();
    setCurrent(t);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!listening) return;
    const unlisten = NativeEvent.on("networkStatusChange", (data: any) => {
      const msg = `${new Date().toLocaleTimeString()} — ${data.networkType} (${data.isConnected ? "online" : "offline"})`;
      setEvents((prev) => [msg, ...prev].slice(0, 10));
      setCurrent(data.networkType);
    });
    Connectivity.startListener();
    return () => {
      Connectivity.stopListener();
      unlisten();
    };
  }, [listening]);

  return (
    <Scaffold appBar={<AppBar title="Connectivity Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="网络状态 (Connectivity)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="监听 WiFi / 移动网络切换。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Section title="当前状态">
              <Row crossAxisAlignment="center">
                <Container
                  padding={{ horizontal: 14, vertical: 8 }}
                  decoration={{
                    color: typeColor[current] || "#9E9E9E",
                    borderRadius: 16,
                  }}
                  margin={{ right: 10 }}
                >
                  <Text
                    text={current.toUpperCase()}
                    color="#fff"
                    fontSize={13}
                    fontWeight="bold"
                  />
                </Container>
                <Button text="Refresh" onTap={refresh} />
              </Row>
            </Section>

            <Section title="实时监听">
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text={listening ? "Stop Listener" : "Start Listener"}
                  onTap={() => setListening((v) => !v)}
                  backgroundColor={listening ? "#F44336" : "#4CAF50"}
                />
              </Row>

              {events.length > 0 && (
                <Container
                  margin={{ top: 12 }}
                  padding={10}
                  decoration={{ color: "#f5f5f5", borderRadius: 6 }}
                >
                  {events.map((e, i) => (
                    <Text
                      key={i}
                      text={e}
                      fontSize={11}
                      color="#555"
                      margin={{ bottom: 4 }}
                    />
                  ))}
                </Container>
              )}
            </Section>

            <Text
              text="提示：开启监听后，切换 WiFi/飞行模式可以看到事件。"
              fontSize={11}
              color="#999"
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Column crossAxisAlignment="start" margin={{ bottom: 24 }}>
      <Text text={title} fontSize={14} color="#555" margin={{ bottom: 10 }} />
      <Divider margin={{ bottom: 10 }} />
      {children}
    </Column>
  );
}
