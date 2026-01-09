import React from 'react';
import { Column, Container, Text, Padding, Row, Image, SizedBox, Button, Divider, SingleChildScrollView, Navigator } from 'fuick_js_framework';

interface DetailPageProps {
    id: any;
}

export default function DetailPage(props: DetailPageProps) {
    return (
        <SingleChildScrollView>
            <Column crossAxisAlignment="stretch">
                {/* 顶部图片 */}
                <Image
                    url={'https://picsum.photos/800/400?id=' + props.id}
                    height={250}
                    fit="cover"
                />

                {/* 内容区域 */}
                <Padding padding={16}>
                    <Column crossAxisAlignment="start">
                        {/* 标题 */}
                        <Text
                            text="QuickJS Flutter Renderer"
                            fontSize={24}
                            color="#333333"
                        />

                        <SizedBox height={8} />

                        {/* ID 标签 */}
                        <Container
                            padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
                            decoration={{
                                color: '#E3F2FD',
                                borderRadius: 4
                            }}
                        >
                            <Text
                                text={`Resource ID: ${props.id}`}
                                fontSize={12}
                                color="#1976D2"
                            />
                        </Container>

                        <SizedBox height={16} />
                        <Divider color="#EEEEEE" thickness={1} />
                        <SizedBox height={16} />

                        {/* 描述文字 */}
                        <Text
                            text="This page is rendered dynamically from JavaScript using QuickJS and React. The components you see here (Image, Column, Padding, Text, Divider) are all native Flutter widgets driven by the JS side."
                            fontSize={16}
                            color="#666666"
                        />

                        <SizedBox height={24} />

                        {/* 交互按钮 */}
                        <Row mainAxisAlignment="spaceEvenly">
                            <Button
                                text="Like"
                                onTap={() => console.log('Liked ' + props.id)}
                            />
                            <Button
                                text="Share"
                                onTap={() => console.log('Shared ' + props.id)}
                            />
                            <Button
                                text="Back Home"
                                onTap={() => Navigator.pop()}
                            />

                            <Button
                                text="test Future"
                                onTap={() => dartCallNativeAsync('testFuture', ['hello world', '123456']).then((res: any) => console.log('test future res:', res))}
                            />
                        </Row>

                        <SizedBox height={40} />
                    </Column>
                </Padding>
            </Column>
        </SingleChildScrollView>
    );
}
