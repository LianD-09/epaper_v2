import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../libs/button";
import Color from "../../themes/color";
import fontSize from "../../themes/font-size";
import fontWeight from "../../themes/font-weight";
import Typography from "../../libs/typography";
import { closeBottomModal } from "../../redux/slice/bottom-modal-slice";
import { BMState, RootState } from "../../redux/store";

export const modalConfig = {
    animationIn: "slideInUp",
    animationOut: "slideOutDown",
    opacity: 0.5,
    transitionInTiming: 300,
    transitionOutTiming: 300,
    animationOutTiming: 500,
    percentageSwipeToClose: 20
}

const BottomModal = () => {
    const dispatch = useDispatch();
    const modalNoti = useSelector<RootState, BMState>(
        (state) => state.bottomModal
    );
    const deviceWidth = Dimensions.get("window").width;
    const [show, setShow] = useState(false);


    useEffect(() => {
        setShow(modalNoti?.isOpen)
    }, [modalNoti?.isOpen])

    const handleClose = () => {
        setShow(false);
    };

    const handlePress = () => {
        if (typeof modalNoti?.callback === 'function') {
            modalNoti?.callback();
        }
        setShow(false);
    };

    return (
        <Modal
            isVisible={show}
            coverScreen={false}
            deviceWidth={deviceWidth}
            avoidKeyboard={true}
            animationIn={"slideInUp"}
            animationOut={"slideOutDown"}
            backdropOpacity={modalConfig.opacity}
            backdropTransitionInTiming={modalConfig.transitionInTiming}
            backdropTransitionOutTiming={modalConfig.transitionOutTiming}
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
            style={styles.modal}
            onModalHide={() => dispatch(closeBottomModal())}
        >
            <View style={styles.container}>
                <Pressable style={{ flex: 1 }} onPress={handleClose} />

                <View style={styles.content}>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16
                        }}
                    >
                        {modalNoti?.icon ? (
                            <Image style={{ height: 76, width: 76 }} source={modalNoti.icon} />
                        ) : null}

                        <View style={{ gap: 6, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Typography
                                lineHeight={24}
                                color={
                                    modalNoti?.isFailed
                                        ? Color.error[900]
                                        : Color.primary[700]
                                }
                                fontSize={fontSize.VeryBig}
                                fontFamily={fontWeight.w700}
                            >
                                {modalNoti.title}
                            </Typography>

                            {
                                typeof modalNoti?.content === 'string' ?
                                    <Typography
                                        lineHeight={22}
                                        color={Color.disable[600]}
                                        fontSize={fontSize.Small}
                                        fontFamily={fontWeight.w500}
                                    >
                                        {modalNoti?.content}
                                    </Typography>
                                    :
                                    modalNoti?.content
                            }
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                    }}>
                        {modalNoti?.btnTitle != '' && (
                            <Button onPress={handlePress}>{modalNoti.btnTitle}</Button>
                        )}
                        {modalNoti?.btnCancelTitle ? (
                            <TouchableOpacity
                                style={{ paddingTop: 6, paddingHorizontal: 16, width: '100%', justifyContent: 'center', alignItems: 'center' }}
                                activeOpacity={0.5}
                                onPress={handleClose}
                            >
                                <Typography
                                    lineHeight={22}
                                    color={Color.primary[700]}
                                    fontSize={fontSize.Small}
                                    fontFamily={fontWeight.w700}
                                >
                                    {modalNoti?.btnCancelTitle}
                                </Typography>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
    content: {
        gap: 28,
        paddingTop: 28,
        paddingBottom: 32,
        paddingHorizontal: 22,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Color.white[100],
    },
});

export default React.memo(BottomModal);
