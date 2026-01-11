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
} from 'fuick_js_framework';

const AssetListItem = ({ item }: { item: any }) => {
    return (
        <Container  >
            <Padding padding={{ bottom: 12 }}>
                <Container
                    padding={16}
                    decoration={{
                        color: '#FFFFFF',
                        borderRadius: 16,
                        border: { color: '#EEEEEE', width: 1 }
                    }}
                >
                    <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                        <Row crossAxisAlignment="center">
                            <Container width={40} height={40} color="#00BCD4" borderRadius={20} alignment="center">
                                <Text text={item.title[0]} color="#FFFFFF" fontSize={18} />
                            </Container>
                            <SizedBox width={12} />
                            <Column crossAxisAlignment="start">
                                <Text text={item.title} fontSize={16} fontWeight="bold" />
                                <Text text={`Vol: ${item.volume}`} fontSize={12} color="#999999" />
                            </Column>
                        </Row>
                        <Column crossAxisAlignment="end">
                            <Text text={`$${item.price}`} fontSize={16} fontWeight="bold" />
                            <Container
                                padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
                                decoration={{
                                    color: Number(item.change) >= 0 ? '#E8F5E9' : '#FFEBEE',
                                    borderRadius: 4
                                }}
                            >
                                <Text
                                    text={`${Number(item.change) >= 0 ? '+' : ''}${item.change}%`}
                                    fontSize={12}
                                    color={Number(item.change) >= 0 ? '#2E7D32' : '#C62828'}
                                />
                            </Container>
                        </Column>
                    </Row>
                </Container>
            </Padding>
        </Container>
    );
};

const ComplexPage = () => {
    const [count, setCount] = React.useState(0);
    // ...

    // 自动刷新测试
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCount(c => c + 1);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    // 生成大量模拟数据以增加 UI 复杂度
    const listData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Asset Token #${i + count}`,
        price: (Math.random() * 50000).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        volume: (Math.random() * 1000).toFixed(1) + 'M',
    }));

    return (
        <Container color="#FFFFFF">
            <SingleChildScrollView>
                <Column crossAxisAlignment="stretch">
                    {/* 顶部标题 */}
                    <Padding padding={20}>
                        <Row mainAxisAlignment="spaceBetween">
                            <Text text={`Performance Test (Update: ${count})`} fontSize={24} fontWeight="bold" />
                            <Container padding={8} color="#E0E0E0" borderRadius={8}>
                                <Text text={`${listData.length} Nodes`} fontSize={12} />
                            </Container>
                        </Row>
                    </Padding>

                    {/* 模拟非常复杂的网格布局 */}
                    <Padding padding={{ left: 16, right: 16 }}>
                        <Column crossAxisAlignment="stretch">
                            <Text text="Market Overview" fontSize={18} fontWeight="bold" />
                            <SizedBox height={12} />
                            {/* 这里通过嵌套 Column 和 Row 制造大量节点 */}
                            {Array.from({ length: 10 }).map((_, rowIndex) => (
                                <Row key={rowIndex} mainAxisAlignment="spaceBetween">
                                    {Array.from({ length: 3 }).map((_, colIndex) => (
                                        <Expanded key={colIndex}>
                                            <Padding padding={4}>
                                                <Container
                                                    height={80}
                                                    decoration={{ color: '#F5F5F5', borderRadius: 12 }}
                                                    padding={8}
                                                >
                                                    <Column mainAxisAlignment="center">
                                                        <Text text={`Metric ${rowIndex * 3 + colIndex}`} fontSize={10} color="#666666" />
                                                        <Text text={`${(Math.random() * 100).toFixed(2)}%`} fontSize={16} fontWeight="bold" color="#00BFA5" />
                                                    </Column>
                                                </Container>
                                            </Padding>
                                        </Expanded>
                                    ))}
                                </Row>
                            ))}
                        </Column>
                    </Padding>

                    <SizedBox height={24} />

                    {/* 模拟长列表，每个 Item 都包含多个嵌套节点 */}
                    <Padding padding={{ left: 16, right: 16 }}>
                        <Column crossAxisAlignment="stretch">
                            <Text text="Asset List (Full Refresh Test)" fontSize={18} fontWeight="bold" />
                            <SizedBox height={12} />
                            {listData.map((item) => (
                                <AssetListItem key={item.id} item={item} />
                            ))}
                        </Column>
                    </Padding>

                    <SizedBox height={100} />
                </Column>
            </SingleChildScrollView>
        </Container>
    );
};

export default ComplexPage;
