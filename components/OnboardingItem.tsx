import { OnboardingData } from '@/assets/data/onboarding';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
	Extrapolation,
	SharedValue,
	interpolate,
	useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
	index: number;
	x: SharedValue<number>;
	item: OnboardingData;
};

export const OnboardingItem = ({ index, x, item }: Props) => {
	const { width: SCREEN_WIDTH } = useWindowDimensions();

	const lottieAnimationStyle = useAnimatedStyle(() => {
		const translateYAnimation = interpolate(
			x.value,
			[
				(index - 1) * SCREEN_WIDTH,
				index * SCREEN_WIDTH,
				(index + 1) * SCREEN_WIDTH,
			],
			[200, 0, -200],
			Extrapolation.CLAMP
		);

		return {
			transform: [{ translateY: translateYAnimation }],
		};
	});

	const circleAnimation = useAnimatedStyle(() => {
		const scale = interpolate(
			x.value,
			[
				(index - 1) * SCREEN_WIDTH,
				index * SCREEN_WIDTH,
				(index + 1) * SCREEN_WIDTH,
			],
			[1, 4, 4],
			Extrapolation.CLAMP
		);

		return {
			transform: [{ scale: scale }],
		};
	});

	return (
		<View style={[s.itemContainer, { width: SCREEN_WIDTH }]}>
			<View style={s.circleContainer}>
				<Animated.View
					style={[
						{
							width: SCREEN_WIDTH,
							height: SCREEN_WIDTH,
							borderRadius: SCREEN_WIDTH / 2,
							backgroundColor: item.backgroundColor,
						},
						circleAnimation,
					]}
				/>
			</View>
			<Animated.View style={lottieAnimationStyle}>
				<LottieView
					source={item.animation}
					style={{
						width: SCREEN_WIDTH * 0.9,
						height: SCREEN_WIDTH * 0.9,
					}}
					autoPlay
					loop
				/>
			</Animated.View>
			<Text style={[s.itemText, { color: item.textColor }]}>
				{item.text}
			</Text>
		</View>
	);
};

const s = StyleSheet.create({
	itemContainer: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		marginBottom: 120,
	},
	itemText: {
		textAlign: 'center',
		fontSize: 44,
		fontWeight: 'bold',
		marginBottom: 10,
		marginHorizontal: 20,
	},
	circleContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
});
