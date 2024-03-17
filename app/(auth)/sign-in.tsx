import Button from '@/components/Button';
import Input from '@/components/Input';
import { SplitButton } from '@/components/SplitButton';
import { supabase } from '@/store/supabase';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import * as Yup from 'yup';

type FormValues = {
	email: string;
	password: string;
};

const initialValues: FormValues = {
	email: '',
	password: '',
};

const SignIn = () => {
	const { colors } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);

	const validationSchema = Yup.object().shape({
		email: Yup.string().email().required(),
		password: Yup.string().min(6).required(),
	});

	const signInWithEmail = async (values: FormValues) => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword(values);

		if (error) Alert.alert(error.message);
		setLoading(false);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Formik
				validationSchema={validationSchema}
				initialValues={initialValues}
				onSubmit={signInWithEmail}>
				{({
					values,
					touched,
					errors,
					handleChange,
					handleBlur,
					submitForm,
					resetForm,
				}) => (
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						enabled
						style={s.container}>
						<View
							style={{
								gap: 26,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Input
								value={values.email}
								autoCapitalize='none'
								keyboardType='email-address'
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								placeholder='E-mail'
							/>
							<Input
								value={values.password}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								placeholder='Passowrd'
								passwordInput
							/>
							<Button isLoading={loading} onPress={submitForm} title='Login' />
							<SplitButton
								onRight={() => console.log('right')}
								onLeft={() => console.log('left')}
								onMid={async () => {
									try {
										const credential = await AppleAuthentication.signInAsync({
											requestedScopes: [
												AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
												AppleAuthentication.AppleAuthenticationScope.EMAIL,
											],
										});
										// Sign in via Supabase Auth.
										if (credential.identityToken) {
											const {
												error,
												data: { user },
											} = await supabase.auth.signInWithIdToken({
												provider: 'apple',
												token: credential.identityToken,
											});
											console.log(JSON.stringify({ error, user }, null, 2));
											if (!error) {
												// User is signed in.
											}
										} else {
											throw new Error('No identityToken.');
										}
									} catch (e) {
										if (e.code === 'ERR_REQUEST_CANCELED') {
											// handle that the user canceled the sign-in flow
										} else {
											// handle other errors
										}
									}
								}}
								leftIcon={
									<AntDesign
										name='google'
										size={22}
										color={colors.background}
									/>
								}
								midIcon={
									<AntDesign
										name='apple1'
										size={21}
										color={colors.background}
									/>
								}
								rightIcon={
									<AntDesign
										name='facebook-square'
										size={21}
										color={colors.background}
									/>
								}
							/>
						</View>
						<View style={{}}>
							<Link href='/(auth)/sign-up' asChild>
								<Button onPress={() => {}} title='Sign up' />
							</Link>
						</View>
					</KeyboardAvoidingView>
				)}
			</Formik>
		</TouchableWithoutFeedback>
	);
};

export default SignIn;

const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
});
