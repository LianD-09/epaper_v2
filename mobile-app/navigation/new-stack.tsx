import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootStackNewParamList } from "./param-types";
import NewMainScreen from "../screens/New/new-main";
import NewDeviceScreen from "../screens/New/new-device";

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

        </Stack.Navigator>
    );
}

export default NewStack;
