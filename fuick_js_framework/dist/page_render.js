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
const react_1 = __importDefault(require("react"));
const renderer_1 = require("./renderer");
const Router = __importStar(require("./router"));
let renderer = null;
function ensureRenderer() {
    if (renderer)
        return renderer;
    renderer = (0, renderer_1.createRenderer)();
    return renderer;
}
function render(pageId, path, params) {
    const r = ensureRenderer();
    console.log('render', pageId, path, params);
    const factory = Router.match(path);
    if (typeof factory === 'function') {
        const app = factory(params || {});
        r.update(app, pageId);
    }
    else {
        const app = react_1.default.createElement('Column', { padding: 16, mainAxisAlignment: 'center' }, react_1.default.createElement('Text', { text: `Route ${path} not found`, fontSize: 16, color: '#cc0000' }));
        r.update(app, pageId);
    }
}
function destroy(pageId) {
    const r = ensureRenderer();
    r.destroy(pageId);
}
