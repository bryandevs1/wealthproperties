import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import * as MailComposer from 'expo-mail-composer'
import { COLORS, SIZES, icons, images } from '../constants'

import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'

const AddPostScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [dropdownValue, setDropdownValue] = useState('')
    const { colors, dark } = useTheme()
    const predefinedMessage =
        'Thank you for reaching out! We will contact you shortly.'

    const handleClose = () => {
        navigation.goBack() // Closes the modal and navigates back
    }
    const [message, setMessage] = useState(
        'Thank you for reaching out! We will contact you shortly.'
    )

    const handleSubmit = async () => {
        if (!name || !email || !phone || !dropdownValue) {
            Alert.alert('Validation Error', 'Please fill out all fields.')
            return
        }

        const formData = {
            name,
            email,
            phone,
            dropdownValue,
            message,
        }

        try {
            const response = await fetch(
                'https://back.ikoyiproperty.com:8443/submit',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            )
            const responseData = await response.json()
            console.log('Response:', responseData)

            if (response.ok) {
                Alert.alert(
                    'Success',
                    'Your message has been submitted successfully.'
                )
            } else {
                Alert.alert('Error', responseData.error || 'Submission failed.')
            }
        } catch (error) {
            console.error('Fetch Error:', error)
            Alert.alert(
                'Error',
                'An error occurred while submitting your message.'
            )
        }
    }

    return (
        <View
            style={[
                styles.modalContainer,
                {
                    backgroundColor: dark ? '#000' : COLORS.black,
                },
            ]}
        >
            {/* Circular X Button */}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: dark
                                    ? COLORS.white
                                    : COLORS.black,
                            },
                        ]}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: dark
                                    ? COLORS.white
                                    : COLORS.black,
                            },
                        ]}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: dark
                                    ? COLORS.white
                                    : COLORS.black,
                            },
                        ]}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[
                            styles.textArea,
                            {
                                backgroundColor: dark
                                    ? COLORS.white
                                    : COLORS.black,
                            },
                        ]}
                        value={message}
                        onChangeText={setMessage} // Update the state as the user types
                        multiline={true} // Allow multiline input
                    />

                    <Text style={styles.label}>Select an Option</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setDropdownValue(value)}
                        items={[
                            { label: 'I am a buyer', value: 'I am a buyer' },
                            { label: 'I am a tenant', value: 'I am a tenant' },
                            { label: 'I am an agent', value: 'I am an agent' },
                        ]}
                        style={pickerSelectStyles}
                        placeholder={{
                            label: 'Select an option...',
                            value: null,
                        }}
                        useNativeAndroidPickerStyle={false}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        paddingTop: 40,
        height: '98%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F18C35',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    formContainer: {
        padding: 20,
        flexGrow: 1,
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
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        height: 100,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#F18C35',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        color: 'black',
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        color: 'black',
        marginBottom: 20,
    },
})

export default AddPostScreen
