import { Colors } from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { Canvas, Path, SkFont, Skia, Text } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

type Props = {
	strokeWidth: number;
	radius: number;
	percentage: SharedValue<number>;
	end: SharedValue<number>;
	font: SkFont;
	color: string;
};

const CircularProgressBar = ({
	radius,
	strokeWidth,
	percentage,
	end,
	font,
	color,
}: Props) => {
	const { colors } = useTheme();
	const innerRadius = radius - strokeWidth / 2;

	const path = Skia.Path.Make();
	path.addCircle(radius, radius, innerRadius);

	const targetText = useDerivedValue(
		() => `${Math.round(percentage.value)}%`,
		[]
	);

	const fontSize = font.measureText('00%');

	const textX = useDerivedValue(() => {
		const _fontSize = font.measureText(targetText.value);
		return radius - _fontSize.width / 2;
	}, []);

	return (
		<View style={{ width: radius * 2, height: radius * 2 }}>
			<Canvas style={s.container}>
				<Path
					path={path}
					strokeWidth={strokeWidth}
					color={Colors.WHITE}
					style='stroke'
					strokeJoin='round'
					strokeCap='round'
					start={0}
					end={1}
				/>
				<Path
					path={path}
					strokeWidth={strokeWidth}
					color={color}
					style='stroke'
					strokeJoin='round'
					strokeCap='round'
					start={0}
					end={end}
				/>
				<Text
					x={textX}
					y={radius + fontSize.height / 2}
					text={targetText}
					font={font}
					color={Colors.WHITE}
				/>
			</Canvas>
		</View>
	);
};

export default CircularProgressBar;

const s = StyleSheet.create({
	container: {
		flex: 1,
	},
});
