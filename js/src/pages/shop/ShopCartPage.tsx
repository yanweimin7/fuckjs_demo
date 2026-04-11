import React, { useState } from "react";
import {
  Column, Row, Container, Text, Image, Icon, SizedBox,
  InkWell, SafeArea, SingleChildScrollView, Expanded,
  Center, ClipRRect, useNavigator,
} from "fuickjs";
import { CartItem } from "./data";
import { getCartItems, getCartTotal, removeFromCart, updateQuantity } from "./store";

const C = {
  primary: "#6C63FF",
  accent: "#FF6584",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#1A1A2E",
  textSub: "#8A8FA3",
  divider: "#F0F0F5",
};

function EmptyCart({ onShop }: { onShop: () => void }) {
  return (
    <Center>
      <Column crossAxisAlignment="center" padding={40}>
        <Container
          width={100}
          height={100}
          decoration={{ color: C.primary + "12", borderRadius: 50 }}
          alignment="center"
        >
          <Icon name="shopping_cart" size={50} color={C.primary + "66"} />
        </Container>
        <SizedBox height={20} />
        <Text text="购物车空空如也" fontSize={18} fontWeight="bold" color={C.text} />
        <SizedBox height={8} />
        <Text text="快去挑选喜欢的商品吧～" fontSize={14} color={C.textSub} />
        <SizedBox height={28} />
        <InkWell onTap={onShop}>
          <Container
            padding={{ left: 32, right: 32, top: 14, bottom: 14 }}
            decoration={{ color: C.primary, borderRadius: 28 }}
          >
            <Text text="去逛逛" fontSize={15} fontWeight="bold" color="white" />
          </Container>
        </InkWell>
      </Column>
    </Center>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}) {
  return (
    <Container
      color={C.card}
      margin={{ bottom: 10 }}
      padding={16}
      decoration={{ color: C.card, borderRadius: 16 }}
    >
      <Row crossAxisAlignment="start">
        <ClipRRect borderRadius={12}>
          <Image src={item.product.image} width={80} height={80} fit="cover" />
        </ClipRRect>
        <SizedBox width={12} />
        <Expanded>
          <Column crossAxisAlignment="stretch">
            <Text
              text={item.product.name}
              fontSize={14}
              fontWeight="bold"
              color={C.text}
              maxLines={2}
              overflow="ellipsis"
            />
            <SizedBox height={4} />
            <Text text={item.product.desc} fontSize={12} color={C.textSub} maxLines={1} overflow="ellipsis" />
            <SizedBox height={10} />
            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
              <Row crossAxisAlignment="baseline">
                <Text text="¥" fontSize={13} fontWeight="bold" color={C.accent} />
                <Text text={`${item.product.price}`} fontSize={18} fontWeight="bold" color={C.accent} />
              </Row>
              {/* 数量控制 */}
              <Row crossAxisAlignment="center">
                <InkWell onTap={() => onUpdateQty(item.quantity - 1)}>
                  <Container
                    width={28}
                    height={28}
                    decoration={{ color: "#F5F5F5", borderRadius: 8 }}
                    alignment="center"
                  >
                    <Icon name="remove" size={14} color={item.quantity <= 1 ? "#CCCCCC" : C.text} />
                  </Container>
                </InkWell>
                <Container width={36} alignment="center">
                  <Text text={`${item.quantity}`} fontSize={16} fontWeight="bold" color={C.text} />
                </Container>
                <InkWell onTap={() => onUpdateQty(item.quantity + 1)}>
                  <Container
                    width={28}
                    height={28}
                    decoration={{ color: C.primary + "18", borderRadius: 8 }}
                    alignment="center"
                  >
                    <Icon name="add" size={14} color={C.primary} />
                  </Container>
                </InkWell>
              </Row>
            </Row>
          </Column>
        </Expanded>
        <InkWell onTap={onRemove}>
          <Container padding={4}>
            <Icon name="close" size={16} color={C.textSub} />
          </Container>
        </InkWell>
      </Row>
    </Container>
  );
}

export default function ShopCartPage() {
  const navigator = useNavigator();
  const [tick, setTick] = useState(0);

  function refresh() {
    setTick((n) => n + 1);
  }

  const items = getCartItems();
  const total = getCartTotal();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <Container color={C.bg}>
        <SafeArea>
          <Column crossAxisAlignment="stretch">
            {/* 顶栏 */}
            <Container
              color="white"
              padding={{ left: 16, right: 16, top: 14, bottom: 14 }}
            >
              <Row crossAxisAlignment="center">
                <InkWell onTap={() => navigator.pop()}>
                  <Container width={40} height={40} alignment="center">
                    <Icon name="arrow_back" size={22} color={C.text} />
                  </Container>
                </InkWell>
                <Expanded>
                  <Center>
                    <Text text="购物车" fontSize={18} fontWeight="bold" color={C.text} />
                  </Center>
                </Expanded>
                <Container width={40} />
              </Row>
            </Container>
            <Expanded>
              <EmptyCart onShop={() => navigator.pop()} />
            </Expanded>
          </Column>
        </SafeArea>
      </Container>
    );
  }

  return (
    <Container color={C.bg}>
      <SafeArea>
        <Column crossAxisAlignment="stretch">
          {/* 顶栏 */}
          <Container
            color="white"
            padding={{ left: 16, right: 16, top: 14, bottom: 14 }}
            decoration={{
              color: "white",
              boxShadow: { color: "#0000000A", blurRadius: 6, offset: { dx: 0, dy: 2 } },
            }}
          >
            <Row crossAxisAlignment="center">
              <InkWell onTap={() => navigator.pop()}>
                <Container width={40} height={40} alignment="center">
                  <Icon name="arrow_back" size={22} color={C.text} />
                </Container>
              </InkWell>
              <Expanded>
                <Center>
                  <Row crossAxisAlignment="center">
                    <Text text="购物车" fontSize={18} fontWeight="bold" color={C.text} />
                    <SizedBox width={6} />
                    <Container
                      padding={{ left: 8, right: 8, top: 2, bottom: 2 }}
                      decoration={{ color: C.accent, borderRadius: 10 }}
                    >
                      <Text text={`${count}`} fontSize={12} fontWeight="bold" color="white" />
                    </Container>
                  </Row>
                </Center>
              </Expanded>
              <InkWell onTap={() => {}}>
                <Container width={40} height={40} alignment="center">
                  <Text text="管理" fontSize={14} color={C.primary} />
                </Container>
              </InkWell>
            </Row>
          </Container>

          {/* 商品列表 */}
          <Expanded>
            <SingleChildScrollView>
              <Column crossAxisAlignment="stretch" padding={{ left: 12, right: 12, top: 12 }}>

                {/* 配送信息 */}
                <Container
                  color="white"
                  margin={{ bottom: 10 }}
                  padding={{ left: 16, right: 16, top: 12, bottom: 12 }}
                  decoration={{ color: "white", borderRadius: 16 }}
                >
                  <Row crossAxisAlignment="center">
                    <Icon name="local_shipping" size={18} color={C.primary} />
                    <SizedBox width={8} />
                    <Text text="包邮 · 预计明日送达" fontSize={13} color={C.text} />
                    <Expanded />
                    <Text text="更改地址" fontSize={12} color={C.primary} />
                    <Icon name="chevron_right" size={14} color={C.primary} />
                  </Row>
                </Container>

                {/* 商品列表 */}
                {items.map((item) => (
                  <CartItemRow
                    key={item.product.id}
                    item={item}
                    onRemove={() => { removeFromCart(item.product.id); refresh(); }}
                    onUpdateQty={(qty) => { updateQuantity(item.product.id, qty); refresh(); }}
                  />
                ))}

                {/* 推荐凑单 */}
                <Container
                  color="white"
                  margin={{ top: 4, bottom: 10 }}
                  padding={{ left: 16, right: 16, top: 14, bottom: 14 }}
                  decoration={{ color: "white", borderRadius: 16 }}
                >
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Text text="🎁 满 999 减 100，还差 ¥" fontSize={13} color={C.text} />
                    <InkWell onTap={() => navigator.pop()}>
                      <Container
                        padding={{ left: 12, right: 12, top: 6, bottom: 6 }}
                        decoration={{ color: C.accent + "18", borderRadius: 14 }}
                      >
                        <Text text="去凑单" fontSize={12} fontWeight="bold" color={C.accent} />
                      </Container>
                    </InkWell>
                  </Row>
                </Container>

                <Container height={100} />
              </Column>
            </SingleChildScrollView>
          </Expanded>

          {/* 底部结算栏 */}
          <Container
            color="white"
            padding={{ left: 20, right: 20, top: 14, bottom: 24 }}
            decoration={{
              color: "white",
              boxShadow: { color: "#0000001A", blurRadius: 12, offset: { dx: 0, dy: -4 } },
            }}
          >
            <Row crossAxisAlignment="center" mainAxisAlignment="spaceBetween">
              <Column crossAxisAlignment="start">
                <Row crossAxisAlignment="center">
                  <Text text="合计: " fontSize={14} color={C.textSub} />
                  <Text text="¥" fontSize={14} fontWeight="bold" color={C.accent} />
                  <Text text={`${total.toFixed(0)}`} fontSize={24} fontWeight="bold" color={C.accent} />
                </Row>
                <Text text={`共 ${count} 件商品 · 已优惠 ¥${items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0).toFixed(0)}`} fontSize={11} color={C.textSub} />
              </Column>
              <InkWell onTap={() => {}}>
                <Container
                  padding={{ left: 32, right: 32, top: 14, bottom: 14 }}
                  decoration={{ color: C.accent, borderRadius: 28 }}
                >
                  <Text text={`结算 (${count})`} fontSize={15} fontWeight="bold" color="white" />
                </Container>
              </InkWell>
            </Row>
          </Container>
        </Column>
      </SafeArea>
    </Container>
  );
}
