import Button from '@/components/Button';
import Input from '@/components/Input';
import { supabase } from '@/store/supabase';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { AuthError } from '@supabase/supabase-js';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

type FormValues = {
	email: string;
	password: string;
};

const initialValues: FormValues = {
	email: '',
	password: '',
};

const SignUp = () => {
	const { colors } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);

	const validationSchema = Yup.object().shape({
		email: Yup.string().email().required(),
		password: Yup.string().min(6).required(),
	});

	const signUp = async (values: FormValues) => {
		setLoading(true);
		const { email, password } = values;
		await supabase.auth
			.signUp({
				email,
				password,
			})
			.then((user) => {
				console.log('Login successful', user);
			})
			.catch((error: AuthError) => {
				console.log('Login failed', error);
			})
			.finally(() => setLoading(false));
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={{ flex: 1 }}>
					<Link href='..' asChild>
						<SimpleLineIcons name='arrow-left' size={18} color='white' />
					</Link>
					<Formik
						validationSchema={validationSchema}
						initialValues={initialValues}
						onSubmit={() => {}}>
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
									<Button
										isLoading={loading}
										onPress={() => signUp(values)}
										title='Create account'
									/>
								</View>
								<View style={{}}>
									<Link href='/(auth)/sign-in' asChild>
										<Button onPress={() => {}} title='Sign in' />
									</Link>
								</View>
							</KeyboardAvoidingView>
						)}
					</Formik>
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default SignUp;

const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
});
