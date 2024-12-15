import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function SplashScreen({ navigation }) {

    const titleFadeAnim = useRef(new Animated.Value(0)).current;
    const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const auth = getAuth();

        // Check the user's authentication status
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Start fade-in animations for title and subtitle
            Animated.timing(titleFadeAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();

            Animated.timing(subtitleFadeAnim, {
                toValue: 1,
                duration: 2000,
                delay: 500,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(titleFadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();

                Animated.timing(subtitleFadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start(() => {
                    // If the user is logged in, navigate to Home; otherwise, navigate to Login
                    if (user) {
                        navigation.replace('Home');
                    } else {
                        navigation.replace('Login');
                    }
                });
            }, 3000); // Show splash screen for 3 seconds

            return () => clearTimeout(timer);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, [titleFadeAnim, subtitleFadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Animated.Text style={[styles.title, { opacity: titleFadeAnim }]}>
                    Idea'r
                </Animated.Text>
                <Animated.Text style={[styles.SubTitle, { opacity: subtitleFadeAnim }]}>
                    Powered by MITCode
                </Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#80ad92',
        fontSize: 73,
        fontWeight: 'bold',
    },
    SubTitle: {
        color: '#80ad92',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 20,
    },
});