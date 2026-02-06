
import React from "react";
import {
  GridView,
  Text,
  Scaffold,
  AppBar,
  useNavigator,
  InkWell,
  Container,
  Column,
  ListView,
  Padding,
} from "fuickjs";
import { useGlobalValue } from "../store/global";

const demoCategories = [
  {
    title: "Layout & Containers",
    items: [
      { name: "Container", path: "/demo/container" },
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
    ],
  },
  {
    title: "Basic Input & Controls",
    items: [
      { name: "Button", path: "/demo/button" },
      { name: "TextField", path: "/demo/textfield" },
      { name: "Controller", path: "/demo/textfield_controller" },
      { name: "Switch", path: "/demo/switch" },
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
      { name: "Opacity", path: "/demo/opacity" },
      { name: "ClipRRect", path: "/demo/cliprrect" },
      { name: "Transform", path: "/demo/transform" },
      { name: "CustomPaint", path: "/demo/custompaint" },
      { name: "Progress", path: "/demo/progress" },
      { name: "VideoPlayer", path: "/demo/video_player" },
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
    ],
  },
  {
    title: "Navigation & Structure",
    items: [
      { name: "Scaffold", path: "/demo/scaffold" },
      { name: "BottomNav", path: "/demo/bottomnav" },
      { name: "Tabs", path: "/demo/tabs" },
    ],
  },
  {
    title: "Advanced & Experimental",
    items: [
      { name: "FlutterProps", path: "/demo/flutter_props" },
      { name: "Visibility", path: "/demo/visibility" },
      { name: "VisDetector", path: "/demo/visibility_detector" },
      { name: "Animated", path: "/demo/animated" },
      { name: "Transition", path: "/demo/transition" },
      { name: "Error", path: "/demo/error" },
      { name: "Refresh", path: "/demo/refresh_indicator" },
      { name: "ClassDSL", path: "/demo/class_component_dsl" },
      { name: "PropClass", path: "/demo/prop_class_component" },
      { name: "DirectProp", path: "/demo/direct_prop_demo" },
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
              border: { width: 1, color: "#FFE0B2" }
            }}
          >
            <Text text={`Global Value: ${value}`} color="#E65100" fontWeight="bold" />
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
            <GridView
              shrinkWrap={true}
              physics="never"
              crossAxisCount={4}
              mainAxisSpacing={10}
              crossAxisSpacing={10}
              childAspectRatio={1.2}
              itemCount={category.items.length}
              itemBuilder={(index) => (
                <InkWell onTap={() => navigator.push(category.items[index].path, {})}>
                  <Container
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
                      text={category.items[index].name}
                      textAlign="center"
                      fontSize={12}
                      maxLines={2}
                      overflow="ellipsis"
                    />
                  </Container>
                </InkWell>
              )}
            />
          </Column>
        ))}

        {/* Bottom padding */}
        <Container height={40} />
      </ListView>
    </Scaffold>
  );
}
