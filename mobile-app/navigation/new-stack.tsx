import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { RootStackNewParamList } from "./param-types";
import NewMainScreen from "../screens/New/new-main";
import NewDeviceScreen from "../screens/New/new-device/new-device";
import NewDeviceFillScreen from "../screens/New/new-device/new-device-fill";
import NewDataScreen from "../screens/New/new-data/new-data";
import NewDataFillScreen from "../screens/New/new-data/new-data-fill";
import SubmitNewDataScreen from "../screens/New/new-data/submit-new-data";
const Stack = createNativeStackNavigator<RootStackNewParamList>();

function NewStack(props) {

    return (
        <Stack.Navigator
            initialRouteName="NewMainScreen"
            screenOptions={{
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen
                name="NewMainScreen"
                component={NewMainScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="NewDeviceScreen"
                component={NewDeviceScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="NewDataScreen"
                component={NewDataScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="NewDeviceFillScreen"
                component={NewDeviceFillScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="NewDataFillScreen"
                component={NewDataFillScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="SubmitNewDataScreen"
                component={SubmitNewDataScreen}
                options={{ headerShown: false, gestureEnabled: false }}
            />

        </Stack.Navigator>
    );
}

export default NewStack;
