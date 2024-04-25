/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import Color from '../../themes/color';
import Home from '../Home/home';
import Button from '../../libs/button';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const Dashbhoard = ({ navigation }) => {

    return (
        <Tab.Navigator
            sceneContainerStyle={styles.container}
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Color.primary[700],
                    elevation: 0,
                    minHeight: 60,
                    padding: 5
                },
                tabBarInactiveTintColor: Color.disable[500],
                tabBarActiveTintColor: Color.white[100],
                tabBarShowLabel: false,
                tabBarButton: (props) => {
                    return <View
                        style={{
                            height: '100%',
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 4
                        }}
                    >
                        <TouchableOpacity {...props} style={[props.style, { flex: 0, aspectRatio: '1/1', height: '100%' }]}>
                            {props.children}
                        </TouchableOpacity>
                    </View>
                },
                tabBarItemStyle: {
                    borderRadius: 30,
                }
            }}
        >
            <Tab.Screen
                name='Home'
                component={Home}
                options={{ tabBarIcon: (props) => <Icon name='home' color={props.color} size={20} /> }}
            />
            <Tab.Screen
                name='Home1'
                component={Home}
                options={{ tabBarIcon: (props) => <Icon name='home' color={props.color} size={20} /> }}
            />
            <Tab.Screen
                name='Home2'
                component={Home}
                options={{ tabBarIcon: (props) => <Icon name='home' color={props.color} size={20} /> }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Color.white[100],
    }
});

export default Dashbhoard;