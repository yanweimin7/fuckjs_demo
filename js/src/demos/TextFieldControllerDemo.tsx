import * as React from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Button,
  TextField,
  Padding,
  SizedBox,
  SingleChildScrollView,
  Container,
} from "fuickjs";

export default function TextFieldControllerDemo() {
  const textFieldRef = React.useRef<TextField>(null);
  const [currentText] = React.useState("Initial Text");

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="TextField Controller Demo" />} />}
    >
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="stretch">
            <TextField
              ref={textFieldRef}
              text={currentText}
              hintText="Type something..."
              onChanged={(text) => {
                console.log("Text changed:", text);
                // Not updating state here to avoid re-render loop if controlled incorrectly,
                // but for this demo we want to test controller methods.
              }}
            />
            <SizedBox height={20} />

            <Text text="Controller Actions:" fontSize={18} fontWeight="bold" />
            <SizedBox height={10} />

            <Container
              decoration={{
                border: { color: "#ccc", width: 1 },
                borderRadius: 8,
              }}
              padding={10}
            >
              <Column>
                <Button
                  text="Focus"
                  onTap={() => {
                    textFieldRef.current?.focus();
                  }}
                />
                <SizedBox height={10} />
                <Button
                  text="Unfocus"
                  onTap={() => {
                    textFieldRef.current?.unfocus();
                  }}
                />
                <SizedBox height={10} />
                <Button
                  text="Select All"
                  onTap={() => {
                    textFieldRef.current?.selectAll();
                  }}
                />
                <SizedBox height={10} />
                <Button
                  text="Select First 3 Chars"
                  onTap={() => {
                    textFieldRef.current?.setSelection(0, 3);
                  }}
                />
                <SizedBox height={10} />
                <Button
                  text="Clear"
                  onTap={() => {
                    textFieldRef.current?.clear();
                  }}
                />
                <SizedBox height={10} />
                <Button
                  text="Set Text to 'Hello World'"
                  onTap={() => {
                    textFieldRef.current?.setText("Hello World");
                  }}
                />
              </Column>
            </Container>
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}
