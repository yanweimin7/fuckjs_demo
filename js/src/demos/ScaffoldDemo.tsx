import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Center,
  Icon,
  Container,
  Column,
  Padding,
  SizedBox,
  BottomNavigationBar,
  BottomNavigationBarItem,
  InkWell,
  SafeArea,
  ListTile,
} from "fuickjs";

const ScaffoldDemo: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  const pages = [
    <Center key="home">
      <Column mainAxisAlignment="center">
        <Icon name="home" size={100} color="#2196F3" />
        <SizedBox height={20} />
        <Text text="这是首页内容" fontSize={24} fontWeight="bold" />
        <SizedBox height={10} />
        <Text
          text={`FAB 点击次数: ${clickCount}`}
          fontSize={18}
          color="#666666"
        />
      </Column>
    </Center>,
    <Center key="search">
      <Column mainAxisAlignment="center">
        <Icon name="search" size={100} color="#4CAF50" />
        <SizedBox height={20} />
        <Text text="这是搜索页面" fontSize={24} fontWeight="bold" />
      </Column>
    </Center>,
    <Center key="profile">
      <Column mainAxisAlignment="center">
        <Icon name="person" size={100} color="#FF9800" />
        <SizedBox height={20} />
        <Text text="这是个人中心" fontSize={24} fontWeight="bold" />
      </Column>
    </Center>,
  ];

  return (
    <Scaffold
      backgroundColor="#F5F5F5"
      appBar={
        <AppBar
          title={<Text text="Scaffold 功能演示" color="white" />}
          backgroundColor="#2196F3"
          centerTitle={true}
          leading={
            <InkWell onTap={() => console.log("Menu tapped")}>
              <Padding padding={{ left: 16 }}>
                <Icon name="menu" color="white" />
              </Padding>
            </InkWell>
          }
          actions={[
            <InkWell key="search" onTap={() => console.log("Search tapped")}>
              <Padding padding={{ right: 16 }}>
                <Icon name="search" color="white" />
              </Padding>
            </InkWell>,
          ]}
        />
      }
      drawer={
        <Container width={280} color="white">
          <SafeArea>
            <Padding padding={{ all: 16 }}>
              <Column crossAxisAlignment="start">
                <Container
                  width={60}
                  height={60}
                  borderRadius={30}
                  color="#2196F3"
                >
                  <Center>
                    <Icon name="person" color="white" size={30} />
                  </Center>
                </Container>
                <SizedBox height={16} />
                <Text text="FuickJS 用户" fontSize={20} fontWeight="bold" />
                <Text
                  text="fuickjs@example.com"
                  fontSize={14}
                  color="#666666"
                />
                <SizedBox height={32} />
                <ListTile
                  leading={<Icon name="settings" />}
                  title={<Text text="设置" />}
                  onTap={() => console.log("Settings tapped")}
                />
                <ListTile
                  leading={<Icon name="info" />}
                  title={<Text text="关于" />}
                  onTap={() => console.log("About tapped")}
                />
              </Column>
            </Padding>
          </SafeArea>
        </Container>
      }
      floatingActionButton={
        <InkWell onTap={() => setClickCount((c) => c + 1)}>
          <Container width={56} height={56} borderRadius={28} color="#2196F3">
            <Center>
              <Icon name="add" color="white" size={28} />
            </Center>
          </Container>
        </InkWell>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          currentIndex={currentIndex}
          onTap={(index) => setCurrentIndex(index)}
          selectedItemColor="#2196F3"
          unselectedItemColor="#999999"
          items={[
            <BottomNavigationBarItem
              key="home"
              icon={<Icon name="home" />}
              label="首页"
            />,
            <BottomNavigationBarItem
              key="search"
              icon={<Icon name="search" />}
              label="搜索"
            />,
            <BottomNavigationBarItem
              key="profile"
              icon={<Icon name="person" />}
              label="我的"
            />,
          ]}
        />
      }
    >
      {pages[currentIndex]}
    </Scaffold>
  );
};

export default ScaffoldDemo;
