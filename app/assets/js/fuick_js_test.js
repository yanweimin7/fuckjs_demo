var process=process||{env:{NODE_ENV:"development"}};
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
  var import_react4 = __toESM(require_react());
  var import_fuick_js_framework4 = __toESM(require_fuick_js_framework());

  // src/pages/test1.tsx
  var import_react = __toESM(require_react());
  var import_fuick_js_framework = __toESM(require_fuick_js_framework());
  var TestPage1 = () => {
    return /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Container, { color: "#f0f2f5" }, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Center, null, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Column, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Text, { text: "Test Page 1", fontSize: 24, color: "#1a1a1a" }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Text, { text: "This is a page from the new test project.", fontSize: 16, color: "#666666", padding: { top: 10, bottom: 20 } }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Button, { text: "Click Me", onTap: () => import_fuick_js_framework.Navigator.push("/test2", {}) }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Container, { height: 10 }), /* @__PURE__ */ import_react.default.createElement(import_fuick_js_framework.Button, { text: "Node Operations Demo", onTap: () => import_fuick_js_framework.Navigator.push("/demo_ops", {}) }))));
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

  // src/app.ts
  function initApp() {
    import_fuick_js_framework4.Runtime.bindGlobals();
    import_fuick_js_framework4.Router.register("/", (params) => import_react4.default.createElement(TestPage1, params));
    import_fuick_js_framework4.Router.register("/test2", (params) => import_react4.default.createElement(TestPage2, params));
    import_fuick_js_framework4.Router.register("/demo_ops", (params) => import_react4.default.createElement(DemoOpsPage, params));
  }

  // src/index.ts
  initApp();
})();
//# sourceMappingURL=fuick_js_test.js.map
