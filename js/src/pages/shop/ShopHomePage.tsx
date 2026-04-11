import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Column, Row, Container, Text, Image, Icon, SizedBox,
  InkWell, SafeArea, SingleChildScrollView, PageView,
  GridView, Expanded, Stack, Positioned, Center, Padding,
  ClipRRect, LinearProgressIndicator,
} from "fuickjs";
import { useNavigator } from "fuickjs";
import { BANNERS, CATEGORIES, PRODUCTS, Product } from "./data";
import { addToCart, getCartCount } from "./store";

// ── 颜色主题 ──────────────────────────────────────
const C = {
  primary: "#6C63FF",
  primaryLight: "#EEF0FF",
  accent: "#FF6584",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#1A1A2E",
  textSub: "#8A8FA3",
  divider: "#F0F0F5",
  star: "#FFB800",
  red: "#FF4D4F",
  green: "#52C41A",
};

// ── 搜索栏 ────────────────────────────────────────
function SearchBar({ onTap }: { onTap: () => void }) {
  return (
    <InkWell onTap={onTap}>
      <Container
        height={44}
        decoration={{ color: "#F0F0F8", borderRadius: 22 }}
        padding={{ left: 16, right: 16 }}
      >
        <Row crossAxisAlignment="center">
          <Icon name="search" size={18} color={C.textSub} />
          <SizedBox width={8} />
          <Text text="搜索商品、品牌..." fontSize={14} color={C.textSub} />
        </Row>
      </Container>
    </InkWell>
  );
}

// ── Banner ────────────────────────────────────────
function BannerSection() {
  const [index, setIndex] = useState(0);
  const pageRef = useRef<PageView>(null);

  return (
    <Container margin={{ top: 12, left: 16, right: 16 }}>
      <ClipRRect borderRadius={16}>
        <Container height={180}>
          <PageView ref={pageRef} onPageChanged={setIndex}>
            {BANNERS.map((b) => (
              <Stack key={b.id}>
                <Image src={b.image} fit="cover" width={9999} height={180} />
                {/* 渐变遮罩 */}
                <Positioned bottom={0} left={0} right={0}>
                  <Container
                    height={80}
                    decoration={{
                      gradient: {
                        type: "linear",
                        colors: ["#00000000", "#000000BB"],
                        begin: "topCenter",
                        end: "bottomCenter",
                      },
                    }}
                  />
                </Positioned>
                <Positioned bottom={16} left={20}>
                  <Column crossAxisAlignment="start">
                    <Text text={b.title} fontSize={20} fontWeight="bold" color="white" />
                    <SizedBox height={4} />
                    <Text text={b.subtitle} fontSize={12} color="#FFFFFFCC" />
                  </Column>
                </Positioned>
              </Stack>
            ))}
          </PageView>
          {/* 指示器 */}
          <Positioned bottom={10} right={16}>
            <Row>
              {BANNERS.map((_, i) => (
                <Container
                  key={i}
                  width={i === index ? 16 : 6}
                  height={6}
                  margin={{ left: 3 }}
                  decoration={{
                    color: i === index ? "white" : "#FFFFFF66",
                    borderRadius: 3,
                  }}
                />
              ))}
            </Row>
          </Positioned>
        </Container>
      </ClipRRect>
    </Container>
  );
}

// ── 分类栏 ────────────────────────────────────────
function CategoryBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Container
      margin={{ top: 16, left: 16, right: 16 }}
      padding={16}
      decoration={{ color: C.card, borderRadius: 16 }}
    >
      <GridView
        crossAxisCount={4}
        shrinkWrap
        physics="never"
        mainAxisSpacing={12}
        crossAxisSpacing={8}
        childAspectRatio={0.9}
      >
        {CATEGORIES.map((cat) => {
          const active = selected === cat.id;
          return (
            <InkWell key={cat.id} onTap={() => onSelect(cat.id)}>
              <Column mainAxisAlignment="center" crossAxisAlignment="center">
                <Container
                  width={44}
                  height={44}
                  decoration={{
                    color: active ? cat.color : cat.color + "18",
                    borderRadius: 14,
                  }}
                  alignment="center"
                >
                  <Icon name={cat.icon} size={22} color={active ? "white" : cat.color} />
                </Container>
                <SizedBox height={6} />
                <Text
                  text={cat.name}
                  fontSize={12}
                  color={active ? cat.color : C.text}
                  fontWeight={active ? "bold" : "normal"}
                />
              </Column>
            </InkWell>
          );
        })}
      </GridView>
    </Container>
  );
}

// ── 闪购倒计时区 ──────────────────────────────────
function FlashSaleSection({ onProductTap }: { onProductTap: (p: Product) => void }) {
  const flashProducts = PRODUCTS.slice(0, 4);
  return (
    <Container
      margin={{ top: 16, left: 16, right: 16 }}
      decoration={{ color: C.card, borderRadius: 16 }}
      padding={16}
    >
      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
        <Row crossAxisAlignment="center">
          <Container
            padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
            decoration={{ color: C.accent, borderRadius: 8 }}
          >
            <Text text="⚡ 限时闪购" fontSize={13} fontWeight="bold" color="white" />
          </Container>
          <SizedBox width={10} />
          <Text text="距结束" fontSize={12} color={C.textSub} />
          <SizedBox width={4} />
          {["02", ":", "34", ":", "17"].map((s, i) => (
            <Container
              key={i}
              padding={s === ":" ? { left: 2, right: 2 } : { left: 5, right: 5, top: 2, bottom: 2 }}
              margin={{ left: 1, right: 1 }}
              decoration={s !== ":" ? { color: C.text, borderRadius: 4 } : undefined}
            >
              <Text text={s} fontSize={13} fontWeight="bold" color={s !== ":" ? "white" : C.text} />
            </Container>
          ))}
        </Row>
        <Row crossAxisAlignment="center">
          <Text text="更多" fontSize={12} color={C.primary} />
          <Icon name="chevron_right" size={16} color={C.primary} />
        </Row>
      </Row>
      <SizedBox height={14} />
      <Row>
        {flashProducts.map((p) => (
          <Expanded key={p.id}>
            <InkWell onTap={() => onProductTap(p)}>
              <Column crossAxisAlignment="center" padding={{ right: 8 }}>
                <ClipRRect borderRadius={10}>
                  <Image src={p.image} width={9999} height={80} fit="cover" />
                </ClipRRect>
                <SizedBox height={6} />
                <Text text={`¥${p.price}`} fontSize={14} fontWeight="bold" color={C.accent} />
                <SizedBox height={2} />
                <Container
                  padding={{ left: 0, right: 0 }}
                  width={9999}
                >
                  <LinearProgressIndicator
                    value={0.3 + Math.random() * 0.5}
                    color={C.accent}
                    backgroundColor={C.accent + "22"}
                    strokeWidth={4}
                    borderRadius={2}
                  />
                </Container>
                <SizedBox height={2} />
                <Text text="已抢70%" fontSize={10} color={C.textSub} />
              </Column>
            </InkWell>
          </Expanded>
        ))}
      </Row>
    </Container>
  );
}

// ── 商品卡片 ──────────────────────────────────────
function ProductCard({ product, onTap }: { product: Product; onTap: () => void }) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 10) * 10;
  return (
    <InkWell onTap={onTap}>
      <Container
        decoration={{ color: C.card, borderRadius: 14 }}
        margin={{ bottom: 12 }}
      >
        <Stack>
          <ClipRRect borderRadius={{ topLeft: 14, topRight: 14 }}>
            <Image src={product.image} width={9999} height={160} fit="cover" />
          </ClipRRect>
          {product.tag && (
            <Positioned top={8} left={8}>
              <Container
                padding={{ left: 6, right: 6, top: 3, bottom: 3 }}
                decoration={{ color: C.accent, borderRadius: 6 }}
              >
                <Text text={product.tag} fontSize={10} fontWeight="bold" color="white" />
              </Container>
            </Positioned>
          )}
          {discount > 0 && (
            <Positioned top={8} right={8}>
              <Container
                padding={{ left: 5, right: 5, top: 3, bottom: 3 }}
                decoration={{ color: "#FF4D4F", borderRadius: 6 }}
              >
                <Text text={`${discount}折`} fontSize={10} fontWeight="bold" color="white" />
              </Container>
            </Positioned>
          )}
        </Stack>
        <Padding padding={{ left: 12, right: 12, top: 10, bottom: 12 }}>
          <Text text={product.name} fontSize={14} fontWeight="bold" color={C.text} maxLines={1} overflow="ellipsis" />
          <SizedBox height={4} />
          <Text text={product.desc} fontSize={12} color={C.textSub} maxLines={2} overflow="ellipsis" />
          <SizedBox height={8} />
          <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
            <Column crossAxisAlignment="start">
              <Row crossAxisAlignment="baseline">
                <Text text="¥" fontSize={12} fontWeight="bold" color={C.accent} />
                <Text text={`${product.price}`} fontSize={20} fontWeight="bold" color={C.accent} />
              </Row>
              <Text
                text={`¥${product.originalPrice}`}
                fontSize={11}
                color={C.textSub}
                // textDecoration="lineThrough" // 暂时用颜色区分
              />
            </Column>
            <InkWell onTap={() => { addToCart(product); }}>
              <Container
                width={32}
                height={32}
                decoration={{ color: C.primary, borderRadius: 16 }}
                alignment="center"
              >
                <Icon name="add" size={18} color="white" />
              </Container>
            </InkWell>
          </Row>
          <SizedBox height={6} />
          <Row crossAxisAlignment="center">
            <Icon name="star" size={12} color={C.star} />
            <SizedBox width={3} />
            <Text text={`${product.rating}`} fontSize={11} color={C.text} />
            <SizedBox width={8} />
            <Text text={`已售 ${product.sales >= 1000 ? (product.sales / 1000).toFixed(1) + "k" : product.sales}`} fontSize={11} color={C.textSub} />
          </Row>
        </Padding>
      </Container>
    </InkWell>
  );
}

// ── 主页 ──────────────────────────────────────────
export default function ShopHomePage() {
  const navigator = useNavigator();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(getCartCount());

  // 简单订阅购物车变化
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    setCartCount(getCartCount());
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const goDetail = useCallback((product: Product) => {
    navigator.push("/shop/detail", { product });
  }, [navigator]);

  return (
    <Container color={C.bg}>
      <SafeArea>
        <Column crossAxisAlignment="stretch">
          {/* 顶部导航栏 */}
          <Container
            color="white"
            padding={{ left: 16, right: 16, top: 12, bottom: 12 }}
            decoration={{
              color: "white",
              boxShadow: { color: "#0000000A", blurRadius: 8, offset: { dx: 0, dy: 2 } },
            }}
          >
            <Row crossAxisAlignment="center">
              <Expanded>
                <SearchBar onTap={() => {}} />
              </Expanded>
              <SizedBox width={12} />
              <InkWell onTap={() => navigator.push("/shop/cart", {})}>
                <Stack>
                  <Container width={44} height={44} alignment="center">
                    <Icon name="shopping_cart" size={26} color={C.text} />
                  </Container>
                  {cartCount > 0 && (
                    <Positioned top={4} right={4}>
                      <Container
                        width={18}
                        height={18}
                        decoration={{ color: C.accent, borderRadius: 9 }}
                        alignment="center"
                      >
                        <Text text={`${cartCount}`} fontSize={10} fontWeight="bold" color="white" />
                      </Container>
                    </Positioned>
                  )}
                </Stack>
              </InkWell>
            </Row>
          </Container>

          {/* 内容区 */}
          <Expanded>
            <SingleChildScrollView>
              <Column crossAxisAlignment="stretch">
                {/* Banner */}
                <BannerSection />

                {/* 分类 */}
                <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

                {/* 闪购 */}
                <FlashSaleSection onProductTap={goDetail} />

                {/* 商品列表标题 */}
                <Container margin={{ top: 20, left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Row crossAxisAlignment="center">
                      <Container width={4} height={18} decoration={{ color: C.primary, borderRadius: 2 }} />
                      <SizedBox width={8} />
                      <Text text="精选好物" fontSize={17} fontWeight="bold" color={C.text} />
                    </Row>
                    <Text text={`共 ${filteredProducts.length} 件`} fontSize={12} color={C.textSub} />
                  </Row>
                </Container>

                {/* 商品双列网格 */}
                <Container padding={{ left: 12, right: 12 }}>
                  <GridView
                    crossAxisCount={2}
                    crossAxisSpacing={10}
                    mainAxisSpacing={0}
                    childAspectRatio={0.62}
                    shrinkWrap
                    physics="never"
                    itemCount={filteredProducts.length}
                    itemBuilder={(index) => (
                      <ProductCard
                        key={filteredProducts[index].id}
                        product={filteredProducts[index]}
                        onTap={() => goDetail(filteredProducts[index])}
                      />
                    )}
                  />
                </Container>

                <Container height={24} />
              </Column>
            </SingleChildScrollView>
          </Expanded>
        </Column>
      </SafeArea>
    </Container>
  );
}
