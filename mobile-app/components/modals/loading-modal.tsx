import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import { closeLoading } from "../../redux/slice/loading-slice";
import { RootState } from "../../redux/store";

const modalConfig = {
    animationIn: "slideInUp",
    animationOut: "slideOutDown",
    opacity: 0.5,
    transitionInTiming: 300,
    transitionOutTiming: 300,
    animationOutTiming: 500,
    percentageSwipeToClose: 20
}

const LoadingModal = () => {
    const dispatch = useDispatch();
    const modalNoti = useSelector<RootState, any>(
        (state) => state.loading
    );
    const deviceWidth = Dimensions.get("window").width;
    const [show, setShow] = useState(false);


    useEffect(() => {
        setShow(modalNoti?.isOpen)
    }, [modalNoti?.isOpen])

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
            onModalHide={() => dispatch(closeLoading())}
        >
            <View style={styles.container}>
                <ActivityIndicator size={'large'} style={{ backgroundColor: Color.white[100], padding: 20, borderRadius: 999 }} />
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
        justifyContent: "center",
        alignItems: 'center',
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

export default React.memo(LoadingModal);
