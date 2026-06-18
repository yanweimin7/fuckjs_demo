import type { TranslationResources } from "fuickjs";

/** Demo 多语言资源（en / zh-CN） */
export const i18nResources: Record<string, TranslationResources> = {
  en: {
    demo: {
      title: "i18n Demo",
      subtitle:
        "Translations resolve in JS before DSL; Flutter only renders final strings.",
      currentLocale: "Current locale: {locale}",
      greeting: "Hello, {name}!",
      switchEn: "English",
      switchZh: "中文",
      pluralTitle: "Plural (count)",
      cart: {
        items: {
          zero: "No items in cart",
          one: "{count} item in cart",
          other: "{count} items in cart",
        },
      },
      addItem: "Add item",
      removeItem: "Remove item",
      nestedTitle: "Nested keys",
      nestedSample: "Welcome to FuickJS",
      interpolationTitle: "Interpolation",
      switchTitle: "Switch language",
      persistHint: "Language choice is persisted via LocalStorage.",
    },
  },
  "zh-CN": {
    demo: {
      title: "多语言演示",
      subtitle: "文案在 JS 层翻译后再生成 DSL，Flutter 只渲染最终字符串。",
      currentLocale: "当前语言：{locale}",
      greeting: "你好，{name}！",
      switchEn: "English",
      switchZh: "中文",
      pluralTitle: "复数 (count)",
      cart: {
        items: {
          zero: "购物车为空",
          one: "购物车有 {count} 件商品",
          other: "购物车有 {count} 件商品",
        },
      },
      addItem: "加一件",
      removeItem: "减一件",
      nestedTitle: "嵌套 key",
      nestedSample: "欢迎使用 FuickJS",
      interpolationTitle: "插值",
      switchTitle: "切换语言",
      persistHint: "语言选择会通过 LocalStorage 持久化。",
    },
  },
};
