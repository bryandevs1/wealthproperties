import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativeBiometrics from 'react-native-biometrics'
import { ScrollView } from 'react-native-virtualized-view'
import Header from '../components/Header'
import GlobalSettingsItem from '../components/GlobalSettingsItem'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS, icons } from '../constants'

const SettingsSecurity = ({ navigation }) => {
    const [isRememberMeEnabled, setIsRememberMeEnabled] = useState(true)
    const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false)
    const [isBiometricIDEnabled, setIsBiometricIDEnabled] = useState(false)
    const { colors, dark } = useTheme()

    // Fetch stored preferences on mount
    useEffect(() => {
        const fetchPreferences = async () => {
            const storedFaceID = await AsyncStorage.getItem('faceIDEnabled')
            const storedBiometricID =
                await AsyncStorage.getItem('biometricIDEnabled')
            setIsFaceIDEnabled(storedFaceID === 'true')
            setIsBiometricIDEnabled(storedBiometricID === 'true')
        }
        fetchPreferences()
    }, [])

    const toggleRememberMe = () => {
        setIsRememberMeEnabled(!isRememberMeEnabled)
    }

    const handleBiometricAuthentication = async () => {
        const rnBiometrics = new ReactNativeBiometrics()

        try {
            const { available, biometryType } =
                await rnBiometrics.isSensorAvailable()

            if (
                available &&
                (biometryType === ReactNativeBiometrics.Biometrics ||
                    biometryType === ReactNativeBiometrics.FaceID)
            ) {
                const { success } = await rnBiometrics.simplePrompt({
                    promptMessage: 'Confirm your identity',
                })

                if (success) {
                    console.log('Successfully authenticated')
                    setIsFaceIDEnabled(true)
                    await AsyncStorage.setItem('faceIDEnabled', 'true')
                } else {
                    console.log('User cancelled biometric prompt')
                }
            } else {
                console.log('Biometric or Face ID not available')
            }
        } catch (error) {
            console.error('Biometric authentication failed', error)
        }
    }

    const toggleBiometricID = async () => {
        const newValue = !isBiometricIDEnabled
        setIsBiometricIDEnabled(newValue)
        await AsyncStorage.setItem('biometricIDEnabled', newValue.toString())
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
                <Header title="Security" />
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <GlobalSettingsItem
                        title="Remember me"
                        isNotificationEnabled={isRememberMeEnabled}
                        toggleNotificationEnabled={toggleRememberMe}
                    />
                    <GlobalSettingsItem
                        title="Face ID"
                        isNotificationEnabled={isFaceIDEnabled}
                        toggleNotificationEnabled={
                            handleBiometricAuthentication
                        }
                    />
                    {/* <GlobalSettingsItem
                        title="Biometric ID"
                        isNotificationEnabled={isBiometricIDEnabled}
                        toggleNotificationEnabled={toggleBiometricID}
                    />

                    <Button
                        title="Change PIN"
                        style={{
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            marginTop: 22,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => navigation.navigate('ChangePIN')}
                    />
                    <Button
                        title="Change Password"
                        style={{
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            marginTop: 22,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => navigation.navigate('ChangePassword')}
                    />
                    <Button
                        title="Change Email"
                        style={{
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            marginTop: 22,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => navigation.navigate('ChangeEmail')}
                    /> */}
                </ScrollView>
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
    scrollView: {
        marginVertical: 22,
    },
    arrowRight: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    viewLeft: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginRight: 8,
    },
    button: {
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
        borderColor: COLORS.tansparentPrimary,
        marginTop: 22,
    },
})

export default SettingsSecurity
