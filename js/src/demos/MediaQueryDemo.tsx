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
  useMediaQuery,
} from "fuickjs";

/**
 * 演示 `useMediaQuery()` hook。
 *
 * 数据来自宿主 `MediaQuery`，由 Flutter 端 `FuickMediaQueryProvider` 注入。
 *
 * 触发刷新的场景：
 * - 屏幕旋转（横屏 ↔ 竖屏）
 * - 系统暗黑模式切换
 * - 键盘弹起 / 收起（viewInsets.bottom 变化）
 * - 系统字号缩放（textScaleFactor 变化）
 */
function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Container
      padding={{ vertical: 8, horizontal: 12 }}
      margin={{ bottom: 6 }}
      decoration={{
        color: "#F5F5F5",
        borderRadius: 6,
      }}
    >
      <Text text={label} fontSize={12} color="#757575" />
      <SizedBox height={2} />
      <Text text={value} fontSize={16} color="#212121" fontWeight="bold" />
      {hint ? <SizedBox height={2} /> : null}
      {hint ? <Text text={hint} fontSize={11} color="#9E9E9E" /> : null}
    </Container>
  );
}

export default function MediaQueryDemo() {
  const mq = useMediaQuery();

  const isLandscape = mq.screenWidth > mq.screenHeight;
  const keyboardHeight = mq.viewInsets.bottom;
  const isKeyboardOpen = keyboardHeight > 0;
  const topInset = mq.viewPadding.top;
  const bottomInset = mq.viewPadding.bottom;

  return (
    <Scaffold appBar={<AppBar title={<Text text="useMediaQuery" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Container
              padding={16}
              decoration={{
                color: mq.isDark ? "#1E1E1E" : "#E3F2FD",
                borderRadius: 12,
              }}
            >
              <Text
                text={isLandscape ? "横屏 Landscape" : "竖屏 Portrait"}
                fontSize={22}
                fontWeight="bold"
                color={mq.isDark ? "#FFFFFF" : "#0D47A1"}
              />
              <SizedBox height={4} />
              <Text
                text={`${Math.round(mq.screenWidth)} × ${Math.round(mq.screenHeight)} @${mq.pixelRatio}x`}
                fontSize={14}
                color={mq.isDark ? "#B0BEC5" : "#1565C0"}
              />
            </Container>

            <SizedBox height={16} />
            <Text text="屏幕" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Stat
              label="screenWidth"
              value={mq.screenWidth.toString()}
              hint="逻辑像素，非物理像素"
            />
            <Stat label="screenHeight" value={mq.screenHeight.toString()} />
            <Stat
              label="pixelRatio"
              value={`${mq.pixelRatio.toString()} x`}
              hint="物理像素 = 逻辑像素 × pixelRatio"
            />

            <SizedBox height={12} />
            <Divider />
            <SizedBox height={12} />

            <Text text="外观" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Stat
              label="platformBrightness"
              value={mq.platformBrightness}
              hint={mq.isDark ? "暗黑模式已激活" : "明亮模式"}
            />
            <Stat
              label="textScaleFactor"
              value={`${mq.textScaleFactor.toString()} x`}
              hint="系统字号缩放，受设置 → 显示 → 字体大小影响"
            />

            <SizedBox height={12} />
            <Divider />
            <SizedBox height={12} />

            <Text text="安全区域 / 插入" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Stat
              label="viewPadding.top"
              value={topInset.toString()}
              hint="状态栏 / 刘海高度"
            />
            <Stat
              label="viewPadding.bottom"
              value={bottomInset.toString()}
              hint="Home Indicator 高度"
            />
            <Stat
              label="viewInsets.bottom"
              value={keyboardHeight.toString()}
              hint={
                isKeyboardOpen
                  ? `键盘已弹起（高度 ${Math.round(keyboardHeight)}）`
                  : "键盘未弹起"
              }
            />

            <SizedBox height={16} />
            <Text
              text="提示：旋转屏幕 / 弹起键盘 / 切换暗黑模式 / 改字号，所有数据会自动更新。"
              fontSize={12}
              color="#9E9E9E"
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
