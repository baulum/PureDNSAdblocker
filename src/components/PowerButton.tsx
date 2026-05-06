import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {Power} from 'lucide-react-native';

interface PowerButtonProps {
  isActive: boolean;
  isLoading: boolean;
  accentColor: string;
  onPress: () => void;
}

const BUTTON_SIZE = 148;
const GLOW_SIZE = BUTTON_SIZE + 56;
const GLOW_OUTER_SIZE = BUTTON_SIZE + 96;

const PowerButton: React.FC<PowerButtonProps> = ({
  isActive,
  isLoading,
  accentColor,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      glowOpacity.value = withTiming(1, {duration: 600});
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.12, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {duration: 2000, easing: Easing.inOut(Easing.sin)}),
        ),
        -1,
        false,
      );
    } else {
      glowOpacity.value = withTiming(0, {duration: 400});
      pulseScale.value = withTiming(1, {duration: 400});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.88, {damping: 10, stiffness: 500}),
      withSpring(1, {damping: 14, stiffness: 300}),
    );
    opacity.value = withSequence(
      withTiming(0.5, {duration: 70}),
      withTiming(1, {duration: 220}),
    );
    onPress();
  };

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{scale: pulseScale.value}],
  }));

  const iconColor = isActive ? '#fff' : '#444';
  const borderColor = isActive ? accentColor : '#222';
  const bgColor = isActive ? accentColor + '22' : '#111';

  return (
    <View style={styles.wrapper}>
      {/* Outer soft glow */}
      <Animated.View
        style={[
          styles.glowOuter,
          {backgroundColor: accentColor + '10'},
          glowAnimStyle,
        ]}
      />
      {/* Inner glow ring */}
      <Animated.View
        style={[
          styles.glowInner,
          {backgroundColor: accentColor + '22'},
          glowAnimStyle,
        ]}
      />

      <Animated.View style={buttonAnimStyle}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: bgColor,
              borderColor: borderColor,
              shadowColor: isActive ? accentColor : '#000',
            },
          ]}
          onPress={handlePress}
          activeOpacity={1}
          disabled={isLoading}>
          <Power
            size={52}
            color={iconColor}
            strokeWidth={isActive ? 2.5 : 1.8}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: GLOW_OUTER_SIZE,
    height: GLOW_OUTER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: GLOW_OUTER_SIZE,
    height: GLOW_OUTER_SIZE,
    borderRadius: GLOW_OUTER_SIZE / 2,
  },
  glowInner: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
});

export default PowerButton;
