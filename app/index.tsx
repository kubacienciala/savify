import Splash from '@/components/Splash';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/services/profiles';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const index = () => {
	const { session } = useAuth();
	const { data: profile } = useProfile();
	const { dontShowSplash } = useLocalSearchParams<{dontShowSplash: string}>();
	const [splashFinished, setSplashFinished] = useState<boolean>(false);

	if (!splashFinished && dontShowSplash !== '1') {
		return (
			<Splash
				onAnimationFinish={(isCancelled) => {
					if (!isCancelled) setSplashFinished(true);
				}}
			/>
		);
	}

	if (!session) {
		return <Redirect href={'/(auth)/sign-in'} />;
	}
	if (session && profile && !profile.onboarding_seen) {
		return <Redirect href={'/onboarding'} />;
	}
	if (session && profile && profile.onboarding_seen) {
		return <Redirect href={'/(tabs)'} />;
	}
};

export default index;
