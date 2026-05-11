import React, { useRef, useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Expanded,
  Text,
  Container,
  Button,
  Row,
  TextField,
} from "fuickjs";
import { WebView } from "@fuickjs-community/web_view";

export default function WebViewDemo() {
  const webViewRef = useRef<WebView>(null);
  const [title, setTitle] = useState("Loading...");
  const [progress, setProgress] = useState(0);
  const [inputUrl, setInputUrl] = useState("https://flutter.dev");

  return (
    <Scaffold appBar={<AppBar title="WebView Demo" />}>
      <Column>
        <Row padding={{ horizontal: 8, vertical: 6 }}>
          <Expanded>
            <TextField
              value={inputUrl}
              onChanged={(v: string) => setInputUrl(v)}
              decoration={{ labelText: "URL" }}
            />
          </Expanded>
          <Button
            text="Go"
            onTap={() => webViewRef.current?.loadUrl(inputUrl)}
          />
        </Row>

        <Container padding={{ horizontal: 12 }} margin={{ bottom: 4 }}>
          <Text text={`Title: ${title}`} fontSize={13} color="#555555" maxLines={1} overflow="ellipsis" />
          <Text text={`Progress: ${progress}%`} fontSize={13} color="#888888" />
        </Container>

        <Expanded>
          <WebView
            ref={webViewRef}
            refId="main_webview"
            url="https://flutter.dev"
            javaScriptEnabled={true}
            onTitleChanged={(t: string) => setTitle(t)}
            onProgressChanged={(p: number) => setProgress(p)}
            onLoadStart={(url: string) => console.log("Load start:", url)}
            onLoadStop={(url: string) => console.log("Load stop:", url)}
            onLoadError={(info: { url: string; code: number; message: string }) =>
              console.error("Load error:", info)
            }
          />
        </Expanded>

        <Row mainAxisAlignment="spaceEvenly" padding={{ vertical: 8 }}>
          <Button text="Back" onTap={() => webViewRef.current?.goBack()} />
          <Button text="Forward" onTap={() => webViewRef.current?.goForward()} />
          <Button text="Reload" onTap={() => webViewRef.current?.reload()} />
        </Row>
      </Column>
    </Scaffold>
  );
}
