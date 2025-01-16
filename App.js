import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useEffect } from 'react'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { BookmarkProvider } from './components/BookmarkContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react-native'

Sentry.init({
    dsn: 'https://a712da57dd7f6ed2482750da9f5e8bc6@o4508652891144192.ingest.us.sentry.io/4508652933218304',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
})


// Ignore all log notifications
LogBox.ignoreAllLogs()

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [fontsLoaded] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    useEffect(() => {
        const initializeSettings = async () => {
            const faceIDEnabled = await AsyncStorage.getItem('faceIDEnabled')
            console.log('Face ID Enabled:', faceIDEnabled === 'true')
        }
        initializeSettings()
    }, [])

    // Check fontsLoaded after all hooks have been called
    if (!fontsLoaded) {
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
