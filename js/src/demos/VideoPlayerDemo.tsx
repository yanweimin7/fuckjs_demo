import React, { useRef, useState } from 'react';
import {
  Scaffold,
  AppBar,
  Column,
  Text,
  Container,
  VideoPlayer,
  Button,
  Row,
  SingleChildScrollView,
} from 'fuickjs';

export default function VideoPlayerDemo() {
  const playerRef = useRef<VideoPlayer>(null);
  const [status, setStatus] = useState('Idle');
  const [duration, setDuration] = useState(0);

  const videoUrl =
    'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4';

  return (
    <Scaffold appBar={<AppBar title="VideoPlayer Demo" />}>
      <SingleChildScrollView>
        <Column padding={16}>
          <Text text="Network Video" fontSize={20} fontWeight="bold" margin={{ bottom: 10 }} />

          <Container
            height={240}
            color="black"
            alignment="center"
            margin={{ bottom: 20 }}
          >
            <VideoPlayer
              ref={playerRef}
              url={videoUrl}
              autoPlay={false}
              looping={true}
              showControls={true}
              onInitialized={(info: { duration: number; size: { width: number; height: number } }) => {
                setStatus('Initialized');
                setDuration(info.duration);
                console.log('Video Initialized:', info);
              }}
              onVideoEnd={() => {
                setStatus('Ended');
                console.log('Video Ended');
              }}
              onError={(e: { error: string }) => {
                setStatus(`Error: ${e.error}`);
                console.error('Video Error:', e);
              }}
            />
          </Container>

          <Container padding={10} color="#F5F5F5" margin={{ bottom: 20 }}>
            
              <Text text={`Status: ${status}`} />
              <Text text={`Duration: ${duration}ms`} />
            
          </Container>

          <Text text="Controls" fontSize={18} fontWeight="bold" margin={{ bottom: 10 }} />

          <Row mainAxisAlignment="spaceEvenly" margin={{ bottom: 10 }}>
            <Button
              text="Play"
              onTap={() => {
                playerRef.current?.play();
                setStatus('Playing');
              }}
            />
            <Button
              text="Pause"
              onTap={() => {
                playerRef.current?.pause();
                setStatus('Paused');
              }}
            />
            <Button
              text="Stop"
              onTap={() => {
                playerRef.current?.stop();
                setStatus('Stopped');
              }}
            />
          </Row>

          <Row mainAxisAlignment="spaceEvenly">
            <Button
              text="Seek to 0s"
              onTap={() => playerRef.current?.seekTo(0)}
            />
            <Button
              text="Loop: Toggle"
              onTap={() => {
                // Toggle loop logic would need state tracking
                playerRef.current?.setLooping(false);
              }}
            />
          </Row>
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
