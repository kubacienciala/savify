import { Typography } from '@/constants';
import hexaOpacity from '@/helpers/hexaOpacity';
import { QueryTransactionByMonth } from '@/types/transactions';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
} from 'react-native';

type Props = {
	transactions: QueryTransactionByMonth[];
};

const MonthlyTransactions = ({ transactions }: Props) => {
	const { width } = useWindowDimensions();
	const { colors } = useTheme();
	console.log(transactions);
	return (
		<FlatList
			style={{ flex: 1 }}
			contentContainerStyle={{
				justifyContent: 'center',
				alignItems: 'center',
				gap: 20,
			}}
			nestedScrollEnabled
			scrollEnabled={false}
			data={transactions}
			renderItem={({ item, index }) => (
				<Link
					href={{
						pathname: '/transactions/[year_month]',
						params: {
							year_month: item.year_month,
							total_amount: item.total_amount,
							categories: item.categories,
							amounts: item.amounts,
							colors: item.colors,
						},
					}}
					asChild>
					<TouchableOpacity
						style={{
							...s.container,
							width: width * 0.8,
							backgroundColor: `${colors.text}${hexaOpacity(0.1)}`,
						}}>
						<Text style={{ color: 'white', fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR }}>{item.year_month}</Text>
					</TouchableOpacity>
				</Link>
			)}
		/>
	);
};

export default MonthlyTransactions;

const s = StyleSheet.create({
	container: {
		height: 100,
		borderRadius: 12,
	},
});
