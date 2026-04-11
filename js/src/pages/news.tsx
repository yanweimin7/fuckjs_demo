import React, { useState, useEffect } from "react";
import {
  Column,
  Container,
  Text,
  ListView,
  Padding,
  Row,
  Image,
  SizedBox,
  useNavigator,
  CircularProgressIndicator,
  InkWell,
  Expanded,
  Scaffold,
  AppBar,
  Icon,
  fetch,
  DefaultTabController,
  TabBar,
  TabBarView,
  Tab,
  KeepAlive,
} from "fuickjs";
import { useGlobalValue } from "../store/global";

export interface Article {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  news_site: string;
  published_at: string;
}

const CATEGORIES = [
  { id: "articles", name: "新闻", icon: "newspaper" },
  { id: "blogs", name: "博客", icon: "book" },
  { id: "reports", name: "报告", icon: "assignment" },
  { id: "favorites", name: "收藏", icon: "favorite" },
];

function NewsList({ category }: { category: string }) {
  const navigator = useNavigator();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    if (category === "favorites") {
      setArticles([]); // TODO: Load from storage
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spaceflightnewsapi.net/v4/${category}/?limit=10`,
      );
      const data = await response.json();
      setArticles(data.results || []);
    } catch (e) {
      console.error("Fetch news error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && articles.length === 0) {
    return (
      <Container alignment="center" padding={20}>
        <CircularProgressIndicator />
      </Container>
    );
  }

  return (
    <KeepAlive>
      <ListView padding={12}>
        {articles.map((article) => (
          <Padding key={article.id} padding={{ bottom: 12 }}>
            <InkWell onTap={() => navigator.push("/news_detail", { article })}>
              <Container
                padding={12}
                decoration={{
                  color: "#FFFFFF",
                  borderRadius: 8,
                  boxShadow: {
                    color: "#0000001A",
                    blurRadius: 4,
                    offset: { dx: 0, dy: 2 },
                  },
                }}
              >
                <Row crossAxisAlignment="start">
                  <Image
                    url={article.image_url}
                    width={100}
                    height={80}
                    fit="cover"
                    borderRadius={4}
                  />
                  <SizedBox width={12} />
                  <Expanded>
                    <Column crossAxisAlignment="start">
                      <Text
                        text={article.title}
                        fontSize={16}
                        fontWeight="bold"
                        maxLines={2}
                      />
                      <SizedBox height={4} />
                      <Text
                        text={article.summary}
                        fontSize={12}
                        color="#666666"
                        maxLines={2}
                      />
                      <SizedBox height={8} />
                      <Row mainAxisAlignment="spaceBetween">
                        <Text
                          text={article.news_site}
                          fontSize={10}
                          color="#1976D2"
                        />
                        <Text
                          text={new Date(
                            article.published_at,
                          ).toLocaleDateString()}
                          fontSize={10}
                          color="#999999"
                        />
                      </Row>
                    </Column>
                  </Expanded>
                </Row>
              </Container>
            </InkWell>
          </Padding>
        ))}
      </ListView>
    </KeepAlive>
  );
}

export default function NewsPage() {
  const { value, setValue } = useGlobalValue();
  return (
    <DefaultTabController length={CATEGORIES.length} initialIndex={0}>
      <Scaffold
        backgroundColor="#F5F5F5"
        appBar={
          <AppBar
            title="航天新闻"
            backgroundColor="#FFFFFF"
            foregroundColor="#333333"
            elevation={0.5}
          />
        }
      >
        <Column>
          <InkWell
            onTap={() =>
              setValue(`Updated from News: ${Math.floor(Math.random() * 100)}`)
            }
          >
            <Container padding={10} color="#E0F7FA" alignment="center">
              <Text text={`Global Value: ${value}`} color="#006064" />
            </Container>
          </InkWell>
          <TabBar
            tabs={CATEGORIES.map((cat) => (
              <Tab
                key={cat.id}
                text={cat.name}
                icon={<Icon name={cat.icon} size={20} />}
              />
            ))}
            isScrollable={false}
            indicatorColor="#2196F3"
            indicatorWeight={3}
            labelColor="#2196F3"
            unselectedLabelColor="#757575"
          />
          <Expanded>
            <TabBarView>
              {CATEGORIES.map((cat) => (
                <NewsList key={cat.id} category={cat.id} />
              ))}
            </TabBarView>
          </Expanded>
        </Column>
      </Scaffold>
    </DefaultTabController>
  );
}
