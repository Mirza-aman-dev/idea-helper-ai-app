import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// tabs
import Home from './Tabs/Home'
import TempList from './Tabs/TempList'
import Settings from './Tabs/Settings'
import ChatBot from './Tabs/ChatBot'
import Temp from './Tabs/Temp'

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

export default function NavigationTab() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    return (
        <Tab.Navigator
            initialRouteName="HomeTab"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = 'home-outline';
                    } else if (route.name === 'SettingsTab') {
                        iconName = 'settings-outline';
                    } else if (route.name === 'ChatBot') {
                        iconName = 'sparkles-outline';
                    } else if (route.name === 'TempTab') {
                        iconName = 'cloud-done-outline';
                    }

                    // Choose a different opacity for inactive icons
                    const iconColor = focused ? '#80ad92' : '#80ad9280'; // '#80ad9280' is a 50% opacity version of #80ad92

                    return <Ionicons name={iconName} size={size} color={iconColor} />;
                },
                tabBarActiveTintColor: '#80ad92',
                tabBarInactiveTintColor: '#80ad9280', // 50% opacity for inactive icons
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={Home}
            />
            <Tab.Screen
                name="ChatBot"
                component={ChatBot}
                options={{ title: 'Glob', headerShown: true }}
            />
            <Tab.Screen
                name="TempTab"
                component={Temp}
                options={{ title: 'Cloud' }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={Settings}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
