import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  TextField,
  Button,
  Column,
  Row,
  SizedBox,
  Container,
} from "fuickjs";

/**
 * 渲染管线验证页：Scaffold.body 槽位内使用 TextField。
 *
 * 验证点（对应 docs/flutter-props.md「端到端流程」与
 * render-pipeline-slot-nodes.md §9.2 P2）：
 * 1. 在任意输入框输入文字后，点击「计数 +1」/「改标题」——
 *    输入内容与焦点必须保留（body 槽位内只重建发生变化的节点）；
 * 2. 受控输入框每敲一个字符都会 setState → 增量 op 只更新该 TextField 节点，
 *    焦点同样不丢（旧管线里这里每次按键都会整页重建、必然掉焦点）；
 * 3. 「改标题」只重建 AppBar.title 槽位，body 完全不动。
 */
export default function ScaffoldBodyTextFieldDemo() {
  const [count, setCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const [controlled, setControlled] = useState("");

  return (
    <Scaffold
      backgroundColor="#F5F5F5"
      appBar={
        <AppBar
          title={<Text text={`Body TextField ${titleCount}`} />}
          backgroundColor="#2196F3"
        />
      }
      body={
        <Container padding={16}>
          <Column crossAxisAlignment="stretch">
            <Text
              text="先在输入框输入文字，再点下方按钮：内容与焦点应保持不变"
              fontSize={14}
              color="#666666"
            />
            <SizedBox height={16} />

            {/* 非受控：输入不产生任何 setState */}
            <Text text="非受控输入框" fontSize={13} color="#999999" />
            <TextField hintText="随便输入点什么" border="outline" />
            <SizedBox height={16} />

            {/* 受控：每敲一个字符都走一次 setState → 增量 op */}
            <Text text="受控输入框（每键一次增量更新）" fontSize={13} color="#999999" />
            <TextField
              text={controlled}
              hintText="输入时观察焦点是否丢失"
              border="outline"
              onChanged={(v: string) => setControlled(v)}
            />
            <SizedBox height={16} />

            {/* 更新 body 内其他节点 */}
            <Text text={`计数：${count}`} fontSize={18} fontWeight="bold" />
            <SizedBox height={8} />
            <Button text="计数 +1" onTap={() => setCount((c) => c + 1)} />
            <SizedBox height={8} />

            {/* 更新 appBar 槽位，body 不应被波及 */}
            <Row>
              <Button
                text="改标题"
                onTap={() => setTitleCount((c) => c + 1)}
                backgroundColor="#9E9E9E"
              />
              <SizedBox width={8} />
              <Button
                text="清空受控框"
                onTap={() => setControlled("")}
                backgroundColor="#9E9E9E"
              />
            </Row>
          </Column>
        </Container>
      }
    />
  );
}
