import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Button,
  Container,
  Opacity,
  Transform,
  SizedBox,
  Divider,
  Center,
  useAnimation,
  ToastService,
} from "fuickjs";

export default function AnimationDemo() {
  const [fadeToggle, setFadeToggle] = useState(false);
  const [bounceToggle, setBounceToggle] = useState(false);
  const [width, setWidth] = useState(false);

  // 1. 淡入：autoStart 自动播放 + onComplete 回调
  const fade = useAnimation({
    from: 0,
    to: 1,
    duration: 600,
    curve: "easeOut",
  });
  fade.onComplete(() => {
    ToastService.show("Fade 完成 ✅");
  });

  // 2. 弹跳：loop + reverse 往返循环
  const bounce = useAnimation({
    to: 0.6,
    duration: 400,
    curve: "easeOut",
    autoStart: true,
    loop: true,
    reverse: true,
  });

  // 3. 旋转：点击播放，反向播放 / 复位
  const spin = useAnimation({
    to: 2 * Math.PI,
    duration: 1200,
    curve: "easeInOut",
  });

  // 4. 尺寸动画：Container width + height 同时绑定
  const size = useAnimation({
    from: 80,
    to: 200,
    duration: 700,
    curve: "easeOut",
  });

  // 5. 位移 + setValue/setTo 控制
  const move = useAnimation({
    from: 0,
    to: 120,
    duration: 500,
    curve: "easeOut",
  });

  // 6. 进度条：手动控制 setTo 到不同值（宽度 0 → 300）
  const progress = useAnimation({ from: 0, to: 300, duration: 500 });

  return (
    <Scaffold appBar={<AppBar title="useAnimation 程序化动画" />}>
      <Column padding={16} crossAxisAlignment="stretch">
        {/* 1. 淡入 */}
        <Text text="1. 淡入 (autoStart + onComplete)" fontWeight="bold" margin={{ bottom: 8 }} />
        <Button
          text={fadeToggle ? "播放淡入" : "重新播放"}
          onTap={() => {
            setFadeToggle(!fadeToggle);
            fade.start();
          }}
        />
        <Container height={10} />
        <Opacity opacity={fade.value}>
          <Container
            height={60}
            color="#FF7043"
            alignment="center"
            decoration={{ color: "#FF7043", borderRadius: 8 }}
          >
            <Text text="Hello Animation 👋" color="white" fontWeight="bold" />
          </Container>
        </Opacity>

        <Divider height={24} />

        {/* 2. 循环弹跳 */}
        <Text text="2. 循环弹跳 (loop + reverse)" fontWeight="bold" margin={{ bottom: 8 }} />
        <Button
          text={bounceToggle ? "停止弹跳" : "开始弹跳"}
          onTap={() => {
            setBounceToggle(!bounceToggle);
            bounceToggle ? bounce.stop() : bounce.start();
          }}
        />
        <Container height={10} />
        <Center>
          <Transform scale={bounce.transform.scale()}>
            <Container width={80} height={80} color="#42A5F5" decoration={{ color: "#42A5F5", borderRadius: 40 }} />
          </Transform>
        </Center>

        <Divider height={24} />

        {/* 3. 旋转 */}
        <Text text="3. 旋转 + 反向" fontWeight="bold" margin={{ bottom: 8 }} />
        <Row>
          <Button text="旋转 360°" onTap={() => spin.start()}  margin={{ right: 8 }} />
          <Button text="反向" onTap={() => spin.reverse()}  margin={{ right: 8 }} />
          <Button text="复位" onTap={() => spin.reset()} />
        </Row>
        <Container height={10} />
        <Center>
          <Transform rotate={spin.transform.rotate()}>
            <Container width={80} height={80} color="#AB47BC" decoration={{ color: "#AB47BC", borderRadius: 8 }}>
              <Center>
                <Text text="🌀" fontSize={28} />
              </Center>
            </Container>
          </Transform>
        </Center>

        <Divider height={24} />

        {/* 4. 尺寸动画 */}
        <Text text="4. 尺寸动画 (width/height)" fontWeight="bold" margin={{ bottom: 8 }} />
        <Button
          text={width ? "收回去" : "展开"}
          onTap={() => {
            setWidth(!width);
            width ? size.reverse() : size.start();
          }}
        />
        <Container height={10} />
        <Container
          width={size.value}
          height={size.value}
          color="#66BB6A"
          alignment="center"
          decoration={{ color: "#66BB6A", borderRadius: 8 }}
        >
          <Text text="🍀" fontSize={24} />
        </Container>

        <Divider height={24} />

        {/* 5. 位移 + setValue/setTo */}
        <Text text="5. 位移 (setValue / setTo)" fontWeight="bold" margin={{ bottom: 8 }} />
        <Row>
          <Button text="右移 120" onTap={() => move.start()}  margin={{ right: 8 }} />
          <Button text="setTo 60" onTap={() => move.setTo(60)}  margin={{ right: 8 }} />
          <Button text="setValue 30" onTap={() => move.setValue(30)}  margin={{ right: 8 }} />
          <Button text="归位" onTap={() => move.reset()} />
        </Row>
        <Container height={10} />
        <Transform translate={move.transform.translateX()}>
          <Container width={60} height={60} color="#FFA726" decoration={{ color: "#FFA726", borderRadius: 30 }} />
        </Transform>

        <Divider height={24} />

        {/* 6. 进度条 setTo */}
        <Text text="6. 进度条 (setTo)" fontWeight="bold" margin={{ bottom: 8 }} />
        <Row>
          <Button text="25%" onTap={() => progress.setTo(75)}  margin={{ right: 8 }} />
          <Button text="50%" onTap={() => progress.setTo(150)}  margin={{ right: 8 }} />
          <Button text="100%" onTap={() => progress.setTo(300)}  margin={{ right: 8 }} />
          <Button text="复位" onTap={() => progress.reset()} />
        </Row>
        <Container height={10} />
        <Container
          height={20}
          color="#ECEFF1"
          decoration={{ color: "#ECEFF1", borderRadius: 10 }}
        >
          <Container
            width={progress.value}
            height={20}
            color="#26C6DA"
            decoration={{ color: "#26C6DA", borderRadius: 10 }}
          />
        </Container>
        <SizedBox height={30} />
      </Column>
    </Scaffold>
  );
}
