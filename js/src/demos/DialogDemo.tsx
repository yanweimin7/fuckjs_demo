import * as React from "react";
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

export default class DialogDemo extends React.Component {
  state = {
    showDialog: false,
  };

  render() {
    return (
      <Scaffold appBar={<AppBar title={<Text text="Dialog Demo" />} />}>
        <Stack>
          <Center>
            <Column>
              <Text text="Click button to show dialog" />
              <Button
                text="Show Dialog"
                onTap={() => {
                  this.setState({ showDialog: true });
                }}
              />
            </Column>
          </Center>

          {this.state.showDialog && (
            <Positioned left={0} top={0} right={0} bottom={0}>
              <Container
                color="#00000080" // Semi-transparent background
                alignment="center"
              >
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
                        this.setState({ showDialog: false });
                        console.log("Cancel pressed");
                      }}
                    />,
                    <Button
                      key="ok"
                      text="OK"
                      onTap={() => {
                        this.setState({ showDialog: false });
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
}
