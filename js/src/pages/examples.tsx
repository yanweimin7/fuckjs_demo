import React from 'react';
import {
  Column,
  Container,
  Text,
  Center,
  Expanded,
  Row,
  Button,
  Icon,
  CircularProgressIndicator,
  Stack,
  Positioned,
  Opacity,
  GestureDetector,
  Padding,
  SizedBox,
  Divider,
  SingleChildScrollView
} from 'fuick_js_framework';

const ExamplesPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [opacity, setOpacity] = React.useState(1.0);

  return (
    <SingleChildScrollView>
      <Padding padding={16}>
        <Column crossAxisAlignment="start">
          <Center>
            <Text text="Flutter Widgets 示例" fontSize={24} color="#333333" />
          </Center>
          <SizedBox height={20} />

          {/* Expanded & Row */}
          <Text text="1. Expanded & Row" fontSize={18} color="#666666" />
          <SizedBox height={10} />
          <Row>
            <Expanded flex={1}>
              <Container color="#FF0000" height={50}>
                <Center><Text text="Flex 1" color="#FFFFFF" /></Center>
              </Container>
            </Expanded>
            <Expanded flex={2}>
              <Container color="#00FF00" height={50}>
                <Center><Text text="Flex 2" color="#FFFFFF" /></Center>
              </Container>
            </Expanded>
          </Row>
          <SizedBox height={20} />
          <Divider />

          {/* Stack & Positioned */}
          <Text text="2. Stack & Positioned" fontSize={18} color="#666666" />
          <SizedBox height={10} />
          <Center>
            <Stack alignment="center" width={200} height={200}>
              <Container color="#EEEEEE" width={200} height={200} />
              <Positioned top={20} left={20}>
                <Container color="#2196F3" width={60} height={60} />
              </Positioned>
              <Positioned bottom={20} right={20}>
                <Container color="#F44336" width={60} height={60} />
              </Positioned>
              <Center>
                <Text text="Center" />
              </Center>
            </Stack>
          </Center>
          <SizedBox height={20} />
          <Divider />

          {/* Opacity & GestureDetector */}
          <Text text="3. Opacity & GestureDetector" fontSize={18} color="#666666" />
          <SizedBox height={10} />
          <Row mainAxisAlignment="spaceBetween">
            <GestureDetector onTapJs={{ call: 'nativeLog', args: { message: 'Tapped!' } }}>
              <Opacity opacity={opacity}>
                <Container color="#9C27B0" width={100} height={100} borderRadius={8}>
                  <Center><Text text="Click Me" color="#FFFFFF" /></Center>
                </Container>
              </Opacity>
            </GestureDetector>
            <Column>
              <Button text="Toggle Opacity" onTap={() => setOpacity((prev: number) => prev === 1.0 ? 0.5 : 1.0)} />
              <SizedBox height={10} />
              <Text text={`Current: ${opacity.toFixed(1)}`} />
            </Column>
          </Row>
          <SizedBox height={20} />
          <Divider />

          {/* CircularProgressIndicator */}
          <Text text="4. Progress & Loading" fontSize={18} color="#666666" />
          <SizedBox height={10} />
          <Row>
            <Button text="Show Loading" onTap={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }} />
            <SizedBox width={20} />
            {loading && (
              <CircularProgressIndicator color="#2196F3" strokeWidth={3} />
            )}
          </Row>
          <SizedBox height={20} />
          <Divider />

          {/* Icons */}
          <Text text="5. Icons" fontSize={18} color="#666666" />
          <SizedBox height={10} />
          <Row mainAxisAlignment="spaceAround">
            <Icon codePoint={0xe3af} color="#2196F3" size={40} /> {/* home */}
            <Icon codePoint={0xe491} color="#4CAF50" size={40} /> {/* favorite */}
            <Icon codePoint={0xe57f} color="#FF9800" size={40} /> {/* settings */}
            <Icon codePoint={0xe8b6} color="#9C27B0" size={40} /> {/* search */}
          </Row>

          <SizedBox height={40} />
        </Column>
      </Padding>
    </SingleChildScrollView>
  );
};

export default ExamplesPage;
