
import React, { useReducer, useState, useCallback } from 'react'
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Checkbox from 'expo-checkbox'
import { useTheme } from '@react-navigation/native'
import Input from '../components/Input' // Ensure you have this component for input handling
import Button from '../components/Button' // Ensure you have this component for the button
import { COLORS, SIZES, icons, images } from '../constants' // Adjust based on your project structure
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'

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

const Signup = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const { colors, dark } = useTheme()

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [])

    const signupHandler = async () => {
        const { email, password, username } = formState.inputValues

        if (!formState.formIsValid) {
            Alert.alert(
                'Invalid Input',
                'Please check all fields and try again.'
            )
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post(
                'https://ikoyiproperty.com/wp-json/custom/v1/register', // Update with the correct signup endpoint
                {
                    email,
                    password,
                    username,
                    role: isChecked ? 'buyer' : 'agent', // Assign role based on checkbox
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            // If successful, show success message and navigate to login
            Alert.alert('Signup Successful', 'Your account has been created!')
            navigation.navigate('Login') // Navigate to Login screen after successful signup
        } catch (error) {
            Alert.alert(
                'Signup Failed',
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
                { backgroundColor: dark ? COLORS.black2 : COLORS.dark1 },
            ]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: dark ? COLORS.black : COLORS.dark1 },
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
                                color: dark ? COLORS.black : COLORS.white,
                            },
                        ]}
                    >
                        Create an Account
                    </Text>
                    <Input
                        id="username"
                        onInputChanged={inputChangedHandler}
                        placeholder="Username"
                        icon={icons.user}
                    />
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
                                                ? COLORS.black
                                                : COLORS.white,
                                        },
                                    ]}
                                >
                                    Register as Agent
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title="Sign Up"
                        filled
                        onPress={signupHandler}
                        isLoading={isLoading}
                    />
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text
                        style={[
                            styles.bottomLeft,
                            {
                                color: dark ? COLORS.black : COLORS.white,
                            },
                        ]}
                    >
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.bottomRight}> Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // Your styles remain unchanged
    area: {
        flex: 1,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 20,
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
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 58,
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
})

export default Signup
