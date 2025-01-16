import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native'
import axios from 'axios'
import { COLORS, SIZES } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeProvider'
import Skeleton from '../screens/SkeletonLoader'

//FOR RENT
const MyCompletedCourses = () => {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const { colors, dark } = useTheme()

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/properties?property_status=28&_embed'
                )

                // Map through the properties and add the featured image
                const propertiesWithImages = response.data.map((property) => {
                    const featuredImage =
                        property._embedded?.['wp:featuredmedia']?.[0]
                            ?.source_url || null

                    return {
                        ...property,
                        featured_image: featuredImage,
                    }
                })

                setProperties(propertiesWithImages)
            } catch (error) {
                console.error('Error fetching properties:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperties()
    }, [])

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('CourseDetailsMore', {
                    property: item,
                })
            }
            style={[
                styles.cardContainer,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    shadowColor: dark ? COLORS.black : '#FAFAFA',
                    shadowOpacity: dark ? 0 : 0.2,
                    shadowRadius: dark ? 0 : 4,
                    elevation: dark ? 0 : 1,
                },
            ]}
        >
            <View style={styles.cardLeft}>
                {/* Display Image or Placeholder */}
                {item.featured_image ? (
                    <Image
                        source={{ uri: item.featured_image }}
                        resizeMode="cover"
                        style={styles.image}
                    />
                ) : (
                    <View
                        style={[styles.image, { backgroundColor: 'lightgray' }]}
                    >
                        <Text style={{ textAlign: 'center' }}>No Image</Text>
                    </View>
                )}
                <View style={styles.courseInfo}>
                    <Text
                        style={[
                            styles.courseName,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        {item.title.rendered}
                    </Text>
                    <Text style={styles.courseDuration}>
                        Price:{' '}
                        {item.property_meta?.fave_property_price?.[0] ||
                            'Not Available'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: 'center', alignItems: 'center' },
                ]}
            >
                <Skeleton />{' '}
            </View>
        )
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite },
            ]}
        >
            <FlatList
                data={properties}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiaryWhite,
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        width: SIZES.width - 32,
        height: 112,
        marginVertical: 6,
        borderRadius: 12,
        paddingHorizontal: 12,
        elevation: 1,
        shadowColor: '#FAFAFA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        height: 84,
        width: 84,
        borderRadius: 16,
        marginRight: 12,
    },
    courseName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
        marginTop: 12,
        marginBottom: 4,
    },
    courseDuration: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
    courseInfo: {
        width: SIZES.width - 230,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
})

export default MyCompletedCourses
