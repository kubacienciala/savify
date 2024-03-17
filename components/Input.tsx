/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import hexaOpacity from '@/helpers/hexaOpacity';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	NativeSyntheticEvent,
	StyleSheet,
	TextInput,
	TextInputFocusEventData,
	TextInputProps,
	TouchableOpacity,
	View,
	ViewStyle,
	useWindowDimensions,
} from 'react-native';
import Reanimated, {
	FadeInRight,
	FadeInUp,
	FadeOutRight,
} from 'react-native-reanimated';

const AnimatedInput = Reanimated.createAnimatedComponent(TextInput);

interface InputProps extends TextInputProps {
	label?: string;
	value: string | undefined;
	onChangeText?: (e: string | React.ChangeEvent<any>) => void;
	onBlur?: (e: any) => void;
	error?: string;
	passwordInput?: boolean;
	style?: ViewStyle;
	placeholder?: string | undefined;
	multiline?: boolean;
	disabled?: boolean;
	animatedProps?: Partial<Reanimated.AnimateProps<TextInputProps>> | undefined;
	widthMultiplier?: number;
}

const Input = React.forwardRef<TextInput, InputProps>(
	(
		{
			animatedProps,
			value,
			onChangeText,
			onBlur,
			error,
			passwordInput = false,
			style,
			placeholder,
			multiline,
			disabled = false,
			widthMultiplier = 1,
			...rest
		},
		ref
	) => {
		const { width } = useWindowDimensions();
		const { t } = useTranslation();
		const { dark, colors } = useTheme();
		const [isFocused, setIsFocused] = useState<boolean>(false);
		const [isPasswordShown, setIsPasswordShown] = useState<boolean>(
			!passwordInput
		);

		const handleBlur = useCallback(
			(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
				onBlur && onBlur(e);
				setIsFocused(false);
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
		);

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<AnimatedInput
					style={{
						fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
						color: colors.text,
						borderWidth: disabled ? 0 : 1,
						borderColor: `${colors.text}${hexaOpacity(0.6)}`,
						borderRadius: 12,
						width: (width / 1.25) * widthMultiplier,
						height: multiline ? 200 : 46,
						paddingLeft: 15,
						paddingTop: multiline ? 15 : 0,
					}}
					value={value}
					secureTextEntry={passwordInput && !isPasswordShown}
					placeholder={placeholder}
					placeholderTextColor={`${colors.text}${hexaOpacity(0.3)}`}
					onChangeText={onChangeText}
					onBlur={handleBlur}
					onFocus={() => setIsFocused(true)}
					editable={!disabled}
					multiline={multiline}
					{...rest}
				/>
				{passwordInput && (
					<Reanimated.View
						style={{ position: 'absolute', right: 15, top: 11 }}
						entering={FadeInRight}
						exiting={FadeOutRight}>
						<TouchableOpacity
							hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
							style={s.eyeButton}
							onPress={() => setIsPasswordShown((prev) => !prev)}>
							{isPasswordShown ? (
								<Ionicons name='eye' size={15} color={colors.text} />
							) : (
								<Ionicons name='eye-off' size={15} color={colors.text} />
							)}
						</TouchableOpacity>
					</Reanimated.View>
				)}
				{error && (
					<Reanimated.Text
						entering={FadeInUp}
						style={[s.infoLabel, { color: Colors.RED, marginTop: 5 }]}>
						{error}
					</Reanimated.Text>
				)}
			</View>
		);
	}
);

export default Input;

const s = StyleSheet.create({
	eyeButton: {
		padding: 5,
	},
	infoLabel: {
		fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
		fontSize: Typography.FONT_SIZE_12,
		color: Colors.RED,
		textAlign: 'right',
	},
});
