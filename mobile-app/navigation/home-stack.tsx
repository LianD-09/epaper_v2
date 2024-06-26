import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/Home/home";
import DataScreen from "../screens/Home/data/data";
import DevicesScreen from "../screens/Home/devices/devices";
import EditDataScreen from "../screens/Home/data/edit-data";
import { RootStackHomeParamList } from "./param-types";
import SubmitEditDataScreen from "../screens/Home/data/submit-edit-data";
import EditDevicesScreen from "../screens/Home/devices/edit-devices";
import ProfileScreen from "../screens/Home/profile/profile";
import AboutScreen from "../screens/Home/about/about";

const Stack = createNativeStackNavigator<RootStackHomeParamList>();

function HomeStack(props) {

    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="DataScreen"
                component={DataScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="DevicesScreen"
                component={DevicesScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="EditDataScreen"
                component={EditDataScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="SubmitEditDataScreen"
                component={SubmitEditDataScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="EditDevicesScreen"
                component={EditDevicesScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="AboutScreen"
                component={AboutScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
        </Stack.Navigator>
    );
}

export default HomeStack;
