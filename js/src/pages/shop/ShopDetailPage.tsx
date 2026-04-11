import React, { useState } from "react";
import {
  Column, Row, Container, Text, Image, Icon, SizedBox,
  InkWell, SafeArea, SingleChildScrollView, Stack, Positioned,
  Expanded, Padding, ClipRRect, useNavigator,
} from "fuickjs";
import { Product } from "./data";
import { addToCart, getCartCount } from "./store";

const C = {
  primary: "#6C63FF",
  accent: "#FF6584",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#1A1A2E",
  textSub: "#8A8FA3",
  star: "#FFB800",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <Row crossAxisAlignment="center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name={i <= Math.round(rating) ? "star" : "star_border"}
          size={16}
          color={C.star}
        />
      ))}
      <SizedBox width={6} />
      <Text text={`${rating}`} fontSize={14} fontWeight="bold" color={C.text} />
      <SizedBox width={4} />
      <Text text="/ 5.0" fontSize={12} color={C.textSub} />
    </Row>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <Row mainAxisAlignment="spaceBetween" padding={{ top: 10, bottom: 10 }}>
      <Text text={label} fontSize={14} color={C.textSub} />
      <Text text={value} fontSize={14} color={C.text} />
    </Row>
  );
}

interface Props {
  product: Product;
}

export default function ShopDetailPage({ product }: Props) {
  const navigator = useNavigator();
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [added, setAdded] = useState(false);

  const discount = Math.round((1 - product.price / product.originalPrice) * 10) * 10;
  const saved = product.originalPrice - product.price;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setCartCount(getCartCount());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    navigator.push("/shop/cart", {});
  }

  return (
    <Container color={C.bg}>
      <SafeArea>
        <Column crossAxisAlignment="stretch">
          {/* 顶部图片区 */}
          <Stack>
            <ClipRRect borderRadius={{ bottomLeft: 24, bottomRight: 24 }}>
              <Image src={product.image} width={9999} height={320} fit="cover" />
            </ClipRRect>
            {/* 渐变遮罩顶部 */}
            <Positioned top={0} left={0} right={0} height={80}>
              <Container
                decoration={{
                  gradient: {
                    type: "linear",
                    colors: ["#00000055", "#00000000"],
                    begin: "topCenter",
                    end: "bottomCenter",
                  },
                }}
              />
            </Positioned>
            {/* 返回按钮 */}
            <Positioned top={16} left={12}>
              <InkWell onTap={() => navigator.pop()}>
                <Container
                  width={40}
                  height={40}
                  decoration={{ color: "#00000044", borderRadius: 20 }}
                  alignment="center"
                >
                  <Icon name="arrow_back" size={22} color="white" />
                </Container>
              </InkWell>
            </Positioned>
            {/* 购物车按钮 */}
            <Positioned top={16} right={12}>
              <InkWell onTap={() => navigator.push("/shop/cart", {})}>
                <Stack>
                  <Container
                    width={40}
                    height={40}
                    decoration={{ color: "#00000044", borderRadius: 20 }}
                    alignment="center"
                  >
                    <Icon name="shopping_cart" size={22} color="white" />
                  </Container>
                  {cartCount > 0 && (
                    <Positioned top={0} right={0}>
                      <Container
                        width={16}
                        height={16}
                        decoration={{ color: C.accent, borderRadius: 8 }}
                        alignment="center"
                      >
                        <Text text={`${cartCount}`} fontSize={9} fontWeight="bold" color="white" />
                      </Container>
                    </Positioned>
                  )}
                </Stack>
              </InkWell>
            </Positioned>
            {/* 标签 */}
            {product.tag && (
              <Positioned top={16} left={60}>
                <Container
                  padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
                  decoration={{ color: C.accent, borderRadius: 8 }}
                >
                  <Text text={product.tag} fontSize={12} fontWeight="bold" color="white" />
                </Container>
              </Positioned>
            )}
          </Stack>

          {/* 内容 */}
          <Expanded>
            <SingleChildScrollView>
              <Column crossAxisAlignment="stretch">
                {/* 价格区 */}
                <Container
                  color="white"
                  margin={{ top: -16 }}
                  decoration={{ color: "white", borderRadius: { topLeft: 24, topRight: 24 } }}
                  padding={{ left: 20, right: 20, top: 24, bottom: 16 }}
                >
                  <Row crossAxisAlignment="center" mainAxisAlignment="spaceBetween">
                    <Row crossAxisAlignment="baseline">
                      <Text text="¥" fontSize={16} fontWeight="bold" color={C.accent} />
                      <Text text={`${product.price}`} fontSize={32} fontWeight="bold" color={C.accent} />
                    </Row>
                    <Column crossAxisAlignment="end">
                      <Text text={`原价 ¥${product.originalPrice}`} fontSize={13} color={C.textSub} />
                      {discount > 0 && (
                        <Container
                          margin={{ top: 4 }}
                          padding={{ left: 6, right: 6, top: 2, bottom: 2 }}
                          decoration={{ color: "#FF4D4F15", borderRadius: 6 }}
                        >
                          <Text text={`省 ¥${saved} · ${discount}折`} fontSize={11} color="#FF4D4F" />
                        </Container>
                      )}
                    </Column>
                  </Row>

                  <SizedBox height={14} />
                  <Text text={product.name} fontSize={20} fontWeight="bold" color={C.text} />
                  <SizedBox height={8} />
                  <Text text={product.desc} fontSize={14} color={C.textSub} />
                  <SizedBox height={12} />

                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <StarRow rating={product.rating} />
                    <Text
                      text={`${product.sales >= 1000 ? (product.sales / 1000).toFixed(1) + "k+" : product.sales + "+"} 人已购`}
                      fontSize={13}
                      color={C.textSub}
                    />
                  </Row>
                </Container>

                {/* 促销信息 */}
                <Container
                  color="white"
                  margin={{ top: 10 }}
                  padding={{ left: 20, right: 20, top: 14, bottom: 14 }}
                >
                  {[
                    { icon: "local_offer", color: C.accent, text: "满 999 减 100 · 满 1999 减 250" },
                    { icon: "local_shipping", color: C.primary, text: "免运费 · 极速发货 · 7天无理由退换" },
                    { icon: "verified_user", color: "#52C41A", text: "正品保障 · 假一赔十 · 官方授权" },
                  ].map((item, i) => (
                    <Row key={i} crossAxisAlignment="center" padding={{ bottom: i < 2 ? 10 : 0 }}>
                      <Container
                        width={28}
                        height={28}
                        decoration={{ color: item.color + "18", borderRadius: 8 }}
                        alignment="center"
                      >
                        <Icon name={item.icon} size={16} color={item.color} />
                      </Container>
                      <SizedBox width={10} />
                      <Text text={item.text} fontSize={13} color={C.text} />
                    </Row>
                  ))}
                </Container>

                {/* 规格选择 */}
                <Container
                  color="white"
                  margin={{ top: 10 }}
                  padding={{ left: 20, right: 20, top: 16, bottom: 16 }}
                >
                  <Text text="选择规格" fontSize={15} fontWeight="bold" color={C.text} />
                  <SizedBox height={12} />
                  {[["颜色", "星空黑 / 月光白 / 星云紫"], ["存储", "256GB / 512GB / 1TB"], ["套餐", "标准版 / 充电套装"]].map(([label, val]) => (
                    <InkWell key={label} onTap={() => {}}>
                      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center" padding={{ top: 10, bottom: 10 }}>
                        <Text text={label} fontSize={14} color={C.textSub} />
                        <Row crossAxisAlignment="center">
                          <Text text={val} fontSize={14} color={C.text} maxLines={1} overflow="ellipsis" />
                          <SizedBox width={4} />
                          <Icon name="chevron_right" size={16} color={C.textSub} />
                        </Row>
                      </Row>
                    </InkWell>
                  ))}
                </Container>

                {/* 商品参数 */}
                <Container
                  color="white"
                  margin={{ top: 10 }}
                  padding={{ left: 20, right: 20, top: 16, bottom: 16 }}
                >
                  <Text text="商品参数" fontSize={15} fontWeight="bold" color={C.text} />
                  <SizedBox height={4} />
                  <SpecRow label="品牌" value={product.name.split(" ")[0]} />
                  <Container height={1} color="#F5F5F5" />
                  <SpecRow label="产品类别" value={product.category} />
                  <Container height={1} color="#F5F5F5" />
                  <SpecRow label="评分" value={`${product.rating} / 5.0`} />
                  <Container height={1} color="#F5F5F5" />
                  <SpecRow label="累计销量" value={`${product.sales.toLocaleString()} 件`} />
                  <Container height={1} color="#F5F5F5" />
                  <SpecRow label="售后保障" value="一年质保 · 以旧换新" />
                </Container>

                {/* 数量选择 */}
                <Container
                  color="white"
                  margin={{ top: 10 }}
                  padding={{ left: 20, right: 20, top: 16, bottom: 16 }}
                >
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Text text="购买数量" fontSize={15} fontWeight="bold" color={C.text} />
                    <Row crossAxisAlignment="center">
                      <InkWell onTap={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Container
                          width={32}
                          height={32}
                          decoration={{ color: "#F5F5F5", borderRadius: 8 }}
                          alignment="center"
                        >
                          <Icon name="remove" size={18} color={quantity <= 1 ? C.textSub : C.text} />
                        </Container>
                      </InkWell>
                      <Container
                        width={48}
                        height={32}
                        alignment="center"
                      >
                        <Text text={`${quantity}`} fontSize={18} fontWeight="bold" color={C.text} />
                      </Container>
                      <InkWell onTap={() => setQuantity(quantity + 1)}>
                        <Container
                          width={32}
                          height={32}
                          decoration={{ color: C.primary + "18", borderRadius: 8 }}
                          alignment="center"
                        >
                          <Icon name="add" size={18} color={C.primary} />
                        </Container>
                      </InkWell>
                    </Row>
                  </Row>
                </Container>

                <Container height={100} />
              </Column>
            </SingleChildScrollView>
          </Expanded>

          {/* 底部操作栏 */}
          <Container
            color="white"
            padding={{ left: 20, right: 20, top: 12, bottom: 20 }}
            decoration={{
              color: "white",
              boxShadow: { color: "#0000001A", blurRadius: 12, offset: { dx: 0, dy: -4 } },
            }}
          >
            <Row crossAxisAlignment="center">
              {/* 客服 */}
              <InkWell onTap={() => {}}>
                <Column crossAxisAlignment="center" padding={{ right: 16 }}>
                  <Icon name="headset_mic" size={22} color={C.textSub} />
                  <Text text="客服" fontSize={10} color={C.textSub} />
                </Column>
              </InkWell>
              {/* 收藏 */}
              <InkWell onTap={() => {}}>
                <Column crossAxisAlignment="center" padding={{ right: 20 }}>
                  <Icon name="favorite_border" size={22} color={C.textSub} />
                  <Text text="收藏" fontSize={10} color={C.textSub} />
                </Column>
              </InkWell>
              <Expanded>
                <Row>
                  {/* 加入购物车 */}
                  <Expanded>
                    <InkWell onTap={handleAddToCart}>
                      <Container
                        height={48}
                        decoration={{
                          color: added ? "#52C41A" : C.primary + "18",
                          borderRadius: { topLeft: 24, bottomLeft: 24 },
                        }}
                        alignment="center"
                      >
                        <Text
                          text={added ? "✓ 已加入" : "加入购物车"}
                          fontSize={14}
                          fontWeight="bold"
                          color={added ? "white" : C.primary}
                        />
                      </Container>
                    </InkWell>
                  </Expanded>
                  {/* 立即购买 */}
                  <Expanded>
                    <InkWell onTap={handleBuyNow}>
                      <Container
                        height={48}
                        decoration={{
                          color: C.accent,
                          borderRadius: { topRight: 24, bottomRight: 24 },
                        }}
                        alignment="center"
                      >
                        <Text text="立即购买" fontSize={14} fontWeight="bold" color="white" />
                      </Container>
                    </InkWell>
                  </Expanded>
                </Row>
              </Expanded>
            </Row>
          </Container>
        </Column>
      </SafeArea>
    </Container>
  );
}
