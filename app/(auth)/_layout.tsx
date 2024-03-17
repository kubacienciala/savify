import { useAuth } from '@/providers/AuthProvider';
import { Stack, router } from 'expo-router';

export default function AuthLayout() {
	const { session } = useAuth();

	if (session) {
		router.push({ pathname: '/', params: { dontShowSplash: '1' } });
	}
	return <Stack screenOptions={{ headerShown: false }} />;
}
