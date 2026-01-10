import React, { useState, useEffect } from 'react';
import { Column, Container, Text, Row, SizedBox, Button, Padding, Switch, TextField, Expanded } from 'fuick_js_framework';

function Clock({ enabled }: { enabled: boolean }) {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            if (enabled) {
                setTime(new Date().toLocaleTimeString());
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [enabled]);

    console.log(`[Clock] Rendered, enabled=${enabled}`);
    return (
        <Container padding={12} decoration={{ color: enabled ? '#E8F5E9' : '#EEEEEE', borderRadius: 8 }}>
            <Text text={`当前时间: ${time} (${enabled ? '运行中' : '已暂停'})`} fontSize={18} />
        </Container>
    );
}

export default function PartialRefreshTest() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState('Initial');
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        console.log('[PartialRefreshTest] Mounted');
        return () => console.log('[PartialRefreshTest] Unmounted');
    }, []);

    console.log(`[PartialRefreshTest] Rendered, count=${count}`);

    return (
        <Column crossAxisAlignment="stretch">
            <Container
                height={60}
                decoration={{ color: '#4CAF50' }}
                alignment="center"
            >
                <Text text="局部刷新测试" fontSize={20} color="#554b4bff" />
            </Container>

            <Padding padding={16}>
                <Column crossAxisAlignment="start">
                    <Text text="1. 计数器测试 (仅数字部分局部刷新)" fontSize={16} fontWeight="bold" />
                    <Row>
                        <Text text="当前数值: " fontSize={16} />
                        <Container padding={4} decoration={{ color: '#E8F5E9', borderRadius: 4 }}>
                            <Text text={`${count}`} fontSize={24} color="#2E7D32" />
                        </Container>
                    </Row>
                    <Row>
                        <Button text="增加" onTap={() => setCount(prev => prev + 1)} />
                        <SizedBox width={8} />
                        <Button text="减少" onTap={() => setCount(prev => prev - 1)} />
                    </Row>

                    <SizedBox height={24} />
                    <Text text="2. 输入框 & 开关测试" fontSize={16} fontWeight="bold" />
                    <Row>
                        <Expanded>
                            <TextField
                                hintText="输入测试实时同步"
                                onChanged={(v: string) => setText(v)}
                            />
                        </Expanded>
                    </Row>
                    <Row>
                        <Text text={`实时同步: ${text}`} />
                    </Row>
                    <Row>
                        <Switch
                            value={isOn}
                            onChanged={(v: boolean) => setIsOn(v)}
                        />
                        <Text text={`状态: ${isOn ? '开启' : '关闭'}`} />
                    </Row>

                    <SizedBox height={24} />
                    <Text text="3. 自动更新测试 (每秒局部更新时钟)" fontSize={16} fontWeight="bold" />
                    <Clock enabled={isOn} />

                    <SizedBox height={32} />
                    <Text
                        text="提示: 观察控制台日志。如果实现了局部刷新，时钟每秒更新时，你应该只看到 [Clock] Rendered 日志，而看不到 [PartialRefreshTest] Rendered 日志。"
                        fontSize={12}
                        color="#666666"
                    />
                </Column>
            </Padding>
        </Column>
    );
}
