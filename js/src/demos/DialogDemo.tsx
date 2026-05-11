import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Button,
  AlertDialog,
  Center,
  Container,
  Row,
  Dialog,
  useNavigator,
  DialogService,
  PickerService,
} from "fuickjs";

let dialogId = 0;

function LifecycleContent({ label }: { label: string }) {
  const id = ++dialogId;
  useEffect(() => {
    console.log(`[${label} #${id}] mount`);
    return () => console.log(`[${label} #${id}] unmount`);
  }, []);
  return null;
}

export default function DialogDemo() {
  const [showCustom, setShowCustom] = useState(false);
  const [result, setResult] = useState("");
  const navigator = useNavigator();

  useEffect(() => {
    console.log("[DialogDemo] mount");
    return () => console.log("[DialogDemo] unmount");
  }, []);

  const showDialog = () => {
    navigator.showDialog(
      <Dialog>
        <Column padding={24}>
          <LifecycleContent label="Dialog" />
          <Text
            text="Dialog"
            fontSize={18}
            fontWeight="bold"
            margin={{ bottom: 12 }}
          />
          <Text
            text="Opened via showDialog(). Check console for lifecycle logs."
            margin={{ bottom: 20 }}
          />
          <Button text="Close" onTap={() => navigator.pop()} />
        </Column>
      </Dialog>,
    );
  };

  const showAlertDialog = () => {
    navigator.showDialog(
      <AlertDialog
        title={<Text text="Alert" />}
        content={
          <Text text="Opened via showDialog() with AlertDialog. Check console for lifecycle logs." />
        }
        actions={[<Button key="ok" text="OK" onTap={() => navigator.pop()} />]}
      />,
    );
  };

  const showBottomSheet = () => {
    navigator.showBottomSheet(
      <Column padding={24}>
        <LifecycleContent label="BottomSheet" />
        <Text
          text="Bottom Sheet"
          fontSize={18}
          fontWeight="bold"
          margin={{ bottom: 12 }}
        />
        <Text
          text="Opened via showBottomSheet(). Check console for lifecycle logs."
          margin={{ bottom: 20 }}
        />
        <Button text="Close" onTap={() => navigator.pop()} />
      </Column>,
      { minHeight: 200, maxHeight: 500 },
    );
  };

  const showConfirm = async () => {
    const confirmed = await DialogService.showModal({
      title: "Confirm",
      content: "Are you sure you want to proceed?",
      showCancel: true,
      cancelText: "No",
      confirmText: "Yes",
    });
    setResult(`showModal result: ${confirmed}`);
  };

  const showActionSheet = async () => {
    const index = await DialogService.showActionSheet({
      items: ["Take Photo", "Choose from Gallery", "Delete"],
    });
    setResult(`showActionSheet result: index=${index}`);
  };

  const showPicker = async () => {
    const res = await PickerService.show({
      range: ["Apple", "Banana", "Cherry", "Durian", "Elderberry"],
      title: "Pick a Fruit",
    });
    setResult(
      `Picker result: ${res ? `${res.label} (index=${res.value})` : "cancelled"}`,
    );
  };

  const showDatePicker = async () => {
    const date = await PickerService.showDate({
      start: "2020-01-01",
      end: "2030-12-31",
    });
    setResult(`DatePicker result: ${date ?? "cancelled"}`);
  };

  const showTimePicker = async () => {
    const time = await PickerService.showTime();
    setResult(`TimePicker result: ${time ?? "cancelled"}`);
  };

  return (
    <Scaffold appBar={<AppBar title="Dialog Demo" />}>
      <Column padding={16} crossAxisAlignment="center">
        <Text
          text="showDialog"
          fontWeight="bold"
          margin={{ bottom: 8, top: 8 }}
        />
        <Row mainAxisAlignment="center" spacing={8} margin={{ bottom: 16 }}>
          <Button text="Dialog" onTap={showDialog} />
          <Button text="AlertDialog" onTap={showAlertDialog} />
        </Row>

        <Text text="showBottomSheet" fontWeight="bold" margin={{ bottom: 8 }} />
        <Button
          text="BottomSheet"
          onTap={showBottomSheet}
          margin={{ bottom: 16 }}
        />

        <Text text="System Dialogs" fontWeight="bold" margin={{ bottom: 8 }} />
        <Row mainAxisAlignment="center" spacing={8} margin={{ bottom: 16 }}>
          <Button text="showModal" onTap={showConfirm} />
          <Button text="showActionSheet" onTap={showActionSheet} />
        </Row>

        <Text text="Pickers" fontWeight="bold" margin={{ bottom: 8 }} />
        <Row mainAxisAlignment="center" spacing={8} margin={{ bottom: 16 }}>
          <Button text="Picker" onTap={showPicker} />
          <Button text="Date" onTap={showDatePicker} />
          <Button text="Time" onTap={showTimePicker} />
        </Row>

        <Text
          text="Custom (Stack-based)"
          fontWeight="bold"
          margin={{ bottom: 8 }}
        />
        <Button
          text={showCustom ? "Hide Custom Dialog" : "Show Custom Dialog"}
          onTap={() => setShowCustom(!showCustom)}
          margin={{ bottom: 16 }}
        />

        {result ? (
          <Container
            padding={12}
            margin={{ bottom: 16 }}
            decoration={{ color: "#E3F2FD", borderRadius: 8 }}
          >
            <Text text={result} fontSize={13} color="#1565C0" />
          </Container>
        ) : null}
      </Column>

      {showCustom && (
        <Container
          color="#00000080"
          alignment="center"
          position="absolute"
          left={0}
          top={0}
          right={0}
          bottom={0}
        >
          <Container
            padding={24}
            decoration={{ color: "white", borderRadius: 12 }}
          >
            <Column crossAxisAlignment="center">
              <Text
                text="Custom Dialog"
                fontSize={18}
                fontWeight="bold"
                margin={{ bottom: 12 }}
              />
              <Text
                text="Stack + state toggle. No overlay entry involved."
                margin={{ bottom: 20 }}
              />
              <Button text="Close" onTap={() => setShowCustom(false)} />
            </Column>
          </Container>
        </Container>
      )}
    </Scaffold>
  );
}
