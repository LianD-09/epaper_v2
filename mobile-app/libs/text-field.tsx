import { useEffect, useRef, useState } from "react";
import { ColorValue, KeyboardTypeOptions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import Card from "./card";
import FontSize from "../themes/font-size";
import FontWeight from "../themes/font-weight";
import Color from "../themes/color";
import React from "react";

type TextFieldProps = {
    value?: string,
    label?: string,
    placeholder?: string,
    placeholderTextColor?: ColorValue,
    onChange: (...args: any) => any,
    keyboardType?: KeyboardTypeOptions,
    secure?: boolean,
    disable?: boolean,
    multiline?: boolean,
    endIcon?: React.ReactNode,
    error?: boolean,
    helperText?: string,
    borderWidth?: number,
    bgColor?: string,
    borderRadius?: number,
    pt?: number,
    pl?: number,
    pr?: number,
    pb?: number,
    gap?: number,
    maxLength?: number,
    cardStyle?: StyleProp<ViewStyle>,
    onEndEditing?: (...args: any) => any,
    onBlur?: (...args: any) => any,
    onFocus?: (...args: any) => any,
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined,
    startElement?: React.ReactNode
}

const TextField = ({
    value,
    label,
    placeholder,
    placeholderTextColor = Color.disable[200],
    onChange,
    keyboardType = 'default',
    secure,
    disable,
    multiline = false,
    endIcon,
    error = false,
    helperText = '',
    borderWidth = 2,
    bgColor = Color.white[100],
    borderRadius = 999,
    pt = 10,
    pl = 16,
    pr = 16,
    pb = 10,
    gap = 5,
    maxLength,
    cardStyle = {},
    onEndEditing,
    onBlur,
    onFocus,
    autoCapitalize = "sentences",
    startElement
}: TextFieldProps) => {
    const [focus, setFocus] = useState(false);
    const [errorText, setErrorText] = useState(false);
    const [helperErrorText, setHelperErrorText] = useState('');

    useEffect(() => {
        setErrorText(error)
    }, [error])

    useEffect(() => {
        setHelperErrorText(helperText)
    }, [helperText])

    const ref = useRef<TextInput>(null);

    const handleChangeInput = (text: string) => {
        onChange(text);
    }

    return (
        <View style={styles.contain}>
            {label != '' && (
                <Text style={styles.label}>{label}</Text>
            )}
            <Card
                borderWidth={borderWidth}
                pl={pl} pt={pt} pr={pr} pb={pb} gap={gap}
                borderRadius={borderRadius && borderRadius}
                bgColor={errorText ? Color.error[300] : bgColor}
                borderColor={errorText ? Color.error[900] : undefined}
                onPress={() => (!disable && ref.current) && ref.current.focus()}
                style={[
                    focus && { borderColor: Color.success[600], borderWidth: 2 },
                    cardStyle,
                    disable && { backgroundColor: Color.disable[50] }
                ]}
            >
                <View style={endIcon ? styles.inputIcon : undefined}>
                    <View style={endIcon ? { width: '90%' } : undefined}>
                        <View
                            style={!multiline ? [
                                startElement ? {
                                    flexDirection: 'row',
                                    gap: 4,
                                    alignItems: 'center',
                                    flex: 1,
                                } : undefined,
                            ] : undefined}
                        >
                            {startElement && typeof startElement === 'object' && (
                                startElement
                            )}
                            <View style={startElement && typeof startElement === 'object' ? {
                                flex: 1
                            } : null}>
                                <TextInput
                                    ref={ref}
                                    style={[styles.input,]}
                                    onChangeText={handleChangeInput}
                                    value={value}
                                    autoFocus={focus}
                                    placeholder={placeholder}
                                    placeholderTextColor={value !== '' ? Color.disable[200] : placeholderTextColor}
                                    keyboardType={keyboardType}
                                    secureTextEntry={secure}
                                    editable={disable ? false : true}
                                    multiline={multiline}
                                    // numberOfLines={multiline ? 1 : 1}     // ! apply to android\
                                    autoCapitalize={autoCapitalize}
                                    onFocus={() => {
                                        setFocus(true);
                                        setErrorText(false);
                                        setHelperErrorText('');
                                        if (typeof onFocus === 'function') {
                                            onFocus()
                                        }
                                    }}
                                    scrollEnabled={false}
                                    onBlur={() => {
                                        setFocus(false);
                                        setErrorText(error)
                                        setHelperErrorText(helperText)
                                        if (typeof onBlur === 'function') {
                                            onBlur()
                                        }
                                    }}
                                    maxLength={maxLength}
                                    enterKeyHint={multiline ? 'enter' : "done"}
                                    onEndEditing={() => {
                                        if (typeof onEndEditing === 'function') {
                                            onEndEditing()
                                        }
                                    }}
                                    keyboardAppearance="default"
                                    rejectResponderTermination={false}
                                />
                            </View>
                        </View>
                    </View>
                    {endIcon && (
                        <View style={styles.endIcon}>
                            {endIcon}
                        </View>
                    )}
                </View>
            </Card>
            {(helperErrorText !== '') && (
                <Text style={[styles.errorText, { color: errorText ? Color.error[900] : Color.black[100] }]}>{helperText}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    contain: {
        flexDirection: 'column',
        gap: 4,
    },
    label: {
        paddingHorizontal: 16,
        fontSize: FontSize.Tiny,
        fontFamily: FontWeight.w700,
        color: Color.primary[400],
    },
    input: {
        fontSize: FontSize.Medium,
        fontFamily: FontWeight.w700,
        color: Color.disable[700],
    },
    endIcon: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    inputIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 4
    },
    errorText: {
        fontSize: FontSize.VeryTiny,
        fontFamily: FontWeight.w600,
        paddingLeft: 10,
        paddingTop: 5
    }
})

export default TextField;