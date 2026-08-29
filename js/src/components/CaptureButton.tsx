import React from "react";
import { GestureDetector, Container, Text } from "fuickjs";

interface CaptureButtonProps {
  enabled: boolean;
  onCapture: () => void;
}

/** 右下角捕获按钮：仅 L4+ 且存在可捕获行星时可用。 */
export default function CaptureButton({
  enabled,
  onCapture,
}: CaptureButtonProps) {
  return (
    <GestureDetector
      onTap={() => {
        if (enabled) onCapture();
      }}
    >
      <Container
        width={84}
        height={84}
        alignment="center"
        decoration={{
          color: enabled ? "rgba(255,193,7,0.85)" : "rgba(120,120,120,0.35)",
          borderRadius: 42,
        }}
      >
        <Text
          text={enabled ? "捕获" : "捕获"}
          color={enabled ? "#000000" : "#eeeeee"}
          fontSize={18}
          fontWeight="bold"
        />
      </Container>
    </GestureDetector>
  );
}
