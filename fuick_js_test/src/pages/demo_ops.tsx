import React, { useState } from 'react';
import { Scaffold, AppBar, Column, Row, Text, Button, Container, Padding, Center, Divider } from 'fuick_js_framework';

export const DemoOpsPage = () => {
  const [items, setItems] = useState([
    { id: 1, text: '项目 1' },
    { id: 2, text: '项目 2' },
  ]);

  const addItem = () => {
    console.log("wine add item");
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, text: `项目 ${newId}` }]);
    console.log("wine add item", items.map(e => e.text).join(","));
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, text: `${item.text} (已更新)` } : item
    ));
  };

  return (
    <Scaffold
      appBar={<AppBar title={<Text text="节点操作演示" />} />}
      body={
        <Padding padding={{ all: 16 }}>
          <Column crossAxisAlignment="start">
            <Row mainAxisAlignment="spaceBetween">
              <Text text="列表项" fontSize={20} fontWeight="bold" />
              <Button text="添加项目" onTap={addItem} />
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
