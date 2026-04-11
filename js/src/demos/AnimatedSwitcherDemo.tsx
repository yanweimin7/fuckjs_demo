import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  Center,
  SizedBox,
  Padding,
  Button,
  AnimatedSwitcher,
  Row,
  Divider,
} from "fuickjs";

const colors = ["#2196F3", "#FF5722", "#4CAF50", "#9C27B0", "#FF9800"];

export default function AnimatedSwitcherDemo() {
  const [count, setCount] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["Hello", "World", "FuickJS", "Flutter", "React"];

  return (
    <Scaffold appBar={<AppBar title={<Text text="AnimatedSwitcher" />} />}>
      <Padding padding={16}>
        <Column crossAxisAlignment="center">
          <Text text="数字切换" fontSize={18} fontWeight="bold" />
          <SizedBox height={8} />
          <Text text="key 变化触发淡入淡出动画" fontSize={14} color="#666" />
          <SizedBox height={16} />

          <AnimatedSwitcher duration={500} switchInCurve="easeIn" switchOutCurve="easeOut">
            <Container
              key={`num-${count}`}
              width={140}
              height={100}
              decoration={{
                color: colors[count % colors.length],
                borderRadius: 16,
              }}
              alignment="center"
            >
              <Text text={`${count}`} fontSize={48} color="white" fontWeight="bold" />
            </Container>
          </AnimatedSwitcher>
          <SizedBox height={16} />
          <Row mainAxisAlignment="center">
            <Button text=" - " onTap={() => setCount(count - 1)} />
            <SizedBox width={16} />
            <Button text=" + " onTap={() => setCount(count + 1)} />
          </Row>

          <Divider margin={{ top: 32, bottom: 32 }} />

          <Text text="文字切换" fontSize={18} fontWeight="bold" />
          <SizedBox height={8} />
          <Text text="switchInCurve: easeInOut" fontSize={14} color="#666" />
          <SizedBox height={16} />

          <AnimatedSwitcher duration={300} switchInCurve="easeInOut">
            <Text
              key={`text-${textIndex}`}
              text={texts[textIndex]}
              fontSize={36}
              fontWeight="bold"
              color="#333"
            />
          </AnimatedSwitcher>
          <SizedBox height={16} />
          <Button
            text="Next Text"
            onTap={() => setTextIndex((textIndex + 1) % texts.length)}
          />
        </Column>
      </Padding>
    </Scaffold>
  );
}
