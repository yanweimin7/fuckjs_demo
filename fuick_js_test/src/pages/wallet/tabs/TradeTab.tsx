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
  Button,
  Divider,
  Stack,
} from 'fuick_js_framework';

const TradeInput = ({ label, balance, amount, symbol, icon, color }: any) => (
  <Container padding={{ all: 20 }} decoration={{ color: '#F8F9FB', borderRadius: 20 }}>
    <Row mainAxisAlignment="spaceBetween">
      <Text text={label} color="#6F767E" fontSize={14} fontWeight="bold" />
      <Text text={`Balance: ${balance}`} color="#9A9FA5" fontSize={12} />
    </Row>
    <Container height={16} />
    <Row mainAxisAlignment="spaceBetween">
      <Text text={amount} fontSize={28} fontWeight="bold" color="#1A1D1F" />
      <Container
        padding={{ horizontal: 12, vertical: 8 }}
        decoration={{ color: '#FFFFFF', borderRadius: 12 }}
      >
        <Row>
          <Container width={24} height={24} decoration={{ color: color, borderRadius: 12 }}>
            <Center><Icon name={icon} color="#FFFFFF" size={14} /></Center>
          </Container>
          <Container width={8} />
          <Text text={symbol} fontSize={16} fontWeight="bold" color="#1A1D1F" />
          <Icon name="expand_more" color="#1A1D1F" />
        </Row>
      </Container>
    </Row>
  </Container>
);

export const TradeTab = () => {
  return (
    <Padding padding={{ all: 20 }}>
      <Column crossAxisAlignment="stretch">
        <Row mainAxisAlignment="spaceBetween">
          <Text text="Swap Assets" fontSize={24} fontWeight="bold" color="#1A1D1F" />
          <Icon name="settings" color="#6F767E" />
        </Row>

        <Container height={24} />

        <Stack alignment="center">
          <Column>
            <TradeInput
              label="From"
              balance="1.25 ETH"
              amount="0.5"
              symbol="ETH"
              icon="currency_exchange"
              color="#627EEA"
            />

            <Container height={8} />

            <TradeInput
              label="To (Estimated)"
              balance="0 USDT"
              amount="1,138.25"
              symbol="USDT"
              icon="attach_money"
              color="#26A17B"
            />
          </Column>

          <Container
            width={44}
            height={44}
            decoration={{
              color: '#FFFFFF',
              borderRadius: 22,
            }}
          >
            <Center>
              <Icon name="swap_vert" color="#3D7EFF" size={24} />
            </Center>
          </Container>
        </Stack>

        <Container height={24} />

        {/* Trade Details */}
        <Container padding={{ all: 16 }} decoration={{ color: '#F0F3F650', borderRadius: 16 }}>
          <Column>
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Price Impact" color="#6F767E" fontSize={13} />
              <Text text="< 0.01%" color="#00C853" fontSize={13} fontWeight="bold" />
            </Row>
            <Container height={12} />
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Network Fee" color="#6F767E" fontSize={13} />
              <Row>
                <Icon name="local_gas_station" color="#6F767E" size={14} />
                <Container width={4} />
                <Text text="$2.45" color="#1A1D1F" fontSize={13} fontWeight="bold" />
              </Row>
            </Row>
            <Container height={12} />
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Minimum Received" color="#6F767E" fontSize={13} />
              <Text text="1,132.50 USDT" color="#1A1D1F" fontSize={13} fontWeight="bold" />
            </Row>
          </Column>
        </Container>

        <Container height={32} />

        <Container height={60}>
          <Button text="Confirm Swap" />
        </Container>

        <Container height={16} />
        <Center>
          <Row>
            <Icon name="info" color="#9A9FA5" size={14} />
            <Container width={6} />
            <Text text="Quotes update every 5s" color="#9A9FA5" fontSize={12} />
          </Row>
        </Center>
      </Column>
    </Padding>
  );
};
