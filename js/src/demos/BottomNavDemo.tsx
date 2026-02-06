import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  BottomNavigationBar,
  BottomNavigationBarItem,
  Center,
  Text,
  Icon,
} from "fuickjs";

export default function BottomNavDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages = [
    { name: "Home", icon: "home" },
    { name: "Business", icon: "business" },
    { name: "School", icon: "school" },
  ];

  return (
    <Scaffold
      appBar={<AppBar title={`BottomNav: ${pages[currentIndex].name}`} />}
      bottomNavigationBar={
        <BottomNavigationBar
          currentIndex={currentIndex}
          onTap={(index) => setCurrentIndex(index)}
          items={pages.map((p) => (
            <BottomNavigationBarItem
              key={p.name}
              label={p.name}
              icon={<Icon name={p.icon} />}
            />
          ))}
        />
      }
    >
      <Center>
        <Text
          text={`Selected Page: ${pages[currentIndex].name}`}
          fontSize={24}
        />
      </Center>
    </Scaffold>
  );
}
