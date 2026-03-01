import React from 'react';
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Container,
  Button,
  AlertDialog,
  Center,
  useDialog,
} from 'fuickjs';

export default function DialogServiceDemo() {
  const dialog = useDialog();

  const showBasicDialog = () => {
    dialog.show(
      <AlertDialog
        title={<Text text="Basic Dialog" />}
        content={<Text text="This is a dialog shown via Dialog.show service." />}
        actions={[
          <Button
            key="ok"
            text="OK"
            onTap={() => {
              dialog.dismiss();
            }}
          />,
        ]}
      />
    );
  };

  const showConfirmDialog = async () => {
    const result = await dialog.show(
      <AlertDialog
        title={<Text text="Confirm" />}
        content={<Text text="Do you want to proceed?" />}
        actions={[
          <Button
            key="no"
            text="No"
            onTap={() => {
              dialog.dismiss(false);
            }}
          />,
          <Button
            key="yes"
            text="Yes"
            onTap={() => {
              dialog.dismiss(true);
            }}
          />,
        ]}
      />
    );
    console.log('Dialog result:', result);
  };

  const showCustomDialog = () => {
    dialog.show(
      <Center>
        <Container
          padding={20}
          decoration={{
            color: 'white',
            borderRadius: 12,
          }}
        >
          <Column crossAxisAlignment="center">
            <Text text="Custom Layout Dialog" fontSize={18} fontWeight="bold" />
            <Text text="This is not an AlertDialog, just a custom layout." margin={{ top: 10, bottom: 20 }} />
            <Button text="Close" onTap={() => dialog.dismiss()} />
          </Column>
        </Container>
      </Center>,
      {
        barrierDismissible: false,
        barrierColor: '#000000AA',
      }
    );
  };

  return (
    <Scaffold appBar={<AppBar title="Dialog Service Demo" />}>
      <Column padding={16} crossAxisAlignment="center">
        <Button text="Show Basic Dialog" onTap={showBasicDialog} margin={{ bottom: 10 }} />
        <Button text="Show Confirm Dialog (Async)" onTap={showConfirmDialog} margin={{ bottom: 10 }} />
        <Button text="Show Custom Dialog" onTap={showCustomDialog} />
      </Column>
    </Scaffold>
  );
}
