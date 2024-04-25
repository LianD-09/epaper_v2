/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Button from '../../libs/button';
import Color from '../../themes/color';

const Home = ({ navigation }) => {
    const webViewRef = useRef<WebView>(null);
    const goback = () => {
        webViewRef.current?.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                style={styles.webViewContainer}
                source={{ uri: 'https://google.com' }}
            />
            <View style={{ flexDirection: 'row', width: '100%', gap: 10, marginBottom: 10 }}>
                <Button highlight opacity={1} onPress={goback}>Back</Button>
                <Button onPress={goback}>Still back but different color</Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white[100],
        gap: 10
    },
    webViewContainer: {
        flex: 1,
    },
});

export default Home;