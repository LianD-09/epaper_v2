import { Image, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, ScrollView, Platform, Keyboard, Pressable, PanResponder, Animated } from "react-native";
import Modal from "react-native-modal";
import Typography from "../../libs/typography";
import { useDispatch, useSelector } from "react-redux";
import { closeSelect, getSelectedItem } from "../../redux/slice/select-slice";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import Color from "../../themes/color";
import FontSize from "../../themes/font-size";
import FontWeight from "../../themes/font-weight";
import TextField from "../../libs/text-field";
import Divider from "../../libs/divider";
import React from "react";
import { RootState, SelectItem, SelectState } from "../../redux/store";

const modalConfig = {
  animationIn: "slideInUp",
  animationOut: "slideOutDown",
  opacity: 0.5,
  transitionInTiming: 300,
  transitionOutTiming: 300,
  animationOutTiming: 500,
  percentageSwipeToClose: 20
}

function SelectModal() {
  const deviceWidth = Dimensions.get("window").width;

  const [items, setItems] = useState<Array<SelectItem>>([]);
  const [search, setSearch] = useState('');

  const select = useSelector<RootState, SelectState>(state => state.select);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const deviceHeight = Dimensions.get("window").height;
  const pan = useRef(new Animated.ValueXY()).current;

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
    setItems(select.items)
  }, [select.items, select.mode, select.selected]);

  useEffect(() => {
    setIsOpen(select.isOpen);
  }, [select.isOpen])

  const handleSearch = (text) => {
    setSearch(text);
    if (text != '') {
      const newItems = items.filter(x => (x.label.toLowerCase()).search(text.toLowerCase().trim()) !== -1)
      setItems(newItems.slice(0, 10));
      // Keyboard.dismiss();
    } else {
      setItems(select.items);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setSearch('');
  }
  return (
    <Modal
      isVisible={isOpen}
      avoidKeyboard={false}
      deviceWidth={deviceWidth}
      coverScreen={false}
      style={styles.modal}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      backdropOpacity={modalConfig.opacity}
      backdropTransitionInTiming={modalConfig.transitionInTiming}
      backdropTransitionOutTiming={modalConfig.transitionOutTiming}
      animationOutTiming={modalConfig.animationOutTiming}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
      onBackdropPress={handleClose}
      onModalHide={() => {
        pan.setValue({ x: 0, y: 0 }) // Back to zero for next display
        dispatch(closeSelect())
      }}
    >
      <Pressable style={{ flex: 1 }} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container]}
      >
        <Pressable onPress={() => { Keyboard.dismiss() }} >
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.floatUp, { transform: pan.getTranslateTransform() }]}
          >

            <View style={styles.dragStick}>
              <View style={styles.stick}></View>
            </View>
            <View style={styles.form}>
              {(select.mode === 'search') && (
                <View style={{ gap: 20 }} {...panTextFieldResponder.panHandlers}>
                  <TextField
                    value={search}
                    label="Search"
                    placeholder='Please enter the text'
                    onChange={(text) => handleSearch(text)}
                    pt={15} pl={15} pr={15} pb={15} borderRadius={50}
                    endIcon={
                      <Pressable
                        // onPress={handleSearch}
                        style={{ padding: 5, borderRadius: 20, backgroundColor: 'transparent' }}
                      >
                        <Image
                          source={require('assets/icons/search-48px.png')}
                          tintColor={Color.disable[100]}
                          style={{
                            width: 16,
                            height: 16
                          }}
                        />
                      </Pressable>
                    }
                  // onEndEditing={handleSearch}
                  />
                  <Divider />
                </View>
              )}
              <Typography fontSize={FontSize.Normal} fontFamily={FontWeight.w700} color={Color.disable[800]} textAlign='left'>
                {select.label}
              </Typography>
              <ScrollView
                style={{ height: "100%" }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.actionList}
              >
                <View {...panScrollResponder.panHandlers}>
                  {items.length !== 0 ? (
                    (items).map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{ paddingTop: 12, width: '100%' }}
                        onPress={() => {
                          dispatch(getSelectedItem(item));
                          setSearch('');
                          handleClose();
                        }}
                      >
                        <View style={[styles.parentItem, item?.value === select.selected?.value && { backgroundColor: Color.disable[100] }]}>
                          <View style={styles.actionItem}>
                            {(item?.image != undefined) && (
                              <View style={{ borderRadius: 100, overflow: 'hidden', borderWidth: 0.1, borderColor: '#ccc' }}>
                                <Image style={styles.buttonCustomIcon} source={item.image} />
                              </View>
                            )}
                            <Typography style={{ paddingHorizontal: 5 }} fontSize={FontSize.Small} lineHeight={22} fontFamily={FontWeight.w600} color={Color.disable[700]}>{item.label}</Typography>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Typography fontSize={FontSize.Normal} lineHeight={20} fontFamily={FontWeight.w700} color={Color.disable[700]} textAlign='left'>No Items</Typography>
                  )}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}

    </Modal >
  )
};

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
  form: {
    flexDirection: 'column',
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 20,
    height: '100%'
  },
  actionList: {
    flexDirection: 'column',
    paddingHorizontal: 8
  },
  parentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 20,
    borderRadius: 20,
    paddingHorizontal: 5
  },
  buttonCustomIcon: {
    height: 35,
    width: 35
  }
})

export default SelectModal;