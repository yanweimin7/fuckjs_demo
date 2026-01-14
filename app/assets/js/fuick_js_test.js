var process=process||{env:{NODE_ENV:"production"}};if(typeof console==="undefined"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // globals:react
  var require_react = __commonJS({
    "globals:react"(exports, module) {
      module.exports = globalThis.React;
    }
  });

  // globals:fuick_js_framework
  var require_fuick_js_framework = __commonJS({
    "globals:fuick_js_framework"(exports, module) {
      module.exports = globalThis.FuickFramework;
    }
  });

  // src/app.ts
  var import_react9 = __toESM(require_react());
  var import_fuick_js_framework9 = __toESM(require_fuick_js_framework());

  // src/pages/test1.tsx
  var import_react = __toESM(require_react());
  var import_fuick_js_framework = __toESM(require_fuick_js_framework());
  var TestPage1 = () => {
    return /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Container, { color: "#f0f2f5" }, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Center, null, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Column, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Text, { text: "Test Page 1", fontSize: 24, color: "#1a1a1a" }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Text, { text: "This is a page from the new test project.", fontSize: 16, color: "#666666", padding: { top: 10, bottom: 20 } }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Button, { text: "Click Me", onTap: () => import_fuick_js_framework.Navigator.push("/test2", {}) }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Container, { height: 10 }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Button, { text: "Node Operations Demo", onTap: () => import_fuick_js_framework.Navigator.push("/demo_ops", {}) }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Container, { height: 10 }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Button, { text: "Wallet App Demo", onTap: () => import_fuick_js_framework.Navigator.push("/wallet", {}) }))));
  };

  // src/pages/test2.tsx
  var import_react2 = __toESM(require_react());
  var import_fuick_js_framework2 = __toESM(require_fuick_js_framework());
  var TestPage2 = () => {
    const [count, setCount] = (0, import_react2.useState)(0);
    return /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Container, { color: "#e3f2fd" }, /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Center, null, /* @__PURE__ */ import_react2.default.createElement(
      import_fuick_js_framework2.Container,
      {
        padding: 30,
        color: "#ffffff",
        borderRadius: 20
      },
      /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Column, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Text, { text: "Interactive Test Page", fontSize: 20, color: "#1976d2", padding: { bottom: 20 } }), /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Text, { text: String(count), fontSize: 48, color: "#0d47a1" }), /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.GestureDetector, { onTap: () => setCount(count + 1) }, /* @__PURE__ */ import_react2.default.createElement(
        import_fuick_js_framework2.Container,
        {
          padding: { left: 40, right: 40, top: 15, bottom: 15 },
          color: "#2196f3",
          borderRadius: 30,
          margin: { top: 30 }
        },
        /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Text, { text: "Tap to Increase", color: "#ffffff", fontSize: 18 })
      )), /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.GestureDetector, { onTap: () => setCount(0) }, /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Padding, { padding: { top: 20 } }, /* @__PURE__ */ import_react2.default.createElement(import_fuick_js_framework2.Text, { text: "Reset Counter", color: "#9e9e9e", fontSize: 14 }))))
    )));
  };

  // src/pages/demo_ops.tsx
  var import_react3 = __toESM(require_react());
  var import_fuick_js_framework3 = __toESM(require_fuick_js_framework());
  var DemoOpsPage = () => {
    const [items, setItems] = (0, import_react3.useState)([
      { id: 1, text: "\u9879\u76EE 1" },
      { id: 2, text: "\u9879\u76EE 2" }
    ]);
    const addItem = () => {
      const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      const newItems = [...items, { id: newId, text: `\u9879\u76EE ${newId}` }];
      setItems(newItems);
    };
    const deleteItem = (id) => {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
    };
    const updateItem = (id) => {
      const newItems = items.map(
        (item) => item.id === id ? { ...item, text: `${item.text} (\u5DF2\u66F4\u65B0)` } : item
      );
      setItems(newItems);
    };
    const reverseItems = () => {
      const newItems = [...items].reverse();
      setItems(newItems);
    };
    const shuffleItems = () => {
      const newItems = [...items].sort(() => Math.random() - 0.5);
      setItems(newItems);
    };
    return /* @__PURE__ */ import_react3.default.createElement(
      import_fuick_js_framework3.Scaffold,
      {
        appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.AppBar, { title: /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Text, { text: "\u8282\u70B9\u64CD\u4F5C\u6F14\u793A" }) }),
        body: /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Padding, { padding: { all: 16 } }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Text, { text: "\u5217\u8868\u9879", fontSize: 20, fontWeight: "bold" }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Row, null, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Button, { text: "\u53CD\u8F6C", onTap: reverseItems }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Container, { width: 8 }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Button, { text: "\u6253\u4E71", onTap: shuffleItems }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Container, { width: 8 }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Button, { text: "\u6DFB\u52A0", onTap: addItem }))), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Divider, { height: 20 }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Column, null, items.map((item) => /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Container, { key: item.id, padding: { top: 8, bottom: 8 } }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Text, { text: item.text, fontSize: 16 }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Row, null, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Button, { text: "\u66F4\u65B0", onTap: () => updateItem(item.id) }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Container, { width: 8 }), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Button, { text: "\u5220\u9664", onTap: () => deleteItem(item.id) }))), /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Divider, null)))), items.length === 0 && /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Center, null, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Padding, { padding: { top: 40 } }, /* @__PURE__ */ import_react3.default.createElement(import_fuick_js_framework3.Text, { text: "\u5217\u8868\u4E3A\u7A7A", color: "#999999" })))))
      }
    );
  };

  // src/pages/wallet_app.tsx
  var import_react8 = __toESM(require_react());
  var import_fuick_js_framework8 = __toESM(require_fuick_js_framework());

  // src/pages/wallet/tabs/HomeTab.tsx
  var import_react4 = __toESM(require_react());
  var import_fuick_js_framework4 = __toESM(require_fuick_js_framework());
  var ASSETS = [
    { id: "eth", symbol: "ETH", name: "Ethereum", balance: "1.25", value: "2,845.62", change: "+2.4%", icon: "currency_exchange", color: "#627EEA" },
    { id: "btc", symbol: "BTC", name: "Bitcoin", balance: "0.045", value: "1,920.15", change: "-1.2%", icon: "currency_bitcoin", color: "#F7931A" },
    { id: "usdt", symbol: "USDT", name: "Tether", balance: "1,250.00", value: "1,250.00", change: "0.0%", icon: "attach_money", color: "#26A17B" },
    { id: "sol", symbol: "SOL", name: "Solana", balance: "25.4", value: "2,415.80", change: "+5.7%", icon: "wb_sunny", color: "#14F195" }
  ];
  var BANNERS = [
    { id: 1, title: "New Layer 2 Scaling", subtitle: "Experience faster transactions with lower fees", color: "#3D7EFF", icon: "speed" },
    { id: 2, title: "DeFi Summer is Back", subtitle: "Earn up to 15% APY on your stablecoins", color: "#00C853", icon: "trending_up" },
    { id: 3, title: "NFT Marketplace Live", subtitle: "Discover rare digital collectibles today", color: "#9159FF", icon: "auto_awesome" }
  ];
  var ActionButton = ({ icon, label, color = "#3D7EFF" }) => /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, null, /* @__PURE__ */ import_react4.default.createElement(
    import_fuick_js_framework4.Container,
    {
      width: 60,
      height: 60,
      decoration: {
        color: `${color}15`,
        // 15% opacity
        borderRadius: 18
      }
    },
    /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Center, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: icon, color, size: 28 }))
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 8 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: label, fontSize: 13, color: "#333333", fontWeight: "w500" }));
  var AssetItem = ({ symbol, name, balance, value, change, icon, color }) => /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { margin: { bottom: 12 }, padding: { all: 16 }, decoration: { color: "#F8F9FB", borderRadius: 16 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(
    import_fuick_js_framework4.Container,
    {
      width: 44,
      height: 44,
      decoration: { color, borderRadius: 22 }
    },
    /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Center, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: icon, color: "#FFFFFF", size: 24 }))
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 12 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Expanded, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: symbol, fontSize: 17, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: name, fontSize: 13, color: "#9A9FA5" }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: balance, fontSize: 17, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: `$${value}`, fontSize: 13, color: "#9A9FA5" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 4 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuick_js_framework4.Text,
    {
      text: change,
      fontSize: 12,
      color: change.startsWith("+") ? "#00C853" : "#FF3D00",
      fontWeight: "bold"
    }
  )))));
  var HomeTab = () => {
    const [currentBannerIndex, setCurrentBannerIndex] = import_react4.default.useState(0);
    const pageViewRef = import_react4.default.useRef(null);
    import_react4.default.useEffect(() => {
      const timer = setInterval(() => {
        const next = (currentBannerIndex + 1) % BANNERS.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(next);
        }
      }, 4e3);
      return () => {
        clearInterval(timer);
      };
    }, [currentBannerIndex]);
    return /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.ListView, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Padding, { padding: { left: 20, right: 20, top: 10, bottom: 20 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "stretch" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 140, margin: { bottom: 24 } }, /* @__PURE__ */ import_react4.default.createElement(
      import_fuick_js_framework4.PageView,
      {
        ref: pageViewRef,
        initialPage: currentBannerIndex,
        id: 1001,
        onPageChanged: (index) => setCurrentBannerIndex(index)
      },
      BANNERS.map((banner) => /* @__PURE__ */ import_react4.default.createElement(
        import_fuick_js_framework4.Container,
        {
          key: banner.id,
          padding: { all: 20 },
          decoration: {
            color: banner.color,
            borderRadius: 20
          }
        },
        /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Expanded, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "start", mainAxisAlignment: "center" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: banner.title, color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 8 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: banner.subtitle, color: "#FFFFFFCC", fontSize: 13 }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 12 }), /* @__PURE__ */ import_react4.default.createElement(
          import_fuick_js_framework4.Container,
          {
            width: 56,
            height: 56,
            decoration: { color: "#FFFFFF20", borderRadius: 28 }
          },
          /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Center, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: banner.icon, color: "#FFFFFF", size: 32 }))
        ))
      ))
    )), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Stack, null, /* @__PURE__ */ import_react4.default.createElement(
      import_fuick_js_framework4.Container,
      {
        height: 200,
        decoration: {
          color: "#1A1D1F",
          borderRadius: 24
        }
      },
      /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Padding, { padding: { all: 24 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "start", mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 32, height: 32, decoration: { color: "#FFFFFF20", borderRadius: 16 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Center, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: "wallet", color: "#FFFFFF", size: 18 }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 10 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "Primary Wallet", color: "#FFFFFF", fontSize: 15 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: "expand_more", color: "#FFFFFF", size: 16 })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: "qr_code_scanner", color: "#FFFFFF", size: 24 })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "Total Balance", color: "#9A9FA5", fontSize: 14 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 8 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "$", color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 4 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "12,845.62", color: "#FFFFFF", fontSize: 36, fontWeight: "bold" }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(
        import_fuick_js_framework4.Container,
        {
          padding: { horizontal: 12, vertical: 6 },
          decoration: { color: "#00C85320", borderRadius: 20 }
        },
        /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: "trending_up", color: "#00C853", size: 14 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 4 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "+2.45%", color: "#00C853", fontSize: 13, fontWeight: "bold" }))
      ), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "0x71C...3E21", color: "#9A9FA5", fontSize: 13 }))))
    ), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Positioned, { top: 0, right: 0 }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 80, height: 80, decoration: { color: "#3D7EFF20", borderRadius: 40 } }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 28 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { mainAxisAlignment: "spaceAround" }, /* @__PURE__ */ import_react4.default.createElement(ActionButton, { icon: "send", label: "Send", color: "#3D7EFF" }), /* @__PURE__ */ import_react4.default.createElement(ActionButton, { icon: "call_received", label: "Receive", color: "#00C853" }), /* @__PURE__ */ import_react4.default.createElement(ActionButton, { icon: "add_shopping_cart", label: "Buy", color: "#FFB016" }), /* @__PURE__ */ import_react4.default.createElement(ActionButton, { icon: "multiple_stop", label: "Swap", color: "#9159FF" })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 36 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, null, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "Assets", fontSize: 20, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { width: 8 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { padding: { horizontal: 8, vertical: 2 }, decoration: { color: "#F0F3F6", borderRadius: 6 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "4", fontSize: 12, fontWeight: "bold", color: "#6F767E" }))), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "Edit", color: "#3D7EFF", fontSize: 15, fontWeight: "bold" })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 16 }), ASSETS.map((asset) => /* @__PURE__ */ import_react4.default.createElement(AssetItem, { key: asset.id, ...asset })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { padding: { all: 20 }, decoration: { color: "#F0F3F6", borderRadius: 20 } }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "Recent Activity", fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Container, { height: 4 }), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Text, { text: "You received 0.5 ETH from 0x...", fontSize: 13, color: "#6F767E" })), /* @__PURE__ */ import_react4.default.createElement(import_fuick_js_framework4.Icon, { name: "chevron_right", color: "#6F767E" }))))));
  };

  // src/pages/wallet/tabs/MarketTab.tsx
  var import_react5 = __toESM(require_react());
  var import_fuick_js_framework5 = __toESM(require_fuick_js_framework());
  var MARKET_DATA = [
    { id: "1", symbol: "BTC", name: "Bitcoin", price: "$42,568.20", change: "-1.25%", trend: "down", volume: "24.5B" },
    { id: "2", symbol: "ETH", name: "Ethereum", price: "$2,276.50", change: "+2.40%", trend: "up", volume: "12.1B" },
    { id: "3", symbol: "BNB", name: "Binance", price: "$312.45", change: "+0.85%", trend: "up", volume: "1.2B" },
    { id: "4", symbol: "SOL", name: "Solana", price: "$95.20", change: "+5.72%", trend: "up", volume: "3.4B" },
    { id: "5", symbol: "XRP", name: "Ripple", price: "$0.52", change: "-0.45%", trend: "down", volume: "800M" },
    { id: "6", symbol: "ADA", name: "Cardano", price: "$0.48", change: "+1.12%", trend: "up", volume: "400M" },
    { id: "7", symbol: "DOT", name: "Polkadot", price: "$6.85", change: "-2.34%", trend: "down", volume: "200M" },
    { id: "8", symbol: "AVAX", name: "Avalanche", price: "$32.15", change: "+4.21%", trend: "up", volume: "600M" }
  ];
  var MarketItem = ({ symbol, name, price, change, trend, volume }) => /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { padding: { vertical: 16 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { width: 40, height: 40, decoration: { color: "#F0F3F6", borderRadius: 12 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Center, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: symbol[0], fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }))), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { width: 12 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: symbol, fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: name, fontSize: 12, color: "#9A9FA5" }))), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { width: 60, height: 30 }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Center, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Icon, { name: "show_chart", color: trend === "up" ? "#00C85330" : "#FF3D0030", size: 32 }))), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: price, fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: `Vol ${volume}`, fontSize: 11, color: "#9A9FA5" }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { width: 8 }), /* @__PURE__ */ import_react5.default.createElement(
    import_fuick_js_framework5.Container,
    {
      padding: { horizontal: 6, vertical: 2 },
      decoration: { color: trend === "up" ? "#00C85315" : "#FF3D0015", borderRadius: 4 }
    },
    /* @__PURE__ */ import_react5.default.createElement(
      import_fuick_js_framework5.Text,
      {
        text: change,
        fontSize: 12,
        fontWeight: "bold",
        color: trend === "up" ? "#00C853" : "#FF3D00"
      }
    )
  )))), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 16 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Divider, null));
  var CategoryPill = ({ label, active }) => /* @__PURE__ */ import_react5.default.createElement(
    import_fuick_js_framework5.Container,
    {
      padding: { horizontal: 16, vertical: 8 },
      margin: { right: 8 },
      decoration: {
        color: active ? "#1A1D1F" : "#F0F3F6",
        borderRadius: 12
      }
    },
    /* @__PURE__ */ import_react5.default.createElement(
      import_fuick_js_framework5.Text,
      {
        text: label,
        fontSize: 14,
        fontWeight: active ? "bold" : "normal",
        color: active ? "#FFFFFF" : "#6F767E"
      }
    )
  );
  var MarketTab = () => {
    const [searchText, setSearchText] = import_react5.default.useState("");
    return /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.ListView, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Padding, { padding: { all: 20 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Column, { crossAxisAlignment: "stretch" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: "Market Insights", fontSize: 24, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 20 }), /* @__PURE__ */ import_react5.default.createElement(
      import_fuick_js_framework5.Container,
      {
        padding: { horizontal: 16, vertical: 4 },
        decoration: { color: "#F0F3F6", borderRadius: 16 }
      },
      /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Icon, { name: "search", color: "#9A9FA5", size: 20 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { width: 10 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Expanded, null, /* @__PURE__ */ import_react5.default.createElement(
        import_fuick_js_framework5.TextField,
        {
          hintText: "Search crypto assets...",
          onChanged: (v) => setSearchText(v)
        }
      )))
    ), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 40 }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.ListView, { scrollDirection: "horizontal" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, null, /* @__PURE__ */ import_react5.default.createElement(CategoryPill, { label: "All", active: true }), /* @__PURE__ */ import_react5.default.createElement(CategoryPill, { label: "Layer 1", active: false }), /* @__PURE__ */ import_react5.default.createElement(CategoryPill, { label: "DeFi", active: false }), /* @__PURE__ */ import_react5.default.createElement(CategoryPill, { label: "Gaming", active: false }), /* @__PURE__ */ import_react5.default.createElement(CategoryPill, { label: "NFTs", active: false })))), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: "Asset / 24h Volume", fontSize: 13, color: "#9A9FA5", fontWeight: "bold" }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Text, { text: "Price / Change", fontSize: 13, color: "#9A9FA5", fontWeight: "bold" })), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Container, { height: 8 }), /* @__PURE__ */ import_react5.default.createElement(import_fuick_js_framework5.Divider, null), MARKET_DATA.filter(
      (item) => item.symbol.toLowerCase().includes(searchText.toLowerCase()) || item.name.toLowerCase().includes(searchText.toLowerCase())
    ).map((item) => /* @__PURE__ */ import_react5.default.createElement(MarketItem, { key: item.id, ...item })))));
  };

  // src/pages/wallet/tabs/TradeTab.tsx
  var import_react6 = __toESM(require_react());
  var import_fuick_js_framework6 = __toESM(require_fuick_js_framework());
  var TradeInput = ({ label, balance, amount, symbol, icon, color }) => /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { padding: { all: 20 }, decoration: { color: "#F8F9FB", borderRadius: 20 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: label, color: "#6F767E", fontSize: 14, fontWeight: "bold" }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: `Balance: ${balance}`, color: "#9A9FA5", fontSize: 12 })), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 16 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: amount, fontSize: 28, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react6.default.createElement(
    import_fuick_js_framework6.Container,
    {
      padding: { horizontal: 12, vertical: 8 },
      decoration: { color: "#FFFFFF", borderRadius: 12 }
    },
    /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { width: 24, height: 24, decoration: { color, borderRadius: 12 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Center, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: icon, color: "#FFFFFF", size: 14 }))), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { width: 8 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: symbol, fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: "expand_more", color: "#1A1D1F" }))
  )));
  var TradeTab = () => {
    return /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Padding, { padding: { all: 20 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Column, { crossAxisAlignment: "stretch" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "Swap Assets", fontSize: 24, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: "settings", color: "#6F767E" })), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 24 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Stack, { alignment: "center" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Column, null, /* @__PURE__ */ import_react6.default.createElement(
      TradeInput,
      {
        label: "From",
        balance: "1.25 ETH",
        amount: "0.5",
        symbol: "ETH",
        icon: "currency_exchange",
        color: "#627EEA"
      }
    ), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 8 }), /* @__PURE__ */ import_react6.default.createElement(
      TradeInput,
      {
        label: "To (Estimated)",
        balance: "0 USDT",
        amount: "1,138.25",
        symbol: "USDT",
        icon: "attach_money",
        color: "#26A17B"
      }
    )), /* @__PURE__ */ import_react6.default.createElement(
      import_fuick_js_framework6.Container,
      {
        width: 44,
        height: 44,
        decoration: {
          color: "#FFFFFF",
          borderRadius: 22
        }
      },
      /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Center, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: "swap_vert", color: "#3D7EFF", size: 24 }))
    )), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 24 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { padding: { all: 16 }, decoration: { color: "#F0F3F650", borderRadius: 16 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Column, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "Price Impact", color: "#6F767E", fontSize: 13 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "< 0.01%", color: "#00C853", fontSize: 13, fontWeight: "bold" })), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 12 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "Network Fee", color: "#6F767E", fontSize: 13 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: "local_gas_station", color: "#6F767E", size: 14 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { width: 4 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "$2.45", color: "#1A1D1F", fontSize: 13, fontWeight: "bold" }))), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 12 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "Minimum Received", color: "#6F767E", fontSize: 13 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "1,132.50 USDT", color: "#1A1D1F", fontSize: 13, fontWeight: "bold" })))), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 32 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 60 }, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Button, { text: "Confirm Swap" })), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { height: 16 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Center, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Icon, { name: "info", color: "#9A9FA5", size: 14 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Container, { width: 6 }), /* @__PURE__ */ import_react6.default.createElement(import_fuick_js_framework6.Text, { text: "Quotes update every 5s", color: "#9A9FA5", fontSize: 12 })))));
  };

  // src/pages/wallet/tabs/AssetsTab.tsx
  var import_react7 = __toESM(require_react());
  var import_fuick_js_framework7 = __toESM(require_fuick_js_framework());
  var ChainBalanceItem = ({ name, value, percentage, icon, color }) => /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { margin: { bottom: 12 }, padding: { all: 16 }, decoration: { color: "#F8F9FB", borderRadius: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { width: 36, height: 36, decoration: { color: `${color}15`, borderRadius: 10 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Center, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Icon, { name: icon, color, size: 20 }))), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { width: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: name, fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: `${percentage} of total`, fontSize: 12, color: "#9A9FA5" }))), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: value, fontSize: 16, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Icon, { name: "chevron_right", color: "#9A9FA5", size: 18 }))));
  var AssetsTab = () => {
    return /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.ListView, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Padding, { padding: { all: 20 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Column, { crossAxisAlignment: "stretch" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Portfolio", fontSize: 24, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 20 }), /* @__PURE__ */ import_react7.default.createElement(
      import_fuick_js_framework7.Container,
      {
        padding: { all: 24 },
        decoration: {
          color: "#3D7EFF",
          borderRadius: 24
        }
      },
      /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Net Worth", color: "#FFFFFFBF", fontSize: 15 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { padding: { horizontal: 8, vertical: 4 }, decoration: { color: "#FFFFFF20", borderRadius: 8 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "All Chains", color: "#FFFFFF", fontSize: 11, fontWeight: "bold" }))), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "$12,845.62", color: "#FFFFFF", fontSize: 32, fontWeight: "bold" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Expanded, { flex: 6 }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 6, decoration: { color: "#627EEA", borderRadius: 3 } })), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { width: 4 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Expanded, { flex: 3 }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 6, decoration: { color: "#F7931A", borderRadius: 3 } })), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { width: 4 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Expanded, { flex: 1 }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 6, decoration: { color: "#14F195", borderRadius: 3 } }))))
    ), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 32 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Distribution by Chain", fontSize: 18, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Icon, { name: "pie_chart", color: "#3D7EFF", size: 20 })), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 16 }), /* @__PURE__ */ import_react7.default.createElement(
      ChainBalanceItem,
      {
        name: "Ethereum",
        value: "$8,240.15",
        percentage: "64%",
        icon: "link",
        color: "#627EEA"
      }
    ), /* @__PURE__ */ import_react7.default.createElement(
      ChainBalanceItem,
      {
        name: "Bitcoin",
        value: "$1,920.15",
        percentage: "15%",
        icon: "currency_bitcoin",
        color: "#F7931A"
      }
    ), /* @__PURE__ */ import_react7.default.createElement(
      ChainBalanceItem,
      {
        name: "Solana",
        value: "$2,415.80",
        percentage: "19%",
        icon: "wb_sunny",
        color: "#14F195"
      }
    ), /* @__PURE__ */ import_react7.default.createElement(
      ChainBalanceItem,
      {
        name: "Polygon",
        value: "$269.52",
        percentage: "2%",
        icon: "layers",
        color: "#8247E5"
      }
    ), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Security Status", fontSize: 18, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { height: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { padding: { all: 16 }, decoration: { color: "#00C85310", borderRadius: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Icon, { name: "verified_user", color: "#00C853", size: 24 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Container, { width: 12 }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Expanded, null, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Wallet Protected", fontSize: 15, fontWeight: "bold", color: "#1A1D1F" }), /* @__PURE__ */ import_react7.default.createElement(import_fuick_js_framework7.Text, { text: "Your seed phrase is backed up", fontSize: 13, color: "#6F767E" }))))))));
  };

  // src/pages/wallet_app.tsx
  var TabItem = ({ title, icon, active, onTap }) => /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Expanded, null, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.GestureDetector, { onTap }, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Container, { padding: { top: 8, bottom: 8 } }, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Column, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Icon, { name: icon, color: active ? "#3D7EFF" : "#9BA3AF", size: 24 }), /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Container, { height: 4 }), /* @__PURE__ */ import_react8.default.createElement(
    import_fuick_js_framework8.Text,
    {
      text: title,
      fontSize: 12,
      color: active ? "#3D7EFF" : "#9BA3AF",
      fontWeight: active ? "bold" : "normal"
    }
  )))));
  var WalletAppPage = () => {
    const [activeTab, setActiveTab] = (0, import_react8.useState)("home");
    const renderBody = () => {
      switch (activeTab) {
        case "home":
          return /* @__PURE__ */ import_react8.default.createElement(HomeTab, null);
        case "market":
          return /* @__PURE__ */ import_react8.default.createElement(MarketTab, null);
        case "trade":
          return /* @__PURE__ */ import_react8.default.createElement(TradeTab, null);
        case "assets":
          return /* @__PURE__ */ import_react8.default.createElement(AssetsTab, null);
        default:
          return /* @__PURE__ */ import_react8.default.createElement(HomeTab, null);
      }
    };
    const getTitle = () => {
      switch (activeTab) {
        case "home":
          return "Fuick Wallet";
        case "market":
          return "Markets";
        case "trade":
          return "Swap";
        case "assets":
          return "Portfolio";
        default:
          return "Wallet";
      }
    };
    return /* @__PURE__ */ import_react8.default.createElement(
      import_fuick_js_framework8.Scaffold,
      {
        backgroundColor: "#FFFFFF",
        appBar: /* @__PURE__ */ import_react8.default.createElement(
          import_fuick_js_framework8.AppBar,
          {
            title: /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Text, { text: getTitle(), fontSize: 18, fontWeight: "bold", color: "#1A1D1F" }),
            backgroundColor: "#FFFFFF",
            actions: [
              /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Padding, { padding: { right: 16 } }, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Icon, { name: "notifications_none", color: "#1A1D1F", size: 24 }))
            ]
          }
        ),
        body: /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Stack, null, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Positioned, { top: 0, left: 0, right: 0, bottom: 80 }, renderBody()), /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Positioned, { bottom: 0, left: 0, right: 0, height: 80 }, /* @__PURE__ */ import_react8.default.createElement(
          import_fuick_js_framework8.Container,
          {
            decoration: {
              color: "#FFFFFF"
            }
          },
          /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Column, null, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Container, { height: 1, decoration: { color: "#F0F3F6" } }), /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.SafeArea, null, /* @__PURE__ */ import_react8.default.createElement(import_fuick_js_framework8.Row, { mainAxisAlignment: "spaceAround" }, /* @__PURE__ */ import_react8.default.createElement(
            TabItem,
            {
              title: "\u9996\u9875",
              icon: "account_balance_wallet",
              active: activeTab === "home",
              onTap: () => setActiveTab("home")
            }
          ), /* @__PURE__ */ import_react8.default.createElement(
            TabItem,
            {
              title: "\u884C\u60C5",
              icon: "trending_up",
              active: activeTab === "market",
              onTap: () => setActiveTab("market")
            }
          ), /* @__PURE__ */ import_react8.default.createElement(
            TabItem,
            {
              title: "\u4EA4\u6613",
              icon: "swap_horizontal_circle",
              active: activeTab === "trade",
              onTap: () => setActiveTab("trade")
            }
          ), /* @__PURE__ */ import_react8.default.createElement(
            TabItem,
            {
              title: "\u8D44\u4EA7",
              icon: "pie_chart",
              active: activeTab === "assets",
              onTap: () => setActiveTab("assets")
            }
          ))))
        )))
      }
    );
  };

  // src/app.ts
  function initApp() {
    import_fuick_js_framework9.Runtime.bindGlobals();
    import_fuick_js_framework9.Router.register("/", (params) => import_react9.default.createElement(TestPage1, params));
    import_fuick_js_framework9.Router.register("/test2", (params) => import_react9.default.createElement(TestPage2, params));
    import_fuick_js_framework9.Router.register("/demo_ops", (params) => import_react9.default.createElement(DemoOpsPage, params));
    import_fuick_js_framework9.Router.register("/wallet", (params) => import_react9.default.createElement(WalletAppPage, params));
  }

  // src/index.ts
  initApp();
})();
