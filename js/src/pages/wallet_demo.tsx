import React from 'react';
import {
    Column,
    Container,
    Text,
    Row,
    Icon,
    Padding,
    SizedBox,
    Image,
    Expanded,
    Scaffold,
    AppBar,
    BatchedListView,
} from 'fuick_js_framework';

const AssetListItem = React.memo(({ item }: { item: any }) => {
    return (
        <Padding padding={{ bottom: 16 }}>
            <Container
                padding={16}
                decoration={{
                    color: '#FFFFFF',
                    borderRadius: 24,
                    boxShadow: { color: 'rgba(0,0,0,0.04)', blurRadius: 20, offset: { dx: 0, dy: 8 } }
                }}
            >
                <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Row crossAxisAlignment="center">
                        <Container width={56} height={56} decoration={{ color: '#F8FAFC', borderRadius: 28 }} alignment="center">
                            <Image
                                url={`https://i.pravatar.cc/150?u=${item.id}`}
                                width={40}
                                height={40}
                                borderRadius={20}
                            />
                        </Container>
                        <SizedBox width={16} />
                        <Column crossAxisAlignment="start">
                            <Text text={item.title} fontSize={18} fontWeight="bold" color="#1E293B" />
                            <SizedBox height={4} />
                            <Row crossAxisAlignment="center">
                                <Container
                                    padding={{ left: 6, right: 6, top: 2, bottom: 2 }}
                                    decoration={{ color: `${item.color}20`, borderRadius: 4 }}
                                >
                                    <Text text={item.category} fontSize={10} color={item.color} fontWeight="bold" />
                                </Container>
                                <SizedBox width={8} />
                                <Text text={`Vol: ${item.volume}`} fontSize={12} color="#64748B" />
                            </Row>
                        </Column>
                    </Row>
                    <Column crossAxisAlignment="end">
                        <Text text={`$${item.price}`} fontSize={18} fontWeight="bold" color="#1E293B" />
                        <SizedBox height={6} />
                        <Row crossAxisAlignment="center">
                            <Icon
                                name={Number(item.change) >= 0 ? 'trending_up' : 'trending_down'}
                                size={14}
                                color={Number(item.change) >= 0 ? '#10B981' : '#EF4444'}
                            />
                            <SizedBox width={4} />
                            <Text
                                text={`${Math.abs(Number(item.change))}%`}
                                fontSize={13}
                                fontWeight="bold"
                                color={Number(item.change) >= 0 ? '#10B981' : '#EF4444'}
                            />
                        </Row>
                    </Column>
                </Row>
            </Container>
        </Padding>
    );
});

const WalletDemoPage = () => {
    // 生成模拟数据
    const listData = React.useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            title: `Asset ${i}`,
            category: i % 3 === 0 ? 'DeFi' : i % 3 === 1 ? 'NFT' : 'L1',
            price: (Math.random() * 50000 + 100).toFixed(2),
            change: (Math.random() * 20 - 10).toFixed(2),
            volume: (Math.random() * 5000).toFixed(1) + 'M',
            color: ['#2196F3', '#9C27B0', '#FF9800', '#E91E63'][i % 4],
        }));
    }, []);

    return (
        <Scaffold
            appBar={<AppBar title="Wallet Demo (Batched)" backgroundColor="#FFFFFF" foregroundColor="#1E293B" elevation={0} />}
            backgroundColor="#F8FAFC"
        >
            <Column crossAxisAlignment="stretch">
                <Padding padding={16}>
                    <Container
                        padding={24}
                        decoration={{
                            color: '#6366F1',
                            borderRadius: 24,
                        }}
                    >
                        <Column crossAxisAlignment="start">
                            <Text text="Total Balance" color="rgba(255,255,255,0.7)" fontSize={14} />
                            <SizedBox height={8} />
                            <Text text="$45,231.89" color="#FFFFFF" fontSize={32} fontWeight="bold" />
                            <SizedBox height={24} />
                            <Row mainAxisAlignment="spaceBetween">
                                <Row>
                                    <Icon name="arrow_upward" color="#FFFFFF" size={16} />
                                    <SizedBox width={4} />
                                    <Text text="+12.5%" color="#FFFFFF" fontSize={14} fontWeight="bold" />
                                </Row>
                                <Container padding={{ left: 12, right: 12, top: 6, bottom: 6 }} decoration={{ color: 'rgba(255,255,255,0.2)', borderRadius: 12 }}>
                                    <Text text="Details" color="#FFFFFF" fontSize={12} />
                                </Container>
                            </Row>
                        </Column>
                    </Container>
                </Padding>

                <Padding padding={{ left: 16, right: 16, bottom: 8 }}>
                    <Text text="Quick Actions" fontSize={18} fontWeight="bold" color="#1E293B" />
                </Padding>

                <Container height={100}>
                    <BatchedListView
                        orientation="horizontal"
                        shrinkWrap={false}
                        padding={{ left: 16, right: 16 }}
                        itemCount={5}
                        itemBuilder={(index: number) => (
                            <Padding key={index} padding={{ right: 16 }}>
                                <Column crossAxisAlignment="center">
                                    <Container
                                        width={56}
                                        height={56}
                                        decoration={{ color: '#6366F115', borderRadius: 16 }}
                                        alignment="center"
                                    >
                                        <Icon name={['send', 'payments', 'qr_code_scanner', 'account_balance_wallet', 'history'][index]} size={24} color="#6366F1" />
                                    </Container>
                                    <SizedBox height={8} />
                                    <Text text={['Send', 'Receive', 'Scan', 'Buy', 'History'][index]} fontSize={12} color="#64748B" fontWeight="bold" />
                                </Column>
                            </Padding>
                        )}
                    />
                </Container>

                <Padding padding={{ left: 16, right: 16, top: 16, bottom: 8 }}>
                    <Text text="Your Assets" fontSize={18} fontWeight="bold" color="#1E293B" />
                </Padding>

                <Expanded>
                    <BatchedListView
                        orientation="vertical"
                        padding={{ left: 16, right: 16, top: 8, bottom: 16 }}
                        itemCount={listData.length}
                        itemBuilder={(index: number) => (
                            <AssetListItem key={index} item={listData[index]} />
                        )}
                    />
                </Expanded>
            </Column>
        </Scaffold>
    );
};

export default WalletDemoPage;
