import hexaOpacity from '@/helpers/hexaOpacity';
import { useHaptic } from '@/hooks/useHaptic';
import { useTheme } from '@react-navigation/native';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

type ButtonProps = {
	title: string;
	onPress: () => void;
	isLoading?: boolean;
	isError?: boolean;
};

const Button = ({ title, onPress, isLoading, isError }: ButtonProps) => {
	const errorHaptic = useHaptic('error');
	const offset = useSharedValue(0);
	const { colors } = useTheme();
	const { width } = useWindowDimensions();
	const style = useAnimatedStyle(
		() => ({
			transform: [{ rotate: `${offset.value}deg` }],
		}),
		[isError]
	);

	if (isError) {
		errorHaptic!();
		offset.value = withSequence(
			withTiming(-2, { duration: 50 }),
			withRepeat(withTiming(2, { duration: 50 }), 5, true),
			withTiming(0, { duration: 50 })
		);
	}

	return (
		<Animated.View style={style}>
			<TouchableOpacity
				disabled={isLoading}
				onPress={onPress}
				style={{
					...s.container,
					width: width * 0.6,
					backgroundColor: `${colors.primary}${hexaOpacity(0.65)}`,
				}}>
				{isLoading ? (
					<ActivityIndicator size={'small'} color={colors.text} />
				) : (
					<Text style={{ color: colors.border }}>{title}</Text>
				)}
			</TouchableOpacity>
		</Animated.View>
	);
};

export default Button;

const s = StyleSheet.create({
	container: {
		height: 46,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
