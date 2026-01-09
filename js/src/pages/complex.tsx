import React from 'react';
import {
    Column,
    Container,
    Text,
    Row,
    Button,
    Icon,
    Stack,
    Positioned,
    Padding,
    SizedBox,
    Divider,
    SingleChildScrollView,
    Image,
    GestureDetector,
} from 'fuick_js_framework';

const ComplexPage = () => {
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('Posts');

    const stats = [
        { label: 'Posts', value: '128' },
        { label: 'Followers', value: '4.2k' },
        { label: 'Following', value: '856' },
    ];

    const posts = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            likes: 124,
            comments: 18,
            title: 'Beautiful Mountain View'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce',
            likes: 89,
            comments: 5,
            title: 'City Lights at Night'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
            likes: 256,
            comments: 42,
            title: 'Forest Path'
        }
    ];

    return (
        <Container color="#F5F7FA">
            <SingleChildScrollView>
                <Column crossAxisAlignment="stretch">
                    {/* Header Section with Cover and Profile Image */}
                    <Stack alignment="bottomLeft">
                        <Container height={200} width={400}>
                            <Image
                                url="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                                fit="cover"
                                width={400}
                                height={200}
                            />
                        </Container>

                        <Positioned bottom={-40} left={20}>
                            <Container
                                width={100}
                                height={100}
                                borderRadius={50}
                                color="#FFFFFF"
                                padding={4}
                            >
                                <Container
                                    width={92}
                                    height={92}
                                    borderRadius={46}
                                >
                                    <Image
                                        url="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                                        fit="cover"
                                        width={92}
                                        height={92}
                                        borderRadius={46}
                                    />
                                </Container>
                            </Container>
                        </Positioned>
                    </Stack>

                    <SizedBox height={50} />

                    {/* Profile Details */}
                    <Padding padding={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                        <Column crossAxisAlignment="start">
                            <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                                <Column crossAxisAlignment="start">
                                    <Text text="Jane Doe" fontSize={24} color="#1A1C1E" />
                                    <Text text="@janedoe_explorer" fontSize={14} color="#6B7280" />
                                </Column>
                                <Button
                                    text={isFollowing ? "Following" : "Follow"}
                                    onTap={() => setIsFollowing(!isFollowing)}
                                />
                            </Row>

                            <SizedBox height={15} />

                            <Text
                                text="Adventure seeker, photographer, and nature lover. Exploring the world one click at a time. 🌍📸"
                                fontSize={15}
                                color="#4B5563"
                            />
                        </Column>
                    </Padding>

                    {/* Stats Bar */}
                    <Padding padding={20}>
                        <Container color="#FFFFFF" borderRadius={12} padding={15}>
                            <Row mainAxisAlignment="spaceAround">
                                {stats.map((stat, index) => (
                                    <Column key={index} crossAxisAlignment="center">
                                        <Text text={stat.value} fontSize={18} color="#1A1C1E" />
                                        <Text text={stat.label} fontSize={12} color="#6B7280" />
                                    </Column>
                                ))}
                            </Row>
                        </Container>
                    </Padding>

                    {/* Tab Bar */}
                    <Padding padding={{ left: 20, right: 20 }}>
                        <Row mainAxisAlignment="start">
                            {['Posts', 'Photos', 'Likes'].map((tab) => (
                                <GestureDetector key={tab} onTap={() => setActiveTab(tab)}>
                                    <Column crossAxisAlignment="center">
                                        <Container
                                            padding={{ left: 15, right: 15, top: 10, bottom: 10 }}
                                        >
                                            <Text
                                                text={tab}
                                                fontSize={16}
                                                color={activeTab === tab ? "#3B82F6" : "#6B7280"}
                                            />
                                        </Container>
                                        {activeTab === tab && (
                                            <Container height={2} width={40} color="#3B82F6" />
                                        )}
                                    </Column>
                                </GestureDetector>
                            ))}
                        </Row>
                    </Padding>

                    <Divider height={1} color="#E5E7EB" />

                    {/* Posts Feed */}
                    <Padding padding={20}>
                        <Column crossAxisAlignment="stretch">
                            {posts.map((post) => (
                                <Container
                                    key={post.id}
                                    color="#FFFFFF"
                                    borderRadius={16}
                                    margin={{ bottom: 20 }}
                                    padding={0}
                                >
                                    <Column crossAxisAlignment="stretch">
                                        <Container height={200}>
                                            <Image
                                                url={post.image}
                                                fit="cover"
                                                width={400}
                                                height={200}
                                                borderRadius={{ topLeft: 16, topRight: 16 }}
                                            />
                                        </Container>

                                        <Padding padding={15}>
                                            <Column crossAxisAlignment="start">
                                                <Text text={post.title} fontSize={18} color="#1A1C1E" />
                                                <SizedBox height={10} />
                                                <Row mainAxisAlignment="start" crossAxisAlignment="center">
                                                    <Icon codePoint={0xe388} size={18} color="#6B7280" /> {/* favorite */}
                                                    <SizedBox width={4} />
                                                    <Text text={`${post.likes}`} fontSize={14} color="#6B7280" />
                                                    <SizedBox width={20} />
                                                    <Icon codePoint={0xe150} size={18} color="#6B7280" /> {/* comment */}
                                                    <SizedBox width={4} />
                                                    <Text text={`${post.comments}`} fontSize={14} color="#6B7280" />
                                                </Row>
                                            </Column>
                                        </Padding>
                                    </Column>
                                </Container>
                            ))}
                        </Column>
                    </Padding>
                </Column>
            </SingleChildScrollView>
        </Container>
    );
};

export default ComplexPage;
