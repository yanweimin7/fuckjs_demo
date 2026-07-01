import React from "react";
import {
  Router,
  Runtime,
  i18n,
  setGlobalErrorFallback,
  Column,
  Text,
  Container,
  Button,
} from "fuickjs";
import { i18nResources } from "./i18n/resources";
import HomePage from "./pages/home";
import NewsPage from "./pages/news";
import NewsDetailPage from "./pages/news_detail";
import MarketPage from "./pages/market";
import DemoListPage from "./pages/demo_list";
import ColumnDemo from "./demos/ColumnDemo";
import RowDemo from "./demos/RowDemo";
import ButtonDemo from "./demos/ButtonDemo";
import TextFieldDemo from "./demos/TextFieldDemo";
import SwitchDemo from "./demos/SwitchDemo";
import ListViewDemo from "./demos/ListViewDemo";
import GridViewDemo from "./demos/GridViewDemo";
import ImageDemo from "./demos/ImageDemo";
import BundleLocalImageDemo from "./demos/BundleLocalImageDemo";
import StackDemo from "./demos/StackDemo";
import SliverDemo from "./demos/SliverDemo";
import DividerDemo from "./demos/DividerDemo";
import OpacityDemo from "./demos/OpacityDemo";
import ProgressDemo from "./demos/ProgressDemo";
import PageViewDemo from "./demos/PageViewDemo";
import BottomNavDemo from "./demos/BottomNavDemo";
import FlexDemo from "./demos/FlexDemo";
import FlexibleDemo from "./demos/FlexibleDemo";
import GestureDetectorDemo from "./demos/GestureDetectorDemo";
import SafeAreaDemo from "./demos/SafeAreaDemo";
import SingleChildScrollViewDemo from "./demos/SingleChildScrollViewDemo";
import SliverPersistentHeaderDemo from "./demos/SliverPersistentHeaderDemo";
import TabDemo from "./demos/TabDemo";
import ContainerDemo from "./demos/ContainerDemo";
import LayoutBasicsDemo from "./demos/LayoutBasicsDemo";
import InkWellDemo from "./demos/InkWellDemo";
import ScaffoldDemo from "./demos/ScaffoldDemo";
import AnimatedDemo from "./demos/AnimatedDemo";
import DialogDemo from "./demos/DialogDemo";
import IntrinsicDemo from "./demos/IntrinsicDemo";
import TextFieldControllerDemo from "./demos/TextFieldControllerDemo";
import HybridDemoPage from "./pages/hybrid_demo";
import TransitionDemo from "./demos/TransitionDemo";
import BoxDemo from "./demos/BoxDemo";
import VisibilityDemo from "./demos/VisibilityDemo";
import { DemoOpsPage } from "./pages/demo_ops";
import ErrorDemoPage from "./pages/error_demo";
import FlutterPropsDemo from "./demos/FlutterPropsDemo";
import CustomPaintDemo from "./demos/CustomPaintDemo";
import VisibilityDetectorDemo from "./demos/VisibilityDetectorDemo";
import VideoPlayerDemo from "./demos/VideoPlayerDemo";
import ClipRRectDemo from "./demos/ClipRRectDemo";
import RefreshIndicatorDemo from "./demos/RefreshIndicatorDemo";
import RichTextDemo from "./demos/RichTextDemo";
import TransformDemo from "./demos/TransformDemo";
import OverlayDemo from "./demos/OverlayDemo";
import MaterialDemo from "./demos/MaterialDemo";
import PopScopeDemo from "./demos/PopScopeDemo";
import BrowserApiDemo from "./demos/BrowserApiDemo";
import WebSocketDemo from "./demos/WebSocketDemo";

import SliderDemo from "./demos/SliderDemo";
import RadioDemo from "./demos/RadioDemo";
import FloatingActionButtonDemo from "./demos/FloatingActionButtonDemo";
import AspectRatioDemo from "./demos/AspectRatioDemo";
import FractionallySizedBoxDemo from "./demos/FractionallySizedBoxDemo";
import DrawerDemo from "./demos/DrawerDemo";
import BackdropFilterDemo from "./demos/BackdropFilterDemo";
import AnimatedSwitcherDemo from "./demos/AnimatedSwitcherDemo";
import AnimatedCrossFadeDemo from "./demos/AnimatedCrossFadeDemo";
import NestedScrollViewDemo from "./demos/NestedScrollViewDemo";
import ReactManagedListDemo from "./demos/ReactManagedListDemo";
import StaticListDemo from "./demos/StaticListDemo";
import PerformanceDemo from "./demos/PerformanceDemo";
import AlignDemo from "./demos/AlignDemo";
import HeroDemo from "./demos/HeroDemo";
import HeroDetailPage from "./demos/HeroDetailPage";
import FadeTransitionDemo from "./demos/FadeTransitionDemo";
import SizeTransitionDemo from "./demos/SizeTransitionDemo";
import PositionedTransitionDemo from "./demos/PositionedTransitionDemo";
import IndexedStackDemo from "./demos/IndexedStackDemo";
import AnimatedSizeDemo from "./demos/AnimatedSizeDemo";
import DismissibleDemo from "./demos/DismissibleDemo";
import TransitionAnimatedDemo from "./demos/TransitionAnimatedDemo";
import ThemeDemo from "./demos/ThemeDemo";
import MediaQueryDemo from "./demos/MediaQueryDemo";

// Community packages
import WebViewDemo from "./demos/WebViewDemo";
import HapticsDemo from "./demos/HapticsDemo";
import LauncherDemo from "./demos/LauncherDemo";
import ShareDemo from "./demos/ShareDemo";
import AppInfoDemo from "./demos/AppInfoDemo";
import PermissionsDemo from "./demos/PermissionsDemo";
import MediaDemo from "./demos/MediaDemo";
import ConnectivityDemo from "./demos/ConnectivityDemo";
import SoundServiceDemo from "./demos/SoundServiceDemo";
import I18nDemo from "./demos/I18nDemo";
import LifecycleDemo from "./demos/LifecycleDemo";
import { LifecycleSubPage } from "./demos/LifecycleDemo";
import FileObfuscatorPage from "./pages/file_obfuscator";

// Custom Global Error UI
const CustomErrorUI = (error: Error) =>
  React.createElement(
    Container,
    { color: "#E0F7FA" },
    React.createElement(
      Column,
      {
        mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        padding: 30,
      },
      React.createElement(Text, {
        text: "Oops! Something went wrong",
        fontSize: 22,
        color: "#006064",
        fontWeight: "bold",
        margin: { bottom: 16 },
      }),
      React.createElement(
        Container,
        {
          padding: 12,
          decoration: {
            color: "#FFFFFF",
            borderRadius: 8,
            border: { width: 1, color: "#B2EBF2" },
          },
          margin: { bottom: 20 },
        },
        React.createElement(Text, {
          text: error?.message || "Unknown Error",
          fontSize: 14,
          color: "#00838F",
          maxLines: 5,
          overflow: "ellipsis",
        }),
      ),
      React.createElement(Button, {
        text: "Go Back Home",
        onTap: () => console.log("Navigate to home..."),
      }),
    ),
  );

export function initApp() {
  try {
    Runtime.configure({ prewarm: false, prewarmMs: 50 });
    Runtime.bindGlobals();

    i18n.configure({ fallbackLocale: "en", resources: i18nResources });
    void i18n.init().catch((e) => console.warn("[i18n] init failed:", e));

    // Set global error fallback during initialization
    setGlobalErrorFallback(CustomErrorUI);

    Router.register("/", () => React.createElement(HomePage));
    Router.register("/hybrid_demo", (args) =>
      React.createElement(HybridDemoPage, args),
    );
    Router.register("/news", () => React.createElement(NewsPage));
    Router.register("/news_detail", (args) =>
      React.createElement(NewsDetailPage, args as any),
    );
    Router.register("/market", () => React.createElement(MarketPage));
    Router.register("/demos", () => React.createElement(DemoListPage));
    Router.register("/demo/column", () => React.createElement(ColumnDemo));
    Router.register("/demo/row", () => React.createElement(RowDemo));
    Router.register("/demo/button", () => React.createElement(ButtonDemo));
    Router.register("/demo/textfield", () =>
      React.createElement(TextFieldDemo),
    );
    Router.register("/demo/textfield_controller", () =>
      React.createElement(TextFieldControllerDemo),
    );
    Router.register("/demo/transition", () =>
      React.createElement(TransitionDemo),
    );
    Router.register("/demo/box", () => React.createElement(BoxDemo));
    Router.register("/demo/visibility", () =>
      React.createElement(VisibilityDemo),
    );
    Router.register("/demo/switch", () => React.createElement(SwitchDemo));
    Router.register("/demo/listview", () => React.createElement(ListViewDemo));
    Router.register("/demo/gridview", () => React.createElement(GridViewDemo));
    Router.register("/demo/image", () => React.createElement(ImageDemo));
    Router.register("/demo/bundle_local_image", () =>
      React.createElement(BundleLocalImageDemo),
    );
    Router.register("/demo/stack", () => React.createElement(StackDemo));
    Router.register("/demo/sliver", () => React.createElement(SliverDemo));
    Router.register("/demo/divider", () => React.createElement(DividerDemo));
    Router.register("/demo/opacity", () => React.createElement(OpacityDemo));
    Router.register("/demo/progress", () => React.createElement(ProgressDemo));
    Router.register("/demo/pageview", () => React.createElement(PageViewDemo));
    Router.register("/demo/popscope", () => React.createElement(PopScopeDemo));
    Router.register("/demo/browser_api", () =>
      React.createElement(BrowserApiDemo),
    );
    Router.register("/demo/websocket", () =>
      React.createElement(WebSocketDemo),
    );
    Router.register("/demo/bottomnav", () =>
      React.createElement(BottomNavDemo),
    );
    Router.register("/demo/flex", () => React.createElement(FlexDemo));
    Router.register("/demo/flexible", () => React.createElement(FlexibleDemo));
    Router.register("/demo/gesturedetector", () =>
      React.createElement(GestureDetectorDemo),
    );
    Router.register("/demo/safearea", () => React.createElement(SafeAreaDemo));
    Router.register("/demo/singlechildscrollview", () =>
      React.createElement(SingleChildScrollViewDemo),
    );
    Router.register("/demo/sliverpersistentheader", () =>
      React.createElement(SliverPersistentHeaderDemo),
    );
    Router.register("/demo/tabs", () => React.createElement(TabDemo));
    Router.register("/demo/container", () =>
      React.createElement(ContainerDemo),
    );
    Router.register("/demo/layoutbasics", () =>
      React.createElement(LayoutBasicsDemo),
    );
    Router.register("/demo/inkwell", () => React.createElement(InkWellDemo));
    Router.register("/demo/scaffold", () => React.createElement(ScaffoldDemo));
    Router.register("/demo/animated", () => React.createElement(AnimatedDemo));
    Router.register("/demo/dialog", () => React.createElement(DialogDemo));
    Router.register("/demo/intrinsic", () =>
      React.createElement(IntrinsicDemo),
    );
    Router.register("/demo/error", () => React.createElement(ErrorDemoPage));
    Router.register("/demo/ops", () => React.createElement(DemoOpsPage));
    Router.register("/demo/flutter_props", () =>
      React.createElement(FlutterPropsDemo),
    );
    Router.register("/demo/custompaint", () =>
      React.createElement(CustomPaintDemo),
    );
    Router.register("/demo/visibility_detector", (args) =>
      React.createElement(VisibilityDetectorDemo, args as any),
    );
    Router.register("/demo/video_player", (args) =>
      React.createElement(VideoPlayerDemo, args as any),
    );
    Router.register("/demo/cliprrect", (args) =>
      React.createElement(ClipRRectDemo, args as any),
    );
    Router.register("/demo/refresh_indicator", (args) =>
      React.createElement(RefreshIndicatorDemo, args as any),
    );
    Router.register("/demo/richtext", (args) =>
      React.createElement(RichTextDemo, args as any),
    );
    Router.register("/demo/transform", (args) =>
      React.createElement(TransformDemo, args as any),
    );
    Router.register("/demo/overlay", () => React.createElement(OverlayDemo));
    Router.register("/demo/material", () => React.createElement(MaterialDemo));
    Router.register("/demo/slider", () => React.createElement(SliderDemo));
    Router.register("/demo/radio", () => React.createElement(RadioDemo));
    Router.register("/demo/fab", () =>
      React.createElement(FloatingActionButtonDemo),
    );
    Router.register("/demo/aspect_ratio", () =>
      React.createElement(AspectRatioDemo),
    );
    Router.register("/demo/fractionally_sized_box", () =>
      React.createElement(FractionallySizedBoxDemo),
    );
    Router.register("/demo/drawer", () => React.createElement(DrawerDemo));
    Router.register("/demo/backdrop_filter", () =>
      React.createElement(BackdropFilterDemo),
    );
    Router.register("/demo/animated_switcher", () =>
      React.createElement(AnimatedSwitcherDemo),
    );
    Router.register("/demo/animated_cross_fade", () =>
      React.createElement(AnimatedCrossFadeDemo),
    );
    Router.register("/demo/nested_scroll_view", () =>
      React.createElement(NestedScrollViewDemo),
    );
    Router.register("/demo/react_managed_list", () =>
      React.createElement(ReactManagedListDemo),
    );
    Router.register("/demo/static_list", () =>
      React.createElement(StaticListDemo),
    );
    Router.register("/demo/performance", () =>
      React.createElement(PerformanceDemo),
    );
    Router.register("/demo/align", () => React.createElement(AlignDemo));
    Router.register("/demo/hero", () => React.createElement(HeroDemo));
    Router.register("/demo/hero_detail", () =>
      React.createElement(HeroDetailPage),
    );
    Router.register("/demo/fade_transition", () =>
      React.createElement(FadeTransitionDemo),
    );
    Router.register("/demo/size_transition", () =>
      React.createElement(SizeTransitionDemo),
    );
    Router.register("/demo/positioned_transition", () =>
      React.createElement(PositionedTransitionDemo),
    );
    Router.register("/demo/indexed_stack", () =>
      React.createElement(IndexedStackDemo),
    );
    Router.register("/demo/animated_size", () =>
      React.createElement(AnimatedSizeDemo),
    );
    Router.register("/demo/dismissible", () =>
      React.createElement(DismissibleDemo),
    );
    Router.register("/demo/transition_animated", () =>
      React.createElement(TransitionAnimatedDemo),
    );
    Router.register("/demo/theme", () => React.createElement(ThemeDemo));
    Router.register("/demo/media_query", () =>
      React.createElement(MediaQueryDemo),
    );

    // Community packages
    Router.register("/demo/haptics", () => React.createElement(HapticsDemo));
    Router.register("/demo/launcher", () => React.createElement(LauncherDemo));
    Router.register("/demo/share", () => React.createElement(ShareDemo));
    Router.register("/demo/app_info", () => React.createElement(AppInfoDemo));
    Router.register("/demo/permissions", () =>
      React.createElement(PermissionsDemo),
    );
    Router.register("/demo/media", () => React.createElement(MediaDemo));
    Router.register("/demo/connectivity", () =>
      React.createElement(ConnectivityDemo),
    );
    Router.register("/demo/web_view", (args) =>
      React.createElement(WebViewDemo, args as any),
    );
    Router.register("/demo/sound", () => React.createElement(SoundServiceDemo));
    Router.register("/demo/i18n", () => React.createElement(I18nDemo));
    Router.register("/demo/lifecycle", () =>
      React.createElement(LifecycleDemo),
    );
    Router.register("/demo/lifecycle_sub", () =>
      React.createElement(LifecycleSubPage),
    );
    Router.register("/demo/file_obfuscator", () =>
      React.createElement(FileObfuscatorPage),
    );

    console.log("App Initialized");
  } catch (e) {
    console.error("initApp error:", e);
  }
}
