import TransactionInMonthly from '@/components/TransactionInMonthly';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface PieData {
	value: number;
	color: string;
}

const TransactionsDetails = () => {
	const [selectedItem, setSelectedItem] = useState<PieData | null>(null);
	const [pieData, setPieData] = useState<PieData[]>([]);
	const opacity = useSharedValue(0);
	const rotation = useSharedValue(0);
	const scale = useSharedValue(0);
	const scaleRenderItem = useSharedValue(1);
	const { categories, amounts, total_amount, colors } = useLocalSearchParams();

	const rotationAnimationStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
			opacity: opacity.value,
		};
	}, []);

	useEffect(() => {
		if (!categories || !amounts) return;
		const pieData: PieData[] = [];
		(amounts as string)
			.split(',')
			.map(Number)
			.map((amount, index) => {
				pieData.push({
					value: amount,
					color: (colors as string).split(',').map(String)[index],
				});
			});
		setPieData(pieData);
		opacity.value = withTiming(1, { duration: 1000 });
		rotation.value = withTiming(360, { duration: 1000 });
		scale.value = withTiming(1, { duration: 1000 });
	}, []);

	useEffect(() => {
		if (!selectedItem) return;
		scaleRenderItem.value = withTiming(1.1, { duration: 1000 });
		return () => {
			scaleRenderItem.value = 1;
		};
	}, [selectedItem?.color]);

	const handlePiePress = (data: PieData) => {
		if (selectedItem && selectedItem.color === data.color) {
			scaleRenderItem.value = withTiming(
				1,
				{ duration: 1000 },
				(isFinished) => {
					if (isFinished) {
						return runOnJS(setSelectedItem)(null);
					}
				}
			);
		}
		setSelectedItem(data);
	};

	return (
		<ScrollView
			contentContainerStyle={{
				justifyContent: 'center',
				alignItems: 'center',
				gap: 30,
			}}
			style={{
				flexGrow: 1,
			}}>
			<Animated.View style={rotationAnimationStyle}>
				<PieChart
					onPress={handlePiePress}
					shadow
					shadowWidth={10}
					shadowColor='rgba(0,0,0,1)'
					data={pieData}
					donut
					showGradient
					focusOnPress
					radius={140}
					innerRadius={40}
					innerCircleColor={'#232B5D'}
				/>
			</Animated.View>
			{pieData
				.sort((a, b) => b.value - a.value)
				.map((item, index) => {
					return (
						<TransactionInMonthly
							item={item}
							key={index}
							index={index}
							scale={
								selectedItem && selectedItem.color === item.color
									? scaleRenderItem
									: scale
							}
						/>
					);
				})}
		</ScrollView>
	);
};

export default TransactionsDetails;

const s = StyleSheet.create({});
