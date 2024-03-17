import { Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useDeleteGoal } from '@/services/goals';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useFont } from '@shopify/react-native-skia';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import CircularProgressBar from './CircularProgressBar';

type Props = {
	title: string;
	onPress: () => void;
	goal: number;
	id: number;
	amount: number;
	backgroundColor: string;
	color: string;
};

const RADIUS = 40;
const STROKE_WIDTH = 10;

export const Goal = ({
	title,
	onPress,
	goal,
	amount,
	id,
	backgroundColor,
	color,
}: Props) => {
	const { mutate: deleteGoal, data, isSuccess, isError } = useDeleteGoal();
	const { colors } = useTheme();
	const [badge, setBadge] = useState<boolean>(false);
	const offset = useSharedValue(0);
	const percentage = useSharedValue(0);
	const end = useSharedValue(0);
	const font = useFont(require('@/assets/fonts/Poppins-SemiBold.ttf'), 20);

	const handleDelete = () => {
		deleteGoal(id);
		setBadge(false);
	};

	const style = useAnimatedStyle(() => ({
		backgroundColor,
		...s.container,
		transform: [{ rotate: `${offset.value}deg` }],
	}));

	useEffect(() => {
		percentage.value = withTiming((amount / goal) * 100, { duration: 1000 });
		end.value = withTiming(((amount / goal) * 100) / 100, { duration: 1000 });
	}, [goal, amount]);

	useEffect(() => {
		if (!badge) {
			offset.value = 0;
			return;
		}
		offset.value = withRepeat(
			withSequence(
				withTiming(-1, { duration: 50 }),
				withTiming(1, { duration: 50 }),
				withTiming(0, { duration: 50 })
			),
			-1,
			true
		);
	}, [badge]);

	if (!font) return <View />;

	return (
		<Animated.View style={style}>
			{badge && (
				<TouchableOpacity
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					onPress={handleDelete}>
					<Animated.View entering={FadeIn} exiting={FadeOut} style={s.badge}>
						<Ionicons name='close' size={20} color={Colors.WHITE} />
					</Animated.View>
				</TouchableOpacity>
			)}
			<Link
				href={{
					pathname: '/goals/goalForm',
					params: {
						id,
						title,
						goal,
						amount,
					},
				}}
				asChild>
				<Pressable
					onLongPress={() => {
						setBadge(!badge);
					}}
					style={s.innerContainer}>
					<Text style={{ ...s.title, color }}>{title}</Text>
					<View style={s.chartContainer}>
						<CircularProgressBar
							color={color}
							percentage={percentage}
							font={font}
							end={end}
							radius={RADIUS}
							strokeWidth={STROKE_WIDTH}
						/>
					</View>
				</Pressable>
			</Link>
		</Animated.View>
	);
};

const s = StyleSheet.create({
	container: {
		height: 175,
		width: 175,
		borderRadius: 10,
		marginVertical: 10,
		marginHorizontal: 10,
	},
	innerContainer: {
		flex: 1,
		marginTop: 18,
		marginLeft: 15,
	},
	chartContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		marginRight: 10,
		marginBottom: 10,
	},
	title: {
		fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
		lineHeight: Typography.LINE_HEIGHT_24,
		fontSize: Typography.FONT_SIZE_16,
	},
	badge: {
		justifyContent: 'center',
		alignContent: 'center',
		width: 20,
		height: 20,
		borderRadius: 50,
		backgroundColor: Colors.RED,
		position: 'absolute',
		top: -5,
		right: -5,
	},
});
