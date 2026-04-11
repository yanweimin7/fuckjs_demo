import React from "react";
import {
  Scaffold,
  Text,
  Container,
  NestedScrollView,
  FlutterProps,
  SliverAppBar,
  ListView,
  Padding,
  Column,
  SizedBox,
  Row,
  Icon,
} from "fuickjs";

const categories = [
  { icon: "home", label: "Home", color: "#2196F3" },
  { icon: "star", label: "Favorites", color: "#FF9800" },
  { icon: "person", label: "Profile", color: "#4CAF50" },
  { icon: "settings", label: "Settings", color: "#9C27B0" },
];

export default function NestedScrollViewDemo() {
  return (
    <Scaffold>
      <NestedScrollView>
        {/* headerSliverBuilder 必须是 Sliver 系列组件 */}
        <FlutterProps propsKey="headerSliverBuilder">
          <SliverAppBar
            pinned={true}
            expandedHeight={180}
            backgroundColor="#673AB7"
            title={<Text text="NestedScrollView" color="white" />}
          >
            <Container
              color="#512DA8"
              alignment="center"
              padding={{ bottom: 60, left: 16, right: 16 }}
            >
              <Text
                text="向上滑动，AppBar 会折叠并固定"
                color="white"
                fontSize={16}
              />
            </Container>
          </SliverAppBar>
        </FlutterProps>

        {/* body 必须是普通可滚动 Widget（如 ListView），不能是 Sliver */}
        <FlutterProps propsKey="body">
          <ListView shrinkWrap={false} physics="never">
            <Padding padding={16}>
              <Column crossAxisAlignment="start">
                <Text text="Quick Actions" fontSize={18} fontWeight="bold" />
                <SizedBox height={12} />
                <Row mainAxisAlignment="spaceAround">
                  {categories.map((cat) => (
                    <Column key={cat.label} crossAxisAlignment="center">
                      <Container
                        width={50}
                        height={50}
                        decoration={{ color: cat.color, borderRadius: 25 }}
                        alignment="center"
                      >
                        <Icon data={cat.icon} color="white" size={24} />
                      </Container>
                      <SizedBox height={4} />
                      <Text text={cat.label} fontSize={12} color="#666" />
                    </Column>
                  ))}
                </Row>
                <SizedBox height={16} />
                <Text text="All Items" fontSize={18} fontWeight="bold" />
              </Column>
            </Padding>
            {Array.from({ length: 29 }, (_, i) => (
              <Container
                key={`item-${i}`}
                height={60}
                color={i % 2 === 0 ? "#FAFAFA" : "#FFFFFF"}
                padding={{ left: 16, right: 16 }}
                alignment="centerLeft"
              >
                <Row>
                  <Container
                    width={36}
                    height={36}
                    decoration={{
                      color: categories[i % categories.length].color,
                      borderRadius: 18,
                    }}
                    alignment="center"
                  >
                    <Text text={`${i}`} color="white" fontSize={14} fontWeight="bold" />
                  </Container>
                  <SizedBox width={12} />
                  <Text text={`List Item ${i}`} fontSize={16} />
                </Row>
              </Container>
            ))}
          </ListView>
        </FlutterProps>
      </NestedScrollView>
    </Scaffold>
  );
}
