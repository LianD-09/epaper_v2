import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDateTimePickerModal, getSelectedDate } from "../../redux/slice/date-picker-slice";
import { DatePickerState, RootState } from "../../redux/store";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Animated, Dimensions, KeyboardAvoidingView, PanResponder, Platform, Pressable, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import Color from "../../themes/color";

const modalConfig = {
  animationIn: "slideInUp",
  animationOut: "slideOutDown",
  opacity: 0.5,
  transitionInTiming: 300,
  transitionOutTiming: 300,
  animationOutTiming: 500,
  percentageSwipeToClose: 20
}

export default function DateTimePickerModal() {
  const deviceWidth = Dimensions.get("window").width;
  const [date, setDate] = React.useState<Date | null>(null);
  const dataDate = useSelector<RootState, DatePickerState>((state) => state.datePicker);
  const dispatch = useDispatch();
  const deviceHeight = Dimensions.get("window").height;
  const pan = useRef(new Animated.ValueXY()).current;
  const [isOpen, setIsOpen] = useState(false);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    // onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dy) > 5,
    onPanResponderMove: (_, gesture) => {
      pan.setValue(
        {
          x: 0,
          y: gesture.dy > 0 ? gesture.dy : 0
        }
      );
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.moveY > 0) {
        if (
          gesture.dy / deviceHeight * 100 >= modalConfig.percentageSwipeToClose ||
          (gesture.y0 < deviceHeight * 0.9 && gesture.moveY >= deviceHeight * 0.95)
        ) {
          handleClose();
          // Animated.spring(
          //   pan, // Auto-multiplexed
          //   {
          //     toValue: { x: 0, y: deviceHeight },
          //     useNativeDriver: false
          //   },
          // ).start(({ finished }) => {
          //   pan.setValue({ x: 0, y: 0 }) // Back to zero for next display
          // });
        }
        else {
          Animated.spring(
            pan, // Auto-multiplexed
            {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false
            }, // Back to zero
          ).start();
        }
      }
    },
  })).current;

  const panScrollResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => false
  })).current;

  const panTextFieldResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dy) > 5,
    onPanResponderMove: (_, gesture) => {
      pan.setValue(
        {
          x: 0,
          y: gesture.dy > 0 ? gesture.dy : 0
        }
      );
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.moveY > 0) {
        if (
          gesture.dy / deviceHeight * 100 >= modalConfig.percentageSwipeToClose ||
          (gesture.y0 < deviceHeight * 0.9 && gesture.moveY >= deviceHeight * 0.95)
        ) {
          handleClose();
          // Animated.spring(
          //   pan, // Auto-multiplexed
          //   {
          //     toValue: { x: 0, y: deviceHeight },
          //     useNativeDriver: false
          //   },
          // ).start(({ finished }) => {
          //   pan.setValue({ x: 0, y: 0 }) // Back to zero for next display
          // });
        }
        else {
          Animated.spring(
            pan, // Auto-multiplexed
            {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false
            }, // Back to zero
          ).start();
        }
      }
    },
    onShouldBlockNativeResponder: () => false
  })).current;

  useEffect(() => {
    setIsOpen(!!dataDate.isOpen);
    if (dataDate.isOpen) {
      setDate(dataDate.selectedDate ?? null)
    }
  }, [dataDate.isOpen])

  const onDismiss = (() => {
    handleClose();
  });
  const onChange = ((event, selectedDate?: Date) => {
    let newDateTime = dataDate.selectedDate ?? selectedDate ?? new Date();
    if (selectedDate != undefined) {
      if (dataDate.mode === 'date') {
        newDateTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      }
      else {
        newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      }
    }
    setDate(newDateTime);
    dispatch(getSelectedDate(newDateTime));
    handleClose();
  }
  );

  const handleClose = () => {
    setIsOpen(false);
    dispatch(closeDateTimePickerModal());
  }
  return (
    isOpen && <DateTimePicker
      locale="es-ES"
      testID="dateTimePicker"
      value={date ?? new Date()}
      mode={dataDate.mode}
      is24Hour={true}
      display={"spinner"}
      onChange={onChange}
      textColor={Color.primary[700]}
      accentColor={Color.success[600]}
      minimumDate={dataDate.startDate ?? undefined}
      maximumDate={dataDate.endDate ?? undefined}
    />
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  floatUp: {
    backgroundColor: Color.white[100],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
  },
  dragStick: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 10,
  },
  stick: {
    width: 50,
    height: 3,
    backgroundColor: Color.disable[400],
    borderRadius: 2
  },
});