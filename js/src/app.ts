import React from "react";
import {
  Router,
  Runtime,
  setGlobalErrorFallback,
  Column,
  Text,
  Container,
  Button,
} from "fuickjs";
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
import StackDemo from "./demos/StackDemo";
import SliverDemo from "./demos/SliverDemo";
import DividerDemo from "./demos/DividerDemo";
import OpacityDemo from "./demos/OpacityDemo";
import ProgressDemo from "./demos/ProgressDemo";
import PageViewDemo from "./demos/PageViewDemo";
import BottomNavDemo from "./demos/BottomNavDemo";
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
    Runtime.bindGlobals();

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
    Router.register("/demo/stack", () => React.createElement(StackDemo));
    Router.register("/demo/sliver", () => React.createElement(SliverDemo));
    Router.register("/demo/divider", () => React.createElement(DividerDemo));
    Router.register("/demo/opacity", () => React.createElement(OpacityDemo));
    Router.register("/demo/progress", () => React.createElement(ProgressDemo));
    Router.register("/demo/pageview", () => React.createElement(PageViewDemo));
    Router.register("/demo/bottomnav", () =>
      React.createElement(BottomNavDemo),
    );
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

    console.log("App Initialized");
  } catch (e) {
    console.error("initApp error:", e);
  }
}
