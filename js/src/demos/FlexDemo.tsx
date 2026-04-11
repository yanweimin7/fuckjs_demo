import React, { useState } from 'react';
import { Scaffold, AppBar, Flex, Container, Text, Column, Button, Wrap, Center } from 'fuickjs';

export default function FlexDemo() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [mainAxisAlignment, setMainAxisAlignment] = useState<'start' | 'end' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly'>('start');
  const [crossAxisAlignment, setCrossAxisAlignment] = useState<'start' | 'end' | 'center' | 'stretch' | 'baseline'>('center');

  return (
    <Scaffold appBar={<AppBar title="Flex Demo" />}>
      <Column padding={16}>
        <Text text="Flex Container:" fontSize={18} fontWeight="bold" margin={{ bottom: 10 }} />
        
        <Container 
          height={300} 
          width={300} 
          color="#eeeeee"
          border={{ width: 1, color: '#999999' }}
        >
          <Flex
            direction={direction}
            mainAxisAlignment={mainAxisAlignment}
            crossAxisAlignment={crossAxisAlignment}
          >
            <Container color="#ff0000" width={50} height={50} margin={5}>
              <Center><Text text="1" color="white" /></Center>
            </Container>
            <Container color="#00ff00" width={50} height={50} margin={5}>
              <Center><Text text="2" color="white" /></Center>
            </Container>
            <Container color="#0000ff" width={50} height={50} margin={5}>
              <Center><Text text="3" color="white" /></Center>
            </Container>
          </Flex>
        </Container>

        <Text text="Direction:" fontSize={16} fontWeight="bold" margin={{ top: 20, bottom: 8 }} />
        <Wrap spacing={8} runSpacing={8}>
          <Button onTap={() => setDirection('horizontal')} text="Horizontal" />
          <Button onTap={() => setDirection('vertical')} text="Vertical" />
        </Wrap>

        <Text text="Main Axis Alignment:" fontSize={16} fontWeight="bold" margin={{ top: 20, bottom: 8 }} />
        <Wrap spacing={8} runSpacing={8}>
          <Button onTap={() => setMainAxisAlignment('start')} text="Start" />
          <Button onTap={() => setMainAxisAlignment('end')} text="End" />
          <Button onTap={() => setMainAxisAlignment('center')} text="Center" />
          <Button onTap={() => setMainAxisAlignment('spaceBetween')} text="SpaceBetween" />
          <Button onTap={() => setMainAxisAlignment('spaceAround')} text="SpaceAround" />
          <Button onTap={() => setMainAxisAlignment('spaceEvenly')} text="SpaceEvenly" />
        </Wrap>

        <Text text="Cross Axis Alignment:" fontSize={16} fontWeight="bold" margin={{ top: 20, bottom: 8 }} />
        <Wrap spacing={8} runSpacing={8}>
          <Button onTap={() => setCrossAxisAlignment('start')} text="Start" />
          <Button onTap={() => setCrossAxisAlignment('end')} text="End" />
          <Button onTap={() => setCrossAxisAlignment('center')} text="Center" />
          <Button onTap={() => setCrossAxisAlignment('stretch')} text="Stretch" />
        </Wrap>

      </Column>
    </Scaffold>
  );
}
