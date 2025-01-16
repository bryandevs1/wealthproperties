import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { allCourses, allMentors, category, ratings } from '../data'
import CourseCard from '../components/CourseCard'
import MentorCard from '../components/MentorCard'
import NotFoundCard from '../components/NotFoundCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { FontAwesome } from '@expo/vector-icons'
import axios from 'axios'
import PropertyCard from '../components/PropertyCard'
import { useBookmarks } from '../components/BookmarkContext'

// Handler slider
const CustomSliderHandle = ({ enabled, markerStyle }) => {
    return (
        <View
            style={[
                markerStyle,
                {
                    backgroundColor: enabled ? COLORS.primary : 'lightgray',
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                },
            ]}
        />
    )
}

const Search = ({ navigation }) => {
    const refRBSheet = useRef()
    const { dark, colors } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCourses, setFilteredCourses] = useState(allCourses)
    const [resultsCount, setResultsCount] = useState(0)
    const [priceRange, setPriceRange] = useState([0, 100]) // Initial price range
    const [properties, setProperties] = useState([])
    const [propertyTypes, setPropertyTypes] = useState([])
    const [selectedPropertyType, setSelectedPropertyType] = useState('all')
    const typeFlatListRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [propertyTypeLoading, setPropertyTypeLoading] = useState(true)
    const { bookmarks, toggleBookmark } = useBookmarks()

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true)

            try {
                const properties = await fetchPropertiesByType('all')
                setProperties(properties)

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

    const renderPropertyItem = ({ item }) => (
        <PropertyCard
            title={item.title.rendered}
            image={{ uri: item.featured_image }}
            category={item.property_type || 'Unknown'}
            price={item.property_meta.fave_property_price[0] || 'Not Available'}
            location={capitalizeFirstLetter(item.property_city) || 'Unknown'}
            isBookmarked={bookmarks.some((b) => b.id === property.id)}
            onBookmarkToggle={() => toggleBookmark(property)}
            onPress={() =>
                navigation.navigate('CourseDetailsMore', {
                    property: item,
                })
            }
        />
    )
    const fetchPropertiesByType = async (propertyType) => {
        const typeFilter =
            propertyType === 'all' ? '' : `&property_type=${propertyType}`
        setPropertyTypeLoading(true)
        try {
            const response = await axios.get(
                `https://ikoyiproperty.com/wp-json/wp/v2/properties?_embed&per_page=100${typeFilter}`
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

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedCategories.includes(item.id)
                    ? COLORS.primary
                    : 'transparent',
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => toggleCategory(item.id)}
        >
            <Text
                style={{
                    color: selectedCategories.includes(item.id)
                        ? COLORS.white
                        : COLORS.primary,
                }}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    )

    const toggleCategory = (categoryId) => {
        const updatedCategories = [...selectedCategories]
        const index = updatedCategories.indexOf(categoryId)

        if (index === -1) {
            updatedCategories.push(categoryId)
        } else {
            updatedCategories.splice(index, 1)
        }

        setSelectedCategories(updatedCategories)
    }

    useEffect(() => {
        handleSearch()
    }, [searchQuery])
    const handleSearch = () => {
        if (!searchQuery) {
            setFilteredCourses(properties) // Show all properties if no search query
            setResultsCount(properties.length)
            return
        }

        const filteredProperties = properties.filter((property) =>
            property.title.rendered
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )

        setFilteredCourses(filteredProperties)
        setResultsCount(filteredProperties.length)
    }

    const handleSliderChange = (values) => {
        setPriceRange(values)
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[
                                styles.backIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Search
                    </Text>
                </View>
            </View>
        )
    }

    const renderContent = () => {
        return (
            <View>
                {/* Search Bar */}
                <View
                    style={[
                        styles.searchBarContainer,
                        {
                            backgroundColor: dark
                                ? COLORS.dark2
                                : COLORS.secondaryWhite,
                        },
                    ]}
                >
                    <TouchableOpacity onPress={handleSearch}>
                        <Image
                            source={icons.search2}
                            resizeMode="contain"
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={COLORS.gray}
                        style={[
                            styles.searchInput,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    {/* <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.filter}
                            resizeMode="contain"
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity> */}
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Results container */}
                    <View>
                        {searchQuery && (
                            <View style={styles.resultContainer}>
                                <View style={styles.resultLeftView}>
                                    <Text
                                        style={[
                                            styles.subtitle,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        Results for "
                                    </Text>
                                    <Text
                                        style={[
                                            styles.subtitle,
                                            { color: COLORS.primary },
                                        ]}
                                    >
                                        {searchQuery}
                                    </Text>
                                    <Text style={styles.subtitle}>"</Text>
                                </View>
                                <Text style={styles.subResult}>
                                    {resultsCount} found
                                </Text>
                            </View>
                        )}
                        {/* Courses result list */}
                        <View style={{ marginVertical: 16 }}>
                            {resultsCount && resultsCount > 0 ? (
                                <FlatList
                                    data={filteredCourses}
                                    renderItem={renderPropertyItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    style={styles.propertiesList}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : (
                                <NotFoundCard />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
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
                {renderHeader()}
                <View>{renderContent()}</View>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={480}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.dark3 : '#000',
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 480,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: 'center',
                        },
                    }}
                >
                    <Text
                        style={[
                            styles.bottomTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Filter
                    </Text>
                    <View style={styles.separateLine} />
                    <View style={{ width: SIZES.width - 32 }}>
                        <Text
                            style={[
                                styles.sheetTitle,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Category
                        </Text>
                        <FlatList
                            data={category}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderCategoryItem}
                        />
                        <Text
                            style={[
                                styles.sheetTitle,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Filter
                        </Text>
                        <MultiSlider
                            values={priceRange}
                            sliderLength={SIZES.width - 32}
                            onValuesChange={handleSliderChange}
                            min={0}
                            max={100}
                            step={1}
                            allowOverlap={false}
                            snapped
                            minMarkerOverlapDistance={40}
                            customMarker={CustomSliderHandle}
                            selectedStyle={{ backgroundColor: COLORS.primary }}
                            unselectedStyle={{ backgroundColor: 'lightgray' }}
                            containerStyle={{ height: 40 }}
                            trackStyle={{ height: 3 }}
                        />
                    </View>
                    <View style={styles.separateLine} />
                    <View style={styles.bottomContainer}>
                        <Button
                            title="Reset"
                            style={{
                                width: (SIZES.width - 32) / 2 - 8,
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark
                                    ? COLORS.dark3
                                    : COLORS.tansparentPrimary,
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => refRBSheet.current.close()}
                        />
                        <Button
                            title="Filter"
                            filled
                            style={styles.logoutButton}
                            onPress={() => refRBSheet.current.close()}
                        />
                    </View>
                </RBSheet>
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
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
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
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    tabBtn: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    selectedTab: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    tabBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    selectedTabText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
        textAlign: 'center',
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    subResult: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    resultLeftView: {
        flexDirection: 'row',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: SIZES.width,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginVertical: 12,
    },
})

export default Search
