import { supabase } from '@/store/supabase';
import { QueryProfile } from '@/types/profiles';
import { PostgrestError } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

export const useProfile = () => {
	return useQuery<QueryProfile, PostgrestError>({
		queryKey: ['profile'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.single();
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
