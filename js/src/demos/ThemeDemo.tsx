import React from "react";
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
  useTheme,
} from "fuickjs";

/**
 * 演示 `useTheme()` hook。
 *
 * 主题数据来自宿主 `MaterialApp.theme` / `ThemeData`，
 * 通过 Flutter 端 `FuickThemeProvider` 注入到 DSL 树顶层。
 *
 * 切换系统暗黑模式 / 调用 `MaterialApp` 的 theme 时，
 * Flutter 端会推送 'themeChange' 事件，hook 自动刷新 state。
 *
 * 想看到效果：宿主 App 切换 dark mode 或修改 ThemeData 后再回此页。
 */
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

export default function ThemeDemo() {
  const theme = useTheme();

  const bg = theme.isDark ? "#121212" : "#FAFAFA";
  const cardBg = theme.isDark ? "#1E1E1E" : "#FFFFFF";
  const titleColor = theme.isDark ? "#FFFFFF" : "#212121";
  const subColor = theme.isDark ? "#B0BEC5" : "#757575";

  return (
    <Scaffold appBar={<AppBar title={<Text text="useTheme" />} />}>
      <Container color={bg}>
        <SingleChildScrollView>
          <Padding padding={16}>
            <Column crossAxisAlignment="start">
              <Container
                padding={16}
                decoration={{
                  color: cardBg,
                  borderRadius: theme.borderRadius,
                }}
              >
                <Text
                  text={theme.isDark ? "Dark Mode" : "Light Mode"}
                  fontSize={22}
                  fontWeight="bold"
                  color={titleColor}
                />
                <SizedBox height={4} />
                <Text
                  text={`brightness: ${theme.brightness}`}
                  fontSize={13}
                  color={subColor}
                />
              </Container>

              <SizedBox height={16} />

              <Text
                text="色板"
                fontSize={16}
                fontWeight="bold"
                color={titleColor}
              />
              <SizedBox height={8} />
              <Container
                padding={12}
                decoration={{ color: cardBg, borderRadius: 8 }}
              >
                <Swatch name="primary" color={theme.primaryColor} />
                <Swatch name="scaffold" color={theme.scaffoldBackgroundColor} />
                <Swatch name="surface" color={theme.surfaceColor} />
                {theme.textColor ? (
                  <Swatch name="text" color={theme.textColor} />
                ) : null}
                {theme.secondaryTextColor ? (
                  <Swatch name="subText" color={theme.secondaryTextColor} />
                ) : null}
              </Container>

              <SizedBox height={16} />
              <Divider />
              <SizedBox height={16} />

              <Text
                text="完整快照"
                fontSize={16}
                fontWeight="bold"
                color={titleColor}
              />
              <SizedBox height={8} />
              <Container
                padding={12}
                decoration={{ color: cardBg, borderRadius: 8 }}
              >
                <Field label="brightness" value={theme.brightness} />
                <Field label="isDark" value={String(theme.isDark)} />
                <Field label="primaryColor" value={theme.primaryColor} />
                <Field
                  label="scaffoldBg"
                  value={theme.scaffoldBackgroundColor}
                />
                <Field label="surfaceColor" value={theme.surfaceColor} />
                <Field label="textColor" value={theme.textColor ?? "(unset)"} />
                <Field
                  label="secondaryText"
                  value={theme.secondaryTextColor ?? "(unset)"}
                />
                <Field
                  label="borderRadius"
                  value={theme.borderRadius.toString()}
                />
              </Container>

              <SizedBox height={24} />

              <Text
                text="提示：切换系统暗黑模式或修改宿主 ThemeData 后回到此页，主题快照会自动更新。"
                fontSize={12}
                color={subColor}
              />
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
