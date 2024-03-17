import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { PressableScale } from './PressableScale';

// Configuration for timing animations
const WithTimingConfig = {
	duration: 300,
};

type SplitButtonProps = {
	style?: StyleProp<ViewStyle>;
	onLeft?: () => void;
	onRight?: () => void;
	onMid?: () => void;
	leftIcon: React.ReactNode;
	midIcon: React.ReactNode;
	rightIcon: React.ReactNode;
	label?: string;
	buttonWidth?: number;
	maxSpacing?: number;
};

const SplitButton: React.FC<SplitButtonProps> = React.memo(
	({
		style,
		onLeft,
		onRight,
		onMid,
		buttonWidth = 100,
		maxSpacing = 13,
		leftIcon,
		midIcon,
		rightIcon,
		label = 'Start',
	}) => {
		// State to track the activation state of the button
		const [activated, setActive] = useState(false);

		// Calculate the offset for animation based on button width and spacing
		const offset =
			Platform.OS === 'ios'
				? buttonWidth + maxSpacing
				: buttonWidth / 2 + maxSpacing;

		// Animated styles for the left button's movement
		const rRightStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{
						translateX: withSpring(!activated ? 0 : offset),
					},
				],
			};
		}, [activated]);

		const rMidStyle = useAnimatedStyle(() => {
			return {
				opacity: withTiming(activated ? 1 : 0, WithTimingConfig),
			};
		}, [activated]);

		// Animated styles for the right button's movement and opacity
		const rLeftStyle = useAnimatedStyle(() => {
			return {
				opacity: withTiming(activated ? 1 : 0, WithTimingConfig),
				transform: [
					{
						translateX: withSpring(!activated ? 0 : -offset),
					},
				],
			};
		}, [activated]);

		// Animated styles for the chip's horizontal padding
		const rAnimatedChipStyle = useAnimatedStyle(() => {
			return {
				paddingHorizontal: withTiming(!activated ? 24 : 36, WithTimingConfig),
			};
		}, [activated]);

		return (
			<View style={[s.container, style]}>
				{/* Left Button */}
				<Animated.View style={rLeftStyle}>
					<PressableScale
						onPress={() => {
							onLeft?.(); // Call the provided onLeft function if available
							setActive(false); // Deactivate the button
						}}>
						<View style={[s.chip, activated && s.activeChip]}>
							{activated && (
								<Animated.View
									entering={FadeIn}
									exiting={FadeOut}
									layout={LinearTransition}
									style={[s.chipContent, rAnimatedChipStyle]}>
									{leftIcon}
								</Animated.View>
							)}
						</View>
					</PressableScale>
				</Animated.View>
				{/* Middle Button */}
				{Platform.OS === 'ios' && (
					<Animated.View style={[s.rightChipContainer, rMidStyle]}>
						<PressableScale
							onPress={() => {
								onMid?.();
								setActive(false); // Deactivate the button
							}}>
							<View
								style={[
									activated && s.chip,
									activated && s.activeChip,
								]}>
								<Animated.View
									entering={FadeIn}
									exiting={FadeOut}
									layout={LinearTransition}
									style={[s.chipContent, rAnimatedChipStyle]}>
									{midIcon}
								</Animated.View>
							</View>
						</PressableScale>
					</Animated.View>
				)}
				{/* Right Button */}
				<Animated.View style={[s.rightChipContainer, rRightStyle]}>
					<PressableScale
						onPress={() => {
							if (!activated) {
								setActive(true); // Activate the button
								return;
							}
							setActive(false); // Deactivate the button
							onRight?.(); // Call the provided onRight function if available
						}}>
						<View
							style={[
								s.chip,
								s.rightChip,
								activated && s.activeRightChip,
							]}>
							<Animated.View style={[s.chipContent, rAnimatedChipStyle]}>
								<Text
									style={[s.chipText, activated && s.activeChipText]}>
									{activated ? rightIcon : label}
								</Text>
							</Animated.View>
						</View>
					</PressableScale>
				</Animated.View>
			</View>
		);
	}
);

const s = StyleSheet.create({
	container: {
		height: 100,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chip: {
		width: 100,
		height: 60,
		shadowRadius: 5,
		shadowOpacity: 0.1,
		shadowOffset: { height: 1, width: 0 },
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Colors.GRAY,
		backgroundColor: Colors.WHITE,
	},
	activeChip: {
		width: 100, // Adjust as needed
		borderColor: Colors.GRAY,
		borderWidth: 1,
	},
	rightChipContainer: {
		position: 'absolute',
		zIndex: 100,
	},
	rightChip: {
		backgroundColor: Colors.BLACK,
	},
	activeRightChip: {
		backgroundColor: Colors.WHITE,
	},
	chipContent: {
		flex: 1,
		paddingVertical: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chipText: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.WHITE,
	},
	activeChipText: {
		color: Colors.WHITE,
	},
});

export { SplitButton };
