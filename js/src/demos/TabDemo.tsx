import React, { useState } from "react";
import {
  DefaultTabController,
  TabBar,
  Tab,
  TabBarView,
  Scaffold,
  AppBar,
  Container,
  Center,
  Text,
  Column,
  Padding,
} from "fuickjs";

export default function TabDemo() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Tab 1", "Tab 2", "Tab 3"];

  return (
    <DefaultTabController length={tabs.length}>
      <Scaffold
        appBar={
          <AppBar
            title="Tab Demo"
            bottom={
              <TabBar
                tabs={tabs.map((t) => (
                  <Tab key={t} text={t} />
                ))}
                onTap={(index) => setActiveTab(index)}
                indicatorColor="white"
                labelColor="white"
                unselectedLabelColor="rgba(255,255,255,0.7)"
              />
            }
          />
        }
      >
        <TabBarView>
          <Container color="#F5F5F5">
            <Center>
              <Column mainAxisAlignment="center">
                <Text text="This is Tab 1 Content" fontSize={20} />
                <Padding padding={10}>
                  <Text
                    text={`Active Index from state: ${activeTab}`}
                    color="#666666"
                  />
                </Padding>
              </Column>
            </Center>
          </Container>

          <Container color="#E8F5E9">
            <Center>
              <Text
                text="This is Tab 2 Content"
                fontSize={20}
                color="#2E7D32"
              />
            </Center>
          </Container>

          <Container color="#FFF3E0">
            <Center>
              <Text
                text="This is Tab 3 Content"
                fontSize={20}
                color="#EF6C00"
              />
            </Center>
          </Container>
        </TabBarView>
      </Scaffold>
    </DefaultTabController>
  );
}
