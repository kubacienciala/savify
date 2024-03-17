import * as Notifications from 'expo-notifications';

export const scheduleLocalNotification = async () => {
	await Notifications.scheduleNotificationAsync({
		identifier: 'review',
		content: {
			title: 'Your opinion is important to us!',
			subtitle: "It's been a while since you used the app.",
			body: 'Please take a moment to leave a review.',
			data: { url: '/transactions/transactionForm' },
		},
		trigger: {
			hour: 19,
			minute: 0,
			repeats: true,
		},
	});
};
