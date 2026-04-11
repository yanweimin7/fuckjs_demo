import * as React from 'react';
import {
  Scaffold,
  AppBar,
  SingleChildScrollView,
  Column,
  Text,
  Container,
  Padding,
} from 'fuickjs';

const RichText = 'RichText' as any;

const OWL = 'https://flutter.github.io/assets-for-api-docs/assets/widgets/owl.jpg';

export default function RichTextDemo() {
  return (
    <Scaffold appBar={<AppBar title="RichText Demo" />}>
      <SingleChildScrollView>
        <Column padding={16} crossAxisAlignment="start">

          {/* ─── 基础文字样式 ─── */}
          <Text text="基础文字样式" fontSize={15} fontWeight="bold" margin={{ bottom: 8 }} />
          <Container color="#FFFFFF" padding={12} decoration={{ borderRadius: 8 }}>
            <RichText
              text={{
                children: [
                  { text: '普通 · ', style: { color: '#333', fontSize: 16 } },
                  { text: '加粗 · ', style: { fontWeight: 'bold', color: '#E91E63', fontSize: 16 } },
                  { text: '斜体 · ', style: { fontStyle: 'italic', color: '#2196F3', fontSize: 16 } },
                  { text: '下划线', style: { decoration: 'underline', color: '#009688', fontSize: 16 } },
                ],
              }}
            />
          </Container>

          {/* ─── 多段混合 ─── */}
          <Padding padding={{ top: 16, bottom: 8 }}>
            <Text text="多尺寸混合" fontSize={15} fontWeight="bold" />
          </Padding>
          <Container color="#FFFFFF" padding={12} decoration={{ borderRadius: 8 }}>
            <RichText
              text={{
                children: [
                  { text: '小', style: { fontSize: 12, color: '#9E9E9E' } },
                  { text: '中', style: { fontSize: 16, color: '#333' } },
                  { text: '大', style: { fontSize: 24, color: '#1976D2', fontWeight: 'bold' } },
                  { text: '字', style: { fontSize: 36, color: '#E91E63', fontWeight: 'bold' } },
                  { text: '体', style: { fontSize: 20, color: '#43A047' } },
                ],
              }}
            />
          </Container>

          {/* ─── 可点击 span ─── */}
          <Padding padding={{ top: 16, bottom: 8 }}>
            <Text text="可点击 span" fontSize={15} fontWeight="bold" />
          </Padding>
          <Container color="#FFFFFF" padding={12} decoration={{ borderRadius: 8 }}>
            <RichText
              text={{
                children: [
                  { text: '阅读我们的 ', style: { fontSize: 15, color: '#333' } },
                  {
                    text: '用户协议',
                    style: { fontSize: 15, color: '#1976D2', decoration: 'underline' },
                    onTap: () => console.log('用户协议 tapped'),
                  },
                  { text: ' 和 ', style: { fontSize: 15, color: '#333' } },
                  {
                    text: '隐私政策',
                    style: { fontSize: 15, color: '#1976D2', decoration: 'underline' },
                    onTap: () => console.log('隐私政策 tapped'),
                  },
                ],
              }}
            />
          </Container>

          {/* ─── 图文混排（WidgetSpan）─── */}
          <Padding padding={{ top: 16, bottom: 8 }}>
            <Text text="图文混排（WidgetSpan）" fontSize={15} fontWeight="bold" />
          </Padding>
          <Container color="#FFFFFF" padding={12} decoration={{ borderRadius: 8 }}>
            <RichText
              text={{
                children: [
                  { text: '猫头鹰 ', style: { fontSize: 16, color: '#333' } },
                  {
                    type: 'widget',
                    alignment: 'middle',
                    widget: { type: 'Image', props: { src: OWL, width: 40, height: 40, fit: 'cover' }, children: [] },
                  },
                  { text: ' 嵌入行内图片效果', style: { fontSize: 16, color: '#333' } },
                ],
              }}
            />
          </Container>

          {/* ─── 多图文混排 ─── */}
          <Padding padding={{ top: 16, bottom: 8 }}>
            <Text text="图标 + 文字混排" fontSize={15} fontWeight="bold" />
          </Padding>
          <Container color="#FFFFFF" padding={12} decoration={{ borderRadius: 8 }}>
            <RichText
              text={{
                children: [
                  {
                    type: 'widget',
                    alignment: 'middle',
                    widget: { type: 'Icon', props: { icon: 'star', size: 20, color: '#FDD835' }, children: [] },
                  },
                  { text: ' 收藏数 ', style: { fontSize: 15, color: '#333' } },
                  { text: '1,234', style: { fontSize: 15, fontWeight: 'bold', color: '#E91E63' } },
                  { text: '  ', style: { fontSize: 15 } },
                  {
                    type: 'widget',
                    alignment: 'middle',
                    widget: { type: 'Icon', props: { icon: 'thumb_up', size: 20, color: '#42A5F5' }, children: [] },
                  },
                  { text: ' 点赞 ', style: { fontSize: 15, color: '#333' } },
                  { text: '567', style: { fontSize: 15, fontWeight: 'bold', color: '#1976D2' } },
                ],
              }}
            />
          </Container>

          <Container height={40} />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
