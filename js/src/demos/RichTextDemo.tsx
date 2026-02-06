import * as React from 'react';
import {
  Container,
  Scaffold,
  AppBar,
  Center,
} from 'fuickjs';

const RichText = 'RichText' as any;

export default function RichTextDemo() {
  return (
    <Scaffold
      appBar={<AppBar title="RichText Demo" />}
    >
      <Center>
        <Container color="#EEEEEE" padding={20}>
          <RichText
            text={{
              text: 'This is ',
              style: { color: '#000000', fontSize: 18 },
              children: [
                {
                  text: 'bold ',
                  style: { fontWeight: 'bold', color: '#E91E63' },
                },
                {
                  text: 'and ',
                  style: { color: '#000000' },
                },
                {
                  text: 'italic',
                  style: { fontStyle: 'italic', color: '#2196F3', fontSize: 24 },
                },
                {
                  text: ' text.',
                  style: { color: '#000000' },
                },
                {
                  text: '\n\nClick Me!',
                  style: { color: '#009688', decoration: 'underline', fontWeight: 'bold', fontSize: 20 },
                  onTap: () => console.log('RichText tapped!')
                }
              ],
            }}
          />
        </Container>
      </Center>
    </Scaffold>
  );
}
