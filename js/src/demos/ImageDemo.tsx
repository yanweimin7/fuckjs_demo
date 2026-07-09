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
  Padding,
} from "fuickjs";

const OWL =
  "https://flutter.github.io/assets-for-api-docs/assets/widgets/owl.jpg";
const BROKEN = "https://broken.url/not-exist.jpg";
const ASSET_SVG = "assets/images/logo.svg"; // 仅演示，实际以项目 assets 为准
// 48x48 九宫格演示图：蓝角 / 绿边 / 橙中心
const PATCH_48 = "assets/images/patch_48.png";

const FITS = [
  "cover",
  "contain",
  "fill",
  "fitWidth",
  "fitHeight",
  "none",
  "scaleDown",
] as const;

function SectionTitle({ text }: { text: string }) {
  return (
    <Text
      text={text}
      fontSize={15}
      fontWeight="bold"
      color="#333"
      margin={{ top: 20, bottom: 8 }}
    />
  );
}

export default function ImageDemo() {
  const [loadStatus, setLoadStatus] = useState("等待加载...");
  const [errorStatus, setErrorStatus] = useState("等待加载...");

  return (
    <Scaffold appBar={<AppBar title="Image Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">
          {/* ─── src（新 API）vs url（旧 API）─── */}
          <SectionTitle text="src（推荐）vs url（向后兼容）" />
          <Row>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={OWL}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
              />
              <Text
                text="src="
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center">
              <Image
                url={OWL}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
              />
              <Text
                text="url=（兼容）"
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
          </Row>

          {/* ─── fit 模式 ─── */}
          <SectionTitle text="fit 模式（80×80 容器）" />
          <Row>
            {FITS.map((fit) => (
              <Column
                key={fit}
                crossAxisAlignment="center"
                margin={{ right: 8 }}
              >
                <Container
                  width={60}
                  height={60}
                  decoration={{ color: "#ECEFF1", borderRadius: 4 }}
                >
                  <Image src={OWL} width={60} height={60} fit={fit} />
                </Container>
                <Text
                  text={fit}
                  fontSize={9}
                  color="#757575"
                  margin={{ top: 2 }}
                />
              </Column>
            ))}
          </Row>

          {/* ─── borderRadius ─── */}
          <SectionTitle text="borderRadius 裁剪" />
          <Row>
            <Image
              src={OWL}
              width={80}
              height={80}
              fit="cover"
              borderRadius={8}
              margin={{ right: 12 }}
            />
            <Image
              src={OWL}
              width={80}
              height={80}
              fit="cover"
              borderRadius={40}
              margin={{ right: 12 }}
            />
            <Image
              src={OWL}
              width={80}
              height={80}
              fit="cover"
              borderRadius={{
                topLeft: 20,
                topRight: 0,
                bottomRight: 20,
                bottomLeft: 0,
              }}
            />
          </Row>

          {/* ─── tintColor ─── */}
          <SectionTitle text="tintColor 颜色叠加（推荐）vs color（兼容）" />
          <Row>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={OWL}
                width={80}
                height={80}
                fit="cover"
                borderRadius={8}
                tintColor="#1976D2"
              />
              <Text
                text="tintColor=蓝"
                fontSize={10}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={OWL}
                width={80}
                height={80}
                fit="cover"
                borderRadius={8}
                tintColor="#E91E63"
              />
              <Text
                text="tintColor=粉"
                fontSize={10}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center">
              <Image
                src={OWL}
                width={80}
                height={80}
                fit="cover"
                borderRadius={8}
                color="#43A047"
              />
              <Text
                text="color=绿（兼容）"
                fontSize={10}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
          </Row>

          {/* ─── placeholderColor ─── */}
          <SectionTitle text="placeholderColor 加载占位色（网络图片）" />
          <Row>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={OWL}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
                placeholderColor="#BBDEFB"
              />
              <Text
                text="蓝色占位"
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center">
              <Image
                src={OWL}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
              />
              <Text
                text="默认占位（灰）"
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
          </Row>

          {/* ─── errorSrc 备用图 ─── */}
          <SectionTitle text="errorSrc 加载失败备用图" />
          <Row>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={BROKEN}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
                errorSrc={OWL}
              />
              <Text
                text="失败→备用图"
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center">
              <Image
                src={BROKEN}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
              />
              <Text
                text="失败→broken_image"
                fontSize={11}
                color="#757575"
                margin={{ top: 4 }}
              />
            </Column>
          </Row>

          {/* ─── onLoad / onError 回调 ─── */}
          <SectionTitle text="onLoad / onError 回调" />
          <Row>
            <Column crossAxisAlignment="center" margin={{ right: 12 }}>
              <Image
                src={OWL}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
                onLoad={() => setLoadStatus("✓ 加载成功")}
                onError={() => setLoadStatus("✗ 加载失败")}
              />
              <Text
                text={loadStatus}
                fontSize={11}
                color="#43A047"
                margin={{ top: 4 }}
              />
            </Column>
            <Column crossAxisAlignment="center">
              <Image
                src={BROKEN}
                width={100}
                height={100}
                fit="cover"
                borderRadius={8}
                onLoad={() => setErrorStatus("✓ 加载成功")}
                onError={() => setErrorStatus("✗ 加载失败")}
              />
              <Text
                text={errorStatus}
                fontSize={11}
                color="#E53935"
                margin={{ top: 4 }}
              />
            </Column>
          </Row>

          {/* ─── 本地文件路径 ─── */}
          <SectionTitle text="本地文件路径（file:// & 绝对路径）" />
          <Container
            padding={12}
            decoration={{
              color: "#FFF8E1",
              borderRadius: 8,
              border: { color: "#FFE082", width: 1 },
            }}
            margin={{ bottom: 8 }}
          >
            <Text
              text={
                "在 Flutter 侧通过 FileSystem 服务获取本地路径后传入 src：\n• file:///data/user/0/.../photo.jpg\n• /data/user/0/.../photo.jpg"
              }
              fontSize={12}
              color="#795548"
            />
          </Container>
          <Text
            text="示例（需替换为设备上实际存在的路径）："
            fontSize={12}
            color="#9E9E9E"
            margin={{ bottom: 4 }}
          />
          <Image
            src="file:///nonexistent/path/image.jpg"
            width={120}
            height={120}
            fit="cover"
            borderRadius={8}
            errorSrc={OWL}
          />
          <Text
            text="文件不存在 → 降级到 errorSrc"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4 }}
          />

          {/* ─── base64 ─── */}
          <SectionTitle text="base64 内联图片" />
          <Image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGNQnPaZJMQwqmFUw/DVAACnNaoQK5bsTwAAAABJRU5ErkJggg=="
            width={40}
            height={40}
          />
          <Text
            text="16×16 蓝色 PNG (base64)"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4 }}
          />

          {/* ─── gaplessPlayback ─── */}
          <SectionTitle text="gaplessPlayback（切换 URL 时保留旧图）" />
          <Image
            src={OWL}
            width={120}
            height={80}
            fit="cover"
            borderRadius={8}
            gaplessPlayback={true}
          />
          <Text
            text="gaplessPlayback=true，URL 切换时不闪白"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4 }}
          />

          {/* ─── centerSlice 九宫格拉伸 ─── */}
          <SectionTitle text="centerSlice 九宫格拉伸（9-patch）" />
          <Container
            padding={10}
            decoration={{
              color: "#FFF3E0",
              borderRadius: 6,
              border: { color: "#FFE0B2", width: 1 },
            }}
            margin={{ bottom: 10 }}
          >
            <Text
              text="centerSlice 把图按 {left, top, right, bottom} 分成 9 块，4 个角按原大小绘制、4 条边单向拉伸、中心双向拉伸。常用于气泡/按钮背景的任意尺寸自适应。坐标以图片原始像素为单位。SVG 不支持此属性（已自动忽略）。【硬约束 1】centerSlice 必须配 fit=fill；传其他 fit 会触发 Flutter 断言崩溃，parser 自动强制改为 fill。【硬约束 2】centerSlice 边框 (left + imageWidth - right) 必须 <= widget 宽度，上下同理；否则 paintImage 内部 outputSize 变负导致 applyBoxFit 返回 Size.zero 触发断言。"
              fontSize={12}
              color="#E65100"
            />
          </Container>

          <Text
            text="原图（48×48，放大 2×显示）"
            fontSize={11}
            color="#9E9E9E"
            margin={{ bottom: 4 }}
          />
          <Image src={PATCH_48} width={96} height={96} fit="none" />
          <Text text=" " fontSize={11} />

          <Text
            text="fit=fill + centerSlice=16/16/32/32 (240×120 容器)"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 12, bottom: 4 }}
          />
          <Container
            width={240}
            height={120}
            decoration={{
              color: "#FAFAFA",
              border: { color: "#BDBDBD", width: 1 },
            }}
          >
            <Image
              src={PATCH_48}
              width={240}
              height={120}
              fit="fill"
              centerSlice={{ left: 16, top: 16, right: 32, bottom: 32 }}
            />
          </Container>
          <Text
            text="4 个 16×16 蓝角保持原大小，绿边单向拉伸，橙中心双向拉伸"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 4 }}
          />

          <Text
            text="对比：fit=fill 无 centerSlice（240×120，整图均匀缩放）"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 12, bottom: 4 }}
          />
          <Container
            width={240}
            height={120}
            decoration={{
              color: "#FAFAFA",
              border: { color: "#BDBDBD", width: 1 },
            }}
          >
            <Image src={PATCH_48} width={240} height={120} fit="fill" />
          </Container>

          <Text
            text="带 tintColor + centerSlice"
            fontSize={11}
            color="#9E9E9E"
            margin={{ top: 12, bottom: 4 }}
          />
          <Container
            width={240}
            height={80}
            decoration={{
              color: "#FAFAFA",
              border: { color: "#BDBDBD", width: 1 },
            }}
          >
            <Image
              src={PATCH_48}
              width={240}
              height={80}
              fit="fill"
              centerSlice={{ left: 16, top: 16, right: 32, bottom: 32 }}
              tintColor="#1976D2"
            />
          </Container>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
