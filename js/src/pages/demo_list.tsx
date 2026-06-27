import React from "react";
import {
  Text,
  Scaffold,
  AppBar,
  useNavigator,
  InkWell,
  Container,
  Column,
  ListView,
  Padding,
  Wrap,
} from "fuickjs";
import { useGlobalValue } from "../store/global";

const demoCategories = [
  {
    title: "Layout & Containers",
    items: [
      { name: "Container", path: "/demo/container" },
      { name: "Flex", path: "/demo/flex" },
      { name: "Column", path: "/demo/column" },
      { name: "Row", path: "/demo/row" },
      { name: "Stack", path: "/demo/stack" },
      { name: "Expanded", path: "/demo/flexible" }, // Flexible/Expanded
      { name: "Box", path: "/demo/box" },
      { name: "Layout", path: "/demo/layoutbasics" },
      { name: "SingleScroll", path: "/demo/singlechildscrollview" },
      { name: "SafeArea", path: "/demo/safearea" },
      { name: "Intrinsic", path: "/demo/intrinsic" },
      { name: "Divider", path: "/demo/divider" },
      { name: "AspectRatio", path: "/demo/aspect_ratio" },
      { name: "Fractional", path: "/demo/fractionally_sized_box" },
    ],
  },
  {
    title: "Basic Input & Controls",
    items: [
      { name: "Button", path: "/demo/button" },
      { name: "TextField", path: "/demo/textfield" },
      { name: "Controller", path: "/demo/textfield_controller" },
      { name: "Switch", path: "/demo/switch" },
      { name: "Slider", path: "/demo/slider" },
      { name: "Radio", path: "/demo/radio" },
      { name: "InkWell", path: "/demo/inkwell" },
      { name: "Gesture", path: "/demo/gesturedetector" },
      { name: "Dialog", path: "/demo/dialog" },
    ],
  },
  {
    title: "Display & Visuals",
    items: [
      { name: "RichText", path: "/demo/richtext" },
      { name: "Image", path: "/demo/image" },
      { name: "BundleImg", path: "/demo/bundle_local_image" },
      { name: "Opacity", path: "/demo/opacity" },
      { name: "Fade", path: "/demo/fade_transition" },
      { name: "Size", path: "/demo/size_transition" },
      { name: "Align", path: "/demo/align" },
      { name: "Hero", path: "/demo/hero" },
      { name: "PosTrn", path: "/demo/positioned_transition" },
      { name: "ClipRRect", path: "/demo/cliprrect" },
      { name: "Transform", path: "/demo/transform" },
      { name: "CustomPaint", path: "/demo/custompaint" },
      { name: "Progress", path: "/demo/progress" },
      { name: "Material", path: "/demo/material" },
      { name: "Backdrop", path: "/demo/backdrop_filter" },
    ],
  },
  {
    title: "Lists & Grids",
    items: [
      { name: "ListView", path: "/demo/listview" },
      { name: "GridView", path: "/demo/gridview" },
      { name: "PageView", path: "/demo/pageview" },
      { name: "Sliver", path: "/demo/sliver" },
      { name: "Header", path: "/demo/sliverpersistentheader" },
      { name: "ReactList", path: "/demo/react_managed_list" },
      { name: "StaticList", path: "/demo/static_list" },
      { name: "NestedScroll", path: "/demo/nested_scroll_view" },
      { name: "PerfTest", path: "/demo/performance" },
    ],
  },
  {
    title: "Navigation & Structure",
    items: [
      { name: "FAB", path: "/demo/fab" },
      { name: "Scaffold", path: "/demo/scaffold" },
      { name: "BottomNav", path: "/demo/bottomnav" },
      { name: "Tabs", path: "/demo/tabs" },
      { name: "Indexed", path: "/demo/indexed_stack" },
      { name: "PopScope", path: "/demo/popscope" },
      { name: "Drawer", path: "/demo/drawer" },
    ],
  },
  {
    title: "Framework",
    items: [
      { name: "I18n", path: "/demo/i18n" },
      { name: "Lifecycle", path: "/demo/lifecycle" },
      { name: "Theme", path: "/demo/theme" },
      { name: "MediaQuery", path: "/demo/media_query" },
    ],
  },
  {
    title: "Advanced & Experimental",
    items: [
      { name: "FlutterProps", path: "/demo/flutter_props" },
      { name: "Visibility", path: "/demo/visibility" },
      { name: "Animated", path: "/demo/animated" },
      { name: "Transition", path: "/demo/transition" },
      { name: "TrAni", path: "/demo/transition_animated" },
      { name: "Error", path: "/demo/error" },
      { name: "Refresh", path: "/demo/refresh_indicator" },
      { name: "Switcher", path: "/demo/animated_switcher" },
      { name: "CrossFade", path: "/demo/animated_cross_fade" },
      { name: "AniSize", path: "/demo/animated_size" },
      { name: "Dismissible", path: "/demo/dismissible" },
      { name: "Overlay", path: "/demo/overlay" },
    ],
  },
  {
    title: "Community Packages",
    items: [
      { name: "Haptics", path: "/demo/haptics" },
      { name: "Launcher", path: "/demo/launcher" },
      { name: "Share", path: "/demo/share" },
      { name: "BrowserAPI", path: "/demo/browser_api" },
      { name: "WebSocket", path: "/demo/websocket" },
      { name: "AppInfo", path: "/demo/app_info" },
      { name: "Permissions", path: "/demo/permissions" },
      { name: "Media", path: "/demo/media" },
      { name: "Connectivity", path: "/demo/connectivity" },
      { name: "Sound", path: "/demo/sound" },
      { name: "VideoPlayer", path: "/demo/video_player" },
      { name: "VisDetector", path: "/demo/visibility_detector" },
      { name: "WebView", path: "/demo/web_view" },
    ],
  },
];

export default function DemoListPage() {
  const navigator = useNavigator();
  const { value, setValue } = useGlobalValue();

  return (
    <Scaffold appBar={<AppBar title="FuickJS Demos" />}>
      <ListView padding={16}>
        <InkWell
          onTap={() =>
            setValue(`Updated from Demos: ${Math.floor(Math.random() * 100)}`)
          }
        >
          <Container
            padding={16}
            color="#FFF3E0"
            alignment="center"
            margin={{ bottom: 16 }}
            decoration={{
              color: "#FFF3E0",
              borderRadius: 8,
              border: { width: 1, color: "#FFE0B2" },
            }}
          >
            <Text
              text={`Global Value: ${value}`}
              color="#E65100"
              fontWeight="bold"
            />
          </Container>
        </InkWell>

        {demoCategories.map((category) => (
          <Column key={category.title} crossAxisAlignment="start">
            <Padding padding={{ vertical: 12 }}>
              <Text
                text={category.title}
                fontSize={18}
                fontWeight="bold"
                color="#333333"
              />
            </Padding>
            <Wrap spacing={10} runSpacing={10}>
              {category.items.map((item) => (
                <InkWell
                  key={item.path}
                  onTap={() => navigator.push(item.path, {})}
                >
                  <Container
                    width={72}
                    height={60}
                    color="white"
                    alignment="center"
                    padding={4}
                    decoration={{
                      color: "white",
                      borderRadius: 8,
                      boxShadow: {
                        color: "#0000001A",
                        blurRadius: 4,
                        offset: { dx: 0, dy: 2 },
                      },
                    }}
                  >
                    <Text
                      text={item.name}
                      textAlign="center"
                      fontSize={12}
                      maxLines={2}
                      overflow="ellipsis"
                    />
                  </Container>
                </InkWell>
              ))}
            </Wrap>
          </Column>
        ))}

        {/* Bottom padding */}
        <Container height={40} />
      </ListView>
    </Scaffold>
  );
}
