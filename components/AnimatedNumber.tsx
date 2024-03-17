import React, { useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import { getCommasArray } from '@/helpers/getCommasArray';

import { AnimatedSingleNumber } from './AnimatedSingleNumber';

type AnimatedNumberProps = {
	value: string;
	onPress: () => void;
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
	value,
	onPress,
}) => {
	const splittedValue = useMemo(() => {
		return value.toString().split('');
	}, [value]);

	const commas = useMemo(() => {
		return getCommasArray(value);
	}, [value]);

	const ITEM_WIDTH = 55;
	const ITEM_HEIGHT = 100;
	const SCALE = 1 - splittedValue.length * 0.05;
	const SCALE_WIDTH_OFFSET = 0.08;

	const buildIndividualNumber = useCallback(
		(params: {
			index: number;
			item: string;
			containerStyle?: StyleProp<ViewStyle>;
		}) => {
			return (
				<AnimatedSingleNumber
					index={params.index}
					value={params.item}
					scale={SCALE}
					scaleWidthOffset={SCALE_WIDTH_OFFSET}
					key={params.index + params.item.toString()}
					totalNumbersLength={splittedValue.length}
					rightSpace={params.item === ',' ? 5 : 10}
					itemWidth={ITEM_WIDTH}
					itemHeight={ITEM_HEIGHT}
					containerStyle={[s.itemContainer, params.containerStyle ?? {}]}
					style={s.item}
				/>
			);
		},
		[SCALE, commas, splittedValue.length]
	);

	return (
		<Pressable
			onPress={onPress}
			style={{
				right: splittedValue.length * 2.25,
				backgroundColor: 'transparent',
			}}>
			{splittedValue.map((item, index) => {
				return buildIndividualNumber({ index, item });
			})}
			{commas.map((item, index) => {
				if (item === '') return null;

				return buildIndividualNumber({
					index,
					item,
				});
			})}
		</Pressable>
	);
};

const s = StyleSheet.create({
	item: {
		fontSize: 90,
		color: 'white',
		fontWeight: 'bold',
		width: 60,
		textAlign: 'center',
		fontFamily: 'SF-Pro-Rounded-Bold',
	},
	itemContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
