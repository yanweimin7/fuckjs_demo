import React from 'react';
import { Column, Container, Text, ListView, Padding, Row, Image, SizedBox, Button, Navigator, useVisible, useInvisible } from 'fuick_js_framework';

export default function HomePage() {
    useVisible(() => {
        // HomePage is visible
    });

    useInvisible(() => {
        // HomePage is invisible
    });

    const items = [1, 2, 3, 4, 5];

    return (
        <Column crossAxisAlignment="stretch">
            {/* 顶部横幅 */}
            <Container
                height={100}
                decoration={{ color: '#2196F3' }}
                alignment="center"
            >
                <Column>
                    <Text
                        text="QuickJS Explorer"
                        fontSize={24}
                        color="#FFFFFF"
                    />
                    <SizedBox height={8} />
                    <SizedBox height={50}>
                        <ListView orientation="horizontal" shrinkWrap={true}>
                            <Button
                                text="组件示例"
                                onTap={() => Navigator.push('/examples', {})}
                            />
                            <SizedBox width={10} />
                            <Button
                                text="复杂页面"
                                onTap={() => Navigator.push('/complex', {})}
                            />
                            <SizedBox width={10} />
                            <Button
                                text="局部刷新"
                                onTap={() => Navigator.push('/partial_refresh', {})}
                            />
                            <SizedBox width={10} />
                            <Button
                                text="钱包"
                                onTap={() => Navigator.push('/wallet', {})}
                            />
                            <SizedBox width={10} />
                            <Button
                                text="增量列表"
                                onTap={() => Navigator.push('/incremental_list', {})}
                            />
                        </ListView>
                    </SizedBox>
                </Column>
            </Container>

            {/* 列表 */}
            <ListView padding={16}>
                {items.map(id => (
                    <Padding key={id} padding={{ bottom: 12 }}>
                        <Container
                            padding={12}
                            decoration={{
                                color: '#F5F5F5',
                                borderRadius: 8,
                            }}
                        >
                            <Row mainAxisAlignment="spaceBetween">
                                <Row>
                                    <Image
                                        url={`https://picsum.photos/100/100?id=${id}`}
                                        width={50}
                                        height={50}
                                        fit="cover"
                                    />
                                    <SizedBox width={12} />
                                    <Text
                                        text={`Item #${id}`}
                                        fontSize={18}
                                    />
                                </Row>
                                <Button
                                    text="View"
                                    onTap={() => Navigator.push('/detail', { id })}
                                />
                            </Row>
                        </Container>
                    </Padding>
                ))}
            </ListView>
        </Column>
    );
}
