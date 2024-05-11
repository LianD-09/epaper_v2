import * as React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import Color from "../themes/color";
import fontSize from "../themes/font-size";
import fontWeight from "../themes/font-weight";

const SwitchCustom = (props) => {
  const { isOn, onToggle, label } = props;
  const translateXValue = React.useRef(new Animated.Value(0)).current;
  const onColor = Color.primary[700];
  const offColor = Color.primary[200];

  const color = isOn ? onColor : offColor;

  const handleToggle = () => {
    Animated.timing(translateXValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      useNativeDriver: Platform.OS === "ios",
    }).start();
  };

  React.useEffect(() => {
    handleToggle();
  }, [isOn]);

  const interpolatedTranslateX = translateXValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 18],
  });

  return (
    <View style={styles.container}>
      {label != '' && (
        <Text style={styles.label}>{label}</Text>
      )}
      <TouchableOpacity onPress={typeof onToggle === "function" && onToggle}>
        <View style={[styles.toggleContainer, { backgroundColor: color }]}>
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                transform: [{ translateX: interpolatedTranslateX }],
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

SwitchCustom.propTypes = {
  onToggle: PropTypes.func,
  isOn: PropTypes.bool.isRequired,
  label: PropTypes.string,
};

SwitchCustom.defaultProps = {
  onToggle: () => { },
  isOn: false,
  label: ''
};

export default SwitchCustom;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  toggleContainer: {
    width: 42,
    height: 26,
    borderRadius: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: 16
  },
  toggleWheelStyle: {
    width: 20,
    height: 20,
    backgroundColor: Color.white[100],
    borderRadius: 12.5,
    shadowColor: Color.black[100],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
  label: {
    paddingHorizontal: 16,
    fontSize: fontSize.Tiny,
    fontFamily: fontWeight.w700,
    color: Color.primary[400],
  },
});
