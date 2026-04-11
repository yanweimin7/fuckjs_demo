import * as React from 'react';
import {
  Text,
  Column,
  Scaffold,
  AppBar,
  SingleChildScrollView,
  SizedBox,
} from 'fuickjs';

const RefreshIndicator = 'RefreshIndicator' as any;

export default function RefreshIndicatorDemo() {
  const [count, setCount] = React.useState(0);
  const refreshControl = React.useRef<any>(null);

  const onRefresh = async () => {
    try {
      console.log('Refreshing...');

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCount(c => c + 1);
      console.log('Refreshed!');
    } finally {
      // Complete the refresh via command
      if (refreshControl.current && refreshControl.current.complete) {
        refreshControl.current.complete();
      } else {
        console.warn("RefreshIndicator ref not ready or complete method missing");
      }
    }
  };

  return (
    <Scaffold
      appBar={<AppBar title="RefreshIndicator Demo" />}
    >
      <RefreshIndicator
        ref={refreshControl}
        onRefresh={onRefresh}
        color="#FFFFFF"
        backgroundColor="#2196F3"
      >
        <SingleChildScrollView>
          <Column padding={16} crossAxisAlignment="center">
            <Text text="Pull down to refresh!" textAlign="center" color="#757575" fontSize={18} />
            <SizedBox height={20} />
            <Text text={`Refresh count: ${count}`} textAlign="center" fontSize={24} fontWeight="bold" />
            <SizedBox height={500} />
            {/* Extra space to make it scrollable */}
            <Text text="Scroll up to see content" textAlign="center" color="#9E9E9E" />
          </Column>
        </SingleChildScrollView>
      </RefreshIndicator>
    </Scaffold>
  );
}
