import { Goal } from '@/components/Goal';
import { Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useGoalsList } from '@/services/goals';
import { useProfile } from '@/services/profiles';
import { useExpensesByMonth } from '@/services/transactions';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
	Easing,
	FadeInLeft,
	WithSpringConfig,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const IMG_HEIGHT = 200;
const TRANSLATE_Y = -80;
const DURATION = 400;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Home() {
	const { colors } = useTheme();
	const { t } = useTranslation();
	const { data: profile } = useProfile();
	const { data: goals } = useGoalsList();
	const { data: transactions, error, isLoading } = useExpensesByMonth();
	const rotation = useSharedValue(0);
	const isOpened = useRef<boolean>(false);
	const translateY1 = useSharedValue(0);
	const translateY2 = useSharedValue(0);
	const translateY3 = useSharedValue(0);

	const animatedStyle1 = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateY: translateY1.value },
				{ scale: interpolate(translateY1.value, [TRANSLATE_Y, 0], [0.9, 0]) },
			],
		};
	}, []);
	const animatedStyle2 = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						translateY2.value,
						[TRANSLATE_Y, 0],
						[TRANSLATE_Y / 2, 0]
					),
				},
				{
					translateX: interpolate(
						translateY2.value,
						[TRANSLATE_Y, 0],
						[-55, 0]
					),
				},
				{ scale: interpolate(translateY2.value, [TRANSLATE_Y, 0], [0.9, 0]) },
			],
		};
	}, []);
	const animatedStyle3 = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(translateY3.value, [TRANSLATE_Y, 0], [26, 0]),
				},
				{ translateX: translateY3.value },
				{ scale: interpolate(translateY3.value, [TRANSLATE_Y, 0], [0.9, 0]) },
			],
		};
	}, []);

	const animatedPlusStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	}, []);

	const handlePress = () => {
		if (isOpened.current) {
			translateY1.value = withDelay(
				DURATION,
				withTiming(0, {
					duration: DURATION,
					easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
				})
			);
			translateY2.value = withDelay(
				DURATION / 2,
				withTiming(0, {
					duration: DURATION,
					easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
				})
			);
			translateY3.value = withTiming(0, {
				duration: DURATION,
				easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
			});
			rotation.value = withTiming(0, { duration: DURATION });
		} else {
			const config: WithSpringConfig = {
				damping: 12,
			};
			translateY1.value = withSpring(TRANSLATE_Y, config);
			translateY2.value = withDelay(
				DURATION / 2,
				withSpring(TRANSLATE_Y, config)
			);
			translateY3.value = withDelay(DURATION, withSpring(TRANSLATE_Y, config));
			rotation.value = withTiming(-45, { duration: DURATION });
		}

		isOpened.current = !isOpened.current;
	};

	return (
		<View style={s.container}>
			<Animated.ScrollView scrollEventThrottle={16}>
				<View style={s.text}>
					<Animated.Text
						entering={FadeInLeft.duration(1000)}
						style={{ ...s.hello, color: colors.text }}>{`${t(
						'Hello'
					)},`}</Animated.Text>
					<Animated.Text
						entering={FadeInLeft.duration(1000).delay(500)}
						style={{
							...s.name,
							color: colors.text,
						}}>{`${profile?.first_name} ${profile?.last_name}`}</Animated.Text>
				</View>
				<Animated.FlatList
					nestedScrollEnabled
					pagingEnabled
					keyExtractor={(item) => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
					data={goals || []}
					renderItem={({ item, index }) => (
						<Goal
							onPress={() => {
								console.log(item);
							}}
							id={item.id}
							title={item.title}
							goal={item.goal}
							backgroundColor={index % 2 === 0 ? Colors.PINK : Colors.GREEN}
							color={index % 2 === 0 ? Colors.GREEN : Colors.PINK}
							amount={item.amount}
						/>
					)}
				/>
			</Animated.ScrollView>
			<View style={s.bottomContainer}>
				<Pressable
					onPress={handlePress}
					style={({ pressed }) =>
						pressed
							? {
									justifyContent: 'center',
									alignItems: 'center',
									height: 50,
									width: 50,
									borderRadius: 50,
									backgroundColor: colors.card,
									transform: [{ scale: 0.9 }],
							  }
							: {
									justifyContent: 'center',
									alignItems: 'center',
									height: 50,
									width: 50,
									borderRadius: 50,
									backgroundColor: colors.card,
							  }
					}>
					<Animated.View style={animatedPlusStyle}>
						<AntDesign name='plus' size={30} color={colors.border} />
					</Animated.View>
				</Pressable>
				<AnimatedPressable
					style={[
						animatedStyle1,
						{
							position: 'absolute',
							justifyContent: 'center',
							alignItems: 'center',
							height: 50,
							width: 50,
							borderRadius: 50,
							backgroundColor: colors.card,
							zIndex: -1,
						},
					]}>
					<AntDesign name='camera' size={30} color={colors.border} />
				</AnimatedPressable>
				<AnimatedPressable
					style={[
						animatedStyle2,
						{
							position: 'absolute',
							justifyContent: 'center',
							alignItems: 'center',
							height: 50,
							width: 50,
							borderRadius: 50,
							backgroundColor: colors.card,
							zIndex: -1,
						},
					]}>
					<AntDesign name='cloud' size={30} color={colors.border} />
				</AnimatedPressable>
				<AnimatedPressable
					style={[
						animatedStyle3,
						{
							position: 'absolute',
							justifyContent: 'center',
							alignItems: 'center',
							height: 50,
							width: 50,
							borderRadius: 50,
							backgroundColor: colors.card,
							zIndex: -1,
						},
					]}>
					<AntDesign name='filter' size={30} color={colors.border} />
				</AnimatedPressable>
			</View>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		alignSelf: 'flex-start',
		paddingHorizontal: 18,
	},

	hello: {
		fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
		lineHeight: Typography.LINE_HEIGHT_18,
		fontSize: Typography.FONT_SIZE_16,
		letterSpacing: 1,
	},
	name: {
		fontFamily: Typography.FONT_FAMILY_POPPINS_SEMIBOLD,
		fontSize: Typography.FONT_SIZE_20,
		lineHeight: Typography.LINE_HEIGHT_30,
		letterSpacing: 1.75,
	},
	bottomContainer: {
		marginBottom: 40,
		marginRight: 40,
		alignItems: 'flex-end',
	},
	image: {
		height: IMG_HEIGHT,
		width: width,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	button: {
		marginVertical: 40,
		backgroundColor: '#f4f7fc',
		paddingHorizontal: 60,
		paddingVertical: 15,
		borderRadius: 10,
	},
	buttonText: {
		color: 'black',
		fontSize: 20,
	},
});
