import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  Image,
  Container,
  SingleChildScrollView,
  Padding,
  Divider,
  Wrap,
} from "fuickjs";
import { Media } from "@fuickjs-community/media";

export default function MediaDemo() {
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<{ path: string; size: number } | null>(
    null,
  );
  const [log, setLog] = useState("");

  const addLog = (msg: string) =>
    setLog(`[${new Date().toLocaleTimeString()}] ${msg}`);

  const pickImages = async (count: number) => {
    const result = await Media.chooseImage(count, ["album", "camera"]);
    if (result) {
      setImages(result.tempFilePaths);
      addLog(`picked ${result.tempFilePaths.length} image(s)`);
    } else {
      addLog("cancelled");
    }
  };

  const pickVideo = async () => {
    const result = await Media.chooseVideo(["album", "camera"]);
    if (result) {
      setVideo({ path: result.tempFilePath, size: result.size });
      addLog(`video: ${(result.size / 1024).toFixed(1)} KB`);
    } else {
      addLog("cancelled");
    }
  };

  return (
    <Scaffold appBar={<AppBar title="Media Demo" />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column>
            <Text
              text="媒体选择 (Media)"
              fontSize={18}
              fontWeight="bold"
              margin={{ bottom: 4 }}
            />
            <Text
              text="选取图片 / 视频，支持相册和相机。需要相关权限。"
              fontSize={13}
              color="#888"
              margin={{ bottom: 20 }}
            />

            <Section title="选择图片">
              <Row mainAxisAlignment="spaceAround">
                <Button text="单选" onTap={() => pickImages(1)} />
                <Button text="多选 (最多3)" onTap={() => pickImages(3)} />
                <Button
                  text="预览"
                  onTap={() => {
                    if (images.length === 0) {
                      addLog("先选择图片");
                      return;
                    }
                    Media.previewImage(images, 0);
                  }}
                />
              </Row>

              {images.length > 0 && (
                <Wrap spacing={8} runSpacing={8} margin={{ top: 12 }}>
                  {images.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      width={100}
                      height={100}
                      fit="cover"
                    />
                  ))}
                </Wrap>
              )}
            </Section>

            <Section title="选择视频">
              <Button text="选择视频" onTap={pickVideo} />
              {video && (
                <Container
                  margin={{ top: 12 }}
                  padding={10}
                  decoration={{ color: "#f5f5f5", borderRadius: 6 }}
                >
                  <Text
                    text={`路径: ${video.path}`}
                    fontSize={11}
                    color="#555"
                    maxLines={2}
                  />
                  <Text
                    text={`大小: ${(video.size / 1024).toFixed(1)} KB`}
                    fontSize={11}
                    color="#555"
                    margin={{ top: 4 }}
                  />
                </Container>
              )}
            </Section>

            {log ? (
              <Container
                padding={10}
                decoration={{ color: "#f0f0f0", borderRadius: 6 }}
              >
                <Text text={log} fontSize={12} color="#444" />
              </Container>
            ) : null}
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Column crossAxisAlignment="start" margin={{ bottom: 24 }}>
      <Text text={title} fontSize={14} color="#555" margin={{ bottom: 10 }} />
      <Divider margin={{ bottom: 10 }} />
      {children}
    </Column>
  );
}
