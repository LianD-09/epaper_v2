import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/Home/home";
import DataScreen from "../screens/Home/data/data";
import DevicesScreen from "../screens/Home/devices/devices";
const Stack = createNativeStackNavigator();

function HomeStack(props) {

    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
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
        </Stack.Navigator>
    );
}

export default HomeStack;
