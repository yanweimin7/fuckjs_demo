import React, { useRef, useState } from "react";
import {
  GestureDetector,
  Container,
  Positioned,
  Stack,
  DragArgs,
} from "fuickjs";
import type { InputState } from "../store/game";
import { JOY_MAX_R } from "../game/config";

const JOY_SIZE = 120;
const KNOB = 46;
const CENTER = JOY_SIZE / 2;

interface JoystickProps {
  inputRef: React.MutableRefObject<InputState>;
}

/** 左下角虚拟摇杆：拖动输出方向向量与强度，松开归零。 */
export default function Joystick({ inputRef }: JoystickProps) {
  // Flutter 的 onPanUpdate 只给「增量 delta」(details.delta)，需累加成
  // 相对起点的累计位移，才能得到稳定的方向与强度（框架 DragArgs 语义）。
  const accumRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [knob, setKnob] = useState<{ x: number; y: number }>({
    x: CENTER,
    y: CENTER,
  });

  const onPanStart = () => {
    accumRef.current = { x: 0, y: 0 };
    setKnob({ x: CENTER, y: CENTER });
  };

  const onPanUpdate = (e: DragArgs) => {
    let ax = accumRef.current.x + e.dx;
    let ay = accumRef.current.y + e.dy;
    const len = Math.hypot(ax, ay);
    if (len > JOY_MAX_R) {
      ax = (ax / len) * JOY_MAX_R;
      ay = (ay / len) * JOY_MAX_R;
    }
    accumRef.current = { x: ax, y: ay };
    const intensity = Math.min(Math.hypot(ax, ay) / JOY_MAX_R, 1);
    inputRef.current = { dx: ax, dy: ay, intensity };
    setKnob({ x: CENTER + ax, y: CENTER + ay });
  };

  const onPanEnd = () => {
    accumRef.current = { x: 0, y: 0 };
    inputRef.current = { dx: 0, dy: 0, intensity: 0 };
    setKnob({ x: CENTER, y: CENTER });
  };

  return (
    <GestureDetector
      onPanStart={onPanStart}
      onPanUpdate={onPanUpdate}
      onPanEnd={onPanEnd}
    >
      <Stack>
        <Container
          width={JOY_SIZE}
          height={JOY_SIZE}
          decoration={{
            color: "rgba(255,255,255,0.10)",
            borderRadius: JOY_SIZE / 2,
          }}
        />
        <Positioned left={CENTER - 26} top={CENTER - 26} width={52} height={52}>
          <Container
            width={52}
            height={52}
            decoration={{ color: "rgba(255,255,255,0.18)", borderRadius: 26 }}
          />
        </Positioned>
        <Positioned
          left={knob.x - KNOB / 2}
          top={knob.y - KNOB / 2}
          width={KNOB}
          height={KNOB}
        >
          <Container
            width={KNOB}
            height={KNOB}
            decoration={{ color: "#4fc3f7", borderRadius: KNOB / 2 }}
          />
        </Positioned>
      </Stack>
    </GestureDetector>
  );
}
