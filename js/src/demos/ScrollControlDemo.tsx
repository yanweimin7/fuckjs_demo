import React, { useRef, useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Button,
  Container,
  ListView,
  Center,
  Expanded,
} from "fuickjs";

const TOTAL = 200;

export default function ScrollControlDemo() {
  const listRef = useRef<ListView>(null);
  const [scrollInfo, setScrollInfo] = useState("pixels: 0 / 0");
  const [loaded, setLoaded] = useState(40);

  return (
    <Scaffold appBar={<AppBar title="滚动控制 (Scroll Control)" />}>
      <Column padding={12} crossAxisAlignment="stretch">
        {/* 控制区 */}
        <Text text={`${scrollInfo}`} fontSize={12} color="#666666" />
        <Row margin={{ top: 8, bottom: 8 }}>
          <Button text="回顶" onTap={() => listRef.current?.scrollToTop()} />
          <Button text="到底" onTap={() => listRef.current?.scrollToBottom()} />
        </Row>
        <Row margin={{ bottom: 8 }}>
          <Button text="跳到 #50" onTap={() => listRef.current?.scrollToIndex(50)} />
          <Button text="跳到 #150" onTap={() => listRef.current?.scrollToIndex(150)} />
        </Row>
        <Row margin={{ bottom: 8 }}>
          <Button text="jumpTo 1000" onTap={() => listRef.current?.jumpTo(1000)} />
          <Button text="animateTo 3000" onTap={() => listRef.current?.animateTo(3000, 600)} />
          <Button
            text={`加载更多(${loaded})`}
            onTap={() => setLoaded((n) => Math.min(n + 40, TOTAL))}
          />
        </Row>

        {/* 列表 */}
        <Expanded>
          <ListView
            ref={listRef}
            itemCount={loaded}
            itemExtent={52}
            stateful={true}
            cacheKey={loaded}
            onScroll={(e) =>
              setScrollInfo(
                `pixels: ${e.pixels.toFixed(0)} / max: ${e.maxScrollExtent.toFixed(0)}`,
              )
            }
            onScrollEndReached={() => {
              setLoaded((n) => Math.min(n + 20, TOTAL));
            }}
            itemBuilder={(index) => (
              <Container
                height={52}
                margin={{ bottom: 4 }}
                padding={{ left: 12 }}
                alignment="center"
                decoration={{
                  color: index % 10 === 0 ? "#FFE0B2" : "#F5F5F5",
                  borderRadius: 8,
                }}
              >
                <Text
                  text={`Item #${index}${index % 10 === 0 ? " (十的倍数)" : ""}`}
                  color={index % 10 === 0 ? "#E65100" : "#424242"}
                  fontWeight={index % 10 === 0 ? "bold" : "normal"}
                />
              </Container>
            )}
          />
        </Expanded>
        <Center>
          <Text
            text="提示: itemExtent=52 时 scrollToIndex 精确滚动；滚到底部自动加载更多"
            fontSize={11}
            color="#999999"
            margin={{ top: 6 }}
          />
        </Center>
      </Column>
    </Scaffold>
  );
}
