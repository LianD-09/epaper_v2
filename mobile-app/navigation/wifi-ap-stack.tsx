import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { RootStackWifiApParamList } from "./param-types";
import WifiApScreen from "../screens/WifiAP/wifi-ap";
import WifiEnrollScreen from "../screens/WifiAP/wifi-enroll";
import WifiFillScreen from "../screens/WifiAP/wifi-fill";

const Stack = createNativeStackNavigator<RootStackWifiApParamList>();

function WifiApStack(props) {

    return (
        <Stack.Navigator
            initialRouteName="WifiApScreen"
            screenOptions={{
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name="WifiApScreen"
                component={WifiApScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="WifiEnrollScreen"
                component={WifiEnrollScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="WifiFillScreen"
                component={WifiFillScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />

        </Stack.Navigator>
    );
}

export default WifiApStack;
