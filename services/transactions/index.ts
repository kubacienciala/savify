import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/store/supabase';
import {
	MutateTransaction,
	QueryTransaction,
	QueryTransactionByMonth,
} from '@/types/transactions';
import { PostgrestError } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useTransactionList = () => {
	const { session } = useAuth();
	return useQuery<QueryTransaction[], PostgrestError>({
		queryKey: ['transactions', session?.user.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('transactions')
				.select('*')
				.eq('user_id', session?.user.id);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useTransaction = (id: number) => {
	const { session } = useAuth();
	return useQuery<QueryTransaction, PostgrestError>({
		queryKey: ['transactions', id, session?.user.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('transactions')
				.select('*')
				.eq('user_id', session?.user.id)
				.eq('id', id)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useExpensesByMonth = () => {
	const { session } = useAuth();
	return useQuery<QueryTransactionByMonth[], PostgrestError>({
		queryKey: ['transactions', session?.user.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('expenses_by_month')
				.select('*')
				.eq('user_id', session?.user.id);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation<MutateTransaction, PostgrestError, MutateTransaction>({
		async mutationFn(transaction) {
			const { data, error } = await supabase
				.from('transactions')
				.insert(transaction)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['transactions'] });
		},
	});
};
