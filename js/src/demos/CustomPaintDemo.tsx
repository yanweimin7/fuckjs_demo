import React, { useRef, useState } from "react";
import {
  Scaffold,
  AppBar,
  CustomPaint,
  CustomPainter,
  Path,
  Center,
  Text,
  Column,
  SizedBox,
  Button,
  Row,
  Container,
  SingleChildScrollView,
  Padding,
  ListTile,
} from "fuickjs";

const OWL =
  "https://flutter.github.io/assets-for-api-docs/assets/widgets/owl.jpg";

const drawBackground = (p: CustomPainter) => {
  p.drawRect(
    { left: 0, top: 0, width: 300, height: 300 },
    { color: "#E0E0E0", style: "fill" },
  );
  // Draw grid lines
  for (let i = 0; i <= 300; i += 30) {
    p.drawLine(
      { dx: i, dy: 0 },
      { dx: i, dy: 300 },
      { color: "#CCCCCC", strokeWidth: 1 },
    );
    p.drawLine(
      { dx: 0, dy: i },
      { dx: 300, dy: i },
      { color: "#CCCCCC", strokeWidth: 1 },
    );
  }
};

// ── 静态能力示例（渐变 / 裁剪 / 模糊 / 文本 / 图片）────────────────────────

// 1. 渐变：圆角矩形线性渐变 + 圆形径向渐变（rect 限定 shader 范围）
const gradientPainter = (() => {
  const p = new CustomPainter();
  p.drawRRect(
    { left: 0, top: 0, width: 300, height: 140, radius: 16 },
    {
      gradient: {
        type: "linear",
        colors: ["#FF6B6B", "#4ECDC4"],
        begin: "topLeft",
        end: "bottomRight",
      },
    },
  );
  p.drawCircle({ dx: 240, dy: 70 }, 45, {
    gradient: {
      type: "radial",
      colors: ["#FFFFFF", "#FFD93D"],
      rect: { left: 195, top: 25, width: 90, height: 90 },
    },
  });
  return p;
})();

// 2. 裁剪：clipRRect 裁剪渐变斜纹；clipPath 用 Path 裁剪星形
const clipPainter = (() => {
  const p = new CustomPainter();

  p.save();
  p.clipRRect({ left: 0, top: 0, width: 140, height: 140, radius: 24 });
  p.drawRect(
    { left: 0, top: 0, width: 140, height: 140 },
    {
      gradient: {
        type: "linear",
        colors: ["#4F46E5", "#22D3EE"],
        begin: "topLeft",
        end: "bottomRight",
      },
    },
  );
  for (let i = -140; i < 140; i += 20) {
    p.drawLine(
      { dx: i, dy: 0 },
      { dx: i + 140, dy: 140 },
      { color: "rgba(255,255,255,0.35)", strokeWidth: 6 },
    );
  }
  p.restore();

  // 星形 Path → 裁剪后再画圆点
  const star = new Path();
  const cx = 230;
  const cy = 70;
  const outerR = 60;
  const innerR = 26;
  star.moveTo(cx, cy - outerR);
  for (let i = 0; i < 5; i++) {
    const outerAngle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const innerAngle = outerAngle + Math.PI / 5;
    star.lineTo(
      cx + outerR * Math.cos(outerAngle),
      cy - outerR * Math.sin(outerAngle),
    );
    star.lineTo(
      cx + innerR * Math.cos(innerAngle),
      cy - innerR * Math.sin(innerAngle),
    );
  }
  star.close();

  p.save();
  p.clipPath(star);
  p.drawRect(
    { left: 160, top: 0, width: 140, height: 140 },
    { color: "#FDE047" },
  );
  for (let y = 0; y < 140; y += 12) {
    p.drawCircle({ dx: 230, dy: y }, 3, { color: "#F97316" });
  }
  p.restore();

  return p;
})();

// 3. 模糊：不同 sigma 的 MaskFilter.blur
const blurPainter = (() => {
  const p = new CustomPainter();
  p.drawCircle({ dx: 60, dy: 70 }, 40, { color: "#3B82F6", blur: 16 });
  p.drawCircle({ dx: 130, dy: 70 }, 40, { color: "#EF4444", blur: 4 });
  p.drawCircle({ dx: 200, dy: 70 }, 40, { color: "#10B981" });
  return p;
})();

// 4. 文本：drawText + 样式 / 对齐 / 省略
const textPainter = (() => {
  const p = new CustomPainter();
  p.drawText(
    "Hello CustomPaint",
    { dx: 16, dy: 16 },
    { color: "#111827", fontSize: 22, fontWeight: "bold" },
  );
  p.drawText(
    "渐变 · 裁剪 · 模糊 · 文本 · 图片",
    { dx: 16, dy: 52 },
    { color: "#6B7280", fontSize: 14 },
  );
  p.drawText(
    "这是一段会被省略的超长居中文本内容示例",
    { dx: 16, dy: 80 },
    {
      color: "#2563EB",
      fontSize: 14,
      textAlign: "center",
      maxLines: 1,
      ellipsis: true,
    },
  );
  return p;
})();

// 5. 图片：drawImage（网络位图，异步解析）
const imagePainter = (() => {
  const p = new CustomPainter();
  p.save();
  p.clipRRect({ left: 0, top: 0, width: 140, height: 140, radius: 20 });
  p.drawImage(
    OWL,
    { left: 0, top: 0, width: 140, height: 140 },
    { fit: "cover" },
  );
  p.restore();

  p.drawImage(
    OWL,
    { left: 160, top: 0, width: 140, height: 140 },
    { fit: "contain", paint: { color: "rgba(255,255,255,0.6)" } },
  );
  return p;
})();

interface Example {
  key: string;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  painter: CustomPainter;
}

const EXAMPLES: Example[] = [
  {
    key: "gradient",
    title: "1. 渐变 Gradient",
    subtitle: "linear / radial，rect 限定 shader 范围",
    width: 300,
    height: 140,
    painter: gradientPainter,
  },
  {
    key: "clip",
    title: "2. 裁剪 Clip",
    subtitle: "clipRRect / clipPath",
    width: 300,
    height: 140,
    painter: clipPainter,
  },
  {
    key: "blur",
    title: "3. 模糊 Blur",
    subtitle: "MaskFilter.blur，不同 sigma",
    width: 300,
    height: 140,
    painter: blurPainter,
  },
  {
    key: "text",
    title: "4. 文本 DrawText",
    subtitle: "样式 / 对齐 / 省略",
    width: 300,
    height: 120,
    painter: textPainter,
  },
  {
    key: "image",
    title: "5. 图片 DrawImage",
    subtitle: "cover 圆角裁剪 / contain 半透明",
    width: 300,
    height: 140,
    painter: imagePainter,
  },
];

export default function CustomPaintDemo() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  // 使用 useRef 保持 painter 实例 (Buffer 模式)
  const painterRef = useRef<CustomPainter>(null!);
  if (!painterRef.current) {
    painterRef.current = new CustomPainter();
    // 初始化背景
    drawBackground(painterRef.current);
  }
  const painter = painterRef.current;

  const addRandomCircle = () => {
    const x = Math.random() * 300;
    const y = Math.random() * 300;
    const r = Math.random() * 20 + 5;
    const colors = ["red", "green", "blue", "orange", "purple", "#80FFA500"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 直接调用绘制指令，追加到 painter 内部的 commands 列表
    painter.drawCircle({ dx: x, dy: y }, r, { color, style: "fill" });

    // 触发重绘
    painter.repaint();
  };

  const addRotatedRect = () => {
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 200 + 50;
    const w = Math.random() * 40 + 20;
    const h = Math.random() * 40 + 20;
    const angle = Math.random() * Math.PI * 2;
    const color = "rgba(0, 0, 255, 0.5)";

    painter.save();
    painter.translate(x, y);
    painter.rotate(angle);
    painter.drawRRect(
      { left: -w / 2, top: -h / 2, width: w, height: h, radius: 10 },
      { color, style: "fill" },
    );
    painter.restore();

    painter.repaint();
  };

  const clearCanvas = () => {
    // 清空内部指令缓存
    painter.clear();
    // 重新绘制背景
    drawBackground(painter);
    painter.repaint();
  };

  const addStarPath = () => {
    const path = new Path();
    const cx = Math.random() * 200 + 50;
    const cy = Math.random() * 200 + 50;
    const outerR = 25;
    const innerR = 12;
    // Draw a 5-point star using Path
    path.moveTo(cx, cy - outerR);
    for (let i = 0; i < 5; i++) {
      const outerAngle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const innerAngle = outerAngle + Math.PI / 5;
      path.lineTo(
        cx + outerR * Math.cos(outerAngle),
        cy - outerR * Math.sin(outerAngle),
      );
      path.lineTo(
        cx + innerR * Math.cos(innerAngle),
        cy - innerR * Math.sin(innerAngle),
      );
    }
    path.close();

    painter.drawPath(path, { color: "#FFD700", style: "fill" });
    painter.repaint();
  };

  const addBezierPath = () => {
    const path = new Path();
    const startX = Math.random() * 50 + 20;
    const startY = Math.random() * 50 + 150;
    path.moveTo(startX, startY);
    path.cubicTo(
      startX + 50,
      startY - 80,
      startX + 150,
      startY + 80,
      startX + 200,
      startY,
    );

    painter.drawPath(path, {
      color: "#FF4444",
      style: "stroke",
      strokeWidth: 3,
    });
    painter.repaint();
  };

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  return (
    <Scaffold appBar={<AppBar title={<Text text="CustomPaint Demo" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            <Center>
              <Column mainAxisSize="min">
                <Text text="交互画布" fontSize={20} fontWeight="bold" />
                <SizedBox height={8} />
                <Text
                  text="点击按钮动态追加图形指令"
                  fontSize={14}
                  color="grey"
                />
                <SizedBox height={16} />

                <Container
                  decoration={{ border: { color: "black", width: 2 } }}
                >
                  <CustomPaint
                    size={{ width: 300, height: 300 }}
                    painter={painter}
                  />
                </Container>

                <SizedBox height={20} />

                <Row mainAxisAlignment="spaceEvenly">
                  <Button text="Circle" onTap={addRandomCircle} />
                  <Button text="Rect" onTap={addRotatedRect} />
                  <Button text="Star" onTap={addStarPath} />
                  <Button text="Bezier" onTap={addBezierPath} />
                  <Button text="Clear" onTap={clearCanvas} />
                </Row>
              </Column>
            </Center>

            <SizedBox height={28} />

            <Text text="2D 能力示例" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text text="点击条目展开对应示例" fontSize={12} color="#6B7280" />
            <SizedBox height={12} />

            {EXAMPLES.map((ex) => {
              const expanded = openKey === ex.key;
              return (
                <Container
                  key={ex.key}
                  margin={{ bottom: 10 }}
                  decoration={{
                    border: { color: "#E5E7EB", width: 1 },
                    borderRadius: 10,
                  }}
                >
                  <Column crossAxisAlignment="start">
                    <ListTile
                      title={
                        <Text text={ex.title} fontSize={15} fontWeight="bold" />
                      }
                      subtitle={
                        <Text
                          text={ex.subtitle}
                          fontSize={12}
                          color="#6B7280"
                        />
                      }
                      trailing={
                        <Text
                          text={expanded ? "▾" : "▸"}
                          fontSize={18}
                          color="#6B7280"
                        />
                      }
                      onTap={() => toggle(ex.key)}
                    />
                    {expanded && (
                      <Padding padding={{ left: 12, right: 12, bottom: 12 }}>
                        <CustomPaint
                          size={{ width: ex.width, height: ex.height }}
                          painter={ex.painter}
                        />
                      </Padding>
                    )}
                  </Column>
                </Container>
              );
            })}

            <SizedBox height={24} />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
