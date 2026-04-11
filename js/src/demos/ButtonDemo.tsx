import React, { useState } from "react";
import {
  Button,
  Text,
  Scaffold,
  AppBar,
  Column,
  Row,
  Container,
  SizedBox,
  SingleChildScrollView,
  Divider,
  Padding,
} from "fuickjs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Column crossAxisAlignment="start">
      <Text text={title} fontSize={15} fontWeight="bold" color="#333" />
      <SizedBox height={10} />
      {children}
      <SizedBox height={24} />
      <Divider color="#EEEEEE" />
      <SizedBox height={24} />
    </Column>
  );
}

export default function ButtonDemo() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [asyncResult, setAsyncResult] = useState("（等待点击）");

  function handleAsync() {
    setLoading(true);
    setAsyncResult("加载中...");
    setTimeout(() => {
      setLoading(false);
      setAsyncResult(`完成！时间: ${new Date().toLocaleTimeString()}`);
    }, 2000);
  }

  return (
    <Scaffold appBar={<AppBar title="Button Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">

          {/* 1. 基础计数 */}
          <Section title="1. 基础交互（onTap）">
            <Row crossAxisAlignment="center">
              <Button
                text="−"
                onTap={() => setCount(count - 1)}
                backgroundColor="#EF5350"
                paddingH={20}
                paddingV={12}
              />
              <Container
                width={80}
                alignment="center"
              >
                <Text text={`${count}`} fontSize={28} fontWeight="bold" color="#1565C0" />
              </Container>
              <Button
                text="+"
                onTap={() => setCount(count + 1)}
                backgroundColor="#43A047"
                paddingH={20}
                paddingV={12}
              />
            </Row>
            <SizedBox height={8} />
            <Button
              text="重置为 0"
              onTap={() => setCount(0)}
              backgroundColor="#9E9E9E"
              fontSize={13}
              paddingH={12}
              paddingV={6}
            />
          </Section>

          {/* 2. 颜色变体 */}
          <Section title="2. 背景色与文字色">
            <Row>
              <Button text="Primary" backgroundColor="#1976D2" textColor="#FFFFFF" />
              <SizedBox width={8} />
              <Button text="Success" backgroundColor="#388E3C" textColor="#FFFFFF" />
              <SizedBox width={8} />
              <Button text="Warning" backgroundColor="#F57C00" textColor="#FFFFFF" />
              <SizedBox width={8} />
              <Button text="Danger" backgroundColor="#D32F2F" textColor="#FFFFFF" />
            </Row>
            <SizedBox height={8} />
            <Row>
              <Button text="Dark text" backgroundColor="#FFF176" textColor="#212121" />
              <SizedBox width={8} />
              <Button text="Purple" backgroundColor="#7B1FA2" textColor="#E1BEE7" />
            </Row>
          </Section>

          {/* 3. Outlined 变体 */}
          <Section title="3. Outlined 按钮">
            <Row>
              <Button
                text="Default"
                outlined
                borderColor="#1976D2"
                textColor="#1976D2"
              />
              <SizedBox width={8} />
              <Button
                text="Success"
                outlined
                borderColor="#388E3C"
                textColor="#388E3C"
              />
              <SizedBox width={8} />
              <Button
                text="Danger"
                outlined
                borderColor="#D32F2F"
                textColor="#D32F2F"
              />
            </Row>
            <SizedBox height={8} />
            <Row>
              <Button
                text="粗边框 2px"
                outlined
                borderColor="#7B1FA2"
                borderWidth={2}
                textColor="#7B1FA2"
              />
              <SizedBox width={8} />
              <Button
                text="圆形边框"
                outlined
                borderColor="#00838F"
                borderRadius={50}
                textColor="#00838F"
              />
            </Row>
          </Section>

          {/* 4. 圆角 */}
          <Section title="4. 圆角（borderRadius）">
            <Row crossAxisAlignment="center">
              {([0, 4, 8, 16, 50] as number[]).map((r) => (
                <Padding key={r} padding={{ right: 8 }}>
                  <Button
                    text={`r=${r}`}
                    backgroundColor="#5C6BC0"
                    textColor="#FFFFFF"
                    borderRadius={r}
                    fontSize={12}
                    paddingH={10}
                  />
                </Padding>
              ))}
            </Row>
          </Section>

          {/* 5. 字号 */}
          <Section title="5. 字号（fontSize）">
            <Row crossAxisAlignment="center">
              {([11, 14, 18, 22] as number[]).map((fs) => (
                <Padding key={fs} padding={{ right: 8 }}>
                  <Button
                    text={`${fs}px`}
                    backgroundColor="#0277BD"
                    textColor="#FFFFFF"
                    fontSize={fs}
                  />
                </Padding>
              ))}
            </Row>
          </Section>

          {/* 6. Elevation 阴影 */}
          <Section title="6. Elevation（阴影）">
            <Row crossAxisAlignment="center">
              {([0, 2, 6, 12] as number[]).map((e) => (
                <Padding key={e} padding={{ right: 12 }}>
                  <Button
                    text={`e=${e}`}
                    backgroundColor="#FFFFFF"
                    textColor="#333333"
                    elevation={e}
                    borderRadius={8}
                    fontSize={13}
                  />
                </Padding>
              ))}
            </Row>
          </Section>

          {/* 7. 尺寸控制 */}
          <Section title="7. 尺寸（minWidth / minHeight）">
            <Column crossAxisAlignment="start">
              <Button
                text="小按钮"
                backgroundColor="#26C6DA"
                minWidth={80}
                minHeight={28}
                fontSize={12}
                paddingH={8}
                paddingV={4}
              />
              <SizedBox height={8} />
              <Button
                text="中按钮（默认）"
                backgroundColor="#26C6DA"
              />
              <SizedBox height={8} />
              <Button
                text="宽按钮（full width）"
                backgroundColor="#26C6DA"
                minWidth={9999}
              />
            </Column>
          </Section>

          {/* 8. Disabled */}
          <Section title="8. Disabled 状态">
            <Row>
              <Button
                text="禁用（默认色）"
                disabled
                onTap={() => {}}
              />
              <SizedBox width={8} />
              <Button
                text="禁用（自定义色）"
                disabled
                backgroundColor="#1976D2"
                textColor="#FFFFFF"
                onTap={() => {}}
              />
              <SizedBox width={8} />
              <Button
                text="禁用 Outlined"
                disabled
                outlined
                borderColor="#9E9E9E"
                textColor="#9E9E9E"
                onTap={() => {}}
              />
            </Row>
          </Section>

          {/* 9. Loading 状态 */}
          <Section title="9. Loading 状态（异步模拟）">
            <Column crossAxisAlignment="start">
              <Button
                text={loading ? "" : "点击模拟 2s 异步"}
                loading={loading}
                backgroundColor="#5C6BC0"
                textColor="#FFFFFF"
                onTap={handleAsync}
                minWidth={200}
              />
              <SizedBox height={10} />
              <Container
                padding={12}
                decoration={{ color: "#F5F5F5", borderRadius: 8 }}
              >
                <Text text={asyncResult} fontSize={13} color="#37474F" />
              </Container>
            </Column>
          </Section>

          {/* 10. 组合样式 */}
          <Section title="10. 组合样式示例">
            <Row>
              <Button
                text="登录"
                backgroundColor="#1565C0"
                textColor="#FFFFFF"
                borderRadius={24}
                fontSize={16}
                paddingH={32}
                paddingV={12}
                elevation={4}
              />
              <SizedBox width={12} />
              <Button
                text="注册"
                outlined
                borderColor="#1565C0"
                textColor="#1565C0"
                borderRadius={24}
                fontSize={16}
                paddingH={32}
                paddingV={12}
              />
            </Row>
            <SizedBox height={12} />
            <Button
              text="删除账号"
              backgroundColor="#B71C1C"
              textColor="#FFFFFF"
              borderRadius={4}
              fontSize={14}
              paddingH={20}
              paddingV={10}
              elevation={0}
              minWidth={9999}
            />
          </Section>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
