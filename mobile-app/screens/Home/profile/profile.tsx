/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Color from '../../../themes/color';
import Header from '../../../libs/header';
import Card from '../../../libs/card';
import { StatusBar } from 'expo-status-bar';
import { Device, User, } from '../../../types/type';
import TextField from '../../../libs/text-field';
import Button from '../../../libs/button';
import { useDispatch } from 'react-redux';
import fontWeight from '../../../themes/font-weight';
import fontSize from '../../../themes/font-size';
import { navigate, navigateThroughStack, navigationRef, replace } from '../../../navigation/root-navigation';
import iconHide from 'assets/icons/hide.png';
import iconShow from 'assets/icons/show.png';
import Typography from '../../../libs/typography';

const ProfileScreen = ({ navigation, route }) => {
    const [user, setUser] = useState<User | null>(null);
    const dispath = useDispatch();

    useEffect(() => {
        setUser({
            "id": "662a314ced8bb0d2c3680953",
            "email": "doanhlinh09@gmail.com",
            "name": "Linh Do",
            "gender": 1,
            "createdAt": "2024-04-25T10:32:44.141Z",
            "updatedAt": "2024-04-25T10:32:44.141Z",
        })
    }, []);

    const handleLogout = () => {
        navigationRef.reset({
            index: 0,
            routes: [
                {
                    name: 'Sign-up'
                },
            ]
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Color.white[100]} />
            <Header
                headerTitle='Profile'
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
                    <View style={{
                        borderRadius: 99,
                        borderWidth: 2,
                        borderColor: Color.primary[200],
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <Image source={require('assets/icons/client-128px.png')} style={{ width: 96, height: 96 }} tintColor={Color.primary[500]} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 4
                        }}>
                            <Typography
                                fontSize={fontSize.Huge}
                                fontFamily={fontWeight.w900}
                            >
                                {user?.name}
                            </Typography>
                            <Typography
                                fontSize={fontSize.Medium}
                                fontFamily={fontWeight.w600}
                            >
                                {user?.email}
                            </Typography>
                            <Typography
                                fontSize={fontSize.Medium}
                                fontFamily={fontWeight.w600}
                            >
                                {`Gender: ${user?.gender === 1 ? "Male" : "Female"}`}
                            </Typography>
                        </View>
                        <Button width={'80%'} onPress={handleLogout}>Logout</Button>
                    </View>
                </Card>
            </ScrollView>
        </View>
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

export default ProfileScreen;