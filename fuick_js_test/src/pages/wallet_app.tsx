import React, { useState } from 'react';
import {
  Scaffold,
  AppBar,
  Text,
  Container,
  Icon,
  Expanded,
  GestureDetector,
  SafeArea,
  Stack,
  Positioned,
  Row,
  Padding,
  Column,
} from 'fuick_js_framework';

import { HomeTab } from './wallet/tabs/HomeTab';
import { MarketTab } from './wallet/tabs/MarketTab';
import { TradeTab } from './wallet/tabs/TradeTab';
import { AssetsTab } from './wallet/tabs/AssetsTab';

// --- Sub-components ---

const TabItem = ({ title, icon, active, onTap }: any) => (
  <Expanded>
    <GestureDetector onTap={onTap}>
      <Container padding={{ top: 8, bottom: 8 }}>
        <Column mainAxisAlignment="center">
          <Icon name={icon} color={active ? '#3D7EFF' : '#9BA3AF'} size={24} />
          <Container height={4} />
          <Text
            text={title}
            fontSize={12}
            color={active ? '#3D7EFF' : '#9BA3AF'}
            fontWeight={active ? 'bold' : 'normal'}
          />
        </Column>
      </Container>
    </GestureDetector>
  </Expanded>
);

// --- Main Page ---

export const WalletAppPage = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderBody = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'market': return <MarketTab />;
      case 'trade': return <TradeTab />;
      case 'assets': return <AssetsTab />;
      default: return <HomeTab />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'Fuick Wallet';
      case 'market': return 'Markets';
      case 'trade': return 'Swap';
      case 'assets': return 'Portfolio';
      default: return 'Wallet';
    }
  };

  return (
    <Scaffold
      backgroundColor="#FFFFFF"
      appBar={
        <AppBar
          title={<Text text={getTitle()} fontSize={18} fontWeight="bold" color="#1A1D1F" />}
          backgroundColor="#FFFFFF"
          actions={[
            <Padding padding={{ right: 16 }}>
              <Icon name="notifications_none" color="#1A1D1F" size={24} />
            </Padding>
          ]}
        />
      }
      body={
        <Stack>
          <Positioned top={0} left={0} right={0} bottom={80}>
            {renderBody()}
          </Positioned>

          {/* Enhanced Bottom Navigation Bar */}
          <Positioned bottom={0} left={0} right={0} height={80}>
            <Container
              decoration={{
                color: '#FFFFFF',
              }}
            >
              <Column>
                <Container height={1} decoration={{ color: '#F0F3F6' }} />
                <SafeArea>
                  <Row mainAxisAlignment="spaceAround">
                    <TabItem
                      title="首页"
                      icon="account_balance_wallet"
                      active={activeTab === 'home'}
                      onTap={() => setActiveTab('home')}
                    />
                    <TabItem
                      title="行情"
                      icon="trending_up"
                      active={activeTab === 'market'}
                      onTap={() => setActiveTab('market')}
                    />
                    <TabItem
                      title="交易"
                      icon="swap_horizontal_circle"
                      active={activeTab === 'trade'}
                      onTap={() => setActiveTab('trade')}
                    />
                    <TabItem
                      title="资产"
                      icon="pie_chart"
                      active={activeTab === 'assets'}
                      onTap={() => setActiveTab('assets')}
                    />
                  </Row>
                </SafeArea>
              </Column>
            </Container>
          </Positioned>
        </Stack>
      }
    />
  );
};
