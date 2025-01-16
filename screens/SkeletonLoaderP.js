import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonLoading from 'expo-skeleton-loading'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const Skeleton = () => {
    const { colors, dark } = useTheme()

    // Adjust skeleton colors based on the theme
    const skeletonBackground = dark ? '#333333' : '#e0e0e0'
    const skeletonHighlight = dark ? '#4f4f4f' : '#f0f0f0'
    const backgroundColor = dark ? '#121212' : COLORS.secondaryWhite

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header with profile picture */}

            {/* Horizontal cylindrical boxes */}
            <SkeletonLoading
                background={skeletonBackground}
                highlight={skeletonHighlight}
            >
                <View style={styles.cylindersContainer}>
                    {[...Array(3)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.cylinder,
                                { backgroundColor: skeletonBackground },
                            ]}
                        />
                    ))}
                </View>
            </SkeletonLoading>

            {/* Normal post skeletons */}
            {[...Array(3)].map((_, index) => (
                <SkeletonLoading
                    key={index}
                    background={skeletonBackground}
                    highlight={skeletonHighlight}
                >
                    <View style={styles.postContainer}>
                        <View
                            style={[
                                styles.postImage,
                                { backgroundColor: skeletonBackground },
                            ]}
                        />
                        <View style={styles.postDetails}>
                            <View
                                style={[
                                    styles.detailLineLarge,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            <View
                                style={[
                                    styles.detailLineSmall,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            <View
                                style={[
                                    styles.detailLineSmall,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                        </View>
                    </View>
                </SkeletonLoading>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        width: 180,
        height: 40,
        borderRadius: 10,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cylindersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        gap: 10,
    },
    cylinder: {
        width: 100,
        height: 30,
        borderRadius: 10,
    },
    postContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    postImage: {
        width: 120,
        height: 180,
        borderRadius: 15,
    },
    postDetails: {
        marginLeft: 16,
        flex: 1,
    },
    detailLineLarge: {
        width: '80%',
        height: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    detailLineSmall: {
        width: '60%',
        height: 8,
        borderRadius: 5,
        marginBottom: 6,
    },
})

export default Skeleton
