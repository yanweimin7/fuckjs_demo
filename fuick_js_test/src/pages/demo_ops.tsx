import React, { useState } from 'react';
import { Scaffold, AppBar, Column, Row, Text, Button, Container, Padding, Center, Divider } from 'fuick_js_framework';

export const DemoOpsPage = () => {
  const [items, setItems] = useState([
    { id: 1, text: '项目 1' },
    { id: 2, text: '项目 2' },
  ]);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItems = [...items, { id: newId, text: `项目 ${newId}` }];
    setItems(newItems);
    console.log("wine add item:", newItems.map(e => e.text).join(", "));
  };

  const deleteItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    console.log("wine delete item, remaining:", newItems.map(e => e.text).join(", "));
  };

  const updateItem = (id: number) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, text: `${item.text} (已更新)` } : item
    );
    setItems(newItems);
    console.log("wine update item, current:", newItems.map(e => e.text).join(", "));
  };

  const reverseItems = () => {
    const newItems = [...items].reverse();
    setItems(newItems);
    console.log("wine reverse items:", newItems.map(e => e.text).join(", "));
  };

  const shuffleItems = () => {
    const newItems = [...items].sort(() => Math.random() - 0.5);
    setItems(newItems);
    console.log("wine shuffle items:", newItems.map(e => e.text).join(", "));
  };

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="节点操作演示" />} />}
      body={
        <Padding padding={{ all: 16 }}>
          <Column crossAxisAlignment="start">
            <Row mainAxisAlignment="spaceBetween">
              <Text text="列表项" fontSize={20} fontWeight="bold" />
              <Row>
                <Button text="反转" onTap={reverseItems} />
                <Container width={8} />
                <Button text="打乱" onTap={shuffleItems} />
                <Container width={8} />
                <Button text="添加" onTap={addItem} />
              </Row>
            </Row>

            <Divider height={20} />

            <Column>
              {items.map(item => (
                <Container key={item.id} padding={{ top: 8, bottom: 8 }}>
                  <Row mainAxisAlignment="spaceBetween">
                    <Text text={item.text} fontSize={16} />
                    <Row>
                      <Button text="更新" onTap={() => updateItem(item.id)} />
                      <Container width={8} />
                      <Button text="删除" onTap={() => deleteItem(item.id)} />
                    </Row>
                  </Row>
                  <Divider />
                </Container>
              ))}
            </Column>

            {items.length === 0 && (
              <Center>
                <Padding padding={{ top: 40 }}>
                  <Text text="列表为空" color="#999999" />
                </Padding>
              </Center>
            )}
          </Column>
        </Padding>
      }
    />
  );
};
