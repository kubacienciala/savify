import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
	Extrapolation,
	SharedValue,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
	index: number;
	x: SharedValue<number>;
};

export const OnboardingDot = ({ index, x }: Props) => {
	const { width: SCREEN_WIDTH } = useWindowDimensions();

	const animatedDotStyle = useAnimatedStyle(() => {
		const widthAnimation = interpolate(
			x.value,
			[
				(index - 1) * SCREEN_WIDTH,
				index * SCREEN_WIDTH,
				(index + 1) * SCREEN_WIDTH,
			],
			[10, 20, 10],
			Extrapolation.CLAMP
		);

		const opacityAnimation = interpolate(
			x.value,
			[
				(index - 1) * SCREEN_WIDTH,
				index * SCREEN_WIDTH,
				(index + 1) * SCREEN_WIDTH,
			],
			[0.5, 1, 0.5],
			Extrapolation.CLAMP
		);
		return {
			width: widthAnimation,
			opacity: opacityAnimation,
		};
	});

	const animatedColor = useAnimatedStyle(() => {
		const backgroundColor = interpolateColor(
			x.value,
			[0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
			['#005b4f', '#1e2169', '#F15937']
		);

		return {
			backgroundColor: backgroundColor,
		};
	});

	return (
		<Animated.View style={[s.dots, animatedDotStyle, animatedColor]} />
	);
};

const s = StyleSheet.create({
	dots: {
		height: 10,
		marginHorizontal: 10,
		borderRadius: 5,
	},
});
