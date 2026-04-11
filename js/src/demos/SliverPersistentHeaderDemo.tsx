import React from "react";
import {
  CustomScrollView,
  SliverPersistentHeader,
  SliverList,
  SliverToBoxAdapter,
  Container,
  Text,
  Scaffold,
  AppBar,
  Center,
  Column,
  Divider,
} from "fuickjs";

export default function SliverPersistentHeaderDemo() {
  return (
    <Scaffold appBar={<AppBar title="SliverPersistentHeader Demo" />}>
      <CustomScrollView>
        <SliverToBoxAdapter>
          <Container height={150} color="#E3F2FD">
            <Center>
              <Text text="Scroll down to see sticky headers" fontSize={18} />
            </Center>
          </Container>
        </SliverToBoxAdapter>

        {/* 基础吸顶演示 */}
        <SliverPersistentHeader pinned={true} minExtent={50} maxExtent={50}>
          <Container color="#2196F3" padding={{ left: 16 }} alignment="topLeft">
            <Center>
              <Text
                text="Sticky Header 1 (Pinned)"
                color="white"
                fontWeight="bold"
              />
            </Center>
          </Container>
        </SliverPersistentHeader>

        <SliverList
          itemCount={15}
          itemBuilder={(index) => (
            <Container
              height={50}
              padding={{ left: 16 }}
              color="white"
              alignment="topLeft"
            >
              <Column crossAxisAlignment="start" mainAxisAlignment="center">
                <Text text={`List Item ${index}`} />
                <Divider height={1} color="#EEEEEE" />
              </Column>
            </Container>
          )}
        />

        {/* 另一个吸顶，演示多个 Header 堆叠 */}
        <SliverPersistentHeader pinned={true} minExtent={50} maxExtent={50}>
          <Container color="#4CAF50" padding={{ left: 16 }} alignment="topLeft">
            <Center>
              <Text
                text="Sticky Header 2 (Pinned)"
                color="white"
                fontWeight="bold"
              />
            </Center>
          </Container>
        </SliverPersistentHeader>

        <SliverList
          itemCount={20}
          itemBuilder={(index) => (
            <Container
              height={50}
              padding={{ left: 16 }}
              color="white"
              alignment="topLeft"
            >
              <Column crossAxisAlignment="start" mainAxisAlignment="center">
                <Text text={`Another List Item ${index}`} />
                <Divider height={1} color="#EEEEEE" />
              </Column>
            </Container>
          )}
        />
      </CustomScrollView>
    </Scaffold>
  );
}
