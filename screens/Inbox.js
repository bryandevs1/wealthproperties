import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView, // For custom button style
    KeyboardAvoidingView,
    Modal,
    FlatList,
} from 'react-native'
import * as MailComposer from 'expo-mail-composer'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message' // Import Toast
import { MaterialIcons } from '@expo/vector-icons' // Import icons
import { useNavigation } from '@react-navigation/native' // Import navigation hook
import { useTheme } from '../theme/ThemeProvider'
import { COLORS, icons, illustrations, SIZES } from '../constants'
import RNPickerSelect from 'react-native-picker-select'

import * as ImagePicker from 'expo-image-picker' // Import image picker
import { Picker } from '@react-native-picker/picker'
import DropDownPicker from 'react-native-dropdown-picker'

const Inbox = () => {
    const customToastConfig = {
        error: (props) => (
            <TouchableOpacity
                onPress={() => alert(props.text2)} // Show full message on click
                style={{
                    backgroundColor: '#fff',
                    borderLeftColor: '#F18C35',
                    borderLeftWidth: 5,
                    padding: 10,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    marginVertical: 20,
                    elevation: 3,
                }}
            >
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: '#721C24',
                    }}
                >
                    {props.text1}
                </Text>
                <Text style={{ fontSize: 14, color: '#721C24' }}>
                    {props.text2}
                </Text>
            </TouchableOpacity>
        ),
    }
    const navigation = useNavigation() // Get navigation object
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('') // Selected category
    const [categories, setCategories] = useState([]) // List of categories from API
    const [tag, setTag] = useState('')
    const [house, setHouse] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(true) // For showing loading spinner during fetch
    const { colors, dark } = useTheme()
    const [propertyTypes, setPropertyTypes] = useState([
        { id: 'all', name: '🔥 All' },
    ])
    const [propertyStatuses, setPropertyStatuses] = useState([]) // Property statuses list
    const [selectedPropertyType, setSelectedPropertyType] = useState('') // User selection
    const [selectedPropertyStatus, setSelectedPropertyStatus] = useState('') // User selection
    const [isLoading, setIsLoading] = useState('') //

    // Fetch categories from the WordPress site with Bearer token authorization
    const [open, setOpen] = useState(false)
    const [start, setStart] = useState(false)

    // Function to pick an image
    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (permissionResult.granted === false) {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
                text2: 'You need to grant permission to access images.',
            })
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri) // Set the image URI
        }
    }
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Function to handle the submission of data via email
    const handleSubmit = async () => {
        console.log('Submit button pressed')

        if (
            !title ||
            !content ||
            !selectedPropertyType ||
            !selectedPropertyStatus
        ) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill in all fields.',
            })
            return
        }

        setIsSubmitting(true) // Start submission

        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('propertyType', selectedPropertyType)
        formData.append('propertyStatus', selectedPropertyStatus)

        if (image) {
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: `property-${Date.now()}.jpg`,
            })
        }

        try {
            console.log('Sending request to API...')
            const response = await axios.post(
                'https://back.ikoyiproperty.com:8443/submit-property',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            if (response.status === 201) {
                console.log('API response:', response.data)
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Property submitted successfully!',
                })
            } else {
                console.error('Unexpected API response:', response.status)
                throw new Error('Unexpected response')
            }
        } catch (error) {
            console.error(
                'Error during submission:',
                error.response?.data || error.message
            )
            Toast.show({
                type: 'error',
                text1: 'Submission Error',
                text2: 'Failed to submit property. Please try again later.',
            })
        } finally {
            setIsSubmitting(false) // Stop submission
        }
    }

    useEffect(() => {
        const fetchTypesAndStatuses = async () => {
            setIsLoading(true)

            try {
                // Fetch property types
                const typeRes = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/property_type'
                )
                console.log('Property Types Response:', typeRes.data)

                const formattedPropertyTypes = typeRes.data.map((type) => ({
                    id: type.id.toString(), // Ensure the ID is converted to a string
                    name: type.name || 'Unnamed', // Provide a fallback for missing names
                }))

                setPropertyTypes([
                    { id: 'all', name: '🔥 All' },
                    ...formattedPropertyTypes,
                ])

                // Fetch property statuses (similar process)
                const statusRes = await axios.get(
                    'https://ikoyiproperty.com/wp-json/wp/v2/property_status'
                )
                console.log('Property Status Response:', statusRes.data)

                const formattedPropertyStatuses = statusRes.data.map(
                    (status) => ({
                        id: status.id.toString(), // Ensure the ID is converted to a string
                        name: status.name || 'Unnamed', // Provide a fallback for missing names
                    })
                )

                setPropertyStatuses(formattedPropertyStatuses)
            } catch (error) {
                console.error(
                    'Error fetching types and statuses:',
                    error.response?.data || error.message
                )
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch property data.',
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchTypesAndStatuses()
    }, [])
    const [isModalVisible, setModalVisible] = useState(false)

    const handleSelect = (item) => {
        setSelectedPropertyStatus(item.id)
        setModalVisible(false)
    }

    // Function to handle closing the screen
    const [dropdownItems] = useState(
        propertyStatuses.map((status) => ({
            label: status.name,
            value: status.id,
        }))
    )
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Image
                        source={icons.plus}
                        resizeMode="contain"
                        style={styles.headerLogo}
                    />
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
                        Create Apartment
                    </Text>
                </View>
                <View style={styles.headerRight}></View>
            </View>
        )
    }
    return (
        <ScrollView
            style={[
                styles.modalContainer,
                {
                    backgroundColor: dark ? '#000' : COLORS.white,
                },
            ]}
        >
            {renderHeader()}

            <KeyboardAvoidingView>
                {/* Circular X Button */}

                <Text
                    style={[
                        styles.label,
                        {
                            color: dark ? COLORS.white : COLORS.dark2,
                        },
                    ]}
                >
                    Title
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter post title"
                    placeholderTextColor={dark ? COLORS.white : COLORS.dark2}
                />
                <Text
                    style={[
                        styles.label,
                        {
                            color: dark ? COLORS.white : COLORS.dark2,
                        },
                    ]}
                >
                    Content
                </Text>
                <TextInput
                    style={[
                        styles.textArea,
                        {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        },
                    ]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Enter post content"
                    multiline={true}
                    placeholderTextColor={dark ? COLORS.white : COLORS.dark2}
                />

                <Text
                    style={[
                        styles.label,
                        {
                            color: dark ? COLORS.white : COLORS.dark2,
                        },
                    ]}
                >
                    Property Type
                </Text>
                <DropDownPicker
                    open={open}
                    value={selectedPropertyType}
                    items={propertyTypes.map((type) => ({
                        label: type.name,
                        value: type.id,
                    }))}
                    setOpen={setOpen}
                    setValue={setSelectedPropertyType}
                    placeholder="Select a property type..."
                    style={{
                        marginBottom: 20,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white, // Dropdown background color
                    }}
                    textStyle={{
                        color: dark ? COLORS.white : COLORS.black, // Item text color
                    }}
                />

                <Text
                    style={[
                        styles.label,
                        {
                            color: dark ? COLORS.white : COLORS.dark2,
                        },
                    ]}
                >
                    Property Status
                </Text>
                <View>
                    <TouchableOpacity
                        style={[
                            styles.selector,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.white,
                            },
                        ]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text
                            style={{
                                color: dark ? COLORS.white : COLORS.dark2,
                            }}
                        >
                            {selectedPropertyStatus
                                ? propertyStatuses.find(
                                      (status) =>
                                          status.id === selectedPropertyStatus
                                  )?.name
                                : 'Select a property status...'}
                        </Text>
                    </TouchableOpacity>

                    <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        <View
                            style={[
                                styles.modal,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.white,
                                },
                            ]}
                        >
                            <FlatList
                                data={propertyStatuses}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.modalItem,
                                            {
                                                backgroundColor: dark
                                                    ? COLORS.dark3
                                                    : COLORS.white,
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.dark2,
                                            },
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text
                                            style={{
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.dark2,
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>

                <Text
                    style={[
                        styles.label,
                        {
                            color: dark ? COLORS.white : COLORS.dark2,
                        },
                    ]}
                >
                    Image
                </Text>
                <TouchableOpacity
                    style={[
                        styles.imagePickerButton,
                        { backgroundColor: dark ? COLORS.dark2 : COLORS.white }, // Conditional background color
                    ]}
                    onPress={pickImage}
                >
                    <Text
                        style={[
                            styles.imagePickerText,
                            {
                                color: dark ? COLORS.white : COLORS.dark2,
                            },
                        ]}
                    >
                        {' '}
                        {image ? 'Change Selected Image' : 'Pick an Image'}
                    </Text>
                </TouchableOpacity>
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={styles.image} // Display the selected image
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        isSubmitting && styles.buttonDisabled, // Apply disabled style if submitting
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting} // Disable the button during submission
                >
                    <Text style={styles.buttonText}>
                        {isSubmitting ? 'Submitting...' : 'Submit Property'}
                    </Text>
                </TouchableOpacity>

                {/* Toast Component */}
                <Toast config={customToastConfig} />
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

// Styles
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Use flex for standard layout
        paddingTop: 50,
        padding: 20,
        marginBottom: 50,
        borderTopLeftRadius: 0, // Remove rounded corners
        borderTopRightRadius: 0, // Remove rounded corners
        elevation: 0, // Remove shadow
    },
    selector: {
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'gray',
        backgroundColor: '#fff',
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        width: '80%', // Adjust width as needed
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },

    modalItem: {
        padding: 16,
        backgroundColor: '#fff',
        marginVertical: 4,
    },
    closeButton: {
        padding: 12,
        backgroundColor: 'red',
        alignItems: 'center',
        margin: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        height: 32,
        width: 32,
        tintColor: COLORS.primary,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 12,
    },
    closeButton: {
        position: 'absolute',
        top: -50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F18C35', // Customize the color as needed
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Add shadow for Android
        shadowColor: '#000', // Add shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        // Add blurred background
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // Adjust blur radius as needed
        filter: 'blur(2px)',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff', // White background
        padding: 15,
        borderRadius: 10, // Rounded corners
        marginBottom: 20,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        height: 120,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#F18C35',
        paddingVertical: 15,
        marginBottom: 50,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        paddingTop: 100,
        padding: 20,
        backgroundColor: '#f7f7f7', // Light background
    },
    imagePickerButton: {
        backgroundColor: '#ececec', // Grey background for image picker
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePickerText: {
        color: '#555', // Grey text
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10, // Rounded corners for image
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 4,
    },
    picker: {
        height: 50,
        backgroundColor: '#fff',
    },
})

// Picker styles
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        color: 'black',
        paddingRight: 30, // To ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        color: 'black',
        paddingRight: 30, // To ensure the text is never behind the icon
    },
})

export default Inbox
