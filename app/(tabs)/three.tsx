import { supabase } from '@/store/supabase';
import { router } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';

const three = () => {
	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.replace('/(auth)/sign-in');
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<Button title='logut' onPress={handleLogout} />
		</View>
	);
};

export default three;
