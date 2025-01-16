import { View, Platform, Image, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated'
import { COLORS, FONTS, icons } from '../constants'
import {
    Home,
    Inbox,
    MyCourse,
    Profile,
    Transactions,
    MyBookmark,
} from '../screens'
import { useTheme } from '../theme/ThemeProvider'

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    const { dark } = useTheme()

    const AnimatedTabBarIcon = ({ focused, icon, label }) => {
        const translateY = useSharedValue(focused ? -10 : 0)
        const scale = useSharedValue(focused ? 1.2 : 1)
        const circleScale = useSharedValue(focused ? 1 : 0)

        React.useEffect(() => {
            translateY.value = withSpring(focused ? -10 : 0, {
                damping: 12,
                stiffness: 90,
            })
            scale.value = withSpring(focused ? 1.2 : 1, {
                damping: 12,
                stiffness: 90,
            })
            circleScale.value = withTiming(focused ? 1 : 0, { duration: 300 })
        }, [focused])

        const animatedIconStyle = useAnimatedStyle(() => ({
            transform: [
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        }))

        const animatedCircleStyle = useAnimatedStyle(() => ({
            transform: [{ scale: circleScale.value }],
            opacity: circleScale.value,
        }))

        return (
            <View style={styles.tabItem}>
                {/* Circular Background */}
                <Animated.View
                    style={[
                        styles.circleBackground,
                        animatedCircleStyle,
                        { backgroundColor: dark ? COLORS.gray2 : COLORS.white },
                    ]}
                />
                {/* Icon */}
                <Animated.View
                    style={[styles.iconContainer, animatedIconStyle]}
                >
                    <Image
                        source={icon}
                        resizeMode="contain"
                        style={{
                            height: 28,
                            width: 28,
                            tintColor: focused
                                ? COLORS.primary
                                : dark
                                  ? COLORS.gray3
                                  : COLORS.gray3,
                        }}
                    />
                </Animated.View>
                {/* Label */}
                <Text
                    style={{
                        ...FONTS.body4,
                        color: focused ? COLORS.primary : COLORS.gray3,
                        marginTop: 4,
                    }}
                >
                    {label}
                </Text>
            </View>
        )
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 90 : 60,
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    borderTopColor: 'transparent',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabBarIcon
                            focused={focused}
                            icon={focused ? icons.home : icons.home2Outline}
                            label="Home"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="MyCourse"
                component={MyCourse}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabBarIcon
                            focused={focused}
                            icon={
                                focused ? icons.explore : icons.exploreOutline
                            }
                            label="Explore"
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="inbox"
                component={Inbox}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabBarIcon
                            focused={focused}
                            icon={icons.plus}
                            label="Create"
                        />
                    ),
                }}
            />
            {/* <Tab.Screen
                name="Bookmarks"
                component={MyBookmark}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabBarIcon
                            focused={focused}
                            icon={focused ? icons.bookmark : icons.bookmarkOutline}
                            label="Bookmarks"
                        />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabBarIcon
                            focused={focused}
                            icon={focused ? icons.user : icons.userOutline}
                            label="Profile"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation

const styles = StyleSheet.create({
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        ...FONTS.body4,
        marginTop: 4,
        fontSize: 12,
    },
    circleBackground: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        zIndex: 1,
        bottom: 20,
    },
})
