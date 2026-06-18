import React, { useState } from "react";
import {
  Image,
  Scaffold,
  AppBar,
  SingleChildScrollView,
  Column,
  Row,
  Text,
  Container,
} from "fuickjs";

/** bundle zip 内相对路径（框架 toDsl 会改写为 file://<root>/assets/...） */
const LOCAL_LOGO = "images/demo-logo.svg";
const LOCAL_BANNER = "images/demo-banner.svg";
/** 故意错误路径，用于验证 errorSrc 降级 */
const LOCAL_MISSING = "images/not-in-zip.png";

type BundleInfo = { name?: string; root?: string | null };

function readBundleInfo(): BundleInfo {
  try {
    const b = (globalThis as { __FUICK_BUNDLE__?: BundleInfo })
      .__FUICK_BUNDLE__;
    return b ?? {};
  } catch {
    return {};
  }
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Container
      padding={{ horizontal: 8, vertical: 4 }}
      decoration={{
        color: ok ? "#E8F5E9" : "#FFEBEE",
        borderRadius: 4,
        border: { width: 1, color: ok ? "#A5D6A7" : "#EF9A9A" },
      }}
      margin={{ right: 8, bottom: 8 }}
    >
      <Text text={label} fontSize={12} color={ok ? "#2E7D32" : "#C62828"} />
    </Container>
  );
}

export default function BundleLocalImageDemo() {
  const bundle = readBundleInfo();
  const [logoOk, setLogoOk] = useState<boolean | null>(null);
  const [bannerOk, setBannerOk] = useState<boolean | null>(null);
  const [missingFailed, setMissingFailed] = useState<boolean | null>(null);

  const hasRoot = Boolean(bundle.root);

  return (
    <Scaffold appBar={<AppBar title="Bundle 本地图片" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">
          <Text
            text="验证 bundle 解压后，相对路径图片能否通过 __FUICK_BUNDLE__.root 透明加载。"
            fontSize={14}
            color="#424242"
            margin={{ bottom: 12 }}
          />

          <Container
            width={9999}
            padding={12}
            decoration={{ color: "#EEF0FF", borderRadius: 8 }}
            margin={{ bottom: 16 }}
          >
            <Text
              text={`bundle.name: ${bundle.name ?? "(未注入)"}`}
              fontSize={12}
              color="#3949AB"
            />
            <Text
              text={`bundle.root: ${bundle.root ?? "(空 → 走 Image.asset 兜底)"}`}
              fontSize={12}
              color="#3949AB"
              margin={{ top: 4 }}
            />
          </Container>

          <Row margin={{ bottom: 8 }}>
            {logoOk === true && <StatusBadge ok label="logo ✓" />}
            {bannerOk === true && <StatusBadge ok label="banner ✓" />}
            {missingFailed === true && (
              <StatusBadge ok label="missing → errorSrc ✓" />
            )}
            {logoOk === false && <StatusBadge ok={false} label="logo ✗" />}
            {bannerOk === false && <StatusBadge ok={false} label="banner ✗" />}
          </Row>

          <Text
            text="1. SVG Logo（images/demo-logo.svg）"
            fontSize={15}
            fontWeight="bold"
            color="#333"
            margin={{ bottom: 8 }}
          />
          <Image
            src={LOCAL_LOGO}
            width={120}
            height={120}
            fit="contain"
            onLoad={() => setLogoOk(true)}
            onError={() => setLogoOk(false)}
          />
          <Text
            text={`src="${LOCAL_LOGO}"`}
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4, bottom: 16 }}
          />

          <Text
            text="2. SVG Banner（images/demo-banner.svg）"
            fontSize={15}
            fontWeight="bold"
            color="#333"
            margin={{ bottom: 8 }}
          />
          <Image
            src={LOCAL_BANNER}
            width={320}
            height={80}
            fit="contain"
            borderRadius={8}
            onLoad={() => setBannerOk(true)}
            onError={() => setBannerOk(false)}
          />
          <Text
            text={`src="${LOCAL_BANNER}"`}
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4, bottom: 16 }}
          />

          <Text
            text="3. 缺失文件 + errorSrc 降级"
            fontSize={15}
            fontWeight="bold"
            color="#333"
            margin={{ bottom: 8 }}
          />
          <Image
            src={LOCAL_MISSING}
            errorSrc={LOCAL_LOGO}
            width={80}
            height={80}
            fit="cover"
            borderRadius={8}
            onError={() => setMissingFailed(true)}
          />
          <Text
            text={`src="${LOCAL_MISSING}" → errorSrc="${LOCAL_LOGO}"`}
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4, bottom: 16 }}
          />

          <Container
            padding={12}
            decoration={{
              color: hasRoot ? "#E8F5E9" : "#FFF3E0",
              borderRadius: 8,
            }}
          >
            <Text
              text={
                hasRoot
                  ? "✓ 已从动态包目录加载（zip 解压成功且 root 已注入）"
                  : "⚠ root 为空：未走动态包，相对路径可能无法加载（检查 Offline 是否 init、是否从 zip 解压）"
              }
              fontSize={13}
              color={hasRoot ? "#2E7D32" : "#E65100"}
            />
          </Container>

          <Container height={32} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
