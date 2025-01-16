import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    Dimensions,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { CourseAbout, CourseLessons, CourseReviews } from '../tabs'
import Button from '../components/Button'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import Swiper from 'react-native-swiper'
import ImageSlider from '../components/ImageSwiper'
import { ScrollView } from 'react-native-virtualized-view'
import axios from 'axios'
import ik from '../assets/images/ik.png'
import Skeleton from './SkeletonLoader'
import RBSheet from 'react-native-raw-bottom-sheet'

const renderScene = SceneMap({
    first: CourseAbout,
    second: CourseLessons,
    third: CourseReviews,
})

const CourseDetailsMore = ({ navigation, route }) => {
    const { property } = route.params
    const { propertyId } = route.params
    const capitalizeFirstLetter = (string) => {
        if (!string) return 'Unknown' // Handle undefined or empty values
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }
    const [isBookmarked, setIsBookmarked] = useState(false)
    const layout = useWindowDimensions()
    const { colors, dark } = useTheme()
    const refReportSheet = useRef()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'About', property: property },
        { key: 'second', title: 'Lessons' },
        { key: 'third', title: 'Reviews' },
    ])
    const [showFullDescription, setShowFullDescription] = useState(false)
    const description =
        "In this course, you'll learn everything you need to know about creating user-friendly and visually appealing digital experiences. Using Figma, a popular design tool, you'll discover how to turn your ideas into interactive prototypes and polished designs. Whether you're new to design or already have some experience, we'll cover all the basics and advanced techniques. From planning layouts to adding the final touches, we'll guide you through each step of the design process. By the end, you'll have the skills to design websites, apps, and more with confidence."

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription)
    }

    const truncatedDescription = showFullDescription
        ? description
        : description.slice(0, 150)

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: colors.background,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'semiBold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )

    const renderButtonTitle = () => {
        const price = property.property_meta.fave_property_price || 'N/A'
        return `Book Now - ₦ ${price}`
    }
    console.log(property.property_meta.fave_property_price)

    const propertyImages = property.property_meta.fave_property_images || []
    const imageBaseUrl = 'https://ikoyiproperty.com/wp-content/uploads/'
    console.log(property.property_meta.fave_property_images)
    const [authorName, setAuthorName] = useState('Africa Ikoyi')
    const [features, setFeatures] = useState([])
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [reportReason, setReportReason] = useState('')

    const handleReport = async () => {
        if (!reportReason.trim()) {
            Alert.alert('Error', 'Please provide a reason for reporting.')
            return
        }

        try {
            await axios.post(
                'https://back.ikoyiproperty.com:8443/report-post',
                {
                    postId: propertyId,
                    postTitle: property.title.rendered,
                    reason: reportReason,
                }
            )

            Alert.alert('Success', 'Report sent successfully.')
            setReportReason('')
            refReportSheet.current.close() // Close sheet after success
        } catch (error) {
            console.error('Error sending report:', error)
            Alert.alert('Error', 'Failed to send report.')
        }
    }
    useEffect(() => {
        // Fetch property details
        axios
            .get(
                `https://ikoyiproperty.com/wp-json/wp/v2/properties/${propertyId}`
            )
            .then((response) => {
                setProperty(response.data)

                // Fetch author details if author ID is present
                if (response.data.author) {
                    axios
                        .get(
                            `https://ikoyiproperty.com/wp-json/wp/v2/users/${response.data.author}`
                        )
                        .then((authorResponse) => {
                            setAuthorName(authorResponse.data.name)
                        })
                        .catch(() => {
                            setAuthorName('Africa Ikoyi')
                        })
                }
            })
            .catch((error) => {
                console.error('Error fetching property details:', error)
            })
    }, [propertyId])

    if (!property) {
        return <p>Loading property details...</p>
    }
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(
                    `https://ikoyiproperty.com/wp-json/wp/v2/properties/${propertyId}`
                )
                const renderedContent = response.data.content.rendered

                // Extract features from content.rendered
                const featureList = renderedContent
                    .split('<br />') // Split by line breaks
                    .filter((line) => line.includes('&#8211;')) // Find lines with features
                    .map((line) =>
                        line
                            .replace('&#8211;', '')
                            .replace(/<[^>]+>/g, '')
                            .trim()
                    ) // Clean up HTML and symbols

                setFeatures(featureList)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching property details:', error)
            }
        }

        fetchPropertyDetails()
    }, [propertyId])
    const renderColumns = () => {
        const columns = [[], []]
        features.forEach((feature, index) => {
            columns[index % 2].push(feature) // Distribute features into three columns
        })
        return columns
    }

    const columns = renderColumns()

    return isLoading ? (
        <Skeleton />
    ) : (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar hidden />
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerContainer}
            >
                <Image
                    source={icons.back}
                    resizeMode="contain"
                    style={styles.backIcon}
                />
            </TouchableOpacity>
            <ImageSlider
                property_images={property.property_meta.fave_property_images}
            />

            {/* course info */}
            <ScrollView>
                <View style={styles.courseInfoContainer}>
                    <View style={styles.titleContainer}>
                        <Text
                            style={[
                                styles.courseName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {property.title.rendered}
                        </Text>
                    </View>
                    {/* Reviews and rating container */}
                    <View style={styles.ratingContainer}>
                        <TouchableOpacity style={styles.categoryContainer}>
                            <Text style={styles.categoryName}>
                                {property.property_type}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Price container */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            ₦ {property.property_meta.fave_property_price[0]}
                        </Text>
                        <TouchableOpacity
                            onPress={() => refReportSheet.current.open()}
                        >
                            <Image
                                source={
                                    dark ? icons.shieldOutline : icons.shield
                                }
                                resizeMode="contain"
                                style={styles.courseVewIcon}
                            />
                            <Text style={{ color: dark ? '#fff' : '#000' }}>
                                Report
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* course resume container */}
                    <View style={styles.courseResumeContainer}>
                        <View style={styles.courseViewContainer}>
                            <Image
                                source={icons.locationOutline}
                                resizeMode="contain"
                                style={styles.courseViewIcon}
                            />
                            <Text
                                style={[
                                    styles.courseViewTitle,
                                    {
                                        color: dark
                                            ? COLORS.secondaryWhite
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {capitalizeFirstLetter(property.property_city)}
                            </Text>
                        </View>
                        <View style={styles.courseViewContainer}>
                            <Image
                                source={icons.bedOutline}
                                resizeMode="contain"
                                style={styles.courseViewIcon}
                            />
                            <Text
                                style={[
                                    styles.courseViewTitle,
                                    {
                                        color: dark
                                            ? COLORS.secondaryWhite
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {property.property_meta.fave_property_bedrooms}
                            </Text>
                        </View>
                        <View style={styles.courseViewContainer}>
                            <Image
                                source={icons.document2}
                                resizeMode="contain"
                                style={styles.courseViewIcon}
                            />
                            <Text
                                style={[
                                    styles.courseViewTitle,
                                    {
                                        color: dark
                                            ? COLORS.secondaryWhite
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {property.property_meta.fave_property_size[0]},{' '}
                                {
                                    property.property_meta
                                        .fave_property_size_prefix[0]
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separateLine} />
                </View>

                {/* Author Info */}
                <View style={styles.authorContainer}>
                    <Image source={ik} style={styles.authorImage} />
                    <View>
                        <Text
                            style={[
                                styles.authorName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {authorName || 'Unknown Author'}
                        </Text>
                        <Text
                            style={[
                                styles.authorRole,
                                {
                                    color: dark
                                        ? COLORS.gray
                                        : COLORS.greyscale500,
                                },
                            ]}
                        >
                            {property.author_role || 'Agent'}
                        </Text>
                    </View>
                </View>

                {/* <View>
                    <Text
                        style={[
                            styles.authorName,
                            {
                                color: dark ? colors.text : colors.text,
                            },
                        ]}
                    >
                        Description:
                    </Text>
                    <Text
                        style={[
                            styles.description,
                            {
                                color: dark ? colors.text : colors.text,
                            },
                        ]}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {property.description}
                    </Text>
                </View> */}
                <View>
                    <Text
                        style={[
                            styles.authorName,
                            {
                                color: dark ? colors.text : colors.text,
                            },
                        ]}
                    >
                        Features:
                    </Text>
                    {features.length > 0 ? (
                        <View style={styles.row}>
                            {columns.map((column, columnIndex) => (
                                <View key={columnIndex} style={styles.column}>
                                    {column.map((feature, featureIndex) => (
                                        <View
                                            key={featureIndex}
                                            style={styles.featureItem}
                                        >
                                            <MaterialIcons
                                                name="check"
                                                size={18}
                                                color="green"
                                                style={styles.icon}
                                            />
                                            <Text
                                                style={[
                                                    styles.featureText,
                                                    {
                                                        color: dark
                                                            ? colors.text
                                                            : colors.text,
                                                    },
                                                ]}
                                            >
                                                {feature}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text
                            style={[
                                styles.authorName,
                                {
                                    color: dark ? colors.text : colors.text,
                                },
                            ]}
                        >
                            No features available.
                        </Text>
                    )}
                </View>
            </ScrollView>
            <View
                style={[
                    styles.bottomContainer,
                    {
                        backgroundColor: colors.background,
                        borderTopColor: dark ? COLORS.dark3 : COLORS.gray,
                        borderWidth: dark ? 1 : 0.2,
                    },
                ]}
            >
                <Button
                    title={renderButtonTitle()} // Ensure the function is called here
                    filled
                    style={styles.bottomBtn}
                    onPress={() => navigation.navigate('BookNow')}
                />
                <RBSheet
                    ref={refReportSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={Dimensions.get('window').height * 0.8}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                        draggableIcon: {
                            backgroundColor: dark ? '#4A4A4A' : '#D3D3D3', // Adjust colors as needed
                            height: 4,
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 260,
                            backgroundColor: dark ? '#1C1C1C' : '#FFFFFF', // Dark or light background
                        },
                    }}
                >
                    <Text style={styles.sheetTitle}>Report Post</Text>
                    <TextInput
                        style={[
                            styles.textArea,
                            { color: dark ? '#FFFFFF' : '#000000' }, // Dark or light text
                        ]}
                        placeholder="Enter reason for reporting"
                        placeholderTextColor={dark ? '#A9A9A9' : '#696969'} // Placeholder colors
                        multiline
                        value={reportReason}
                        onChangeText={setReportReason}
                    />
                    <View style={styles.actions}>
                        <Button
                            title="Cancel"
                            style={{
                                width:
                                    (Dimensions.get('window').width - 32) / 2 -
                                    8,
                                backgroundColor: dark ? '#333333' : '#E6E6E6', // Button background
                                borderRadius: 32,
                            }}
                            textColor={dark ? '#FFFFFF' : '#007BFF'} // Button text color
                            onPress={() => refReportSheet.current.close()} // Close sheet on Cancel
                        />
                        <Button
                            title="Submit Report"
                            filled
                            style={styles.submitButton}
                            onPress={handleReport} // Handle report submission
                        />
                    </View>
                </RBSheet>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
    },
    column: {
        flex: 1,
        paddingHorizontal: 4,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    featureText: {
        fontSize: 18,
        flexShrink: 1, // Ensures text wraps within its column
        marginBottom: 70,
    },
    courseImage: {
        width: SIZES.width,
        height: SIZES.width * 0.625,
    },
    headerContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 999,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    courseName: {
        fontSize: 26,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    courseInfoContainer: {
        padding: 16,
    },
    carousel: {
        height: Dimensions.get('window').height * 0.4,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    categoryContainer: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: COLORS.transparentTertiary,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    starIcon: {
        width: 16,
        height: 16,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 22,
    },
    starTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.black,
    },
    priceContainer: {
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.primary,
    },
    oldPrice: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.gray,
        textDecorationLine: 'line-through',
        marginLeft: 10,
    },
    courseResumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    courseViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseViewIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    courseVewIcon: {
        width: 26,
        height: 26,
        tintColor: COLORS.primary,
    },
    courseViewTitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black,
        marginLeft: 6,
    },
    separateLine: {
        width: SIZES.width,
        height: 0.4,
        backgroundColor: COLORS.gray,
        marginTop: 16,
    },
    tabContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: 96,
        width: SIZES.width,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    bottomBtn: {
        width: SIZES.width - 32,
    },
    description: {
        fontSize: 14,
        marginVertical: 10,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    featureText: {
        fontSize: 14,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    authorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    authorRole: {
        fontSize: 14,
    },
    mentorCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mentorCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 999,
        marginRight: 16,
    },
    userFullname: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    position: {
        fontSize: 13,
        fontFamily: 'medium',
        color: 'gray',
    },
    chatBubbleIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'gray',
    },
    toolContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    toolIcon: {
        width: 32,
        height: 32,
        marginRight: 16,
    },
    toolName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.black,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        height: 100,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    submitButton: {
        width: (Dimensions.width - 32) / 2 - 8,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
})

export default CourseDetailsMore
