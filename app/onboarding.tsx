import data, { OnboardingData } from '@/assets/data/onboarding';
import { OnboardingButton } from '@/components/OnboardingButton';
import { OnboardingItem } from '@/components/OnboardingItem';
import { OnboardingPagination } from '@/components/OnboardingPagination';
import React from 'react';
import { FlatList, StyleSheet, View, ViewToken } from 'react-native';
import Animated, {
	useAnimatedRef,
	useAnimatedScrollHandler,
	useSharedValue,
} from 'react-native-reanimated';

const Onboarding = () => {
	const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
	const x = useSharedValue(0);
	const flatListIndex = useSharedValue(0);

	const onViewableItemsChanged = ({
		viewableItems,
	}: {
		viewableItems: ViewToken[];
	}) => {
		if (viewableItems[0].index !== null) {
			flatListIndex.value = viewableItems[0].index;
		}
	};

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			x.value = event.contentOffset.x;
		},
	});

	return (
		<View style={s.container}>
			<Animated.FlatList
				ref={flatListRef}
				onScroll={onScroll}
				data={data}
				renderItem={({ item, index }) => {
					return <OnboardingItem item={item} index={index} x={x} />;
				}}
				keyExtractor={(item) => item.id}
				scrollEventThrottle={16}
				horizontal={true}
				bounces={false}
				pagingEnabled={true}
				showsHorizontalScrollIndicator={false}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={{
					minimumViewTime: 300,
					viewAreaCoveragePercentThreshold: 10,
				}}
			/>
			<View style={s.bottomContainer}>
				<OnboardingPagination data={data} x={x} />
				<OnboardingButton
					flatListRef={flatListRef}
					flatListIndex={flatListIndex}
					dataLength={data.length}
					x={x}
				/>
			</View>
		</View>
	);
};

export default Onboarding;

const s = StyleSheet.create({
	container: {
		flex: 1,
	},
	bottomContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 30,
		paddingVertical: 30,
		position: 'absolute',
		bottom: 20,
		left: 0,
		right: 0,
	},
});
