import React from "react";
import { Column, Container, Text, SizedBox, LinearProgressIndicator } from "fuickjs";
import type { GameState } from "../store/game";
import { STAGES, FINAL_MATTER, VW } from "../game/config";

interface HudProps {
  state: GameState;
}

const BAR_W = VW - 20;

/** 顶部状态 HUD：等级名、物质、升级进度、生命值。 */
export default function Hud({ state }: HudProps) {
  const cur = STAGES[state.stageIndex];
  let pct: number;
  let nextName: string;
  if (state.stageIndex < STAGES.length - 1) {
    const next = STAGES[state.stageIndex + 1];
    pct =
      (state.matter - cur.reachMatter) / (next.reachMatter - cur.reachMatter);
    nextName = next.name;
  } else {
    pct = state.matter / FINAL_MATTER;
    nextName = "另一个宇宙";
  }
  pct = Math.max(0, Math.min(1, pct));
  const maxH = state.maxHealth && state.maxHealth > 0 ? state.maxHealth : 100;
  const hp = Math.max(0, Math.min(1, state.health / maxH));

  return (
    <Container width={VW} padding={10} color="rgba(0,0,0,0.35)">
      <Column crossAxisAlignment="start">
        <Text
          text={`${cur.name}　物质 ${Math.floor(state.matter)}`}
          color="#ffffff"
          fontSize={16}
          fontWeight="bold"
        />
        <SizedBox height={6} />
        <LinearProgressIndicator
          value={pct}
          color="#4fc3f7"
          backgroundColor="rgba(255,255,255,0.20)"
          strokeWidth={10}
          borderRadius={5}
        />
        <SizedBox height={4} />
        <Text
          text={`距「${nextName}」还需 ${Math.max(0, Math.ceil((state.stageIndex < STAGES.length - 1 ? STAGES[state.stageIndex + 1].reachMatter : FINAL_MATTER) - state.matter))}`}
          color="#cfd8dc"
          fontSize={12}
        />
        <SizedBox height={8} />
        <Text
          text={`HP ${Math.ceil(state.health)} / ${maxH}`}
          color="#ff8a80"
          fontSize={12}
          fontWeight="bold"
        />
        <SizedBox height={3} />
        <LinearProgressIndicator
          value={hp}
          color={hp > 0.5 ? "#66bb6a" : hp > 0.25 ? "#ffa726" : "#ef5350"}
          backgroundColor="rgba(255,255,255,0.18)"
          strokeWidth={12}
          borderRadius={6}
        />
      </Column>
    </Container>
  );
}
