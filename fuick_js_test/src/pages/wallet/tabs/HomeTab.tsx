import React from 'react';
import {
  Column,
  Row,
  Text,
  Container,
  Padding,
  Center,
  Icon,
  Expanded,
  ListView,
  Stack,
  Positioned,
  Divider,
} from 'fuick_js_framework';

const ASSETS = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: '1.25', value: '2,845.62', change: '+2.4%', icon: 'currency_exchange', color: '#627EEA' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', balance: '0.045', value: '1,920.15', change: '-1.2%', icon: 'currency_bitcoin', color: '#F7931A' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: '1,250.00', value: '1,250.00', change: '0.0%', icon: 'attach_money', color: '#26A17B' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: '25.4', value: '2,415.80', change: '+5.7%', icon: 'wb_sunny', color: '#14F195' },
];

const ActionButton = ({ icon, label, color = '#3D7EFF' }: any) => (
  <Column>
    <Container
      width={60}
      height={60}
      decoration={{
        color: `${color}15`, // 15% opacity
        borderRadius: 18,
      }}
    >
      <Center>
        <Icon name={icon} color={color} size={28} />
      </Center>
    </Container>
    <Container height={8} />
    <Text text={label} fontSize={13} color="#333333" fontWeight="w500" />
  </Column>
);

const AssetItem = ({ symbol, name, balance, value, change, icon, color }: any) => (
  <Container margin={{ bottom: 12 }} padding={{ all: 16 }} decoration={{ color: '#F8F9FB', borderRadius: 16 }}>
    <Row>
      <Container
        width={44}
        height={44}
        decoration={{ color: color, borderRadius: 22 }}
      >
        <Center>
          <Icon name={icon} color="#FFFFFF" size={24} />
        </Center>
      </Container>
      <Container width={12} />
      <Expanded>
        <Column crossAxisAlignment="start">
          <Text text={symbol} fontSize={17} fontWeight="bold" color="#1A1D1F" />
          <Text text={name} fontSize={13} color="#9A9FA5" />
        </Column>
      </Expanded>
      <Column crossAxisAlignment="end">
        <Text text={balance} fontSize={17} fontWeight="bold" color="#1A1D1F" />
        <Row>
          <Text text={`$${value}`} fontSize={13} color="#9A9FA5" />
          <Container width={4} />
          <Text
            text={change}
            fontSize={12}
            color={change.startsWith('+') ? '#00C853' : '#FF3D00'}
            fontWeight="bold"
          />
        </Row>
      </Column>
    </Row>
  </Container>
);

export const HomeTab = () => {
  return (
    <ListView>
      <Padding padding={{ left: 20, right: 20, top: 10, bottom: 20 }}>
        <Column crossAxisAlignment="stretch">
          {/* Enhanced Wallet Card */}
          <Stack>
            <Container
              height={200}
              decoration={{
                color: '#1A1D1F',
                borderRadius: 24,
              }}
            >
              <Padding padding={{ all: 24 }}>
                <Column crossAxisAlignment="start" mainAxisAlignment="spaceBetween">
                  <Row mainAxisAlignment="spaceBetween">
                    <Row>
                      <Container width={32} height={32} decoration={{ color: '#FFFFFF20', borderRadius: 16 }}>
                        <Center><Icon name="wallet" color="#FFFFFF" size={18} /></Center>
                      </Container>
                      <Container width={10} />
                      <Text text="Primary Wallet" color="#FFFFFF" fontSize={15} />
                      <Icon name="expand_more" color="#FFFFFF" size={16} />
                    </Row>
                    <Icon name="qr_code_scanner" color="#FFFFFF" size={24} />
                  </Row>

                  <Column crossAxisAlignment="start">
                    <Text text="Total Balance" color="#9A9FA5" fontSize={14} />
                    <Container height={8} />
                    <Row crossAxisAlignment="end">
                      <Text text="$" color="#FFFFFF" fontSize={20} fontWeight="bold" />
                      <Container width={4} />
                      <Text text="12,845.62" color="#FFFFFF" fontSize={36} fontWeight="bold" />
                    </Row>
                  </Column>

                  <Row mainAxisAlignment="spaceBetween">
                    <Container
                      padding={{ horizontal: 12, vertical: 6 }}
                      decoration={{ color: '#00C85320', borderRadius: 20 }}
                    >
                      <Row>
                        <Icon name="trending_up" color="#00C853" size={14} />
                        <Container width={4} />
                        <Text text="+2.45%" color="#00C853" fontSize={13} fontWeight="bold" />
                      </Row>
                    </Container>
                    <Text text="0x71C...3E21" color="#9A9FA5" fontSize={13} />
                  </Row>
                </Column>
              </Padding>
            </Container>
            {/* Abstract Decorative Elements */}
            <Positioned top={0} right={0}>
              <Container width={80} height={80} decoration={{ color: '#3D7EFF20', borderRadius: 40 }} />
            </Positioned>
          </Stack>

          <Container height={28} />

          {/* Quick Actions */}
          <Row mainAxisAlignment="spaceAround">
            <ActionButton icon="send" label="Send" color="#3D7EFF" />
            <ActionButton icon="call_received" label="Receive" color="#00C853" />
            <ActionButton icon="add_shopping_cart" label="Buy" color="#FFB016" />
            <ActionButton icon="multiple_stop" label="Swap" color="#9159FF" />
          </Row>

          <Container height={36} />

          {/* Asset Section Header */}
          <Row mainAxisAlignment="spaceBetween">
            <Row>
              <Text text="Assets" fontSize={20} fontWeight="bold" color="#1A1D1F" />
              <Container width={8} />
              <Container padding={{ horizontal: 8, vertical: 2 }} decoration={{ color: '#F0F3F6', borderRadius: 6 }}>
                <Text text="4" fontSize={12} fontWeight="bold" color="#6F767E" />
              </Container>
            </Row>
            <Text text="Edit" color="#3D7EFF" fontSize={15} fontWeight="bold" />
          </Row>

          <Container height={16} />

          {/* Asset List */}
          {ASSETS.map(asset => (
            <AssetItem key={asset.id} {...asset} />
          ))}

          <Container height={20} />

          {/* Activity Preview Card */}
          <Container padding={{ all: 20 }} decoration={{ color: '#F0F3F6', borderRadius: 20 }}>
            <Row mainAxisAlignment="spaceBetween">
              <Column crossAxisAlignment="start">
                <Text text="Recent Activity" fontSize={16} fontWeight="bold" color="#1A1D1F" />
                <Container height={4} />
                <Text text="You received 0.5 ETH from 0x..." fontSize={13} color="#6F767E" />
              </Column>
              <Icon name="chevron_right" color="#6F767E" />
            </Row>
          </Container>
        </Column>
      </Padding>
    </ListView>
  );
};
