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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchedListView = exports.GridView = exports.PageView = exports.FlutterProps = exports.AppBar = exports.Scaffold = exports.SafeArea = exports.CircularProgressIndicator = exports.Opacity = exports.Positioned = exports.Stack = exports.SingleChildScrollView = exports.Divider = exports.InkWell = exports.GestureDetector = exports.Flexible = exports.Expanded = exports.Switch = exports.TextField = exports.Icon = exports.Center = exports.Button = exports.SizedBox = exports.Image = exports.Row = exports.Padding = exports.ListView = exports.Text = exports.Container = exports.Column = void 0;
const Widgets = __importStar(require("./widgets"));
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
var widgets_1 = require("./widgets");
Object.defineProperty(exports, "PageView", { enumerable: true, get: function () { return widgets_1.PageView; } });
Object.defineProperty(exports, "GridView", { enumerable: true, get: function () { return widgets_1.GridView; } });
Object.defineProperty(exports, "BatchedListView", { enumerable: true, get: function () { return widgets_1.BatchedListView; } });
