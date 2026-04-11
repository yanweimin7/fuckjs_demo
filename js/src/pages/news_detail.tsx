import React from "react";
import {
  Column,
  Container,
  Text,
  Padding,
  Row,
  Image,
  SizedBox,
  Button,
  useNavigator,
  SingleChildScrollView,
  InkWell,
} from "fuickjs";

import { Article } from "./news";

export default function NewsDetailPage(props: { article: Article }) {
  const navigator = useNavigator();
  const article = props.article;

  if (!article) {
    return (
      <Container alignment="center">
        <Text text="未找到文章内容" />
        <Button text="返回" onTap={() => navigator.pop()} />
      </Container>
    );
  }

  return (
    <Column crossAxisAlignment="stretch">
      {/* Header */}
      <Container
        height={60}
        decoration={{ color: "#1976D2" }}
        alignment="topLeft"
        padding={{ horizontal: 16, top: 10 }}
      >
        <Row>
          <InkWell onTap={() => navigator.pop()}>
            <Container padding={10}>
              <Text text="<" fontSize={24} color="#FFFFFF" />
            </Container>
          </InkWell>
          <SizedBox width={16} />
          <Container padding={{ top: 8 }}>
            <Text
              text="新闻详情"
              fontSize={20}
              color="#FFFFFF"
              fontWeight="bold"
            />
          </Container>
        </Row>
      </Container>

      <SingleChildScrollView>
        <Column crossAxisAlignment="stretch">
          <Image url={article.image_url} height={250} fit="cover" />

          <Padding padding={16}>
            <Column crossAxisAlignment="start">
              <Text text={article.title} fontSize={22} fontWeight="bold" />
              <SizedBox height={12} />
              <Row mainAxisAlignment="spaceBetween">
                <Text text={article.news_site} fontSize={14} color="#1976D2" />
                <Text
                  text={new Date(article.published_at).toLocaleString()}
                  fontSize={14}
                  color="#999999"
                />
              </Row>
              <SizedBox height={20} />
              <Text text={article.summary} fontSize={16} color="#333333" />
            </Column>
          </Padding>
        </Column>
      </SingleChildScrollView>
    </Column>
  );
}
