import React, { useRef, useEffect, useState } from "react";
import {
  Scaffold,
  Stack,
  Positioned,
  Container,
  SizedBox,
  GestureDetector,
  Text,
} from "fuickjs";
import { GameStore, InputState } from "../store/game";
import { step, tryCapture, forceLevelUp } from "../game/engine";
import { STAGES, VW, VH, TICK_RATE, DT, CAPTURE_RANGE } from "../game/config";
import GameField from "../components/GameField";
import Hud from "../components/Hud";
import Joystick from "../components/Joystick";
import CaptureButton from "../components/CaptureButton";
import Overlay from "../components/Overlay";

/** 游戏主页面：整合场地、HUD、摇杆、捕获按钮与结局界面。 */
export default function GamePage() {
  const storeRef = useRef<GameStore | null>(null);
  if (!storeRef.current) storeRef.current = new GameStore();
  const store = storeRef.current;

  const inputRef = useRef<InputState>({ dx: 0, dy: 0, intensity: 0 });
  const [, setTick] = useState(0);

  useEffect(() => store.subscribe(() => setTick((t) => t + 1)), [store]);

  useEffect(() => {
    const id = setInterval(() => {
      step(store.getState(), inputRef.current, DT);
      store.notify();
    }, 1000 / TICK_RATE);
    return () => clearInterval(id);
  }, [store]);

  const state = store.getState();
  const canCapture = STAGES[state.stageIndex].canCapture;
  const hasCapturable =
    canCapture &&
    state.entities.some(
      (e) =>
        Math.hypot(e.x - state.player.x, e.y - state.player.y) <=
        state.player.radius + CAPTURE_RANGE,
    );
  const stageName = STAGES[state.stageIndex].name;

  return (
    <Scaffold backgroundColor="#000000">
      <Container alignment="center" color="#000000">
        <SizedBox width={VW} height={VH}>
          <Stack>
            <GameField state={state} />

            <Positioned left={0} top={0} width={VW}>
              <Hud state={state} />
            </Positioned>

            <Positioned left={10} top={120}>
              <GestureDetector
                onTap={() => {
                  forceLevelUp(store.getState());
                  store.notify();
                }}
              >
                <Container
                  width={56}
                  height={56}
                  alignment="center"
                  decoration={{
                    color: "rgba(76,175,80,0.85)",
                    borderRadius: 28,
                    border: { color: "#ffffff", width: 2 },
                  }}
                >
                  <Text
                    text="升级"
                    color="#ffffff"
                    fontSize={16}
                    fontWeight="bold"
                  />
                </Container>
              </GestureDetector>
            </Positioned>

            <Positioned left={18} bottom={28}>
              <Joystick inputRef={inputRef} />
            </Positioned>

            <Positioned right={22} bottom={40}>
              <CaptureButton
                enabled={hasCapturable}
                onCapture={() => {
                  tryCapture(store.getState());
                  store.notify();
                }}
              />
            </Positioned>

            {state.hitFlash > 0 && (
              <Positioned left={0} top={0} right={0} bottom={0}>
                <Container color="rgba(255,0,0,0.22)" />
              </Positioned>
            )}

            {state.status !== "playing" && (
              <Positioned left={0} top={0} right={0} bottom={0}>
                <Overlay
                  win={state.status === "win"}
                  stageName={stageName}
                  matter={state.matter}
                  onRestart={() => store.reset()}
                />
              </Positioned>
            )}
          </Stack>
        </SizedBox>
      </Container>
    </Scaffold>
  );
}
