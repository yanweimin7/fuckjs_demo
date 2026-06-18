import React, { useEffect, useState } from "react";
import {
  Scaffold,
  AppBar,
  Column,
  Row,
  Text,
  Button,
  SingleChildScrollView,
  Padding,
  Divider,
  Container,
  useTranslation,
  DeviceInfoService,
} from "fuickjs";

export default function I18nDemo() {
  const { t, locale, setLocale } = useTranslation();
  const [itemCount, setItemCount] = useState(0);
  const [systemLocale, setSystemLocale] = useState<string>("—");

  useEffect(() => {
    DeviceInfoService.getDeviceInfo()
      .then((info) => setSystemLocale(info.locale))
      .catch(() => setSystemLocale("—"));
  }, []);

  const switchTo = (loc: string) => () => setLocale(loc);

  return (
    <Scaffold appBar={<AppBar title={t("demo.title")} />}>
      <SingleChildScrollView>
        <Padding padding={16}>
          <Column crossAxisAlignment="stretch">
            <Text
              text={t("demo.subtitle")}
              fontSize={13}
              color="#888"
              margin={{ bottom: 16 }}
            />

            <InfoCard
              label={t("demo.currentLocale", { locale })}
              hint={`System (DeviceInfo): ${systemLocale}`}
            />

            <Section title={t("demo.nestedTitle")}>
              <Text text={t("demo.nestedSample")} fontSize={16} />
            </Section>

            <Section title={t("demo.interpolationTitle")}>
              <Text
                text={t("demo.greeting", {
                  name: locale.startsWith("zh") ? "小明" : "Alex",
                })}
                fontSize={16}
                fontWeight="w500"
              />
            </Section>

            <Section title={t("demo.pluralTitle")}>
              <Text
                text={t(
                  "demo.cart.items",
                  { count: itemCount },
                  { count: itemCount },
                )}
                fontSize={16}
                margin={{ bottom: 12 }}
              />
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text={t("demo.removeItem")}
                  onTap={() => setItemCount((c) => Math.max(0, c - 1))}
                />
                <Button
                  text={t("demo.addItem")}
                  onTap={() => setItemCount((c) => c + 1)}
                />
              </Row>
            </Section>

            <Section title={t("demo.switchTitle")}>
              <Row mainAxisAlignment="spaceAround">
                <Button
                  text={t("demo.switchEn")}
                  onTap={switchTo("en")}
                  backgroundColor={locale === "en" ? "#1976D2" : undefined}
                />
                <Button
                  text={t("demo.switchZh")}
                  onTap={switchTo("zh-CN")}
                  backgroundColor={locale === "zh-cn" ? "#1976D2" : undefined}
                />
              </Row>
              <Text
                text={t("demo.persistHint")}
                fontSize={12}
                color="#999"
                margin={{ top: 12 }}
              />
            </Section>
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

function InfoCard({ label, hint }: { label: string; hint: string }) {
  return (
    <Container
      margin={{ bottom: 20 }}
      padding={12}
      decoration={{
        color: "#E3F2FD",
        borderRadius: 8,
        border: { width: 1, color: "#90CAF9" },
      }}
    >
      <Column crossAxisAlignment="start">
        <Text text={label} fontSize={15} fontWeight="w600" />
        <Text text={hint} fontSize={12} color="#666" margin={{ top: 6 }} />
      </Column>
    </Container>
  );
}
