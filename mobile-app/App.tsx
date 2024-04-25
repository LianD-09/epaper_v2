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
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import Signup from './screens/Auth/signup';
import Dashboard from './screens/Dashboard/dashboard';
import Color from './themes/color';


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

  // Load front
  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       await fetchFonts();
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setAppIsReady(true);
  //     }
  //   }
  //   prepare();
  // }, []);

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
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Sign-in"
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
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
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
