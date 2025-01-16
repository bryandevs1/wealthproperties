import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native'
import React from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { MyCompletedCourses, MyOngoingCourses } from '../tabs'
import { useTheme } from '../theme/ThemeProvider'
import { useNavigation } from '@react-navigation/native'

const renderScene = SceneMap({
    first: MyOngoingCourses,
    second: MyCompletedCourses,
})

const MyCourse = () => {
    const navigation = useNavigation()
    const layout = useWindowDimensions()
    const { colors, dark } = useTheme()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'For Sale' },
        { key: 'second', title: 'For Rent' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: colors.background,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'semiBold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Image
                        source={icons.exploreOutline}
                        resizeMode="contain"
                        style={styles.headerLogo}
                    />
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Explore Properties
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Search')}
                    >
                        <Image
                            source={icons.search}
                            resizeMode="contain"
                            style={[
                                styles.searchIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.secondaryWhite
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {renderHeader()}
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        height: 32,
        width: 32,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    moreCircleIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
        marginLeft: 12,
    },
})

export default MyCourse
