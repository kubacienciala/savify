import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/providers/AuthProvider';
import { useCreateGoal, useUpdateGoal } from '@/services/goals';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

type FormValues = {
	id?: string;
	title: string;
	goal: string;
	amount: string;
};

const GoalForm = () => {
	const { colors, dark } = useTheme();
	const formikRef = useRef<FormikProps<FormValues>>(null);
	const { amount, goal, title, id } = useLocalSearchParams<FormValues>();

	const { session } = useAuth();

	const { mutate: createGoal } = useCreateGoal();
	const { mutate: updateGoal } = useUpdateGoal(+id!);

	const handleCreateGoal = (values: FormValues) => {
		const { title, goal, amount, id } = values;
		if (!session) return;
		if (!id) {
			createGoal({
				title,
				goal: parseFloat(goal.replace(',', '.')),
				amount: parseFloat(amount.replace(',', '.')),
				user_id: session.user.id,
			});
			return;
		}
		updateGoal({
			id: +id,
			title,
			goal: parseFloat(goal.replace(',', '.')),
			amount: parseFloat(amount.replace(',', '.')),
			user_id: session.user.id,
		});
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		goal: Yup.string().required('Goal is required'),
		amount: Yup.string().required('Amount is required'),
	});

	const initialValues: FormValues = {
		id: id,
		title: title || '',
		goal: goal || '',
		amount: amount || '',
	};

	return (
		<SafeAreaView style={s.container}>
			<Formik
				validationSchema={validationSchema}
				initialValues={initialValues}
				onSubmit={handleCreateGoal}>
				{({
					values,
					touched,
					errors,
					handleChange,
					handleBlur,
					submitForm,
					setFieldValue,
					isSubmitting,
				}) => (
					<View
						style={{
							flex: 1,
							paddingTop: 28,
							alignItems: 'center',
							gap: 28,
							paddingHorizontal: 28,
						}}>
						<Input
							value={values.title}
							onChangeText={handleChange('title')}
							placeholder='Nazwa celu'
						/>
						<Input
							value={values.goal}
							onChangeText={handleChange('goal')}
							keyboardType='numeric'
							placeholder='Cena celu'
						/>
						<Input
							value={values.amount}
							onChangeText={handleChange('amount')}
							keyboardType='numeric'
							placeholder='Aktualne środki na ten cel'
						/>
						<Button
							isError={isSubmitting && Object.keys(errors).length !== 0}
							title='Dodaj cel'
							onPress={submitForm}
						/>
					</View>
				)}
			</Formik>
		</SafeAreaView>
	);
};

export default GoalForm;

const s = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	modal: {
		height: '100%',
		overflow: 'hidden',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	gradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '50%',
	},
	fill: {
		flex: 1,
	},
	fillCenter: {
		paddingTop: 80,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
