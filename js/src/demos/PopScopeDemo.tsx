import React, { useState } from 'react';
import { Scaffold, AppBar, PopScope, Container, Text, Column, Button, AlertDialog, Stack, Positioned, Center, useNavigator } from 'fuickjs';

export default function PopScopeDemo() {
  const [canPop, setCanPop] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const nav = useNavigator();

  return (
    <PopScope
      canPop={canPop}
      onPopInvoked={(didPop: boolean) => {
        console.log('Pop invoked, didPop:', didPop);
        if (!didPop) {
          setShowConfirm(true);
        }
      }}
    >
      <Scaffold appBar={<AppBar title="PopScope Demo" />}>
        <Stack>
          <Column padding={16} crossAxisAlignment="center">
            <Text
              text={`canPop: ${canPop}`}
              fontSize={20}
              fontWeight="bold"
              margin={{ bottom: 20 }}
            />

            <Container
              padding={16}
              color="#f5f5f5"
              borderRadius={8}
              margin={{ bottom: 20 }}
            >
              <Text text="When canPop is false, the system back button (or gesture) will be intercepted. We show a dialog to confirm." />
            </Container>

            <Button
              text={canPop ? "Lock Page" : "Unlock Page"}
              onTap={() => setCanPop(!canPop)}
            />

            <Text
              text="Try to go back using system back button or gesture."
              margin={{ top: 20 }}
              color="#666666"
              textAlign="center"
            />
          </Column>

          {showConfirm && (
            <Positioned left={0} top={0} right={0} bottom={0}>
              <Container
                color="#00000080"
                alignment="center"
              >
                <AlertDialog
                  title={<Text text="Confirm Exit" />}
                  content={<Text text="Are you sure you want to leave this page?" />}
                  actions={[
                    <Button
                      key="cancel"
                      text="Cancel"
                      onTap={() => setShowConfirm(false)}
                    />,
                    <Button
                      key="exit"
                      text="Exit"
                      onTap={() => {
                        nav.pop();
                      }}
                    />,
                  ]}
                />
              </Container>
            </Positioned>
          )}
        </Stack>
      </Scaffold>
    </PopScope>
  );
}
