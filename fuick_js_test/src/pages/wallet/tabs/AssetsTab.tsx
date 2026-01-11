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

const ChainBalanceItem = ({ name, value, percentage, icon, color }: any) => (
  <Container margin={{ bottom: 12 }} padding={{ all: 16 }} decoration={{ color: '#F8F9FB', borderRadius: 16 }}>
    <Row mainAxisAlignment="spaceBetween">
      <Row>
        <Container width={36} height={36} decoration={{ color: `${color}15`, borderRadius: 10 }}>
          <Center><Icon name={icon} color={color} size={20} /></Center>
        </Container>
        <Container width={12} />
        <Column crossAxisAlignment="start">
          <Text text={name} fontSize={16} fontWeight="bold" color="#1A1D1F" />
          <Text text={`${percentage} of total`} fontSize={12} color="#9A9FA5" />
        </Column>
      </Row>
      <Column crossAxisAlignment="end">
        <Text text={value} fontSize={16} fontWeight="bold" color="#1A1D1F" />
        <Icon name="chevron_right" color="#9A9FA5" size={18} />
      </Column>
    </Row>
  </Container>
);

export const AssetsTab = () => {
  return (
    <ListView>
      <Padding padding={{ all: 20 }}>
        <Column crossAxisAlignment="stretch">
          <Text text="Portfolio" fontSize={24} fontWeight="bold" color="#1A1D1F" />
          <Container height={20} />

          {/* Portfolio Breakdown Card */}
          <Container
            padding={{ all: 24 }}
            decoration={{
              color: '#3D7EFF',
              borderRadius: 24,
            }}
          >
            <Column crossAxisAlignment="start">
              <Row mainAxisAlignment="spaceBetween">
                <Text text="Net Worth" color="#FFFFFFBF" fontSize={15} />
                <Container padding={{ horizontal: 8, vertical: 4 }} decoration={{ color: '#FFFFFF20', borderRadius: 8 }}>
                  <Text text="All Chains" color="#FFFFFF" fontSize={11} fontWeight="bold" />
                </Container>
              </Row>
              <Container height={12} />
              <Text text="$12,845.62" color="#FFFFFF" fontSize={32} fontWeight="bold" />
              <Container height={24} />

              {/* Progress Bar Mock */}
              <Row>
                <Expanded flex={6}>
                  <Container height={6} decoration={{ color: '#627EEA', borderRadius: 3 }} />
                </Expanded>
                <Container width={4} />
                <Expanded flex={3}>
                  <Container height={6} decoration={{ color: '#F7931A', borderRadius: 3 }} />
                </Expanded>
                <Container width={4} />
                <Expanded flex={1}>
                  <Container height={6} decoration={{ color: '#14F195', borderRadius: 3 }} />
                </Expanded>
              </Row>
            </Column>
          </Container>

          <Container height={32} />

          <Row mainAxisAlignment="spaceBetween">
            <Text text="Distribution by Chain" fontSize={18} fontWeight="bold" color="#1A1D1F" />
            <Icon name="pie_chart" color="#3D7EFF" size={20} />
          </Row>

          <Container height={16} />

          <ChainBalanceItem
            name="Ethereum"
            value="$8,240.15"
            percentage="64%"
            icon="link"
            color="#627EEA"
          />
          <ChainBalanceItem
            name="Bitcoin"
            value="$1,920.15"
            percentage="15%"
            icon="currency_bitcoin"
            color="#F7931A"
          />
          <ChainBalanceItem
            name="Solana"
            value="$2,415.80"
            percentage="19%"
            icon="wb_sunny"
            color="#14F195"
          />
          <ChainBalanceItem
            name="Polygon"
            value="$269.52"
            percentage="2%"
            icon="layers"
            color="#8247E5"
          />

          <Container height={24} />

          <Text text="Security Status" fontSize={18} fontWeight="bold" color="#1A1D1F" />
          <Container height={12} />
          <Container padding={{ all: 16 }} decoration={{ color: '#00C85310', borderRadius: 16 }}>
            <Row>
              <Icon name="verified_user" color="#00C853" size={24} />
              <Container width={12} />
              <Expanded>
                <Column crossAxisAlignment="start">
                  <Text text="Wallet Protected" fontSize={15} fontWeight="bold" color="#1A1D1F" />
                  <Text text="Your seed phrase is backed up" fontSize={13} color="#6F767E" />
                </Column>
              </Expanded>
            </Row>
          </Container>
        </Column>
      </Padding>
    </ListView>
  );
};
