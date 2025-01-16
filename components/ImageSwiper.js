import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'

const ImageSlider = ({ property_images }) => {
    const [imageUrls, setImageUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const screenWidth = Dimensions.get('window').width

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                const urls = await Promise.all(
                    property_images.map(async (id) => {
                        const response = await fetch(
                            `https://ikoyiproperty.com/wp-json/wp/v2/media/${id}`
                        )
                        const data = await response.json()
                        return data.source_url // Extract the image URL
                    })
                )
                setImageUrls(urls)
            } catch (error) {
                console.error('Error fetching image URLs:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchImageUrls()
    }, [property_images])

    const renderImageItem = ({ item }) => (
        <Image
            source={{ uri: item }}
            style={[styles.image, { width: screenWidth }]}
            resizeMode="cover"
        />
    )

    const handleScrollEnd = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const currentSlide = Math.round(contentOffsetX / screenWidth)
        setCurrentIndex(currentSlide)
    }

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loader}
            />
        )
    }

    return (
        <View>
            <FlatList
                data={imageUrls}
                horizontal
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderImageItem}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
            />
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                    {currentIndex + 1}/{imageUrls.length}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 400, // Adjust height to fit your design
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterContainer: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    counterText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
})

export default ImageSlider
