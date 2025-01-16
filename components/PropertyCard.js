import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { FontAwesome } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage

const PropertyCard = ({
    title,
    image,
    category,
    price,
    location,
    rating,
    onBookmarkToggle,
    onPress,
}) => {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const { colors, dark } = useTheme()

    const storageKey = `bookmark_${title}` // Unique key for each property

    // Load bookmark state from AsyncStorage when the component mounts
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(storageKey)
                if (value !== null) {
                    const bookmarkStatus = JSON.parse(value) // Parse the value correctly
                    setIsBookmarked(bookmarkStatus)
                    console.log(
                        `Loaded bookmark status for ${title}:`,
                        bookmarkStatus
                    )
                }
            } catch (error) {
                console.error('Failed to load bookmark status:', error)
            }
        }
        fetchBookmarkStatus()
    }, [storageKey, title])


    // Toggle bookmark state and save it to AsyncStorage
    const toggleBookmark = async () => {
        const newBookmarkStatus = !isBookmarked
        setIsBookmarked(newBookmarkStatus)

        try {
            if (newBookmarkStatus) {
                // Save the entire property details as a bookmark
                const propertyData = {
                    title,
                    image,
                    category,
                    price,
                    location,
                    rating,
                }
                await AsyncStorage.setItem(
                    storageKey,
                    JSON.stringify(propertyData)
                )
            } else {
                // Remove the bookmark
                await AsyncStorage.removeItem(storageKey)
            }
        } catch (error) {
            console.error('Failed to save/remove bookmark status:', error)
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: dark ? colors.card : colors.background,
                },
            ]}
        >
            <Image
                source={image}
                resizeMode="cover"
                style={styles.propertyImage}
            />
            <View style={{ flex: 1 }}>
                <View style={styles.topContainer}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryName}>{category}</Text>
                    </View>
                    {/* <TouchableOpacity onPress={toggleBookmark}>
                        <Image
                            source={
                                isBookmarked
                                    ? icons.bookmark2
                                    : icons.bookmark2Outline
                            }
                            resizeMode="contain"
                            style={[
                                styles.bookmarkIcon,
                                { tintColor: colors.primary },
                            ]}
                        />
                    </TouchableOpacity> */}
                </View>
                <Text
                    style={[
                        styles.title,
                        {
                            color: dark ? colors.text : colors.text,
                        },
                    ]}
                >
                    {title}
                </Text>
                <View style={styles.addressContainer}>
                    <Text
                        style={[
                            styles.location,
                            {
                                color: dark ? colors.text : colors.text,
                            },
                        ]}
                    >
                        <Image
                            source={icons.locationOutline}
                            resizeMode="contain"
                            style={[
                                styles.locationIcon,
                                {
                                    tintColor: dark ? colors.text : colors.text,
                                },
                            ]}
                        />
                        {location}
                    </Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₦ {price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 148,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginVertical: 8,
    },
    propertyImage: {
        width: 124,
        height: 124,
        borderRadius: 16,
        marginRight: 16,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10, // Adjust for spacing if needed
    },
    categoryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: COLORS.transparentTertiary,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    locationIcon: {
        width: 15, // Adjust size to your preference
        height: 15,
        color: '#fff',
        tintColor: COLORS.greyscale900,
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
    },
    title: {
        fontSize: 16,
        fontFamily: 'bold',
        marginVertical: 6,
    },
    location: {
        fontSize: 14,
        fontFamily: 'medium',
        marginBottom: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rating: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.gray,
    },
})

export default PropertyCard
