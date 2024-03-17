import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
	return (
		<SafeAreaView edges={['top']} style={{ flex: 1 }}>
			<Tabs screenOptions={{ headerShown: false }}>
				<Tabs.Screen name='one' />
				<Tabs.Screen name='index' />
				<Tabs.Screen name='three' />
			</Tabs>
		</SafeAreaView>
	);
}
