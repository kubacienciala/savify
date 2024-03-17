import { Typography } from '@/constants';
import { StyleSheet, View } from 'react-native';

export default function TabOneScreen() {
	return <View style={s.container}></View>;
}

const s = StyleSheet.create({
	container: {
		gap: 26,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		fontFamily: Typography.FONT_FAMILY_POPPINS_SEMIBOLD,
		color: 'white',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
