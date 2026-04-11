import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Button,
  AlertDialog,
  Center,
  Stack,
  Positioned,
  Container,
} from "fuickjs";

export default function DialogDemo() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Dialog Demo" />} />}>
      <Stack>
        <Center>
          <Column>
            <Text text="Click button to show dialog" />
            <Button
              text="Show Dialog"
              onTap={() => {
                setShowDialog(true);
              }}
            />
          </Column>
        </Center>

        {showDialog && (
          <Positioned left={0} top={0} right={0} bottom={0}>
            <Container color="#00000080" alignment="center">
              <AlertDialog
                title={<Text text="Alert Dialog Title" />}
                content={
                  <Text text="This is the content of the alert dialog." />
                }
                actions={[
                  <Button
                    key="cancel"
                    text="Cancel"
                    onTap={() => {
                      setShowDialog(false);
                      console.log("Cancel pressed");
                    }}
                  />,
                  <Button
                    key="ok"
                    text="OK"
                    onTap={() => {
                      setShowDialog(false);
                      console.log("OK pressed");
                    }}
                  />,
                ]}
              />
            </Container>
          </Positioned>
        )}
      </Stack>
    </Scaffold>
  );
}
