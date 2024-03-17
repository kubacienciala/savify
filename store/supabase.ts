import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
import 'react-native-url-polyfill/auto';

const storage = new MMKV({ id: 'supabase.storage' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: {
			setItem: (key: string, data: string) => storage.set(key, data),
			getItem: (key: string) => storage.getString(key) || null,
			removeItem: (key: string) => storage.delete(key),
		},
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
