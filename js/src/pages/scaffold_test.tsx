import React from 'react';
import { Scaffold, AppBar, Text, Container, Column, Center, FlutterProps } from 'fuick_js_framework';

export default function ScaffoldTest() {
  return (
    <Scaffold
      backgroundColor="#F5F5F5"
    >
      <FlutterProps propsKey="appBar">
        <AppBar 
          title={<Text text="Scaffold Test" color="#FFFFFF" fontSize={20} />}
          backgroundColor="#2196F3"
        />
      </FlutterProps>
      
      <FlutterProps propsKey="body">
        <Center>
          <Column crossAxisAlignment="center">
            <Container 
              width={200} 
              height={200} 
              color="#FFFFFF" 
              decoration={{ borderRadius: 100 }}
              alignment="center"
            >
              <Text text="Hello Scaffold" fontSize={24} color="#2196F3" />
            </Container>
            <Container padding={20}>
               <Text text="This page uses Scaffold with AppBar and body via FlutterProps." textAlign="center" />
            </Container>
          </Column>
        </Center>
      </FlutterProps>
    </Scaffold>
  );
}
