import React from "react";
import {
  Image,
  Scaffold,
  AppBar,
  Column,
  Center,
  Text,
  Padding,
} from "fuickjs";

export default function ImageDemo() {
  return (
    <Scaffold appBar={<AppBar title="Image Demo" />}>
      <Center>
        <Column crossAxisAlignment="center">
          <Padding padding={10}>
            <Text text="Network Image" fontSize={18} fontWeight="bold" />
          </Padding>
          <Image
            url="https://flutter.github.io/assets-for-api-docs/assets/widgets/owl.jpg"
            width={200}
            height={200}
            fit="cover"
          />
        </Column>
      </Center>
    </Scaffold>
  );
}
