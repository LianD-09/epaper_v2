/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    Image,
    Pressable,
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
                    backgroundColor: Color.primary[900],
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
                            backgroundColor: Color.primary[900],
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 4,
                        }}
                    >
                        <Pressable {...props} style={[props.style, { flex: 1, aspectRatio: '1/1', height: '100%' }]}>
                            {props.children}
                        </Pressable>
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
                options={{
                    tabBarButton: (props) => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>,
                    tabBarIcon: (props) => props.focused ?
                        <Image source={require('../../assets/icons/home-solid-24px.png')} width={props.size} height={props.size} tintColor={props.color} />
                        :
                        <Image source={require('../../assets/icons/home-24px.png')} width={props.size} height={props.size} tintColor={props.color} />

                }}
            />
            <Tab.Screen
                name='Home1'
                component={Home}
                options={{
                    tabBarButton: (props) => <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={styles.bgMiddleIcon} >
                            <TouchableOpacity {...props}>
                                <View style={[styles.middleIcon, { backgroundColor: Color.secondary[300] }]} >
                                    {props.children}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>,
                    tabBarIconStyle: styles.middleIcon,
                    tabBarIcon: (props) =>
                        <Image source={require('../../assets/icons/add-24px.png')} width={props.size} height={props.size} tintColor={Color.primary[700]} />

                }}
            />
            < Tab.Screen
                name='Home2'
                component={Home}
                options={{
                    tabBarButton: (props) => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>,
                    tabBarIcon: (props) => props.focused ?
                        <Image source={require('../../assets/icons/notification-solid-24px.png')} width={props.size} height={props.size} tintColor={props.color} />
                        :
                        <Image source={require('../../assets/icons/notification-24px.png')} width={props.size} height={props.size} tintColor={props.color} />
                }}
            />
        </Tab.Navigator >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Color.white[100],
    },
    middleIcon: {
        padding: 18,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgMiddleIcon: {
        borderRadius: 100,
        flex: 1,
        padding: 6,
        position: 'absolute',
        transform: [{ translateY: -20 }],
        backgroundColor: Color.primary[900]
    }
});

export default Dashbhoard;