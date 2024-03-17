import { scheduleLocalNotification } from '@/helpers/scheduleLocalNotification';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationsArgs {
	expoPushToken?: Notifications.ExpoPushToken;
	notification?: Notifications.Notification;
}

export const useLocalNotifications = (): PushNotificationsArgs => {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: true,
		}),
	});
	const [expoPushToken, setExpoPushToken] = useState<
		Notifications.ExpoPushToken | undefined
	>();

	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>();

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	const registerForPushNotificationsAsync = async () => {
		let token;
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		if (existingStatus !== 'granted') {
			await Notifications.requestPermissionsAsync();
		}
		token = await Notifications.getExpoPushTokenAsync({
			projectId: Constants.expoConfig?.extra?.eas.projectId,
		});
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}
		return token;
	};

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => {
			setExpoPushToken(token);
		});
		scheduleLocalNotification();

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {});

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current as Notifications.Subscription
			);
			Notifications.removeNotificationSubscription(
				responseListener.current as Notifications.Subscription
			);
		};
	}, []);

	return {
		expoPushToken,
		notification,
	};
};
