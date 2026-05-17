import React, { useEffect, useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Container,
  Column,
  Row,
  Center,
  SizedBox,
  Divider,
  GridView,
  ListView,
  PageView,
  Stack,
  Positioned,
  Image,
  Button,
  Switch,
  TextField,
  Slider,
  CircularProgressIndicator,
  LazyView,
  Opacity,
  ClipRRect,
  Wrap,
  Icon,
  SingleChildScrollView,
  DefaultTabController,
  TabBar,
  Tab,
  TabBarView,
  AnimatedContainer,
  AnimatedOpacity,
  AnimatedScale,
  InkWell,
  ListTile,
  Flex,
  Flexible,
  FractionallySizedBox,
  AspectRatio,
  useRouteTransitionComplete,
} from "fuickjs";

const Transform = "Transform" as any;

const COLORS = [
  "#E3F2FD",
  "#F3E5F5",
  "#FFF3E0",
  "#E8F5E9",
  "#FFEBEE",
  "#E0F7FA",
  "#FCE4EC",
  "#F1F8E9",
  "#FFF8E1",
  "#EDE7F6",
  "#E8EAF6",
  "#E1F5FE",
  "#FBE9E7",
  "#F9FBE7",
  "#E0F2F1",
];

const ICONS = [
  "home",
  "star",
  "favorite",
  "person",
  "settings",
  "search",
  "notifications",
  "shopping_cart",
  "cloud",
  "camera",
  "music_note",
  "location_on",
  "phone",
  "email",
  "bookmark",
];

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Container
      padding={{ left: 16, top: 20, right: 16, bottom: 8 }}
      color="#FAFAFA"
    >
      <Text text={title} fontSize={20} fontWeight="bold" color="#212121" />
      {subtitle && (
        <Text
          text={subtitle}
          fontSize={13}
          color="#757575"
          margin={{ top: 4 }}
        />
      )}
    </Container>
  );
}

function CardItem({ index }: { index: number }) {
  const color = COLORS[index % COLORS.length];
  const icon = ICONS[index % ICONS.length];
  return (
    <Container
      margin={{ left: 8, right: 8, bottom: 8 }}
      padding={12}
      decoration={{
        color: "white",
        borderRadius: 12,
        boxShadow: {
          color: "#00000012",
          blurRadius: 8,
          offset: { dx: 0, dy: 2 },
        },
      }}
    >
      <Row>
        <Container
          width={48}
          height={48}
          decoration={{ color: color, borderRadius: 24 }}
          alignment="center"
        >
          <Icon name={icon} color="#424242" size={24} />
        </Container>
        <SizedBox width={12} />
        <Flexible flex={1}>
          <Column crossAxisAlignment="start">
            <Text text={`Card Item ${index}`} fontSize={16} fontWeight="bold" />
            <Text
              text={`Description text for card item ${index}`}
              fontSize={13}
              color="#757575"
            />
          </Column>
        </Flexible>
        <Icon name="chevron_right" color="#BDBDBD" size={20} />
      </Row>
    </Container>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Container
      padding={16}
      margin={{ left: 4, right: 4 }}
      decoration={{
        color: color,
        borderRadius: 12,
      }}
    >
      <Center>
        <Column crossAxisAlignment="center">
          <Text text={value} fontSize={24} fontWeight="bold" color="white" />
          <SizedBox height={4} />
          <Text text={label} fontSize={12} color="rgba(255,255,255,0.85)" />
        </Column>
      </Center>
    </Container>
  );
}

function AvatarRow({ count }: { count: number }) {
  const avatarWidth = 36;
  const overlap = 8;
  const totalWidth =
    avatarWidth + (count - 1) * (avatarWidth - overlap) + avatarWidth + overlap;

  return (
    <Container width={totalWidth} height={36}>
      <Stack>
        {Array.from({ length: count }, (_, i) => (
          <Positioned key={i} left={i * (avatarWidth - overlap)} top={0}>
            <Container
              width={avatarWidth}
              height={avatarWidth}
              decoration={{
                color: COLORS[i % COLORS.length],
                borderRadius: 18,
                border: { color: "white", width: 2 },
              }}
              alignment="center"
            >
              <Text
                text={String(i + 1)}
                fontSize={12}
                color="white"
                fontWeight="bold"
              />
            </Container>
          </Positioned>
        ))}
        <Positioned left={count * (avatarWidth - overlap)} top={0}>
          <Container
            width={avatarWidth}
            height={avatarWidth}
            decoration={{
              color: "#EEEEEE",
              borderRadius: 18,
              border: { color: "white", width: 2 },
            }}
            alignment="center"
          >
            <Text text="+9" fontSize={10} color="#757575" />
          </Container>
        </Positioned>
      </Stack>
    </Container>
  );
}

function TagChip({ text, color }: { text: string; color: string }) {
  return (
    <Container
      padding={{ left: 12, top: 6, right: 12, bottom: 6 }}
      decoration={{
        color: color,
        borderRadius: 16,
      }}
    >
      <Text text={text} fontSize={12} color="#424242" />
    </Container>
  );
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <Container height={8} decoration={{ color: "#E0E0E0", borderRadius: 4 }}>
      <Container
        width={progress * 100}
        height={8}
        decoration={{ color: color, borderRadius: 4 }}
      />
    </Container>
  );
}

export default function PerformanceDemo() {
  const [switchVal1, setSwitchVal1] = useState(false);
  const [switchVal2, setSwitchVal2] = useState(true);
  const [switchVal3, setSwitchVal3] = useState(false);
  const [sliderVal, setSliderVal] = useState(50);
  const [animToggle, setAnimToggle] = useState(false);

  const [isReady, setIsReady] = useState(false);

  useRouteTransitionComplete((result) => {
    console.log(`路由动画完成: pageId=${result.pageId}, path=${result.path}`);
    setIsReady(true);
  });

  return (
    <Scaffold appBar={<AppBar title="Performance Stress Test" />}>
      <SingleChildScrollView>
        <Column>
          {/* ===== Section 1: Hero Banner ===== */}
          <Container height={200} padding={20} color="#1565C0">
            <Column mainAxisAlignment="center" crossAxisAlignment="start">
              <Text
                text="Performance Stress Test"
                fontSize={28}
                fontWeight="bold"
                color="white"
              />
              <SizedBox height={8} />
              <Text
                text="A very complex page with many widgets to verify rendering performance"
                fontSize={14}
                color="rgba(255,255,255,0.85)"
              />
              <SizedBox height={16} />
              <Row>
                <Container
                  padding={{ left: 16, top: 8, right: 16, bottom: 8 }}
                  decoration={{
                    color: "rgba(255,255,255,0.25)",
                    borderRadius: 20,
                  }}
                >
                  <Text
                    text="Explore"
                    fontSize={14}
                    fontWeight="bold"
                    color="white"
                  />
                </Container>
                <SizedBox width={12} />
                <Container
                  padding={{ left: 16, top: 8, right: 16, bottom: 8 }}
                  decoration={{
                    color: "rgba(255,255,255,0.15)",
                    borderRadius: 20,
                    border: { color: "rgba(255,255,255,0.5)", width: 1 },
                  }}
                >
                  <Text text="Learn More" fontSize={14} color="white" />
                </Container>
              </Row>
            </Column>
          </Container>

          {/* ===== Section 2: Stats Row ===== */}
          <SectionHeader
            title="Statistics"
            subtitle="Key metrics at a glance"
          />
          <Container padding={{ left: 12, right: 12, bottom: 12 }}>
            <Row>
              <Flexible flex={1}>
                <StatCard label="Users" value="12.5K" color="#1E88E5" />
              </Flexible>
              <Flexible flex={1}>
                <StatCard label="Revenue" value="$48K" color="#43A047" />
              </Flexible>
              <Flexible flex={1}>
                <StatCard label="Orders" value="3.2K" color="#FB8C00" />
              </Flexible>
            </Row>
          </Container>

          {/* ===== Section 3: Quick Actions Grid ===== */}
          <SectionHeader
            title="Quick Actions"
            subtitle="8 action buttons in a grid"
          />
          <Container padding={{ left: 16, right: 16, bottom: 12 }}>
            <Wrap spacing={12} runSpacing={12}>
              {Array.from({ length: 8 }, (_, i) => (
                <Container
                  key={i}
                  width={76}
                  height={76}
                  decoration={{
                    color: COLORS[i % COLORS.length],
                    borderRadius: 16,
                  }}
                  alignment="center"
                >
                  <Column
                    crossAxisAlignment="center"
                    mainAxisAlignment="center"
                  >
                    <Icon
                      name={ICONS[i % ICONS.length]}
                      color="#424242"
                      size={28}
                    />
                    <SizedBox height={4} />
                    <Text
                      text={`Action ${i + 1}`}
                      fontSize={11}
                      color="#616161"
                    />
                  </Column>
                </Container>
              ))}
            </Wrap>
          </Container>

          <Divider height={1} color="#EEEEEE" />

          {/* ===== Section 4: GridView ===== */}
          <SectionHeader
            title="GridView (3 columns, 30 items)"
            subtitle="Grid layout with colored cards"
          />
          <Container height={400} padding={{ left: 12, right: 12, bottom: 12 }}>
            <GridView
              crossAxisCount={3}
              mainAxisSpacing={8}
              crossAxisSpacing={8}
              itemCount={30}
              itemBuilder={(index) => (
                <Container
                  decoration={{
                    color: COLORS[index % COLORS.length],
                    borderRadius: 12,
                    boxShadow: {
                      color: "#00000008",
                      blurRadius: 4,
                      offset: { dx: 0, dy: 1 },
                    },
                  }}
                  padding={8}
                >
                  <Column crossAxisAlignment="start">
                    <Icon
                      name={ICONS[index % ICONS.length]}
                      color="#616161"
                      size={20}
                    />
                    <SizedBox height={6} />
                    <Text
                      text={`Grid ${index + 1}`}
                      fontSize={13}
                      fontWeight="bold"
                    />
                    <Text
                      text={`Subtitle ${index + 1}`}
                      fontSize={10}
                      color="#9E9E9E"
                    />
                  </Column>
                </Container>
              )}
            />
          </Container>

          <Divider height={1} color="#EEEEEE" />

          {/* ===== Section 5: PageView ===== */}
          <LazyView
            load={isReady}
            builder={() => (
              <Column>
                <SectionHeader
                  title="PageView (5 swipeable pages)"
                  subtitle="Horizontal swipe between pages"
                />

                <Container
                  height={180}
                  padding={{ left: 12, right: 12, bottom: 12 }}
                >
                  <PageView>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Container
                        key={i}
                        margin={{ left: 4, right: 4 }}
                        decoration={{
                          color: COLORS[(i * 3) % COLORS.length],
                          borderRadius: 16,
                        }}
                        padding={20}
                      >
                        <Column
                          mainAxisAlignment="center"
                          crossAxisAlignment="start"
                        >
                          <Text
                            text={`Page ${i + 1}`}
                            fontSize={24}
                            fontWeight="bold"
                            color="#424242"
                          />
                          <SizedBox height={8} />
                          <Text
                            text={`Swipe to see page ${i + 2 <= 5 ? i + 2 : 1}`}
                            fontSize={14}
                            color="#757575"
                          />
                          <SizedBox height={12} />
                          <Row>
                            {Array.from({ length: 3 }, (_, j) => (
                              <Container
                                key={j}
                                width={40}
                                height={40}
                                margin={{ right: 8 }}
                                decoration={{
                                  color: "rgba(255,255,255,0.6)",
                                  borderRadius: 8,
                                }}
                                alignment="center"
                              >
                                <Icon
                                  name={ICONS[(i + j) % ICONS.length]}
                                  size={20}
                                />
                              </Container>
                            ))}
                          </Row>
                        </Column>
                      </Container>
                    ))}
                  </PageView>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 6: ListView ===== */}
                <SectionHeader
                  title="ListView (20 list tiles)"
                  subtitle="Scrollable list with icons"
                />

                <Container
                  height={400}
                  padding={{ left: 8, right: 8, bottom: 8 }}
                >
                  <ListView
                    itemCount={20}
                    itemBuilder={(index) => (
                      <ListTile
                        leading={
                          <Container
                            width={44}
                            height={44}
                            decoration={{
                              color: COLORS[index % COLORS.length],
                              borderRadius: 22,
                            }}
                            alignment="center"
                          >
                            <Icon
                              name={ICONS[index % ICONS.length]}
                              color="#424242"
                              size={22}
                            />
                          </Container>
                        }
                        title={
                          <Text
                            text={`List Item ${index + 1}`}
                            fontSize={15}
                            fontWeight="bold"
                          />
                        }
                        subtitle={
                          <Text
                            text={`Secondary text for item ${index + 1}`}
                            fontSize={13}
                            color="#757575"
                          />
                        }
                        trailing={
                          <Icon
                            name="chevron_right"
                            color="#BDBDBD"
                            size={20}
                          />
                        }
                        onTap={() => console.log(`Tapped ${index}`)}
                      />
                    )}
                  />
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 7: Card List ===== */}
                <SectionHeader
                  title="Card List (15 cards)"
                  subtitle="Cards with avatars and descriptions"
                />

                {Array.from({ length: 15 }, (_, i) => (
                  <CardItem key={i} index={i} />
                ))}

                <Divider height={1} color="#806565ff" />

                {/* ===== Section 8: Stack Demo ===== */}
                <SectionHeader
                  title="Stack & Positioned"
                  subtitle="Overlapping elements"
                />

                <Container
                  height={200}
                  padding={{ left: 16, right: 16, bottom: 12 }}
                >
                  <Stack>
                    <Container
                      width={350}
                      height={200}
                      decoration={{
                        color: "#E8EAF6",
                        borderRadius: 16,
                      }}
                    />
                    <Positioned top={20} left={20}>
                      <Container
                        width={80}
                        height={80}
                        decoration={{ color: "#3F51B5", borderRadius: 40 }}
                        alignment="center"
                      >
                        <Icon name="person" color="white" size={36} />
                      </Container>
                    </Positioned>
                    <Positioned top={30} left={120}>
                      <Text
                        text="Stack Demo"
                        fontSize={22}
                        fontWeight="bold"
                        color="#1A237E"
                      />
                    </Positioned>
                    <Positioned top={60} left={120}>
                      <Text
                        text="Overlapping elements positioned absolutely"
                        fontSize={13}
                        color="#5C6BC0"
                      />
                    </Positioned>
                    <Positioned bottom={20} right={20}>
                      <Container
                        padding={{ left: 16, top: 8, right: 16, bottom: 8 }}
                        decoration={{
                          color: "#3F51B5",
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          text="Follow"
                          fontSize={13}
                          color="white"
                          fontWeight="bold"
                        />
                      </Container>
                    </Positioned>
                  </Stack>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 9: Avatar Group ===== */}
                <SectionHeader
                  title="Avatar Groups"
                  subtitle="Overlapping avatar rows"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Team Alpha" fontSize={15} fontWeight="bold" />
                      <Text text="10 members" fontSize={13} color="#9E9E9E" />
                    </Row>
                    <SizedBox height={8} />
                    <AvatarRow count={8} />
                    <SizedBox height={16} />
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Team Beta" fontSize={15} fontWeight="bold" />
                      <Text text="8 members" fontSize={13} color="#9E9E9E" />
                    </Row>
                    <SizedBox height={8} />
                    <AvatarRow count={6} />
                    <SizedBox height={16} />
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Team Gamma" fontSize={15} fontWeight="bold" />
                      <Text text="12 members" fontSize={13} color="#9E9E9E" />
                    </Row>
                    <SizedBox height={8} />
                    <AvatarRow count={10} />
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 10: Tags ===== */}
                <SectionHeader
                  title="Tags & Chips"
                  subtitle="Wrap layout with many tags"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Wrap spacing={8} runSpacing={8}>
                    {Array.from({ length: 20 }, (_, i) => (
                      <TagChip
                        key={i}
                        text={`Tag ${i + 1}`}
                        color={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Wrap>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 11: Progress Bars ===== */}
                <SectionHeader
                  title="Progress Bars"
                  subtitle="Multiple progress indicators"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    {[
                      { label: "Storage", progress: 0.72, color: "#1E88E5" },
                      { label: "Memory", progress: 0.45, color: "#43A047" },
                      { label: "CPU", progress: 0.88, color: "#E53935" },
                      { label: "Network", progress: 0.33, color: "#FB8C00" },
                      { label: "Battery", progress: 0.61, color: "#8E24AA" },
                      { label: "Disk I/O", progress: 0.55, color: "#00897B" },
                      { label: "GPU", progress: 0.92, color: "#D81B60" },
                      { label: "Cache", progress: 0.28, color: "#5E35B1" },
                    ].map((item, i) => (
                      <Container key={i} margin={{ bottom: 12 }}>
                        <Row
                          mainAxisAlignment="spaceBetween"
                          margin={{ bottom: 4 }}
                        >
                          <Text
                            text={item.label}
                            fontSize={13}
                            color="#424242"
                          />
                          <Text
                            text={`${Math.round(item.progress * 100)}%`}
                            fontSize={13}
                            color="#9E9E9E"
                          />
                        </Row>
                        <ProgressBar
                          progress={item.progress}
                          color={item.color}
                        />
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 12: Circular Progress ===== */}
                <SectionHeader
                  title="Circular Progress"
                  subtitle="Loading indicators"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceAround">
                    <Column crossAxisAlignment="center">
                      <CircularProgressIndicator color="#1E88E5" />
                      <SizedBox height={8} />
                      <Text text="Blue" fontSize={12} color="#757575" />
                    </Column>
                    <Column crossAxisAlignment="center">
                      <CircularProgressIndicator
                        color="#43A047"
                        strokeWidth={3}
                      />
                      <SizedBox height={8} />
                      <Text text="Green" fontSize={12} color="#757575" />
                    </Column>
                    <Column crossAxisAlignment="center">
                      <CircularProgressIndicator
                        color="#E53935"
                        strokeWidth={6}
                      />
                      <SizedBox height={8} />
                      <Text text="Red" fontSize={12} color="#757575" />
                    </Column>
                    <Column crossAxisAlignment="center">
                      <CircularProgressIndicator
                        color="#FB8C00"
                        strokeWidth={2}
                      />
                      <SizedBox height={8} />
                      <Text text="Orange" fontSize={12} color="#757575" />
                    </Column>
                  </Row>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 13: Form Controls ===== */}
                <SectionHeader
                  title="Form Controls"
                  subtitle="Switches, sliders, text fields"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Dark Mode" fontSize={15} />
                      <Switch
                        value={switchVal1}
                        onChanged={(v) => setSwitchVal1(v)}
                      />
                    </Row>
                    <SizedBox height={8} />
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Notifications" fontSize={15} />
                      <Switch
                        value={switchVal2}
                        onChanged={(v) => setSwitchVal2(v)}
                      />
                    </Row>
                    <SizedBox height={8} />
                    <Row mainAxisAlignment="spaceBetween">
                      <Text text="Auto Sync" fontSize={15} />
                      <Switch
                        value={switchVal3}
                        onChanged={(v) => setSwitchVal3(v)}
                      />
                    </Row>
                    <SizedBox height={16} />
                    <Text text={`Volume: ${sliderVal}%`} fontSize={14} />
                    <Slider
                      value={sliderVal}
                      onChanged={(v) => setSliderVal(v)}
                    />
                    <SizedBox height={12} />
                    <TextField hintText="Enter your name" />
                    <SizedBox height={8} />
                    <TextField hintText="Enter your email" />
                    <SizedBox height={8} />
                    <TextField hintText="Search..." />
                    <SizedBox height={12} />
                    <Row>
                      <Flexible flex={1}>
                        <Container margin={{ right: 8 }}>
                          <Button
                            text="Submit"
                            onTap={() => console.log("submit")}
                          />
                        </Container>
                      </Flexible>
                      <Flexible flex={1}>
                        <Container margin={{ left: 8 }}>
                          <Button
                            text="Cancel"
                            onTap={() => console.log("cancel")}
                          />
                        </Container>
                      </Flexible>
                    </Row>
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 14: Animated Widgets ===== */}
                <SectionHeader
                  title="Animated Widgets"
                  subtitle="Toggle to see animations"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    <Button
                      text="Toggle Animations"
                      onTap={() => setAnimToggle(!animToggle)}
                    />
                    <SizedBox height={16} />
                    <Row mainAxisAlignment="spaceAround">
                      <AnimatedContainer
                        width={animToggle ? 100 : 60}
                        height={animToggle ? 60 : 100}
                        color={animToggle ? "#E53935" : "#1E88E5"}
                        duration={500}
                        curve="easeInOut"
                      />
                      <AnimatedOpacity
                        opacity={animToggle ? 0.3 : 1.0}
                        duration={500}
                      >
                        <Container
                          width={80}
                          height={80}
                          decoration={{ color: "#43A047", borderRadius: 40 }}
                        />
                      </AnimatedOpacity>
                      <AnimatedScale
                        scale={animToggle ? 1.3 : 1.0}
                        duration={500}
                        curve="easeInOut"
                      >
                        <Container
                          width={60}
                          height={60}
                          decoration={{ color: "#FB8C00", borderRadius: 30 }}
                        />
                      </AnimatedScale>
                    </Row>
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 15: Opacity Variations ===== */}
                <SectionHeader
                  title="Opacity Variations"
                  subtitle="10 levels of opacity"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceAround">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Opacity key={i} opacity={1 - i * 0.1}>
                        <Container
                          width={28}
                          height={28}
                          decoration={{ color: "#1E88E5", borderRadius: 4 }}
                        />
                      </Opacity>
                    ))}
                  </Row>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 16: Transform Demo ===== */}
                <SectionHeader
                  title="Transform"
                  subtitle="Scaled and rotated containers"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceAround">
                    <Transform scale={1.2}>
                      <Container
                        width={50}
                        height={50}
                        decoration={{ color: "#E53935", borderRadius: 8 }}
                        alignment="center"
                      >
                        <Text text="1.2x" fontSize={11} color="white" />
                      </Container>
                    </Transform>
                    <Transform rotate={0.3}>
                      <Container
                        width={50}
                        height={50}
                        decoration={{ color: "#43A047", borderRadius: 8 }}
                        alignment="center"
                      >
                        <Text text="0.3r" fontSize={11} color="white" />
                      </Container>
                    </Transform>
                    <Transform scale={0.8}>
                      <Container
                        width={50}
                        height={50}
                        decoration={{ color: "#1E88E5", borderRadius: 8 }}
                        alignment="center"
                      >
                        <Text text="0.8x" fontSize={11} color="white" />
                      </Container>
                    </Transform>
                    <Transform rotate={-0.2}>
                      <Container
                        width={50}
                        height={50}
                        decoration={{ color: "#FB8C00", borderRadius: 8 }}
                        alignment="center"
                      >
                        <Text text="-0.2r" fontSize={11} color="white" />
                      </Container>
                    </Transform>
                  </Row>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 17: ClipRRect ===== */}
                <SectionHeader
                  title="ClipRRect"
                  subtitle="Rounded clipping containers"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceAround">
                    <ClipRRect borderRadius={8}>
                      <Container
                        width={70}
                        height={70}
                        color="#E53935"
                        alignment="center"
                      >
                        <Text text="8px" fontSize={12} color="white" />
                      </Container>
                    </ClipRRect>
                    <ClipRRect borderRadius={20}>
                      <Container
                        width={70}
                        height={70}
                        color="#43A047"
                        alignment="center"
                      >
                        <Text text="20px" fontSize={12} color="white" />
                      </Container>
                    </ClipRRect>
                    <ClipRRect borderRadius={35}>
                      <Container
                        width={70}
                        height={70}
                        color="#1E88E5"
                        alignment="center"
                      >
                        <Text text="35px" fontSize={12} color="white" />
                      </Container>
                    </ClipRRect>
                  </Row>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 18: Tab Section ===== */}
                <SectionHeader
                  title="Tab Section"
                  subtitle="TabBar with TabBarView"
                />

                <Container padding={{ left: 12, right: 12, bottom: 12 }}>
                  <DefaultTabController length={3}>
                    <Column>
                      <TabBar
                        tabs={["Popular", "Newest", "Trending"].map((t) => (
                          <Tab key={t} text={t} />
                        ))}
                        onTap={(index) => console.log(`Tab ${index}`)}
                        indicatorColor="#1E88E5"
                        labelColor="#1E88E5"
                        unselectedLabelColor="#9E9E9E"
                      />
                      <Container height={150}>
                        <TabBarView>
                          <Container color="#E3F2FD" padding={16}>
                            <Column>
                              {Array.from({ length: 4 }, (_, i) => (
                                <Row key={i} margin={{ bottom: 8 }}>
                                  <Container
                                    width={32}
                                    height={32}
                                    decoration={{
                                      color: COLORS[i % COLORS.length],
                                      borderRadius: 16,
                                    }}
                                    alignment="center"
                                  >
                                    <Text
                                      text={`${i + 1}`}
                                      fontSize={12}
                                      color="white"
                                    />
                                  </Container>
                                  <SizedBox width={8} />
                                  <Text
                                    text={`Popular item ${i + 1}`}
                                    fontSize={14}
                                  />
                                </Row>
                              ))}
                            </Column>
                          </Container>
                          <Container color="#E8F5E9" padding={16}>
                            <Column>
                              {Array.from({ length: 4 }, (_, i) => (
                                <Row key={i} margin={{ bottom: 8 }}>
                                  <Container
                                    width={32}
                                    height={32}
                                    decoration={{
                                      color: COLORS[(i + 5) % COLORS.length],
                                      borderRadius: 16,
                                    }}
                                    alignment="center"
                                  >
                                    <Text
                                      text={`${i + 1}`}
                                      fontSize={12}
                                      color="white"
                                    />
                                  </Container>
                                  <SizedBox width={8} />
                                  <Text
                                    text={`Newest item ${i + 1}`}
                                    fontSize={14}
                                  />
                                </Row>
                              ))}
                            </Column>
                          </Container>
                          <Container color="#FFF3E0" padding={16}>
                            <Column>
                              {Array.from({ length: 4 }, (_, i) => (
                                <Row key={i} margin={{ bottom: 8 }}>
                                  <Container
                                    width={32}
                                    height={32}
                                    decoration={{
                                      color: COLORS[(i + 10) % COLORS.length],
                                      borderRadius: 16,
                                    }}
                                    alignment="center"
                                  >
                                    <Text
                                      text={`${i + 1}`}
                                      fontSize={12}
                                      color="white"
                                    />
                                  </Container>
                                  <SizedBox width={8} />
                                  <Text
                                    text={`Trending item ${i + 1}`}
                                    fontSize={14}
                                  />
                                </Row>
                              ))}
                            </Column>
                          </Container>
                        </TabBarView>
                      </Container>
                    </Column>
                  </DefaultTabController>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 19: Image Grid ===== */}
                <SectionHeader
                  title="Image Grid (2 columns, 8 images)"
                  subtitle="Network images with rounded corners"
                />

                <Container padding={{ left: 12, right: 12, bottom: 12 }}>
                  <GridView
                    crossAxisCount={2}
                    mainAxisSpacing={8}
                    crossAxisSpacing={8}
                    itemCount={8}
                    itemBuilder={(index) => (
                      <ClipRRect borderRadius={12}>
                        <Container
                          height={120}
                          color={COLORS[index % COLORS.length]}
                        >
                          <Stack>
                            <Image
                              src={`https://picsum.photos/200/120?random=${index}`}
                              width={200}
                              height={120}
                              fit="cover"
                              placeholderColor={COLORS[index % COLORS.length]}
                            />
                            <Positioned bottom={8} left={8}>
                              <Container
                                padding={{
                                  left: 8,
                                  top: 4,
                                  right: 8,
                                  bottom: 4,
                                }}
                                decoration={{
                                  color: "rgba(0,0,0,0.5)",
                                  borderRadius: 4,
                                }}
                              >
                                <Text
                                  text={`Photo ${index + 1}`}
                                  fontSize={12}
                                  color="white"
                                />
                              </Container>
                            </Positioned>
                          </Stack>
                        </Container>
                      </ClipRRect>
                    )}
                  />
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 20: Flex Layout ===== */}
                <SectionHeader
                  title="Flex Layout"
                  subtitle="Flexible and expanded children"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    <Flex direction="horizontal">
                      <Flexible flex={1}>
                        <Container
                          height={60}
                          decoration={{ color: "#E3F2FD", borderRadius: 8 }}
                          margin={{ right: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 1" fontSize={13} />
                        </Container>
                      </Flexible>
                      <Flexible flex={2}>
                        <Container
                          height={60}
                          decoration={{ color: "#F3E5F5", borderRadius: 8 }}
                          margin={{ left: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 2" fontSize={13} />
                        </Container>
                      </Flexible>
                    </Flex>
                    <SizedBox height={8} />
                    <Flex direction="horizontal">
                      <Flexible flex={1}>
                        <Container
                          height={60}
                          decoration={{ color: "#FFF3E0", borderRadius: 8 }}
                          margin={{ right: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 1" fontSize={13} />
                        </Container>
                      </Flexible>
                      <Flexible flex={1}>
                        <Container
                          height={60}
                          decoration={{ color: "#E8F5E9", borderRadius: 8 }}
                          margin={{ left: 2, right: 2 }}
                          alignment="center"
                        >
                          <Text text="flex: 1" fontSize={13} />
                        </Container>
                      </Flexible>
                      <Flexible flex={1}>
                        <Container
                          height={60}
                          decoration={{ color: "#FFEBEE", borderRadius: 8 }}
                          margin={{ left: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 1" fontSize={13} />
                        </Container>
                      </Flexible>
                    </Flex>
                    <SizedBox height={8} />
                    <Flex direction="horizontal">
                      <Flexible flex={3}>
                        <Container
                          height={60}
                          decoration={{ color: "#E0F7FA", borderRadius: 8 }}
                          margin={{ right: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 3" fontSize={13} />
                        </Container>
                      </Flexible>
                      <Flexible flex={1}>
                        <Container
                          height={60}
                          decoration={{ color: "#FCE4EC", borderRadius: 8 }}
                          margin={{ left: 4 }}
                          alignment="center"
                        >
                          <Text text="flex: 1" fontSize={13} />
                        </Container>
                      </Flexible>
                    </Flex>
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 21: AspectRatio ===== */}
                <SectionHeader
                  title="AspectRatio"
                  subtitle="Different aspect ratio containers"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Row mainAxisAlignment="spaceAround">
                    <Column crossAxisAlignment="center">
                      <SizedBox width={80} height={80}>
                        <AspectRatio aspectRatio={1}>
                          <Container color="#E3F2FD" alignment="center">
                            <Text text="1:1" fontSize={16} fontWeight="bold" />
                          </Container>
                        </AspectRatio>
                      </SizedBox>
                      <SizedBox height={4} />
                      <Text text="Square" fontSize={11} color="#757575" />
                    </Column>
                    <Column crossAxisAlignment="center">
                      <SizedBox width={100} height={56}>
                        <AspectRatio aspectRatio={16 / 9}>
                          <Container color="#F3E5F5" alignment="center">
                            <Text text="16:9" fontSize={16} fontWeight="bold" />
                          </Container>
                        </AspectRatio>
                      </SizedBox>
                      <SizedBox height={4} />
                      <Text text="Widescreen" fontSize={11} color="#757575" />
                    </Column>
                    <Column crossAxisAlignment="center">
                      <SizedBox width={100} height={75}>
                        <AspectRatio aspectRatio={4 / 3}>
                          <Container color="#FFF3E0" alignment="center">
                            <Text text="4:3" fontSize={16} fontWeight="bold" />
                          </Container>
                        </AspectRatio>
                      </SizedBox>
                      <SizedBox height={4} />
                      <Text text="Standard" fontSize={11} color="#757575" />
                    </Column>
                  </Row>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 22: Color Palette ===== */}
                <SectionHeader
                  title="Color Palette"
                  subtitle="50 color swatches"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Wrap spacing={6} runSpacing={6}>
                    {Array.from({ length: 50 }, (_, i) => (
                      <Container
                        key={i}
                        width={36}
                        height={36}
                        decoration={{
                          color: COLORS[i % COLORS.length],
                          borderRadius: 8,
                          border: { color: "#E0E0E0", width: 0.5 },
                        }}
                        alignment="center"
                      >
                        <Text text={`${i + 1}`} fontSize={9} color="#424242" />
                      </Container>
                    ))}
                  </Wrap>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 23: Long Text ===== */}
                <SectionHeader
                  title="Long Text Content"
                  subtitle="Multiple paragraphs of text"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    {Array.from({ length: 6 }, (_, i) => (
                      <Container key={i} margin={{ bottom: 12 }}>
                        <Text
                          text={`Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`}
                          fontSize={14}
                          color="#424242"
                        />
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 24: Mixed Row Cards ===== */}
                <SectionHeader
                  title="Mixed Row Cards"
                  subtitle="Various card layouts"
                />

                <Container padding={{ left: 12, right: 12, bottom: 12 }}>
                  <Column>
                    {Array.from({ length: 6 }, (_, i) => (
                      <Container
                        key={i}
                        margin={{ bottom: 8 }}
                        padding={12}
                        decoration={{
                          color: "white",
                          borderRadius: 12,
                          boxShadow: {
                            color: "#0000000A",
                            blurRadius: 6,
                            offset: { dx: 0, dy: 2 },
                          },
                        }}
                      >
                        <Row>
                          <Container
                            width={80}
                            height={80}
                            decoration={{
                              color: COLORS[i % COLORS.length],
                              borderRadius: 12,
                            }}
                            alignment="center"
                          >
                            <Icon
                              name={ICONS[i % ICONS.length]}
                              size={32}
                              color="#424242"
                            />
                          </Container>
                          <SizedBox width={12} />
                          <Flexible flex={1}>
                            <Column crossAxisAlignment="start">
                              <Text
                                text={`Mixed Card ${i + 1}`}
                                fontSize={16}
                                fontWeight="bold"
                              />
                              <SizedBox height={4} />
                              <Text
                                text="Short description text here"
                                fontSize={13}
                                color="#757575"
                              />
                              <SizedBox height={8} />
                              <Row>
                                <TagChip
                                  text="Tag A"
                                  color={COLORS[(i + 1) % COLORS.length]}
                                />
                                <SizedBox width={6} />
                                <TagChip
                                  text="Tag B"
                                  color={COLORS[(i + 2) % COLORS.length]}
                                />
                              </Row>
                            </Column>
                          </Flexible>
                        </Row>
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 25: InkWell Buttons ===== */}
                <SectionHeader
                  title="InkWell Buttons"
                  subtitle="12 tappable buttons"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Wrap spacing={10} runSpacing={10}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <InkWell key={i} onTap={() => console.log(`Button ${i}`)}>
                        <Container
                          padding={{ left: 20, top: 10, right: 20, bottom: 10 }}
                          decoration={{
                            color: COLORS[i % COLORS.length],
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            text={`Btn ${i + 1}`}
                            fontSize={14}
                            color="#424242"
                          />
                        </Container>
                      </InkWell>
                    ))}
                  </Wrap>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 26: Nested Rows & Columns ===== */}
                <SectionHeader
                  title="Nested Layouts"
                  subtitle="Deep nesting stress test"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <Column>
                    {Array.from({ length: 4 }, (_, row) => (
                      <Container
                        key={row}
                        margin={{ bottom: 8 }}
                        padding={8}
                        decoration={{
                          color: COLORS[row % COLORS.length],
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          text={`Level 0 - Row ${row + 1}`}
                          fontSize={14}
                          fontWeight="bold"
                          margin={{ bottom: 4 }}
                        />
                        <Row>
                          {Array.from({ length: 3 }, (_, col) => (
                            <Flexible key={col} flex={1}>
                              <Container
                                margin={{
                                  left: col > 0 ? 4 : 0,
                                  right: col < 2 ? 4 : 0,
                                }}
                                padding={8}
                                decoration={{
                                  color: "rgba(255,255,255,0.7)",
                                  borderRadius: 6,
                                }}
                              >
                                <Column>
                                  <Text
                                    text={`L1-${row}-${col}`}
                                    fontSize={12}
                                    fontWeight="bold"
                                  />
                                  <Row margin={{ top: 4 }}>
                                    {Array.from({ length: 2 }, (_, inner) => (
                                      <Flexible key={inner} flex={1}>
                                        <Container
                                          margin={{
                                            left: inner > 0 ? 2 : 0,
                                            right: inner < 1 ? 2 : 0,
                                          }}
                                          height={24}
                                          decoration={{
                                            color:
                                              COLORS[
                                                (row + col + inner) %
                                                  COLORS.length
                                              ],
                                            borderRadius: 4,
                                          }}
                                          alignment="center"
                                        >
                                          <Text
                                            text={`${inner}`}
                                            fontSize={9}
                                            color="#616161"
                                          />
                                        </Container>
                                      </Flexible>
                                    ))}
                                  </Row>
                                </Column>
                              </Container>
                            </Flexible>
                          ))}
                        </Row>
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 27: FractionallySizedBox ===== */}
                <SectionHeader
                  title="FractionallySizedBox"
                  subtitle="Width/Height as fractions"
                />

                <Container padding={{ left: 16, right: 16, bottom: 12 }}>
                  <SizedBox width={300} height={60}>
                    <FractionallySizedBox widthFactor={0.5} heightFactor={1.0}>
                      <Container color="#E3F2FD" alignment="center">
                        <Text text="50% width" fontSize={12} />
                      </Container>
                    </FractionallySizedBox>
                  </SizedBox>
                  <SizedBox height={8} />
                  <SizedBox width={300} height={60}>
                    <FractionallySizedBox widthFactor={0.75} heightFactor={1.0}>
                      <Container color="#F3E5F5" alignment="center">
                        <Text text="75% width" fontSize={12} />
                      </Container>
                    </FractionallySizedBox>
                  </SizedBox>
                  <SizedBox height={8} />
                  <SizedBox width={300} height={60}>
                    <FractionallySizedBox widthFactor={1.0} heightFactor={1.0}>
                      <Container color="#FFF3E0" alignment="center">
                        <Text text="100% width" fontSize={12} />
                      </Container>
                    </FractionallySizedBox>
                  </SizedBox>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 28: Large GridView ===== */}
                <SectionHeader
                  title="Large GridView (4 columns, 40 items)"
                  subtitle="Stress test with many grid items"
                />

                <Container
                  height={500}
                  padding={{ left: 12, right: 12, bottom: 12 }}
                >
                  <GridView
                    crossAxisCount={4}
                    mainAxisSpacing={6}
                    crossAxisSpacing={6}
                    itemCount={40}
                    itemBuilder={(index) => (
                      <Container
                        decoration={{
                          color: COLORS[index % COLORS.length],
                          borderRadius: 8,
                        }}
                        alignment="center"
                      >
                        <Column
                          crossAxisAlignment="center"
                          mainAxisAlignment="center"
                        >
                          <Icon
                            name={ICONS[index % ICONS.length]}
                            size={18}
                            color="#616161"
                          />
                          <SizedBox height={2} />
                          <Text
                            text={`${index + 1}`}
                            fontSize={10}
                            color="#616161"
                          />
                        </Column>
                      </Container>
                    )}
                  />
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 29: Notification Cards ===== */}
                <SectionHeader
                  title="Notification Cards (10)"
                  subtitle="Cards with time stamps and status"
                />

                <Container padding={{ left: 12, right: 12, bottom: 12 }}>
                  <Column>
                    {Array.from({ length: 10 }, (_, i) => (
                      <Container
                        key={i}
                        margin={{ bottom: 8 }}
                        padding={12}
                        decoration={{
                          color: i < 3 ? "#E3F2FD" : "white",
                          borderRadius: 12,
                          boxShadow: {
                            color: "#00000008",
                            blurRadius: 4,
                            offset: { dx: 0, dy: 1 },
                          },
                        }}
                      >
                        <Row>
                          <Container
                            width={8}
                            height={8}
                            margin={{ right: 8, top: 6 }}
                            decoration={{
                              color: i < 3 ? "#1E88E5" : "#BDBDBD",
                              borderRadius: 4,
                            }}
                          />
                          <Flexible flex={1}>
                            <Column crossAxisAlignment="start">
                              <Row mainAxisAlignment="spaceBetween">
                                <Text
                                  text={`Notification ${i + 1}`}
                                  fontSize={14}
                                  fontWeight="bold"
                                />
                                <Text
                                  text={`${i + 1}h ago`}
                                  fontSize={11}
                                  color="#9E9E9E"
                                />
                              </Row>
                              <SizedBox height={4} />
                              <Text
                                text={`This is the content of notification ${i + 1}. It contains some details about the event.`}
                                fontSize={13}
                                color="#616161"
                              />
                            </Column>
                          </Flexible>
                        </Row>
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Divider height={1} color="#EEEEEE" />

                {/* ===== Section 30: Footer ===== */}

                <Container padding={24} color="#FAFAFA">
                  <Column crossAxisAlignment="center">
                    <Text
                      text="End of Performance Stress Test"
                      fontSize={16}
                      fontWeight="bold"
                      color="#424242"
                    />
                    <SizedBox height={8} />
                    <Text
                      text="If you can scroll here smoothly, the performance is good!"
                      fontSize={13}
                      color="#9E9E9E"
                    />
                    <SizedBox height={16} />
                    <Row mainAxisAlignment="center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Container
                          key={i}
                          width={8}
                          height={8}
                          margin={{ left: 3, right: 3 }}
                          decoration={{
                            color: i === 2 ? "#1E88E5" : "#BDBDBD",
                            borderRadius: 4,
                          }}
                        />
                      ))}
                    </Row>
                    <SizedBox height={16} />
                    <Container
                      padding={{ left: 24, top: 10, right: 24, bottom: 10 }}
                      decoration={{ color: "#1E88E5", borderRadius: 24 }}
                    >
                      <Text
                        text="Back to Top"
                        fontSize={14}
                        color="white"
                        fontWeight="bold"
                      />
                    </Container>
                  </Column>
                </Container>
              </Column>
            )}
          />
        </Column>
      </SingleChildScrollView>
    </Scaffold>
  );
}
