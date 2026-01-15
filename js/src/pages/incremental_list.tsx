import React, { useState, useContext } from 'react';
import { ListView, GridView, Text, Button, Column, Row, Container, getContainer, PageContext, Scaffold, AppBar, SizedBox, Expanded, GestureDetector } from 'fuick_js_framework';

export default function IncrementalListDemo() {
  const { pageId } = useContext(PageContext);
  const [items, setItems] = useState<any[]>(Array.from({ length: 20 }, (_, i) => ({ id: `item_${i}`, text: `Item ${i}` })));
  const [mode, setMode] = useState('Dirty'); // Dirty | Incremental
  const [viewType, setViewType] = useState('List'); // List | Grid

  const toggleMode = () => {
    const newMode = mode === 'Dirty' ? 'Incremental' : 'Dirty';
    setMode(newMode);
    const container = getContainer(pageId);
    if (container) {
      (container as any).setIncrementalMode(newMode === 'Incremental');
    }
  };

  const toggleView = () => {
    setViewType(viewType === 'List' ? 'Grid' : 'List');
  };

  const updateItem = () => {
    const newItems = [...items];
    const index = 0;
    if (newItems.length > 0) {
      newItems[index] = { ...newItems[index], text: `Updated ${Date.now()}` };
      setItems(newItems);
    }
  };

  const addItem = () => {
    const newItems = [{ id: `new_${Date.now()}`, text: `New Item ${Date.now()}` }, ...items];
    setItems(newItems);
  };

  const removeItem = () => {
    const newItems = [...items];
    if (newItems.length > 0) {
      newItems.shift();
      setItems(newItems);
    }
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title="Incremental Demo v2"
        />
      }
    >
      <Column>
        
          <Text text={`Current Mode: ${mode} | View: ${viewType}`} fontSize={18} fontWeight="bold" />
          <SizedBox height={10} />
          <Row mainAxisAlignment="spaceEvenly">
            <Button text="Toggle Mode" onTap={toggleMode} />
            <Button text="Toggle View" onTap={toggleView} />
          </Row>
          <SizedBox height={10} />
          <Row mainAxisAlignment="spaceEvenly">
            <Button text="Update" onTap={updateItem} />
            <Button text="Add" onTap={addItem} />
            <Button text="Remove" onTap={removeItem} />
          </Row>
        
        <Expanded>
          {viewType === 'List' ? (
            <ListView
              itemCount={items.length}
              itemBuilder={(index) => {
                const item = items[index];
                return (
                  <GestureDetector
                    key={item.id}
                    onTap={() => console.log('Clicked', item.text)}
                  >
                    <Container
                      id={item.id} // Important for incremental updates!
                      padding={15}
                      color={index % 2 === 0 ? '#ffffff' : '#f8f8f8'}
                    >
                      <Text text={`${index}: ${item.text}`} />
                    </Container>
                  </GestureDetector>
                );
              }}
            />
          ) : (
            <GridView
              crossAxisCount={2}
              crossAxisSpacing={10}
              mainAxisSpacing={10}
              padding={10}
              itemCount={items.length}
              itemBuilder={(index) => {
                const item = items[index];
                return (
                  <GestureDetector
                    key={item.id}
                    onTap={() => console.log('Clicked Grid', item.text)}
                  >
                    <Container
                      id={item.id} // Important for incremental updates!
                      padding={15}
                      color={index % 2 === 0 ? '#e3f2fd' : '#bbdefb'}
                      alignment="center"
                      borderRadius={8}
                    >
                      <Text text={`${index}: ${item.text}`} />
                    </Container>
                  </GestureDetector>
                );
              }}
            />
          )}
        </Expanded>
      </Column>
    </Scaffold>
  );
}
