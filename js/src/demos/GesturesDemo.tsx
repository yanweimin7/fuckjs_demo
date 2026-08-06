import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Container,
  Center,
  GestureDetector,
  Divider,
  Transform,
} from "fuickjs";

export default function GesturesDemo() {
  // 1. 双指缩放
  const [scale, setScale] = useState(1.0);

  // 2. 自由拖拽（pan）——记录累计位移
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 3. 长按拖拽
  const [longPressDrag, setLongPressDrag] = useState({ x: 0, y: 0 });

  // 4. 垂直拖动
  const [verticalDrag, setVerticalDrag] = useState(0);

  // 5. 水平拖动
  const [horizontalDrag, setHorizontalDrag] = useState(0);

  const [panInfo, setPanInfo] = useState("拖动红色方块试试");
  const [scaleInfo, setScaleInfo] = useState("双指缩放图片 (scale: 1.0)");

  return (
    <Scaffold appBar={<AppBar title="手势扩展 (GestureDetector)" />}>
      <Column padding={16} crossAxisAlignment="stretch">
        {/* 1. 双指缩放 */}
        <Text text="1. 双指缩放 onScale*" fontWeight="bold" margin={{ bottom: 8 }} />
        <Center>
          <GestureDetector
            onScaleStart={(e) => setScaleInfo(`缩放开始 (fingers: ${e.pointerCount})`)}
            onScaleUpdate={(e) => {
              setScale(e.scale);
              setScaleInfo(`scale=${e.scale.toFixed(2)} focal=(${e.focalX.toFixed(0)}, ${e.focalY.toFixed(0)})`);
            }}
            onScaleEnd={() => setScaleInfo("缩放结束")}
          >
            <Transform scale={scale}>
              <Container
                width={140}
                height={140}
                color="#1E88E5"
                alignment="center"
                decoration={{ color: "#1E88E5", borderRadius: 12 }}
              >
                <Text text="👆🤏" fontSize={32} />
              </Container>
            </Transform>
          </GestureDetector>
        </Center>
        <Center>
          <Text text={scaleInfo} fontSize={12} color="#666666" margin={{ top: 6 }} />
        </Center>

        <Divider height={20} />

        {/* 2. 自由拖拽 */}
        <Text text="2. 自由拖拽 onPan*" fontWeight="bold" margin={{ bottom: 8 }} />
        <Center>
          <GestureDetector
            onPanStart={() => setPanInfo("开始拖动")}
            onPanUpdate={(e) =>
              setDragOffset((prev) => ({ x: prev.x + e.dx, y: prev.y + e.dy }))
            }
            onPanEnd={() => setPanInfo("拖动结束")}
          >
            <Transform translate={dragOffset}>
              <Container
                width={100}
                height={60}
                color="#E53935"
                alignment="center"
                decoration={{ color: "#E53935", borderRadius: 8 }}
              >
                <Text text="拖我" color="white" />
              </Container>
            </Transform>
          </GestureDetector>
        </Center>
        <Center>
          <Text text={panInfo} fontSize={12} color="#666666" margin={{ top: 6 }} />
        </Center>

        <Divider height={20} />

        {/* 3. 长按拖拽 */}
        <Text text="3. 长按拖拽 onLongPress*" fontWeight="bold" margin={{ bottom: 8 }} />
        <Center>
          <GestureDetector
            onLongPressStart={(e) => console.log("长按开始", e)}
            onLongPressMoveUpdate={(e) =>
              setLongPressDrag({ x: e.dx, y: e.dy })
            }
            onLongPressEnd={() => console.log("长按结束")}
          >
            <Transform translate={longPressDrag}>
              <Container
                width={100}
                height={60}
                color="#8E24AA"
                alignment="center"
                decoration={{ color: "#8E24AA", borderRadius: 8 }}
              >
                <Text text="长按拖动" color="white" />
              </Container>
            </Transform>
          </GestureDetector>
        </Center>
        <Center>
          <Text
            text={`偏移 (${longPressDrag.x.toFixed(0)}, ${longPressDrag.y.toFixed(0)})`}
            fontSize={12}
            color="#666666"
            margin={{ top: 6 }}
          />
        </Center>

        <Divider height={20} />

        {/* 4. 垂直拖动 */}
        <Text text="4. 垂直拖动 onVerticalDrag*" fontWeight="bold" margin={{ bottom: 8 }} />
        <Center>
          <GestureDetector
            onVerticalDragUpdate={(e) =>
              setVerticalDrag((prev) => prev + e.dy)
            }
          >
            <Transform translate={{ x: 0, y: verticalDrag }}>
              <Container
                width={100}
                height={50}
                color="#00897B"
                alignment="center"
                decoration={{ color: "#00897B", borderRadius: 8 }}
              >
                <Text text="上下拖" color="white" />
              </Container>
            </Transform>
          </GestureDetector>
        </Center>
        <Center>
          <Text text={`垂直位移: ${verticalDrag.toFixed(0)}`} fontSize={12} color="#666666" margin={{ top: 6 }} />
        </Center>

        <Divider height={20} />

        {/* 5. 水平拖动 */}
        <Text text="5. 水平拖动 onHorizontalDrag*" fontWeight="bold" margin={{ bottom: 8 }} />
        <Center>
          <GestureDetector
            onHorizontalDragUpdate={(e) =>
              setHorizontalDrag((prev) => prev + e.dx)
            }
          >
            <Transform translate={{ x: horizontalDrag, y: 0 }}>
              <Container
                width={100}
                height={50}
                color="#F4511E"
                alignment="center"
                decoration={{ color: "#F4511E", borderRadius: 8 }}
              >
                <Text text="左右拖" color="white" />
              </Container>
            </Transform>
          </GestureDetector>
        </Center>
        <Center>
          <Text text={`水平位移: ${horizontalDrag.toFixed(0)}`} fontSize={12} color="#666666" margin={{ top: 6 }} />
        </Center>

        {/* 重置按钮 */}
        <Container height={16} />
        <GestureDetector
          onTap={() => {
            setScale(1.0);
            setDragOffset({ x: 0, y: 0 });
            setLongPressDrag({ x: 0, y: 0 });
            setVerticalDrag(0);
            setHorizontalDrag(0);
            setPanInfo("已重置");
          }}
        >
          <Container
            height={44}
            color="#E0E0E0"
            alignment="center"
            decoration={{ color: "#E0E0E0", borderRadius: 22 }}
          >
            <Text text="重置所有手势" color="#424242" fontWeight="bold" />
          </Container>
        </GestureDetector>
        <Container height={30} />
      </Column>
    </Scaffold>
  );
}
