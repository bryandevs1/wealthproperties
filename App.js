import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useEffect } from 'react'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox, View, Text } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { BookmarkProvider } from './components/BookmarkContext'
import * as Sentry from '@sentry/react-native'
import { ErrorBoundary } from '@sentry/react-native'

Sentry.init({
    dsn: 'https://a712da57dd7f6ed2482750da9f5e8bc6@o4508652891144192.ingest.us.sentry.io/4508652933218304',
    tracesSampleRate: 1.0,
    debug: true, // Enable debug logs for Sentry
    beforeBreadcrumb: (breadcrumb) => {
        // Optional: Filter or modify breadcrumbs here
        console.log('Sentry Breadcrumb:', breadcrumb) // Debugging breadcrumbs
        return breadcrumb
    },
})

LogBox.ignoreAllLogs()

SplashScreen.preventAutoHideAsync()

export default function App() {
    const [fontsLoaded] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            console.log('Hiding SplashScreen') // Log for SplashScreen hiding
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    useEffect(() => {
        if (fontsLoaded) {
            console.log('Fonts have loaded.') // Log when fonts are loaded
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    useEffect(() => {
        console.log('App has started.') // Log when app starts
        Sentry.addBreadcrumb({
            category: 'App',
            message: 'App has started.',
            level: 'info',
        })
    }, [])

    if (!fontsLoaded) {
        console.log('Fonts are not loaded yet, showing loading screen.') // Log while loading fonts
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    console.log('Rendering AppNavigation') // Log to confirm AppNavigation is rendering

    return (
        <ThemeProvider>
            <ErrorBoundary
                fallback={
                    <View>
                        <Text>An error occurred.</Text>
                    </View>
                }
            >
                <SafeAreaProvider onLayout={onLayoutRootView}>
                    {console.log('Rendering AppNavigation')}{' '}
                    {/* Log for rendering navigation */}
                    <AppNavigation />
                </SafeAreaProvider>
            </ErrorBoundary>
        </ThemeProvider>
    )
}
