/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import Button from '../../../libs/button';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { pop } from '../../../navigation/root-navigation';
import Typography from '../../../libs/typography';

const AboutScreen = ({ navigation, route }) => {
    useEffect(() => {
    }, []);

    const handleBack = () => {
        pop()
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='About'
                displayIconLeft={false}
            />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Card
                    style={{
                        width: '100%',
                        flex: 1,
                        marginTop: 5,
                        paddingBottom: 40,
                        gap: 20,
                        // justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    pb={16}
                    pt={24}
                    bgColor={Color.white[100]}
                >
                    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 20
                        }}>
                            <Typography
                                fontSize={fontSize.Gigantic}
                                fontFamily={fontWeight.w800}
                            >
                                Epaper Mobile
                            </Typography>
                            <Typography
                                fontSize={fontSize.Medium}
                                fontFamily={fontWeight.w700}
                            >
                                Designed by Linh DA
                            </Typography>
                            <Typography
                                fontSize={fontSize.Small}
                                fontFamily={fontWeight.w500}
                            >
                                This is a product created to control and manage EPD devices. For more information, visit
                                <TouchableOpacity onPress={() => Linking.openURL("https://epaper.toolhub.app/")}>
                                    <Typography
                                        fontSize={fontSize.Small}
                                        fontFamily={fontWeight.w500}
                                        color={Color.info[600]}
                                    >
                                        https://epaper.toolhub.app/
                                    </Typography>
                                </TouchableOpacity>
                            </Typography>
                        </View>
                        <Button width={'80%'} onPress={handleBack}>Go back</Button>
                    </View>
                </Card >
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.primary[100],
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
    },
    mainContainer: {
        backgroundColor: Color.white[100],
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '100%'
    }

});

export default AboutScreen;