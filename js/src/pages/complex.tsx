import React from 'react';
import {
    Column,
    Container,
    Text,
    Row,
    Button,
    Icon,
    Stack,
    Positioned,
    Padding,
    SizedBox,
    Divider,
    SingleChildScrollView,
    Image,
    GestureDetector,
    Expanded,
    Center,
    PageView,
    GridView,
    Scaffold,
    AppBar,
    ListView,
} from 'fuick_js_framework';

const BannerItem = ({ color, title, subtitle }: { color: string, title: string, subtitle: string }) => (
    <Container color={color} padding={24} borderRadius={16}>
        <Column crossAxisAlignment="start" mainAxisAlignment="center">
            <Text text={title} color="#FFFFFF" fontSize={24} fontWeight="bold" />
            <SizedBox height={8} />
            <Text text={subtitle} color="#FFFFFF" fontSize={14} />
            <SizedBox height={20} />
            <Container padding={{ left: 16, right: 16, top: 8, bottom: 8 }} decoration={{ color: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
                <Text text="Learn More" color="#FFFFFF" fontSize={12} />
            </Container>
        </Column>
    </Container>
);

const AssetListItem = ({ item }: { item: any }) => {
    return (
        <Container>
            <Padding padding={{ bottom: 16 }}>
                <Container
                    padding={16}
                    decoration={{
                        color: '#FFFFFF',
                        borderRadius: 24,
                        boxShadow: { color: 'rgba(0,0,0,0.04)', blurRadius: 20, offset: { dx: 0, dy: 8 } }
                    }}
                >
                    <Column crossAxisAlignment="stretch">
                        <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                            <Row crossAxisAlignment="center">
                                <Stack>
                                    <Container width={56} height={56} decoration={{ color: '#F8FAFC', borderRadius: 28 }} alignment="center">
                                        <Image
                                            url={`https://api.dicebear.com/7.x/identicon/svg?seed=${item.title}`}
                                            width={40}
                                            height={40}
                                            borderRadius={20}
                                        />
                                    </Container>
                                    <Positioned bottom={2} right={2}>
                                        <Container width={18} height={18} decoration={{ color: '#10B981', borderRadius: 9, border: { color: '#FFFFFF', width: 2 } }} />
                                    </Positioned>
                                </Stack>
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

                        <SizedBox height={16} />
                        <Divider color="#F1F5F9" />
                        <SizedBox height={16} />

                        <Row mainAxisAlignment="spaceBetween">
                            <Row>
                                <Container width={32} height={32} decoration={{ color: '#F1F5F9', borderRadius: 8 }} alignment="center">
                                    <Icon name="bar_chart" size={16} color="#64748B" />
                                </Container>
                                <SizedBox width={12} />
                                <Column crossAxisAlignment="start">
                                    <Text text="Market Cap" fontSize={10} color="#94A3B8" />
                                    <Text text={`$${(Math.random() * 100).toFixed(1)}B`} fontSize={12} fontWeight="bold" color="#475569" />
                                </Column>
                            </Row>
                            <Row>
                                <Container width={32} height={32} decoration={{ color: '#F1F5F9', borderRadius: 8 }} alignment="center">
                                    <Icon name="history" size={16} color="#64748B" />
                                </Container>
                                <SizedBox width={12} />
                                <Column crossAxisAlignment="start">
                                    <Text text="All Time High" fontSize={10} color="#94A3B8" />
                                    <Text text={`$${(Number(item.price) * 1.2).toFixed(2)}`} fontSize={12} fontWeight="bold" color="#475569" />
                                </Column>
                            </Row>
                            <Container padding={8} decoration={{ color: '#6366F1', borderRadius: 12 }}>
                                <Icon name="add" size={16} color="#FFFFFF" />
                            </Container>
                        </Row>
                    </Column>
                </Container>
            </Padding>
        </Container>
    );
};

const ComplexPage = () => {
    const [count, setCount] = React.useState(0);
    const [currentBanner, setCurrentBanner] = React.useState(0);
    const pageViewRef = React.useRef<PageView>(null);

    // 自动刷新测试
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCount(c => c + 1);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    // Banner 自动轮播逻辑
    React.useEffect(() => {
        const timer = setInterval(() => {
            const nextBanner = (currentBanner + 1) % 3;
            if (pageViewRef.current) {
                pageViewRef.current?.animateToPage(nextBanner);
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [currentBanner]);

    // 生成更大量、更多样化的模拟数据 - 使用 useMemo 避免重复生成
    const listData = React.useMemo(() => {
        const data = Array.from({ length: 10000 }, (_, i) => ({
            id: i, 
            title: `Token ${i + count}`,
            category: i % 3 === 0 ? 'DeFi' : i % 3 === 1 ? 'NFT' : 'L1',
            price: (Math.random() * 50000 + 100).toFixed(2),
            change: (Math.random() * 20 - 10).toFixed(2),
            volume: (Math.random() * 5000).toFixed(1) + 'M',
            color: ['#2196F3', '#9C27B0', '#FF9800', '#E91E63'][i % 4],
            marketCap: (Math.random() * 100).toFixed(1),
        }));
        return data;
    }, [count]);

    // 预定义各部分组件以提高性能
    const headerSection = React.useMemo(() => (
        <Padding padding={20}>
            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                <Column crossAxisAlignment="start">
                    <Text text="Good Morning," fontSize={14} color="#64748B" />
                    <Text text="Fuick Developer" fontSize={20} fontWeight="bold" color="#1E293B" />
                </Column>
                <Container width={40} height={40} decoration={{ color: '#E2E8F0', borderRadius: 20 }} alignment="center">
                    <Icon name="notifications" size={20} color="#64748B" />
                </Container>
            </Row>
        </Padding>
    ), []);

    const bannerSection = React.useMemo(() => (
        <Padding padding={16}>
            <Container height={180}>
                <PageView
                    ref={pageViewRef}
                    initialPage={0}
                    onPageChanged={(index: number) => setCurrentBanner(index)}
                    refId="complex_page_view"
                >
                    <BannerItem color="#6366F1" title="ETH 2.0 Staking" subtitle="Earn up to 12% APR on your ETH" />
                    <BannerItem color="#EC4899" title="NFT Marketplace" subtitle="Discover unique digital collectibles" />
                    <BannerItem color="#F59E0B" title="DeFi Swap" subtitle="Fast and secure token exchange" />
                </PageView>
            </Container>
        </Padding>
    ), [currentBanner]);

    const quickActionsSection = React.useMemo(() => (
        <Padding padding={{ bottom: 24 }}>
            <SingleChildScrollView scrollDirection="horizontal">
                <Row>
                    <SizedBox width={16} />
                    {[
                        { icon: 'account_balance_wallet', label: 'Deposit', color: '#6366F1' },
                        { icon: 'swap_horiz', label: 'Swap', color: '#10B981' },
                        { icon: 'payments', label: 'Withdraw', color: '#F59E0B' },
                        { icon: 'qr_code_scanner', label: 'Scan', color: '#EC4899' },
                        { icon: 'history', label: 'History', color: '#8B5CF6' },
                    ].map((action, i) => (
                        <Padding key={i} padding={{ right: 16 }}>
                            <Column crossAxisAlignment="center">
                                <Container
                                    width={56}
                                    height={56}
                                    decoration={{ color: `${action.color}15`, borderRadius: 16 }}
                                    alignment="center"
                                >
                                    <Icon name={action.icon} size={24} color={action.color} />
                                </Container>
                                <SizedBox height={8} />
                                <Text text={action.label} fontSize={12} color="#64748B" fontWeight="bold" />
                            </Column>
                        </Padding>
                    ))}
                    <SizedBox width={16} />
                </Row>
            </SingleChildScrollView>
        </Padding>
    ), []);

    const statsGridSection = React.useMemo(() => (
        <Padding padding={{ left: 16, right: 16, bottom: 24 }}>
            <Column crossAxisAlignment="stretch">
                <Row mainAxisAlignment="spaceBetween">
                    <Text text="Portfolio Overview" fontSize={18} fontWeight="bold" color="#1E293B" />
                    <Container padding={{ left: 12, right: 12, top: 6, bottom: 6 }} decoration={{ color: '#F1F5F9', borderRadius: 20 }}>
                        <Text text="Monthly" fontSize={12} color="#6366F1" fontWeight="bold" />
                    </Container>
                </Row>
                <SizedBox height={16} />
                <Container height={260}>
                    <GridView crossAxisCount={2} mainAxisSpacing={12} crossAxisSpacing={12} childAspectRatio={1.6}>
                        {[0, 1, 2, 3].map((i) => (
                            <Container
                                key={i}
                                padding={16}
                                decoration={{ color: '#FFFFFF', borderRadius: 20, boxShadow: { color: 'rgba(0,0,0,0.02)', blurRadius: 10, offset: { dx: 0, dy: 4 } } }}
                            >
                                <Column crossAxisAlignment="start">
                                    <Row mainAxisAlignment="spaceBetween">
                                        <Container width={36} height={36} decoration={{ color: ['#6366F115', '#10B98115', '#F59E0B15', '#EC489915'][i], borderRadius: 10 }} alignment="center">
                                            <Icon name={['pie_chart', 'show_chart', 'account_balance_wallet', 'assessment'][i]} size={18} color={['#6366F1', '#10B981', '#F59E0B', '#EC4899'][i]} />
                                        </Container>
                                        <Text text={`+${(Math.random() * 5).toFixed(1)}%`} fontSize={11} color="#10B981" fontWeight="bold" />
                                    </Row>
                                    <SizedBox height={12} />
                                    <Text text={['Balance', 'Profit', 'Assets', 'Rewards'][i]} fontSize={12} color="#64748B" />
                                    <Text text={`$${(Math.random() * 10000).toLocaleString()}`} fontSize={20} fontWeight="bold" color="#1E293B" />
                                </Column>
                            </Container>
                        ))}
                    </GridView>
                </Container>
            </Column>
        </Padding>
    ), []);

    const marketAnalysisSection = React.useMemo(() => (
        <Padding padding={{ left: 16, right: 16, bottom: 24 }}>
            <Container
                padding={20}
                decoration={{
                    color: '#1E293B',
                    borderRadius: 24,
                    boxShadow: { color: 'rgba(0,0,0,0.1)', blurRadius: 20, offset: { dx: 0, dy: 10 } }
                }}
            >
                <Column crossAxisAlignment="stretch">
                    <Row mainAxisAlignment="spaceBetween">
                        <Column crossAxisAlignment="start">
                            <Text text="Market Analysis" color="#FFFFFF" fontSize={18} fontWeight="bold" />
                            <Text text="24h AI Prediction" color="#94A3B8" fontSize={12} />
                        </Column>
                        <Container width={48} height={48} decoration={{ color: 'rgba(255,255,255,0.1)', borderRadius: 24 }} alignment="center">
                            <Icon name="psychology" size={24} color="#FFFFFF" />
                        </Container>
                    </Row>
                    <SizedBox height={24} />
                    <Row>
                        <Expanded>
                            <Column crossAxisAlignment="start">
                                <Text text="Bullish Sentiment" color="#94A3B8" fontSize={12} />
                                <SizedBox height={8} />
                                <Text text="68.5%" color="#10B981" fontSize={24} fontWeight="bold" />
                            </Column>
                        </Expanded>
                        <Container width={1} height={40} color="rgba(255,255,255,0.1)" />
                        <Expanded>
                            <Padding padding={{ left: 24 }}>
                                <Column crossAxisAlignment="start">
                                    <Text text="Volatility" color="#94A3B8" fontSize={12} />
                                    <SizedBox height={8} />
                                    <Text text="Low" color="#F59E0B" fontSize={24} fontWeight="bold" />
                                </Column>
                            </Padding>
                        </Expanded>
                    </Row>
                    <SizedBox height={24} />
                    <Container
                        padding={12}
                        decoration={{ color: 'rgba(255,255,255,0.05)', borderRadius: 12 }}
                    >
                        <Row>
                            <Icon name="info" size={16} color="#94A3B8" />
                            <SizedBox width={8} />
                            <Expanded>
                                <Text
                                    text="The market shows strong accumulation patterns in the top 10 assets. Expect low volatility in the next 24 hours."
                                    color="#CBD5E1"
                                    fontSize={11}
                                />
                            </Expanded>
                        </Row>
                    </Container>
                </Column>
            </Container>
        </Padding>
    ), []);

    const trendingAssetsSection = React.useMemo(() => (
        <Padding padding={{ top: 12, bottom: 24 }}>
            <Padding padding={{ left: 16, right: 16, bottom: 12 }}>
                <Text text="Trending Assets" fontSize={18} fontWeight="bold" color="#1E293B" />
            </Padding>
            <SingleChildScrollView scrollDirection="horizontal">
                <Row>
                    <SizedBox width={16} />
                    {['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot'].map((name, i) => (
                        <Padding key={i} padding={{ right: 12 }}>
                            <Container
                                width={140}
                                padding={16}
                                decoration={{ color: '#FFFFFF', borderRadius: 20, border: { color: '#F1F5F9', width: 1 } }}
                            >
                                <Column crossAxisAlignment="start">
                                    <Container width={40} height={40} decoration={{ color: '#F8FAFC', borderRadius: 12 }} alignment="center">
                                        <Text text={name[0]} fontSize={20} fontWeight="bold" color="#6366F1" />
                                    </Container>
                                    <SizedBox height={12} />
                                    <Text text={name} fontSize={14} fontWeight="bold" />
                                    <Text text={`$${(Math.random() * 50000).toFixed(0)}`} fontSize={12} color="#64748B" />
                                </Column>
                            </Container>
                        </Padding>
                    ))}
                </Row>
            </SingleChildScrollView>
        </Padding>
    ), []);

    const listHeader = React.useMemo(() => (
        <Padding padding={{ left: 16, right: 16, bottom: 16 }}>
            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                <Text text="Market Assets" fontSize={18} fontWeight="bold" color="#1E293B" />
                <Container padding={{ left: 12, right: 12, top: 6, bottom: 6 }} decoration={{ color: '#F1F5F9', borderRadius: 20 }}>
                    <Text text={`${listData.length} Items`} fontSize={11} color="#64748B" fontWeight="bold" />
                </Container>
            </Row>
        </Padding>
    ), [listData.length]);

    return (
        <Scaffold
            appBar={<AppBar title="Complex Layout" backgroundColor="#FFFFFF" foregroundColor="#1E293B" elevation={0} />}
            backgroundColor="#F8FAFC"
        >
            <ListView
                itemCount={listData.length + 8}
                itemBuilder={(index: number) => {
                    if (index === 0) return headerSection;
                    if (index === 1) return bannerSection;
                    if (index === 2) return quickActionsSection;
                    if (index === 3) return statsGridSection;
                    if (index === 4) return marketAnalysisSection;
                    if (index === 5) return trendingAssetsSection;
                    if (index === 6) return listHeader;
                    if (index === listData.length + 7) return <SizedBox height={100} />;

                    const itemIndex = index - 7;
                    return (
                        <Padding padding={{ left: 16, right: 16 }}>
                            <AssetListItem key={itemIndex} item={listData[itemIndex]} />
                        </Padding>
                    );
                }}
            />
        </Scaffold>
    );
};

export default ComplexPage;
