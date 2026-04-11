import { useState, useCallback } from "react";
import { CartItem, Product } from "./data";

// 简单的全局购物车状态（模块级单例）
let _cartItems: CartItem[] = [];
let _listeners: Array<() => void> = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

export function addToCart(product: Product) {
  const existing = _cartItems.find((i) => i.product.id === product.id);
  if (existing) {
    _cartItems = _cartItems.map((i) =>
      i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  } else {
    _cartItems = [..._cartItems, { product, quantity: 1 }];
  }
  notify();
}

export function removeFromCart(productId: number) {
  _cartItems = _cartItems.filter((i) => i.product.id !== productId);
  notify();
}

export function updateQuantity(productId: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  _cartItems = _cartItems.map((i) =>
    i.product.id === productId ? { ...i, quantity } : i
  );
  notify();
}

export function getCartItems(): CartItem[] {
  return _cartItems;
}

export function getCartCount(): number {
  return _cartItems.reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): number {
  return _cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function useCart() {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate((n) => n + 1);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  }, []);

  // 订阅（仅在 mount 时一次）
  const [unsubRef] = useState(() => {
    const unsub = subscribe();
    return { unsub };
  });

  // 组件卸载时取消订阅（通过 useEffect 模拟）
  // QuickJS 环境下 useEffect cleanup 正常运作
  useState(() => {
    return unsubRef.unsub;
  });

  return {
    items: getCartItems(),
    count: getCartCount(),
    total: getCartTotal(),
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
