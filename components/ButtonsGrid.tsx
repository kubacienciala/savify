import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InputButton } from './InputButton';

const items = [
	{ label: '1' },
	{ label: '2' },
	{ label: '3' },
	{ label: '4' },
	{ label: '5' },
	{ label: '6' },
	{ label: '7' },
	{ label: '8' },
	{ label: '9' },
	{ label: ',' },
	{ label: '0' },
	{ label: 'backspace' },
];

type ButtonsGridProps = {
	input: string;
	onUpdate: (value: string) => void;
	onBackspace?: (value: string) => void;
	onReset?: () => void;
	onMaxReached?: () => void;
};

const ButtonsGrid: React.FC<ButtonsGridProps> = React.memo(
	({ input, onReset, onUpdate, onBackspace, onMaxReached }) => {
		return (
			<View style={s.container}>
				{items.map(({ label }, index) => {
					return (
						<InputButton
							key={index}
							style={s.input}
							onLongTap={() => {
								if (label === 'backspace') {
									onReset?.();
									return;
								}
							}}
							onTap={() => {
								if (input.length === 1) {
									if (label === 'backspace') {
										onReset?.();
										return;
									}
									if (label === ',') {
										onUpdate(`${input}${label}`);
										return;
									}
								}
								if (
									(label === ',' && input.includes(',')) ||
									(label !== 'backspace' && input.split(',')[1]?.length >= 2)
								) {
									return;
								}
								if (label !== 'backspace') {
									if (input[0] === '0' && !input[1]) {
										onUpdate(label);
										return;
									}
									const newValue = `${input}${label}`;
									if (newValue.length > 10) {
										onMaxReached?.();
										return;
									}
									onUpdate(`${input}${label}`);
									return;
								}
								if (label === 'backspace') {
									onBackspace?.(input.slice(0, -1));
									return;
								}
							}}>
							{label !== 'backspace' && (
								<Text style={s.number}>{label}</Text>
							)}
							{label === 'backspace' && (
								<FontAwesome5 name={label} size={24} color='white' />
							)}
						</InputButton>
					);
				})}
			</View>
		);
	}
);

const s = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	input: {
		width: '30%',
		height: '20%',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		marginLeft: 7 / 3 + '%',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		marginBottom: 7 / 3 + '%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	number: {
		textAlign: 'center',
		fontSize: 30,
		color: 'white',
		fontFamily: 'SF-Pro-Rounded-Bold',
	},
});

export { ButtonsGrid };
