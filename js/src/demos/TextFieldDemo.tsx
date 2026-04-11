import React, { useRef, useState } from "react";
import {
  TextField,
  Text,
  Scaffold,
  AppBar,
  Column,
  Row,
  Container,
  SizedBox,
  SingleChildScrollView,
  Button,
  Padding,
  Divider,
  Expanded,
} from "fuickjs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Column crossAxisAlignment="stretch">
      <Text text={title} fontSize={15} fontWeight="bold" color="#333" />
      <SizedBox height={10} />
      {children}
      <SizedBox height={24} />
      <Divider color="#EEEEEE" />
      <SizedBox height={24} />
    </Column>
  );
}

export default function TextFieldDemo() {
  const ref = useRef<TextField>(null);

  // 1. controlled
  const [controlled, setControlled] = useState("可编辑内容");

  // 2. 实时输入反馈
  const [liveText, setLiveText] = useState("");

  // 3. 密码可见切换
  const [password, setPassword] = useState("");
  const [obscure, setObscure] = useState(true);

  // 4. 字数限制
  const [limitText, setLimitText] = useState("");

  // 5. 多行
  const [multiText, setMultiText] = useState("");

  // 6. 提交事件
  const [submitted, setSubmitted] = useState<string[]>([]);

  // 7. focus/blur 状态
  const [focused, setFocused] = useState(false);

  return (
    <Scaffold appBar={<AppBar title="TextField Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="stretch">

          {/* 1. Controlled value */}
          <Section title="1. Controlled Value">
            <TextField
              text={controlled}
              hintText="受控输入框"
              onChanged={(v) => setControlled(v)}
              border="outline"
            />
            <SizedBox height={8} />
            <Row>
              <Button
                text="重置"
                onTap={() => setControlled("可编辑内容")}
                backgroundColor="#9E9E9E"
              />
              <SizedBox width={8} />
              <Button
                text="清空"
                onTap={() => setControlled("")}
                backgroundColor="#EF5350"
              />
            </Row>
            <SizedBox height={6} />
            <Text text={`当前值: "${controlled}"`} fontSize={13} color="#616161" />
          </Section>

          {/* 2. 实时输入反馈 */}
          <Section title="2. 实时输入（onChanged）">
            <TextField
              hintText="输入内容实时显示..."
              onChanged={(v) => setLiveText(v)}
              border="outline"
            />
            <SizedBox height={8} />
            <Container
              padding={12}
              decoration={{ color: "#F5F5F5", borderRadius: 8 }}
            >
              <Text
                text={liveText.length > 0 ? `你输入了: ${liveText}` : "（等待输入）"}
                fontSize={14}
                color={liveText.length > 0 ? "#1565C0" : "#9E9E9E"}
              />
            </Container>
          </Section>

          {/* 3. 密码框 + 可见切换 */}
          <Section title="3. 密码框（obscureText）">
            <Row crossAxisAlignment="center">
              <Expanded>
                <TextField
                  hintText="输入密码"
                  obscureText={obscure}
                  onChanged={(v) => setPassword(v)}
                  border="outline"
                  keyboardType="visiblePassword"
                />
              </Expanded>
              <SizedBox width={8} />
              <Button
                text={obscure ? "显示" : "隐藏"}
                onTap={() => setObscure(!obscure)}
                backgroundColor="#5C6BC0"
              />
            </Row>
            <SizedBox height={6} />
            <Text
              text={obscure ? `密码长度: ${password.length} 位` : `密码: ${password}`}
              fontSize={13}
              color="#616161"
            />
          </Section>

          {/* 4. 字数限制 */}
          <Section title="4. 字数限制（maxLength=20）">
            <TextField
              hintText="最多输入 20 个字符"
              maxLength={20}
              onChanged={(v) => setLimitText(v)}
              border="outline"
            />
            <SizedBox height={6} />
            <Text
              text={`已输入 ${limitText.length} / 20 字`}
              fontSize={13}
              color={limitText.length >= 20 ? "#E53935" : "#616161"}
            />
          </Section>

          {/* 5. 多行文本 */}
          <Section title="5. 多行文本（maxLines=4）">
            <TextField
              hintText="请输入多行内容..."
              maxLines={4}
              keyboardType="multiline"
              onChanged={(v) => setMultiText(v)}
              border="outline"
            />
            <SizedBox height={6} />
            <Text text={`行数: ${multiText.split("\n").length}`} fontSize={13} color="#616161" />
          </Section>

          {/* 6. 提交事件 */}
          <Section title="6. 提交事件（onSubmitted）">
            <TextField
              hintText="输入后点击键盘确认..."
              textInputAction="done"
              onSubmitted={(v) => {
                if (v.trim()) setSubmitted((prev) => [v, ...prev].slice(0, 5));
              }}
              border="outline"
            />
            <SizedBox height={8} />
            {submitted.length === 0 ? (
              <Text text="（尚未提交）" fontSize={13} color="#9E9E9E" />
            ) : (
              <Column crossAxisAlignment="start">
                <Text text="历史提交（最近5条）:" fontSize={13} color="#616161" />
                <SizedBox height={4} />
                {submitted.map((s, i) => (
                  <Text key={i} text={`• ${s}`} fontSize={13} color="#1565C0" />
                ))}
              </Column>
            )}
          </Section>

          {/* 7. Focus / Blur 状态感知 */}
          <Section title="7. Focus / Blur 回调">
            <Container
              padding={2}
              decoration={{
                borderRadius: 8,
                border: { color: focused ? "#1976D2" : "#CCCCCC", width: focused ? 2 : 1 },
              }}
            >
              <TextField
                hintText="点击获得焦点..."
                border="none"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </Container>
            <SizedBox height={6} />
            <Row crossAxisAlignment="center">
              <Container
                width={10}
                height={10}
                decoration={{ color: focused ? "#43A047" : "#E0E0E0", borderRadius: 5 }}
              />
              <SizedBox width={6} />
              <Text
                text={focused ? "已获得焦点" : "未获得焦点"}
                fontSize={13}
                color={focused ? "#43A047" : "#9E9E9E"}
              />
            </Row>
          </Section>

          {/* 8. Keyboard types */}
          <Section title="8. Keyboard 类型">
            {([
              ["文本 (text)", "text", "输入文本"],
              ["数字 (number)", "number", "输入数字"],
              ["电话 (phone)", "phone", "输入电话号码"],
              ["邮箱 (emailAddress)", "emailAddress", "输入邮箱"],
              ["URL (url)", "url", "输入网址"],
            ] as [string, string, string][]).map(([label, kt, hint]) => (
              <Padding key={kt} padding={{ bottom: 10 }}>
                <Row crossAxisAlignment="center">
                  <Container width={130}>
                    <Text text={label} fontSize={13} color="#616161" />
                  </Container>
                  <Expanded>
                    <TextField
                      hintText={hint}
                      keyboardType={kt as any}
                      border="outline"
                    />
                  </Expanded>
                </Row>
              </Padding>
            ))}
          </Section>

          {/* 9. 各对齐方式 */}
          <Section title="9. 文本对齐（textAlign）">
            {(["left", "center", "right"] as const).map((align) => (
              <Padding key={align} padding={{ bottom: 10 }}>
                <TextField
                  text={`textAlign="${align}"`}
                  textAlign={align}
                  border="outline"
                  readOnly
                />
              </Padding>
            ))}
          </Section>

          {/* 10. Ref 命令控制 */}
          <Section title="10. Ref 命令控制">
            <TextField
              ref={ref}
              text="Hello, FuickJS!"
              hintText="可通过按钮控制..."
              border="outline"
              onChanged={() => {}}
            />
            <SizedBox height={10} />
            <Row>
              <Button text="Focus" onTap={() => ref.current?.focus()} backgroundColor="#42A5F5" />
              <SizedBox width={8} />
              <Button text="Unfocus" onTap={() => ref.current?.unfocus()} backgroundColor="#78909C" />
              <SizedBox width={8} />
              <Button text="Select All" onTap={() => ref.current?.selectAll()} backgroundColor="#AB47BC" />
            </Row>
            <SizedBox height={8} />
            <Row>
              <Button text="Clear" onTap={() => ref.current?.clear()} backgroundColor="#EF5350" />
              <SizedBox width={8} />
              <Button text="Set 'FuickJS'" onTap={() => ref.current?.setText("FuickJS")} backgroundColor="#26A69A" />
              <SizedBox width={8} />
              <Button text="Sel[0,5]" onTap={() => ref.current?.setSelection(0, 5)} backgroundColor="#FFA726" />
            </Row>
          </Section>

          {/* 11. Disabled & ReadOnly */}
          <Section title="11. Disabled & ReadOnly">
            <TextField
              text="这是禁用状态"
              enabled={false}
              border="outline"
            />
            <SizedBox height={10} />
            <TextField
              text="这是只读状态（readOnly）"
              readOnly
              border="outline"
            />
          </Section>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
