import React, { useEffect, useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  Container,
  Padding,
  SizedBox,
  SingleChildScrollView,
  ErrorHandler,
} from "fuickjs";

export default function ErrorDemoPage() {
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [triggerRenderError, setTriggerRenderError] = useState(false);

  useEffect(() => {
    ErrorHandler.set((error: unknown, source: string) => {
      const message = `[${source}] ${
        (error as Error)?.message || String(error)
      }`;
      setErrorLog((prev) => [...prev, message].slice(-8));
    });
    return () => {
      ErrorHandler.set(null);
    };
  }, []);

  if (triggerRenderError) {
    throw new Error("Render error demo");
  }
  useEffect(() => {
    // throw  new Error('Initial error demo');
  }, []);

  return (
    <Scaffold appBar={<AppBar title={<Text text="异常捕获演示" />} />}>
      <SingleChildScrollView>
        <Padding padding={{ all: 16 }}>
          <Column crossAxisAlignment="stretch">
            <Container
              padding={12}
              decoration={{
                color: "#FFFFFF",
                borderRadius: 12,
                border: { color: "#E0E0E0", width: 1 },
              }}
            >
              <Column crossAxisAlignment="start">
                <Text text="触发不同类型错误" fontSize={18} fontWeight="bold" />
                <SizedBox height={10} />
                <Row mainAxisAlignment="spaceBetween">
                  <Button
                    text="渲染错误"
                    onTap={() => setTriggerRenderError(true)}
                  />
                  <Button
                    text="事件错误"
                    onTap={() => {
                      throw new Error("Event handler error demo");
                    }}
                  />
                  <Button
                    text="定时器错误"
                    onTap={() =>
                      setTimeout(() => {
                        throw new Error("Timer error demo");
                      }, 80)
                    }
                  />
                  <Button
                    text="Promise 错误"
                    onTap={() =>
                      Promise.resolve().then(() => {
                        throw new Error("Promise error demo");
                      })
                    }
                  />
                </Row>
                <SizedBox height={12} />
                <Column>
                  {errorLog.length === 0 && (
                    <Text text="暂无捕获记录" color="#757575" />
                  )}
                  {errorLog.map((item, index) => (
                    <Text
                      key={`${item}-${index}`}
                      text={item}
                      color="#757575"
                    />
                  ))}
                </Column>
              </Column>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
