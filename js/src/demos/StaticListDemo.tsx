import React from "react";
import {
  ListView,
  Text,
  Scaffold,
  AppBar,
  Container,
  Column,
  Row,
  Icon,
  Expanded,
} from "fuickjs";

/**
 * 无状态 ListView Demo — 列表项不走 reconciler sub-root
 * itemBuilder 返回纯 JSX，通过 elementToDsl 直接转 DSL，无 React 生命周期。
 * 适用于纯展示型列表，性能更优，内存占用更低。
 */

const COLORS = ["#E3F2FD", "#FFF3E0", "#E8F5E9", "#FCE4EC", "#F3E5F5", "#FFF9C4"];
const ICONS = ["star", "favorite", "bookmark", "cloud", "flight", "music_note"];

export default function StaticListDemo() {
  return (
    <Scaffold appBar={<AppBar title="Static List (Stateless)" />}>
      <Column>
        <Container
          padding={{ left: 16, right: 16, top: 12, bottom: 8 }}
          color="#F5F5F5"
        >
          <Text
            text="itemBuilder 中不使用 useState/useEffect，列表项无生命周期，纯展示型"
            fontSize={12}
            color="#666"
            maxLines={2}
          />
        </Container>

        <Container
          padding={{ left: 16, top: 8, bottom: 4 }}
        >
          <Text text="Contacts" fontSize={18} fontWeight="bold" color="#333" />
        </Container>

        <Expanded>
          <ListView
            itemCount={30}
            stateful={false}
            itemBuilder={(index) => (
            <Container
              padding={{ left: 16, right: 16, top: 10, bottom: 10 }}
              decoration={{
                color: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                border: { width: 0, color: "transparent" },
              }}
              onTap={() => console.log(`Tapped contact ${index + 1}`)}
            >
              <Row crossAxisAlignment="center">
                <Container
                  width={40}
                  height={40}
                  alignment="center"
                  margin={{ right: 12 }}
                  decoration={{
                    color: COLORS[index % COLORS.length],
                    borderRadius: 20,
                  }}
                >
                  <Icon name={ICONS[index % ICONS.length]} fontSize={18} color="#555" />
                </Container>
                <Column crossAxisAlignment="start">
                  <Text text={`Contact ${index + 1}`} fontSize={14} />
                  <Text
                    text={`+1 (555) ${String(1000 + index).slice(1)}-${String(10000 + index * 7).slice(1)}`}
                    fontSize={12}
                    color="#999"
                  />
                </Column>
              </Row>
            </Container>
          )}
          />
        </Expanded>
      </Column>
    </Scaffold>
  );
}
