import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useEffect, useState } from 'react'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { BookmarkProvider } from './components/BookmarkContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'
import * as Location from 'expo-location'
import * as Camera from 'expo-camera'

Sentry.init({
    dsn: 'https://a712da57dd7f6ed2482750da9f5e8bc6@o4508652891144192.ingest.us.sentry.io/4508652933218304',
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
})

LogBox.ignoreAllLogs()

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [fontsLoaded] = useFonts(FONTS)
    const [locationPermissionGranted, setLocationPermissionGranted] =
        useState(false)
    const [cameraPermissionGranted, setCameraPermissionGranted] =
        useState(false)

    const requestPermissions = async () => {
        // Request Camera Permission
        const { status: cameraStatus } =
            await Camera.requestCameraPermissionsAsync()
        setCameraPermissionGranted(cameraStatus === 'granted')

        // Request Location Permission
        const { status: locationStatus } =
            await Location.requestForegroundPermissionsAsync()
        setLocationPermissionGranted(locationStatus === 'granted')
    }

    const onLayoutRootView = useCallback(async () => {
        if (
            fontsLoaded &&
            locationPermissionGranted &&
            cameraPermissionGranted
        ) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded, locationPermissionGranted, cameraPermissionGranted])

    useEffect(() => {
        const initializeSettings = async () => {
            const faceIDEnabled = await AsyncStorage.getItem('faceIDEnabled')
            console.log('Face ID Enabled:', faceIDEnabled === 'true')
        }
        initializeSettings()

        // Request permissions as soon as the app is opened
        requestPermissions()
    }, [])

    // Check if fonts are loaded and permissions are granted
    if (
        !fontsLoaded ||
        !locationPermissionGranted ||
        !cameraPermissionGranted
    ) {
        return null
    }

    return (
        <ThemeProvider>
            <SafeAreaProvider onLayout={onLayoutRootView}>
                <BookmarkProvider>
                    <AppNavigation />
                </BookmarkProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    )
}
