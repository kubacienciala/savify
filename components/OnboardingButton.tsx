import { SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	FlatList,
	StyleSheet,
	TouchableWithoutFeedback,
	useWindowDimensions,
} from 'react-native';
import Animated, {
	AnimatedRef,
	SharedValue,
	interpolateColor,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { OnboardingData } from '../assets/data/onboarding';

type Props = {
	dataLength: number;
	flatListIndex: SharedValue<number>;
	flatListRef: AnimatedRef<FlatList<OnboardingData>>;
	x: SharedValue<number>;
};

export const OnboardingButton = ({
	flatListRef,
	flatListIndex,
	dataLength,
	x,
}: Props) => {
	const { width: SCREEN_WIDTH } = useWindowDimensions();
	const router = useRouter();

	const buttonAnimationStyle = useAnimatedStyle(() => {
		return {
			width:
				flatListIndex.value === dataLength - 1
					? withSpring(140)
					: withSpring(60),
			height: 60,
		};
	});

	const arrowAnimationStyle = useAnimatedStyle(() => {
		return {
			width: 30,
			height: 30,
			opacity:
				flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(100)
							: withTiming(0),
				},
			],
		};
	});

	const textAnimationStyle = useAnimatedStyle(() => {
		return {
			opacity:
				flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(0)
							: withTiming(-100),
				},
			],
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
		<TouchableWithoutFeedback
			onPress={() => {
				if (flatListIndex.value < dataLength - 1) {
					flatListRef.current?.scrollToIndex({
						index: flatListIndex.value + 1,
					});
				} else {
					router.push('/(tabs)');
				}
			}}>
			<Animated.View
				style={[s.container, buttonAnimationStyle, animatedColor]}>
				<Animated.Text style={[s.textButton, textAnimationStyle]}>
					Get Started
				</Animated.Text>
				<Animated.View style={[s.arrow, arrowAnimationStyle]}>
					<SimpleLineIcons name='arrow-right' size={18} color='white' />
				</Animated.View>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const s = StyleSheet.create({
	container: {
		backgroundColor: '#1e2169',
		padding: 10,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	arrow: {
		position: 'absolute',
	},
	textButton: { color: 'white', fontSize: 16, position: 'absolute' },
});
