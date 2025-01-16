import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';

const SettingsPrivacyPolicy = () => {
    const { colors, dark } = useTheme();

  return (
      <SafeAreaView
          style={[styles.area, { backgroundColor: colors.background }]}
      >
          <View
              style={[styles.container, { backgroundColor: colors.background }]}
          >
              <Header title="Privacy Policy" />
              <ScrollView showsVerticalScrollIndicator={false}>
                  <View>
                      <Text
                          style={[
                              styles.settingsTitle,
                              { color: dark ? COLORS.white : COLORS.black },
                          ]}
                      >
                          1. Information We Collect
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          We collect the following types of information to
                          provide and improve our services:
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Personal Information:** This includes details such
                          as your name, email address, phone number, and any
                          other information you provide during account
                          registration or while listing a property.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Usage Data:** We gather information about how you
                          interact with our platform, such as IP addresses,
                          device details, app usage data, and browsing
                          activities.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Cookies and Tracking Technologies:** We use
                          cookies and similar technologies to understand your
                          preferences and enhance your experience on our
                          platform.
                      </Text>
                  </View>
                  <View>
                      <Text
                          style={[
                              styles.settingsTitle,
                              { color: dark ? COLORS.white : COLORS.black },
                          ]}
                      >
                          2. How We Use Your Information
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          Your information helps us deliver and improve our
                          services in the following ways:
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Providing Services:** To facilitate property
                          listings, enable account management, and personalize
                          your user experience.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Customer Support:** To respond to inquiries,
                          provide support, and resolve any issues you might face
                          while using our app.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Marketing and Promotions:** To share updates,
                          promotions, or relevant offers that align with your
                          interests.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Analytics and Improvements:** To analyze user
                          trends and enhance the app’s functionality and user
                          experience.
                      </Text>
                  </View>
                  <View>
                      <Text
                          style={[
                              styles.settingsTitle,
                              { color: dark ? COLORS.white : COLORS.black },
                          ]}
                      >
                          3. Sharing Your Information
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          We may share your information in the following
                          scenarios:
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **With Service Providers:** Trusted third-party
                          providers who assist in app operations, such as
                          hosting, analytics, or customer support, under strict
                          confidentiality.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Legal Compliance:** To comply with applicable
                          laws, regulations, or legal processes, including
                          responding to court orders or law enforcement
                          requests.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - **Business Transfers:** In case of a merger,
                          acquisition, or sale of our assets, your data may be
                          transferred as part of the transaction.
                      </Text>
                  </View>
                  <View>
                      <Text
                          style={[
                              styles.settingsTitle,
                              { color: dark ? COLORS.white : COLORS.black },
                          ]}
                      >
                          4. Your Rights and Choices
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          You have the right to:
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - Access, update, or delete your personal data by
                          managing your account settings or contacting us.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - Opt-out of marketing communications at any time
                          through your preferences.
                      </Text>
                      <Text
                          style={[
                              styles.body,
                              {
                                  color: dark
                                      ? COLORS.secondaryWhite
                                      : COLORS.greyscale900,
                              },
                          ]}
                      >
                          - Control cookie usage by adjusting your browser or
                          device settings.
                      </Text>
                  </View>
              </ScrollView>
          </View>
      </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    settingsTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
        marginVertical: 26
    },
    body: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        marginTop: 4
    }
})

export default SettingsPrivacyPolicy