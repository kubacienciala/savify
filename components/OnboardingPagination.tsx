import { OnboardingData } from '@/assets/data/onboarding';
import { OnboardingDot } from '@/components/OnboardingDot';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

type Props = {
	data: OnboardingData[];
	x: SharedValue<number>;
};
export const OnboardingPagination = ({ data, x }: Props) => {
	return (
		<View style={s.paginationContainer}>
			{data.map((_, index) => {
				return <OnboardingDot index={index} x={x} key={index} />;
			})}
		</View>
	);
};

const s = StyleSheet.create({
	paginationContainer: {
		flexDirection: 'row',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
