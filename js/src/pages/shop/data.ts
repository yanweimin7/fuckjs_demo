export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  image: string;
  tag?: string;
  rating: number;
  sales: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "全部", icon: "apps", color: "#6C63FF" },
  { id: "phone", name: "手机", icon: "smartphone", color: "#FF6584" },
  { id: "computer", name: "电脑", icon: "laptop", color: "#43C6AC" },
  { id: "headphone", name: "耳机", icon: "headphones", color: "#F7971E" },
  { id: "watch", name: "手表", icon: "watch", color: "#5B86E5" },
  { id: "camera", name: "相机", icon: "camera_alt", color: "#FF8C00" },
  { id: "gaming", name: "游戏", icon: "sports_esports", color: "#CB2D3E" },
  { id: "tablet", name: "平板", icon: "tablet", color: "#11998E" },
];

export const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    title: "新品首发",
    subtitle: "限时优惠 · 满减进行中",
    color: "#1a1a2e",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    title: "品质优选",
    subtitle: "精选好物 · 品质保障",
    color: "#16213e",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    title: "年中大促",
    subtitle: "全场低至 5 折起",
    color: "#0f3460",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 1, category: "phone",
    name: "iPhone 15 Pro Max",
    desc: "钛金属设计 · A17 Pro 芯片 · 专业级摄影系统",
    price: 9999, originalPrice: 10999,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    tag: "新品", rating: 4.9, sales: 12800,
  },
  {
    id: 2, category: "phone",
    name: "Samsung Galaxy S24 Ultra",
    desc: "内置 S Pen · 2亿像素主摄 · 钛金属边框",
    price: 8999, originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    tag: "热销", rating: 4.8, sales: 9600,
  },
  {
    id: 3, category: "computer",
    name: "MacBook Pro 14\" M3 Pro",
    desc: "M3 Pro 芯片 · 18GB 统一内存 · 22小时续航",
    price: 14999, originalPrice: 16999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    tag: "立减2000", rating: 4.9, sales: 5400,
  },
  {
    id: 4, category: "headphone",
    name: "Sony WH-1000XM5",
    desc: "行业顶级降噪 · 30小时续航 · 轻盈折叠设计",
    price: 2299, originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    tag: "爆款", rating: 4.8, sales: 23100,
  },
  {
    id: 5, category: "watch",
    name: "Apple Watch Ultra 2",
    desc: "钛金属表壳 · 最精准的 GPS · 专业户外运动",
    price: 6299, originalPrice: 6799,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80",
    tag: "热卖", rating: 4.7, sales: 7800,
  },
  {
    id: 6, category: "camera",
    name: "Sony A7M4 全画幅微单",
    desc: "3300万像素 · 4K 60fps · 实时追踪对焦",
    price: 16999, originalPrice: 18999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    rating: 4.9, sales: 3200,
  },
  {
    id: 7, category: "gaming",
    name: "PlayStation 5 数字版",
    desc: "超高速 SSD · 光线追踪 · 3D Audio 体验",
    price: 3299, originalPrice: 3799,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    tag: "现货", rating: 4.8, sales: 15600,
  },
  {
    id: 8, category: "tablet",
    name: "iPad Pro 12.9\" M2",
    desc: "M2 芯片 · Liquid Retina XDR · Apple Pencil 支持",
    price: 8999, originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    tag: "优选", rating: 4.8, sales: 6700,
  },
  {
    id: 9, category: "headphone",
    name: "AirPods Pro 2代",
    desc: "自适应降噪 · 个性化空间音频 · 防汗防水",
    price: 1799, originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&q=80",
    tag: "秒杀", rating: 4.7, sales: 34500,
  },
  {
    id: 10, category: "computer",
    name: "Dell XPS 15 4K OLED",
    desc: "Intel i9 · 64GB DDR5 · RTX 4070 · OLED 触控屏",
    price: 17999, originalPrice: 19999,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    rating: 4.7, sales: 2100,
  },
];

export interface CartItem {
  product: Product;
  quantity: number;
}
