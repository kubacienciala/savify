import { Typography } from '@/constants';
import hexaOpacity from '@/helpers/hexaOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';

type SegmentedControlProps = {
	options: string[];
	selectedOption: string;
	onOptionPress?: (option: string) => void;
	optionsAsIcons?: boolean;
};

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
	({ options, selectedOption, onOptionPress, optionsAsIcons }) => {
		const { colors } = useTheme();
		const { width: windowWidth } = useWindowDimensions();

		const internalPadding = 20;
		const segmentedControlWidth = windowWidth - 70;

		const itemWidth =
			(segmentedControlWidth - internalPadding) / options.length;

		const rStyle = useAnimatedStyle(() => {
			return {
				left: withTiming(
					itemWidth * options.indexOf(selectedOption) + internalPadding / 2
				),
			};
		}, [selectedOption, options, itemWidth]);

		return (
			<View
				style={[
					s.container,
					{
						width: segmentedControlWidth,
						borderRadius: 20,
						paddingLeft: internalPadding / 2,
						backgroundColor: `${colors.text}${hexaOpacity(0.2)}`,
					},
				]}>
				<Animated.View
					style={[
						{
							width: itemWidth,
							backgroundColor: `${colors.background}${hexaOpacity(0.4)}`,
						},
						rStyle,
						s.activeBox,
					]}
				/>
				{options.map((option) => {
					return (
						<TouchableOpacity
							onPress={() => {
								onOptionPress?.(option);
							}}
							key={option}
							style={[
								{
									width: itemWidth,
								},
								s.labelContainer,
							]}>
							{optionsAsIcons ? (
								<View>
									<MaterialCommunityIcons
										key={option}
										name={option as any}
										size={30}
										color={colors.text}
									/>
								</View>
							) : (
								<Text style={s.label}>{option}</Text>
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
);

const s = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 55,
	},
	activeBox: {
		position: 'absolute',
		borderRadius: 10,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.1,
		elevation: 3,
		height: '80%',
		top: '10%',
	},
	labelContainer: { justifyContent: 'center', alignItems: 'center' },
	label: {
		fontSize: Typography.FONT_SIZE_16,
	},
});

export { SegmentedControl };
