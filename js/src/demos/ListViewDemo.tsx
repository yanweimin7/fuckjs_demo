import React from "react";
import { ListView, ListTile, Text, Scaffold, AppBar, Icon } from "fuickjs";

export default function ListViewDemo() {
  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

  return (
    <Scaffold appBar={<AppBar title="ListView Demo" />}>
      <ListView
        itemCount={items.length}
        itemBuilder={(index) => (
          <ListTile
            leading={<Icon name="info" color="#2196F3" />}
            title={<Text text={items[index]} />}
            subtitle={<Text text={`Description for ${items[index]}`} />}
            onTap={() => console.log(`Tapped ${items[index]}`)}
          />
        )}
        onScroll={(e) => {
          console.log(
            `[ListView onScroll] pixels=${e.pixels.toFixed(0)}, ` +
              `maxScrollExtent=${e.maxScrollExtent.toFixed(0)}, axis=${e.axis}`
          );
        }}
        onScrollStartReached={() => {
          console.log("[ListView onScrollStartReached] 已滚动到顶部");
        }}
        onScrollEndReached={() => {
          console.log("[ListView onScrollEndReached] 已滚动到底部");
        }}
        endThreshold={200}
      />
    </Scaffold>
  );
}
