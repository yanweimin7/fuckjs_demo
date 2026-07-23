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
import LifecycleDemo, { LifecycleSubPage } from "./demos/LifecycleDemo";
import FileObfuscatorPage from "./pages/file_obfuscator";
import RouterDemo, {
  RouterUserPage,
  RouterProtectedPage,
  authState,
} from "./demos/RouterDemo";

// ============================================================
// 自定义全局错误 UI
// ============================================================

const CustomErrorUI = (error: Error) => (
  <Container color="#E0F7FA">
    <Column mainAxisAlignment="center" crossAxisAlignment="center" padding={30}>
      <Text
        text="Oops! Something went wrong"
        fontSize={22}
        color="#006064"
        fontWeight="bold"
        margin={{ bottom: 16 }}
      />
      <Container
        padding={12}
        decoration={{
          color: "#FFFFFF",
          borderRadius: 8,
          border: { width: 1, color: "#B2EBF2" },
        }}
        margin={{ bottom: 20 }}
      >
        <Text
          text={error?.message || "Unknown Error"}
          fontSize={14}
          color="#00838F"
          maxLines={5}
          overflow="ellipsis"
        />
      </Container>
      <Button
        text="Go Back Home"
        onTap={() => console.log("Navigate to home...")}
      />
    </Column>
  </Container>
);

// ============================================================
// 路由表（统一声明式配置，便于查找）
// ============================================================

// 各路由组件的 props 形态差异较大，此处统一收口为 any。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes: { path: string; component: React.ComponentType<any> }[] = [
  // 业务页
  { path: "/", component: HomePage },
  { path: "/hybrid_demo", component: HybridDemoPage },
  { path: "/news", component: NewsPage },
  { path: "/news_detail", component: NewsDetailPage },
  { path: "/market", component: MarketPage },
  { path: "/demos", component: DemoListPage },

  // 布局与基础组件
  { path: "/demo/column", component: ColumnDemo },
  { path: "/demo/row", component: RowDemo },
  { path: "/demo/box", component: BoxDemo },
  { path: "/demo/container", component: ContainerDemo },
  { path: "/demo/layoutbasics", component: LayoutBasicsDemo },
  { path: "/demo/scaffold", component: ScaffoldDemo },
  { path: "/demo/stack", component: StackDemo },
  { path: "/demo/safearea", component: SafeAreaDemo },
  { path: "/demo/divider", component: DividerDemo },
  { path: "/demo/opacity", component: OpacityDemo },
  { path: "/demo/intrinsic", component: IntrinsicDemo },

  // 交互组件
  { path: "/demo/button", component: ButtonDemo },
  { path: "/demo/inkwell", component: InkWellDemo },
  { path: "/demo/gesturedetector", component: GestureDetectorDemo },
  { path: "/demo/fab", component: FloatingActionButtonDemo },
  { path: "/demo/slider", component: SliderDemo },
  { path: "/demo/radio", component: RadioDemo },
  { path: "/demo/switch", component: SwitchDemo },
  { path: "/demo/dismissible", component: DismissibleDemo },
  { path: "/demo/dialog", component: DialogDemo },
  { path: "/demo/refresh_indicator", component: RefreshIndicatorDemo },

  // 文本与富文本
  { path: "/demo/textfield", component: TextFieldDemo },
  { path: "/demo/textfield_controller", component: TextFieldControllerDemo },
  { path: "/demo/richtext", component: RichTextDemo },

  // 列表与网格
  { path: "/demo/listview", component: ListViewDemo },
  { path: "/demo/gridview", component: GridViewDemo },
  { path: "/demo/sliver", component: SliverDemo },
  {
    path: "/demo/sliverpersistentheader",
    component: SliverPersistentHeaderDemo,
  },
  { path: "/demo/nested_scroll_view", component: NestedScrollViewDemo },
  { path: "/demo/react_managed_list", component: ReactManagedListDemo },
  { path: "/demo/static_list", component: StaticListDemo },

  // 媒体与图片
  { path: "/demo/image", component: ImageDemo },
  { path: "/demo/bundle_local_image", component: BundleLocalImageDemo },
  { path: "/demo/visibility", component: VisibilityDemo },
  { path: "/demo/visibility_detector", component: VisibilityDetectorDemo },
  { path: "/demo/cliprrect", component: ClipRRectDemo },
  { path: "/demo/transform", component: TransformDemo },
  { path: "/demo/backdrop_filter", component: BackdropFilterDemo },
  { path: "/demo/custompaint", component: CustomPaintDemo },

  // 进度与页面
  { path: "/demo/progress", component: ProgressDemo },
  { path: "/demo/pageview", component: PageViewDemo },
  { path: "/demo/popscope", component: PopScopeDemo },
  { path: "/demo/tabs", component: TabDemo },
  { path: "/demo/indexed_stack", component: IndexedStackDemo },
  { path: "/demo/bottomnav", component: BottomNavDemo },
  { path: "/demo/drawer", component: DrawerDemo },
  { path: "/demo/material", component: MaterialDemo },
  { path: "/demo/overlay", component: OverlayDemo },

  // 弹性布局
  { path: "/demo/flex", component: FlexDemo },
  { path: "/demo/flexible", component: FlexibleDemo },
  { path: "/demo/aspect_ratio", component: AspectRatioDemo },
  { path: "/demo/fractionally_sized_box", component: FractionallySizedBoxDemo },
  { path: "/demo/align", component: AlignDemo },

  // 动画
  { path: "/demo/animated", component: AnimatedDemo },
  { path: "/demo/transition", component: TransitionDemo },
  { path: "/demo/transition_animated", component: TransitionAnimatedDemo },
  { path: "/demo/animated_switcher", component: AnimatedSwitcherDemo },
  { path: "/demo/animated_cross_fade", component: AnimatedCrossFadeDemo },
  { path: "/demo/animated_size", component: AnimatedSizeDemo },
  { path: "/demo/fade_transition", component: FadeTransitionDemo },
  { path: "/demo/size_transition", component: SizeTransitionDemo },
  { path: "/demo/positioned_transition", component: PositionedTransitionDemo },
  { path: "/demo/hero", component: HeroDemo },
  { path: "/demo/hero_detail", component: HeroDetailPage },

  // 性能与调试
  { path: "/demo/performance", component: PerformanceDemo },
  { path: "/demo/error", component: ErrorDemoPage },
  { path: "/demo/ops", component: DemoOpsPage },
  { path: "/demo/flutter_props", component: FlutterPropsDemo },
  { path: "/demo/browser_api", component: BrowserApiDemo },
  { path: "/demo/websocket", component: WebSocketDemo },

  // 主题与适配
  { path: "/demo/theme", component: ThemeDemo },
  { path: "/demo/media_query", component: MediaQueryDemo },

  // Community 扩展包
  { path: "/demo/haptics", component: HapticsDemo },
  { path: "/demo/launcher", component: LauncherDemo },
  { path: "/demo/share", component: ShareDemo },
  { path: "/demo/app_info", component: AppInfoDemo },
  { path: "/demo/permissions", component: PermissionsDemo },
  { path: "/demo/media", component: MediaDemo },
  { path: "/demo/connectivity", component: ConnectivityDemo },
  { path: "/demo/web_view", component: WebViewDemo },
  { path: "/demo/video_player", component: VideoPlayerDemo },
  { path: "/demo/sound", component: SoundServiceDemo },
  { path: "/demo/i18n", component: I18nDemo },
  { path: "/demo/lifecycle", component: LifecycleDemo },
  { path: "/demo/lifecycle_sub", component: LifecycleSubPage },
  { path: "/demo/file_obfuscator", component: FileObfuscatorPage },

  // 路由系统演示
  { path: "/demo/router", component: RouterDemo },
  { path: "/demo/router/user/:id", component: RouterUserPage },
];

// ============================================================
// 启动
// ============================================================

export function initApp() {
  try {
    Runtime.configure({ prewarm: false, prewarmMs: 50 });
    Runtime.bindGlobals();

    i18n.configure({ fallbackLocale: "en", resources: i18nResources });
    void i18n.init().catch((e) => console.warn("[i18n] init failed:", e));

    setGlobalErrorFallback(CustomErrorUI);

    // 批量注册路由
    for (const r of routes) {
      Router.register(r.path, () => React.createElement(r.component));
    }

    // 声明式配置：受保护页面 + 重定向 + 命名路由
    Router.config({
      routes: [
        {
          path: "/demo/router/protected",
          component: () => <RouterProtectedPage />,
          meta: { requiresAuth: true },
        },
        {
          path: "/demo/router/old",
          redirect: "/demo/router",
        },
        {
          path: "/demo/router/user/:id",
          name: "user",
          component: () => <RouterUserPage />,
        },
      ],
    });

    // 全局守卫：演示鉴权拦截
    Router.addGuard((to) => {
      if (to.meta?.requiresAuth && !authState.loggedIn) {
        console.log("[Guard] 需要登录，拒绝访问:", to.path);
        return false;
      }
      return true;
    });

    console.log("App Initialized");
  } catch (e) {
    console.error("initApp error:", e);
  }
}
