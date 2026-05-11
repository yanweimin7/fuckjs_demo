import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  SingleChildScrollView,
  Padding,
  Container,
  Divider,
  TextField,
} from "fuickjs";
import { Launcher } from "@fuickjs-community/launcher";

export default function LauncherDemo() {
  const [phone, setPhone] = useState("10086");
  const [url, setUrl] = useState("https://flutter.dev");
  const [result, setResult] = useState("");

  const log = (msg: string) => {
    setResult(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  return (
    <Scaffold appBar={<AppBar title="Launcher Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="系统跳转 (Launcher)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="调用系统打开外链 / 拨号 / 发信 / 邮件 / 设置。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Section title="Open URL">
              <TextField
                text={url}
                onChanged={setUrl}
                border="outline"
                margin={{ bottom: 10 }}
              />
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text="Default"
                  onTap={async () => {
                    const ok = await Launcher.openUrl(url);
                    log(`openUrl: ${ok}`);
                  }}
                />
                <Button
                  text="In-App"
                  onTap={async () => {
                    const ok = await Launcher.openUrl(url, "inAppBrowserView");
                    log(`openUrl (in-app): ${ok}`);
                  }}
                />
                <Button
                  text="External"
                  onTap={async () => {
                    const ok = await Launcher.openUrl(
                      url,
                      "externalApplication",
                    );
                    log(`openUrl (external): ${ok}`);
                  }}
                />
              </Row>
            </Section>

            <Section title="Phone / SMS">
              <TextField
                text={phone}
                onChanged={setPhone}
                border="outline"
                keyboardType="phone"
                margin={{ bottom: 10 }}
              />
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text="📞 Call"
                  onTap={async () => log(`call: ${await Launcher.call(phone)}`)}
                />
                <Button
                  text="💬 SMS"
                  onTap={async () =>
                    log(
                      `sms: ${await Launcher.sms(phone, "Hello from FuickJS")}`,
                    )
                  }
                />
              </Row>
            </Section>

            <Section title="Email">
              <Button
                text="📧 Send Mail"
                onTap={async () =>
                  log(
                    `email: ${await Launcher.email({
                      to: "test@example.com",
                      subject: "Hi",
                      body: "from FuickJS",
                    })}`,
                  )
                }
              />
            </Section>

            <Section title="System Settings">
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text="App Settings"
                  onTap={async () =>
                    log(`appSettings: ${await Launcher.openAppSettings()}`)
                  }
                />
                <Button
                  text="Can Open weixin://"
                  onTap={async () =>
                    log(
                      `canOpen weixin:// = ${await Launcher.canOpenUrl("weixin://")}`,
                    )
                  }
                />
              </Row>
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
