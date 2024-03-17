import { themes } from '@/constants/theme';
import { useLocalNotifications } from '@/hooks/useLocalNotifications';
import { useNotificationsObserver } from '@/hooks/useNotificationsObserver';
import i18n from '@/locales/i18n';
import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SystemUI.setBackgroundColorAsync('black');

export default function RootLayout() {
	useNotificationsObserver();
	const [appReady, setAppReady] = useState<boolean>(false);
	const [loaded, error] = useFonts({
		'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
		'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			setAppReady(true);
		}
	}, [loaded]);

	if (!appReady) return null;

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	useLocalNotifications();

	return (
		<QueryProvider>
			<AuthProvider>
				<I18nextProvider i18n={i18n}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<BottomSheetModalProvider>
							<ThemeProvider
								value={colorScheme === 'dark' ? themes.dark : themes.light}>
								<Stack>
									<Stack.Screen name='index' options={{ headerShown: false }} />
									<Stack.Screen
										name='(auth)'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='(tabs)'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='onboarding'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='transactions/transactionForm'
										options={{ presentation: 'modal', headerShown: false }}
									/>
									<Stack.Screen
										name='goals/goalForm'
										options={{ presentation: 'modal', headerShown: false }}
									/>
									<Stack.Screen name='transactions/[year_month]' options={{}} />
								</Stack>
							</ThemeProvider>
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</I18nextProvider>
			</AuthProvider>
		</QueryProvider>
	);
}
