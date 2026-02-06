import React, { useState } from 'react';
import {
  Scaffold,
  AppBar,
  Column,
  Text,
  Container,
  VisibilityDetector,
  ListView,
} from 'fuickjs';

export default function VisibilityDetectorDemo() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const handleVisibilityChanged = (index: number, visible: boolean) => {
    setVisibleItems((prev) => {
      const next = new Set(prev);
      if (visible) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  return (
    <Scaffold appBar={<AppBar title="VisibilityDetector Demo" />}>
      <Column>
        <Container padding={16} color="#E3F2FD">
          <Text
            text={`Visible Items: ${Array.from(visibleItems).sort((a, b) => a - b).join(', ')}`}
            fontSize={16}
          />
        </Container>
        <ListView
          itemCount={50}
          itemBuilder={(index) => (
            <VisibilityDetector
              key={index}
              onVisibilityChanged={(info: { visibleFraction: number }) => {
                const isVisible = info.visibleFraction > 0.5;
                handleVisibilityChanged(index, isVisible);
              }}
            >
              <Container
                margin={{ all: 10 }}
                padding={20}
                color={visibleItems.has(index) ? '#81C784' : '#E0E0E0'}
                alignment="center"
              >
                <Text
                  text={`Item ${index} (${visibleItems.has(index) ? 'Visible' : 'Hidden'})`}
                  fontSize={18}
                  color={visibleItems.has(index) ? 'white' : 'black'}
                />
              </Container>
            </VisibilityDetector>
          )}
        />
      </Column>
    </Scaffold>
  );
}
