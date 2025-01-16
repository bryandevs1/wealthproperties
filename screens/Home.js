import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import SectionHeader from '../components/SectionHeader'
import { banners, category, mostPopularCourses, topMentors } from '../data'
import CourseCard from '../components/CourseCard'
import PropertyCard from '../components/PropertyCard'
import { useTheme } from '../theme/ThemeProvider'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

import axios from 'axios'
import SkeletonLoader from './SkeletonLoader'
import Skeleton from './SkeletonLoaderP'
import { useBookmarks } from '../components/BookmarkContext'

const Home = ({ navigation }) => {
    const [image, setImage] = useState(images.user1)
    const [userId, setUserId] = useState(null)
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const { colors, dark } = useTheme()
    const [userName, setUserName] = useState('')
    const [location, setLocation] = useState(null)
    const [address, setAddress] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [bannerData, setBannerData] = useState([])
    const [properties, setProperties] = useState([])
    const [propertyTypes, setPropertyTypes] = useState([])
    const [selectedPropertyType, setSelectedPropertyType] = useState('all')
    const typeFlatListRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [propertyTypeLoading, setPropertyTypeLoading] = useState(true)
    const { bookmarks, toggleBookmark } = useBookmarks()
    const [currentPage, setCurrentPage] = useState(1) // Start from page 1
    const [hasMore, setHasMore] = useState(true) // Determine if more posts are available

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Retrieve the token from AsyncStorage
                const token = await AsyncStorage.getItem('userToken')
                if (!token) {
                    Alert.alert('Error', 'No token found. Please log in.')
                    return
                }

                // Make an API call to fetch user details
                const response = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/users/me',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Use the token for authentication
                        },
                    }
                )

                const userName = response.data.name // Adjust the field based on your API response
                console.log('User Name:', userName)

                // Set the username in state to display it
                setUserName(userName)
            } catch (error) {
                console.error(
                    'Error fetching user details:',
                    error.response?.data || error.message
                )
                Alert.alert(
                    'Error',
                    'Failed to fetch user details. Please try again.'
                )
            }
        }

        fetchUserDetails() // Call the function inside useEffect
    }, [])

    /**
     * render header
     */
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
        const fetchLocationAndAddress = async () => {
            try {
                // Request permissions
                const { status } =
                    await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied.')
                    return
                }

                // Get the user's current location
                const userLocation = await Location.getCurrentPositionAsync({})
                const { latitude, longitude } = userLocation.coords
                setLocation({ latitude, longitude })

                // Reverse geocode to get address
                const addressResult = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                })
                setAddress(addressResult[0]) // Typically, the first result is sufficient
            } catch (error) {
                setErrorMsg('Failed to fetch location or address.')
                console.error(error)
            }
        }

        fetchLocationAndAddress()

        fetchUserData()
    }, [])

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    {/* <Text
                        style={[
                            styles.greeting,
                            { color: dark ? 'white' : 'black' },
                        ]}
                    >
                        Hi👋,{' '}
                        <Text
                            style={[
                                styles.title,
                                { color: dark ? 'white' : 'black' },
                            ]}
                        >
                            {userName}
                        </Text>
                    </Text> */}
                    <View
                        style={[
                            styles.addressContainer,
                            { flexDirection: 'row', alignItems: 'center' },
                        ]}
                    >
                        <Image
                            source={icons.locationOutline}
                            resizeMode="contain"
                            style={[
                                styles.locationIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.secondaryWhite
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.titlel,
                                {
                                    color: dark ? 'white' : 'black',
                                    marginLeft: 5,
                                },
                            ]}
                        >
                            {address?.city || 'N/A'}, {address?.region || 'N/A'}
                            , {address?.country || 'N/A'},{' '}
                        </Text>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={
                                image && image !== 'null'
                                    ? { uri: String(image) }
                                    : images.user1
                            }
                            resizeMode="contain"
                            style={styles.userIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * Render search bar
     */
    const renderSearchBar = () => {
        const handleInputFocus = () => {
            // Redirect to another screen
            navigation.navigate('Search')
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={[
                    styles.searchBarContainer,
                    {
                        backgroundColor: dark
                            ? COLORS.dark2
                            : COLORS.secondaryWhite,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={styles.searchInput}
                    onFocus={handleInputFocus}
                />
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true)

            try {
                const properties = await fetchPropertiesByType('all')
                setProperties(properties)
                setBannerData(properties.slice(0, 7))

                const typeRes = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/property_type'
                )
                const formattedPropertyTypes = [
                    { id: 'all', name: '🔥 All' },
                    ...typeRes.data.map((type) => ({
                        id: type.id.toString(),
                        name: type.name,
                    })),
                ]
                setPropertyTypes(formattedPropertyTypes)
            } catch (error) {
                console.error('Error fetching initial data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchInitialData()
    }, [])

    const capitalizeFirstLetter = (string) => {
        if (!string) return 'Unknown' // Handle undefined or empty values
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }

    const fetchPropertiesByType = async (propertyType, page = 1) => {
        const typeFilter =
            propertyType === 'all' ? '' : `&property_type=${propertyType}`
        setPropertyTypeLoading(true)
        try {
            const response = await axios.get(
                `https://ikoyiproperty.com/wp-json/wp/v2/properties?_embed&per_page=10&page=${page}${typeFilter}`
            )

            return response.data.map((property) => ({
                ...property,
                featured_image:
                    property._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    null,
            }))
        } catch (error) {
            console.error('Error fetching properties by type:', error)
            return []
        } finally {
            setPropertyTypeLoading(false)
        }
    }
    const loadMoreProperties = async () => {
        const nextPage = currentPage + 1
        const additionalProperties = await fetchPropertiesByType(
            selectedPropertyType,
            nextPage
        )

        if (additionalProperties.length === 0) {
            setHasMore(false) // No more properties available
        } else {
            setProperties((prevProperties) => [
                ...prevProperties,
                ...additionalProperties,
            ])
            setCurrentPage(nextPage) // Update current page
        }
    }

    const handlePropertyTypeSelect = async (typeName) => {
        setSelectedPropertyType(typeName)

        const selectedIndex = propertyTypes.findIndex(
            (type) => type.name.toLowerCase() === typeName.toLowerCase()
        )

        // Scroll to the selected index
        if (typeFlatListRef.current) {
            typeFlatListRef.current.scrollToIndex({
                index: selectedIndex,
                animated: true,
            })
        }

        const selectedType = propertyTypes[selectedIndex]
        const typeId = selectedType?.id || 'all'
        const filteredProperties = await fetchPropertiesByType(typeId)
        setProperties(filteredProperties)
    }

    // Render property item
    const renderPropertyItem = ({ item }) => (
        <PropertyCard
            title={item.title.rendered}
            image={
                item.featured_image
                    ? { uri: String(item.featured_image) }
                    : require('../assets/images/users/user1.jpeg') // Local fallback image
            }
            category={item.property_type || 'Unknown'}
            price={item.property_meta.fave_property_price[0] || 'Not Available'}
            location={capitalizeFirstLetter(item.property_city) || 'Unknown'}
            isBookmarked={bookmarks.some((b) => b.id === property.id)}
            onBookmarkToggle={() => toggleBookmark(property)}
            onPress={() =>
                navigation.navigate('CourseDetailsMore', {
                    property: item,
                    propertyId: item.id,
                })
            }
        />
    )

    // Render property type filter
    const renderPropertyTypeItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor:
                    selectedPropertyType === item.name
                        ? COLORS.primary
                        : 'transparent',
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => handlePropertyTypeSelect(item.name)} // Pass the name instead of id
        >
            <Text
                style={{
                    color:
                        selectedPropertyType === item.name
                            ? COLORS.white
                            : dark
                              ? 'white'
                              : 'black',
                }}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    )

    const renderPopularCourses = () => (
        <View>
            <SectionHeader
                title="Featured Listings"
                onPress={() => navigation.navigate('MostPopularCourses')}
            />
            <FlatList
                ref={typeFlatListRef} // Attach the reference
                data={propertyTypes}
                horizontal
                renderItem={renderPropertyTypeItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
            />
            {propertyTypeLoading ? (
                <View style={styles.loaderContainer}>
                    <Skeleton />
                </View>
            ) : properties && properties.length > 0 ? ( // Check if properties has data
                <FlatList
                    data={properties}
                    renderItem={renderPropertyItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.propertiesList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                        No properties available for this type currently
                    </Text>
                </View>
            )}
            {hasMore && (
                <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={loadMoreProperties}
                >
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            )}
        </View>
    )

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
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <SkeletonLoader />
                    </View>
                ) : (
                    <>
                        {renderHeader()}
                        {renderSearchBar()}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {renderPopularCourses()}
                        </ScrollView>
                    </>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: SIZES.width,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: 200,
    },
    bannerDetails: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Centers the loader horizontally and vertically
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    bannerSubtitle: {
        fontSize: 14,
        color: 'white',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'black',
    },
    loadMoreButton: {
        marginVertical: 10,
        marginBottom: 40,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        alignItems: 'center',
    },
    loadMoreText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32,
    },
    viewLeft: {
        flexDirection: 'column',
        gap: 10,
        alignItems: 'left',
    },
    greeeting: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    viewNameContainer: {
        marginLeft: 12,
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8,
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10, // Adjust for spacing if needed
    },
    locationIcon: {
        width: 20, // Adjust size to your preference
        height: 20,
        color: '#fff',
        tintColor: COLORS.greyscale900,
    },
    titlel: {
        fontSize: 16,
        fontWeight: '500', // Adjust as per your design
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerBottomContainer: {
        marginTop: 8,
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
        marginTop: 4,
    },
    mentorContainer: {
        marginRight: 10,
        alignItems: 'center',
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999,
    },
    firstName: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.dark2,
        marginTop: 6,
    },
    bannerItemContainer: {
        width: '100%',
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    propertiesList: {
        marginBottom: 20,
    },
    propertyCard: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: COLORS.secondaryWhite,
        borderRadius: 12,
        overflow: 'hidden',
    },
    propertyImage: {
        width: 100,
        height: 100,
    },
    propertyInfo: {
        flex: 1,
        padding: 12,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    propertyLocation: {
        fontSize: 14,
        color: COLORS.gray,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
})

export default Home
