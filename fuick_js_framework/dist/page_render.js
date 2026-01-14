"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureRenderer = ensureRenderer;
exports.render = render;
exports.destroy = destroy;
exports.getItemDSL = getItemDSL;
exports.elementToDsl = elementToDsl;
exports.notifyLifecycle = notifyLifecycle;
exports.getContainer = getContainer;
const react_1 = __importDefault(require("react"));
const renderer_1 = require("./renderer");
const Router = __importStar(require("./router"));
const PageContext_1 = require("./PageContext");
let renderer = null;
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
    if (typeof factory === 'function') {
        app = factory(params || {});
    }
    else {
        app = react_1.default.createElement('Column', { padding: 16, mainAxisAlignment: 'center' }, react_1.default.createElement('Text', { text: `Route ${path} not found`, fontSize: 16, color: '#cc0000' }));
    }
    // Wrap with PageContext
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
