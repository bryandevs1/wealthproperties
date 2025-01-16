import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    Linking,
} from 'react-native'
import React from 'react'
import { COLORS, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import HelpCenterItem from '../components/HelpCenterItem'
import { useTheme } from '../theme/ThemeProvider'

const contactUsRoute = () => {
    const { colors, dark } = useTheme()

    const handleEmail = () => {
        const email = 'admin@ikoyiproperty.com'
        const subject = 'Subject Here...' // Optional
        const body = 'I would like to inquire about...' // Optional
        const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        Linking.openURL(mailto).catch((err) =>
            console.error('Failed to open email app:', err)
        )
    }

    const handleWhatsApp = () => {
        const phoneNumber = '+2347048000482' // Replace with the desired phone number.
        const message = 'Hello, I would like to inquire about...' // Optional
        const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
        Linking.openURL(whatsappURL).catch(() => {
            console.error(
                'Failed to open WhatsApp. Ensure WhatsApp is installed.'
            )
        })
    }

    const handleWebsite = () => {
        const websiteURL = 'https://ikoyiproperty.com'
        Linking.openURL(websiteURL).catch((err) =>
            console.error('Failed to open browser:', err)
        )
    }

    return (
        <View
            style={[
                styles.routeContainer,
                { backgroundColor: colors.background },
            ]}
        >
            <HelpCenterItem
                icon={icons.email}
                title="Email"
                onPress={handleEmail}
            />
            <HelpCenterItem
                icon={icons.whatsapp}
                title="WhatsApp"
                onPress={handleWhatsApp}
            />
            <HelpCenterItem
                icon={icons.world}
                title="Website"
                onPress={handleWebsite}
            />
        </View>
    )
}

const renderScene = SceneMap({
    second: contactUsRoute, // Only the "Contact Us" route remains.
})

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'second', title: 'Contact Us' }, // Only one route now.
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={{
                        color: focused ? COLORS.primary : 'gray',
                        fontSize: 16,
                        fontFamily: 'bold',
                    }}
                >
                    {route.title}
                </Text>
            )}
        />
    )

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={[
                            styles.backIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Help Center
                </Text>
            </View>
        </View>
    )

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
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    routeContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingVertical: 22,
    },
})

export default HelpCenter
