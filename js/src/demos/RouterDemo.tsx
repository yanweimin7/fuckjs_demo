import React, { useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Container,
  SizedBox,
  Padding,
  SingleChildScrollView,
  Divider,
  Button,
  Center,
  Wrap,
  useNavigator,
  useRoute,
} from "fuickjs";

// 演示用：模块级登录状态（守卫会读取此对象）
export const authState = { loggedIn: false };

export default function RouterDemo() {
  const nav = useNavigator();
  const route = useRoute();
  const [, force] = useState(0);

  return (
    <Scaffold appBar={<AppBar title={<Text text="Router Demo" />} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="start">
            {/* 当前路由信息 */}
            <Text
              text="当前路由信息 (useRoute)"
              fontSize={16}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Container
              padding={12}
              decoration={{ color: "#F5F5F5", borderRadius: 8 }}
            >
              <Column crossAxisAlignment="start">
                <Text
                  text={`path: ${route?.path ?? "-"}`}
                  fontSize={13}
                  color="#666"
                />
                <Text
                  text={`name: ${route?.name ?? "-"}`}
                  fontSize={13}
                  color="#666"
                />
                <Text
                  text={`params: ${JSON.stringify(route?.params ?? {})}`}
                  fontSize={13}
                  color="#666"
                />
                <Text
                  text={`meta: ${JSON.stringify(route?.meta ?? {})}`}
                  fontSize={13}
                  color="#666"
                />
              </Column>
            </Container>

            <SizedBox height={20} />

            {/* 登录状态 */}
            <Text text="守卫演示：登录状态" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Row>
              <Text text={`已登录: ${authState.loggedIn}`} />
              <Padding padding={{ left: 12 }}>
                <Button
                  text={authState.loggedIn ? "登出" : "登录"}
                  backgroundColor={authState.loggedIn ? "#E53935" : "#43A047"}
                  onTap={() => {
                    authState.loggedIn = !authState.loggedIn;
                    force((n) => n + 1);
                  }}
                />
              </Padding>
            </Row>

            <SizedBox height={20} />
            <Divider />
            <SizedBox height={20} />

            {/* 路径参数 */}
            <Text
              text="1. 路径参数 /demo/router/user/:id"
              fontSize={16}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text="路径中的 :id 会被解析到 params.id"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Wrap spacing={8}>
              <Button
                text="user/123"
                onTap={() => nav.push("/demo/router/user/123")}
              />
              <Button
                text="user/456"
                onTap={() => nav.push("/demo/router/user/456")}
              />
            </Wrap>

            <SizedBox height={20} />

            {/* 命名路由 */}
            <Text
              text="2. 命名路由 pushByName"
              fontSize={16}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text="通过 name 跳转，自动构造路径"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Button
              text="pushByName('user', { id: 789 })"
              backgroundColor="#1976D2"
              onTap={() => nav.pushByName("user", { id: 789 })}
            />

            <SizedBox height={20} />

            {/* 守卫保护 */}
            <Text
              text="3. 守卫保护页面 (meta.requiresAuth)"
              fontSize={16}
              fontWeight="bold"
            />
            <SizedBox height={8} />
            <Text
              text="未登录时跳转会被守卫拒绝，显示 Access Denied；登录后放行"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Button
              text="访问受保护页面"
              backgroundColor="#FF9800"
              onTap={() => nav.push("/demo/router/protected")}
            />

            <SizedBox height={20} />

            {/* 重定向 */}
            <Text text="4. 重定向 redirect" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="/demo/router/old 配置了 redirect: /demo/router"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Button
              text="访问 /demo/router/old"
              backgroundColor="#795548"
              onTap={() => nav.push("/demo/router/old")}
            />

            <SizedBox height={20} />

            {/* 404 */}
            <Text text="5. 404 兜底" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="未匹配任何路由时显示默认 404 UI"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Button
              text="访问不存在的页面"
              backgroundColor="#9E9E9E"
              onTap={() => nav.push("/demo/router/not-exist-xxx")}
            />

            <SizedBox height={20} />

            {/* push 等待返回结果 */}
            <Text text="6. push 等待返回结果" fontSize={16} fontWeight="bold" />
            <SizedBox height={8} />
            <Text
              text="跳转后在子页面 pop(result)，父页面 await 拿到 result"
              fontSize={12}
              color="#666"
            />
            <SizedBox height={8} />
            <Button
              text="跳转 user/123 并等待返回"
              backgroundColor="#9C27B0"
              onTap={async () => {
                const result = await nav.push("/demo/router/user/123", {
                  from: "push",
                });
                nav.showDialog(
                  <Container padding={20}>
                    <Column crossAxisAlignment="start">
                      <Text text="收到返回结果:" fontWeight="bold" />
                      <Text
                        text={JSON.stringify(result)}
                        fontSize={13}
                        color="#666"
                      />
                    </Column>
                  </Container>,
                );
              }}
            />
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

/** 路径参数演示页：/demo/router/user/:id */
export function RouterUserPage() {
  const route = useRoute();
  const nav = useNavigator();
  const id = route?.params?.id as string | number;

  return (
    <Scaffold appBar={<AppBar title={<Text text={`User ${id}`} />} />}>
      <Center>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Text text={`User ID: ${id}`} fontSize={24} fontWeight="bold" />
          <SizedBox height={8} />
          <Text
            text={`params: ${JSON.stringify(route?.params)}`}
            fontSize={12}
            color="#666"
          />
          <SizedBox height={20} />
          <Button
            text="返回并传结果"
            backgroundColor="#9C27B0"
            onTap={() => nav.pop({ userId: id, timestamp: Date.now() })}
          />
        </Column>
      </Center>
    </Scaffold>
  );
}

/** 受保护页面：meta.requiresAuth = true，未登录被守卫拦截 */
export function RouterProtectedPage() {
  return (
    <Scaffold appBar={<AppBar title={<Text text="Protected" />} />}>
      <Center>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Text
            text="受保护页面"
            fontSize={24}
            fontWeight="bold"
            color="#43A047"
          />
          <SizedBox height={8} />
          <Text text="只有登录后才能访问此页面" fontSize={14} color="#666" />
        </Column>
      </Center>
    </Scaffold>
  );
}
