import React, { useState, useEffect, useRef } from "react";
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
  TextField,
  Divider,
} from "fuickjs";

export default function WebSocketDemo() {
  const [url, setUrl] = useState("wss://echo.websocket.org/");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "WebSocket Demo - Click Connect to start...",
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${msg}`;
    setLogs((prev) => [logEntry, ...prev].slice(0, 100));
    console.log(logEntry);
  };

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      addLog("Already connected");
      return;
    }

    try {
      addLog(`Connecting to ${url}...`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        addLog("Connected successfully");
        addLog(`Protocol: ${ws.protocol || "none"}`);
      };

      ws.onmessage = (event) => {
        const data = event.data;
        let displayData: string;

        if (data instanceof ArrayBuffer) {
          const bytes = new Uint8Array(data);
          displayData = `Binary(${bytes.length} bytes)`;
        } else {
          displayData = String(data).substring(0, 100);
          if (String(data).length > 100) displayData += "...";
        }

        addLog(`Received: ${displayData}`);
      };

      ws.onerror = () => {
        addLog("WebSocket error occurred");
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        addLog(
          `Closed - Code: ${event.code}, Reason: ${
            event.reason || "No reason"
          }, Clean: ${event.wasClean}`,
        );
        wsRef.current = null;
      };
    } catch (e: any) {
      addLog(`Connection failed: ${e.message}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      addLog("Disconnecting...");
      wsRef.current.close(1000, "User requested disconnect");
    } else {
      addLog("Not connected");
    }
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog("Not connected");
      return;
    }

    if (!message.trim()) {
      addLog("Message is empty");
      return;
    }

    try {
      wsRef.current.send(message);
      addLog(`Sent: ${message}`);
      setMessage("");
    } catch (e: any) {
      addLog(`Send failed: ${e.message}`);
    }
  };

  const sendBinary = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog("Not connected");
      return;
    }

    try {
      const binaryData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
      wsRef.current.send(binaryData.buffer);
      addLog(`Sent binary: ${binaryData.length} bytes`);
    } catch (e: any) {
      addLog(`Send binary failed: ${e.message}`);
    }
  };

  const clearLogs = () => {
    setLogs(["Logs cleared"]);
  };

  const checkState = () => {
    if (!wsRef.current) {
      addLog("No WebSocket instance");
      return;
    }

    const states = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    const state = states[wsRef.current.readyState] || "UNKNOWN";
    addLog(`State: ${state} (${wsRef.current.readyState})`);
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <Scaffold appBar={<AppBar title="WebSocket Demo" />}>
      <Column>
        <Container height={180} decoration={{ color: "#f5f5f5" }} padding={10}>
          <SingleChildScrollView>
            <Column crossAxisAlignment="start">
              {logs.map((log, i) => (
                <Text
                  key={i}
                  text={log}
                  fontSize={11}
                  margin={{ bottom: 2 }}
                  color={"#2e7d32"}
                />
              ))}
            </Column>
          </SingleChildScrollView>
        </Container>

        <Divider />

        <SingleChildScrollView>
          <Padding padding={16}>
            <Column>
              <Section title="Connection">
                <TextField
                  hintText="WebSocket URL"
                  text={url}
                  onChanged={setUrl}
                />
                <Row mainAxisAlignment="spaceAround" margin={{ top: 10 }}>
                  <Button
                    text={isConnected ? "Disconnect" : "Connect"}
                    onTap={isConnected ? disconnect : connect}
                  />
                  <Button text="Check State" onTap={checkState} />
                </Row>
              </Section>

              <Section title="Send Message">
                <TextField
                  hintText="Enter message..."
                  text={message}
                  onChanged={setMessage}
                />
                <Row mainAxisAlignment="spaceAround" margin={{ top: 10 }}>
                  <Button text="Send Text" onTap={sendMessage} />
                  <Button text="Send Binary" onTap={sendBinary} />
                </Row>
              </Section>

              <Section title="Controls">
                <Button text="Clear Logs" onTap={clearLogs} />
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
