import React from "react";
import { ListView, ListTile, Text, Scaffold, AppBar, Icon } from "fuickjs";

export default function ListViewDemo() {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

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
      />
    </Scaffold>
  );
}
