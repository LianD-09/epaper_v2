import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    StyleProp,
    ViewStyle,
    TextStyle
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { openDateTimePickerModal, closeDateTimePickerModal } from "../redux/slice/date-picker-slice";
import Card from "./card";
import Color from "../themes/color";
import FontSize from "../themes/font-size";
import FontWeight from "../themes/font-weight";
import { RootState, DatePickerState } from "../redux/store";
import moment from 'moment';

const img = require("assets/icons/dropdown-down.png");

export type DateTimeProps = {
    startDate?: Date | null,
    endDate?: Date | null
    onSelect: (value: Date, ...args: any) => any,
    label: string,
    mode?: 'date' | 'time',
    placeholder?: string,
    textSelectedStyle?: StyleProp<TextStyle>,
    onChange?: (...args: any) => any,
    error?: boolean,
    helperText?: string,
    value?: Date | null,
    pt?: number,
    pb?: number,
    pl?: number,
    pr?: number,
    gap?: number,
    disabled?: boolean,
    cardStyle?: StyleProp<ViewStyle>,
    onFocus?: (...args: any) => any,
    selectDisabled?: boolean,
    onBlur?: (...args: any) => any,
    onEndEditing?: (...args: any) => any,
    isLoading?: boolean
}

const DateTimeField = ({
    startDate,
    endDate,
    onSelect,
    label,
    mode = 'date',
    textSelectedStyle,
    error = false,
    helperText = "",
    value = null,
    pt = 10,
    pb = 10,
    pl = 16,
    pr = 16,
    gap = 5,
    disabled,
    cardStyle,
    selectDisabled,
    onBlur,
    isLoading = false
}: DateTimeProps) => {
    const [focus, setFocus] = useState(false);
    const [errorField, setErrorField] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const dispatch = useDispatch();
    const select = useSelector<RootState, DatePickerState>((state) => state.datePicker);

    useEffect(() => {
        setErrorField(error);
        if (select.selectedDate) {
            onSelect(select.selectedDate);
            // dispatch(resetSelectedItem());
        }
        if (!select.isOpen) {
            setFocus(false);
        }
    }, [error, select.selectedDate, select.isOpen]);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    return (
        <View style={{ gap: 4 }}>
            <View style={styles.buttonCustomViewLabel}>
                {label && <Text style={styles.label}>{label}</Text>}
            </View>
            <Card
                bgColor={errorField ? Color.error[300] : Color.white[100]}
                borderColor={errorField ? Color.error[900] : undefined}
                style={[
                    focus ? { borderColor: Color.success[600], borderWidth: 2 } : { borderColor: Color.disable[200], borderWidth: 2 },
                    cardStyle,
                    disabled && { backgroundColor: Color.disable[50] }
                ]}
                pt={pt}
                pb={pb}
                pl={pl}
                pr={pr}
                gap={gap}
                disabled={disabled}
                borderRadius={999}
                onPress={() => {
                    setFocus(true)
                    Keyboard.dismiss();
                    setErrorField(false);
                    dispatch(openDateTimePickerModal({
                        startDate: startDate ?? new Date(2023, 1, 1),
                        endDate: endDate ?? null,
                        label: label,
                        mode: mode,
                    }));
                }
                }
            >
                <View style={styles.buttonCustom}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: 'space-between' }}
                    >
                        {
                            mode === 'date' ?
                                <Text style={[styles.buttonCustomSelect, textSelectedStyle, !selectedDate && { color: Color.disable[300] }]}>
                                    {selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : 'DD/MM/YYYY'}
                                </Text>
                                :
                                <Text style={[styles.buttonCustomSelect, textSelectedStyle, !selectedDate && { color: Color.disable[300] }]}>
                                    {selectedDate ? moment(selectedDate).format('HH:mm') : 'HH:mm'}
                                </Text>
                        }
                    </View>
                    <Pressable
                        disabled={selectDisabled || disabled}
                        style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                        onPress={() => {
                            setFocus(true)
                            Keyboard.dismiss();
                            setErrorField(false);
                            dispatch(openDateTimePickerModal({
                                startDate: startDate ?? new Date(2023, 1, 1),
                                endDate: endDate ?? null,
                                label: label,
                                mode: mode
                            }));
                        }}
                        onBlur={() => {
                            setFocus(false);
                            setErrorField(error)
                            onBlur && onBlur();
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator animating={true} size="small" />
                        ) : (
                            <Image style={{ height: 10, width: 13 }} source={img} />
                        )}
                    </Pressable>
                </View>
            </Card>
            {
                helperText !== "" && errorField && (
                    <Text
                        style={[
                            styles.errorField,
                            { color: errorField ? Color.error[900] : 'transparent' },
                        ]}
                    >
                        {helperText}
                    </Text>
                )
            }
        </View >
    );
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        backgroundColor: Color.white[600],
        paddingHorizontal: 0,
        borderRadius: 16,
        borderColor: Color.disable[200],
    },
    dropdown: {
        borderRadius: 16,
        backgroundColor: Color.white[100],
    },
    dropdownIcon: {
        height: 10,
        width: 13,
        marginRight: 10,
    },
    rowText: {
        fontSize: FontSize.Normal,
        color: Color.white[100],
    },
    buttonCustom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonCustomViewLabel: {
        flexDirection: "column",
        width: "100%",
    },
    label: {
        paddingHorizontal: 16,
        fontSize: FontSize.Tiny,
        fontFamily: FontWeight.w700,
        color: Color.primary[400],
    },
    buttonCustomSelect: {
        lineHeight: 32,
        color: Color.primary[700],
        fontSize: FontSize.Medium,
        fontFamily: FontWeight.w700,
        textAlign: "left",
    },
    rowCustom: {
        paddingHorizontal: 10,
    },
    errorField: {
        fontSize: FontSize.VeryTiny,
        fontFamily: FontWeight.w600,
        paddingLeft: 10,
        paddingTop: 5,
    },
    buttonCustomIcon: {
        height: 35,
        width: 35
    }
});

export default DateTimeField;
