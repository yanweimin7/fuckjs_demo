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

  // ../js/node_modules/react/cjs/react.production.min.js
  var require_react_production_min = __commonJS({
    "../js/node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l = Symbol.for("react.element");
      var n = Symbol.for("react.portal");
      var p = Symbol.for("react.fragment");
      var q = Symbol.for("react.strict_mode");
      var r = Symbol.for("react.profiler");
      var t = Symbol.for("react.provider");
      var u = Symbol.for("react.context");
      var v = Symbol.for("react.forward_ref");
      var w = Symbol.for("react.suspense");
      var x = Symbol.for("react.memo");
      var y = Symbol.for("react.lazy");
      var z = Symbol.iterator;
      function A(a) {
        if (null === a || "object" !== typeof a) return null;
        a = z && a[z] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var B = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      var C = Object.assign;
      var D = {};
      function E(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      E.prototype.isReactComponent = {};
      E.prototype.setState = function(a, b) {
        if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a, b, "setState");
      };
      E.prototype.forceUpdate = function(a) {
        this.updater.enqueueForceUpdate(this, a, "forceUpdate");
      };
      function F() {
      }
      F.prototype = E.prototype;
      function G(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      var H = G.prototype = new F();
      H.constructor = G;
      C(H, E.prototype);
      H.isPureReactComponent = true;
      var I = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K = { current: null };
      var L = { key: true, ref: true, __self: true, __source: true };
      function M(a, b, e) {
        var d, c = {}, k = null, h = null;
        if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
        var g = arguments.length - 2;
        if (1 === g) c.children = e;
        else if (1 < g) {
          for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
          c.children = f;
        }
        if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
        return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
      }
      function N(a, b) {
        return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
      }
      function O(a) {
        return "object" === typeof a && null !== a && a.$$typeof === l;
      }
      function escape(a) {
        var b = { "=": "=0", ":": "=2" };
        return "$" + a.replace(/[=:]/g, function(a2) {
          return b[a2];
        });
      }
      var P = /\/+/g;
      function Q(a, b) {
        return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
      }
      function R(a, b, e, d, c) {
        var k = typeof a;
        if ("undefined" === k || "boolean" === k) a = null;
        var h = false;
        if (null === a) h = true;
        else switch (k) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a.$$typeof) {
              case l:
              case n:
                h = true;
            }
        }
        if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
          return a2;
        })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
        h = 0;
        d = "" === d ? "." : d + ":";
        if (I(a)) for (var g = 0; g < a.length; g++) {
          k = a[g];
          var f = d + Q(k, g);
          h += R(k, b, e, f, c);
        }
        else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
        else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
        return h;
      }
      function S(a, b, e) {
        if (null == a) return a;
        var d = [], c = 0;
        R(a, d, "", "", function(a2) {
          return b.call(e, a2, c++);
        });
        return d;
      }
      function T(a) {
        if (-1 === a._status) {
          var b = a._result;
          b = b();
          b.then(function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
          }, function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
          });
          -1 === a._status && (a._status = 0, a._result = b);
        }
        if (1 === a._status) return a._result.default;
        throw a._result;
      }
      var U = { current: null };
      var V = { transition: null };
      var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
      function X() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      exports.Children = { map: S, forEach: function(a, b, e) {
        S(a, function() {
          b.apply(this, arguments);
        }, e);
      }, count: function(a) {
        var b = 0;
        S(a, function() {
          b++;
        });
        return b;
      }, toArray: function(a) {
        return S(a, function(a2) {
          return a2;
        }) || [];
      }, only: function(a) {
        if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
      } };
      exports.Component = E;
      exports.Fragment = p;
      exports.Profiler = r;
      exports.PureComponent = G;
      exports.StrictMode = q;
      exports.Suspense = w;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
      exports.act = X;
      exports.cloneElement = function(a, b, e) {
        if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
        var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
        if (null != b) {
          void 0 !== b.ref && (k = b.ref, h = K.current);
          void 0 !== b.key && (c = "" + b.key);
          if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
          for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
        }
        var f = arguments.length - 2;
        if (1 === f) d.children = e;
        else if (1 < f) {
          g = Array(f);
          for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
          d.children = g;
        }
        return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
      };
      exports.createContext = function(a) {
        a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
        a.Provider = { $$typeof: t, _context: a };
        return a.Consumer = a;
      };
      exports.createElement = M;
      exports.createFactory = function(a) {
        var b = M.bind(null, a);
        b.type = a;
        return b;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a) {
        return { $$typeof: v, render: a };
      };
      exports.isValidElement = O;
      exports.lazy = function(a) {
        return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
      };
      exports.memo = function(a, b) {
        return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
      };
      exports.startTransition = function(a) {
        var b = V.transition;
        V.transition = {};
        try {
          a();
        } finally {
          V.transition = b;
        }
      };
      exports.unstable_act = X;
      exports.useCallback = function(a, b) {
        return U.current.useCallback(a, b);
      };
      exports.useContext = function(a) {
        return U.current.useContext(a);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a) {
        return U.current.useDeferredValue(a);
      };
      exports.useEffect = function(a, b) {
        return U.current.useEffect(a, b);
      };
      exports.useId = function() {
        return U.current.useId();
      };
      exports.useImperativeHandle = function(a, b, e) {
        return U.current.useImperativeHandle(a, b, e);
      };
      exports.useInsertionEffect = function(a, b) {
        return U.current.useInsertionEffect(a, b);
      };
      exports.useLayoutEffect = function(a, b) {
        return U.current.useLayoutEffect(a, b);
      };
      exports.useMemo = function(a, b) {
        return U.current.useMemo(a, b);
      };
      exports.useReducer = function(a, b, e) {
        return U.current.useReducer(a, b, e);
      };
      exports.useRef = function(a) {
        return U.current.useRef(a);
      };
      exports.useState = function(a) {
        return U.current.useState(a);
      };
      exports.useSyncExternalStore = function(a, b, e) {
        return U.current.useSyncExternalStore(a, b, e);
      };
      exports.useTransition = function() {
        return U.current.useTransition();
      };
      exports.version = "18.3.1";
    }
  });

  // ../fuick_js_framework/dist/widgets/types.js
  var require_types = __commonJS({
    "../fuick_js_framework/dist/widgets/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // ../fuick_js_framework/dist/PageContext.js
  var require_PageContext = __commonJS({
    "../fuick_js_framework/dist/PageContext.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PageContext = void 0;
      var react_1 = __importDefault(require_react_production_min());
      exports.PageContext = react_1.default.createContext({ pageId: 0 });
    }
  });

  // ../fuick_js_framework/dist/utils/ids.js
  var require_ids = __commonJS({
    "../fuick_js_framework/dist/utils/ids.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.refsId = refsId;
      var idCounter = 0;
      function refsId(seed) {
        if (seed) {
          return `ref_${seed}`;
        }
        return `ref_${Date.now()}_${idCounter++}`;
      }
    }
  });

  // ../fuick_js_framework/dist/widgets/BaseWidget.js
  var require_BaseWidget = __commonJS({
    "../fuick_js_framework/dist/widgets/BaseWidget.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BaseWidget = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var PageContext_1 = require_PageContext();
      var ids_1 = require_ids();
      var BaseWidget = class extends react_1.default.Component {
        constructor() {
          super(...arguments);
          this._internalRefId = (0, ids_1.refsId)();
        }
        get rawRefId() {
          return this.props.refId || this.props.id?.toString() || this.props.key?.toString() || this._internalRefId;
        }
        get pageId() {
          return this.context?.pageId || 0;
        }
        get scopedRefId() {
          const raw = this.rawRefId;
          if (raw.indexOf(":") !== -1) {
            return raw;
          }
          return `${this.pageId}:${raw}`;
        }
        callNativeCommand(method, args = {}, nodeType) {
          if (typeof globalThis.dartCallNative === "function") {
            globalThis.dartCallNative("componentCommand", {
              pageId: this.pageId,
              refId: this.scopedRefId,
              method,
              args,
              nodeType: nodeType || this.constructor.name
            });
          }
        }
      };
      exports.BaseWidget = BaseWidget;
      BaseWidget.contextType = PageContext_1.PageContext;
    }
  });

  // ../fuick_js_framework/dist/widgets/Text.js
  var require_Text = __commonJS({
    "../fuick_js_framework/dist/widgets/Text.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Text = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Text = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-text", { ...this.props, isBoundary: false });
        }
      };
      exports.Text = Text;
      exports.default = Text;
    }
  });

  // ../fuick_js_framework/dist/widgets/Column.js
  var require_Column = __commonJS({
    "../fuick_js_framework/dist/widgets/Column.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Column = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Column = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-column", { ...this.props });
        }
      };
      exports.Column = Column;
      exports.default = Column;
    }
  });

  // ../fuick_js_framework/dist/widgets/Row.js
  var require_Row = __commonJS({
    "../fuick_js_framework/dist/widgets/Row.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Row = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Row = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-row", { ...this.props });
        }
      };
      exports.Row = Row;
      exports.default = Row;
    }
  });

  // ../fuick_js_framework/dist/widgets/Container.js
  var require_Container = __commonJS({
    "../fuick_js_framework/dist/widgets/Container.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Container = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Container = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-container", { ...this.props });
        }
      };
      exports.Container = Container;
      exports.default = Container;
    }
  });

  // ../fuick_js_framework/dist/widgets/Button.js
  var require_Button = __commonJS({
    "../fuick_js_framework/dist/widgets/Button.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Button = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Button = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-button", {
            ...this.props
          });
        }
      };
      exports.Button = Button;
      exports.default = Button;
    }
  });

  // ../fuick_js_framework/dist/widgets/TextField.js
  var require_TextField = __commonJS({
    "../fuick_js_framework/dist/widgets/TextField.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TextField = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var TextField = class extends BaseWidget_1.BaseWidget {
        setText(text) {
          this.callNativeCommand("setText", { text });
        }
        clear() {
          this.callNativeCommand("clear", {});
        }
        render() {
          return react_1.default.createElement("flutter-text-field", {
            ...this.props,
            refId: this.scopedRefId,
            isBoundary: true
          });
        }
      };
      exports.TextField = TextField;
      exports.default = TextField;
    }
  });

  // ../fuick_js_framework/dist/widgets/Switch.js
  var require_Switch = __commonJS({
    "../fuick_js_framework/dist/widgets/Switch.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Switch = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Switch = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-switch", { ...this.props });
        }
      };
      exports.Switch = Switch;
      exports.default = Switch;
    }
  });

  // ../fuick_js_framework/dist/widgets/Expanded.js
  var require_Expanded = __commonJS({
    "../fuick_js_framework/dist/widgets/Expanded.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Expanded = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Expanded = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-expanded", { ...this.props });
        }
      };
      exports.Expanded = Expanded;
      exports.default = Expanded;
    }
  });

  // ../js/node_modules/scheduler/cjs/scheduler.production.min.js
  var require_scheduler_production_min = __commonJS({
    "../js/node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
      "use strict";
      function f(a, b) {
        var c = a.length;
        a.push(b);
        a: for (; 0 < c; ) {
          var d = c - 1 >>> 1, e = a[d];
          if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
          else break a;
        }
      }
      function h(a) {
        return 0 === a.length ? null : a[0];
      }
      function k(a) {
        if (0 === a.length) return null;
        var b = a[0], c = a.pop();
        if (c !== b) {
          a[0] = c;
          a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
            var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
            if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
            else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
            else break a;
          }
        }
        return b;
      }
      function g(a, b) {
        var c = a.sortIndex - b.sortIndex;
        return 0 !== c ? c : a.id - b.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        l = performance;
        exports.unstable_now = function() {
          return l.now();
        };
      } else {
        p = Date, q = p.now();
        exports.unstable_now = function() {
          return p.now() - q;
        };
      }
      var l;
      var p;
      var q;
      var r = [];
      var t = [];
      var u = 1;
      var v = null;
      var y = 3;
      var z = false;
      var A = false;
      var B = false;
      var D = "function" === typeof setTimeout ? setTimeout : null;
      var E = "function" === typeof clearTimeout ? clearTimeout : null;
      var F = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G(a) {
        for (var b = h(t); null !== b; ) {
          if (null === b.callback) k(t);
          else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
          else break;
          b = h(t);
        }
      }
      function H(a) {
        B = false;
        G(a);
        if (!A) if (null !== h(r)) A = true, I(J);
        else {
          var b = h(t);
          null !== b && K(H, b.startTime - a);
        }
      }
      function J(a, b) {
        A = false;
        B && (B = false, E(L), L = -1);
        z = true;
        var c = y;
        try {
          G(b);
          for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
            var d = v.callback;
            if ("function" === typeof d) {
              v.callback = null;
              y = v.priorityLevel;
              var e = d(v.expirationTime <= b);
              b = exports.unstable_now();
              "function" === typeof e ? v.callback = e : v === h(r) && k(r);
              G(b);
            } else k(r);
            v = h(r);
          }
          if (null !== v) var w = true;
          else {
            var m = h(t);
            null !== m && K(H, m.startTime - b);
            w = false;
          }
          return w;
        } finally {
          v = null, y = c, z = false;
        }
      }
      var N = false;
      var O = null;
      var L = -1;
      var P = 5;
      var Q = -1;
      function M() {
        return exports.unstable_now() - Q < P ? false : true;
      }
      function R() {
        if (null !== O) {
          var a = exports.unstable_now();
          Q = a;
          var b = true;
          try {
            b = O(true, a);
          } finally {
            b ? S() : (N = false, O = null);
          }
        } else N = false;
      }
      var S;
      if ("function" === typeof F) S = function() {
        F(R);
      };
      else if ("undefined" !== typeof MessageChannel) {
        T = new MessageChannel(), U = T.port2;
        T.port1.onmessage = R;
        S = function() {
          U.postMessage(null);
        };
      } else S = function() {
        D(R, 0);
      };
      var T;
      var U;
      function I(a) {
        O = a;
        N || (N = true, S());
      }
      function K(a, b) {
        L = D(function() {
          a(exports.unstable_now());
        }, b);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a) {
        a.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A || z || (A = true, I(J));
      };
      exports.unstable_forceFrameRate = function(a) {
        0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h(r);
      };
      exports.unstable_next = function(a) {
        switch (y) {
          case 1:
          case 2:
          case 3:
            var b = 3;
            break;
          default:
            b = y;
        }
        var c = y;
        y = b;
        try {
          return a();
        } finally {
          y = c;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a = 3;
        }
        var c = y;
        y = a;
        try {
          return b();
        } finally {
          y = c;
        }
      };
      exports.unstable_scheduleCallback = function(a, b, c) {
        var d = exports.unstable_now();
        "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
        switch (a) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c + e;
        a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
        c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
        return a;
      };
      exports.unstable_shouldYield = M;
      exports.unstable_wrapCallback = function(a) {
        var b = y;
        return function() {
          var c = y;
          y = b;
          try {
            return a.apply(this, arguments);
          } finally {
            y = c;
          }
        };
      };
    }
  });

  // ../js/node_modules/react-reconciler/cjs/react-reconciler.production.min.js
  var require_react_reconciler_production_min = __commonJS({
    "../js/node_modules/react-reconciler/cjs/react-reconciler.production.min.js"(exports, module) {
      module.exports = function $$$reconciler($$$hostConfig) {
        var exports2 = {};
        "use strict";
        var aa = require_react_production_min(), ba = require_scheduler_production_min(), ca = Object.assign;
        function n(a) {
          for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
          return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
        }
        var da = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ea = Symbol.for("react.element"), fa = Symbol.for("react.portal"), ha = Symbol.for("react.fragment"), ia = Symbol.for("react.strict_mode"), ja = Symbol.for("react.profiler"), ka = Symbol.for("react.provider"), la = Symbol.for("react.context"), ma = Symbol.for("react.forward_ref"), na = Symbol.for("react.suspense"), oa = Symbol.for("react.suspense_list"), pa = Symbol.for("react.memo"), qa = Symbol.for("react.lazy");
        Symbol.for("react.scope");
        Symbol.for("react.debug_trace_mode");
        var ra = Symbol.for("react.offscreen");
        Symbol.for("react.legacy_hidden");
        Symbol.for("react.cache");
        Symbol.for("react.tracing_marker");
        var sa = Symbol.iterator;
        function ta(a) {
          if (null === a || "object" !== typeof a) return null;
          a = sa && a[sa] || a["@@iterator"];
          return "function" === typeof a ? a : null;
        }
        function ua(a) {
          if (null == a) return null;
          if ("function" === typeof a) return a.displayName || a.name || null;
          if ("string" === typeof a) return a;
          switch (a) {
            case ha:
              return "Fragment";
            case fa:
              return "Portal";
            case ja:
              return "Profiler";
            case ia:
              return "StrictMode";
            case na:
              return "Suspense";
            case oa:
              return "SuspenseList";
          }
          if ("object" === typeof a) switch (a.$$typeof) {
            case la:
              return (a.displayName || "Context") + ".Consumer";
            case ka:
              return (a._context.displayName || "Context") + ".Provider";
            case ma:
              var b = a.render;
              a = a.displayName;
              a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
              return a;
            case pa:
              return b = a.displayName || null, null !== b ? b : ua(a.type) || "Memo";
            case qa:
              b = a._payload;
              a = a._init;
              try {
                return ua(a(b));
              } catch (c) {
              }
          }
          return null;
        }
        function va(a) {
          var b = a.type;
          switch (a.tag) {
            case 24:
              return "Cache";
            case 9:
              return (b.displayName || "Context") + ".Consumer";
            case 10:
              return (b._context.displayName || "Context") + ".Provider";
            case 18:
              return "DehydratedFragment";
            case 11:
              return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
            case 7:
              return "Fragment";
            case 5:
              return b;
            case 4:
              return "Portal";
            case 3:
              return "Root";
            case 6:
              return "Text";
            case 16:
              return ua(b);
            case 8:
              return b === ia ? "StrictMode" : "Mode";
            case 22:
              return "Offscreen";
            case 12:
              return "Profiler";
            case 21:
              return "Scope";
            case 13:
              return "Suspense";
            case 19:
              return "SuspenseList";
            case 25:
              return "TracingMarker";
            case 1:
            case 0:
            case 17:
            case 2:
            case 14:
            case 15:
              if ("function" === typeof b) return b.displayName || b.name || null;
              if ("string" === typeof b) return b;
          }
          return null;
        }
        function wa(a) {
          var b = a, c = a;
          if (a.alternate) for (; b.return; ) b = b.return;
          else {
            a = b;
            do
              b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
            while (a);
          }
          return 3 === b.tag ? c : null;
        }
        function xa(a) {
          if (wa(a) !== a) throw Error(n(188));
        }
        function za(a) {
          var b = a.alternate;
          if (!b) {
            b = wa(a);
            if (null === b) throw Error(n(188));
            return b !== a ? null : a;
          }
          for (var c = a, d = b; ; ) {
            var e = c.return;
            if (null === e) break;
            var f = e.alternate;
            if (null === f) {
              d = e.return;
              if (null !== d) {
                c = d;
                continue;
              }
              break;
            }
            if (e.child === f.child) {
              for (f = e.child; f; ) {
                if (f === c) return xa(e), a;
                if (f === d) return xa(e), b;
                f = f.sibling;
              }
              throw Error(n(188));
            }
            if (c.return !== d.return) c = e, d = f;
            else {
              for (var g = false, h = e.child; h; ) {
                if (h === c) {
                  g = true;
                  c = e;
                  d = f;
                  break;
                }
                if (h === d) {
                  g = true;
                  d = e;
                  c = f;
                  break;
                }
                h = h.sibling;
              }
              if (!g) {
                for (h = f.child; h; ) {
                  if (h === c) {
                    g = true;
                    c = f;
                    d = e;
                    break;
                  }
                  if (h === d) {
                    g = true;
                    d = f;
                    c = e;
                    break;
                  }
                  h = h.sibling;
                }
                if (!g) throw Error(n(189));
              }
            }
            if (c.alternate !== d) throw Error(n(190));
          }
          if (3 !== c.tag) throw Error(n(188));
          return c.stateNode.current === c ? a : b;
        }
        function Aa(a) {
          a = za(a);
          return null !== a ? Ba(a) : null;
        }
        function Ba(a) {
          if (5 === a.tag || 6 === a.tag) return a;
          for (a = a.child; null !== a; ) {
            var b = Ba(a);
            if (null !== b) return b;
            a = a.sibling;
          }
          return null;
        }
        function Ca(a) {
          if (5 === a.tag || 6 === a.tag) return a;
          for (a = a.child; null !== a; ) {
            if (4 !== a.tag) {
              var b = Ca(a);
              if (null !== b) return b;
            }
            a = a.sibling;
          }
          return null;
        }
        var Da = Array.isArray, Ea = $$$hostConfig.getPublicInstance, Fa = $$$hostConfig.getRootHostContext, Ga = $$$hostConfig.getChildHostContext, Ha = $$$hostConfig.prepareForCommit, Ia = $$$hostConfig.resetAfterCommit, Ja = $$$hostConfig.createInstance, Ka = $$$hostConfig.appendInitialChild, La = $$$hostConfig.finalizeInitialChildren, Ma = $$$hostConfig.prepareUpdate, Na = $$$hostConfig.shouldSetTextContent, Oa = $$$hostConfig.createTextInstance, Pa = $$$hostConfig.scheduleTimeout, Qa = $$$hostConfig.cancelTimeout, Ra = $$$hostConfig.noTimeout, Sa = $$$hostConfig.isPrimaryRenderer, Ta = $$$hostConfig.supportsMutation, Ua = $$$hostConfig.supportsPersistence, Va = $$$hostConfig.supportsHydration, Wa = $$$hostConfig.getInstanceFromNode, Xa = $$$hostConfig.preparePortalMount, Ya = $$$hostConfig.getCurrentEventPriority, Za = $$$hostConfig.detachDeletedInstance, $a = $$$hostConfig.supportsMicrotasks, ab = $$$hostConfig.scheduleMicrotask, bb = $$$hostConfig.supportsTestSelectors, cb = $$$hostConfig.findFiberRoot, db = $$$hostConfig.getBoundingRect, eb = $$$hostConfig.getTextContent, fb = $$$hostConfig.isHiddenSubtree, gb = $$$hostConfig.matchAccessibilityRole, hb = $$$hostConfig.setFocusIfFocusable, ib = $$$hostConfig.setupIntersectionObserver, jb = $$$hostConfig.appendChild, kb = $$$hostConfig.appendChildToContainer, lb = $$$hostConfig.commitTextUpdate, mb = $$$hostConfig.commitMount, nb = $$$hostConfig.commitUpdate, ob = $$$hostConfig.insertBefore, pb = $$$hostConfig.insertInContainerBefore, qb = $$$hostConfig.removeChild, rb = $$$hostConfig.removeChildFromContainer, sb = $$$hostConfig.resetTextContent, tb = $$$hostConfig.hideInstance, ub = $$$hostConfig.hideTextInstance, vb = $$$hostConfig.unhideInstance, wb = $$$hostConfig.unhideTextInstance, xb = $$$hostConfig.clearContainer, yb = $$$hostConfig.cloneInstance, zb = $$$hostConfig.createContainerChildSet, Ab = $$$hostConfig.appendChildToContainerChildSet, Bb = $$$hostConfig.finalizeContainerChildren, Cb = $$$hostConfig.replaceContainerChildren, Eb = $$$hostConfig.cloneHiddenInstance, Fb = $$$hostConfig.cloneHiddenTextInstance, Gb = $$$hostConfig.canHydrateInstance, Hb = $$$hostConfig.canHydrateTextInstance, Ib = $$$hostConfig.canHydrateSuspenseInstance, Jb = $$$hostConfig.isSuspenseInstancePending, Kb = $$$hostConfig.isSuspenseInstanceFallback, Lb = $$$hostConfig.getSuspenseInstanceFallbackErrorDetails, Mb = $$$hostConfig.registerSuspenseInstanceRetry, Nb = $$$hostConfig.getNextHydratableSibling, Ob = $$$hostConfig.getFirstHydratableChild, Pb = $$$hostConfig.getFirstHydratableChildWithinContainer, Qb = $$$hostConfig.getFirstHydratableChildWithinSuspenseInstance, Rb = $$$hostConfig.hydrateInstance, Sb = $$$hostConfig.hydrateTextInstance, Tb = $$$hostConfig.hydrateSuspenseInstance, Ub = $$$hostConfig.getNextHydratableInstanceAfterSuspenseInstance, Vb = $$$hostConfig.commitHydratedContainer, Wb = $$$hostConfig.commitHydratedSuspenseInstance, Xb = $$$hostConfig.clearSuspenseBoundary, Yb = $$$hostConfig.clearSuspenseBoundaryFromContainer, Zb = $$$hostConfig.shouldDeleteUnhydratedTailInstances, $b = $$$hostConfig.didNotMatchHydratedContainerTextInstance, ac = $$$hostConfig.didNotMatchHydratedTextInstance, bc;
        function cc(a) {
          if (void 0 === bc) try {
            throw Error();
          } catch (c) {
            var b = c.stack.trim().match(/\n( *(at )?)/);
            bc = b && b[1] || "";
          }
          return "\n" + bc + a;
        }
        var dc = false;
        function ec(a, b) {
          if (!a || dc) return "";
          dc = true;
          var c = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          try {
            if (b) if (b = function() {
              throw Error();
            }, Object.defineProperty(b.prototype, "props", { set: function() {
              throw Error();
            } }), "object" === typeof Reflect && Reflect.construct) {
              try {
                Reflect.construct(b, []);
              } catch (l) {
                var d = l;
              }
              Reflect.construct(a, [], b);
            } else {
              try {
                b.call();
              } catch (l) {
                d = l;
              }
              a.call(b.prototype);
            }
            else {
              try {
                throw Error();
              } catch (l) {
                d = l;
              }
              a();
            }
          } catch (l) {
            if (l && d && "string" === typeof l.stack) {
              for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
              for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
                if (1 !== g || 1 !== h) {
                  do
                    if (g--, h--, 0 > h || e[g] !== f[h]) {
                      var k = "\n" + e[g].replace(" at new ", " at ");
                      a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                      return k;
                    }
                  while (1 <= g && 0 <= h);
                }
                break;
              }
            }
          } finally {
            dc = false, Error.prepareStackTrace = c;
          }
          return (a = a ? a.displayName || a.name : "") ? cc(a) : "";
        }
        var fc = Object.prototype.hasOwnProperty, gc = [], hc = -1;
        function ic(a) {
          return { current: a };
        }
        function q(a) {
          0 > hc || (a.current = gc[hc], gc[hc] = null, hc--);
        }
        function v(a, b) {
          hc++;
          gc[hc] = a.current;
          a.current = b;
        }
        var jc = {}, x = ic(jc), z = ic(false), kc = jc;
        function mc(a, b) {
          var c = a.type.contextTypes;
          if (!c) return jc;
          var d = a.stateNode;
          if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
          var e = {}, f;
          for (f in c) e[f] = b[f];
          d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
          return e;
        }
        function A(a) {
          a = a.childContextTypes;
          return null !== a && void 0 !== a;
        }
        function nc() {
          q(z);
          q(x);
        }
        function oc(a, b, c) {
          if (x.current !== jc) throw Error(n(168));
          v(x, b);
          v(z, c);
        }
        function pc(a, b, c) {
          var d = a.stateNode;
          b = b.childContextTypes;
          if ("function" !== typeof d.getChildContext) return c;
          d = d.getChildContext();
          for (var e in d) if (!(e in b)) throw Error(n(108, va(a) || "Unknown", e));
          return ca({}, c, d);
        }
        function qc(a) {
          a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || jc;
          kc = x.current;
          v(x, a);
          v(z, z.current);
          return true;
        }
        function rc(a, b, c) {
          var d = a.stateNode;
          if (!d) throw Error(n(169));
          c ? (a = pc(a, b, kc), d.__reactInternalMemoizedMergedChildContext = a, q(z), q(x), v(x, a)) : q(z);
          v(z, c);
        }
        var tc = Math.clz32 ? Math.clz32 : sc, uc = Math.log, vc = Math.LN2;
        function sc(a) {
          a >>>= 0;
          return 0 === a ? 32 : 31 - (uc(a) / vc | 0) | 0;
        }
        var wc = 64, xc = 4194304;
        function yc(a) {
          switch (a & -a) {
            case 1:
              return 1;
            case 2:
              return 2;
            case 4:
              return 4;
            case 8:
              return 8;
            case 16:
              return 16;
            case 32:
              return 32;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
              return a & 4194240;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              return a & 130023424;
            case 134217728:
              return 134217728;
            case 268435456:
              return 268435456;
            case 536870912:
              return 536870912;
            case 1073741824:
              return 1073741824;
            default:
              return a;
          }
        }
        function zc(a, b) {
          var c = a.pendingLanes;
          if (0 === c) return 0;
          var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
          if (0 !== g) {
            var h = g & ~e;
            0 !== h ? d = yc(h) : (f &= g, 0 !== f && (d = yc(f)));
          } else g = c & ~e, 0 !== g ? d = yc(g) : 0 !== f && (d = yc(f));
          if (0 === d) return 0;
          if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
          0 !== (d & 4) && (d |= c & 16);
          b = a.entangledLanes;
          if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - tc(b), e = 1 << c, d |= a[c], b &= ~e;
          return d;
        }
        function Ac(a, b) {
          switch (a) {
            case 1:
            case 2:
            case 4:
              return b + 250;
            case 8:
            case 16:
            case 32:
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
              return b + 5e3;
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              return -1;
            case 134217728:
            case 268435456:
            case 536870912:
            case 1073741824:
              return -1;
            default:
              return -1;
          }
        }
        function Bc(a, b) {
          for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
            var g = 31 - tc(f), h = 1 << g, k = e[g];
            if (-1 === k) {
              if (0 === (h & c) || 0 !== (h & d)) e[g] = Ac(h, b);
            } else k <= b && (a.expiredLanes |= h);
            f &= ~h;
          }
        }
        function Cc(a) {
          a = a.pendingLanes & -1073741825;
          return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
        }
        function Dc() {
          var a = wc;
          wc <<= 1;
          0 === (wc & 4194240) && (wc = 64);
          return a;
        }
        function Ec(a) {
          for (var b = [], c = 0; 31 > c; c++) b.push(a);
          return b;
        }
        function Fc(a, b, c) {
          a.pendingLanes |= b;
          536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
          a = a.eventTimes;
          b = 31 - tc(b);
          a[b] = c;
        }
        function Gc(a, b) {
          var c = a.pendingLanes & ~b;
          a.pendingLanes = b;
          a.suspendedLanes = 0;
          a.pingedLanes = 0;
          a.expiredLanes &= b;
          a.mutableReadLanes &= b;
          a.entangledLanes &= b;
          b = a.entanglements;
          var d = a.eventTimes;
          for (a = a.expirationTimes; 0 < c; ) {
            var e = 31 - tc(c), f = 1 << e;
            b[e] = 0;
            d[e] = -1;
            a[e] = -1;
            c &= ~f;
          }
        }
        function Hc(a, b) {
          var c = a.entangledLanes |= b;
          for (a = a.entanglements; c; ) {
            var d = 31 - tc(c), e = 1 << d;
            e & b | a[d] & b && (a[d] |= b);
            c &= ~e;
          }
        }
        var C = 0;
        function Ic(a) {
          a &= -a;
          return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
        }
        var Jc = ba.unstable_scheduleCallback, Kc = ba.unstable_cancelCallback, Lc = ba.unstable_shouldYield, Mc = ba.unstable_requestPaint, D = ba.unstable_now, Nc = ba.unstable_ImmediatePriority, Oc = ba.unstable_UserBlockingPriority, Pc = ba.unstable_NormalPriority, Qc = ba.unstable_IdlePriority, Rc = null, Sc = null;
        function Tc(a) {
          if (Sc && "function" === typeof Sc.onCommitFiberRoot) try {
            Sc.onCommitFiberRoot(Rc, a, void 0, 128 === (a.current.flags & 128));
          } catch (b) {
          }
        }
        function Uc(a, b) {
          return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
        }
        var Vc = "function" === typeof Object.is ? Object.is : Uc, Wc = null, Xc = false, Yc = false;
        function Zc(a) {
          null === Wc ? Wc = [a] : Wc.push(a);
        }
        function $c(a) {
          Xc = true;
          Zc(a);
        }
        function ad() {
          if (!Yc && null !== Wc) {
            Yc = true;
            var a = 0, b = C;
            try {
              var c = Wc;
              for (C = 1; a < c.length; a++) {
                var d = c[a];
                do
                  d = d(true);
                while (null !== d);
              }
              Wc = null;
              Xc = false;
            } catch (e) {
              throw null !== Wc && (Wc = Wc.slice(a + 1)), Jc(Nc, ad), e;
            } finally {
              C = b, Yc = false;
            }
          }
          return null;
        }
        var bd = [], cd = 0, dd = null, ed = 0, fd = [], gd = 0, hd = null, id = 1, jd = "";
        function kd(a, b) {
          bd[cd++] = ed;
          bd[cd++] = dd;
          dd = a;
          ed = b;
        }
        function ld(a, b, c) {
          fd[gd++] = id;
          fd[gd++] = jd;
          fd[gd++] = hd;
          hd = a;
          var d = id;
          a = jd;
          var e = 32 - tc(d) - 1;
          d &= ~(1 << e);
          c += 1;
          var f = 32 - tc(b) + e;
          if (30 < f) {
            var g = e - e % 5;
            f = (d & (1 << g) - 1).toString(32);
            d >>= g;
            e -= g;
            id = 1 << 32 - tc(b) + e | c << e | d;
            jd = f + a;
          } else id = 1 << f | c << e | d, jd = a;
        }
        function md(a) {
          null !== a.return && (kd(a, 1), ld(a, 1, 0));
        }
        function nd(a) {
          for (; a === dd; ) dd = bd[--cd], bd[cd] = null, ed = bd[--cd], bd[cd] = null;
          for (; a === hd; ) hd = fd[--gd], fd[gd] = null, jd = fd[--gd], fd[gd] = null, id = fd[--gd], fd[gd] = null;
        }
        var od = null, pd = null, F = false, qd = false, rd = null;
        function sd(a, b) {
          var c = td(5, null, null, 0);
          c.elementType = "DELETED";
          c.stateNode = b;
          c.return = a;
          b = a.deletions;
          null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
        }
        function ud(a, b) {
          switch (a.tag) {
            case 5:
              return b = Gb(b, a.type, a.pendingProps), null !== b ? (a.stateNode = b, od = a, pd = Ob(b), true) : false;
            case 6:
              return b = Hb(b, a.pendingProps), null !== b ? (a.stateNode = b, od = a, pd = null, true) : false;
            case 13:
              b = Ib(b);
              if (null !== b) {
                var c = null !== hd ? { id, overflow: jd } : null;
                a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 };
                c = td(18, null, null, 0);
                c.stateNode = b;
                c.return = a;
                a.child = c;
                od = a;
                pd = null;
                return true;
              }
              return false;
            default:
              return false;
          }
        }
        function vd(a) {
          return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
        }
        function wd(a) {
          if (F) {
            var b = pd;
            if (b) {
              var c = b;
              if (!ud(a, b)) {
                if (vd(a)) throw Error(n(418));
                b = Nb(c);
                var d = od;
                b && ud(a, b) ? sd(d, c) : (a.flags = a.flags & -4097 | 2, F = false, od = a);
              }
            } else {
              if (vd(a)) throw Error(n(418));
              a.flags = a.flags & -4097 | 2;
              F = false;
              od = a;
            }
          }
        }
        function xd(a) {
          for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
          od = a;
        }
        function yd(a) {
          if (!Va || a !== od) return false;
          if (!F) return xd(a), F = true, false;
          if (3 !== a.tag && (5 !== a.tag || Zb(a.type) && !Na(a.type, a.memoizedProps))) {
            var b = pd;
            if (b) {
              if (vd(a)) throw zd(), Error(n(418));
              for (; b; ) sd(a, b), b = Nb(b);
            }
          }
          xd(a);
          if (13 === a.tag) {
            if (!Va) throw Error(n(316));
            a = a.memoizedState;
            a = null !== a ? a.dehydrated : null;
            if (!a) throw Error(n(317));
            pd = Ub(a);
          } else pd = od ? Nb(a.stateNode) : null;
          return true;
        }
        function zd() {
          for (var a = pd; a; ) a = Nb(a);
        }
        function Ad() {
          Va && (pd = od = null, qd = F = false);
        }
        function Bd(a) {
          null === rd ? rd = [a] : rd.push(a);
        }
        var Cd = da.ReactCurrentBatchConfig;
        function Dd(a, b) {
          if (Vc(a, b)) return true;
          if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
          var c = Object.keys(a), d = Object.keys(b);
          if (c.length !== d.length) return false;
          for (d = 0; d < c.length; d++) {
            var e = c[d];
            if (!fc.call(b, e) || !Vc(a[e], b[e])) return false;
          }
          return true;
        }
        function Ed(a) {
          switch (a.tag) {
            case 5:
              return cc(a.type);
            case 16:
              return cc("Lazy");
            case 13:
              return cc("Suspense");
            case 19:
              return cc("SuspenseList");
            case 0:
            case 2:
            case 15:
              return a = ec(a.type, false), a;
            case 11:
              return a = ec(a.type.render, false), a;
            case 1:
              return a = ec(a.type, true), a;
            default:
              return "";
          }
        }
        function Fd(a, b, c) {
          a = c.ref;
          if (null !== a && "function" !== typeof a && "object" !== typeof a) {
            if (c._owner) {
              c = c._owner;
              if (c) {
                if (1 !== c.tag) throw Error(n(309));
                var d = c.stateNode;
              }
              if (!d) throw Error(n(147, a));
              var e = d, f = "" + a;
              if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
              b = function(a2) {
                var b2 = e.refs;
                null === a2 ? delete b2[f] : b2[f] = a2;
              };
              b._stringRef = f;
              return b;
            }
            if ("string" !== typeof a) throw Error(n(284));
            if (!c._owner) throw Error(n(290, a));
          }
          return a;
        }
        function Gd(a, b) {
          a = Object.prototype.toString.call(b);
          throw Error(n(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
        }
        function Hd(a) {
          var b = a._init;
          return b(a._payload);
        }
        function Id(a) {
          function b(b2, c2) {
            if (a) {
              var d2 = b2.deletions;
              null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
            }
          }
          function c(c2, d2) {
            if (!a) return null;
            for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
            return null;
          }
          function d(a2, b2) {
            for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
            return a2;
          }
          function e(a2, b2) {
            a2 = Jd(a2, b2);
            a2.index = 0;
            a2.sibling = null;
            return a2;
          }
          function f(b2, c2, d2) {
            b2.index = d2;
            if (!a) return b2.flags |= 1048576, c2;
            d2 = b2.alternate;
            if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
            b2.flags |= 2;
            return c2;
          }
          function g(b2) {
            a && null === b2.alternate && (b2.flags |= 2);
            return b2;
          }
          function h(a2, b2, c2, d2) {
            if (null === b2 || 6 !== b2.tag) return b2 = Kd(c2, a2.mode, d2), b2.return = a2, b2;
            b2 = e(b2, c2);
            b2.return = a2;
            return b2;
          }
          function k(a2, b2, c2, d2) {
            var f2 = c2.type;
            if (f2 === ha) return m(a2, b2, c2.props.children, d2, c2.key);
            if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === qa && Hd(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Fd(a2, b2, c2), d2.return = a2, d2;
            d2 = Ld(c2.type, c2.key, c2.props, null, a2.mode, d2);
            d2.ref = Fd(a2, b2, c2);
            d2.return = a2;
            return d2;
          }
          function l(a2, b2, c2, d2) {
            if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Md(c2, a2.mode, d2), b2.return = a2, b2;
            b2 = e(b2, c2.children || []);
            b2.return = a2;
            return b2;
          }
          function m(a2, b2, c2, d2, f2) {
            if (null === b2 || 7 !== b2.tag) return b2 = Nd(c2, a2.mode, d2, f2), b2.return = a2, b2;
            b2 = e(b2, c2);
            b2.return = a2;
            return b2;
          }
          function r(a2, b2, c2) {
            if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Kd("" + b2, a2.mode, c2), b2.return = a2, b2;
            if ("object" === typeof b2 && null !== b2) {
              switch (b2.$$typeof) {
                case ea:
                  return c2 = Ld(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Fd(a2, null, b2), c2.return = a2, c2;
                case fa:
                  return b2 = Md(b2, a2.mode, c2), b2.return = a2, b2;
                case qa:
                  var d2 = b2._init;
                  return r(a2, d2(b2._payload), c2);
              }
              if (Da(b2) || ta(b2)) return b2 = Nd(b2, a2.mode, c2, null), b2.return = a2, b2;
              Gd(a2, b2);
            }
            return null;
          }
          function p(a2, b2, c2, d2) {
            var e2 = null !== b2 ? b2.key : null;
            if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
            if ("object" === typeof c2 && null !== c2) {
              switch (c2.$$typeof) {
                case ea:
                  return c2.key === e2 ? k(a2, b2, c2, d2) : null;
                case fa:
                  return c2.key === e2 ? l(a2, b2, c2, d2) : null;
                case qa:
                  return e2 = c2._init, p(
                    a2,
                    b2,
                    e2(c2._payload),
                    d2
                  );
              }
              if (Da(c2) || ta(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
              Gd(a2, c2);
            }
            return null;
          }
          function B(a2, b2, c2, d2, e2) {
            if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
            if ("object" === typeof d2 && null !== d2) {
              switch (d2.$$typeof) {
                case ea:
                  return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
                case fa:
                  return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
                case qa:
                  var f2 = d2._init;
                  return B(a2, b2, c2, f2(d2._payload), e2);
              }
              if (Da(d2) || ta(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
              Gd(b2, d2);
            }
            return null;
          }
          function w(e2, g2, h2, k2) {
            for (var l2 = null, m2 = null, u = g2, t = g2 = 0, E = null; null !== u && t < h2.length; t++) {
              u.index > t ? (E = u, u = null) : E = u.sibling;
              var y = p(e2, u, h2[t], k2);
              if (null === y) {
                null === u && (u = E);
                break;
              }
              a && u && null === y.alternate && b(e2, u);
              g2 = f(y, g2, t);
              null === m2 ? l2 = y : m2.sibling = y;
              m2 = y;
              u = E;
            }
            if (t === h2.length) return c(e2, u), F && kd(e2, t), l2;
            if (null === u) {
              for (; t < h2.length; t++) u = r(e2, h2[t], k2), null !== u && (g2 = f(u, g2, t), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
              F && kd(e2, t);
              return l2;
            }
            for (u = d(e2, u); t < h2.length; t++) E = B(u, e2, t, h2[t], k2), null !== E && (a && null !== E.alternate && u.delete(null === E.key ? t : E.key), g2 = f(E, g2, t), null === m2 ? l2 = E : m2.sibling = E, m2 = E);
            a && u.forEach(function(a2) {
              return b(e2, a2);
            });
            F && kd(e2, t);
            return l2;
          }
          function Y(e2, g2, h2, k2) {
            var l2 = ta(h2);
            if ("function" !== typeof l2) throw Error(n(150));
            h2 = l2.call(h2);
            if (null == h2) throw Error(n(151));
            for (var u = l2 = null, m2 = g2, t = g2 = 0, E = null, y = h2.next(); null !== m2 && !y.done; t++, y = h2.next()) {
              m2.index > t ? (E = m2, m2 = null) : E = m2.sibling;
              var w2 = p(e2, m2, y.value, k2);
              if (null === w2) {
                null === m2 && (m2 = E);
                break;
              }
              a && m2 && null === w2.alternate && b(e2, m2);
              g2 = f(w2, g2, t);
              null === u ? l2 = w2 : u.sibling = w2;
              u = w2;
              m2 = E;
            }
            if (y.done) return c(
              e2,
              m2
            ), F && kd(e2, t), l2;
            if (null === m2) {
              for (; !y.done; t++, y = h2.next()) y = r(e2, y.value, k2), null !== y && (g2 = f(y, g2, t), null === u ? l2 = y : u.sibling = y, u = y);
              F && kd(e2, t);
              return l2;
            }
            for (m2 = d(e2, m2); !y.done; t++, y = h2.next()) y = B(m2, e2, t, y.value, k2), null !== y && (a && null !== y.alternate && m2.delete(null === y.key ? t : y.key), g2 = f(y, g2, t), null === u ? l2 = y : u.sibling = y, u = y);
            a && m2.forEach(function(a2) {
              return b(e2, a2);
            });
            F && kd(e2, t);
            return l2;
          }
          function ya(a2, d2, f2, h2) {
            "object" === typeof f2 && null !== f2 && f2.type === ha && null === f2.key && (f2 = f2.props.children);
            if ("object" === typeof f2 && null !== f2) {
              switch (f2.$$typeof) {
                case ea:
                  a: {
                    for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                      if (l2.key === k2) {
                        k2 = f2.type;
                        if (k2 === ha) {
                          if (7 === l2.tag) {
                            c(a2, l2.sibling);
                            d2 = e(l2, f2.props.children);
                            d2.return = a2;
                            a2 = d2;
                            break a;
                          }
                        } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === qa && Hd(k2) === l2.type) {
                          c(a2, l2.sibling);
                          d2 = e(l2, f2.props);
                          d2.ref = Fd(a2, l2, f2);
                          d2.return = a2;
                          a2 = d2;
                          break a;
                        }
                        c(a2, l2);
                        break;
                      } else b(a2, l2);
                      l2 = l2.sibling;
                    }
                    f2.type === ha ? (d2 = Nd(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Ld(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Fd(a2, d2, f2), h2.return = a2, a2 = h2);
                  }
                  return g(a2);
                case fa:
                  a: {
                    for (l2 = f2.key; null !== d2; ) {
                      if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                        c(a2, d2.sibling);
                        d2 = e(d2, f2.children || []);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      } else {
                        c(a2, d2);
                        break;
                      }
                      else b(a2, d2);
                      d2 = d2.sibling;
                    }
                    d2 = Md(f2, a2.mode, h2);
                    d2.return = a2;
                    a2 = d2;
                  }
                  return g(a2);
                case qa:
                  return l2 = f2._init, ya(a2, d2, l2(f2._payload), h2);
              }
              if (Da(f2)) return w(a2, d2, f2, h2);
              if (ta(f2)) return Y(a2, d2, f2, h2);
              Gd(a2, f2);
            }
            return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Kd(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
          }
          return ya;
        }
        var Od = Id(true), Pd = Id(false), Qd = ic(null), Rd = null, Sd = null, Td = null;
        function Ud() {
          Td = Sd = Rd = null;
        }
        function Vd(a, b, c) {
          Sa ? (v(Qd, b._currentValue), b._currentValue = c) : (v(Qd, b._currentValue2), b._currentValue2 = c);
        }
        function Wd(a) {
          var b = Qd.current;
          q(Qd);
          Sa ? a._currentValue = b : a._currentValue2 = b;
        }
        function Xd(a, b, c) {
          for (; null !== a; ) {
            var d = a.alternate;
            (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
            if (a === c) break;
            a = a.return;
          }
        }
        function Yd(a, b) {
          Rd = a;
          Td = Sd = null;
          a = a.dependencies;
          null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (G = true), a.firstContext = null);
        }
        function Zd(a) {
          var b = Sa ? a._currentValue : a._currentValue2;
          if (Td !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Sd) {
            if (null === Rd) throw Error(n(308));
            Sd = a;
            Rd.dependencies = { lanes: 0, firstContext: a };
          } else Sd = Sd.next = a;
          return b;
        }
        var $d = null;
        function ae(a) {
          null === $d ? $d = [a] : $d.push(a);
        }
        function be(a, b, c, d) {
          var e = b.interleaved;
          null === e ? (c.next = c, ae(b)) : (c.next = e.next, e.next = c);
          b.interleaved = c;
          return ce(a, d);
        }
        function ce(a, b) {
          a.lanes |= b;
          var c = a.alternate;
          null !== c && (c.lanes |= b);
          c = a;
          for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
          return 3 === c.tag ? c.stateNode : null;
        }
        var de = false;
        function ee(a) {
          a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
        }
        function fe(a, b) {
          a = a.updateQueue;
          b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
        }
        function ge(a, b) {
          return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
        }
        function he(a, b, c) {
          var d = a.updateQueue;
          if (null === d) return null;
          d = d.shared;
          if (0 !== (H & 2)) {
            var e = d.pending;
            null === e ? b.next = b : (b.next = e.next, e.next = b);
            d.pending = b;
            return ce(a, c);
          }
          e = d.interleaved;
          null === e ? (b.next = b, ae(d)) : (b.next = e.next, e.next = b);
          d.interleaved = b;
          return ce(a, c);
        }
        function ie(a, b, c) {
          b = b.updateQueue;
          if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
            var d = b.lanes;
            d &= a.pendingLanes;
            c |= d;
            b.lanes = c;
            Hc(a, c);
          }
        }
        function je(a, b) {
          var c = a.updateQueue, d = a.alternate;
          if (null !== d && (d = d.updateQueue, c === d)) {
            var e = null, f = null;
            c = c.firstBaseUpdate;
            if (null !== c) {
              do {
                var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
                null === f ? e = f = g : f = f.next = g;
                c = c.next;
              } while (null !== c);
              null === f ? e = f = b : f = f.next = b;
            } else e = f = b;
            c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
            a.updateQueue = c;
            return;
          }
          a = c.lastBaseUpdate;
          null === a ? c.firstBaseUpdate = b : a.next = b;
          c.lastBaseUpdate = b;
        }
        function ke(a, b, c, d) {
          var e = a.updateQueue;
          de = false;
          var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
          if (null !== h) {
            e.shared.pending = null;
            var k = h, l = k.next;
            k.next = null;
            null === g ? f = l : g.next = l;
            g = k;
            var m = a.alternate;
            null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
          }
          if (null !== f) {
            var r = e.baseState;
            g = 0;
            m = l = k = null;
            h = f;
            do {
              var p = h.lane, B = h.eventTime;
              if ((d & p) === p) {
                null !== m && (m = m.next = {
                  eventTime: B,
                  lane: 0,
                  tag: h.tag,
                  payload: h.payload,
                  callback: h.callback,
                  next: null
                });
                a: {
                  var w = a, Y = h;
                  p = b;
                  B = c;
                  switch (Y.tag) {
                    case 1:
                      w = Y.payload;
                      if ("function" === typeof w) {
                        r = w.call(B, r, p);
                        break a;
                      }
                      r = w;
                      break a;
                    case 3:
                      w.flags = w.flags & -65537 | 128;
                    case 0:
                      w = Y.payload;
                      p = "function" === typeof w ? w.call(B, r, p) : w;
                      if (null === p || void 0 === p) break a;
                      r = ca({}, r, p);
                      break a;
                    case 2:
                      de = true;
                  }
                }
                null !== h.callback && 0 !== h.lane && (a.flags |= 64, p = e.effects, null === p ? e.effects = [h] : p.push(h));
              } else B = { eventTime: B, lane: p, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = B, k = r) : m = m.next = B, g |= p;
              h = h.next;
              if (null === h) if (h = e.shared.pending, null === h) break;
              else p = h, h = p.next, p.next = null, e.lastBaseUpdate = p, e.shared.pending = null;
            } while (1);
            null === m && (k = r);
            e.baseState = k;
            e.firstBaseUpdate = l;
            e.lastBaseUpdate = m;
            b = e.shared.interleaved;
            if (null !== b) {
              e = b;
              do
                g |= e.lane, e = e.next;
              while (e !== b);
            } else null === f && (e.shared.lanes = 0);
            le |= g;
            a.lanes = g;
            a.memoizedState = r;
          }
        }
        function me(a, b, c) {
          a = b.effects;
          b.effects = null;
          if (null !== a) for (b = 0; b < a.length; b++) {
            var d = a[b], e = d.callback;
            if (null !== e) {
              d.callback = null;
              d = c;
              if ("function" !== typeof e) throw Error(n(191, e));
              e.call(d);
            }
          }
        }
        var ne = {}, oe = ic(ne), pe = ic(ne), qe = ic(ne);
        function re(a) {
          if (a === ne) throw Error(n(174));
          return a;
        }
        function se(a, b) {
          v(qe, b);
          v(pe, a);
          v(oe, ne);
          a = Fa(b);
          q(oe);
          v(oe, a);
        }
        function te() {
          q(oe);
          q(pe);
          q(qe);
        }
        function ue(a) {
          var b = re(qe.current), c = re(oe.current);
          b = Ga(c, a.type, b);
          c !== b && (v(pe, a), v(oe, b));
        }
        function ve(a) {
          pe.current === a && (q(oe), q(pe));
        }
        var I = ic(0);
        function we(a) {
          for (var b = a; null !== b; ) {
            if (13 === b.tag) {
              var c = b.memoizedState;
              if (null !== c && (c = c.dehydrated, null === c || Jb(c) || Kb(c))) return b;
            } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
              if (0 !== (b.flags & 128)) return b;
            } else if (null !== b.child) {
              b.child.return = b;
              b = b.child;
              continue;
            }
            if (b === a) break;
            for (; null === b.sibling; ) {
              if (null === b.return || b.return === a) return null;
              b = b.return;
            }
            b.sibling.return = b.return;
            b = b.sibling;
          }
          return null;
        }
        var xe = [];
        function ye() {
          for (var a = 0; a < xe.length; a++) {
            var b = xe[a];
            Sa ? b._workInProgressVersionPrimary = null : b._workInProgressVersionSecondary = null;
          }
          xe.length = 0;
        }
        var ze = da.ReactCurrentDispatcher, Ae = da.ReactCurrentBatchConfig, Be = 0, J = null, K = null, L = null, Ce = false, De = false, Ee = 0, Fe = 0;
        function M() {
          throw Error(n(321));
        }
        function Ge(a, b) {
          if (null === b) return false;
          for (var c = 0; c < b.length && c < a.length; c++) if (!Vc(a[c], b[c])) return false;
          return true;
        }
        function He(a, b, c, d, e, f) {
          Be = f;
          J = b;
          b.memoizedState = null;
          b.updateQueue = null;
          b.lanes = 0;
          ze.current = null === a || null === a.memoizedState ? Ie : Je;
          a = c(d, e);
          if (De) {
            f = 0;
            do {
              De = false;
              Ee = 0;
              if (25 <= f) throw Error(n(301));
              f += 1;
              L = K = null;
              b.updateQueue = null;
              ze.current = Ke;
              a = c(d, e);
            } while (De);
          }
          ze.current = Le;
          b = null !== K && null !== K.next;
          Be = 0;
          L = K = J = null;
          Ce = false;
          if (b) throw Error(n(300));
          return a;
        }
        function Me() {
          var a = 0 !== Ee;
          Ee = 0;
          return a;
        }
        function Ne() {
          var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
          null === L ? J.memoizedState = L = a : L = L.next = a;
          return L;
        }
        function Oe() {
          if (null === K) {
            var a = J.alternate;
            a = null !== a ? a.memoizedState : null;
          } else a = K.next;
          var b = null === L ? J.memoizedState : L.next;
          if (null !== b) L = b, K = a;
          else {
            if (null === a) throw Error(n(310));
            K = a;
            a = { memoizedState: K.memoizedState, baseState: K.baseState, baseQueue: K.baseQueue, queue: K.queue, next: null };
            null === L ? J.memoizedState = L = a : L = L.next = a;
          }
          return L;
        }
        function Pe(a, b) {
          return "function" === typeof b ? b(a) : b;
        }
        function Qe(a) {
          var b = Oe(), c = b.queue;
          if (null === c) throw Error(n(311));
          c.lastRenderedReducer = a;
          var d = K, e = d.baseQueue, f = c.pending;
          if (null !== f) {
            if (null !== e) {
              var g = e.next;
              e.next = f.next;
              f.next = g;
            }
            d.baseQueue = e = f;
            c.pending = null;
          }
          if (null !== e) {
            f = e.next;
            d = d.baseState;
            var h = g = null, k = null, l = f;
            do {
              var m = l.lane;
              if ((Be & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
              else {
                var r = {
                  lane: m,
                  action: l.action,
                  hasEagerState: l.hasEagerState,
                  eagerState: l.eagerState,
                  next: null
                };
                null === k ? (h = k = r, g = d) : k = k.next = r;
                J.lanes |= m;
                le |= m;
              }
              l = l.next;
            } while (null !== l && l !== f);
            null === k ? g = d : k.next = h;
            Vc(d, b.memoizedState) || (G = true);
            b.memoizedState = d;
            b.baseState = g;
            b.baseQueue = k;
            c.lastRenderedState = d;
          }
          a = c.interleaved;
          if (null !== a) {
            e = a;
            do
              f = e.lane, J.lanes |= f, le |= f, e = e.next;
            while (e !== a);
          } else null === e && (c.lanes = 0);
          return [b.memoizedState, c.dispatch];
        }
        function Re(a) {
          var b = Oe(), c = b.queue;
          if (null === c) throw Error(n(311));
          c.lastRenderedReducer = a;
          var d = c.dispatch, e = c.pending, f = b.memoizedState;
          if (null !== e) {
            c.pending = null;
            var g = e = e.next;
            do
              f = a(f, g.action), g = g.next;
            while (g !== e);
            Vc(f, b.memoizedState) || (G = true);
            b.memoizedState = f;
            null === b.baseQueue && (b.baseState = f);
            c.lastRenderedState = f;
          }
          return [f, d];
        }
        function Se() {
        }
        function Te(a, b) {
          var c = J, d = Oe(), e = b(), f = !Vc(d.memoizedState, e);
          f && (d.memoizedState = e, G = true);
          d = d.queue;
          Ue(Ve.bind(null, c, d, a), [a]);
          if (d.getSnapshot !== b || f || null !== L && L.memoizedState.tag & 1) {
            c.flags |= 2048;
            We(9, Xe.bind(null, c, d, e, b), void 0, null);
            if (null === N) throw Error(n(349));
            0 !== (Be & 30) || Ye(c, b, e);
          }
          return e;
        }
        function Ye(a, b, c) {
          a.flags |= 16384;
          a = { getSnapshot: b, value: c };
          b = J.updateQueue;
          null === b ? (b = { lastEffect: null, stores: null }, J.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
        }
        function Xe(a, b, c, d) {
          b.value = c;
          b.getSnapshot = d;
          Ze(b) && $e(a);
        }
        function Ve(a, b, c) {
          return c(function() {
            Ze(b) && $e(a);
          });
        }
        function Ze(a) {
          var b = a.getSnapshot;
          a = a.value;
          try {
            var c = b();
            return !Vc(a, c);
          } catch (d) {
            return true;
          }
        }
        function $e(a) {
          var b = ce(a, 1);
          null !== b && af(b, a, 1, -1);
        }
        function bf(a) {
          var b = Ne();
          "function" === typeof a && (a = a());
          b.memoizedState = b.baseState = a;
          a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Pe, lastRenderedState: a };
          b.queue = a;
          a = a.dispatch = cf.bind(null, J, a);
          return [b.memoizedState, a];
        }
        function We(a, b, c, d) {
          a = { tag: a, create: b, destroy: c, deps: d, next: null };
          b = J.updateQueue;
          null === b ? (b = { lastEffect: null, stores: null }, J.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
          return a;
        }
        function df() {
          return Oe().memoizedState;
        }
        function ef(a, b, c, d) {
          var e = Ne();
          J.flags |= a;
          e.memoizedState = We(1 | b, c, void 0, void 0 === d ? null : d);
        }
        function ff(a, b, c, d) {
          var e = Oe();
          d = void 0 === d ? null : d;
          var f = void 0;
          if (null !== K) {
            var g = K.memoizedState;
            f = g.destroy;
            if (null !== d && Ge(d, g.deps)) {
              e.memoizedState = We(b, c, f, d);
              return;
            }
          }
          J.flags |= a;
          e.memoizedState = We(1 | b, c, f, d);
        }
        function gf(a, b) {
          return ef(8390656, 8, a, b);
        }
        function Ue(a, b) {
          return ff(2048, 8, a, b);
        }
        function hf(a, b) {
          return ff(4, 2, a, b);
        }
        function jf(a, b) {
          return ff(4, 4, a, b);
        }
        function kf(a, b) {
          if ("function" === typeof b) return a = a(), b(a), function() {
            b(null);
          };
          if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
            b.current = null;
          };
        }
        function lf(a, b, c) {
          c = null !== c && void 0 !== c ? c.concat([a]) : null;
          return ff(4, 4, kf.bind(null, b, a), c);
        }
        function mf() {
        }
        function nf(a, b) {
          var c = Oe();
          b = void 0 === b ? null : b;
          var d = c.memoizedState;
          if (null !== d && null !== b && Ge(b, d[1])) return d[0];
          c.memoizedState = [a, b];
          return a;
        }
        function of(a, b) {
          var c = Oe();
          b = void 0 === b ? null : b;
          var d = c.memoizedState;
          if (null !== d && null !== b && Ge(b, d[1])) return d[0];
          a = a();
          c.memoizedState = [a, b];
          return a;
        }
        function pf(a, b, c) {
          if (0 === (Be & 21)) return a.baseState && (a.baseState = false, G = true), a.memoizedState = c;
          Vc(c, b) || (c = Dc(), J.lanes |= c, le |= c, a.baseState = true);
          return b;
        }
        function qf(a, b) {
          var c = C;
          C = 0 !== c && 4 > c ? c : 4;
          a(true);
          var d = Ae.transition;
          Ae.transition = {};
          try {
            a(false), b();
          } finally {
            C = c, Ae.transition = d;
          }
        }
        function rf() {
          return Oe().memoizedState;
        }
        function sf(a, b, c) {
          var d = tf(a);
          c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
          if (uf(a)) vf(b, c);
          else if (c = be(a, b, c, d), null !== c) {
            var e = O();
            af(c, a, d, e);
            wf(c, b, d);
          }
        }
        function cf(a, b, c) {
          var d = tf(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
          if (uf(a)) vf(b, e);
          else {
            var f = a.alternate;
            if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
              var g = b.lastRenderedState, h = f(g, c);
              e.hasEagerState = true;
              e.eagerState = h;
              if (Vc(h, g)) {
                var k = b.interleaved;
                null === k ? (e.next = e, ae(b)) : (e.next = k.next, k.next = e);
                b.interleaved = e;
                return;
              }
            } catch (l) {
            } finally {
            }
            c = be(a, b, e, d);
            null !== c && (e = O(), af(c, a, d, e), wf(c, b, d));
          }
        }
        function uf(a) {
          var b = a.alternate;
          return a === J || null !== b && b === J;
        }
        function vf(a, b) {
          De = Ce = true;
          var c = a.pending;
          null === c ? b.next = b : (b.next = c.next, c.next = b);
          a.pending = b;
        }
        function wf(a, b, c) {
          if (0 !== (c & 4194240)) {
            var d = b.lanes;
            d &= a.pendingLanes;
            c |= d;
            b.lanes = c;
            Hc(a, c);
          }
        }
        var Le = { readContext: Zd, useCallback: M, useContext: M, useEffect: M, useImperativeHandle: M, useInsertionEffect: M, useLayoutEffect: M, useMemo: M, useReducer: M, useRef: M, useState: M, useDebugValue: M, useDeferredValue: M, useTransition: M, useMutableSource: M, useSyncExternalStore: M, useId: M, unstable_isNewReconciler: false }, Ie = { readContext: Zd, useCallback: function(a, b) {
          Ne().memoizedState = [a, void 0 === b ? null : b];
          return a;
        }, useContext: Zd, useEffect: gf, useImperativeHandle: function(a, b, c) {
          c = null !== c && void 0 !== c ? c.concat([a]) : null;
          return ef(
            4194308,
            4,
            kf.bind(null, b, a),
            c
          );
        }, useLayoutEffect: function(a, b) {
          return ef(4194308, 4, a, b);
        }, useInsertionEffect: function(a, b) {
          return ef(4, 2, a, b);
        }, useMemo: function(a, b) {
          var c = Ne();
          b = void 0 === b ? null : b;
          a = a();
          c.memoizedState = [a, b];
          return a;
        }, useReducer: function(a, b, c) {
          var d = Ne();
          b = void 0 !== c ? c(b) : b;
          d.memoizedState = d.baseState = b;
          a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
          d.queue = a;
          a = a.dispatch = sf.bind(null, J, a);
          return [d.memoizedState, a];
        }, useRef: function(a) {
          var b = Ne();
          a = { current: a };
          return b.memoizedState = a;
        }, useState: bf, useDebugValue: mf, useDeferredValue: function(a) {
          return Ne().memoizedState = a;
        }, useTransition: function() {
          var a = bf(false), b = a[0];
          a = qf.bind(null, a[1]);
          Ne().memoizedState = a;
          return [b, a];
        }, useMutableSource: function() {
        }, useSyncExternalStore: function(a, b, c) {
          var d = J, e = Ne();
          if (F) {
            if (void 0 === c) throw Error(n(407));
            c = c();
          } else {
            c = b();
            if (null === N) throw Error(n(349));
            0 !== (Be & 30) || Ye(d, b, c);
          }
          e.memoizedState = c;
          var f = { value: c, getSnapshot: b };
          e.queue = f;
          gf(Ve.bind(
            null,
            d,
            f,
            a
          ), [a]);
          d.flags |= 2048;
          We(9, Xe.bind(null, d, f, c, b), void 0, null);
          return c;
        }, useId: function() {
          var a = Ne(), b = N.identifierPrefix;
          if (F) {
            var c = jd;
            var d = id;
            c = (d & ~(1 << 32 - tc(d) - 1)).toString(32) + c;
            b = ":" + b + "R" + c;
            c = Ee++;
            0 < c && (b += "H" + c.toString(32));
            b += ":";
          } else c = Fe++, b = ":" + b + "r" + c.toString(32) + ":";
          return a.memoizedState = b;
        }, unstable_isNewReconciler: false }, Je = {
          readContext: Zd,
          useCallback: nf,
          useContext: Zd,
          useEffect: Ue,
          useImperativeHandle: lf,
          useInsertionEffect: hf,
          useLayoutEffect: jf,
          useMemo: of,
          useReducer: Qe,
          useRef: df,
          useState: function() {
            return Qe(Pe);
          },
          useDebugValue: mf,
          useDeferredValue: function(a) {
            var b = Oe();
            return pf(b, K.memoizedState, a);
          },
          useTransition: function() {
            var a = Qe(Pe)[0], b = Oe().memoizedState;
            return [a, b];
          },
          useMutableSource: Se,
          useSyncExternalStore: Te,
          useId: rf,
          unstable_isNewReconciler: false
        }, Ke = { readContext: Zd, useCallback: nf, useContext: Zd, useEffect: Ue, useImperativeHandle: lf, useInsertionEffect: hf, useLayoutEffect: jf, useMemo: of, useReducer: Re, useRef: df, useState: function() {
          return Re(Pe);
        }, useDebugValue: mf, useDeferredValue: function(a) {
          var b = Oe();
          return null === K ? b.memoizedState = a : pf(b, K.memoizedState, a);
        }, useTransition: function() {
          var a = Re(Pe)[0], b = Oe().memoizedState;
          return [a, b];
        }, useMutableSource: Se, useSyncExternalStore: Te, useId: rf, unstable_isNewReconciler: false };
        function xf(a, b) {
          if (a && a.defaultProps) {
            b = ca({}, b);
            a = a.defaultProps;
            for (var c in a) void 0 === b[c] && (b[c] = a[c]);
            return b;
          }
          return b;
        }
        function yf(a, b, c, d) {
          b = a.memoizedState;
          c = c(d, b);
          c = null === c || void 0 === c ? b : ca({}, b, c);
          a.memoizedState = c;
          0 === a.lanes && (a.updateQueue.baseState = c);
        }
        var zf = { isMounted: function(a) {
          return (a = a._reactInternals) ? wa(a) === a : false;
        }, enqueueSetState: function(a, b, c) {
          a = a._reactInternals;
          var d = O(), e = tf(a), f = ge(d, e);
          f.payload = b;
          void 0 !== c && null !== c && (f.callback = c);
          b = he(a, f, e);
          null !== b && (af(b, a, e, d), ie(b, a, e));
        }, enqueueReplaceState: function(a, b, c) {
          a = a._reactInternals;
          var d = O(), e = tf(a), f = ge(d, e);
          f.tag = 1;
          f.payload = b;
          void 0 !== c && null !== c && (f.callback = c);
          b = he(a, f, e);
          null !== b && (af(b, a, e, d), ie(b, a, e));
        }, enqueueForceUpdate: function(a, b) {
          a = a._reactInternals;
          var c = O(), d = tf(a), e = ge(c, d);
          e.tag = 2;
          void 0 !== b && null !== b && (e.callback = b);
          b = he(a, e, d);
          null !== b && (af(b, a, d, c), ie(b, a, d));
        } };
        function Af(a, b, c, d, e, f, g) {
          a = a.stateNode;
          return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Dd(c, d) || !Dd(e, f) : true;
        }
        function Bf(a, b, c) {
          var d = false, e = jc;
          var f = b.contextType;
          "object" === typeof f && null !== f ? f = Zd(f) : (e = A(b) ? kc : x.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? mc(a, e) : jc);
          b = new b(c, f);
          a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
          b.updater = zf;
          a.stateNode = b;
          b._reactInternals = a;
          d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
          return b;
        }
        function Cf(a, b, c, d) {
          a = b.state;
          "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
          "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
          b.state !== a && zf.enqueueReplaceState(b, b.state, null);
        }
        function Df(a, b, c, d) {
          var e = a.stateNode;
          e.props = c;
          e.state = a.memoizedState;
          e.refs = {};
          ee(a);
          var f = b.contextType;
          "object" === typeof f && null !== f ? e.context = Zd(f) : (f = A(b) ? kc : x.current, e.context = mc(a, f));
          e.state = a.memoizedState;
          f = b.getDerivedStateFromProps;
          "function" === typeof f && (yf(a, b, f, c), e.state = a.memoizedState);
          "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && zf.enqueueReplaceState(e, e.state, null), ke(a, c, e, d), e.state = a.memoizedState);
          "function" === typeof e.componentDidMount && (a.flags |= 4194308);
        }
        function Ef(a, b) {
          try {
            var c = "", d = b;
            do
              c += Ed(d), d = d.return;
            while (d);
            var e = c;
          } catch (f) {
            e = "\nError generating stack: " + f.message + "\n" + f.stack;
          }
          return { value: a, source: b, stack: e, digest: null };
        }
        function Ff(a, b, c) {
          return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
        }
        function Gf(a, b) {
          try {
            console.error(b.value);
          } catch (c) {
            setTimeout(function() {
              throw c;
            });
          }
        }
        var Hf = "function" === typeof WeakMap ? WeakMap : Map;
        function If(a, b, c) {
          c = ge(-1, c);
          c.tag = 3;
          c.payload = { element: null };
          var d = b.value;
          c.callback = function() {
            Jf || (Jf = true, Kf = d);
            Gf(a, b);
          };
          return c;
        }
        function Lf(a, b, c) {
          c = ge(-1, c);
          c.tag = 3;
          var d = a.type.getDerivedStateFromError;
          if ("function" === typeof d) {
            var e = b.value;
            c.payload = function() {
              return d(e);
            };
            c.callback = function() {
              Gf(a, b);
            };
          }
          var f = a.stateNode;
          null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
            Gf(a, b);
            "function" !== typeof d && (null === Mf ? Mf = /* @__PURE__ */ new Set([this]) : Mf.add(this));
            var c2 = b.stack;
            this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
          });
          return c;
        }
        function Nf(a, b, c) {
          var d = a.pingCache;
          if (null === d) {
            d = a.pingCache = new Hf();
            var e = /* @__PURE__ */ new Set();
            d.set(b, e);
          } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
          e.has(c) || (e.add(c), a = Of.bind(null, a, b, c), b.then(a, a));
        }
        function Pf(a) {
          do {
            var b;
            if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
            if (b) return a;
            a = a.return;
          } while (null !== a);
          return null;
        }
        function Qf(a, b, c, d, e) {
          if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = ge(-1, 1), b.tag = 2, he(c, b, 1))), c.lanes |= 1), a;
          a.flags |= 65536;
          a.lanes = e;
          return a;
        }
        var Rf = da.ReactCurrentOwner, G = false;
        function P(a, b, c, d) {
          b.child = null === a ? Pd(b, null, c, d) : Od(b, a.child, c, d);
        }
        function Sf(a, b, c, d, e) {
          c = c.render;
          var f = b.ref;
          Yd(b, e);
          d = He(a, b, c, d, f, e);
          c = Me();
          if (null !== a && !G) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Tf(a, b, e);
          F && c && md(b);
          b.flags |= 1;
          P(a, b, d, e);
          return b.child;
        }
        function Uf(a, b, c, d, e) {
          if (null === a) {
            var f = c.type;
            if ("function" === typeof f && !Vf(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, Wf(a, b, f, d, e);
            a = Ld(c.type, null, d, b, b.mode, e);
            a.ref = b.ref;
            a.return = b;
            return b.child = a;
          }
          f = a.child;
          if (0 === (a.lanes & e)) {
            var g = f.memoizedProps;
            c = c.compare;
            c = null !== c ? c : Dd;
            if (c(g, d) && a.ref === b.ref) return Tf(a, b, e);
          }
          b.flags |= 1;
          a = Jd(f, d);
          a.ref = b.ref;
          a.return = b;
          return b.child = a;
        }
        function Wf(a, b, c, d, e) {
          if (null !== a) {
            var f = a.memoizedProps;
            if (Dd(f, d) && a.ref === b.ref) if (G = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (G = true);
            else return b.lanes = a.lanes, Tf(a, b, e);
          }
          return Xf(a, b, c, d, e);
        }
        function Yf(a, b, c) {
          var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
          if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, v(Zf, $f), $f |= c;
          else {
            if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, v(Zf, $f), $f |= a, null;
            b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
            d = null !== f ? f.baseLanes : c;
            v(Zf, $f);
            $f |= d;
          }
          else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, v(Zf, $f), $f |= d;
          P(a, b, e, c);
          return b.child;
        }
        function ag(a, b) {
          var c = b.ref;
          if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
        }
        function Xf(a, b, c, d, e) {
          var f = A(c) ? kc : x.current;
          f = mc(b, f);
          Yd(b, e);
          c = He(a, b, c, d, f, e);
          d = Me();
          if (null !== a && !G) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Tf(a, b, e);
          F && d && md(b);
          b.flags |= 1;
          P(a, b, c, e);
          return b.child;
        }
        function bg(a, b, c, d, e) {
          if (A(c)) {
            var f = true;
            qc(b);
          } else f = false;
          Yd(b, e);
          if (null === b.stateNode) cg(a, b), Bf(b, c, d), Df(b, c, d, e), d = true;
          else if (null === a) {
            var g = b.stateNode, h = b.memoizedProps;
            g.props = h;
            var k = g.context, l = c.contextType;
            "object" === typeof l && null !== l ? l = Zd(l) : (l = A(c) ? kc : x.current, l = mc(b, l));
            var m = c.getDerivedStateFromProps, r = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
            r || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Cf(b, g, d, l);
            de = false;
            var p = b.memoizedState;
            g.state = p;
            ke(b, d, g, e);
            k = b.memoizedState;
            h !== d || p !== k || z.current || de ? ("function" === typeof m && (yf(b, c, m, d), k = b.memoizedState), (h = de || Af(b, c, h, d, p, k, l)) ? (r || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
          } else {
            g = b.stateNode;
            fe(a, b);
            h = b.memoizedProps;
            l = b.type === b.elementType ? h : xf(b.type, h);
            g.props = l;
            r = b.pendingProps;
            p = g.context;
            k = c.contextType;
            "object" === typeof k && null !== k ? k = Zd(k) : (k = A(c) ? kc : x.current, k = mc(b, k));
            var B = c.getDerivedStateFromProps;
            (m = "function" === typeof B || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== r || p !== k) && Cf(b, g, d, k);
            de = false;
            p = b.memoizedState;
            g.state = p;
            ke(b, d, g, e);
            var w = b.memoizedState;
            h !== r || p !== w || z.current || de ? ("function" === typeof B && (yf(b, c, B, d), w = b.memoizedState), (l = de || Af(b, c, l, d, p, w, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, w, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, w, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = w), g.props = d, g.state = w, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && p === a.memoizedState || (b.flags |= 1024), d = false);
          }
          return dg(a, b, c, d, f, e);
        }
        function dg(a, b, c, d, e, f) {
          ag(a, b);
          var g = 0 !== (b.flags & 128);
          if (!d && !g) return e && rc(b, c, false), Tf(a, b, f);
          d = b.stateNode;
          Rf.current = b;
          var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
          b.flags |= 1;
          null !== a && g ? (b.child = Od(b, a.child, null, f), b.child = Od(b, null, h, f)) : P(a, b, h, f);
          b.memoizedState = d.state;
          e && rc(b, c, true);
          return b.child;
        }
        function eg(a) {
          var b = a.stateNode;
          b.pendingContext ? oc(a, b.pendingContext, b.pendingContext !== b.context) : b.context && oc(a, b.context, false);
          se(a, b.containerInfo);
        }
        function fg(a, b, c, d, e) {
          Ad();
          Bd(e);
          b.flags |= 256;
          P(a, b, c, d);
          return b.child;
        }
        var gg = { dehydrated: null, treeContext: null, retryLane: 0 };
        function hg(a) {
          return { baseLanes: a, cachePool: null, transitions: null };
        }
        function ig(a, b, c) {
          var d = b.pendingProps, e = I.current, f = false, g = 0 !== (b.flags & 128), h;
          (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
          if (h) f = true, b.flags &= -129;
          else if (null === a || null !== a.memoizedState) e |= 1;
          v(I, e & 1);
          if (null === a) {
            wd(b);
            a = b.memoizedState;
            if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : Kb(a) ? b.lanes = 8 : b.lanes = 1073741824, null;
            g = d.children;
            a = d.fallback;
            return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = jg(g, d, 0, null), a = Nd(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = hg(c), b.memoizedState = gg, a) : kg(b, g);
          }
          e = a.memoizedState;
          if (null !== e && (h = e.dehydrated, null !== h)) return lg(a, b, g, d, h, e, c);
          if (f) {
            f = d.fallback;
            g = b.mode;
            e = a.child;
            h = e.sibling;
            var k = { mode: "hidden", children: d.children };
            0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Jd(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
            null !== h ? f = Jd(h, f) : (f = Nd(f, g, c, null), f.flags |= 2);
            f.return = b;
            d.return = b;
            d.sibling = f;
            b.child = d;
            d = f;
            f = b.child;
            g = a.child.memoizedState;
            g = null === g ? hg(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
            f.memoizedState = g;
            f.childLanes = a.childLanes & ~c;
            b.memoizedState = gg;
            return d;
          }
          f = a.child;
          a = f.sibling;
          d = Jd(f, { mode: "visible", children: d.children });
          0 === (b.mode & 1) && (d.lanes = c);
          d.return = b;
          d.sibling = null;
          null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
          b.child = d;
          b.memoizedState = null;
          return d;
        }
        function kg(a, b) {
          b = jg({ mode: "visible", children: b }, a.mode, 0, null);
          b.return = a;
          return a.child = b;
        }
        function mg(a, b, c, d) {
          null !== d && Bd(d);
          Od(b, a.child, null, c);
          a = kg(b, b.pendingProps.children);
          a.flags |= 2;
          b.memoizedState = null;
          return a;
        }
        function lg(a, b, c, d, e, f, g) {
          if (c) {
            if (b.flags & 256) return b.flags &= -257, d = Ff(Error(n(422))), mg(a, b, g, d);
            if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
            f = d.fallback;
            e = b.mode;
            d = jg({ mode: "visible", children: d.children }, e, 0, null);
            f = Nd(f, e, g, null);
            f.flags |= 2;
            d.return = b;
            f.return = b;
            d.sibling = f;
            b.child = d;
            0 !== (b.mode & 1) && Od(b, a.child, null, g);
            b.child.memoizedState = hg(g);
            b.memoizedState = gg;
            return f;
          }
          if (0 === (b.mode & 1)) return mg(a, b, g, null);
          if (Kb(e)) return d = Lb(e).digest, f = Error(n(419)), d = Ff(
            f,
            d,
            void 0
          ), mg(a, b, g, d);
          c = 0 !== (g & a.childLanes);
          if (G || c) {
            d = N;
            if (null !== d) {
              switch (g & -g) {
                case 4:
                  e = 2;
                  break;
                case 16:
                  e = 8;
                  break;
                case 64:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                case 67108864:
                  e = 32;
                  break;
                case 536870912:
                  e = 268435456;
                  break;
                default:
                  e = 0;
              }
              e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
              0 !== e && e !== f.retryLane && (f.retryLane = e, ce(a, e), af(
                d,
                a,
                e,
                -1
              ));
            }
            ng();
            d = Ff(Error(n(421)));
            return mg(a, b, g, d);
          }
          if (Jb(e)) return b.flags |= 128, b.child = a.child, b = og.bind(null, a), Mb(e, b), null;
          a = f.treeContext;
          Va && (pd = Qb(e), od = b, F = true, rd = null, qd = false, null !== a && (fd[gd++] = id, fd[gd++] = jd, fd[gd++] = hd, id = a.id, jd = a.overflow, hd = b));
          b = kg(b, d.children);
          b.flags |= 4096;
          return b;
        }
        function pg(a, b, c) {
          a.lanes |= b;
          var d = a.alternate;
          null !== d && (d.lanes |= b);
          Xd(a.return, b, c);
        }
        function qg(a, b, c, d, e) {
          var f = a.memoizedState;
          null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
        }
        function rg(a, b, c) {
          var d = b.pendingProps, e = d.revealOrder, f = d.tail;
          P(a, b, d.children, c);
          d = I.current;
          if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
          else {
            if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
              if (13 === a.tag) null !== a.memoizedState && pg(a, c, b);
              else if (19 === a.tag) pg(a, c, b);
              else if (null !== a.child) {
                a.child.return = a;
                a = a.child;
                continue;
              }
              if (a === b) break a;
              for (; null === a.sibling; ) {
                if (null === a.return || a.return === b) break a;
                a = a.return;
              }
              a.sibling.return = a.return;
              a = a.sibling;
            }
            d &= 1;
          }
          v(I, d);
          if (0 === (b.mode & 1)) b.memoizedState = null;
          else switch (e) {
            case "forwards":
              c = b.child;
              for (e = null; null !== c; ) a = c.alternate, null !== a && null === we(a) && (e = c), c = c.sibling;
              c = e;
              null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
              qg(b, false, e, c, f);
              break;
            case "backwards":
              c = null;
              e = b.child;
              for (b.child = null; null !== e; ) {
                a = e.alternate;
                if (null !== a && null === we(a)) {
                  b.child = e;
                  break;
                }
                a = e.sibling;
                e.sibling = c;
                c = e;
                e = a;
              }
              qg(b, true, c, null, f);
              break;
            case "together":
              qg(b, false, null, null, void 0);
              break;
            default:
              b.memoizedState = null;
          }
          return b.child;
        }
        function cg(a, b) {
          0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
        }
        function Tf(a, b, c) {
          null !== a && (b.dependencies = a.dependencies);
          le |= b.lanes;
          if (0 === (c & b.childLanes)) return null;
          if (null !== a && b.child !== a.child) throw Error(n(153));
          if (null !== b.child) {
            a = b.child;
            c = Jd(a, a.pendingProps);
            b.child = c;
            for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Jd(a, a.pendingProps), c.return = b;
            c.sibling = null;
          }
          return b.child;
        }
        function sg(a, b, c) {
          switch (b.tag) {
            case 3:
              eg(b);
              Ad();
              break;
            case 5:
              ue(b);
              break;
            case 1:
              A(b.type) && qc(b);
              break;
            case 4:
              se(b, b.stateNode.containerInfo);
              break;
            case 10:
              Vd(b, b.type._context, b.memoizedProps.value);
              break;
            case 13:
              var d = b.memoizedState;
              if (null !== d) {
                if (null !== d.dehydrated) return v(I, I.current & 1), b.flags |= 128, null;
                if (0 !== (c & b.child.childLanes)) return ig(a, b, c);
                v(I, I.current & 1);
                a = Tf(a, b, c);
                return null !== a ? a.sibling : null;
              }
              v(I, I.current & 1);
              break;
            case 19:
              d = 0 !== (c & b.childLanes);
              if (0 !== (a.flags & 128)) {
                if (d) return rg(
                  a,
                  b,
                  c
                );
                b.flags |= 128;
              }
              var e = b.memoizedState;
              null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
              v(I, I.current);
              if (d) break;
              else return null;
            case 22:
            case 23:
              return b.lanes = 0, Yf(a, b, c);
          }
          return Tf(a, b, c);
        }
        function tg(a) {
          a.flags |= 4;
        }
        function ug(a, b) {
          if (null !== a && a.child === b.child) return true;
          if (0 !== (b.flags & 16)) return false;
          for (a = b.child; null !== a; ) {
            if (0 !== (a.flags & 12854) || 0 !== (a.subtreeFlags & 12854)) return false;
            a = a.sibling;
          }
          return true;
        }
        var vg, wg, xg, yg;
        if (Ta) vg = function(a, b) {
          for (var c = b.child; null !== c; ) {
            if (5 === c.tag || 6 === c.tag) Ka(a, c.stateNode);
            else if (4 !== c.tag && null !== c.child) {
              c.child.return = c;
              c = c.child;
              continue;
            }
            if (c === b) break;
            for (; null === c.sibling; ) {
              if (null === c.return || c.return === b) return;
              c = c.return;
            }
            c.sibling.return = c.return;
            c = c.sibling;
          }
        }, wg = function() {
        }, xg = function(a, b, c, d, e) {
          a = a.memoizedProps;
          if (a !== d) {
            var f = b.stateNode, g = re(oe.current);
            c = Ma(f, c, a, d, e, g);
            (b.updateQueue = c) && tg(b);
          }
        }, yg = function(a, b, c, d) {
          c !== d && tg(b);
        };
        else if (Ua) {
          vg = function(a, b, c, d) {
            for (var e = b.child; null !== e; ) {
              if (5 === e.tag) {
                var f = e.stateNode;
                c && d && (f = Eb(f, e.type, e.memoizedProps, e));
                Ka(a, f);
              } else if (6 === e.tag) f = e.stateNode, c && d && (f = Fb(f, e.memoizedProps, e)), Ka(a, f);
              else if (4 !== e.tag) {
                if (22 === e.tag && null !== e.memoizedState) f = e.child, null !== f && (f.return = e), vg(a, e, true, true);
                else if (null !== e.child) {
                  e.child.return = e;
                  e = e.child;
                  continue;
                }
              }
              if (e === b) break;
              for (; null === e.sibling; ) {
                if (null === e.return || e.return === b) return;
                e = e.return;
              }
              e.sibling.return = e.return;
              e = e.sibling;
            }
          };
          var zg = function(a, b, c, d) {
            for (var e = b.child; null !== e; ) {
              if (5 === e.tag) {
                var f = e.stateNode;
                c && d && (f = Eb(f, e.type, e.memoizedProps, e));
                Ab(a, f);
              } else if (6 === e.tag) f = e.stateNode, c && d && (f = Fb(f, e.memoizedProps, e)), Ab(a, f);
              else if (4 !== e.tag) {
                if (22 === e.tag && null !== e.memoizedState) f = e.child, null !== f && (f.return = e), zg(a, e, true, true);
                else if (null !== e.child) {
                  e.child.return = e;
                  e = e.child;
                  continue;
                }
              }
              if (e === b) break;
              for (; null === e.sibling; ) {
                if (null === e.return || e.return === b) return;
                e = e.return;
              }
              e.sibling.return = e.return;
              e = e.sibling;
            }
          };
          wg = function(a, b) {
            var c = b.stateNode;
            if (!ug(a, b)) {
              a = c.containerInfo;
              var d = zb(a);
              zg(d, b, false, false);
              c.pendingChildren = d;
              tg(b);
              Bb(a, d);
            }
          };
          xg = function(a, b, c, d, e) {
            var f = a.stateNode, g = a.memoizedProps;
            if ((a = ug(a, b)) && g === d) b.stateNode = f;
            else {
              var h = b.stateNode, k = re(oe.current), l = null;
              g !== d && (l = Ma(h, c, g, d, e, k));
              a && null === l ? b.stateNode = f : (f = yb(f, l, c, g, d, b, a, h), La(f, c, d, e, k) && tg(b), b.stateNode = f, a ? tg(b) : vg(f, b, false, false));
            }
          };
          yg = function(a, b, c, d) {
            c !== d ? (a = re(qe.current), c = re(oe.current), b.stateNode = Oa(d, a, c, b), tg(b)) : b.stateNode = a.stateNode;
          };
        } else wg = function() {
        }, xg = function() {
        }, yg = function() {
        };
        function Ag(a, b) {
          if (!F) switch (a.tailMode) {
            case "hidden":
              b = a.tail;
              for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
              null === c ? a.tail = null : c.sibling = null;
              break;
            case "collapsed":
              c = a.tail;
              for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
              null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
          }
        }
        function Q(a) {
          var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
          if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
          else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
          a.subtreeFlags |= d;
          a.childLanes = c;
          return b;
        }
        function Bg(a, b, c) {
          var d = b.pendingProps;
          nd(b);
          switch (b.tag) {
            case 2:
            case 16:
            case 15:
            case 0:
            case 11:
            case 7:
            case 8:
            case 12:
            case 9:
            case 14:
              return Q(b), null;
            case 1:
              return A(b.type) && nc(), Q(b), null;
            case 3:
              c = b.stateNode;
              te();
              q(z);
              q(x);
              ye();
              c.pendingContext && (c.context = c.pendingContext, c.pendingContext = null);
              if (null === a || null === a.child) yd(b) ? tg(b) : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== rd && (Cg(rd), rd = null));
              wg(a, b);
              Q(b);
              return null;
            case 5:
              ve(b);
              c = re(qe.current);
              var e = b.type;
              if (null !== a && null != b.stateNode) xg(a, b, e, d, c), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
              else {
                if (!d) {
                  if (null === b.stateNode) throw Error(n(166));
                  Q(b);
                  return null;
                }
                a = re(oe.current);
                if (yd(b)) {
                  if (!Va) throw Error(n(175));
                  a = Rb(b.stateNode, b.type, b.memoizedProps, c, a, b, !qd);
                  b.updateQueue = a;
                  null !== a && tg(b);
                } else {
                  var f = Ja(e, d, c, a, b);
                  vg(f, b, false, false);
                  b.stateNode = f;
                  La(f, e, d, c, a) && tg(b);
                }
                null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
              }
              Q(b);
              return null;
            case 6:
              if (a && null != b.stateNode) yg(a, b, a.memoizedProps, d);
              else {
                if ("string" !== typeof d && null === b.stateNode) throw Error(n(166));
                a = re(qe.current);
                c = re(oe.current);
                if (yd(b)) {
                  if (!Va) throw Error(n(176));
                  a = b.stateNode;
                  c = b.memoizedProps;
                  if (d = Sb(a, c, b, !qd)) {
                    if (e = od, null !== e) switch (e.tag) {
                      case 3:
                        $b(e.stateNode.containerInfo, a, c, 0 !== (e.mode & 1));
                        break;
                      case 5:
                        ac(e.type, e.memoizedProps, e.stateNode, a, c, 0 !== (e.mode & 1));
                    }
                  }
                  d && tg(b);
                } else b.stateNode = Oa(d, a, c, b);
              }
              Q(b);
              return null;
            case 13:
              q(I);
              d = b.memoizedState;
              if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
                if (F && null !== pd && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) zd(), Ad(), b.flags |= 98560, e = false;
                else if (e = yd(b), null !== d && null !== d.dehydrated) {
                  if (null === a) {
                    if (!e) throw Error(n(318));
                    if (!Va) throw Error(n(344));
                    e = b.memoizedState;
                    e = null !== e ? e.dehydrated : null;
                    if (!e) throw Error(n(317));
                    Tb(e, b);
                  } else Ad(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
                  Q(b);
                  e = false;
                } else null !== rd && (Cg(rd), rd = null), e = true;
                if (!e) return b.flags & 65536 ? b : null;
              }
              if (0 !== (b.flags & 128)) return b.lanes = c, b;
              c = null !== d;
              c !== (null !== a && null !== a.memoizedState) && c && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (I.current & 1) ? 0 === R && (R = 3) : ng()));
              null !== b.updateQueue && (b.flags |= 4);
              Q(b);
              return null;
            case 4:
              return te(), wg(a, b), null === a && Xa(b.stateNode.containerInfo), Q(b), null;
            case 10:
              return Wd(b.type._context), Q(b), null;
            case 17:
              return A(b.type) && nc(), Q(b), null;
            case 19:
              q(I);
              e = b.memoizedState;
              if (null === e) return Q(b), null;
              d = 0 !== (b.flags & 128);
              f = e.rendering;
              if (null === f) if (d) Ag(e, false);
              else {
                if (0 !== R || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
                  f = we(a);
                  if (null !== f) {
                    b.flags |= 128;
                    Ag(e, false);
                    a = f.updateQueue;
                    null !== a && (b.updateQueue = a, b.flags |= 4);
                    b.subtreeFlags = 0;
                    a = c;
                    for (c = b.child; null !== c; ) d = c, e = a, d.flags &= 14680066, f = d.alternate, null === f ? (d.childLanes = 0, d.lanes = e, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = f.childLanes, d.lanes = f.lanes, d.child = f.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = f.memoizedProps, d.memoizedState = f.memoizedState, d.updateQueue = f.updateQueue, d.type = f.type, e = f.dependencies, d.dependencies = null === e ? null : { lanes: e.lanes, firstContext: e.firstContext }), c = c.sibling;
                    v(I, I.current & 1 | 2);
                    return b.child;
                  }
                  a = a.sibling;
                }
                null !== e.tail && D() > Dg && (b.flags |= 128, d = true, Ag(e, false), b.lanes = 4194304);
              }
              else {
                if (!d) if (a = we(f), null !== a) {
                  if (b.flags |= 128, d = true, a = a.updateQueue, null !== a && (b.updateQueue = a, b.flags |= 4), Ag(e, true), null === e.tail && "hidden" === e.tailMode && !f.alternate && !F) return Q(b), null;
                } else 2 * D() - e.renderingStartTime > Dg && 1073741824 !== c && (b.flags |= 128, d = true, Ag(e, false), b.lanes = 4194304);
                e.isBackwards ? (f.sibling = b.child, b.child = f) : (a = e.last, null !== a ? a.sibling = f : b.child = f, e.last = f);
              }
              if (null !== e.tail) return b = e.tail, e.rendering = b, e.tail = b.sibling, e.renderingStartTime = D(), b.sibling = null, a = I.current, v(I, d ? a & 1 | 2 : a & 1), b;
              Q(b);
              return null;
            case 22:
            case 23:
              return Eg(), c = null !== b.memoizedState, null !== a && null !== a.memoizedState !== c && (b.flags |= 8192), c && 0 !== (b.mode & 1) ? 0 !== ($f & 1073741824) && (Q(b), Ta && b.subtreeFlags & 6 && (b.flags |= 8192)) : Q(b), null;
            case 24:
              return null;
            case 25:
              return null;
          }
          throw Error(n(
            156,
            b.tag
          ));
        }
        function Fg(a, b) {
          nd(b);
          switch (b.tag) {
            case 1:
              return A(b.type) && nc(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
            case 3:
              return te(), q(z), q(x), ye(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
            case 5:
              return ve(b), null;
            case 13:
              q(I);
              a = b.memoizedState;
              if (null !== a && null !== a.dehydrated) {
                if (null === b.alternate) throw Error(n(340));
                Ad();
              }
              a = b.flags;
              return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
            case 19:
              return q(I), null;
            case 4:
              return te(), null;
            case 10:
              return Wd(b.type._context), null;
            case 22:
            case 23:
              return Eg(), null;
            case 24:
              return null;
            default:
              return null;
          }
        }
        var Gg = false, S = false, Hg = "function" === typeof WeakSet ? WeakSet : Set, T = null;
        function Ig(a, b) {
          var c = a.ref;
          if (null !== c) if ("function" === typeof c) try {
            c(null);
          } catch (d) {
            U(a, b, d);
          }
          else c.current = null;
        }
        function Jg(a, b, c) {
          try {
            c();
          } catch (d) {
            U(a, b, d);
          }
        }
        var Kg = false;
        function Lg(a, b) {
          Ha(a.containerInfo);
          for (T = b; null !== T; ) if (a = T, b = a.child, 0 !== (a.subtreeFlags & 1028) && null !== b) b.return = a, T = b;
          else for (; null !== T; ) {
            a = T;
            try {
              var c = a.alternate;
              if (0 !== (a.flags & 1024)) switch (a.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (null !== c) {
                    var d = c.memoizedProps, e = c.memoizedState, f = a.stateNode, g = f.getSnapshotBeforeUpdate(a.elementType === a.type ? d : xf(a.type, d), e);
                    f.__reactInternalSnapshotBeforeUpdate = g;
                  }
                  break;
                case 3:
                  Ta && xb(a.stateNode.containerInfo);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(n(163));
              }
            } catch (h) {
              U(a, a.return, h);
            }
            b = a.sibling;
            if (null !== b) {
              b.return = a.return;
              T = b;
              break;
            }
            T = a.return;
          }
          c = Kg;
          Kg = false;
          return c;
        }
        function Mg(a, b, c) {
          var d = b.updateQueue;
          d = null !== d ? d.lastEffect : null;
          if (null !== d) {
            var e = d = d.next;
            do {
              if ((e.tag & a) === a) {
                var f = e.destroy;
                e.destroy = void 0;
                void 0 !== f && Jg(b, c, f);
              }
              e = e.next;
            } while (e !== d);
          }
        }
        function Ng(a, b) {
          b = b.updateQueue;
          b = null !== b ? b.lastEffect : null;
          if (null !== b) {
            var c = b = b.next;
            do {
              if ((c.tag & a) === a) {
                var d = c.create;
                c.destroy = d();
              }
              c = c.next;
            } while (c !== b);
          }
        }
        function Og(a) {
          var b = a.ref;
          if (null !== b) {
            var c = a.stateNode;
            switch (a.tag) {
              case 5:
                a = Ea(c);
                break;
              default:
                a = c;
            }
            "function" === typeof b ? b(a) : b.current = a;
          }
        }
        function Pg(a) {
          var b = a.alternate;
          null !== b && (a.alternate = null, Pg(b));
          a.child = null;
          a.deletions = null;
          a.sibling = null;
          5 === a.tag && (b = a.stateNode, null !== b && Za(b));
          a.stateNode = null;
          a.return = null;
          a.dependencies = null;
          a.memoizedProps = null;
          a.memoizedState = null;
          a.pendingProps = null;
          a.stateNode = null;
          a.updateQueue = null;
        }
        function Qg(a) {
          return 5 === a.tag || 3 === a.tag || 4 === a.tag;
        }
        function Rg(a) {
          a: for (; ; ) {
            for (; null === a.sibling; ) {
              if (null === a.return || Qg(a.return)) return null;
              a = a.return;
            }
            a.sibling.return = a.return;
            for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
              if (a.flags & 2) continue a;
              if (null === a.child || 4 === a.tag) continue a;
              else a.child.return = a, a = a.child;
            }
            if (!(a.flags & 2)) return a.stateNode;
          }
        }
        function Sg(a, b, c) {
          var d = a.tag;
          if (5 === d || 6 === d) a = a.stateNode, b ? pb(c, a, b) : kb(c, a);
          else if (4 !== d && (a = a.child, null !== a)) for (Sg(a, b, c), a = a.sibling; null !== a; ) Sg(a, b, c), a = a.sibling;
        }
        function Tg(a, b, c) {
          var d = a.tag;
          if (5 === d || 6 === d) a = a.stateNode, b ? ob(c, a, b) : jb(c, a);
          else if (4 !== d && (a = a.child, null !== a)) for (Tg(a, b, c), a = a.sibling; null !== a; ) Tg(a, b, c), a = a.sibling;
        }
        var V = null, Ug = false;
        function Vg(a, b, c) {
          for (c = c.child; null !== c; ) Wg(a, b, c), c = c.sibling;
        }
        function Wg(a, b, c) {
          if (Sc && "function" === typeof Sc.onCommitFiberUnmount) try {
            Sc.onCommitFiberUnmount(Rc, c);
          } catch (h) {
          }
          switch (c.tag) {
            case 5:
              S || Ig(c, b);
            case 6:
              if (Ta) {
                var d = V, e = Ug;
                V = null;
                Vg(a, b, c);
                V = d;
                Ug = e;
                null !== V && (Ug ? rb(V, c.stateNode) : qb(V, c.stateNode));
              } else Vg(a, b, c);
              break;
            case 18:
              Ta && null !== V && (Ug ? Yb(V, c.stateNode) : Xb(V, c.stateNode));
              break;
            case 4:
              Ta ? (d = V, e = Ug, V = c.stateNode.containerInfo, Ug = true, Vg(a, b, c), V = d, Ug = e) : (Ua && (d = c.stateNode.containerInfo, e = zb(d), Cb(d, e)), Vg(a, b, c));
              break;
            case 0:
            case 11:
            case 14:
            case 15:
              if (!S && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
                e = d = d.next;
                do {
                  var f = e, g = f.destroy;
                  f = f.tag;
                  void 0 !== g && (0 !== (f & 2) ? Jg(c, b, g) : 0 !== (f & 4) && Jg(c, b, g));
                  e = e.next;
                } while (e !== d);
              }
              Vg(a, b, c);
              break;
            case 1:
              if (!S && (Ig(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
                d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
              } catch (h) {
                U(c, b, h);
              }
              Vg(a, b, c);
              break;
            case 21:
              Vg(a, b, c);
              break;
            case 22:
              c.mode & 1 ? (S = (d = S) || null !== c.memoizedState, Vg(a, b, c), S = d) : Vg(a, b, c);
              break;
            default:
              Vg(
                a,
                b,
                c
              );
          }
        }
        function Xg(a) {
          var b = a.updateQueue;
          if (null !== b) {
            a.updateQueue = null;
            var c = a.stateNode;
            null === c && (c = a.stateNode = new Hg());
            b.forEach(function(b2) {
              var d = Yg.bind(null, a, b2);
              c.has(b2) || (c.add(b2), b2.then(d, d));
            });
          }
        }
        function Zg(a, b) {
          var c = b.deletions;
          if (null !== c) for (var d = 0; d < c.length; d++) {
            var e = c[d];
            try {
              var f = a, g = b;
              if (Ta) {
                var h = g;
                a: for (; null !== h; ) {
                  switch (h.tag) {
                    case 5:
                      V = h.stateNode;
                      Ug = false;
                      break a;
                    case 3:
                      V = h.stateNode.containerInfo;
                      Ug = true;
                      break a;
                    case 4:
                      V = h.stateNode.containerInfo;
                      Ug = true;
                      break a;
                  }
                  h = h.return;
                }
                if (null === V) throw Error(n(160));
                Wg(f, g, e);
                V = null;
                Ug = false;
              } else Wg(f, g, e);
              var k = e.alternate;
              null !== k && (k.return = null);
              e.return = null;
            } catch (l) {
              U(e, b, l);
            }
          }
          if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) $g(b, a), b = b.sibling;
        }
        function $g(a, b) {
          var c = a.alternate, d = a.flags;
          switch (a.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
              Zg(b, a);
              ah(a);
              if (d & 4) {
                try {
                  Mg(3, a, a.return), Ng(3, a);
                } catch (p) {
                  U(a, a.return, p);
                }
                try {
                  Mg(5, a, a.return);
                } catch (p) {
                  U(a, a.return, p);
                }
              }
              break;
            case 1:
              Zg(b, a);
              ah(a);
              d & 512 && null !== c && Ig(c, c.return);
              break;
            case 5:
              Zg(b, a);
              ah(a);
              d & 512 && null !== c && Ig(c, c.return);
              if (Ta) {
                if (a.flags & 32) {
                  var e = a.stateNode;
                  try {
                    sb(e);
                  } catch (p) {
                    U(a, a.return, p);
                  }
                }
                if (d & 4 && (e = a.stateNode, null != e)) {
                  var f = a.memoizedProps;
                  c = null !== c ? c.memoizedProps : f;
                  d = a.type;
                  b = a.updateQueue;
                  a.updateQueue = null;
                  if (null !== b) try {
                    nb(e, b, d, c, f, a);
                  } catch (p) {
                    U(a, a.return, p);
                  }
                }
              }
              break;
            case 6:
              Zg(b, a);
              ah(a);
              if (d & 4 && Ta) {
                if (null === a.stateNode) throw Error(n(162));
                e = a.stateNode;
                f = a.memoizedProps;
                c = null !== c ? c.memoizedProps : f;
                try {
                  lb(e, c, f);
                } catch (p) {
                  U(a, a.return, p);
                }
              }
              break;
            case 3:
              Zg(b, a);
              ah(a);
              if (d & 4) {
                if (Ta && Va && null !== c && c.memoizedState.isDehydrated) try {
                  Vb(b.containerInfo);
                } catch (p) {
                  U(a, a.return, p);
                }
                if (Ua) {
                  e = b.containerInfo;
                  f = b.pendingChildren;
                  try {
                    Cb(e, f);
                  } catch (p) {
                    U(a, a.return, p);
                  }
                }
              }
              break;
            case 4:
              Zg(
                b,
                a
              );
              ah(a);
              if (d & 4 && Ua) {
                f = a.stateNode;
                e = f.containerInfo;
                f = f.pendingChildren;
                try {
                  Cb(e, f);
                } catch (p) {
                  U(a, a.return, p);
                }
              }
              break;
            case 13:
              Zg(b, a);
              ah(a);
              e = a.child;
              e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (bh = D()));
              d & 4 && Xg(a);
              break;
            case 22:
              var g = null !== c && null !== c.memoizedState;
              a.mode & 1 ? (S = (c = S) || g, Zg(b, a), S = c) : Zg(b, a);
              ah(a);
              if (d & 8192) {
                c = null !== a.memoizedState;
                if ((a.stateNode.isHidden = c) && !g && 0 !== (a.mode & 1)) for (T = a, d = a.child; null !== d; ) {
                  for (b = T = d; null !== T; ) {
                    g = T;
                    var h = g.child;
                    switch (g.tag) {
                      case 0:
                      case 11:
                      case 14:
                      case 15:
                        Mg(4, g, g.return);
                        break;
                      case 1:
                        Ig(g, g.return);
                        var k = g.stateNode;
                        if ("function" === typeof k.componentWillUnmount) {
                          var l = g, m = g.return;
                          try {
                            var r = l;
                            k.props = r.memoizedProps;
                            k.state = r.memoizedState;
                            k.componentWillUnmount();
                          } catch (p) {
                            U(l, m, p);
                          }
                        }
                        break;
                      case 5:
                        Ig(g, g.return);
                        break;
                      case 22:
                        if (null !== g.memoizedState) {
                          ch(b);
                          continue;
                        }
                    }
                    null !== h ? (h.return = g, T = h) : ch(b);
                  }
                  d = d.sibling;
                }
                if (Ta) {
                  a: if (d = null, Ta) for (b = a; ; ) {
                    if (5 === b.tag) {
                      if (null === d) {
                        d = b;
                        try {
                          e = b.stateNode, c ? tb(e) : vb(b.stateNode, b.memoizedProps);
                        } catch (p) {
                          U(a, a.return, p);
                        }
                      }
                    } else if (6 === b.tag) {
                      if (null === d) try {
                        f = b.stateNode, c ? ub(f) : wb(f, b.memoizedProps);
                      } catch (p) {
                        U(a, a.return, p);
                      }
                    } else if ((22 !== b.tag && 23 !== b.tag || null === b.memoizedState || b === a) && null !== b.child) {
                      b.child.return = b;
                      b = b.child;
                      continue;
                    }
                    if (b === a) break a;
                    for (; null === b.sibling; ) {
                      if (null === b.return || b.return === a) break a;
                      d === b && (d = null);
                      b = b.return;
                    }
                    d === b && (d = null);
                    b.sibling.return = b.return;
                    b = b.sibling;
                  }
                }
              }
              break;
            case 19:
              Zg(b, a);
              ah(a);
              d & 4 && Xg(a);
              break;
            case 21:
              break;
            default:
              Zg(b, a), ah(a);
          }
        }
        function ah(a) {
          var b = a.flags;
          if (b & 2) {
            try {
              if (Ta) {
                b: {
                  for (var c = a.return; null !== c; ) {
                    if (Qg(c)) {
                      var d = c;
                      break b;
                    }
                    c = c.return;
                  }
                  throw Error(n(160));
                }
                switch (d.tag) {
                  case 5:
                    var e = d.stateNode;
                    d.flags & 32 && (sb(e), d.flags &= -33);
                    var f = Rg(a);
                    Tg(a, f, e);
                    break;
                  case 3:
                  case 4:
                    var g = d.stateNode.containerInfo, h = Rg(a);
                    Sg(a, h, g);
                    break;
                  default:
                    throw Error(n(161));
                }
              }
            } catch (k) {
              U(a, a.return, k);
            }
            a.flags &= -3;
          }
          b & 4096 && (a.flags &= -4097);
        }
        function dh(a, b, c) {
          T = a;
          eh(a, b, c);
        }
        function eh(a, b, c) {
          for (var d = 0 !== (a.mode & 1); null !== T; ) {
            var e = T, f = e.child;
            if (22 === e.tag && d) {
              var g = null !== e.memoizedState || Gg;
              if (!g) {
                var h = e.alternate, k = null !== h && null !== h.memoizedState || S;
                h = Gg;
                var l = S;
                Gg = g;
                if ((S = k) && !l) for (T = e; null !== T; ) g = T, k = g.child, 22 === g.tag && null !== g.memoizedState ? fh(e) : null !== k ? (k.return = g, T = k) : fh(e);
                for (; null !== f; ) T = f, eh(f, b, c), f = f.sibling;
                T = e;
                Gg = h;
                S = l;
              }
              gh(a, b, c);
            } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, T = f) : gh(a, b, c);
          }
        }
        function gh(a) {
          for (; null !== T; ) {
            var b = T;
            if (0 !== (b.flags & 8772)) {
              var c = b.alternate;
              try {
                if (0 !== (b.flags & 8772)) switch (b.tag) {
                  case 0:
                  case 11:
                  case 15:
                    S || Ng(5, b);
                    break;
                  case 1:
                    var d = b.stateNode;
                    if (b.flags & 4 && !S) if (null === c) d.componentDidMount();
                    else {
                      var e = b.elementType === b.type ? c.memoizedProps : xf(b.type, c.memoizedProps);
                      d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                    }
                    var f = b.updateQueue;
                    null !== f && me(b, f, d);
                    break;
                  case 3:
                    var g = b.updateQueue;
                    if (null !== g) {
                      c = null;
                      if (null !== b.child) switch (b.child.tag) {
                        case 5:
                          c = Ea(b.child.stateNode);
                          break;
                        case 1:
                          c = b.child.stateNode;
                      }
                      me(b, g, c);
                    }
                    break;
                  case 5:
                    var h = b.stateNode;
                    null === c && b.flags & 4 && mb(h, b.type, b.memoizedProps, b);
                    break;
                  case 6:
                    break;
                  case 4:
                    break;
                  case 12:
                    break;
                  case 13:
                    if (Va && null === b.memoizedState) {
                      var k = b.alternate;
                      if (null !== k) {
                        var l = k.memoizedState;
                        if (null !== l) {
                          var m = l.dehydrated;
                          null !== m && Wb(m);
                        }
                      }
                    }
                    break;
                  case 19:
                  case 17:
                  case 21:
                  case 22:
                  case 23:
                  case 25:
                    break;
                  default:
                    throw Error(n(163));
                }
                S || b.flags & 512 && Og(b);
              } catch (r) {
                U(b, b.return, r);
              }
            }
            if (b === a) {
              T = null;
              break;
            }
            c = b.sibling;
            if (null !== c) {
              c.return = b.return;
              T = c;
              break;
            }
            T = b.return;
          }
        }
        function ch(a) {
          for (; null !== T; ) {
            var b = T;
            if (b === a) {
              T = null;
              break;
            }
            var c = b.sibling;
            if (null !== c) {
              c.return = b.return;
              T = c;
              break;
            }
            T = b.return;
          }
        }
        function fh(a) {
          for (; null !== T; ) {
            var b = T;
            try {
              switch (b.tag) {
                case 0:
                case 11:
                case 15:
                  var c = b.return;
                  try {
                    Ng(4, b);
                  } catch (k) {
                    U(b, c, k);
                  }
                  break;
                case 1:
                  var d = b.stateNode;
                  if ("function" === typeof d.componentDidMount) {
                    var e = b.return;
                    try {
                      d.componentDidMount();
                    } catch (k) {
                      U(b, e, k);
                    }
                  }
                  var f = b.return;
                  try {
                    Og(b);
                  } catch (k) {
                    U(b, f, k);
                  }
                  break;
                case 5:
                  var g = b.return;
                  try {
                    Og(b);
                  } catch (k) {
                    U(b, g, k);
                  }
              }
            } catch (k) {
              U(b, b.return, k);
            }
            if (b === a) {
              T = null;
              break;
            }
            var h = b.sibling;
            if (null !== h) {
              h.return = b.return;
              T = h;
              break;
            }
            T = b.return;
          }
        }
        var hh = 0, ih = 1, jh = 2, kh = 3, lh = 4;
        if ("function" === typeof Symbol && Symbol.for) {
          var mh = Symbol.for;
          hh = mh("selector.component");
          ih = mh("selector.has_pseudo_class");
          jh = mh("selector.role");
          kh = mh("selector.test_id");
          lh = mh("selector.text");
        }
        function nh(a) {
          var b = Wa(a);
          if (null != b) {
            if ("string" !== typeof b.memoizedProps["data-testname"]) throw Error(n(364));
            return b;
          }
          a = cb(a);
          if (null === a) throw Error(n(362));
          return a.stateNode.current;
        }
        function oh(a, b) {
          switch (b.$$typeof) {
            case hh:
              if (a.type === b.value) return true;
              break;
            case ih:
              a: {
                b = b.value;
                a = [a, 0];
                for (var c = 0; c < a.length; ) {
                  var d = a[c++], e = a[c++], f = b[e];
                  if (5 !== d.tag || !fb(d)) {
                    for (; null != f && oh(d, f); ) e++, f = b[e];
                    if (e === b.length) {
                      b = true;
                      break a;
                    } else for (d = d.child; null !== d; ) a.push(d, e), d = d.sibling;
                  }
                }
                b = false;
              }
              return b;
            case jh:
              if (5 === a.tag && gb(a.stateNode, b.value)) return true;
              break;
            case lh:
              if (5 === a.tag || 6 === a.tag) {
                if (a = eb(a), null !== a && 0 <= a.indexOf(b.value)) return true;
              }
              break;
            case kh:
              if (5 === a.tag && (a = a.memoizedProps["data-testname"], "string" === typeof a && a.toLowerCase() === b.value.toLowerCase())) return true;
              break;
            default:
              throw Error(n(365));
          }
          return false;
        }
        function ph(a) {
          switch (a.$$typeof) {
            case hh:
              return "<" + (ua(a.value) || "Unknown") + ">";
            case ih:
              return ":has(" + (ph(a) || "") + ")";
            case jh:
              return '[role="' + a.value + '"]';
            case lh:
              return '"' + a.value + '"';
            case kh:
              return '[data-testname="' + a.value + '"]';
            default:
              throw Error(n(365));
          }
        }
        function qh(a, b) {
          var c = [];
          a = [a, 0];
          for (var d = 0; d < a.length; ) {
            var e = a[d++], f = a[d++], g = b[f];
            if (5 !== e.tag || !fb(e)) {
              for (; null != g && oh(e, g); ) f++, g = b[f];
              if (f === b.length) c.push(e);
              else for (e = e.child; null !== e; ) a.push(e, f), e = e.sibling;
            }
          }
          return c;
        }
        function rh(a, b) {
          if (!bb) throw Error(n(363));
          a = nh(a);
          a = qh(a, b);
          b = [];
          a = Array.from(a);
          for (var c = 0; c < a.length; ) {
            var d = a[c++];
            if (5 === d.tag) fb(d) || b.push(d.stateNode);
            else for (d = d.child; null !== d; ) a.push(d), d = d.sibling;
          }
          return b;
        }
        var sh = Math.ceil, th = da.ReactCurrentDispatcher, uh = da.ReactCurrentOwner, W = da.ReactCurrentBatchConfig, H = 0, N = null, X = null, Z = 0, $f = 0, Zf = ic(0), R = 0, vh = null, le = 0, wh = 0, xh = 0, yh = null, zh = null, bh = 0, Dg = Infinity, Ah = null;
        function Bh() {
          Dg = D() + 500;
        }
        var Jf = false, Kf = null, Mf = null, Ch = false, Dh = null, Eh = 0, Fh = 0, Gh = null, Hh = -1, Ih = 0;
        function O() {
          return 0 !== (H & 6) ? D() : -1 !== Hh ? Hh : Hh = D();
        }
        function tf(a) {
          if (0 === (a.mode & 1)) return 1;
          if (0 !== (H & 2) && 0 !== Z) return Z & -Z;
          if (null !== Cd.transition) return 0 === Ih && (Ih = Dc()), Ih;
          a = C;
          return 0 !== a ? a : Ya();
        }
        function af(a, b, c, d) {
          if (50 < Fh) throw Fh = 0, Gh = null, Error(n(185));
          Fc(a, c, d);
          if (0 === (H & 2) || a !== N) a === N && (0 === (H & 2) && (wh |= c), 4 === R && Jh(a, Z)), Kh(a, d), 1 === c && 0 === H && 0 === (b.mode & 1) && (Bh(), Xc && ad());
        }
        function Kh(a, b) {
          var c = a.callbackNode;
          Bc(a, b);
          var d = zc(a, a === N ? Z : 0);
          if (0 === d) null !== c && Kc(c), a.callbackNode = null, a.callbackPriority = 0;
          else if (b = d & -d, a.callbackPriority !== b) {
            null != c && Kc(c);
            if (1 === b) 0 === a.tag ? $c(Lh.bind(null, a)) : Zc(Lh.bind(null, a)), $a ? ab(function() {
              0 === (H & 6) && ad();
            }) : Jc(Nc, ad), c = null;
            else {
              switch (Ic(d)) {
                case 1:
                  c = Nc;
                  break;
                case 4:
                  c = Oc;
                  break;
                case 16:
                  c = Pc;
                  break;
                case 536870912:
                  c = Qc;
                  break;
                default:
                  c = Pc;
              }
              c = Mh(c, Nh.bind(null, a));
            }
            a.callbackPriority = b;
            a.callbackNode = c;
          }
        }
        function Nh(a, b) {
          Hh = -1;
          Ih = 0;
          if (0 !== (H & 6)) throw Error(n(327));
          var c = a.callbackNode;
          if (Oh() && a.callbackNode !== c) return null;
          var d = zc(a, a === N ? Z : 0);
          if (0 === d) return null;
          if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ph(a, d);
          else {
            b = d;
            var e = H;
            H |= 2;
            var f = Qh();
            if (N !== a || Z !== b) Ah = null, Bh(), Rh(a, b);
            do
              try {
                Sh();
                break;
              } catch (h) {
                Th(a, h);
              }
            while (1);
            Ud();
            th.current = f;
            H = e;
            null !== X ? b = 0 : (N = null, Z = 0, b = R);
          }
          if (0 !== b) {
            2 === b && (e = Cc(a), 0 !== e && (d = e, b = Uh(a, e)));
            if (1 === b) throw c = vh, Rh(a, 0), Jh(a, d), Kh(a, D()), c;
            if (6 === b) Jh(a, d);
            else {
              e = a.current.alternate;
              if (0 === (d & 30) && !Vh(e) && (b = Ph(a, d), 2 === b && (f = Cc(a), 0 !== f && (d = f, b = Uh(a, f))), 1 === b)) throw c = vh, Rh(a, 0), Jh(a, d), Kh(a, D()), c;
              a.finishedWork = e;
              a.finishedLanes = d;
              switch (b) {
                case 0:
                case 1:
                  throw Error(n(345));
                case 2:
                  Wh(a, zh, Ah);
                  break;
                case 3:
                  Jh(a, d);
                  if ((d & 130023424) === d && (b = bh + 500 - D(), 10 < b)) {
                    if (0 !== zc(a, 0)) break;
                    e = a.suspendedLanes;
                    if ((e & d) !== d) {
                      O();
                      a.pingedLanes |= a.suspendedLanes & e;
                      break;
                    }
                    a.timeoutHandle = Pa(Wh.bind(null, a, zh, Ah), b);
                    break;
                  }
                  Wh(a, zh, Ah);
                  break;
                case 4:
                  Jh(a, d);
                  if ((d & 4194240) === d) break;
                  b = a.eventTimes;
                  for (e = -1; 0 < d; ) {
                    var g = 31 - tc(d);
                    f = 1 << g;
                    g = b[g];
                    g > e && (e = g);
                    d &= ~f;
                  }
                  d = e;
                  d = D() - d;
                  d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * sh(d / 1960)) - d;
                  if (10 < d) {
                    a.timeoutHandle = Pa(Wh.bind(null, a, zh, Ah), d);
                    break;
                  }
                  Wh(a, zh, Ah);
                  break;
                case 5:
                  Wh(a, zh, Ah);
                  break;
                default:
                  throw Error(n(329));
              }
            }
          }
          Kh(a, D());
          return a.callbackNode === c ? Nh.bind(null, a) : null;
        }
        function Uh(a, b) {
          var c = yh;
          a.current.memoizedState.isDehydrated && (Rh(a, b).flags |= 256);
          a = Ph(a, b);
          2 !== a && (b = zh, zh = c, null !== b && Cg(b));
          return a;
        }
        function Cg(a) {
          null === zh ? zh = a : zh.push.apply(zh, a);
        }
        function Vh(a) {
          for (var b = a; ; ) {
            if (b.flags & 16384) {
              var c = b.updateQueue;
              if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
                var e = c[d], f = e.getSnapshot;
                e = e.value;
                try {
                  if (!Vc(f(), e)) return false;
                } catch (g) {
                  return false;
                }
              }
            }
            c = b.child;
            if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
            else {
              if (b === a) break;
              for (; null === b.sibling; ) {
                if (null === b.return || b.return === a) return true;
                b = b.return;
              }
              b.sibling.return = b.return;
              b = b.sibling;
            }
          }
          return true;
        }
        function Jh(a, b) {
          b &= ~xh;
          b &= ~wh;
          a.suspendedLanes |= b;
          a.pingedLanes &= ~b;
          for (a = a.expirationTimes; 0 < b; ) {
            var c = 31 - tc(b), d = 1 << c;
            a[c] = -1;
            b &= ~d;
          }
        }
        function Lh(a) {
          if (0 !== (H & 6)) throw Error(n(327));
          Oh();
          var b = zc(a, 0);
          if (0 === (b & 1)) return Kh(a, D()), null;
          var c = Ph(a, b);
          if (0 !== a.tag && 2 === c) {
            var d = Cc(a);
            0 !== d && (b = d, c = Uh(a, d));
          }
          if (1 === c) throw c = vh, Rh(a, 0), Jh(a, b), Kh(a, D()), c;
          if (6 === c) throw Error(n(345));
          a.finishedWork = a.current.alternate;
          a.finishedLanes = b;
          Wh(a, zh, Ah);
          Kh(a, D());
          return null;
        }
        function Xh(a) {
          null !== Dh && 0 === Dh.tag && 0 === (H & 6) && Oh();
          var b = H;
          H |= 1;
          var c = W.transition, d = C;
          try {
            if (W.transition = null, C = 1, a) return a();
          } finally {
            C = d, W.transition = c, H = b, 0 === (H & 6) && ad();
          }
        }
        function Eg() {
          $f = Zf.current;
          q(Zf);
        }
        function Rh(a, b) {
          a.finishedWork = null;
          a.finishedLanes = 0;
          var c = a.timeoutHandle;
          c !== Ra && (a.timeoutHandle = Ra, Qa(c));
          if (null !== X) for (c = X.return; null !== c; ) {
            var d = c;
            nd(d);
            switch (d.tag) {
              case 1:
                d = d.type.childContextTypes;
                null !== d && void 0 !== d && nc();
                break;
              case 3:
                te();
                q(z);
                q(x);
                ye();
                break;
              case 5:
                ve(d);
                break;
              case 4:
                te();
                break;
              case 13:
                q(I);
                break;
              case 19:
                q(I);
                break;
              case 10:
                Wd(d.type._context);
                break;
              case 22:
              case 23:
                Eg();
            }
            c = c.return;
          }
          N = a;
          X = a = Jd(a.current, null);
          Z = $f = b;
          R = 0;
          vh = null;
          xh = wh = le = 0;
          zh = yh = null;
          if (null !== $d) {
            for (b = 0; b < $d.length; b++) if (c = $d[b], d = c.interleaved, null !== d) {
              c.interleaved = null;
              var e = d.next, f = c.pending;
              if (null !== f) {
                var g = f.next;
                f.next = e;
                d.next = g;
              }
              c.pending = d;
            }
            $d = null;
          }
          return a;
        }
        function Th(a, b) {
          do {
            var c = X;
            try {
              Ud();
              ze.current = Le;
              if (Ce) {
                for (var d = J.memoizedState; null !== d; ) {
                  var e = d.queue;
                  null !== e && (e.pending = null);
                  d = d.next;
                }
                Ce = false;
              }
              Be = 0;
              L = K = J = null;
              De = false;
              Ee = 0;
              uh.current = null;
              if (null === c || null === c.return) {
                R = 1;
                vh = b;
                X = null;
                break;
              }
              a: {
                var f = a, g = c.return, h = c, k = b;
                b = Z;
                h.flags |= 32768;
                if (null !== k && "object" === typeof k && "function" === typeof k.then) {
                  var l = k, m = h, r = m.tag;
                  if (0 === (m.mode & 1) && (0 === r || 11 === r || 15 === r)) {
                    var p = m.alternate;
                    p ? (m.updateQueue = p.updateQueue, m.memoizedState = p.memoizedState, m.lanes = p.lanes) : (m.updateQueue = null, m.memoizedState = null);
                  }
                  var B = Pf(g);
                  if (null !== B) {
                    B.flags &= -257;
                    Qf(B, g, h, f, b);
                    B.mode & 1 && Nf(f, l, b);
                    b = B;
                    k = l;
                    var w = b.updateQueue;
                    if (null === w) {
                      var Y = /* @__PURE__ */ new Set();
                      Y.add(k);
                      b.updateQueue = Y;
                    } else w.add(k);
                    break a;
                  } else {
                    if (0 === (b & 1)) {
                      Nf(f, l, b);
                      ng();
                      break a;
                    }
                    k = Error(n(426));
                  }
                } else if (F && h.mode & 1) {
                  var ya = Pf(g);
                  if (null !== ya) {
                    0 === (ya.flags & 65536) && (ya.flags |= 256);
                    Qf(ya, g, h, f, b);
                    Bd(Ef(k, h));
                    break a;
                  }
                }
                f = k = Ef(k, h);
                4 !== R && (R = 2);
                null === yh ? yh = [f] : yh.push(f);
                f = g;
                do {
                  switch (f.tag) {
                    case 3:
                      f.flags |= 65536;
                      b &= -b;
                      f.lanes |= b;
                      var E = If(f, k, b);
                      je(f, E);
                      break a;
                    case 1:
                      h = k;
                      var u = f.type, t = f.stateNode;
                      if (0 === (f.flags & 128) && ("function" === typeof u.getDerivedStateFromError || null !== t && "function" === typeof t.componentDidCatch && (null === Mf || !Mf.has(t)))) {
                        f.flags |= 65536;
                        b &= -b;
                        f.lanes |= b;
                        var Db = Lf(f, h, b);
                        je(f, Db);
                        break a;
                      }
                  }
                  f = f.return;
                } while (null !== f);
              }
              Yh(c);
            } catch (lc) {
              b = lc;
              X === c && null !== c && (X = c = c.return);
              continue;
            }
            break;
          } while (1);
        }
        function Qh() {
          var a = th.current;
          th.current = Le;
          return null === a ? Le : a;
        }
        function ng() {
          if (0 === R || 3 === R || 2 === R) R = 4;
          null === N || 0 === (le & 268435455) && 0 === (wh & 268435455) || Jh(N, Z);
        }
        function Ph(a, b) {
          var c = H;
          H |= 2;
          var d = Qh();
          if (N !== a || Z !== b) Ah = null, Rh(a, b);
          do
            try {
              Zh();
              break;
            } catch (e) {
              Th(a, e);
            }
          while (1);
          Ud();
          H = c;
          th.current = d;
          if (null !== X) throw Error(n(261));
          N = null;
          Z = 0;
          return R;
        }
        function Zh() {
          for (; null !== X; ) $h(X);
        }
        function Sh() {
          for (; null !== X && !Lc(); ) $h(X);
        }
        function $h(a) {
          var b = ai(a.alternate, a, $f);
          a.memoizedProps = a.pendingProps;
          null === b ? Yh(a) : X = b;
          uh.current = null;
        }
        function Yh(a) {
          var b = a;
          do {
            var c = b.alternate;
            a = b.return;
            if (0 === (b.flags & 32768)) {
              if (c = Bg(c, b, $f), null !== c) {
                X = c;
                return;
              }
            } else {
              c = Fg(c, b);
              if (null !== c) {
                c.flags &= 32767;
                X = c;
                return;
              }
              if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
              else {
                R = 6;
                X = null;
                return;
              }
            }
            b = b.sibling;
            if (null !== b) {
              X = b;
              return;
            }
            X = b = a;
          } while (null !== b);
          0 === R && (R = 5);
        }
        function Wh(a, b, c) {
          var d = C, e = W.transition;
          try {
            W.transition = null, C = 1, bi(a, b, c, d);
          } finally {
            W.transition = e, C = d;
          }
          return null;
        }
        function bi(a, b, c, d) {
          do
            Oh();
          while (null !== Dh);
          if (0 !== (H & 6)) throw Error(n(327));
          c = a.finishedWork;
          var e = a.finishedLanes;
          if (null === c) return null;
          a.finishedWork = null;
          a.finishedLanes = 0;
          if (c === a.current) throw Error(n(177));
          a.callbackNode = null;
          a.callbackPriority = 0;
          var f = c.lanes | c.childLanes;
          Gc(a, f);
          a === N && (X = N = null, Z = 0);
          0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || Ch || (Ch = true, Mh(Pc, function() {
            Oh();
            return null;
          }));
          f = 0 !== (c.flags & 15990);
          if (0 !== (c.subtreeFlags & 15990) || f) {
            f = W.transition;
            W.transition = null;
            var g = C;
            C = 1;
            var h = H;
            H |= 4;
            uh.current = null;
            Lg(a, c);
            $g(c, a);
            Ia(a.containerInfo);
            a.current = c;
            dh(c, a, e);
            Mc();
            H = h;
            C = g;
            W.transition = f;
          } else a.current = c;
          Ch && (Ch = false, Dh = a, Eh = e);
          f = a.pendingLanes;
          0 === f && (Mf = null);
          Tc(c.stateNode, d);
          Kh(a, D());
          if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
          if (Jf) throw Jf = false, a = Kf, Kf = null, a;
          0 !== (Eh & 1) && 0 !== a.tag && Oh();
          f = a.pendingLanes;
          0 !== (f & 1) ? a === Gh ? Fh++ : (Fh = 0, Gh = a) : Fh = 0;
          ad();
          return null;
        }
        function Oh() {
          if (null !== Dh) {
            var a = Ic(Eh), b = W.transition, c = C;
            try {
              W.transition = null;
              C = 16 > a ? 16 : a;
              if (null === Dh) var d = false;
              else {
                a = Dh;
                Dh = null;
                Eh = 0;
                if (0 !== (H & 6)) throw Error(n(331));
                var e = H;
                H |= 4;
                for (T = a.current; null !== T; ) {
                  var f = T, g = f.child;
                  if (0 !== (T.flags & 16)) {
                    var h = f.deletions;
                    if (null !== h) {
                      for (var k = 0; k < h.length; k++) {
                        var l = h[k];
                        for (T = l; null !== T; ) {
                          var m = T;
                          switch (m.tag) {
                            case 0:
                            case 11:
                            case 15:
                              Mg(8, m, f);
                          }
                          var r = m.child;
                          if (null !== r) r.return = m, T = r;
                          else for (; null !== T; ) {
                            m = T;
                            var p = m.sibling, B = m.return;
                            Pg(m);
                            if (m === l) {
                              T = null;
                              break;
                            }
                            if (null !== p) {
                              p.return = B;
                              T = p;
                              break;
                            }
                            T = B;
                          }
                        }
                      }
                      var w = f.alternate;
                      if (null !== w) {
                        var Y = w.child;
                        if (null !== Y) {
                          w.child = null;
                          do {
                            var ya = Y.sibling;
                            Y.sibling = null;
                            Y = ya;
                          } while (null !== Y);
                        }
                      }
                      T = f;
                    }
                  }
                  if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, T = g;
                  else b: for (; null !== T; ) {
                    f = T;
                    if (0 !== (f.flags & 2048)) switch (f.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Mg(9, f, f.return);
                    }
                    var E = f.sibling;
                    if (null !== E) {
                      E.return = f.return;
                      T = E;
                      break b;
                    }
                    T = f.return;
                  }
                }
                var u = a.current;
                for (T = u; null !== T; ) {
                  g = T;
                  var t = g.child;
                  if (0 !== (g.subtreeFlags & 2064) && null !== t) t.return = g, T = t;
                  else b: for (g = u; null !== T; ) {
                    h = T;
                    if (0 !== (h.flags & 2048)) try {
                      switch (h.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Ng(9, h);
                      }
                    } catch (lc) {
                      U(h, h.return, lc);
                    }
                    if (h === g) {
                      T = null;
                      break b;
                    }
                    var Db = h.sibling;
                    if (null !== Db) {
                      Db.return = h.return;
                      T = Db;
                      break b;
                    }
                    T = h.return;
                  }
                }
                H = e;
                ad();
                if (Sc && "function" === typeof Sc.onPostCommitFiberRoot) try {
                  Sc.onPostCommitFiberRoot(Rc, a);
                } catch (lc) {
                }
                d = true;
              }
              return d;
            } finally {
              C = c, W.transition = b;
            }
          }
          return false;
        }
        function ci(a, b, c) {
          b = Ef(c, b);
          b = If(a, b, 1);
          a = he(a, b, 1);
          b = O();
          null !== a && (Fc(a, 1, b), Kh(a, b));
        }
        function U(a, b, c) {
          if (3 === a.tag) ci(a, a, c);
          else for (; null !== b; ) {
            if (3 === b.tag) {
              ci(b, a, c);
              break;
            } else if (1 === b.tag) {
              var d = b.stateNode;
              if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Mf || !Mf.has(d))) {
                a = Ef(c, a);
                a = Lf(b, a, 1);
                b = he(b, a, 1);
                a = O();
                null !== b && (Fc(b, 1, a), Kh(b, a));
                break;
              }
            }
            b = b.return;
          }
        }
        function Of(a, b, c) {
          var d = a.pingCache;
          null !== d && d.delete(b);
          b = O();
          a.pingedLanes |= a.suspendedLanes & c;
          N === a && (Z & c) === c && (4 === R || 3 === R && (Z & 130023424) === Z && 500 > D() - bh ? Rh(a, 0) : xh |= c);
          Kh(a, b);
        }
        function di(a, b) {
          0 === b && (0 === (a.mode & 1) ? b = 1 : (b = xc, xc <<= 1, 0 === (xc & 130023424) && (xc = 4194304)));
          var c = O();
          a = ce(a, b);
          null !== a && (Fc(a, b, c), Kh(a, c));
        }
        function og(a) {
          var b = a.memoizedState, c = 0;
          null !== b && (c = b.retryLane);
          di(a, c);
        }
        function Yg(a, b) {
          var c = 0;
          switch (a.tag) {
            case 13:
              var d = a.stateNode;
              var e = a.memoizedState;
              null !== e && (c = e.retryLane);
              break;
            case 19:
              d = a.stateNode;
              break;
            default:
              throw Error(n(314));
          }
          null !== d && d.delete(b);
          di(a, c);
        }
        var ai;
        ai = function(a, b, c) {
          if (null !== a) if (a.memoizedProps !== b.pendingProps || z.current) G = true;
          else {
            if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return G = false, sg(a, b, c);
            G = 0 !== (a.flags & 131072) ? true : false;
          }
          else G = false, F && 0 !== (b.flags & 1048576) && ld(b, ed, b.index);
          b.lanes = 0;
          switch (b.tag) {
            case 2:
              var d = b.type;
              cg(a, b);
              a = b.pendingProps;
              var e = mc(b, x.current);
              Yd(b, c);
              e = He(null, b, d, a, e, c);
              var f = Me();
              b.flags |= 1;
              "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, A(d) ? (f = true, qc(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, ee(b), e.updater = zf, b.stateNode = e, e._reactInternals = b, Df(b, d, a, c), b = dg(null, b, d, true, f, c)) : (b.tag = 0, F && f && md(b), P(null, b, e, c), b = b.child);
              return b;
            case 16:
              d = b.elementType;
              a: {
                cg(a, b);
                a = b.pendingProps;
                e = d._init;
                d = e(d._payload);
                b.type = d;
                e = b.tag = ei(d);
                a = xf(d, a);
                switch (e) {
                  case 0:
                    b = Xf(null, b, d, a, c);
                    break a;
                  case 1:
                    b = bg(null, b, d, a, c);
                    break a;
                  case 11:
                    b = Sf(null, b, d, a, c);
                    break a;
                  case 14:
                    b = Uf(null, b, d, xf(d.type, a), c);
                    break a;
                }
                throw Error(n(
                  306,
                  d,
                  ""
                ));
              }
              return b;
            case 0:
              return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : xf(d, e), Xf(a, b, d, e, c);
            case 1:
              return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : xf(d, e), bg(a, b, d, e, c);
            case 3:
              a: {
                eg(b);
                if (null === a) throw Error(n(387));
                d = b.pendingProps;
                f = b.memoizedState;
                e = f.element;
                fe(a, b);
                ke(b, d, null, c);
                var g = b.memoizedState;
                d = g.element;
                if (Va && f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
                  e = Ef(Error(n(423)), b);
                  b = fg(a, b, d, c, e);
                  break a;
                } else if (d !== e) {
                  e = Ef(Error(n(424)), b);
                  b = fg(a, b, d, c, e);
                  break a;
                } else for (Va && (pd = Pb(b.stateNode.containerInfo), od = b, F = true, rd = null, qd = false), c = Pd(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
                else {
                  Ad();
                  if (d === e) {
                    b = Tf(a, b, c);
                    break a;
                  }
                  P(a, b, d, c);
                }
                b = b.child;
              }
              return b;
            case 5:
              return ue(b), null === a && wd(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Na(d, e) ? g = null : null !== f && Na(d, f) && (b.flags |= 32), ag(a, b), P(a, b, g, c), b.child;
            case 6:
              return null === a && wd(b), null;
            case 13:
              return ig(a, b, c);
            case 4:
              return se(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Od(b, null, d, c) : P(a, b, d, c), b.child;
            case 11:
              return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : xf(d, e), Sf(a, b, d, e, c);
            case 7:
              return P(a, b, b.pendingProps, c), b.child;
            case 8:
              return P(a, b, b.pendingProps.children, c), b.child;
            case 12:
              return P(a, b, b.pendingProps.children, c), b.child;
            case 10:
              a: {
                d = b.type._context;
                e = b.pendingProps;
                f = b.memoizedProps;
                g = e.value;
                Vd(b, d, g);
                if (null !== f) if (Vc(f.value, g)) {
                  if (f.children === e.children && !z.current) {
                    b = Tf(a, b, c);
                    break a;
                  }
                } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
                  var h = f.dependencies;
                  if (null !== h) {
                    g = f.child;
                    for (var k = h.firstContext; null !== k; ) {
                      if (k.context === d) {
                        if (1 === f.tag) {
                          k = ge(-1, c & -c);
                          k.tag = 2;
                          var l = f.updateQueue;
                          if (null !== l) {
                            l = l.shared;
                            var m = l.pending;
                            null === m ? k.next = k : (k.next = m.next, m.next = k);
                            l.pending = k;
                          }
                        }
                        f.lanes |= c;
                        k = f.alternate;
                        null !== k && (k.lanes |= c);
                        Xd(f.return, c, b);
                        h.lanes |= c;
                        break;
                      }
                      k = k.next;
                    }
                  } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
                  else if (18 === f.tag) {
                    g = f.return;
                    if (null === g) throw Error(n(341));
                    g.lanes |= c;
                    h = g.alternate;
                    null !== h && (h.lanes |= c);
                    Xd(g, c, b);
                    g = f.sibling;
                  } else g = f.child;
                  if (null !== g) g.return = f;
                  else for (g = f; null !== g; ) {
                    if (g === b) {
                      g = null;
                      break;
                    }
                    f = g.sibling;
                    if (null !== f) {
                      f.return = g.return;
                      g = f;
                      break;
                    }
                    g = g.return;
                  }
                  f = g;
                }
                P(a, b, e.children, c);
                b = b.child;
              }
              return b;
            case 9:
              return e = b.type, d = b.pendingProps.children, Yd(b, c), e = Zd(e), d = d(e), b.flags |= 1, P(a, b, d, c), b.child;
            case 14:
              return d = b.type, e = xf(d, b.pendingProps), e = xf(d.type, e), Uf(a, b, d, e, c);
            case 15:
              return Wf(a, b, b.type, b.pendingProps, c);
            case 17:
              return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : xf(d, e), cg(a, b), b.tag = 1, A(d) ? (a = true, qc(b)) : a = false, Yd(b, c), Bf(b, d, e), Df(b, d, e, c), dg(null, b, d, true, a, c);
            case 19:
              return rg(a, b, c);
            case 22:
              return Yf(a, b, c);
          }
          throw Error(n(156, b.tag));
        };
        function Mh(a, b) {
          return Jc(a, b);
        }
        function fi(a, b, c, d) {
          this.tag = a;
          this.key = c;
          this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
          this.index = 0;
          this.ref = null;
          this.pendingProps = b;
          this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
          this.mode = d;
          this.subtreeFlags = this.flags = 0;
          this.deletions = null;
          this.childLanes = this.lanes = 0;
          this.alternate = null;
        }
        function td(a, b, c, d) {
          return new fi(a, b, c, d);
        }
        function Vf(a) {
          a = a.prototype;
          return !(!a || !a.isReactComponent);
        }
        function ei(a) {
          if ("function" === typeof a) return Vf(a) ? 1 : 0;
          if (void 0 !== a && null !== a) {
            a = a.$$typeof;
            if (a === ma) return 11;
            if (a === pa) return 14;
          }
          return 2;
        }
        function Jd(a, b) {
          var c = a.alternate;
          null === c ? (c = td(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
          c.flags = a.flags & 14680064;
          c.childLanes = a.childLanes;
          c.lanes = a.lanes;
          c.child = a.child;
          c.memoizedProps = a.memoizedProps;
          c.memoizedState = a.memoizedState;
          c.updateQueue = a.updateQueue;
          b = a.dependencies;
          c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
          c.sibling = a.sibling;
          c.index = a.index;
          c.ref = a.ref;
          return c;
        }
        function Ld(a, b, c, d, e, f) {
          var g = 2;
          d = a;
          if ("function" === typeof a) Vf(a) && (g = 1);
          else if ("string" === typeof a) g = 5;
          else a: switch (a) {
            case ha:
              return Nd(c.children, e, f, b);
            case ia:
              g = 8;
              e |= 8;
              break;
            case ja:
              return a = td(12, c, b, e | 2), a.elementType = ja, a.lanes = f, a;
            case na:
              return a = td(13, c, b, e), a.elementType = na, a.lanes = f, a;
            case oa:
              return a = td(19, c, b, e), a.elementType = oa, a.lanes = f, a;
            case ra:
              return jg(c, e, f, b);
            default:
              if ("object" === typeof a && null !== a) switch (a.$$typeof) {
                case ka:
                  g = 10;
                  break a;
                case la:
                  g = 9;
                  break a;
                case ma:
                  g = 11;
                  break a;
                case pa:
                  g = 14;
                  break a;
                case qa:
                  g = 16;
                  d = null;
                  break a;
              }
              throw Error(n(130, null == a ? a : typeof a, ""));
          }
          b = td(g, c, b, e);
          b.elementType = a;
          b.type = d;
          b.lanes = f;
          return b;
        }
        function Nd(a, b, c, d) {
          a = td(7, a, d, b);
          a.lanes = c;
          return a;
        }
        function jg(a, b, c, d) {
          a = td(22, a, d, b);
          a.elementType = ra;
          a.lanes = c;
          a.stateNode = { isHidden: false };
          return a;
        }
        function Kd(a, b, c) {
          a = td(6, a, null, b);
          a.lanes = c;
          return a;
        }
        function Md(a, b, c) {
          b = td(4, null !== a.children ? a.children : [], a.key, b);
          b.lanes = c;
          b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
          return b;
        }
        function gi(a, b, c, d, e) {
          this.tag = b;
          this.containerInfo = a;
          this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
          this.timeoutHandle = Ra;
          this.callbackNode = this.pendingContext = this.context = null;
          this.callbackPriority = 0;
          this.eventTimes = Ec(0);
          this.expirationTimes = Ec(-1);
          this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
          this.entanglements = Ec(0);
          this.identifierPrefix = d;
          this.onRecoverableError = e;
          Va && (this.mutableSourceEagerHydrationData = null);
        }
        function hi(a, b, c, d, e, f, g, h, k) {
          a = new gi(a, b, c, h, k);
          1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
          f = td(3, null, null, b);
          a.current = f;
          f.stateNode = a;
          f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
          ee(f);
          return a;
        }
        function ii(a) {
          if (!a) return jc;
          a = a._reactInternals;
          a: {
            if (wa(a) !== a || 1 !== a.tag) throw Error(n(170));
            var b = a;
            do {
              switch (b.tag) {
                case 3:
                  b = b.stateNode.context;
                  break a;
                case 1:
                  if (A(b.type)) {
                    b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                    break a;
                  }
              }
              b = b.return;
            } while (null !== b);
            throw Error(n(171));
          }
          if (1 === a.tag) {
            var c = a.type;
            if (A(c)) return pc(a, c, b);
          }
          return b;
        }
        function ji(a) {
          var b = a._reactInternals;
          if (void 0 === b) {
            if ("function" === typeof a.render) throw Error(n(188));
            a = Object.keys(a).join(",");
            throw Error(n(268, a));
          }
          a = Aa(b);
          return null === a ? null : a.stateNode;
        }
        function ki(a, b) {
          a = a.memoizedState;
          if (null !== a && null !== a.dehydrated) {
            var c = a.retryLane;
            a.retryLane = 0 !== c && c < b ? c : b;
          }
        }
        function li(a, b) {
          ki(a, b);
          (a = a.alternate) && ki(a, b);
        }
        function mi(a) {
          a = Aa(a);
          return null === a ? null : a.stateNode;
        }
        function ni() {
          return null;
        }
        exports2.attemptContinuousHydration = function(a) {
          if (13 === a.tag) {
            var b = ce(a, 134217728);
            if (null !== b) {
              var c = O();
              af(b, a, 134217728, c);
            }
            li(a, 134217728);
          }
        };
        exports2.attemptDiscreteHydration = function(a) {
          if (13 === a.tag) {
            var b = ce(a, 1);
            if (null !== b) {
              var c = O();
              af(b, a, 1, c);
            }
            li(a, 1);
          }
        };
        exports2.attemptHydrationAtCurrentPriority = function(a) {
          if (13 === a.tag) {
            var b = tf(a), c = ce(a, b);
            if (null !== c) {
              var d = O();
              af(c, a, b, d);
            }
            li(a, b);
          }
        };
        exports2.attemptSynchronousHydration = function(a) {
          switch (a.tag) {
            case 3:
              var b = a.stateNode;
              if (b.current.memoizedState.isDehydrated) {
                var c = yc(b.pendingLanes);
                0 !== c && (Hc(b, c | 1), Kh(b, D()), 0 === (H & 6) && (Bh(), ad()));
              }
              break;
            case 13:
              Xh(function() {
                var b2 = ce(a, 1);
                if (null !== b2) {
                  var c2 = O();
                  af(b2, a, 1, c2);
                }
              }), li(a, 1);
          }
        };
        exports2.batchedUpdates = function(a, b) {
          var c = H;
          H |= 1;
          try {
            return a(b);
          } finally {
            H = c, 0 === H && (Bh(), Xc && ad());
          }
        };
        exports2.createComponentSelector = function(a) {
          return { $$typeof: hh, value: a };
        };
        exports2.createContainer = function(a, b, c, d, e, f, g) {
          return hi(a, b, false, null, c, d, e, f, g);
        };
        exports2.createHasPseudoClassSelector = function(a) {
          return { $$typeof: ih, value: a };
        };
        exports2.createHydrationContainer = function(a, b, c, d, e, f, g, h, k) {
          a = hi(c, d, true, a, e, f, g, h, k);
          a.context = ii(null);
          c = a.current;
          d = O();
          e = tf(c);
          f = ge(d, e);
          f.callback = void 0 !== b && null !== b ? b : null;
          he(c, f, e);
          a.current.lanes = e;
          Fc(a, e, d);
          Kh(a, d);
          return a;
        };
        exports2.createPortal = function(a, b, c) {
          var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
          return { $$typeof: fa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
        };
        exports2.createRoleSelector = function(a) {
          return { $$typeof: jh, value: a };
        };
        exports2.createTestNameSelector = function(a) {
          return { $$typeof: kh, value: a };
        };
        exports2.createTextSelector = function(a) {
          return { $$typeof: lh, value: a };
        };
        exports2.deferredUpdates = function(a) {
          var b = C, c = W.transition;
          try {
            return W.transition = null, C = 16, a();
          } finally {
            C = b, W.transition = c;
          }
        };
        exports2.discreteUpdates = function(a, b, c, d, e) {
          var f = C, g = W.transition;
          try {
            return W.transition = null, C = 1, a(b, c, d, e);
          } finally {
            C = f, W.transition = g, 0 === H && Bh();
          }
        };
        exports2.findAllNodes = rh;
        exports2.findBoundingRects = function(a, b) {
          if (!bb) throw Error(n(363));
          b = rh(a, b);
          a = [];
          for (var c = 0; c < b.length; c++) a.push(db(b[c]));
          for (b = a.length - 1; 0 < b; b--) {
            c = a[b];
            for (var d = c.x, e = d + c.width, f = c.y, g = f + c.height, h = b - 1; 0 <= h; h--) if (b !== h) {
              var k = a[h], l = k.x, m = l + k.width, r = k.y, p = r + k.height;
              if (d >= l && f >= r && e <= m && g <= p) {
                a.splice(b, 1);
                break;
              } else if (!(d !== l || c.width !== k.width || p < f || r > g)) {
                r > f && (k.height += r - f, k.y = f);
                p < g && (k.height = g - r);
                a.splice(b, 1);
                break;
              } else if (!(f !== r || c.height !== k.height || m < d || l > e)) {
                l > d && (k.width += l - d, k.x = d);
                m < e && (k.width = e - l);
                a.splice(b, 1);
                break;
              }
            }
          }
          return a;
        };
        exports2.findHostInstance = ji;
        exports2.findHostInstanceWithNoPortals = function(a) {
          a = za(a);
          a = null !== a ? Ca(a) : null;
          return null === a ? null : a.stateNode;
        };
        exports2.findHostInstanceWithWarning = function(a) {
          return ji(a);
        };
        exports2.flushControlled = function(a) {
          var b = H;
          H |= 1;
          var c = W.transition, d = C;
          try {
            W.transition = null, C = 1, a();
          } finally {
            C = d, W.transition = c, H = b, 0 === H && (Bh(), ad());
          }
        };
        exports2.flushPassiveEffects = Oh;
        exports2.flushSync = Xh;
        exports2.focusWithin = function(a, b) {
          if (!bb) throw Error(n(363));
          a = nh(a);
          b = qh(a, b);
          b = Array.from(b);
          for (a = 0; a < b.length; ) {
            var c = b[a++];
            if (!fb(c)) {
              if (5 === c.tag && hb(c.stateNode)) return true;
              for (c = c.child; null !== c; ) b.push(c), c = c.sibling;
            }
          }
          return false;
        };
        exports2.getCurrentUpdatePriority = function() {
          return C;
        };
        exports2.getFindAllNodesFailureDescription = function(a, b) {
          if (!bb) throw Error(n(363));
          var c = 0, d = [];
          a = [nh(a), 0];
          for (var e = 0; e < a.length; ) {
            var f = a[e++], g = a[e++], h = b[g];
            if (5 !== f.tag || !fb(f)) {
              if (oh(f, h) && (d.push(ph(h)), g++, g > c && (c = g)), g < b.length) for (f = f.child; null !== f; ) a.push(f, g), f = f.sibling;
            }
          }
          if (c < b.length) {
            for (a = []; c < b.length; c++) a.push(ph(b[c]));
            return "findAllNodes was able to match part of the selector:\n  " + (d.join(" > ") + "\n\nNo matching component was found for:\n  ") + a.join(" > ");
          }
          return null;
        };
        exports2.getPublicRootInstance = function(a) {
          a = a.current;
          if (!a.child) return null;
          switch (a.child.tag) {
            case 5:
              return Ea(a.child.stateNode);
            default:
              return a.child.stateNode;
          }
        };
        exports2.injectIntoDevTools = function(a) {
          a = { bundleType: a.bundleType, version: a.version, rendererPackageName: a.rendererPackageName, rendererConfig: a.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: da.ReactCurrentDispatcher, findHostInstanceByFiber: mi, findFiberByHostInstance: a.findFiberByHostInstance || ni, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1" };
          if ("undefined" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) a = false;
          else {
            var b = __REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (b.isDisabled || !b.supportsFiber) a = true;
            else {
              try {
                Rc = b.inject(a), Sc = b;
              } catch (c) {
              }
              a = b.checkDCE ? true : false;
            }
          }
          return a;
        };
        exports2.isAlreadyRendering = function() {
          return false;
        };
        exports2.observeVisibleRects = function(a, b, c, d) {
          if (!bb) throw Error(n(363));
          a = rh(a, b);
          var e = ib(a, c, d).disconnect;
          return { disconnect: function() {
            e();
          } };
        };
        exports2.registerMutableSourceForHydration = function(a, b) {
          var c = b._getVersion;
          c = c(b._source);
          null == a.mutableSourceEagerHydrationData ? a.mutableSourceEagerHydrationData = [b, c] : a.mutableSourceEagerHydrationData.push(b, c);
        };
        exports2.runWithPriority = function(a, b) {
          var c = C;
          try {
            return C = a, b();
          } finally {
            C = c;
          }
        };
        exports2.shouldError = function() {
          return null;
        };
        exports2.shouldSuspend = function() {
          return false;
        };
        exports2.updateContainer = function(a, b, c, d) {
          var e = b.current, f = O(), g = tf(e);
          c = ii(c);
          null === b.context ? b.context = c : b.pendingContext = c;
          b = ge(f, g);
          b.payload = { element: a };
          d = void 0 === d ? null : d;
          null !== d && (b.callback = d);
          a = he(e, b, g);
          null !== a && (af(a, e, g, f), ie(a, e, g));
          return g;
        };
        return exports2;
      };
    }
  });

  // ../fuick_js_framework/dist/hostConfig.js
  var require_hostConfig = __commonJS({
    "../fuick_js_framework/dist/hostConfig.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createHostConfig = void 0;
      var react_1 = __importDefault(require_react_production_min());
      function deepEqual(objA, objB) {
        if (objA === objB)
          return true;
        if (!objA || !objB || typeof objA !== "object" || typeof objB !== "object")
          return false;
        if (react_1.default.isValidElement(objA) || react_1.default.isValidElement(objB)) {
          return false;
        }
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length)
          return false;
        for (const key of keysA) {
          if (!Object.prototype.hasOwnProperty.call(objB, key))
            return false;
          const valA = objA[key];
          const valB = objB[key];
          if (valA && valB && typeof valA === "object" && typeof valB === "object") {
            if (!deepEqual(valA, valB))
              return false;
          } else if (valA !== valB) {
            return false;
          }
        }
        return true;
      }
      function diffProps(oldProps, newProps) {
        const updatePayload = [];
        let hasChanges = false;
        let hasDslChanges = false;
        for (const key in oldProps) {
          if (key === "children")
            continue;
          if (!(key in newProps)) {
            updatePayload.push(key, null);
            hasChanges = true;
            hasDslChanges = true;
          } else if (oldProps[key] !== newProps[key]) {
            const oldVal = oldProps[key];
            const newVal = newProps[key];
            if (typeof oldVal === "function" && typeof newVal === "function") {
              updatePayload.push(key, newVal);
              hasChanges = true;
            } else if (react_1.default.isValidElement(oldVal) || react_1.default.isValidElement(newVal)) {
              updatePayload.push(key, newVal);
              hasChanges = true;
              hasDslChanges = true;
            } else if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object") {
              if (!deepEqual(oldVal, newVal)) {
                updatePayload.push(key, newVal);
                hasChanges = true;
                if (!isDslEqual(oldVal, newVal)) {
                  hasDslChanges = true;
                }
              }
            } else {
              updatePayload.push(key, newVal);
              hasChanges = true;
              hasDslChanges = true;
            }
          }
        }
        for (const key in newProps) {
          if (key === "children")
            continue;
          if (!(key in oldProps)) {
            updatePayload.push(key, newProps[key]);
            hasChanges = true;
            hasDslChanges = true;
          }
        }
        return hasChanges ? { payload: updatePayload, hasDslChanges } : null;
      }
      function isDslEqual(valA, valB) {
        if (valA === valB)
          return true;
        if (typeof valA === "function" && typeof valB === "function")
          return true;
        if (!valA || !valB || typeof valA !== "object" || typeof valB !== "object")
          return false;
        if (react_1.default.isValidElement(valA) || react_1.default.isValidElement(valB)) {
          return false;
        }
        if (Array.isArray(valA) !== Array.isArray(valB))
          return false;
        if (Array.isArray(valA)) {
          if (valA.length !== valB.length)
            return false;
          for (let i = 0; i < valA.length; i++) {
            if (!isDslEqual(valA[i], valB[i]))
              return false;
          }
          return true;
        }
        const keysA = Object.keys(valA);
        const keysB = Object.keys(valB);
        if (keysA.length !== keysB.length)
          return false;
        for (const key of keysA) {
          if (!Object.prototype.hasOwnProperty.call(valB, key))
            return false;
          if (!isDslEqual(valA[key], valB[key]))
            return false;
        }
        return true;
      }
      var createHostConfig = () => {
        return {
          now: Date.now,
          supportsMutation: true,
          getPublicInstance: (inst) => inst,
          getRootHostContext: (root) => null,
          getChildHostContext: (parentHostContext, type, root) => null,
          shouldSetTextContent: (type, props) => false,
          createInstance: (type, props, container) => {
            return container.createInstance(type, props);
          },
          createTextInstance: (text, container) => {
            return container.createTextInstance(text);
          },
          appendInitialChild: (parent, child) => {
            child.parent = parent;
            parent.children.push(child);
            if (parent.container) {
              parent.container.changedNodes.add(parent);
            }
          },
          finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => false,
          appendChildToContainer: (container, child) => {
            container.appendChildToContainer(child);
          },
          appendChild: (parent, child) => {
            if (parent.container) {
              parent.container.appendChild(parent, child);
            } else {
              child.parent = parent;
              parent.children.push(child);
              const container = parent.container;
              if (container) {
                container.changedNodes.add(parent);
              }
            }
          },
          insertBefore: (parent, child, beforeChild) => {
            if (parent.container) {
              parent.container.insertBefore(parent, child, beforeChild);
            } else {
              child.parent = parent;
              const i = parent.children.indexOf(beforeChild);
              if (i >= 0) {
                parent.children.splice(i, 0, child);
              } else {
                parent.children.push(child);
              }
            }
          },
          removeChild: (parent, child) => {
            if (parent.container) {
              parent.container.removeChild(parent, child);
            } else {
              const i = parent.children.indexOf(child);
              if (i >= 0)
                parent.children.splice(i, 1);
              child.destroy();
            }
          },
          removeChildFromContainer: (container, child) => {
            container.removeChildFromContainer(child);
          },
          insertInContainerBefore: (container, child, beforeChild) => {
            container.appendChildToContainer(child);
          },
          resetTextContent: (instance) => {
          },
          detachDeletedInstance: (instance) => {
            instance.destroy();
          },
          clearContainer: (container) => {
            container.root = null;
          },
          prepareUpdate: (instance, type, oldProps, newProps, root, hostContext) => {
            return diffProps(oldProps, newProps);
          },
          updateFiberProps: (instance, type, newProps) => {
            instance.applyProps(newProps);
          },
          commitUpdate: (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) => {
            instance.applyProps(newProps);
            if (updatePayload && instance.container) {
              if (updatePayload.hasDslChanges) {
                const container = instance.container;
                if (typeof container.markChanged === "function") {
                  container.markChanged(instance);
                } else {
                  container.changedNodes.add(instance);
                }
              }
            }
          },
          commitTextUpdate: (textInstance, oldText, newText) => {
            textInstance.props.text = String(newText);
            if (textInstance.container) {
              textInstance.container.commitTextUpdate(textInstance, newText);
            }
          },
          resetAfterCommit: (container) => {
            container.commit();
          },
          prepareForCommit: (container) => {
          },
          supportsHydration: false
        };
      };
      exports.createHostConfig = createHostConfig;
    }
  });

  // ../fuick_js_framework/dist/node.js
  var require_node = __commonJS({
    "../fuick_js_framework/dist/node.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Node = exports.TEXT_TYPE = void 0;
      var react_1 = __importDefault(require_react_production_min());
      exports.TEXT_TYPE = "Text";
      var nextNodeId = 1;
      var Node = class {
        constructor(type, props, container) {
          this.children = [];
          this.eventKeys = /* @__PURE__ */ new Set();
          this.id = props && typeof props.id === "number" ? props.id : nextNodeId++;
          this.type = type;
          this.props = {};
          this.container = container;
          this.container?.registerNode(this);
          this.applyProps(props);
        }
        applyProps(newProps) {
          const oldRefId = this.props?.refId;
          if (oldRefId) {
            this.container?.unregisterNode(this);
          }
          this.clearCallbacks();
          this.props = {};
          if (newProps) {
            const propKeys = Object.keys(newProps);
            for (const key of propKeys) {
              if (key === "children")
                continue;
              const value = newProps[key];
              this.props[key] = value;
            }
            this.registerCallbacksRecursive(newProps);
          }
          this.container?.registerNode(this);
        }
        registerCallbacksRecursive(obj, path = "") {
          if (!obj || typeof obj !== "object")
            return;
          if (react_1.default.isValidElement(obj))
            return;
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => this.registerCallbacksRecursive(item, path ? `${path}[${index}]` : `[${index}]`));
            return;
          }
          for (const key in obj) {
            if (path === "" && (key === "children" || key === "key" || key === "ref" || key === "isBoundary"))
              continue;
            if (key === "itemBuilder")
              continue;
            const value = obj[key];
            const fullKey = path ? `${path}.${key}` : key;
            if (typeof value === "function") {
              this.saveCallback(fullKey, value);
            } else if (value && typeof value === "object") {
              this.registerCallbacksRecursive(value, fullKey);
            }
          }
        }
        saveCallback(key, fn) {
          this.eventKeys.add(key);
          this.container?.registerCallback(this.id, key, fn);
        }
        clearCallbacks() {
          if (this.container) {
            for (const key of this.eventKeys) {
              this.container.unregisterCallback(this.id, key);
            }
          }
          this.eventKeys.clear();
        }
        getCallback(key) {
          return this.container?.getCallback(this.id, key);
        }
        toDsl() {
          let type = this.type;
          if (!type)
            return null;
          if (type.startsWith("flutter-")) {
            type = type.substring(8).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
          }
          const props = this.container ? this.container.processProps(this.id, this.props, type) : {};
          const refId = this.props?.refId;
          const children = [];
          for (const child of this.children) {
            if (child.type === "flutter-props") {
              const propsKey = child.props?.propsKey;
              if (propsKey) {
                const propChildren = child.children.map((c) => c.toDsl()).filter((c) => c !== null);
                if (propChildren.length > 0) {
                  const newValue = propChildren.length === 1 ? propChildren[0] : propChildren;
                  if (props[propsKey]) {
                    if (Array.isArray(props[propsKey])) {
                      props[propsKey].push(newValue);
                    } else {
                      props[propsKey] = [props[propsKey], newValue];
                    }
                  } else {
                    props[propsKey] = newValue;
                  }
                }
              }
            } else {
              const dslChild = child.toDsl();
              if (dslChild) {
                children.push(dslChild);
              }
            }
          }
          const result = {
            id: this.id,
            type: String(type),
            props,
            children
          };
          if (refId) {
            const rawRefId = String(refId);
            const pageId = this.container?.pageId || 0;
            result.refId = rawRefId.indexOf(":") !== -1 ? rawRefId : `${pageId}:${rawRefId}`;
          }
          if (this.props?.isBoundary) {
            result.isBoundary = true;
          }
          return result;
        }
        destroy() {
          this.clearCallbacks();
          this.container?.unregisterNode(this);
          for (const child of this.children) {
            child.destroy();
          }
        }
      };
      exports.Node = Node;
    }
  });

  // ../fuick_js_framework/dist/PageContainer.js
  var require_PageContainer = __commonJS({
    "../fuick_js_framework/dist/PageContainer.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PageContainer = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var node_1 = require_node();
      var PageContainer = class {
        constructor(pageId) {
          this.root = null;
          this.changedNodes = /* @__PURE__ */ new Set();
          this.rendered = false;
          this.eventCallbacks = /* @__PURE__ */ new Map();
          this.onVisibleCallbacks = /* @__PURE__ */ new Set();
          this.onInvisibleCallbacks = /* @__PURE__ */ new Set();
          this.nodes = /* @__PURE__ */ new Map();
          this.nodesByRefId = /* @__PURE__ */ new Map();
          this.virtualNodeIdCounter = 1e6;
          this.isVisible = false;
          this.pageId = pageId;
        }
        registerNode(node) {
          this.nodes.set(node.id, node);
          if (node.props?.refId) {
            this.nodesByRefId.set(node.props.refId, node);
          }
        }
        unregisterNode(node) {
          this.nodes.delete(node.id);
          if (node.props?.refId) {
            this.nodesByRefId.delete(node.props.refId);
          }
        }
        getNodeByRefId(refId) {
          return this.nodesByRefId.get(refId);
        }
        registerCallback(nodeId, eventKey, fn) {
          this.eventCallbacks.set(`${nodeId}:${eventKey}`, fn);
        }
        unregisterCallback(nodeId, eventKey) {
          this.eventCallbacks.delete(`${nodeId}:${eventKey}`);
        }
        getCallback(nodeId, eventKey) {
          return this.eventCallbacks.get(`${nodeId}:${eventKey}`);
        }
        registerVisibleCallback(fn) {
          this.onVisibleCallbacks.add(fn);
          if (this.isVisible) {
            try {
              fn();
            } catch (e) {
              console.error(`Error in onVisible callback (immediate) for page ${this.pageId}:`, e);
            }
          }
        }
        unregisterVisibleCallback(fn) {
          this.onVisibleCallbacks.delete(fn);
        }
        registerInvisibleCallback(fn) {
          this.onInvisibleCallbacks.add(fn);
        }
        unregisterInvisibleCallback(fn) {
          this.onInvisibleCallbacks.delete(fn);
        }
        notifyVisible() {
          this.isVisible = true;
          this.onVisibleCallbacks.forEach((fn) => {
            try {
              fn();
            } catch (e) {
              console.error(`Error in onVisible callback for page ${this.pageId}:`, e);
            }
          });
        }
        notifyInvisible() {
          this.isVisible = false;
          this.onInvisibleCallbacks.forEach((fn) => {
            try {
              fn();
            } catch (e) {
              console.error(`Error in onInvisible callback for page ${this.pageId}:`, e);
            }
          });
        }
        markChanged(node) {
          if (!node)
            return;
          let current = node;
          while (current.parent && !current.props?.isBoundary) {
            current = current.parent;
          }
          this.changedNodes.add(current);
        }
        createInstance(type, props) {
          const node = new node_1.Node(type, props, this);
          this.markChanged(node);
          return node;
        }
        createTextInstance(text) {
          const node = new node_1.Node(node_1.TEXT_TYPE, { text }, this);
          this.markChanged(node);
          return node;
        }
        appendChild(parent, child) {
          if (child.parent) {
            const oldIndex = child.parent.children.indexOf(child);
            if (oldIndex >= 0) {
              child.parent.children.splice(oldIndex, 1);
              this.markChanged(child.parent);
            }
          } else {
            const oldIndex = parent.children.indexOf(child);
            if (oldIndex >= 0) {
              parent.children.splice(oldIndex, 1);
            }
          }
          child.parent = parent;
          parent.children.push(child);
          this.markChanged(parent);
        }
        insertBefore(parent, child, beforeChild) {
          if (child.parent) {
            const oldIndex = child.parent.children.indexOf(child);
            if (oldIndex >= 0) {
              child.parent.children.splice(oldIndex, 1);
              if (child.parent !== parent) {
                this.markChanged(child.parent);
              }
            }
          } else {
            const oldIndex = parent.children.indexOf(child);
            if (oldIndex >= 0) {
              parent.children.splice(oldIndex, 1);
            }
          }
          child.parent = parent;
          const i = parent.children.indexOf(beforeChild);
          if (i >= 0) {
            parent.children.splice(i, 0, child);
          } else {
            parent.children.push(child);
          }
          this.markChanged(parent);
        }
        removeChild(parent, child) {
          const i = parent.children.indexOf(child);
          if (i >= 0)
            parent.children.splice(i, 1);
          child.destroy();
          this.markChanged(parent);
        }
        appendChildToContainer(child) {
          this.root = child;
          this.markChanged(child);
        }
        removeChildFromContainer(child) {
          if (this.root === child) {
            this.root = null;
          }
          child.destroy();
        }
        commitTextUpdate(node, text) {
          node.props.text = String(text);
          this.markChanged(node);
        }
        commit() {
          try {
            if (this.changedNodes.size === 0) {
              return;
            }
            if (!this.root) {
              return;
            }
            if (typeof dartCallNative !== "function")
              return;
            const rootChanged = this.root && this.changedNodes.has(this.root);
            if (!this.rendered || rootChanged) {
              const dsl = this.root?.toDsl();
              if (dsl && dsl.type) {
                dartCallNative("renderUI", {
                  pageId: Number(this.pageId),
                  renderData: dsl
                });
                this.rendered = true;
              }
            } else {
              const patches = [];
              const processedNodes = /* @__PURE__ */ new Set();
              const normalizedChangedNodes = /* @__PURE__ */ new Set();
              for (const node of this.changedNodes) {
                if (node.type === "flutter-props" && node.parent) {
                  normalizedChangedNodes.add(node.parent);
                } else {
                  normalizedChangedNodes.add(node);
                }
              }
              const topLevelNodes = /* @__PURE__ */ new Set();
              for (const node of normalizedChangedNodes) {
                let isRedundant = false;
                let current = node.parent;
                while (current) {
                  if (normalizedChangedNodes.has(current)) {
                    isRedundant = true;
                    break;
                  }
                  current = current.parent;
                }
                if (!isRedundant) {
                  topLevelNodes.add(node);
                }
              }
              for (const node of topLevelNodes) {
                if (processedNodes.has(node.id))
                  continue;
                const dsl = node.toDsl();
                if (dsl) {
                  patches.push(dsl);
                  processedNodes.add(node.id);
                }
              }
              if (patches.length > 0) {
                dartCallNative("patchUI", {
                  pageId: Number(this.pageId),
                  patches
                });
              }
            }
          } catch (e) {
            console.error(`[PageContainer] Error during commit for page ${this.pageId}:`, e);
          } finally {
            this.clear();
          }
        }
        getItemDSL(refId, index) {
          const node = this.getNodeByRefId(refId);
          if (!node) {
            return null;
          }
          const itemBuilder = node.props?.itemBuilder;
          if (typeof itemBuilder !== "function") {
            return null;
          }
          try {
            const element = itemBuilder(index);
            const dsl = this.elementToDsl(element);
            return dsl;
          } catch (e) {
            console.error(`[PageContainer] Error in itemBuilder for refId ${refId} at index ${index}:`, e);
            return null;
          }
        }
        elementToDsl(element) {
          if (!element)
            return null;
          if (typeof element === "string" || typeof element === "number") {
            return { type: "Text", props: { text: String(element) } };
          }
          if (Array.isArray(element)) {
            return element.map((e) => this.elementToDsl(e)).filter((e) => e !== null);
          }
          if (element.type) {
            let type = element.type;
            const originalProps = element.props || {};
            while (typeof type === "object" && type !== null && type.type) {
              type = type.type;
            }
            if (typeof type === "function") {
              if (type.prototype && type.prototype.isReactComponent) {
                const instance = new type(originalProps);
                instance.context = { pageId: this.pageId };
                if (element.ref) {
                  if (typeof element.ref === "function") {
                    element.ref(instance);
                  } else if (typeof element.ref === "object" && element.ref !== null) {
                    element.ref.current = instance;
                  }
                }
                return this.elementToDsl(instance.render());
              }
              return this.elementToDsl(type(originalProps));
            }
            const props = { ...originalProps };
            const children = props.children;
            delete props.children;
            const nodeId = typeof props.id === "number" ? props.id : ++this.virtualNodeIdCounter;
            if (!props.id || typeof props.id !== "number")
              props.id = nodeId;
            if (typeof type === "string" && type.startsWith("flutter-")) {
              type = type.substring(8).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
            }
            const processedProps = this.processProps(nodeId, props, type);
            const dslChildren = [];
            const childrenToProcess = Array.isArray(children) ? children : children ? [children] : [];
            for (const child of childrenToProcess) {
              const childDsl = this.elementToDsl(child);
              if (childDsl) {
                if (Array.isArray(childDsl)) {
                  dslChildren.push(...childDsl);
                } else {
                  dslChildren.push(childDsl);
                }
              }
            }
            const result = {
              id: nodeId,
              type: String(type),
              props: processedProps,
              children: dslChildren
            };
            if (props.refId) {
              const rawRefId = String(props.refId);
              result.refId = rawRefId.indexOf(":") !== -1 ? rawRefId : `${this.pageId}:${rawRefId}`;
            }
            if (props.isBoundary) {
              result.isBoundary = true;
            }
            return result;
          }
          return null;
        }
        /**
         * 递归处理组件属性，将 React/JS 特有的属性转换为 Flutter 可识别的 DSL 格式
         *
         * 处理逻辑包括：
         * 1. 识别并转换函数回调为 Flutter 事件对象 (isFuickEvent)
         * 2. 递归处理嵌套的对象和数组
         * 3. 过滤掉 React 内部使用的私有属性
         * 4. 处理嵌套的 React 元素 (Element to DSL)
         *
         * @param nodeId 当前属性所属节点的 ID，用于事件回调定位
         * @param props 原始属性对象
         * @param nodeType 节点类型 (如 'ListView', 'Text')，用于特殊逻辑处理
         * @param path 当前处理的属性路径 (如 'decoration.color')，用于生成唯一的事件 key
         * @returns 处理后的 DSL 属性对象
         */
        processProps(nodeId, props, nodeType, path = "") {
          if (!props || typeof props !== "object")
            return props;
          if (react_1.default.isValidElement(props))
            return this.elementToDsl(props);
          if (Array.isArray(props)) {
            return props.map((item, index) => this.processProps(nodeId, item, nodeType, path ? `${path}[${index}]` : `[${index}]`));
          }
          const processedProps = {};
          for (const key in props) {
            if (path === "" && (key === "children" || key === "key" || key === "ref" || key === "isBoundary"))
              continue;
            if (key === "itemBuilder") {
              continue;
            }
            const value = props[key];
            const fullKey = path ? `${path}.${key}` : key;
            if (typeof value === "function") {
              this.registerCallback(nodeId, fullKey, value);
              processedProps[key] = {
                "id": Number(nodeId),
                // 节点 ID
                "nodeId": Number(nodeId),
                // 节点 ID (兼容性保留)
                "eventKey": String(fullKey),
                // 唯一的事件标识符 (包含路径)
                "pageId": Number(this.pageId),
                // 页面 ID
                "isFuickEvent": true
                // 标识这是一个需要 JS 回调的事件
              };
            } else if (value && typeof value === "object") {
              processedProps[key] = this.processProps(nodeId, value, nodeType, fullKey);
            } else {
              processedProps[key] = value;
            }
          }
          return processedProps;
        }
        clear() {
          this.changedNodes.clear();
        }
      };
      exports.PageContainer = PageContainer;
    }
  });

  // ../fuick_js_framework/dist/renderer.js
  var require_renderer = __commonJS({
    "../fuick_js_framework/dist/renderer.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.dispatchEvent = dispatchEvent;
      exports.createRenderer = createRenderer;
      var react_reconciler_1 = __importDefault(require_react_reconciler_production_min());
      var hostConfig_1 = require_hostConfig();
      var PageContainer_1 = require_PageContainer();
      var containers = {};
      var roots = {};
      function dispatchEvent(eventObj, payload) {
        try {
          const pageId = eventObj?.pageId;
          const nodeId = Number(eventObj?.nodeId || eventObj?.id);
          const eventKey = eventObj?.eventKey;
          console.log(`[Renderer] dispatchEvent pageId=${pageId}, nodeId=${nodeId}, eventKey=${eventKey}`);
          const container = containers[pageId];
          if (container) {
            const fn = container.getCallback(nodeId, eventKey);
            if (typeof fn === "function") {
              console.log(`[Renderer] Found callback for nodeId=${nodeId}, eventKey=${eventKey}, executing...`);
              fn(payload);
            } else {
              console.warn(`[Renderer] Callback not found for nodeId=${nodeId}, eventKey=${eventKey}`);
            }
          } else {
            console.warn(`[Renderer] Container not found for pageId=${pageId}`);
          }
        } catch (e) {
          console.error(`[Renderer] Error in dispatchEvent:`, e);
        }
      }
      function createRenderer() {
        const reconciler = (0, react_reconciler_1.default)((0, hostConfig_1.createHostConfig)());
        function ensureRoot(pageId) {
          if (roots[pageId])
            return roots[pageId];
          const container = new PageContainer_1.PageContainer(pageId);
          const root = reconciler.createContainer(container, 0, false, null);
          containers[pageId] = container;
          roots[pageId] = root;
          return root;
        }
        return {
          update(element, pageId) {
            const root = ensureRoot(pageId);
            const performUpdate = () => {
              try {
                reconciler.updateContainer(element, root, null, () => {
                });
              } catch (e) {
                const msg = e.message || String(e);
                if (msg.includes("327") || msg.includes("working")) {
                  globalThis.setTimeout(performUpdate, 16);
                } else {
                  console.error(`[Renderer] Error updating page ${pageId}:`, e);
                }
              }
            };
            performUpdate();
          },
          destroy(pageId) {
            const root = roots[pageId];
            if (root) {
              const performDestroy = () => {
                try {
                  reconciler.updateContainer(null, root, null, () => {
                    console.log(`[Renderer] Page ${pageId} unmounted successfully`);
                  });
                  delete roots[pageId];
                  delete containers[pageId];
                } catch (e) {
                  const msg = e.message || String(e);
                  if (msg.includes("327") || msg.includes("working")) {
                    globalThis.setTimeout(performDestroy, 16);
                  } else {
                    console.error(`[Renderer] Error destroying page ${pageId}:`, e);
                    delete roots[pageId];
                    delete containers[pageId];
                  }
                }
              };
              performDestroy();
            }
          },
          dispatchEvent,
          getItemDSL(pageId, refId, index) {
            const container = containers[pageId];
            if (container) {
              return container.getItemDSL(refId, index);
            }
            return null;
          },
          elementToDsl(pageId, element) {
            let container = containers[pageId];
            if (!container) {
              container = new PageContainer_1.PageContainer(pageId);
            }
            return container.elementToDsl(element);
          },
          notifyLifecycle(pageId, type) {
            const container = containers[pageId];
            console.log(`[Renderer] notifyLifecycle pageId=${pageId}, type=${type}, container exists: ${!!container}`);
            if (container) {
              if (type === "visible") {
                container.notifyVisible();
              } else if (type === "invisible") {
                container.notifyInvisible();
              }
            }
          },
          getContainer(pageId) {
            return containers[pageId];
          }
        };
      }
    }
  });

  // ../fuick_js_framework/dist/router.js
  var require_router = __commonJS({
    "../fuick_js_framework/dist/router.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Router = void 0;
      exports.register = register;
      exports.match = match;
      var routes = {};
      function register(path, componentFactory) {
        routes[path] = componentFactory;
      }
      function match(path) {
        return routes[path];
      }
      exports.Router = {
        register,
        match
      };
    }
  });

  // ../fuick_js_framework/dist/page_render.js
  var require_page_render = __commonJS({
    "../fuick_js_framework/dist/page_render.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
          }
          __setModuleDefault(result, mod);
          return result;
        };
      }();
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ensureRenderer = ensureRenderer;
      exports.render = render;
      exports.destroy = destroy;
      exports.getItemDSL = getItemDSL;
      exports.elementToDsl = elementToDsl;
      exports.notifyLifecycle = notifyLifecycle;
      exports.getContainer = getContainer;
      var react_1 = __importDefault(require_react_production_min());
      var renderer_1 = require_renderer();
      var Router = __importStar(require_router());
      var PageContext_1 = require_PageContext();
      var renderer = null;
      function ensureRenderer() {
        if (renderer)
          return renderer;
        renderer = (0, renderer_1.createRenderer)();
        return renderer;
      }
      function render(pageId, path, params) {
        const startTime = Date.now();
        const r = ensureRenderer();
        console.log(`[JS Performance] render start for ${path}, pageId: ${pageId}`);
        const factory = Router.match(path);
        let app;
        if (typeof factory === "function") {
          app = factory(params || {});
        } else {
          app = react_1.default.createElement("Column", { padding: 16, mainAxisAlignment: "center" }, react_1.default.createElement("Text", { text: `Route ${path} not found`, fontSize: 16, color: "#cc0000" }));
        }
        const wrappedApp = react_1.default.createElement(PageContext_1.PageContext.Provider, { value: { pageId } }, app);
        r.update(wrappedApp, pageId);
        console.log(`[JS Performance] render total cost for ${path}: ${Date.now() - startTime}ms`);
      }
      function destroy(pageId) {
        const r = ensureRenderer();
        r.destroy(pageId);
      }
      function getItemDSL(pageId, refId, index) {
        const r = ensureRenderer();
        return r.getItemDSL(pageId, refId, index);
      }
      function elementToDsl(pageId, element) {
        const r = ensureRenderer();
        return r.elementToDsl(pageId, element);
      }
      function notifyLifecycle(pageId, type) {
        const r = ensureRenderer();
        r.notifyLifecycle(pageId, type);
      }
      function getContainer(pageId) {
        const r = ensureRenderer();
        return r.getContainer(pageId);
      }
    }
  });

  // ../fuick_js_framework/dist/widgets/ListView.js
  var require_ListView = __commonJS({
    "../fuick_js_framework/dist/widgets/ListView.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ListView = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var page_render_1 = require_page_render();
      var ListView = class extends BaseWidget_1.BaseWidget {
        animateTo(offset, duration = 300, curve = "easeInOut") {
          this.callNativeCommand("animateTo", { offset, duration, curve });
        }
        jumpTo(offset) {
          this.callNativeCommand("jumpTo", { offset });
        }
        updateItem(index, dsl) {
          let finalDsl = dsl;
          if (react_1.default.isValidElement(dsl)) {
            finalDsl = (0, page_render_1.elementToDsl)(this.pageId, dsl);
          }
          this.callNativeCommand("updateItem", { index, dsl: finalDsl });
        }
        refresh() {
          this.callNativeCommand("refresh");
        }
        render() {
          const { children, ...rest } = this.props;
          return react_1.default.createElement("flutter-list-view", {
            ...rest,
            hasBuilder: !!this.props.itemBuilder,
            refId: this.scopedRefId,
            isBoundary: true
          }, children);
        }
      };
      exports.ListView = ListView;
      exports.default = ListView;
    }
  });

  // ../fuick_js_framework/dist/widgets/Padding.js
  var require_Padding = __commonJS({
    "../fuick_js_framework/dist/widgets/Padding.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Padding = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Padding = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-padding", { ...this.props });
        }
      };
      exports.Padding = Padding;
      exports.default = Padding;
    }
  });

  // ../fuick_js_framework/dist/widgets/Image.js
  var require_Image = __commonJS({
    "../fuick_js_framework/dist/widgets/Image.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Image = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Image = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-image", { ...this.props, isBoundary: false });
        }
      };
      exports.Image = Image;
      exports.default = Image;
    }
  });

  // ../fuick_js_framework/dist/widgets/SizedBox.js
  var require_SizedBox = __commonJS({
    "../fuick_js_framework/dist/widgets/SizedBox.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SizedBox = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var SizedBox = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-sized-box", { ...this.props });
        }
      };
      exports.SizedBox = SizedBox;
      exports.default = SizedBox;
    }
  });

  // ../fuick_js_framework/dist/widgets/Center.js
  var require_Center = __commonJS({
    "../fuick_js_framework/dist/widgets/Center.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Center = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Center = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-center", { ...this.props, isBoundary: false });
        }
      };
      exports.Center = Center;
      exports.default = Center;
    }
  });

  // ../fuick_js_framework/dist/widgets/Icon.js
  var require_Icon = __commonJS({
    "../fuick_js_framework/dist/widgets/Icon.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Icon = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Icon = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-icon", { ...this.props, isBoundary: false });
        }
      };
      exports.Icon = Icon;
      exports.default = Icon;
    }
  });

  // ../fuick_js_framework/dist/widgets/Flexible.js
  var require_Flexible = __commonJS({
    "../fuick_js_framework/dist/widgets/Flexible.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Flexible = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Flexible = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-flexible", { ...this.props });
        }
      };
      exports.Flexible = Flexible;
      exports.default = Flexible;
    }
  });

  // ../fuick_js_framework/dist/widgets/GestureDetector.js
  var require_GestureDetector = __commonJS({
    "../fuick_js_framework/dist/widgets/GestureDetector.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GestureDetector = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var GestureDetector = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-gesture-detector", { ...this.props });
        }
      };
      exports.GestureDetector = GestureDetector;
      exports.default = GestureDetector;
    }
  });

  // ../fuick_js_framework/dist/widgets/InkWell.js
  var require_InkWell = __commonJS({
    "../fuick_js_framework/dist/widgets/InkWell.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InkWell = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var InkWell = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-ink-well", { ...this.props });
        }
      };
      exports.InkWell = InkWell;
      exports.default = InkWell;
    }
  });

  // ../fuick_js_framework/dist/widgets/Divider.js
  var require_Divider = __commonJS({
    "../fuick_js_framework/dist/widgets/Divider.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Divider = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Divider = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-divider", { ...this.props, isBoundary: false });
        }
      };
      exports.Divider = Divider;
      exports.default = Divider;
    }
  });

  // ../fuick_js_framework/dist/widgets/SingleChildScrollView.js
  var require_SingleChildScrollView = __commonJS({
    "../fuick_js_framework/dist/widgets/SingleChildScrollView.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SingleChildScrollView = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var SingleChildScrollView = class extends BaseWidget_1.BaseWidget {
        animateTo(offset, duration = 300, curve = "easeInOut") {
          this.callNativeCommand("animateTo", { offset, duration, curve });
        }
        render() {
          return react_1.default.createElement("flutter-single-child-scroll-view", {
            ...this.props,
            refId: this.scopedRefId,
            isBoundary: true
          });
        }
      };
      exports.SingleChildScrollView = SingleChildScrollView;
      exports.default = SingleChildScrollView;
    }
  });

  // ../fuick_js_framework/dist/widgets/Stack.js
  var require_Stack = __commonJS({
    "../fuick_js_framework/dist/widgets/Stack.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Stack = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Stack = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-stack", { ...this.props });
        }
      };
      exports.Stack = Stack;
      exports.default = Stack;
    }
  });

  // ../fuick_js_framework/dist/widgets/Positioned.js
  var require_Positioned = __commonJS({
    "../fuick_js_framework/dist/widgets/Positioned.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Positioned = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Positioned = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-positioned", { ...this.props, isBoundary: false });
        }
      };
      exports.Positioned = Positioned;
      exports.default = Positioned;
    }
  });

  // ../fuick_js_framework/dist/widgets/Opacity.js
  var require_Opacity = __commonJS({
    "../fuick_js_framework/dist/widgets/Opacity.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Opacity = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var Opacity = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-opacity", { ...this.props, isBoundary: false });
        }
      };
      exports.Opacity = Opacity;
      exports.default = Opacity;
    }
  });

  // ../fuick_js_framework/dist/widgets/CircularProgressIndicator.js
  var require_CircularProgressIndicator = __commonJS({
    "../fuick_js_framework/dist/widgets/CircularProgressIndicator.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CircularProgressIndicator = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var CircularProgressIndicator = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-circular-progress-indicator", { ...this.props, isBoundary: false });
        }
      };
      exports.CircularProgressIndicator = CircularProgressIndicator;
      exports.default = CircularProgressIndicator;
    }
  });

  // ../fuick_js_framework/dist/widgets/SafeArea.js
  var require_SafeArea = __commonJS({
    "../fuick_js_framework/dist/widgets/SafeArea.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SafeArea = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var SafeArea = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-safe-area", { ...this.props, isBoundary: false });
        }
      };
      exports.SafeArea = SafeArea;
      exports.default = SafeArea;
    }
  });

  // ../fuick_js_framework/dist/widgets/FlutterProps.js
  var require_FlutterProps = __commonJS({
    "../fuick_js_framework/dist/widgets/FlutterProps.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FlutterProps = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var FlutterProps = class extends react_1.default.Component {
        render() {
          return react_1.default.createElement("flutter-props", { propsKey: this.props.propsKey }, this.props.children);
        }
      };
      exports.FlutterProps = FlutterProps;
    }
  });

  // ../fuick_js_framework/dist/widgets/Scaffold.js
  var require_Scaffold = __commonJS({
    "../fuick_js_framework/dist/widgets/Scaffold.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Scaffold = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var FlutterProps_1 = require_FlutterProps();
      var Scaffold = class extends react_1.default.Component {
        render() {
          const { appBar, body, floatingActionButton, children, ...otherProps } = this.props;
          return react_1.default.createElement("flutter-scaffold", { ...otherProps }, appBar && react_1.default.createElement(FlutterProps_1.FlutterProps, { propsKey: "appBar" }, appBar), body && react_1.default.createElement(FlutterProps_1.FlutterProps, { propsKey: "body" }, body), floatingActionButton && react_1.default.createElement(FlutterProps_1.FlutterProps, { propsKey: "floatingActionButton" }, floatingActionButton), children);
        }
      };
      exports.Scaffold = Scaffold;
      exports.default = Scaffold;
    }
  });

  // ../fuick_js_framework/dist/widgets/AppBar.js
  var require_AppBar = __commonJS({
    "../fuick_js_framework/dist/widgets/AppBar.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AppBar = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var FlutterProps_1 = require_FlutterProps();
      var AppBar = class extends react_1.default.Component {
        render() {
          const { title, leading, actions, children, ...otherProps } = this.props;
          return react_1.default.createElement("flutter-app-bar", { ...otherProps, isBoundary: false }, title && react_1.default.createElement(FlutterProps_1.FlutterProps, { propsKey: "title" }, title), leading && react_1.default.createElement(FlutterProps_1.FlutterProps, { propsKey: "leading" }, leading), actions && actions.map((action, index) => react_1.default.createElement(FlutterProps_1.FlutterProps, { key: `action-${index}`, propsKey: "actions" }, action)), children);
        }
      };
      exports.AppBar = AppBar;
      exports.default = AppBar;
    }
  });

  // ../fuick_js_framework/dist/widgets/PageView.js
  var require_PageView = __commonJS({
    "../fuick_js_framework/dist/widgets/PageView.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PageView = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var PageView = class extends BaseWidget_1.BaseWidget {
        animateToPage(page, duration = 300, curve = "easeInOut") {
          this.callNativeCommand("animateToPage", { page, duration, curve });
        }
        jumpToPage(page) {
          this.callNativeCommand("jumpToPage", { page });
        }
        render() {
          const { ref, ...otherProps } = this.props;
          return react_1.default.createElement("flutter-page-view", {
            ...otherProps,
            refId: this.scopedRefId,
            isBoundary: true
          });
        }
      };
      exports.PageView = PageView;
      exports.default = PageView;
    }
  });

  // ../fuick_js_framework/dist/widgets/GridView.js
  var require_GridView = __commonJS({
    "../fuick_js_framework/dist/widgets/GridView.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GridView = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var page_render_1 = require_page_render();
      var GridView = class extends BaseWidget_1.BaseWidget {
        animateTo(offset, duration = 300, curve = "easeInOut") {
          this.callNativeCommand("animateTo", { offset, duration, curve });
        }
        updateItem(index, dsl) {
          let finalDsl = dsl;
          if (react_1.default.isValidElement(dsl)) {
            finalDsl = (0, page_render_1.elementToDsl)(this.pageId, dsl);
          }
          this.callNativeCommand("updateItem", { index, dsl: finalDsl });
        }
        refresh() {
          this.callNativeCommand("refresh");
        }
        render() {
          const { children, ...rest } = this.props;
          return react_1.default.createElement("flutter-grid-view", {
            ...rest,
            hasBuilder: !!this.props.itemBuilder,
            refId: this.scopedRefId,
            isBoundary: true
          }, children);
        }
      };
      exports.GridView = GridView;
      exports.default = GridView;
    }
  });

  // ../fuick_js_framework/dist/widgets/BatchedListView.js
  var require_BatchedListView = __commonJS({
    "../fuick_js_framework/dist/widgets/BatchedListView.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BatchedListView = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var BaseWidget_1 = require_BaseWidget();
      var page_render_1 = require_page_render();
      var BatchedListView = class extends BaseWidget_1.BaseWidget {
        animateTo(offset, duration = 300, curve = "easeInOut") {
          this.callNativeCommand("animateTo", { offset, duration, curve });
        }
        jumpTo(offset) {
          this.callNativeCommand("jumpTo", { offset });
        }
        render() {
          const { itemCount, itemBuilder, children, ...rest } = this.props;
          const items = [];
          for (let i = 0; i < itemCount; i++) {
            const element = itemBuilder(i);
            items.push((0, page_render_1.elementToDsl)(this.pageId, element));
          }
          return react_1.default.createElement("flutter-batched-list-view", {
            ...rest,
            items,
            refId: this.scopedRefId,
            isBoundary: true
          });
        }
      };
      exports.BatchedListView = BatchedListView;
      exports.default = BatchedListView;
    }
  });

  // ../fuick_js_framework/dist/widgets/index.js
  var require_widgets = __commonJS({
    "../fuick_js_framework/dist/widgets/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_types(), exports);
      __exportStar(require_BaseWidget(), exports);
      __exportStar(require_Text(), exports);
      __exportStar(require_Column(), exports);
      __exportStar(require_Row(), exports);
      __exportStar(require_Container(), exports);
      __exportStar(require_Button(), exports);
      __exportStar(require_TextField(), exports);
      __exportStar(require_Switch(), exports);
      __exportStar(require_Expanded(), exports);
      __exportStar(require_ListView(), exports);
      __exportStar(require_Padding(), exports);
      __exportStar(require_Image(), exports);
      __exportStar(require_SizedBox(), exports);
      __exportStar(require_Center(), exports);
      __exportStar(require_Icon(), exports);
      __exportStar(require_Flexible(), exports);
      __exportStar(require_GestureDetector(), exports);
      __exportStar(require_InkWell(), exports);
      __exportStar(require_Divider(), exports);
      __exportStar(require_SingleChildScrollView(), exports);
      __exportStar(require_Stack(), exports);
      __exportStar(require_Positioned(), exports);
      __exportStar(require_Opacity(), exports);
      __exportStar(require_CircularProgressIndicator(), exports);
      __exportStar(require_SafeArea(), exports);
      __exportStar(require_Scaffold(), exports);
      __exportStar(require_AppBar(), exports);
      __exportStar(require_FlutterProps(), exports);
      __exportStar(require_PageView(), exports);
      __exportStar(require_GridView(), exports);
      __exportStar(require_BatchedListView(), exports);
    }
  });

  // ../fuick_js_framework/dist/components.js
  var require_components = __commonJS({
    "../fuick_js_framework/dist/components.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
          }
          __setModuleDefault(result, mod);
          return result;
        };
      }();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BatchedListView = exports.GridView = exports.PageView = exports.FlutterProps = exports.AppBar = exports.Scaffold = exports.SafeArea = exports.CircularProgressIndicator = exports.Opacity = exports.Positioned = exports.Stack = exports.SingleChildScrollView = exports.Divider = exports.InkWell = exports.GestureDetector = exports.Flexible = exports.Expanded = exports.Switch = exports.TextField = exports.Icon = exports.Center = exports.Button = exports.SizedBox = exports.Image = exports.Row = exports.Padding = exports.ListView = exports.Text = exports.Container = exports.Column = void 0;
      var Widgets = __importStar(require_widgets());
      exports.Column = Widgets.Column;
      exports.Container = Widgets.Container;
      exports.Text = Widgets.Text;
      exports.ListView = Widgets.ListView;
      exports.Padding = Widgets.Padding;
      exports.Row = Widgets.Row;
      exports.Image = Widgets.Image;
      exports.SizedBox = Widgets.SizedBox;
      exports.Button = Widgets.Button;
      exports.Center = Widgets.Center;
      exports.Icon = Widgets.Icon;
      exports.TextField = Widgets.TextField;
      exports.Switch = Widgets.Switch;
      exports.Expanded = Widgets.Expanded;
      exports.Flexible = Widgets.Flexible;
      exports.GestureDetector = Widgets.GestureDetector;
      exports.InkWell = Widgets.InkWell;
      exports.Divider = Widgets.Divider;
      exports.SingleChildScrollView = Widgets.SingleChildScrollView;
      exports.Stack = Widgets.Stack;
      exports.Positioned = Widgets.Positioned;
      exports.Opacity = Widgets.Opacity;
      exports.CircularProgressIndicator = Widgets.CircularProgressIndicator;
      exports.SafeArea = Widgets.SafeArea;
      exports.Scaffold = Widgets.Scaffold;
      exports.AppBar = Widgets.AppBar;
      exports.FlutterProps = Widgets.FlutterProps;
      var widgets_1 = require_widgets();
      Object.defineProperty(exports, "PageView", { enumerable: true, get: function() {
        return widgets_1.PageView;
      } });
      Object.defineProperty(exports, "GridView", { enumerable: true, get: function() {
        return widgets_1.GridView;
      } });
      Object.defineProperty(exports, "BatchedListView", { enumerable: true, get: function() {
        return widgets_1.BatchedListView;
      } });
    }
  });

  // ../fuick_js_framework/dist/navigator.js
  var require_navigator = __commonJS({
    "../fuick_js_framework/dist/navigator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.push = push;
      exports.pop = pop;
      function push(path, params) {
        if (typeof dartCallNative === "function") {
          dartCallNative("push", { path, params });
        }
      }
      function pop() {
        if (typeof dartCallNative === "function") {
          dartCallNative("pop", {});
        }
      }
    }
  });

  // ../fuick_js_framework/dist/ex/console.js
  var require_console = __commonJS({
    "../fuick_js_framework/dist/ex/console.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.log = log;
      exports.warn = warn;
      exports.error = error;
      function log(...args) {
        const message = args.map((a) => String(a)).join(" ");
        if (typeof dartCallNative === "function") {
          dartCallNative("console", { level: "log", message });
        } else if (typeof globalThis.print === "function") {
          globalThis.print(message);
        }
      }
      function warn(...args) {
        const message = args.map((a) => String(a)).join(" ");
        if (typeof dartCallNative === "function") {
          dartCallNative("console", { level: "warn", message });
        } else if (typeof globalThis.print === "function") {
          globalThis.print("[WARN] " + message);
        }
      }
      function error(...args) {
        const message = args.map((a) => String(a)).join(" ");
        if (typeof dartCallNative === "function") {
          dartCallNative("console", { level: "error", message });
        } else if (typeof globalThis.print === "function") {
          globalThis.print("[ERROR] " + message);
        }
      }
    }
  });

  // ../fuick_js_framework/dist/ex/timer.js
  var require_timer = __commonJS({
    "../fuick_js_framework/dist/ex/timer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.setTimeout = setTimeout2;
      exports.clearTimeout = clearTimeout2;
      exports.setInterval = setInterval;
      exports.clearInterval = clearInterval;
      var nextTimerId = 1;
      var timerMap = /* @__PURE__ */ new Map();
      function setTimeout2(fn, ms) {
        const id = nextTimerId++;
        timerMap.set(id, { fn, type: "timeout" });
        const delay = ms || 0;
        if (delay === 0) {
          Promise.resolve().then(() => {
            const entry = timerMap.get(id);
            if (entry) {
              timerMap.delete(id);
              try {
                fn();
              } catch (e) {
                console.error(`[Timer] Error in setTimeout(0) callback:`, e);
              }
            }
          });
          return id;
        }
        if (typeof dartCallNative === "function") {
          dartCallNative("createTimer", { id, delay, isInterval: false });
        } else {
          fn();
        }
        return id;
      }
      function clearTimeout2(id) {
        timerMap.delete(id);
        if (typeof dartCallNative === "function") {
          dartCallNative("deleteTimer", { id });
        }
      }
      function setInterval(fn, ms) {
        const id = nextTimerId++;
        timerMap.set(id, { fn, type: "interval" });
        if (typeof dartCallNative === "function") {
          dartCallNative("createTimer", { id, delay: ms || 0, isInterval: true });
        }
        return id;
      }
      function clearInterval(id) {
        timerMap.delete(id);
        if (typeof dartCallNative === "function") {
          dartCallNative("deleteTimer", { id });
        }
      }
      globalThis.__handleTimer = (id) => {
        const entry = timerMap.get(id);
        if (entry) {
          if (entry.type === "timeout") {
            timerMap.delete(id);
          }
          Promise.resolve().then(() => {
            try {
              if (typeof entry.fn === "function") {
                entry.fn();
              } else {
                console.error(`[Timer] Callback for timer ${id} is not a function:`, entry.fn);
              }
            } catch (e) {
              console.error(`[Timer] Error in timer ${id} callback:`, e);
            }
          });
        }
      };
    }
  });

  // ../fuick_js_framework/dist/runtime.js
  var require_runtime = __commonJS({
    "../fuick_js_framework/dist/runtime.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
          }
          __setModuleDefault(result, mod);
          return result;
        };
      }();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Runtime = void 0;
      exports.bindGlobals = bindGlobals;
      var PageRender = __importStar(require_page_render());
      var Console = __importStar(require_console());
      var Timer = __importStar(require_timer());
      function bindGlobals() {
        setupPolyfills();
        Object.assign(globalThis, {
          FuickUIController: {
            render: PageRender.render,
            destroy: PageRender.destroy,
            getItemDSL: PageRender.getItemDSL,
            notifyLifecycle: PageRender.notifyLifecycle,
            dispatchEvent: (eventObj, payload) => {
              const r = PageRender.ensureRenderer();
              r.dispatchEvent(eventObj, payload);
            }
          }
        });
      }
      exports.Runtime = {
        bindGlobals
      };
      function setupPolyfills() {
        const oldConsole = globalThis.console || {};
        globalThis.console = {
          ...oldConsole,
          log: Console.log,
          warn: Console.warn,
          error: Console.error
        };
        globalThis.setTimeout = Timer.setTimeout;
        globalThis.clearTimeout = Timer.clearTimeout;
        globalThis.setInterval = Timer.setInterval;
        globalThis.clearInterval = Timer.clearInterval;
        if (!globalThis.performance) {
          globalThis.performance = {
            now: () => Date.now()
          };
        }
        if (typeof globalThis.queueMicrotask !== "function") {
          globalThis.queueMicrotask = function(fn) {
            Promise.resolve().then(fn);
          };
        } else {
          const originalQueueMicrotask = globalThis.queueMicrotask;
          globalThis.queueMicrotask = function(fn) {
            notifyMicrotaskEnqueued();
            originalQueueMicrotask(fn);
          };
        }
        setupPromiseInterception();
      }
      function notifyMicrotaskEnqueued() {
        if (typeof globalThis.__qjs_run_jobs === "function") {
          globalThis.__qjs_run_jobs();
        }
      }
      function setupPromiseInterception() {
        const Proto = Promise.prototype;
        const originalThen = Proto.then;
        const originalCatch = Proto.catch;
        const originalFinally = Proto.finally;
        Proto.then = function(onfulfilled, onrejected) {
          notifyMicrotaskEnqueued();
          return originalThen.call(this, onfulfilled, onrejected);
        };
        Proto.catch = function(onrejected) {
          notifyMicrotaskEnqueued();
          return originalCatch.call(this, onrejected);
        };
        Proto.finally = function(onfinally) {
          notifyMicrotaskEnqueued();
          return originalFinally.call(this, onfinally);
        };
      }
    }
  });

  // ../fuick_js_framework/dist/hooks.js
  var require_hooks = __commonJS({
    "../fuick_js_framework/dist/hooks.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
          }
          __setModuleDefault(result, mod);
          return result;
        };
      }();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.useVisible = useVisible;
      exports.useInvisible = useInvisible;
      var react_1 = require_react_production_min();
      var PageContext_1 = require_PageContext();
      var PageRender = __importStar(require_page_render());
      function useVisible(callback) {
        const { pageId } = (0, react_1.useContext)(PageContext_1.PageContext);
        (0, react_1.useEffect)(() => {
          const container = PageRender.getContainer(pageId);
          if (container) {
            container.registerVisibleCallback(callback);
          }
          return () => {
            const container2 = PageRender.getContainer(pageId);
            if (container2) {
              container2.unregisterVisibleCallback(callback);
            }
          };
        }, [pageId, callback]);
      }
      function useInvisible(callback) {
        const { pageId } = (0, react_1.useContext)(PageContext_1.PageContext);
        (0, react_1.useEffect)(() => {
          const container = PageRender.getContainer(pageId);
          if (container) {
            container.registerInvisibleCallback(callback);
          }
          return () => {
            const container2 = PageRender.getContainer(pageId);
            if (container2) {
              container2.unregisterInvisibleCallback(callback);
            }
          };
        }, [pageId, callback]);
      }
    }
  });

  // ../fuick_js_framework/dist/ErrorBoundary.js
  var require_ErrorBoundary = __commonJS({
    "../fuick_js_framework/dist/ErrorBoundary.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ErrorBoundary = void 0;
      var react_1 = __importDefault(require_react_production_min());
      var ErrorBoundary = class extends react_1.default.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          console.error("[ErrorBoundary] Caught error:", error, errorInfo);
        }
        render() {
          if (this.state.hasError) {
            if (typeof this.props.fallback === "function") {
              return this.props.fallback(this.state.error);
            }
            return this.props.fallback || null;
          }
          return this.props.children;
        }
      };
      exports.ErrorBoundary = ErrorBoundary;
    }
  });

  // ../fuick_js_framework/dist/index.js
  var require_dist = __commonJS({
    "../fuick_js_framework/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) {
            for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
          }
          __setModuleDefault(result, mod);
          return result;
        };
      }();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Navigator = void 0;
      __exportStar(require_components(), exports);
      __exportStar(require_renderer(), exports);
      __exportStar(require_router(), exports);
      exports.Navigator = __importStar(require_navigator());
      __exportStar(require_runtime(), exports);
      __exportStar(require_page_render(), exports);
      __exportStar(require_hooks(), exports);
      __exportStar(require_ErrorBoundary(), exports);
      __exportStar(require_timer(), exports);
      __exportStar(require_console(), exports);
      __exportStar(require_ids(), exports);
    }
  });

  // ../js/src/framework_entry.ts
  var import_react = __toESM(require_react_production_min());
  var FuickFramework = __toESM(require_dist());
  globalThis.React = import_react.default;
  globalThis.FuickFramework = FuickFramework;
})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-reconciler/cjs/react-reconciler.production.min.js:
  (**
   * @license React
   * react-reconciler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
