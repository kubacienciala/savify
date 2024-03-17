import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from './Colors';

export const themes = {
	light: {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: Colors.GREEN,
			background: Colors.CREAMY,
			card: Colors.PINK,
			text: Colors.DARKBLUE,
			border: Colors.DARKBLUE,
			notification: Colors.RED,
		},
	},
	dark: {
		...DarkTheme,
		colors: {
			primary: Colors.GREEN,
			background: Colors.DARKBLUE,
			card: Colors.PINK,
			text: Colors.CREAMY,
			border: Colors.CREAMY,
			notification: Colors.RED,
		},
	},
};
