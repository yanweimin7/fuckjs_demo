import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Button,
  Container,
  SingleChildScrollView,
  Padding,
  Divider,
} from "fuickjs";

export default function BrowserApiDemo() {
  const [logs, setLogs] = useState<string[]>([
    "Click a button to test APIs...",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20),
    );
    console.log(msg);
  };

  // 1. Base64 Test
  const testBase64 = () => {
    const raw = "Hello FuickJS! 🚀";
    try {
      const encoded = btoa(raw);
      const decoded = atob(encoded);
      addLog(`Base64: "${raw}" -> "${encoded}" -> "${decoded}"`);
    } catch (e: any) {
      addLog(`Base64 Error: ${e.message}`);
    }
  };

  // 2. URL Test
  const testURL = () => {
    const url = new URL(
      "https://user:pass@example.com:8080/p/a/t/h?query=1&name=fuick#hash",
    );
    addLog(`URL Host: ${url.host}, Path: ${url.pathname}`);
    addLog(`URL Param 'name': ${url.searchParams.get("name")}`);

    url.searchParams.append("new", "value");
    addLog(`Updated URL: ${url.href}`);
  };

  // 3. Storage Test
  const testStorage = () => {
    localStorage.setItem("test_key", "FuickData_" + Date.now());
    const val = localStorage.getItem("test_key");
    addLog(`LocalStorage: set/get test_key = ${val}`);

    sessionStorage.setItem("session_key", "SessionData");
    addLog(`SessionStorage: length = ${sessionStorage.length}`);
  };

  // 4. Performance Test
  const testPerformance = () => {
    const start = performance.now();
    // Simulate some work
    for (let i = 0; i < 1000000; i++) {}
    const end = performance.now();
    addLog(`Performance: took ${(end - start).toFixed(4)}ms`);
  };

  // 5. Events Test
  const testEvents = () => {
    const target = new EventTarget();
    const handler = (e: any) =>
      addLog(`Event Received: ${e.type}, detail: ${JSON.stringify(e.detail)}`);

    target.addEventListener("custom-event", handler as any);
    target.dispatchEvent(
      new CustomEvent("custom-event", { detail: { ok: true } }),
    );
    target.removeEventListener("custom-event", handler as any);
  };

  // 6. AbortController & Fetch Test
  const testFetchAbort = async () => {
    const controller = new AbortController();
    addLog("Fetch: Starting request and aborting in 10ms...");

    fetch("https://httpbin.org/delay/5", { signal: controller.signal })
      .then(() => addLog("Fetch: Success (Should not happen)"))
      .catch((e) => addLog(`Fetch Catch: ${e.name} - ${e.message}`));

    setTimeout(() => {
      controller.abort();
      addLog("Fetch: Controller.abort() called");
    }, 10);
  };

  // 7. XMLHttpRequest Test
  const testXHR = () => {
    addLog("XHR: Starting GET request...");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://httpbin.org/get?foo=bar");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        addLog(`XHR Done: Status ${xhr.status}`);
        if (xhr.status === 200) {
          addLog(`XHR Response: ${xhr.responseText.substring(0, 50)}...`);
        }
      }
    };
    xhr.send();
  };

  // 8. Fetch GET Test
  const testFetchGet = async () => {
    addLog("Fetch GET: Starting request...");
    try {
      const response = await fetch("https://httpbin.org/get?foo=bar");
      const data = await response.json();
      addLog(
        `Fetch GET: Status ${response.status}, args: ${JSON.stringify(data.args)}`,
      );
    } catch (e: any) {
      addLog(`Fetch GET Error: ${e.message}`);
    }
  };

  // 9. Fetch POST Test
  const testFetchPost = async () => {
    addLog("Fetch POST: Starting request...");
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "test-value",
        },
        body: JSON.stringify({ name: "fuickjs", version: "1.0" }),
      });
      const data = await response.json();
      addLog(
        `Fetch POST: Status ${response.status}, headers: ${JSON.stringify(data.headers)}`,
      );
    } catch (e: any) {
      addLog(`Fetch POST Error: ${e.message}`);
    }
  };

  // 10. Fetch Binary Test (EVM RPC)
  const testFetchRPC = async () => {
    addLog("Fetch RPC: Querying ETH balance via JSON-RPC...");
    try {
      const response = await fetch("https://eth.llamarpc.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });
      const data = await response.json();
      addLog(
        `Fetch RPC: Status ${response.status}, blockNumber: ${data.result}`,
      );
    } catch (e: any) {
      addLog(`Fetch RPC Error: ${e.message}`);
    }
  };

  return (
    <Scaffold appBar={<AppBar title="Browser API Demo" />}>
      <Column>
        <Container height={200} decoration={{ color: "#f0f0f0" }} padding={10}>
          <SingleChildScrollView>
            <Column crossAxisAlignment="start">
              {logs.map((log, i) => (
                <Text key={i} text={log} fontSize={12} margin={{ bottom: 4 }} />
              ))}
            </Column>
          </SingleChildScrollView>
        </Container>

        <Divider />

        <SingleChildScrollView>
          <Padding padding={16}>
            <Column>
              <Section title="Basic Utils">
                <Row mainAxisAlignment="spaceAround">
                  <Button text="Base64" onTap={testBase64} />
                  <Button text="URL" onTap={testURL} />
                  <Button text="Performance" onTap={testPerformance} />
                </Row>
              </Section>

              <Section title="Storage & Events">
                <Row mainAxisAlignment="spaceAround">
                  <Button text="Storage" onTap={testStorage} />
                  <Button text="Events" onTap={testEvents} />
                </Row>
              </Section>

              <Section title="Networking">
                <Column crossAxisAlignment="stretch">
                  <Button
                    text="Fetch + Abort"
                    onTap={testFetchAbort}
                    margin={{ bottom: 10 }}
                  />
                  <Button
                    text="XMLHttpRequest (AJAX)"
                    onTap={testXHR}
                    margin={{ bottom: 10 }}
                  />
                  <Button
                    text="Fetch GET"
                    onTap={testFetchGet}
                    margin={{ bottom: 10 }}
                  />
                  <Button
                    text="Fetch POST"
                    onTap={testFetchPost}
                    margin={{ bottom: 10 }}
                  />
                  <Button text="Fetch JSON-RPC" onTap={testFetchRPC} />
                </Column>
              </Section>

              <Section title="Console Methods">
                <Row mainAxisAlignment="spaceAround">
                  <Button
                    text="log/info"
                    onTap={() => {
                      console.log("Log test");
                      console.info("Info test");
                      addLog("Check native logs");
                    }}
                  />
                  <Button
                    text="warn/error"
                    onTap={() => {
                      console.warn("Warn test");
                      console.error("Error test");
                      addLog("Check native logs");
                    }}
                  />
                  <Button
                    text="trace"
                    onTap={() => {
                      console.trace();
                      addLog("Check native logs for stack");
                    }}
                  />
                </Row>
              </Section>
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Column>
    </Scaffold>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Column crossAxisAlignment="start" margin={{ bottom: 20 }}>
      <Text
        text={title}
        fontSize={16}
        fontWeight="bold"
        margin={{ bottom: 10 }}
        color="#333"
      />
      {children}
    </Column>
  );
}
