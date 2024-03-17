import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/store/supabase';
import { MutateGoal, QueryGoal } from '@/types/goals';
import { PostgrestError } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Burnt from 'burnt';
import { useTranslation } from 'react-i18next';

export const useGoalsList = () => {
	const { session } = useAuth();
	return useQuery<QueryGoal[], PostgrestError>({
		queryKey: ['goals', session?.user.id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('goals')
				.select('*')
				.eq('user_id', session?.user.id);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useCreateGoal = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	return useMutation<MutateGoal, PostgrestError, MutateGoal>({
		async mutationFn(goal) {
			const { data, error } = await supabase
				.from('goals')
				.insert(goal)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			Burnt.toast({
				title: t('Success.header'),
				preset: 'done',
				message: t('Success.goalAdded'),
				haptic: 'success',
			});
		},
		async onError(error) {
			Burnt.toast({
				title: t('Errors.header'),
				preset: 'error',
				message: t(`Errors.${error.message}`),
				haptic: 'error',
			});
		},
	});
};

export const useUpdateGoal = (id: number) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	return useMutation<MutateGoal, PostgrestError, MutateGoal>({
		mutationKey: ['goals', id],
		async mutationFn(goal) {
			const { data, error } = await supabase
				.from('goals')
				.update(goal)
				.eq('id', id)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['goals'] });
			Burnt.toast({
				title: t('Success.header'),
				preset: 'done',
				message: t('Success.goalUpdated'),
				haptic: 'success',
			});
		},
		async onError(error) {
			console.log(error)
			Burnt.toast({
				title: t('Errors.header'),
				preset: 'error',
				message: t(`Errors.${error.message}`),
				haptic: 'error',
			});
		},
	});
};

export const useDeleteGoal = () => {
	const queryClient = useQueryClient();
	return useMutation<MutateGoal, PostgrestError, number>({
		async mutationFn(id) {
			const { data, error } = await supabase
				.from('goals')
				.delete()
				.eq('id', id)
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ['goals'] });
		},
	});
};
