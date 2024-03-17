import { Typography } from '@/constants';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
	FadeInDown,
	FadeOutDown,
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';

interface PieData {
	value: number;
	color: string;
}

type Props = {
	item: PieData;
	index: number;
	scale: SharedValue<number>;
};

const TransactionInMonthly = ({ item, index, scale }: Props) => {
	const { width } = useWindowDimensions();
	const { colors } = useTheme();

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	}, [scale]);

	return (
		<Animated.View
			style={[
				s.container,
				animatedStyle,
				{ width: width * 0.9, backgroundColor: colors.text },
			]}
			entering={FadeInDown.delay(index * 200)}
			exiting={FadeOutDown}>
			<View style={s.contentContainer}>
				<View style={[s.color, { backgroundColor: item.color }]}></View>
				<Text style={{ ...s.text, color: colors.background }}>
					${item.value}
				</Text>
			</View>
		</Animated.View>
	);
};

export default TransactionInMonthly;

const s = StyleSheet.create({
	container: {
		height: 70,
		borderRadius: 20,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 20,
	},
	color: {
		width: 60,
		height: 60,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	category: {
		fontSize: Typography.FONT_SIZE_14,
	},
	text: {
		fontSize: Typography.FONT_SIZE_22,
		fontWeight: Typography.FONT_WEIGHT_BOLD,
	},
});
