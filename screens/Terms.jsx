import React, { useState } from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native'
import { CheckBox } from 'react-native-elements' // Install: npm install react-native-elements
import AsyncStorage from '@react-native-async-storage/async-storage'

const TermsOfService = ({ navigation }) => {
    const [isChecked, setIsChecked] = useState(false)

    const handleAccept = async () => {
        if (!isChecked) {
            Alert.alert(
                'Agreement Required',
                'Please accept the terms to proceed.'
            )
            return
        }

        // Save the user's acceptance status in AsyncStorage
        await AsyncStorage.setItem('termsAccepted', 'true')
        navigation.navigate('Main') // Navigate to the main screen
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Terms of Service</Text>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.termsText}>
                    Welcome to Africa Ikoyi! By using this app, you agree to the
                    following terms:
                    {'\n\n'}
                    1. **User Responsibility**: You are responsible for all the
                    listings you post, including property details, images, and
                    pricing. Ensure all information is accurate and up-to-date.
                    {'\n\n'}
                    2. **No Illegal Content**: You must not post any properties
                    that are illegal, misleading, or violate any laws.
                    {'\n\n'}
                    3. **Content Moderation**: Africa Ikoyi reserves the right
                    to remove any listings or content that violates these terms
                    or is deemed inappropriate.
                    {'\n\n'}
                    4. **User Interaction**: By using the platform, you agree to
                    treat other users with respect. Harassment, bullying, or
                    spamming other users is prohibited.
                    {'\n\n'}
                    5. **Account Suspension or Termination**: Violation of these
                    terms may result in the suspension or termination of your
                    account and removal of listings.
                    {'\n\n'}
                    6. **Data Accuracy**: While we strive to ensure the accuracy
                    of property listings, we do not guarantee the accuracy of
                    the information posted by users.
                    {'\n\n'}
                    7. **Privacy Policy**: Your privacy is important to us.
                    Please review our Privacy Policy to understand how we
                    collect, use, and protect your information.
                    {'\n\n'}
                    By using Africa Ikoyi, you agree to abide by these rules.
                    Thank you for being part of our platform and helping others
                    find the perfect property!
                </Text>
            </ScrollView>

            <View style={styles.checkboxContainer}>
                <CheckBox
                    title="I agree to the Terms of Service"
                    checked={isChecked}
                    onPress={() => setIsChecked(!isChecked)}
                    containerStyle={styles.checkbox}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept and Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    termsText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    checkboxContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    button: {
        backgroundColor: '#f18c35',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default TermsOfService
