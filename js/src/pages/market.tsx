import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Column,
  Container,
  Text,
  Padding,
  SafeArea,
  Row,
  Image,
  SizedBox,
  InkWell,
  Scaffold,
  Icon,
  GridView,
  PageView,
  Center,
  CustomScrollView,
  SliverPersistentHeader,
  SliverToBoxAdapter,
  SliverList,
  Flexible,
  Divider,
  TextField,
  DefaultTabController,
  TabBar,
  Tab,
  SliverAppBar,
} from "fuickjs";

const TABS = ["全部", "沪深", "港股", "美股"];
const TAB_TO_PREFIXES: Record<string, string[]> = {
  全部: [],
  沪深: ["SH", "SZ"],
  港股: ["HK"],
  美股: ["US", "NAS"],
};

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

// --- 数据生成逻辑 ---

// 生成 500+ 条股票数据
const generateStocks = (count: number) => {
  const stocks = [];
  const prefixes = ["SH", "SZ", "HK", "US", "NAS"];
  const names = [
    "科技",
    "能源",
    "生物",
    "金融",
    "半导体",
    "互联网",
    "制造",
    "医疗",
    "汽车",
    "地产",
  ];

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const code = (100000 + i).toString();
    const name = `${names[i % names.length]}${i + 1}`;
    stocks.push({
      symbol: `${prefix}.${code}`,
      name: name,
      price: 10 + Math.random() * 500,
      change: -10 + Math.random() * 20,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.floor(Math.random() * 1000000000),
    });
  }
  return stocks;
};

const ALL_STOCKS = generateStocks(550);

const BANNERS = [
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
  "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
  "https://images.unsplash.com/photo-1611974714658-058e1365994f?w=800&q=80",
];

const CATEGORIES = [
  { name: "沪深京", icon: "show_chart", color: "#FF5252" },
  { name: "港美股", icon: "language", color: "#2196F3" },
  { name: "自选", icon: "star", color: "#FFC107" },
  { name: "新股", icon: "fiber_new", color: "#FF4081" },
  { name: "涨幅榜", icon: "trending_up", color: "#4CAF50" },
  { name: "ETF", icon: "pie_chart", color: "#9C27B0" },
  { name: "模拟盘", icon: "games", color: "#795548" },
  { name: "更多", icon: "apps", color: "#607D8B" },
];

// --- 组件定义 ---

function StockItem({ stock }: { stock: Stock; index: number }) {
  const isUp = stock.change >= 0;
  const color = isUp ? "#F44336" : "#4CAF50";

  return (
    <Column>
      <InkWell onTap={() => console.log(`Click stock: ${stock.symbol}`)}>
        <Container color="white">
          <Padding padding={{ left: 16, right: 16, top: 12, bottom: 12 }}>
            <Row mainAxisAlignment="spaceBetween">
              <Column crossAxisAlignment="start">
                <Row>
                  <Text text={stock.name} fontSize={16} fontWeight="bold" />
                  <SizedBox width={6} />
                  <Container
                    color="#F5F5F5"
                    borderRadius={4}
                    padding={{ left: 4, right: 4, top: 1, bottom: 1 }}
                  >
                    <Text
                      text={stock.symbol.split(".")[0]}
                      fontSize={10}
                      color="#666666"
                    />
                  </Container>
                </Row>
                <SizedBox height={4} />
                <Text text={stock.symbol} fontSize={12} color="#999999" />
              </Column>

              {/* 模拟一个小趋势图占位 */}
              <Row>
                <Icon
                  name={isUp ? "trending_up" : "trending_down"}
                  size={20}
                  color={color + "44"}
                />
                <SizedBox width={20} />
                <Column crossAxisAlignment="end">
                  <Text
                    text={stock.price.toFixed(2)}
                    fontSize={17}
                    fontWeight="bold"
                    color={color}
                  />
                  <SizedBox height={2} />
                  <Text
                    text={(isUp ? "+" : "") + stock.change.toFixed(2) + "%"}
                    fontSize={12}
                    color={color}
                  />
                </Column>
              </Row>
            </Row>
          </Padding>
        </Container>
      </InkWell>
      <Padding padding={{ left: 16 }}>
        <Divider height={1} color="#EEEEEE" />
      </Padding>
    </Column>
  );
}

export default function MarketPage() {
  // 将频繁变动的状态合并，确保在 Legacy 模式下也能在同一个 commit 中更新
  const [marketData, setMarketData] = useState({
    tick: 0,
    bannerIndex: 0,
    stocks: ALL_STOCKS, // 初始值
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const listRef = useRef<SliverList>(null);
  const pageViewRef = useRef<PageView>(null);

  const { tick, stocks: stocksWithUpdate } = marketData;

  // 根据选中的 Tab 过滤股票
  const filteredStocks = useMemo(() => {
    const activeTab = TABS[activeTabIndex];
    const prefixes = TAB_TO_PREFIXES[activeTab];
    if (prefixes.length === 0) return ALL_STOCKS;
    return ALL_STOCKS.filter((s) =>
      prefixes.some((p) => s.symbol.startsWith(p)),
    );
  }, [activeTabIndex]);

  // 当 Tab 切换时，重置数据
  useEffect(() => {
    setMarketData((prev) => ({ ...prev, stocks: filteredStocks }));
  }, [filteredStocks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData((prev) => {
        const nextStocks = prev.stocks.map((s) => ({
          ...s,
          price: s.price + (Math.random() - 0.5),
          change: s.change + (Math.random() - 0.5) * 0.1,
        }));

        const nextBannerIndex = (prev.bannerIndex + 1) % BANNERS.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(nextBannerIndex);
        }

        // 局部更新 Native SliverList
        if (listRef.current) {
          const updates = nextStocks.map((stock, index) => ({
            index,
            dsl: <StockItem key={stock.symbol} stock={stock} index={index} />,
          }));
          listRef.current.updateItems(updates);
        }

        return {
          tick: prev.tick + 1,
          bannerIndex: nextBannerIndex,
          stocks: nextStocks,
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 使用 useCallback 包装 itemBuilder，避免每次 render 都生成新函数
  // 注意：如果 stock 数据依赖 stocksWithUpdate，那么 deps 必须包含它
  const itemBuilder = useCallback(
    (index: number) => {
      const stock = stocksWithUpdate[index];
      if (!stock) return null;
      return <StockItem key={stock.symbol} stock={stock} index={index} />;
    },
    [stocksWithUpdate],
  );

  // 缓存静态或半静态的 UI 部分
  const bannerItems = useMemo(
    () =>
      BANNERS.map((url, i) => (
        <Image key={i} url={url} fit="cover" borderRadius={12} />
      )),
    [],
  );

  const categoriesGrid = useMemo(
    () =>
      CATEGORIES.map((cat, i) => (
        <Container key={i} color="white" borderRadius={12}>
          <Column mainAxisAlignment="center">
            <Container
              width={40}
              height={40}
              borderRadius={20}
              color={cat.color + "15"}
            >
              <Center>
                <Icon name={cat.icon} color={cat.color} size={24} />
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={cat.name} fontSize={12} color="#333333" />
          </Column>
        </Container>
      )),
    [],
  );

  const tabBarTabs = useMemo(
    () => TABS.map((t) => <Tab key={t} text={t} />),
    [],
  );

  return (
    <DefaultTabController length={TABS.length} initialIndex={0}>
      <Scaffold backgroundColor="white">
        <CustomScrollView>
          {/* 顶部标题栏 - 改用 SliverPersistentHeader 实现吸顶 */}
          <SliverAppBar pinned={true}>
            <Container color="#2196F3" isBoundary={true}>
              <SafeArea>
                <Padding padding={{ left: 16, right: 16, bottom: 8 }}>
                  <Column mainAxisAlignment="center" crossAxisAlignment="start">
                    <Text
                      text="行情中心"
                      fontSize={18}
                      color="white"
                      fontWeight="bold"
                    />
                    <Text
                      text={`全网实时行情 · 已更新 ${tick} 次`}
                      fontSize={11}
                      color="white"
                    />
                  </Column>
                </Padding>
              </SafeArea>
            </Container>
          </SliverAppBar>

          {/* 搜索栏 */}
          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 12, bottom: 0 }}>
              <Container height={44} color="#F5F5F5" borderRadius={22}>
                <Padding padding={{ left: 16, right: 16 }}>
                  <Row crossAxisAlignment="center">
                    <Icon name="search" size={20} color="#999999" />
                    <SizedBox width={8} />
                    <Flexible>
                      <TextField
                        hintText="搜索代码/名称/拼音"
                        onChanged={(v) => console.log("Search:", v)}
                      />
                    </Flexible>
                  </Row>
                </Padding>
              </Container>
            </Padding>
          </SliverToBoxAdapter>

          {/* 顶部 Banner PageView */}
          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 16 }}>
              <Container height={150} borderRadius={12}>
                <PageView
                  ref={pageViewRef}
                  onPageChanged={(index) =>
                    setMarketData((prev) => ({ ...prev, bannerIndex: index }))
                  }
                >
                  {bannerItems}
                </PageView>
              </Container>
            </Padding>
          </SliverToBoxAdapter>

          {/* 快捷入口 Grid */}
          <SliverToBoxAdapter>
            <GridView
              padding={{ left: 12, right: 12, bottom: 8 }}
              crossAxisCount={4}
              mainAxisSpacing={12}
              crossAxisSpacing={12}
              childAspectRatio={0.8}
              shrinkWrap={true}
              physics="never"
            >
              {categoriesGrid}
            </GridView>
          </SliverToBoxAdapter>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 20, bottom: 0 }}>
              <Row mainAxisAlignment="spaceBetween">
                <Text
                  text={`${TABS[activeTabIndex]}榜单`}
                  fontSize={18}
                  fontWeight="bold"
                />
                <Row>
                  <Text
                    text={`全部${TABS[activeTabIndex]}`}
                    fontSize={13}
                    color="#2196F3"
                  />
                  <Icon name="chevron_right" size={18} color="#2196F3" />
                </Row>
              </Row>
            </Padding>
          </SliverToBoxAdapter>

          {/* 吸顶 TabBar - 改用 SliverPersistentHeader 实现 */}
          <SliverPersistentHeader pinned={true} minExtent={49} maxExtent={49}>
            <Container color="#FFFFFF">
              <Column>
                <TabBar
                  tabs={tabBarTabs}
                  onTap={(index) => setActiveTabIndex(index)}
                  labelColor="#2196F3"
                  unselectedLabelColor="#666666"
                  indicatorColor="#2196F3"
                  indicatorWeight={2}
                />
                <Divider height={1} color="#EEEEEE" />
              </Column>
            </Container>
          </SliverPersistentHeader>

          {/* 500+ 数据长列表 */}
          <SliverList
            ref={listRef}
            itemCount={stocksWithUpdate.length}
            itemBuilder={itemBuilder}
          />

          <SliverToBoxAdapter>
            <Container height={60}>
              <Center>
                <Text
                  text={`—— 到底了，共 ${stocksWithUpdate.length} 只股票 ——`}
                  color="#CCCCCC"
                  fontSize={12}
                />
              </Center>
            </Container>
          </SliverToBoxAdapter>
        </CustomScrollView>
      </Scaffold>
    </DefaultTabController>
  );
}
