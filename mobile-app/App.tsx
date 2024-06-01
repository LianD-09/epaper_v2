import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import { store } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from './screens/Auth/login';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import Signup from './screens/Auth/signup';
import Dashboard from './screens/Dashboard/dashboard';
import Color from './themes/color';
import { navigationRef } from './navigation/root-navigation';
import BottomModal from './components/modals/bottom-modal';
import SelectModal from './components/modals/select-modal';
import DateTimePickerModal from './components/modals/date-time-picker-modal';
import { requestBluetoothPermission } from './services/ble-services';
import { BleManager } from 'react-native-ble-plx';
import { BLEProvider } from './components/ble/ble-provider';
import CenterModal from './components/modals/center-modal';
import ScanScreen from './screens/Scan/scan';
import LoadingModal from './components/modals/loading-modal';
import WifiApStack from './navigation/wifi-ap-stack';
// import { validateToken } from './utils/utils';


// LogBox.ignoreAllLogs();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// init({
//   size: 10000,
//   storageBackend: AsyncStorage,
//   defaultExpires: 1000 * 3600 * 24,
//   enableCache: true,
//   sync: {}
// });

const Stack = createNativeStackNavigator();

const bleManager = new BleManager();

requestBluetoothPermission();

export default function App() {
  const [appIsReady] = Font.useFonts({
    'Urbanist-Thin': require('./assets/fonts/Urbanist-Thin.ttf'), //100
    'Urbanist-ExtraLight': require('./assets/fonts/Urbanist-ExtraLight.ttf'), //200
    'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'), //300
    'Urbanist-Normal': require('./assets/fonts/Urbanist-Regular.ttf'), //400
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'), //500
    'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'), //600
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'), //700
    'Urbanist-ExtraBold': require('./assets/fonts/Urbanist-ExtraBold.ttf'), //800
    'Urbanist-Black': require('./assets/fonts/Urbanist-Black.ttf'), //900
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const prepare = async () => {
  //   setIsLoggedIn(await validateToken());
  // }

  // useEffect(() => {
  //   prepare();
  // }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style='auto' />
      <Provider store={store}>
        <BLEProvider bleManager={bleManager} >
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator
                initialRouteName={isLoggedIn ? "Dashboard" : "Sign-in"}
                screenOptions={{
                  headerShown: false,
                  contentStyle: styles.container
                }}
              >
                <Stack.Screen
                  name="Sign-in"
                  component={Login}
                  options={{
                    title: 'Sign in',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Sign-up"
                  component={Signup}
                  options={{
                    title: 'Sign up',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Dashboard"
                  component={Dashboard}
                  options={{
                    title: 'Dashboard',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ScanScreen"
                  component={ScanScreen}
                  options={{
                    title: 'Scan',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="WifiAp"
                  component={WifiApStack}
                  options={{
                    title: 'Wifi AP',
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
            <LoadingModal />
            <BottomModal />
            <CenterModal />
            <SelectModal />
            <DateTimePickerModal />
          </SafeAreaProvider>
        </BLEProvider>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white[100],
  },
});
