import React, { useEffect, useState, useRef } from "react";
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
  useVisible,
  useInvisible,
  useAppState,
  useNavigator,
  LifecycleService,
} from "fuickjs";

const INFO_COLOR = "#1976D2";
const SUCCESS_COLOR = "#388E3C";
const WARNING_COLOR = "#F57C00";

function LogLine({ text, color, time }: { text: string; color?: string; time?: number }) {
  const ts = time ? `[+${time}ms]` : `[${new Date().toLocaleTimeString()}]`;
  return (
    <Text
      text={`${ts} ${text}`}
      fontSize={12}
      color={color ?? "#333"}
      margin={{ bottom: 3 }}
    />
  );
}

/**
 * Inner component registered via useVisible / useInvisible.
 * Demonstrates that these hooks fire not only on push/pop but also when
 * the app enters/exits the background (thanks to LifecycleService).
 */
function VisibilityTracker({ onLog }: { onLog: (msg: string, color?: string) => void }) {
  useVisible(() => {
    onLog("useVisible — page became visible", SUCCESS_COLOR);
  });

  useInvisible(() => {
    onLog("useInvisible — page became invisible", WARNING_COLOR);
  });
  return (
    <Container
      padding={12}
      margin={{ top: 8 }}
      decoration={{ color: "#E8F5E9", borderRadius: 8 }}
      alignment="center"
    >
      <Text text="👁 Visibility Tracker Active" fontSize={13} color={SUCCESS_COLOR} fontWeight="bold" />
      <Text
        text="useVisible / useInvisible hooks registered"
        fontSize={11}
        color="#666"
        margin={{ top: 4 }}
      />
    </Container>
  );
}

export default function LifecycleDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [appState, setAppState] = useState<string>("—");
  const { isInBackground } = useAppState();
  const startRef = useRef(Date.now());

  const addLog = (msg: string, color?: string) => {
    const elapsed = Date.now() - startRef.current;
    setLogs((prev) => {
      // We encode color as a prefix so LogLine can use it
      const prefix = color ? `%%COLOR:${color}%%` : "";
      return [`${prefix}[+${elapsed}ms] ${msg}`, ...prev].slice(0, 30);
    });
  };

  // Subscribe to LifecycleService directly (non-React API)
  useEffect(() => {
    const unlisten = LifecycleService.onChange((state) => {
      if (state === "background") {
        addLog("LifecycleService.onChange → background", WARNING_COLOR);
      } else {
        addLog("LifecycleService.onChange → foreground", SUCCESS_COLOR);
      }
    });
    return unlisten;
  }, []);

  // Query native state on mount
  useEffect(() => {
    LifecycleService.getState()
      .then((s) => setAppState(s))
      .catch(() => setAppState("error"));
  }, []);

  const handleQueryState = async () => {
    try {
      const s = await LifecycleService.getState();
      setAppState(s);
      addLog(`getState() → "${s}"`, INFO_COLOR);
    } catch {
      addLog("getState() failed", "#D32F2F");
    }
  };

  const handleCheckDirect = () => {
    addLog(
      `LifecycleService.isInBackground = ${LifecycleService.isInBackground}`,
      INFO_COLOR,
    );
  };

  const handleClear = () => {
    setLogs([]);
    addLog("Logs cleared");
  };

  const navigator = useNavigator();

  return (
    <Scaffold appBar={<AppBar title="LifecycleService Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            {/* Title */}
            <Text text="App 生命周期" fontSize={18} fontWeight="bold" margin={{ bottom: 4 }} />
            <Text
              text="在真机上切到后台/前台观察事件。模拟器用命令行模拟。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            {/* Single VisibilityTracker shared by push/pop and app lifecycle */}
            <Container margin={{ bottom: 16 }}>
              <VisibilityTracker onLog={addLog} />
            </Container>

            {/* Page-level visibility */}
            <Section title="页面级可见性（push / pop）">
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text="Push 子页面 →"
                  onTap={() => navigator.push("/demo/lifecycle_sub")}
                />
              </Row>
              <Text
                text="Push 后当前页 useInvisible 触发，子页 useVisible 触发。返回后当前页 useVisible 再次触发。"
                fontSize={11}
                color="#999"
                margin={{ top: 8 }}
              />
            </Section>

            {/* useAppState badge */}
            <Section title="useAppState() Hook">
              <Row mainAxisAlignment="spaceAround">
                <Container
                  padding={{ horizontal: 20, vertical: 12 }}
                  decoration={{
                    color: isInBackground ? "#FFEBEE" : "#E8F5E9",
                    borderRadius: 10,
                    border: {
                      width: 2,
                      color: isInBackground ? "#EF5350" : "#66BB6A",
                    },
                  }}
                  alignment="center"
                >
                  <Text
                    text={isInBackground ? "🌙 后台" : "☀️ 前台"}
                    fontSize={20}
                    fontWeight="bold"
                    color={isInBackground ? "#C62828" : "#2E7D32"}
                  />
                </Container>
              </Row>
              <Text
                text="useAppState() 响应式追踪 App 前后台状态"
                fontSize={11}
                color="#999"
                textAlign="center"
                margin={{ top: 8 }}
              />
            </Section>

            {/* App-level visibility */}
            <Section title="App 前后台（useVisible / useInvisible 自动响应）">
              <Text
                text="切后台时下方 Visibility Tracker 的 useInvisible 自动触发，回前台时 useVisible 触发。"
                fontSize={11}
                color="#999"
                margin={{ bottom: 8 }}
              />
            </Section>

            {/* Manual API */}
            <Section title="LifecycleService API">
              <Row mainAxisAlignment="spaceAround">
                <Button text="getState()" onTap={handleQueryState} />
                <Button text="isInBackground" onTap={handleCheckDirect} backgroundColor="#546E7A" />
                <Button text="Clear Logs" onTap={handleClear} backgroundColor="#EF5350" />
              </Row>
              <Text
                text={`当前 native state: ${appState}`}
                fontSize={13}
                color="#555"
                margin={{ top: 12 }}
              />
              <Text
                text={`同步 isInBackground: ${String(isInBackground)}`}
                fontSize={13}
                color="#555"
                margin={{ top: 4 }}
              />
            </Section>

            {/* Tips */}
            <Section title="测试方法">
              <Tip>
                <Text
                  text="• 真机：按 Home 键 / 切到其他 App → 等待 2 秒 → 切回来"
                  fontSize={13}
                  color="#333"
                />
              </Tip>
              <Tip>
                <Text
                  text="• iOS 模拟器：Hardware → Home"
                  fontSize={13}
                  color="#333"
                />
              </Tip>
              <Tip>
                <Text
                  text="• Android 模拟器：adb shell am start -W -a android.intent.action.MAIN -c android.intent.category.HOME"
                  fontSize={13}
                  color="#333"
                />
              </Tip>
              <Tip>
                <Text
                  text="预期：切后台时 isInBackground → true，useInvisible 触发。回前台时 isInBackground → false，useVisible 触发。"
                  fontSize={13}
                  color="#666"
                />
              </Tip>
            </Section>

            {/* Event Log */}
            <Section title="事件日志（最近 30 条）">
              {logs.length === 1 && (
                <Text text={logs[0]} fontSize={12} color="#999" />
              )}
              {logs
                .filter((l) => l.length > 0)
                .map((line, i) => {
                  const colorMatch = line.match(/^%%COLOR:(#[0-9A-Fa-f]+)%%/);
                  if (colorMatch) {
                    const color = colorMatch[1];
                    const text = line.slice(colorMatch[0].length);
                    return <LogLine key={i} text={text} color={color} />;
                  }
                  return <LogLine key={i} text={line} />;
                })}
            </Section>

            <Container height={40} />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

/** Sub-page pushed from LifecycleDemo to verify page-level visibility. */
export function LifecycleSubPage() {
  const navigator = useNavigator();
  const [logs, setLogs] = useState<string[]>([]);
  const startRef = useRef(Date.now());

  const addLog = (msg: string, color?: string) => {
    const elapsed = Date.now() - startRef.current;
    setLogs((prev) => {
      const prefix = color ? `%%COLOR:${color}%%` : "";
      return [`${prefix}[+${elapsed}ms] SUB ${msg}`, ...prev].slice(0, 20);
    });
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title="Lifecycle Sub Page"
          leading={
            <Button
              text="← Back"
              onTap={() => navigator.pop()}
              backgroundColor="transparent"
            />
          }
        />
      }
    >
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <VisibilityTracker onLog={addLog} />

            <Container margin={{ top: 20 }}>
              <Text
                text="子页面事件日志"
                fontSize={14}
                color="#555"
                margin={{ bottom: 8 }}
              />
              <Divider margin={{ bottom: 8 }} />
              {logs
                .filter((l) => l.length > 0)
                .map((line, i) => {
                  const colorMatch = line.match(/^%%COLOR:(#[0-9A-Fa-f]+)%%/);
                  if (colorMatch) {
                    return (
                      <LogLine
                        key={i}
                        text={line.slice(colorMatch[0].length)}
                        color={colorMatch[1]}
                      />
                    );
                  }
                  return <LogLine key={i} text={line} />;
                })}
            </Container>

            <Container
              margin={{ top: 24 }}
              padding={12}
              decoration={{ color: "#E3F2FD", borderRadius: 8 }}
            >
              <Text
                text="按返回按钮关闭子页面，回到主页面后观察主页面 useVisible 触发。"
                fontSize={12}
                color="#1565C0"
              />
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Column crossAxisAlignment="start" margin={{ bottom: 24 }}>
      <Text text={title} fontSize={14} color="#555" margin={{ bottom: 10 }} />
      <Divider margin={{ bottom: 10 }} />
      {children}
    </Column>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <Container
      padding={{ vertical: 3, horizontal: 0 }}
    >
      {children}
    </Container>
  );
}
