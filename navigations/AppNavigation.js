import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Onboarding1 } from '../screens/Onboarding1'
import {
    AddNewCard,
    Call,
    ChangeEmail,
    ChangePIN,
    ChangePassword,
    Chat,
    ConfirmPayment,
    CourseDetails,
    CourseDetailsLessons,
    CourseDetailsMore,
    CourseDetailsMyLessons,
    CourseDetailsReviews,
    CourseVideoPlay,
    CreateNewPIN,
    CreateNewPassword,
    CustomerService,
    EReceipt,
    EditProfile,
    FillYourProfile,
    Fingerprint,
    ForgotPasswordEmail,
    ForgotPasswordMethods,
    ForgotPasswordPhoneNumber,
    HelpCenter,
    InviteFriends,
    Login,
    MentorProfile,
    MostPopularCourses,
    MyBookmark,
    Notifications,
    OTPVerification,
    Onboarding2,
    Onboarding3,
    Onboarding4,
    Search,
    SelectPaymentMethods,
    SettingsLanguage,
    SettingsNotifications,
    SettingsPrivacyPolicy,
    SettingsSecurity,
    Signup,
    TopMentors,
    Welcome,
} from '../screens'
import BottomTabNavigation from './BottomTabNavigation'
import SettingsPayment from '../screens/SettingsPayment'
import AddPostScreen from '../screens/AddNewScreen'
import TermsOfService from '../screens/Terms'
import * as Sentry from '@sentry/react-native'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    const [initialRoute, setInitialRoute] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const determineInitialRoute = async () => {
            try {
                // Check if it's the first launch
                const alreadyLaunched =
                    await AsyncStorage.getItem('alreadyLaunched')
                const userToken = await AsyncStorage.getItem('userToken') // Check if user is logged in

                let route = 'Onboarding1' // Default route
                if (alreadyLaunched === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    route = 'Onboarding1' // Navigate to Onboarding screens on first launch
                } else if (userToken) {
                    route = 'Main' // Navigate to Main screen if logged in
                } else {
                    route = 'Onboarding1' // Navigate to Login screen otherwise
                }

                // Log the initial route and send to Sentry
                console.log('Determined Initial Route:', route)
                Sentry.captureMessage('App started successfully', {
                    level: 'info',
                    extra: {
                        initialRoute: route,
                    },
                })

                setInitialRoute(route)
            } catch (error) {
                console.error('Error determining initial route:', error)
                setInitialRoute('Login') // Fallback to Login in case of an error
            } finally {
                setIsLoading(false)
            }
        }

        determineInitialRoute()
    }, [])

    if (isLoading) {
        return null // Render a loader or any other placeholder while determining the route
    }

    return (
        <NavigationContainer
            onStateChange={(state) => {
                console.log('State object:', state) // Debugging state object

                if (state) {
                    const currentScreen = state.routes?.[state.index]?.name
                    console.log(`Navigated to: ${currentScreen}`) // Expected log
                } else {
                    console.warn('No state available in onStateChange.')
                }
            }}
        >
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={initialRoute}
            >
                <Stack.Screen name="Onboarding1" component={Onboarding1} />
                <Stack.Screen name="Onboarding2" component={Onboarding2} />
                <Stack.Screen name="Onboarding3" component={Onboarding3} />
                <Stack.Screen name="Onboarding4" component={Onboarding4} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerLeft: () => null, // Removes the back button
                    }}
                />

                <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{
                        presentation: 'modal',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ForgotPasswordMethods"
                    component={ForgotPasswordMethods}
                />
                <Stack.Screen
                    name="ForgotPasswordEmail"
                    component={ForgotPasswordEmail}
                />
                <Stack.Screen
                    name="ForgotPasswordPhoneNumber"
                    component={ForgotPasswordPhoneNumber}
                />
                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerification}
                />
                <Stack.Screen
                    name="CreateNewPassword"
                    component={CreateNewPassword}
                />
                <Stack.Screen
                    name="FillYourProfile"
                    component={FillYourProfile}
                />
                <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
                <Stack.Screen name="Fingerprint" component={Fingerprint} />
                <Stack.Screen name="Main" component={BottomTabNavigation} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen
                    name="SettingsNotifications"
                    component={SettingsNotifications}
                />
                <Stack.Screen
                    name="SettingsPayment"
                    component={SettingsPayment}
                />
                <Stack.Screen name="AddNewCard" component={AddNewCard} />
                <Stack.Screen
                    name="SettingsSecurity"
                    component={SettingsSecurity}
                />
                <Stack.Screen name="ChangePIN" component={ChangePIN} />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                />
                <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
                <Stack.Screen
                    name="SettingsLanguage"
                    component={SettingsLanguage}
                />
                <Stack.Screen
                    name="SettingsPrivacyPolicy"
                    component={SettingsPrivacyPolicy}
                />
                <Stack.Screen name="InviteFriends" component={InviteFriends} />
                <Stack.Screen name="HelpCenter" component={HelpCenter} />
                <Stack.Screen
                    name="CustomerService"
                    component={CustomerService}
                />
                <Stack.Screen name="EReceipt" component={EReceipt} />
                <Stack.Screen name="Call" component={Call} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="CourseDetails" component={CourseDetails} />
                <Stack.Screen
                    name="CourseVideoPlay"
                    component={CourseVideoPlay}
                />
                <Stack.Screen name="Terms" component={TermsOfService} />
                <Stack.Screen
                    name="CourseDetailsLessons"
                    component={CourseDetailsLessons}
                />
                <Stack.Screen
                    name="MostPopularCourses"
                    component={MostPopularCourses}
                />
                <Stack.Screen
                    name="BookNow"
                    component={AddPostScreen}
                    options={{
                        presentation: 'transparentModal',
                        headerShown: false,
                        cardStyle: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    }}
                />
                <Stack.Screen name="TopMentors" component={TopMentors} />
                <Stack.Screen name="MyBookmark" component={MyBookmark} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen
                    name="CourseDetailsMore"
                    component={CourseDetailsMore}
                />
                <Stack.Screen
                    name="CourseDetailsReviews"
                    component={CourseDetailsReviews}
                />
                <Stack.Screen name="MentorProfile" component={MentorProfile} />
                <Stack.Screen
                    name="CourseDetailsMyLessons"
                    component={CourseDetailsMyLessons}
                />
                <Stack.Screen
                    name="SelectPaymentMethods"
                    component={SelectPaymentMethods}
                />
                <Stack.Screen
                    name="ConfirmPayment"
                    component={ConfirmPayment}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Sentry.wrap(AppNavigation)
