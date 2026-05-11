import React, { useEffect, useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Text,
  Button,
  Container,
  SingleChildScrollView,
  Padding,
  Divider,
} from "fuickjs";
import { AppInfo } from "@fuickjs-community/app_info";
import type { AppInfoData } from "@fuickjs-community/app_info";

export default function AppInfoDemo() {
  const [info, setInfo] = useState<AppInfoData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    AppInfo.clearCache();
    const data = await AppInfo.get();
    setInfo(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const rows: { label: string; value: string }[] = info
    ? [
        { label: "App Name", value: info.appName },
        { label: "Package", value: info.packageName },
        { label: "Version", value: info.version },
        { label: "Build Number", value: info.buildNumber },
        { label: "Build Signature", value: info.buildSignature ?? "—" },
        { label: "Installer", value: info.installerStore ?? "—" },
      ]
    : [];

  return (
    <Scaffold appBar={<AppBar title="AppInfo Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="应用信息 (AppInfo)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="读取版本号、构建号、包名等。结果在 JS 侧缓存。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            {loading && <Text text="Loading..." color="#999" />}

            {rows.map((row) => (
              <Container
                key={row.label}
                margin={{ bottom: 1 }}
                padding={{ horizontal: 12, vertical: 10 }}
                decoration={{
                  color: "#fafafa",
                  border: { color: "#eee", width: 1 },
                }}
              >
                <Column crossAxisAlignment="start">
                  <Text text={row.label} fontSize={11} color="#999" />
                  <Text text={row.value} fontSize={15} fontWeight="w500" />
                </Column>
              </Container>
            ))}

            <Divider margin={{ vertical: 16 }} />
            <Button text="刷新（清除缓存）" onTap={load} />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
