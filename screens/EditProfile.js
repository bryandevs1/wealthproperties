import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    TextInput,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { COLORS, SIZES, FONTS, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import Input from '../components/Input'
import { getFormatedDate } from 'react-native-modern-datepicker'
import DatePickerModal from '../components/DatePickerModal'
import Button from '../components/Button'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from '../theme/ThemeProvider'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const isTestMode = true

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'Loading...' : '',
        nickname: isTestMode ? '' : '',
        phoneNumber: '',
    },
    inputValidities: {
        fullName: false,
        nickname: false,
        phoneNumber: false,
    },
    formIsValid: false,
}

const EditProfile = ({ navigation }) => {
    const { colors, dark } = useTheme()

    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [image, setImage] = useState(null)
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)
    const updateUserProfile = async (imageId) => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            const response = await axios.post(
                `https://ikoyiproperty.com/wp-json/wp/v2/users/${userId}`,
                {
                    name: formState.inputValues.fullName,
                    avatar: imageId ? String(imageId) : '',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            Alert.alert('Success', 'Profile updated successfully.')
            console.log('Profile updated:', response.data)
        } catch (error) {
            console.error(
                'Error updating profile:',
                error.response ? error.response.data : error.message
            )
            throw error
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                const response = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/users/me',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const userData = response.data
                console.log('Fetched User Data:', userData)

                setUserId(userData.id)

                dispatchFormState({
                    inputId: 'fullName',
                    validationResult: true,
                    inputValue: userData.name,
                })

                if (userData.avatar) {
                    setImage({ uri: userData.avatar })
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message)
                Alert.alert('Error', 'Failed to load profile data.')
            }
        }

        fetchUserData()
    }, [])

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()
            if (!tempUri) return
            setImage({ uri: tempUri })
        } catch (error) {
            console.error('Error picking image:', error.message)
            Alert.alert('Error', 'Image selection failed.')
        }
    }
    const uploadImage = async () => {
        try {
            const formData = new FormData()
            formData.append('file', {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            })

            const token = await AsyncStorage.getItem('userToken')
            console.log('Token:', token)

            const response = await axios.post(
                'https://ikoyiproperty.com/wp-json/wp/v2/media',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            return response.data.id
        } catch (error) {
            console.error(
                'Error uploading image:',
                error.response ? error.response.data : error.message
            )
            Alert.alert('Error', 'Failed to upload image.')
            throw error
        }
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            let imageId = null
            if (image?.uri) {
                imageId = await uploadImage()
            }
            await updateUserProfile(imageId)
            Alert.alert('Success', 'Profile updated successfully.')
        } catch (error) {
            console.error(
                'Error updating profile:',
                error.response?.data || error.message
            )
            Alert.alert('Error', 'Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView
            style={[
                styles.area,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                ]}
            >
                <Header title="Edit Profile" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={image === null ? images.user1 : image}
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Input
                            id="fullName"
                            label="Full Name"
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['fullName']}
                            value={formState.inputValues.fullName}
                            placeholderTextColor={
                                dark ? COLORS.grayTie : COLORS.black
                            }
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
                <Button
                    title="Update"
                    filled
                    style={styles.continueButton}
                    onPress={handleUpdate}
                />
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
        padding: 16,
        backgroundColor: COLORS.white,
    },
    avatarContainer: {
        marginVertical: 12,
        alignItems: 'center',
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    pickImage: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 6,
        height: 52,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.greyscale500,
    },
    downIcon: {
        width: 10,
        height: 10,
        tintColor: '#111',
    },
    selectFlagContainer: {
        width: 90,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    flagIcon: {
        width: 30,
        height: 30,
    },
    input: {
        flex: 1,
        marginVertical: 10,
        height: 40,
        fontSize: 14,
        color: '#111',
    },
    inputBtn: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.greyscale500,
        height: 50,
        paddingLeft: 8,
        fontSize: 18,
        justifyContent: 'space-between',
        marginTop: 4,
        backgroundColor: COLORS.greyscale500,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 32,
        right: 16,
        left: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        alignItems: 'center',
    },
    continueButton: {
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    genderContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 6,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.greyscale500,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 4,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 8,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
})

export default EditProfile
