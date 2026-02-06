import React from "react";
import {
  Scaffold,
  AppBar,
  Center,
  Column,
  Text,
  Button,
  useNavigator,
  SizedBox,
} from "fuickjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HybridDemoPage(props: any) {
  const navigator = useNavigator();
  const [result, setResult] = React.useState<string | null>(null);

  return (
    <Scaffold appBar={<AppBar title="Hybrid Navigation Demo" />}>
      <Center>
        <Column>
          <Text text="This is a JS Page" fontSize={20} fontWeight="bold" />
          <SizedBox height={10} />
          <Text
            text={`Params: ${JSON.stringify(props)}`}
            fontSize={14}
            color="grey"
          />
          {result && (
            <>
              <SizedBox height={20} />
              <Text
                text={`Result from Native: ${result}`}
                fontSize={16}
                color="blue"
              />
            </>
          )}
          <SizedBox height={20} />
          <Button
            text="返回上一个页面，并带有参数"
            onTap={() => {
              // Pop current page and return a value
              navigator.pop(false, {
                message: "我是js页面返回的参数",
                timestamp: Date.now(),
              });
            }}
          />
          <SizedBox height={20} />
          <Button
            text="打开原生页面"
            onTap={async () => {
              // Example: Push to a native route if defined, or just test callback
              const res = await navigator.push(
                "/natie_demo_page",
                { data: "我是js页面打开的参数" },
                true,
              );
              if (res) {
                setResult(JSON.stringify(res));
              }
            }}
          />
          <SizedBox height={20} />
          <Button
            text="打开js页面"
            onTap={async () => {
              const res = await navigator.push("/hybrid_demo", {
                data: "我是js页面打开的参数",
              });
              if (res) {
                setResult(JSON.stringify(res));
              }
            }}
          />
        </Column>
      </Center>
    </Scaffold>
  );
}
