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
    ErrorBoundary,
} from 'fuick_js_framework';

const ComplexPage = () => {
    const [activeTab, setActiveTab] = React.useState('Hot Picks');

    const tabs = ['收藏', 'Hot Picks', '新币榜', '涨幅榜', 'AI & 大数据'];

    const quickActions = [
        { name: 'Pay', icon: 'payments' },
        { name: '合约', icon: 'account_balance_wallet' },
        { name: '赚币', icon: 'redeem' },
        { name: '更多', icon: 'apps' },
    ];

    const financeItems = [
        { name: '稳定币理财', tag: 'Plus', rate: '10%', symbol: 'USDT' },
        { name: 'SOL', tag: '', rate: '6.26%', symbol: 'SOL' },
        { name: 'USDC', tag: '', rate: '5.22%', symbol: 'USDC' },
    ];

    return (
        <ErrorBoundary fallback={(error: Error) => (
            <Container color="#FFF0F0" padding={20}>
                <Column crossAxisAlignment="start">
                    <Text text="页面渲染出错" fontSize={20} color="#D32F2F" fontWeight="bold" />
                    <SizedBox height={10} />
                    <Text text={error.message} fontSize={14} color="#333333" />
                </Column>
            </Container>
        )}>
            <Container color="#FFFFFF">
                <SingleChildScrollView>
                    <Column crossAxisAlignment="stretch">
                        {/* 顶部搜索栏 */}
                        <Padding padding={{ left: 16, right: 16, top: 12, bottom: 8 }}>
                            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                                <Icon name="grid_view" size={24} color="#333333" />
                                <Expanded>
                                    <Padding padding={{ left: 12, right: 12 }}>
                                        <Container
                                            height={36}
                                            decoration={{
                                                color: '#F5F5F5',
                                                borderRadius: 18,
                                            }}
                                            padding={{ left: 12, right: 12 }}
                                            alignment="center"
                                        >
                                            <Row crossAxisAlignment="center">
                                                <Icon name="search" size={20} color="#999999" />
                                                <SizedBox width={8} />
                                                <Text text="全局搜索" fontSize={14} color="#999999" />
                                                <Expanded><SizedBox /></Expanded>
                                                <Icon name="crop_free" size={20} color="#999999" />
                                                <SizedBox width={12} />
                                                <Icon name="center_focus_weak" size={20} color="#999999" />
                                            </Row>
                                        </Container>
                                    </Padding>
                                </Expanded>
                                <Stack>
                                    <Icon name="notifications_none" size={26} color="#333333" />
                                    <Positioned top={0} right={0}>
                                        <Container
                                            width={16}
                                            height={16}
                                            borderRadius={8}
                                            color="#00BCD4"
                                            alignment="center"
                                        >
                                            <Text text="30" fontSize={9} color="#FFFFFF" />
                                        </Container>
                                    </Positioned>
                                </Stack>
                            </Row>
                        </Padding>

                        {/* 余额部分 */}
                        <Padding padding={{ left: 16, right: 16, top: 16, bottom: 16 }}>
                            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                                <Column crossAxisAlignment="start">
                                    <Row crossAxisAlignment="center">
                                        <Text text="我的钱包2" fontSize={14} color="#666666" />
                                        <Icon name="keyboard_arrow_down" size={18} color="#666666" />
                                    </Row>
                                    <SizedBox height={8} />
                                    <Text text="$1,542.39" fontSize={32} color="#000000" />
                                    <SizedBox height={4} />
                                    <Row crossAxisAlignment="center">
                                        <Text text="+0.01%" fontSize={12} color="#00BFA5" />
                                        <SizedBox width={4} />
                                        <Text text="今日" fontSize={12} color="#999999" />
                                    </Row>
                                </Column>
                                <Container
                                    padding={{ left: 20, right: 20, top: 10, bottom: 10 }}
                                    decoration={{
                                        color: '#80DEEA',
                                        borderRadius: 20,
                                    }}
                                >
                                    <Text text="去充值" fontSize={14} color="#000000" />
                                </Container>
                            </Row>
                        </Padding>

                        {/* 快捷操作 */}
                        <Padding padding={{ left: 16, right: 16, top: 8, bottom: 20 }}>
                            <Row mainAxisAlignment="spaceAround">
                                {quickActions.map(action => (
                                    <Column key={action.name} crossAxisAlignment="center">
                                        <Container
                                            width={48}
                                            height={48}
                                            decoration={{
                                                color: '#F8F9FA',
                                                borderRadius: 12,
                                            }}
                                            alignment="center"
                                        >
                                            <Icon name={action.icon} size={24} color="#006064" />
                                        </Container>
                                        <SizedBox height={8} />
                                        <Text text={action.name} fontSize={12} color="#666666" />
                                    </Column>
                                ))}
                            </Row>
                        </Padding>

                        {/* Banner */}
                        <Padding padding={{ left: 16, right: 16, bottom: 24 }}>
                            <Container
                                height={140}
                                decoration={{
                                    color: '#E0F7FA',
                                    borderRadius: 16,
                                }}
                                padding={16}
                            >
                                <Row mainAxisAlignment="spaceBetween">
                                    <Column crossAxisAlignment="start" mainAxisAlignment="center">
                                        <Text text="限时免费开卡" fontSize={12} color="#666666" />
                                        <SizedBox height={4} />
                                        <Text text="你有一张免费加密卡可领取" fontSize={16} color="#000000" />
                                        <SizedBox height={16} />
                                        <Container
                                            padding={{ left: 12, right: 12, top: 4, bottom: 4 }}
                                            decoration={{
                                                color: '#FFFFFF',
                                                borderRadius: 12,
                                                border: { color: '#EEEEEE', width: 1 }
                                            }}
                                        >
                                            <Row crossAxisAlignment="center">
                                                <Text text="Go" fontSize={12} color="#000000" />
                                                <Icon name="chevron_right" size={14} color="#000000" />
                                            </Row>
                                        </Container>
                                    </Column>
                                    <Center>
                                        <Icon name="credit_card" size={80} color="#006064" />
                                    </Center>
                                </Row>
                            </Container>
                        </Padding>

                        {/* 热门理财 */}
                        <Padding padding={{ left: 16, right: 16 }}>
                            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                                <Text text="热门理财" fontSize={18} color="#000000" />
                                <Icon name="chevron_right" size={20} color="#999999" />
                            </Row>
                        </Padding>
                        <SizedBox height={16} />
                        <SingleChildScrollView scrollDirection="horizontal">
                            <Padding padding={{ left: 16, right: 16 }}>
                                <Row>
                                    {financeItems.map((item, index) => (
                                        <Padding key={index} padding={{ right: 12 }}>
                                            <Container
                                                width={150}
                                                padding={16}
                                                decoration={{
                                                    color: '#F8F9FA',
                                                    borderRadius: 16,
                                                }}
                                            >
                                                <Column crossAxisAlignment="start">
                                                    <Icon name="stars" size={32} color="#00BCD4" />
                                                    <SizedBox height={16} />
                                                    <Row crossAxisAlignment="center">
                                                        <Text text={item.name} fontSize={13} color="#666666" />
                                                        {item.tag && (
                                                            <Padding padding={{ left: 4 }}>
                                                                <Container
                                                                    padding={{ left: 4, right: 4, top: 1, bottom: 1 }}
                                                                    decoration={{ color: '#C8E6C9', borderRadius: 4 }}
                                                                >
                                                                    <Text text={item.tag} fontSize={9} color="#2E7D32" />
                                                                </Container>
                                                            </Padding>
                                                        )}
                                                    </Row>
                                                    <SizedBox height={4} />
                                                    <Row crossAxisAlignment="baseline">
                                                        <Text text={item.rate} fontSize={20} color="#000000" />
                                                        <SizedBox width={4} />
                                                        <Text text="APY" fontSize={12} color="#999999" />
                                                    </Row>
                                                </Column>
                                            </Container>
                                        </Padding>
                                    ))}
                                </Row>
                            </Padding>
                        </SingleChildScrollView>

                        <SizedBox height={32} />

                        {/* 全链榜单 */}
                        <Padding padding={{ left: 16, right: 16 }}>
                            <Text text="全链榜单" fontSize={18} color="#000000" />
                            <SizedBox height={16} />
                            <SingleChildScrollView scrollDirection="horizontal">
                                <Row>
                                    {tabs.map(tab => (
                                        <GestureDetector key={tab} onTap={() => setActiveTab(tab)}>
                                            <Padding padding={{ right: 24 }}>
                                                <Column crossAxisAlignment="center">
                                                    <Text
                                                        text={tab}
                                                        fontSize={16}
                                                        color={activeTab === tab ? '#000000' : '#999999'}
                                                    />
                                                    <SizedBox height={4} />
                                                    <Container
                                                        width={20}
                                                        height={3}
                                                        color={activeTab === tab ? '#006064' : 'transparent'}
                                                        borderRadius={2}
                                                    />
                                                </Column>
                                            </Padding>
                                        </GestureDetector>
                                    ))}
                                </Row>
                            </SingleChildScrollView>
                        </Padding>

                        <SizedBox height={16} />
                        <Padding padding={{ left: 16, right: 16 }}>
                            <Row mainAxisAlignment="spaceBetween">
                                <Row crossAxisAlignment="center">
                                    <Text text="市值" fontSize={12} color="#999999" />
                                    <Icon name="arrow_drop_down" size={14} color="#999999" />
                                    <SizedBox width={8} />
                                    <Divider width={1} height={12} color="#EEEEEE" />
                                    <SizedBox width={8} />
                                    <Text text="交易额" fontSize={12} color="#999999" />
                                    <Icon name="arrow_drop_up" size={14} color="#999999" />
                                </Row>
                                <Row crossAxisAlignment="center">
                                    <Text text="最新价格" fontSize={12} color="#999999" />
                                    <Icon name="unfold_more" size={14} color="#999999" />
                                    <SizedBox width={8} />
                                    <Divider width={1} height={12} color="#EEEEEE" />
                                    <SizedBox width={8} />
                                    <Text text="涨跌幅" fontSize={12} color="#999999" />
                                    <Icon name="unfold_more" size={14} color="#999999" />
                                </Row>
                            </Row>
                        </Padding>

                        <SizedBox height={100} /> {/* 底部留白 */}
                    </Column>
                </SingleChildScrollView>
            </Container>
        </ErrorBoundary>
    );
};

export default ComplexPage;
