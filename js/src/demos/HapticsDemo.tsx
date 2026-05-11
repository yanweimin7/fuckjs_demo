import React from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  SingleChildScrollView,
  Padding,
  Divider,
} from "fuickjs";
import { Haptics } from "@fuickjs-community/haptics";

export default function HapticsDemo() {
  return (
    <Scaffold appBar={<AppBar title="Haptics Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="触觉反馈 (Haptics)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="在真机上运行，模拟器无振感。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Section title="Impact — 冲击反馈">
              <Row mainAxisAlignment="spaceAround">
                <Button text="Light" onTap={() => Haptics.impact("light")} />
                <Button text="Medium" onTap={() => Haptics.impact("medium")} />
                <Button text="Heavy" onTap={() => Haptics.impact("heavy")} />
              </Row>
            </Section>

            <Section title="Selection — 选择反馈">
              <Button
                text="Selection Click"
                onTap={() => Haptics.selection()}
              />
            </Section>

            <Section title="Notification — 通知反馈">
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text="✅ Success"
                  onTap={() => Haptics.notification("success")}
                  backgroundColor="#4CAF50"
                />
                <Button
                  text="⚠️ Warning"
                  onTap={() => Haptics.notification("warning")}
                  backgroundColor="#FF9800"
                />
                <Button
                  text="❌ Error"
                  onTap={() => Haptics.notification("error")}
                  backgroundColor="#F44336"
                />
              </Row>
            </Section>

            <Section title="Vibrate — 震动（Android）">
              <Button text="Vibrate 200ms" onTap={() => Haptics.vibrate(200)} />
            </Section>
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
