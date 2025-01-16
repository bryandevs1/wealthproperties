import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialIcons } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import SettingsItem from '../components/SettingsItem'
import { useTheme } from '../theme/ThemeProvider'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Appearance } from 'react-native'

const Profile = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        Appearance.getColorScheme() === 'dark'
    )

    const [image, setImage] = useState(images.user1)
    const [userId, setUserId] = useState(null)
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const handleLogout = async () => {
        try {
            // Clear the user token from storage
            await AsyncStorage.removeItem('userToken')

            // Optionally, clear other stored user data if needed
            await AsyncStorage.clear()

            // Redirect to the login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Replace 'LoginScreen' with your actual login screen name
            })
        } catch (error) {
            console.error('Error during logout:', error.message)
            Alert.alert('Error', 'Failed to log out. Please try again.')
        }
    }

    const handleDelete = async () => {
        try {
            if (!email) {
                Alert.alert('Error', 'Email is not available.')
                return
            }

            const response = await axios.post(
                'https://back.ikoyiproperty.com:8443/request-account-deletion',
                { email }
            )

            if (response.status === 200) {
                Alert.alert('Success', response.data.message)
            } else {
                Alert.alert('Error', 'Failed to send account deletion request.')
            }
        } catch (error) {
            console.error(
                'Error sending account deletion request:',
                error.message
            )
            Alert.alert('Error', 'An error occurred. Please try again.')
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                const response = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/users/me?context=edit',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const userData = response.data
                console.log('Fetched User Data:', userData)

                setUserId(userData.id)
                setFullName(userData.name)
                setUsername(userData.slug)
                setEmail(userData.email) // Set the email state

                if (userData.avatar && typeof userData.avatar === 'string') {
                    setImage(userData.avatar)
                } else {
                    setImage(images.user1)
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message)
                Alert.alert('Error', 'Failed to load profile data.')
            }
        }

        fetchUserData()
    }, [])

    const refRBSheet = useRef()
    const refDeleteSheet = useRef()
    const { dark, colors, setScheme } = useTheme()

    const toggleTheme = () => {
        dark ? setScheme('light') : setScheme('dark')
    }
    /**
     * Render Header
     */
    const renderHeader = () => {
        return (
            <TouchableOpacity style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Image
                        source={icons.profile}
                        resizeMode="contain"
                        style={styles.logo}
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
                        Profile
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     * Render User Profile
     */
    const renderProfile = () => {
        return (
            <View style={styles.profileContainer}>
                <View>
                    <Image
                        source={
                            image && typeof image === 'string'
                                ? { uri: image }
                                : image || images.user1 // Provide a default image
                        }
                        resizeMode="contain"
                        style={styles.avatar}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EditProfile')}
                        style={styles.picContainer}
                    >
                        <MaterialIcons
                            name="edit"
                            size={16}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>
                <Text
                    style={[
                        styles.title,
                        {
                            color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.greyscale900,
                        },
                    ]}
                >
                    {fullName || 'Loading...'}
                </Text>
                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.greyscale900,
                        },
                    ]}
                >
                    {email || 'Loading...'}
                </Text>
            </View>
        )
    }
    /**
     * Render Settings
     */
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            const isDark = colorScheme === 'dark'
            setIsDarkMode(isDark)
            setScheme(isDark ? 'dark' : 'light')
        })

        return () => subscription.remove() // Cleanup listener
    }, [])

    const renderSettings = () => {
        const toggleDarkMode = () => {
            setIsDarkMode((prev) => !prev)
            dark ? setScheme('light') : setScheme('dark')
        }

        return (
            <View style={styles.settingsContainer}>
                <SettingsItem
                    icon={icons.userOutline}
                    name="Edit Profile"
                    onPress={() => navigation.navigate('EditProfile')}
                />
                <SettingsItem
                    icon={icons.bell2}
                    name="Notification"
                    onPress={() => navigation.navigate('SettingsNotifications')}
                />

                <SettingsItem
                    icon={icons.shieldOutline}
                    name="Security"
                    onPress={() => navigation.navigate('SettingsSecurity')}
                />

                <TouchableOpacity style={styles.settingsItemContainer}>
                    <View style={styles.leftContainer}>
                        <Image
                            source={icons.show}
                            resizeMode="contain"
                            style={[
                                styles.settingsIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.settingsName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Dark Mode
                        </Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleDarkMode}
                            thumbColor={
                                isDarkMode ? COLORS.black : COLORS.white
                            }
                            trackColor={{
                                false: '#EEEEEE',
                                true: COLORS.primary,
                            }}
                            ios_backgroundColor={COLORS.white}
                            style={styles.switch}
                        />
                    </View>
                </TouchableOpacity>
                <SettingsItem
                    icon={icons.lockedComputerOutline}
                    name="Privacy Policy"
                    onPress={() => navigation.navigate('SettingsPrivacyPolicy')}
                />
                <SettingsItem
                    icon={icons.infoCircle}
                    name="Help Center"
                    onPress={() => navigation.navigate('HelpCenter')}
                />
                {/* <SettingsItem
                    icon={icons.people4}
                    name="Invite Friends"
                    onPress={() => navigation.navigate('InviteFriends')}
                /> */}
                <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={styles.logoutContainer}
                >
                    <View style={styles.logoutLeftContainer}>
                        <Image
                            source={icons.logout}
                            resizeMode="contain"
                            style={[
                                styles.logoutIcon,
                                {
                                    tintColor: 'red',
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.logoutName,
                                {
                                    color: 'red',
                                },
                            ]}
                        >
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => refDeleteSheet.current.open()}
                    style={styles.logoutContainer}
                >
                    <View style={styles.logoutLeftContainer}>
                        <Image
                            source={icons.timeCircle}
                            resizeMode="contain"
                            style={[
                                styles.logoutIcon,
                                {
                                    tintColor: 'red',
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.logoutName,
                                {
                                    color: 'red',
                                },
                            ]}
                        >
                            Delete My Account
                        </Text>
                    </View>
                </TouchableOpacity>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderProfile()}
                    {renderSettings()}
                </ScrollView>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={SIZES.height * 0.8}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.gray2
                            : COLORS.grayscale200,
                        height: 4,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 260,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                }}
            >
                <Text style={styles.bottomTitle}>Logout</Text>
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.white : COLORS.black,
                        },
                    ]}
                >
                    Are you sure you want to log out?
                </Text>
                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    />
                </View>
            </RBSheet>
            <RBSheet
                ref={refDeleteSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={SIZES.height * 0.8}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.gray2
                            : COLORS.grayscale200,
                        height: 4,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 260,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                }}
            >
                <Text style={styles.bottomTitle}>Delete Account</Text>
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.white : COLORS.black,
                        },
                    ]}
                >
                    Are you sure you want to delete my account?
                </Text>
                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refDeleteSheet.current.close()} // Close sheet on Cancel
                    />
                    <Button
                        title="Yes, Delete Account"
                        filled
                        style={styles.logoutButton}
                        onPress={async () => {
                            await handleDelete() // Execute delete logic
                            refDeleteSheet.current.close() // Close sheet after delete
                        }}
                    />
                </View>
            </RBSheet>
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
        marginBottom: 32,
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
    logo: {
        height: 32,
        width: 32,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    headerIcon: {
        height: 50,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    profileContainer: {
        alignItems: 'center',
        borderBottomColor: COLORS.grayscale400,
        borderBottomWidth: 0.4,
        paddingVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 999,
    },
    picContainer: {
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginTop: 12,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: 'medium',
        marginTop: 4,
    },
    settingsContainer: {
        marginVertical: 12,
    },
    settingsItemContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    settingsName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    settingsArrowRight: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale900,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightLanguage: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginRight: 8,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
    },
    logoutContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    logoutLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    logoutName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
        marginTop: 12,
    },
    bottomSubtitle: {
        fontSize: 20,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 36,
    },
})

export default Profile
