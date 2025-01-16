import {
    FlatList,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    ViewToken,
} from 'react-native'
import Animated, {
    Extrapolate,
    interpolate,
    SharedValue,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'

import { Button } from './src/components/Button'
import { Pagination } from './src/components/Pagination'
import { theme } from './src/constants/theme'
import { data, type Data } from './src/data/screens'

const RenderItem = ({
    item,
    index,
    x,
}: {
    item: Data
    index: number
    x: SharedValue<number>
}) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [0, 1, 0],
            Extrapolate.CLAMP
        )

        const translateYAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [100, 0, 100],
            Extrapolate.CLAMP
        )

        return {
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_WIDTH * 0.8,
            opacity: opacityAnimation,
            transform: [{ translateY: translateYAnimation }],
        }
    })

    const textAnimatedStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [0, 1, 0],
            Extrapolate.CLAMP
        )

        const translateYAnimation = interpolate(
            x.value,
            [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
            ],
            [100, 0, 100],
            Extrapolate.CLAMP
        )

        return {
            opacity: opacityAnimation,
            transform: [{ translateY: translateYAnimation }],
        }
    })

    return (
        <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
            <Animated.Image
                source={item.image}
                style={[imageAnimatedStyle, styles.image]}
            />

            <View style={styles.paginationContainer}>
                <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />
            </View>

            <Animated.View style={textAnimatedStyle}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemText}>{item.text}</Text>
            </Animated.View>
        </View>
    )
}

export function Onboarding1() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const flatListRef = useAnimatedRef<FlatList>()

    const flatListIndex = useSharedValue(0)
    const x = useSharedValue(0)

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: Array<ViewToken>
    }) => {
        flatListIndex.value = viewableItems[0].index ?? 0
    }

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x
        },
    })

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef as any}
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <RenderItem index={index} item={item} x={x} />
                )}
                onScroll={onScroll}
                scrollEventThrottle={16}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                pagingEnabled
                onViewableItemsChanged={onViewableItemsChanged}
            />

            {/* Pagination Dots */}

            {/* Footer Buttons */}
            <View style={styles.footerContainer}>
                <Button
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                    dataLength={data.length}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        marginTop: 90,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    itemTitle: {
        color: theme.colors.textColor,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    itemText: {
        color: theme.colors.textColor,
        textAlign: 'center',
        lineHeight: 20,
        marginHorizontal: 30,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
    },
    paginationContainer: {
        position: 'relative', // Keeps the dots fixed in one position
        bottom: 30, // Adjust this value to place it right below the picture
        width: '100%', // Ensures the dots are horizontally centered
        alignItems: 'center', // Centers the dots
        marginBottom: -50,
    },
})

// import React, { useState } from 'react'
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     SafeAreaView,
// } from 'react-native'
// import { images } from '../constants' // Assuming this contains your images

// const Onboarding = ({ navigation }) => {
//     const [currentIndex, setCurrentIndex] = useState(0)

//     const onboardingData = [
//         {
//             image: images.onb1, // Replace with your image paths
//             title: 'Explore Multiple Houses at Your Fingertips',
//             description:
//                 'Our app offers you the freedom to explore and compare multiple houses all in one place.',
//         },
//         {
//             image: images.onb2,
//             title: 'Sell Your House with maximum Confidence',
//             description:
//                 'Take control of your property journey by listing your house directly on our app. Reach a wide audience of potential buyers',
//         },
//         {
//             image: images.onb3,
//             title: 'Rent or Buy a House Today, Your Way',
//             description:
//                 "Whether you're looking to rent a cozy space or invest in your dream home, our app is your trusted partner.",
//         },
//     ]

//     const handleNext = () => {
//         if (currentIndex < onboardingData.length - 1) {
//             setCurrentIndex((prevIndex) => prevIndex + 1)
//         } else {
//             navigation.navigate('Login') // Navigate to the main app or login screen
//         }
//     }

//     const handleSkip = () => {
//         navigation.navigate('Login') // Skip to the main app or login screen
//     }

//     const isLastSlide = currentIndex === onboardingData.length - 1

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Image Section */}
//             <Text style={styles.title}>
//                 {onboardingData[currentIndex].title}
//             </Text>{' '}
//             <Image
//                 source={onboardingData[currentIndex].image}
//                 style={styles.image}
//                 resizeMode="contain"
//             />
//             {/* Title */}
//             {/* Description */}
//             <Text style={styles.description}>
//                 {onboardingData[currentIndex].description}
//             </Text>
//             {/* Navigation Buttons */}
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={styles.nextButton}
//                     onPress={handleNext}
//                 >
//                     <Text style={styles.nextButtonText}>
//                         {isLastSlide ? 'Get Started' : 'Next'}
//                     </Text>
//                 </TouchableOpacity>
//                 {!isLastSlide && (
//                     <TouchableOpacity
//                         onPress={handleSkip}
//                         style={styles.skipButton}
//                     >
//                         <Text style={styles.skipButtonText}>Skip</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//     },
//     image: {
//         width: '100%',
//         height: '60%',
//         marginTop: 0,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         textAlign: 'center',
//         marginTop: 50,
//     },
//     description: {
//         fontSize: 16,
//         fontWeight: '600',
//         letterSpacing: 1,
//         color: '#666',
//         textAlign: 'center',
//         marginTop: -70,
//         marginHorizontal: 20,
//     },
//     buttonContainer: {
//         width: '100%',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//         paddingHorizontal: 20,
//     },
//     nextButton: {
//         backgroundColor: '#F18C35', // Green color similar to the example
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//     },
//     nextButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     skipButton: {
//         marginLeft: 10,
//     },
//     skipButtonText: {
//         fontSize: 16,
//         color: '#28a745', // Matching the "Next" button color
//     },
// })

// export default Onboarding
