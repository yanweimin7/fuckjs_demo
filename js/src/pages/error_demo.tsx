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

// ---- 深层调用链，方便 sourcemap 还原演示 ------------------------------------

function parseUserData(raw: unknown) {
  const data = raw as Record<string, unknown>;
  // 故意访问不存在的嵌套属性，触发 TypeError
  const score = (data.profile as Record<string, unknown>).score as number;
  return score * 100;
}

function processOrder(order: unknown) {
  const result = parseUserData(order);
  return { total: result };
}

function handleCheckout(cartData: unknown) {
  return processOrder(cartData);
}

// ---- Page ------------------------------------------------------------------

export default function ErrorDemoPage() {
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [triggerRenderError, setTriggerRenderError] = useState(false);

  useEffect(() => {
    ErrorHandler.set((error: unknown, source: string) => {
      const err = error as Error;
      const message = `[${source}] ${err?.message || String(error)}`;
      setErrorLog((prev) => [...prev, message].slice(-8));

      // 打印完整 stack 到控制台（在 Flutter 日志里可见）
      const stack = err?.stack || String(error);
      console.error('=== JS ERROR STACK (for sourcemap resolution) ===');
      console.error(`source: ${source}`);
      console.error(stack);
      console.error('=================================================');
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
                <Button
                  text="深层调用链错误（sourcemap 演示）"
                  onTap={() => {
                    // handleCheckout → processOrder → parseUserData → 崩溃
                    // stack 会包含 3 层调用，还原后可看到每层源码位置
                    handleCheckout({ name: 'test' });
                  }}
                />
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
