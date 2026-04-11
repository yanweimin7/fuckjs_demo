import React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  SizedBox,
  Padding,
  Drawer,
  Divider,
  Icon,
  InkWell,
  Row,
} from "fuickjs";

function DrawerContent() {
  return (
    <Column crossAxisAlignment="start">
      <Container height={120} color="#2196F3" alignment="bottomLeft" padding={16}>
        <Text text="FuickJS Menu" fontSize={22} color="white" fontWeight="bold" />
      </Container>
      <InkWell onTap={() => console.log("Home tapped")}>
        <Padding padding={16}>
          <Row>
            <Icon data="home" size={24} color="#333" />
            <SizedBox width={16} />
            <Text text="Home" fontSize={16} />
          </Row>
        </Padding>
      </InkWell>
      <Divider />
      <InkWell onTap={() => console.log("Settings tapped")}>
        <Padding padding={16}>
          <Row>
            <Icon data="settings" size={24} color="#333" />
            <SizedBox width={16} />
            <Text text="Settings" fontSize={16} />
          </Row>
        </Padding>
      </InkWell>
      <Divider />
      <InkWell onTap={() => console.log("Info tapped")}>
        <Padding padding={16}>
          <Row>
            <Icon data="info" size={24} color="#333" />
            <SizedBox width={16} />
            <Text text="About" fontSize={16} />
          </Row>
        </Padding>
      </InkWell>
    </Column>
  );
}

export default function DrawerDemo() {
  return (
    <Scaffold
      appBar={<AppBar title={<Text text="Drawer Demo" />} />}
      drawer={
        <Drawer backgroundColor="#FFFFFF" elevation={8} width={280}>
          <DrawerContent />
        </Drawer>
      }
    >
      <Padding padding={24}>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Icon data="swap_horiz" size={64} color="#2196F3" />
          <SizedBox height={16} />
          <Text text="从左侧边缘向右滑动" fontSize={18} fontWeight="bold" />
          <SizedBox height={8} />
          <Text text="或点击左上角菜单按钮打开 Drawer" fontSize={14} color="#666" />
        </Column>
      </Padding>
    </Scaffold>
  );
}
