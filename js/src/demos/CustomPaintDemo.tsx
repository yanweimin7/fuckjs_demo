import React, { useMemo, useRef } from 'react';
import {
  Scaffold,
  AppBar,
  CustomPaint,
  CustomPainter,
  Center,
  Text,
  Column,
  SizedBox,
  Button,
  Row,
  Container,
} from 'fuickjs';

const drawBackground = (p: CustomPainter) => {
  p.drawRect(
    { left: 0, top: 0, width: 300, height: 300 },
    { color: '#E0E0E0', style: 'fill' }
  );
  // Draw grid lines
  for (let i = 0; i <= 300; i += 30) {
    p.drawLine(
      { dx: i, dy: 0 },
      { dx: i, dy: 300 },
      { color: '#CCCCCC', strokeWidth: 1 }
    );
    p.drawLine(
      { dx: 0, dy: i },
      { dx: 300, dy: i },
      { color: '#CCCCCC', strokeWidth: 1 }
    );
  }
};

export default function CustomPaintDemo() {
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
    const colors = ['red', 'green', 'blue', 'orange', 'purple', '#80FFA500'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 直接调用绘制指令，追加到 painter 内部的 commands 列表
    painter.drawCircle(
      { dx: x, dy: y },
      r,
      { color, style: 'fill' }
    );

    // 触发重绘
    painter.repaint();
  };

  const addRotatedRect = () => {
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 200 + 50;
    const w = Math.random() * 40 + 20;
    const h = Math.random() * 40 + 20;
    const angle = Math.random() * Math.PI * 2;
    const color = 'rgba(0, 0, 255, 0.5)';

    painter.save();
    painter.translate(x, y);
    painter.rotate(angle);
    painter.drawRRect(
      { left: -w / 2, top: -h / 2, width: w, height: h, radius: 10 },
      { color, style: 'fill' }
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

  return (
    <Scaffold
      appBar={
        <AppBar
          title={<Text text="CustomPaint Interactive Demo" />}
        />
      }
    >
      <Center>
        <Column mainAxisSize="min">
          <Text text="Interactive Canvas" fontSize={20} fontWeight="bold" />
          <SizedBox height={10} />
          <Text text="Click buttons to add shapes dynamically" fontSize={14} color="grey" />
          <SizedBox height={20} />

          <Container
            decoration={{
              border: { color: 'black', width: 2 },
            }}
          >
            <CustomPaint
              size={{ width: 300, height: 300 }}
              painter={painter}
            />
          </Container>

          <SizedBox height={20} />

          <Row mainAxisAlignment="spaceEvenly">
            <Button text="Add Circle" onTap={addRandomCircle} />
            <Button text="Add Rect" onTap={addRotatedRect} />
            <Button text="Clear" onTap={clearCanvas} />
          </Row>

          <SizedBox height={20} />
          <Container
            width={200}
            padding={10}
            color="#f0f0f0"
            alignment="center"
          >
            <Text text="Changes are applied immediately without full re-render" fontSize={12} textAlign="center" />
          </Container>
        </Column>
      </Center>
    </Scaffold>
  );
}
