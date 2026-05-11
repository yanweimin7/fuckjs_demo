import React, { useState } from "react";
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
} from "fuickjs";
import { Permissions } from "@fuickjs-community/permissions";
import type {
  PermissionName,
  PermissionStatus,
} from "@fuickjs-community/permissions";

const ALL_PERMS: PermissionName[] = [
  "camera",
  "microphone",
  "photos",
  "notification",
  "locationWhenInUse",
  "contacts",
];

const statusColor: Record<PermissionStatus, string> = {
  granted: "#4CAF50",
  denied: "#FF9800",
  restricted: "#9E9E9E",
  permanentlyDenied: "#F44336",
  limited: "#2196F3",
  provisional: "#2196F3",
};

export default function PermissionsDemo() {
  const [states, setStates] = useState<
    Partial<Record<PermissionName, PermissionStatus>>
  >({});

  const check = async (p: PermissionName) => {
    const s = await Permissions.check(p);
    setStates((prev) => ({ ...prev, [p]: s }));
  };

  const request = async (p: PermissionName) => {
    const s = await Permissions.request(p);
    setStates((prev) => ({ ...prev, [p]: s }));
  };

  const requestAll = async () => {
    const r = await Permissions.requestMultiple(ALL_PERMS);
    setStates(r);
  };

  return (
    <Scaffold appBar={<AppBar title="Permissions Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="运行时权限 (Permissions)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="iOS/Android 需要预先在 Info.plist / AndroidManifest 声明。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Button
              text="批量请求所有权限"
              onTap={requestAll}
              margin={{ bottom: 20 }}
            />

            {ALL_PERMS.map((p) => (
              <Container
                key={p}
                margin={{ bottom: 8 }}
                padding={12}
                decoration={{
                  color: "#fafafa",
                  borderRadius: 8,
                  border: { color: "#eee", width: 1 },
                }}
              >
                <Column crossAxisAlignment="start">
                  <Row
                    mainAxisAlignment="spaceBetween"
                    crossAxisAlignment="center"
                  >
                    <Text text={p} fontSize={15} fontWeight="w500" />
                    {states[p] ? (
                      <Container
                        padding={{ horizontal: 8, vertical: 4 }}
                        decoration={{
                          color: statusColor[states[p]!],
                          borderRadius: 4,
                        }}
                      >
                        <Text text={states[p]!} fontSize={11} color="#fff" />
                      </Container>
                    ) : (
                      <Text text="—" fontSize={11} color="#aaa" />
                    )}
                  </Row>
                  <Row margin={{ top: 10 }}>
                    <Button
                      text="Check"
                      onTap={() => check(p)}
                      margin={{ right: 8 }}
                    />
                    <Button text="Request" onTap={() => request(p)} />
                  </Row>
                </Column>
              </Container>
            ))}

            <Divider margin={{ vertical: 16 }} />
            <Text
              text="状态：granted(已授权) / denied(本次拒绝) / permanentlyDenied(永久拒绝，需去系统设置)"
              fontSize={11}
              color="#999"
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
