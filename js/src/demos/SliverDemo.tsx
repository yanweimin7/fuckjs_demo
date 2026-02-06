import React from "react";
import {
  CustomScrollView,
  SliverAppBar,
  SliverList,
  SliverGrid,
  SliverToBoxAdapter,
  Container,
  Text,
  Scaffold,
  Center,
  Padding,
} from "fuickjs";

export default function SliverDemo() {
  return (
    <Scaffold>
      <CustomScrollView>
        <SliverAppBar
          pinned={true}
          expandedHeight={200}
          backgroundColor="#2196F3"
          title={<Text text="Sliver Demo" color="#ffffff" />}
        >
          <Container color="#1976D2" />
        </SliverAppBar>

        <SliverToBoxAdapter>
          <Padding padding={16}>
            <Text
              text="SliverToBoxAdapter: Section Title"
              fontSize={20}
              fontWeight="bold"
            />
          </Padding>
        </SliverToBoxAdapter>

        <SliverGrid
          gridDelegate={{
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 2.0,
          }}
          itemCount={4}
          itemBuilder={(index) => (
            <Container color="#E3F2FD" borderRadius={8}>
              <Center>
                <Text text={`Grid Item ${index}`} />
              </Center>
            </Container>
          )}
        />

        <SliverToBoxAdapter>
          <Padding padding={16}>
            <Text text="SliverList: Items" fontSize={20} fontWeight="bold" />
          </Padding>
        </SliverToBoxAdapter>

        <SliverList
          itemCount={10}
          itemBuilder={(index) => (
            <Container
              height={60}
              color={index % 2 === 0 ? "#f5f5f5" : "#ffffff"}
              padding={{ left: 16 }}
            >
              <Text text={`List Item ${index}`} />
            </Container>
          )}
        />
      </CustomScrollView>
    </Scaffold>
  );
}
