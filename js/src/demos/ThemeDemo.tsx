import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Divider,
  Button,
  ListView,
  GestureDetector,
  useTheme,
  Theme,
  theme,
} from "fuickjs";

/**
 * 主题色演示,两部分:
 *
 * 1. 业务主题色(Theme / theme.xxx):JS 层解析的全局语义色。
 *    - 页面与所有组件随 ThemeBridge 整页重渲染自动换色;
 *    - 非 stateful ListView 项:主题变化时框架下发 clearItemCache,
 *      Flutter 丢弃缓存 item DSL,itemBuilder 重跑出新色(滚几屏再切色可见);
 *    - stateful ListView 项:sub-root 内 ThemeBridge 自重渲染,
 *      patchOps 原地更新——换色且项内计数不丢。
 * 2. 宿主快照(useTheme):来自宿主 MaterialApp ThemeData,只读,作对照。
 */

const BRAND_BLUE = { primary: "#2196F3", secondary: "#00BCD4" };
const BRAND_PURPLE = { primary: "#6750A4", secondary: "#7D5260" };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Container padding={{ vertical: 6, horizontal: 12 }} margin={{ bottom: 6 }}>
      <Text text={`${label}: ${value}`} fontSize={14} color="#424242" />
    </Container>
  );
}

function Swatch({ name, color }: { name: string; color: string }) {
  return (
    <Container margin={{ right: 8, bottom: 8 }}>
      <Container
        width={56}
        height={56}
        decoration={{ color, borderRadius: 8 }}
      />
      <SizedBox height={4} />
      <Text text={name} fontSize={11} color="#555555" />
    </Container>
  );
}

/** stateful 列表项:换主题色后颜色更新,且点击计数保留(状态不丢)。 */
function StatefulItem({ index }: { index: number }) {
  const [count, setCount] = useState(0);
  return (
    <GestureDetector onTap={() => setCount(count + 1)}>
      <Container
        margin={{ horizontal: 16, bottom: 8 }}
        padding={12}
        decoration={{ color: theme.surface, borderRadius: 8 }}
      >
        <Text
          text={`stateful #${index}   点击计数: ${count}`}
          fontSize={14}
          color={theme.text}
        />
        <SizedBox height={4} />
        <Text text={`primary = ${theme.primary}`} fontSize={12} color={theme.primary} />
      </Container>
    </GestureDetector>
  );
}

export default function ThemeDemo() {
  const hostTheme = useTheme();

  const bg = hostTheme.isDark ? "#121212" : "#FAFAFA";
  const cardBg = hostTheme.isDark ? "#1E1E1E" : "#FFFFFF";
  const titleColor = hostTheme.isDark ? "#FFFFFF" : "#212121";
  const subColor = hostTheme.isDark ? "#B0BEC5" : "#757575";

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="主题色 Theme" />} />}
      backgroundColor={theme.background}
    >
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            {/* ============ 一、业务主题色 ============ */}
            <Text text="业务主题色(可设置)" fontSize={18} fontWeight="bold" color={titleColor} />
            <SizedBox height={8} />

            <Text
              text={`当前 primary = ${theme.primary}`}
              fontSize={13}
              color={subColor}
            />
            <SizedBox height={8} />

            <Column>
              <Button
                text="切换到蓝系品牌色"
                backgroundColor={theme.primary}
                textColor="#FFFFFF"
                onTap={() => Theme.setColors(BRAND_BLUE, { persist: false })}
              />
              <SizedBox height={8} />
              <Button
                text="切换到紫系品牌色"
                backgroundColor={theme.primary}
                textColor="#FFFFFF"
                onTap={() => Theme.setColors(BRAND_PURPLE, { persist: false })}
              />
            </Column>

            <SizedBox height={16} />
            <Text text="语义色实时视图(theme.xxx)" fontSize={15} fontWeight="bold" color={titleColor} />
            <SizedBox height={8} />
            <Container padding={12} decoration={{ color: cardBg, borderRadius: 8 }}>
              <Swatch name="primary" color={theme.primary} />
              <Swatch name="secondary" color={theme.secondary} />
              <Swatch name="success" color={theme.success} />
              <Swatch name="warning" color={theme.warning} />
              <Swatch name="danger" color={theme.danger} />
              <Swatch name="surface" color={theme.surface} />
              <Swatch name="text" color={theme.text} />
              <Swatch name="divider" color={theme.divider} />
            </Container>

            <SizedBox height={16} />

            {/* 非 stateful:验证 clearItemCache → itemBuilder 重取新色 */}
            <Text text="非 stateful ListView(滚几屏后切色)" fontSize={15} fontWeight="bold" color={titleColor} />
            <SizedBox height={8} />
            <Container height={280} decoration={{ color: cardBg, borderRadius: 8 }}>
              <ListView
                itemCount={80}
                itemBuilder={(index) => (
                  <Container
                    margin={{ horizontal: 16, vertical: 4 }}
                    padding={12}
                    decoration={{ color: theme.surface, borderRadius: 8 }}
                  >
                    <Text text={`item #${index}`} fontSize={14} color={theme.text} />
                    <SizedBox height={4} />
                    <Text text={`primary = ${theme.primary}`} fontSize={12} color={theme.primary} />
                  </Container>
                )}
              />
            </Container>
            <SizedBox height={4} />
            <Text
              text="说明:滚到第 30+ 项后再切换品牌色,缓存项与新渲染项都会自动换色。"
              fontSize={12}
              color={subColor}
            />

            <SizedBox height={16} />

            {/* stateful:验证 patchOps 原地更新、项状态保留 */}
            <Text text="stateful ListView(项内计数,切色后不丢)" fontSize={15} fontWeight="bold" color={titleColor} />
            <SizedBox height={8} />
            <Container height={280} decoration={{ color: cardBg, borderRadius: 8 }}>
              <ListView
                itemCount={20}
                stateful={true}
                itemBuilder={(index) => <StatefulItem index={index} />}
              />
            </Container>
            <SizedBox height={4} />
            <Text
              text="说明:先点几项累计计数,再切换品牌色——颜色更新,计数保留。"
              fontSize={12}
              color={subColor}
            />

            <SizedBox height={24} />
            <Divider />
            <SizedBox height={16} />

            {/* ============ 二、宿主快照(只读对照) ============ */}
            <Text text="宿主主题快照(useTheme,只读)" fontSize={18} fontWeight="bold" color={titleColor} />
            <SizedBox height={8} />
            <Container padding={16} decoration={{ color: cardBg, borderRadius: hostTheme.borderRadius }}>
              <Text
                text={hostTheme.isDark ? "Dark Mode" : "Light Mode"}
                fontSize={20}
                fontWeight="bold"
                color={titleColor}
              />
              <SizedBox height={4} />
              <Text text={`brightness: ${hostTheme.brightness}`} fontSize={13} color={subColor} />
            </Container>

            <SizedBox height={8} />
            <Container padding={12} decoration={{ color: cardBg, borderRadius: 8 }}>
              <Swatch name="primary" color={hostTheme.primaryColor} />
              <Swatch name="scaffold" color={hostTheme.scaffoldBackgroundColor} />
              <Swatch name="surface" color={hostTheme.surfaceColor} />
              {hostTheme.textColor ? <Swatch name="text" color={hostTheme.textColor} /> : null}
            </Container>

            <SizedBox height={8} />
            <Container padding={12} decoration={{ color: cardBg, borderRadius: 8 }}>
              <Field label="brightness" value={hostTheme.brightness} />
              <Field label="isDark" value={String(hostTheme.isDark)} />
              <Field label="primaryColor" value={hostTheme.primaryColor} />
              <Field label="surfaceColor" value={hostTheme.surfaceColor} />
              <Field label="textColor" value={hostTheme.textColor ?? "(unset)"} />
              <Field label="borderRadius" value={hostTheme.borderRadius.toString()} />
            </Container>

            <SizedBox height={24} />
            <Text
              text="宿主快照由 Flutter 端 MaterialApp.theme 驱动(切系统暗黑模式后回此页可见变化);业务主题色由 Theme.setColors 驱动,两者互补。"
              fontSize={12}
              color={subColor}
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
