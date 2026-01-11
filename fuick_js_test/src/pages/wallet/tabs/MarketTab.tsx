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
  Divider,
} from 'fuick_js_framework';

const MARKET_DATA = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: '$42,568.20', change: '-1.25%', trend: 'down', volume: '24.5B' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: '$2,276.50', change: '+2.40%', trend: 'up', volume: '12.1B' },
  { id: '3', symbol: 'BNB', name: 'Binance', price: '$312.45', change: '+0.85%', trend: 'up', volume: '1.2B' },
  { id: '4', symbol: 'SOL', name: 'Solana', price: '$95.20', change: '+5.72%', trend: 'up', volume: '3.4B' },
  { id: '5', symbol: 'XRP', name: 'Ripple', price: '$0.52', change: '-0.45%', trend: 'down', volume: '800M' },
  { id: '6', symbol: 'ADA', name: 'Cardano', price: '$0.48', change: '+1.12%', trend: 'up', volume: '400M' },
  { id: '7', symbol: 'DOT', name: 'Polkadot', price: '$6.85', change: '-2.34%', trend: 'down', volume: '200M' },
  { id: '8', symbol: 'AVAX', name: 'Avalanche', price: '$32.15', change: '+4.21%', trend: 'up', volume: '600M' },
];

const MarketItem = ({ symbol, name, price, change, trend, volume }: any) => (
  <Container padding={{ vertical: 16 }}>
    <Row mainAxisAlignment="spaceBetween">
      <Row>
        <Container width={40} height={40} decoration={{ color: '#F0F3F6', borderRadius: 12 }}>
          <Center>
            <Text text={symbol[0]} fontSize={16} fontWeight="bold" color="#1A1D1F" />
          </Center>
        </Container>
        <Container width={12} />
        <Column crossAxisAlignment="start">
          <Text text={symbol} fontSize={16} fontWeight="bold" color="#1A1D1F" />
          <Text text={name} fontSize={12} color="#9A9FA5" />
        </Column>
      </Row>

      {/* Mini Chart Mock */}
      <Container width={60} height={30}>
        <Center>
          <Icon name="show_chart" color={trend === 'up' ? '#00C85330' : '#FF3D0030'} size={32} />
        </Center>
      </Container>

      <Column crossAxisAlignment="end">
        <Text text={price} fontSize={16} fontWeight="bold" color="#1A1D1F" />
        <Row>
          <Text text={`Vol ${volume}`} fontSize={11} color="#9A9FA5" />
          <Container width={8} />
          <Container
            padding={{ horizontal: 6, vertical: 2 }}
            decoration={{ color: trend === 'up' ? '#00C85315' : '#FF3D0015', borderRadius: 4 }}
          >
            <Text
              text={change}
              fontSize={12}
              fontWeight="bold"
              color={trend === 'up' ? '#00C853' : '#FF3D00'}
            />
          </Container>
        </Row>
      </Column>
    </Row>
    <Container height={16} />
    <Divider />
  </Container>
);

const CategoryPill = ({ label, active }: any) => (
  <Container
    padding={{ horizontal: 16, vertical: 8 }}
    margin={{ right: 8 }}
    decoration={{
      color: active ? '#1A1D1F' : '#F0F3F6',
      borderRadius: 12
    }}
  >
    <Text
      text={label}
      fontSize={14}
      fontWeight={active ? 'bold' : 'normal'}
      color={active ? '#FFFFFF' : '#6F767E'}
    />
  </Container>
);

export const MarketTab = () => {
  return (
    <ListView>
      <Padding padding={{ all: 20 }}>
        <Column crossAxisAlignment="stretch">
          <Text text="Market Insights" fontSize={24} fontWeight="bold" color="#1A1D1F" />
          <Container height={20} />

          {/* Search Bar Mock */}
          <Container
            padding={{ horizontal: 16, vertical: 12 }}
            decoration={{ color: '#F0F3F6', borderRadius: 16 }}
          >
            <Row>
              <Icon name="search" color="#9A9FA5" size={20} />
              <Container width={10} />
              <Text text="Search crypto assets..." color="#9A9FA5" fontSize={15} />
            </Row>
          </Container>

          <Container height={24} />

          {/* Categories */}
          <Container height={40}>
            <ListView scrollDirection="horizontal">
              <Row>
                <CategoryPill label="All" active={true} />
                <CategoryPill label="Layer 1" active={false} />
                <CategoryPill label="DeFi" active={false} />
                <CategoryPill label="Gaming" active={false} />
                <CategoryPill label="NFTs" active={false} />
              </Row>
            </ListView>
          </Container>

          <Container height={24} />

          <Row mainAxisAlignment="spaceBetween">
            <Text text="Asset / 24h Volume" fontSize={13} color="#9A9FA5" fontWeight="bold" />
            <Text text="Price / Change" fontSize={13} color="#9A9FA5" fontWeight="bold" />
          </Row>

          <Container height={8} />
          <Divider />

          {MARKET_DATA.map(item => (
            <MarketItem key={item.id} {...item} />
          ))}
        </Column>
      </Padding>
    </ListView>
  );
};
