import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Text,
  Button,
  SingleChildScrollView,
  Padding,
  Container,
  Divider,
} from "fuickjs";
import { Share } from "@fuickjs-community/share";

export default function ShareDemo() {
  const [result, setResult] = useState("");

  const log = (msg: string) => {
    setResult(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  return (
    <Scaffold appBar={<AppBar title="Share Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="系统分享 (Share)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="调起系统分享菜单，分享文本 / 链接 / 文件。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Section title="Share Text">
              <Button
                text="分享纯文本"
                onTap={async () => {
                  const r = await Share.text("Hello from FuickJS! 🚀");
                  log(`status: ${r.status}`);
                }}
              />
            </Section>

            <Section title="Share with Subject">
              <Button
                text="分享文本 + 标题"
                onTap={async () => {
                  const r = await Share.text(
                    "Check out FuickJS — React + QuickJS + Flutter",
                    "FuickJS",
                  );
                  log(`status: ${r.status}`);
                }}
              />
            </Section>

            <Section title="Share URL">
              <Button
                text="分享链接"
                onTap={async () => {
                  const r = await Share.share({
                    text: "https://flutter.dev",
                    subject: "Flutter",
                  });
                  log(`status: ${r.status}`);
                }}
              />
            </Section>

            {result ? (
              <Container
                margin={{ top: 16 }}
                padding={12}
                decoration={{ color: "#f0f0f0", borderRadius: 8 }}
              >
                <Text text={result} fontSize={12} color="#333" />
              </Container>
            ) : null}
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
