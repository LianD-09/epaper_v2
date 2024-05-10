/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import { ActivityIndicator, Checkbox, RadioButton } from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import icon from '../../assets/epaper.png';
import Button from '../../libs/button';
import Card from '../../libs/card';
import TextField from '../../libs/text-field';
import Color from '../../themes/color';
import Typography from '../../libs/typography';
import FontSize from '../../themes/font-size';
import FontWeight from '../../themes/font-weight';

const Login = ({ navigation }) => {
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEvent = () => {
    try {
      setIsLoading(true);
      navigation.navigate('Dashboard', { name: 'Dashboard' });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading
        ? <ActivityIndicator size="large" color='green' style={styles.loading} />
        :
        <ImageBackground source={require('../../assets/bg-white.jpg')} resizeMode='cover' style={{ flex: 1 }}>
          <Card
            style={{
              width: 'auto',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
              marginHorizontal: 10
            }}
            bgColor={'transparent'}
          >
            <View style={styles.container}>
              <Image
                style={styles.image}
                source={icon}
              />
              <View style={styles.inputView}>
                <TextField
                  keyboardType='email-address'
                  placeholder={'Your email'}
                  label={'Email'}
                  onChange={() => null}
                  disable={false}
                />
                <TextField
                  placeholder={'Your password'}
                  label={'Password'}
                  secure
                  onChange={(text) => setPassword(text)}
                  disable={false}
                />
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                paddingHorizontal: 10
              }}>
                <View
                  style={{
                    margin: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <RadioButton
                    status={remember ? 'checked' : 'unchecked'}
                    color={Color.success[600]}
                    uncheckedColor={Color.primary[600]}
                    onPress={() => {
                      setRemember(!remember);
                    }}
                    value={''} />
                  <Typography fontSize={FontSize.Small} lineHeight={18}>Remember me</Typography>
                </View>
                <TouchableOpacity
                  style={styles.forgotButtonText}
                  onPress={() => navigation.navigate('Home', {})}
                >
                  <Typography
                    fontSize={FontSize.Small}
                    lineHeight={18}
                    fontFamily={FontWeight.w700}
                  >
                    Forgot Password?
                  </Typography>
                </TouchableOpacity>
              </View>
              <Button
                onPress={handleSubmitEvent}
                style={{ marginTop: 20, paddingHorizontal: 40, width: '100%' }}
              >
                Login
              </Button>
              <View
                style={{
                  margin: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3
                }}>
                <Typography fontSize={FontSize.Small} lineHeight={18}>Don't have an account?</Typography>
                <TouchableOpacity
                  style={styles.forgotButtonText}
                  onPress={() => navigation.navigate('Sign-up')}
                >
                  <Typography
                    fontSize={FontSize.Small}
                    lineHeight={18}
                    fontFamily={FontWeight.w700}
                    color={Color.secondary[600]}
                  >
                    Sign up
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </ImageBackground>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    backgroundColor: Color.white[100],
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '30%',
    resizeMode: 'contain',
  },
  inputView: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'column',
    gap: 16
  },
  forgotButtonText: {
  },
});

export default Login;