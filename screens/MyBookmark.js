import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { category, myBookmarkCourses as initialBookmarkCourses } from '../data'
import BookmarkCourseCard from '../components/BookmarkCourseCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useBookmarks } from '../components/BookmarkContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PropertyCard from '../components/PropertyCard'

const MyBookmark = ({ navigation }) => {
    const refRBSheet = useRef()
    const { dark, colors } = useTheme()
    const [bookmarkedItems, setBookmarkedItems] = useState([])

    // Fetch all bookmarks from AsyncStorage on mount
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys()
                const storedBookmarks = await AsyncStorage.multiGet(keys)

                const bookmarks = storedBookmarks
                    .filter(([key]) => key.startsWith('bookmark_'))
                    .map(([key, value]) => {
                        try {
                            return JSON.parse(value) // Safely parse the stored value
                        } catch (e) {
                            console.warn(`Failed to parse bookmark: ${key}`, e)
                            return null
                        }
                    })
                    .filter((bookmark) => bookmark !== null) // Remove invalid entries

                console.log('Bookmarks:', bookmarks) // Debug
                setBookmarkedItems(bookmarks)
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error)
            }
        }

        fetchBookmarks()
    }, [])

    // Remove bookmark by title
    const removeBookmark = async (title) => {
        try {
            await AsyncStorage.removeItem(`bookmark_${title}`)
            const updatedItems = bookmarkedItems.filter(
                (item) => item.title !== title
            )
            setBookmarkedItems(updatedItems)
        } catch (error) {
            console.error('Failed to remove bookmark:', error)
        }
    }

    const renderHeader = () => (
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
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    My Bookmark
                </Text>
            </View>
        </View>
    )
    const clearAllBookmarks = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys()
            const bookmarkKeys = keys.filter((key) =>
                key.startsWith('bookmark_')
            )

            await AsyncStorage.multiRemove(bookmarkKeys)

            console.log('All bookmarks cleared.')
        } catch (error) {
            console.error('Failed to clear bookmarks:', error)
        }
    }
    const renderMyBookmarkCourses = () => {
        if (bookmarkedItems.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No bookmarked properties found.
                    </Text>
                </View>
            )
        }

        return (
            <FlatList
                data={bookmarkedItems}
                keyExtractor={
                    (item) => (item.id ? item.id.toString() : item.title) // Use title as a fallback
                }
                renderItem={({ item }) => (
                    <PropertyCard
                        title={item.title}
                        image={item.image}
                        category={item.category}
                        price={item.price}
                        location={item.location}
                        rating={item.rating}
                        onBookmarkToggle={() => {
                            console.log('Toggled bookmark for:', item.title)
                            removeBookmark(item.title) // Use title or id depending on uniqueness
                        }}
                        onPress={() =>
                            navigation.navigate('CourseDetailsMore', {
                                property: item,
                            })
                        }
                    />
                )}
            />
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: dark
                        ? COLORS.dark2
                        : COLORS.secondaryWhite,
                },
            ]}
        >
            {renderHeader()}
            {renderMyBookmarkCourses()}
        </SafeAreaView>
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
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderMyBookmarkCourses()}
                </ScrollView>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={380}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.greyscale300
                            : COLORS.greyscale300,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 380,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: 'center',
                        width: '100%',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.white : COLORS.black,
                        },
                    ]}
                >
                    Remove from Bookmark?
                </Text>
                <View style={styles.separateLine} />

                <View style={styles.selectedBookmarkContainer}>
                    <BookmarkCourseCard
                        name={selectedBookmarkItem?.name}
                        image={selectedBookmarkItem?.image}
                        category={selectedBookmarkItem?.category}
                        price={selectedBookmarkItem?.price}
                        isOnDiscount={selectedBookmarkItem?.isOnDiscount}
                        oldPrice={selectedBookmarkItem?.oldPrice}
                        rating={selectedBookmarkItem?.rating}
                        numStudents={selectedBookmarkItem?.numStudents}
                        onPress={() => console.log('Course Card')}
                        categoryId={selectedBookmarkItem?.categoryId}
                        containerStyles={{
                            backgroundColor: dark ? COLORS.dark3 : COLORS.white,
                        }}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
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
                        title="Yes, Remove"
                        filled
                        style={styles.removeButton}
                        onPress={handleRemoveBookmark}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 50,
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
    categoryContainer: {
        marginTop: 0,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
    },
    bottomSubtitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 12,
    },
    selectedBookmarkContainer: {
        marginVertical: 16,
    },
    separateLine: {
        width: '100%',
        height: 0.2,
        backgroundColor: COLORS.greyscale300,
        marginHorizontal: 16,
    },
})

export default MyBookmark
