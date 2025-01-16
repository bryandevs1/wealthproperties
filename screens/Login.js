import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import SocialButton from '../components/SocialButton'
import OrSeparator from '../components/OrSeparator'
import { useTheme } from '../theme/ThemeProvider'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const { colors, dark } = useTheme()

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [])

    const loginHandler = async () => {
        const { email, password } = formState.inputValues

        if (!formState.formIsValid) {
            Alert.alert('Invalid Input', 'Please check your email and password')
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post(
                'https://ikoyiproperty.com/wp-json/jwt-auth/v1/token', // Update with your API URL
                {
                    username: email,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            // If successful, save the token and navigate
            // If successful, save the token
            const token = response.data.token
            await AsyncStorage.setItem('userToken', token)

            // Check if the user has accepted the Terms of Service
            const termsAccepted = await AsyncStorage.getItem('termsAccepted')

            if (termsAccepted === 'true') {
                // If terms are accepted, navigate to the main screen (Tabs or Main)
                navigation.navigate('Main', { token })
            } else {
                // If terms are not accepted, navigate to TermsOfService page
                navigation.navigate('Terms')
            }
        } catch (error) {
            Alert.alert(
                'Login Failed',
                error.response?.data?.message || 'An error occurred'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView
            style={[
                styles.area,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.ik}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Login to Your Account
                    </Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        placeholder="Email"
                        icon={icons.email}
                        keyboardType="email-address"
                    />
                    <Input
                        id="password"
                        onInputChanged={inputChangedHandler}
                        placeholder="Password"
                        icon={icons.padlock}
                        secureTextEntry
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={
                                    isChecked
                                        ? COLORS.primary
                                        : dark
                                          ? COLORS.primary
                                          : 'gray'
                                }
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.privacy,
                                        {
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    Remenber me
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        isLoading={isLoading}
                        title="Login"
                        filled
                        onPress={loginHandler}
                    />
                    <Button title="Test Crash" onPress=
                    {() => {
                        throw new Error('Test Sentry crash!')
                    }}
                    />
                    <View></View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text
                        style={[
                            styles.bottomLeft,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Don't have an account ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.bottomRight}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 300,
        height: 100,
        tintColor: COLORS.primary,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 18,
        position: 'absolute',
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
})

export default Login
