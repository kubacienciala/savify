import { AnimatedNumber } from '@/components/AnimatedNumber';
import BottomModal from '@/components/BottomModal';
import Button from '@/components/Button';
import { ButtonsGrid } from '@/components/ButtonsGrid';
import Input from '@/components/Input';
import { SegmentedControl } from '@/components/SegmentedControl';
import { assignColorToCategory } from '@/constants/categoryColors';
import { convertDateFormat } from '@/helpers/convertDateFormat';
import hexaOpacity from '@/helpers/hexaOpacity';
import { useAuth } from '@/providers/AuthProvider';
import { useCreateTransaction } from '@/services/transactions';
import {
	PaymentMethodEnum,
	PaymentMethodIconEnum,
	TransactionCategoryEnum,
	TransactionTypeEnum,
} from '@/types/enums';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Calendar } from '@marceloterreiro/flash-calendar';
import { useTheme } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

type FormValues = {
	paymentMethod: PaymentMethodIconEnum;
	type: TransactionTypeEnum;
	category: TransactionCategoryEnum;
	amount: string;
	description: string;
	date: string;
};

const initialValues: FormValues = {
	paymentMethod: PaymentMethodIconEnum.Card,
	type: TransactionTypeEnum.Expense,
	category: TransactionCategoryEnum.Empty,
	amount: '0',
	description: '',
	date: dayjs().format('DD.MM.YYYY'),
};

const TransactionForm = () => {
	const formikRef = useRef<FormikProps<FormValues>>(null);
	const bottomSheetModalKeyboardRef = useRef<BottomSheetModal>(null);
	const bottomSheetModalCalendarRef = useRef<BottomSheetModal>(null);

	const { session } = useAuth();
	const [calendarMonthId, setCalendarMonthId] = useState<string>(
		dayjs().format('YYYY-MM-DD')
	);
	const { colors } = useTheme();
	const snapPoints = useMemo(() => ['50%', '50%'], []);
	const {
		mutate: createTransaction,
		isError,
		error,
		isSuccess,
		data,
	} = useCreateTransaction();

	const openKeyboardModal = () => {
		Keyboard.dismiss();
		bottomSheetModalKeyboardRef.current?.present();
	};

	useEffect(() => {
		openKeyboardModal();
	}, []);
	const openCalendarModal = () => {
		Keyboard.dismiss();
		bottomSheetModalCalendarRef.current?.present();
	};

	const handleCreateTransaction = (values: FormValues) => {
		const { amount, type, description, category, paymentMethod, date } = values;
		if (!session) return;
		createTransaction({
			amount: parseFloat(values.amount.replace(',', '.')),
			type,
			description,
			category,
			payment_method:
				paymentMethod === PaymentMethodIconEnum.Card
					? PaymentMethodEnum.Card
					: paymentMethod === PaymentMethodIconEnum.Cash
					? PaymentMethodEnum.Cash
					: PaymentMethodEnum.Transfer,
			date: convertDateFormat(date),
			user_id: session.user.id,
			color: assignColorToCategory(category),
		});
	};

	if (isSuccess) {
		console.log('sukces ', data);
	} else if (isError) {
		console.log('error ', error);
	}
	const validationSchema = Yup.object().shape({
		amount: Yup.string().required('Amount is required'),
		category: Yup.string().required('Category is required'),
		paymentMethod: Yup.string().required('Payment method is required'),
		description: Yup.string().required('Description is required'),
		date: Yup.string().required('Date is required'),
	});

	return (
		<View style={s.container}>
			<Formik
				validationSchema={validationSchema}
				initialValues={initialValues}
				onSubmit={handleCreateTransaction}>
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
							paddingHorizontal: 50,
						}}>
						<View style={[s.fillCenter]}>
							<AnimatedNumber
								onPress={openKeyboardModal}
								value={values.amount}
							/>
						</View>
						<SegmentedControl
							optionsAsIcons
							onOptionPress={(value) => setFieldValue('paymentMethod', value)}
							options={['credit-card-outline', 'cash', 'bank-transfer']}
							selectedOption={values.paymentMethod}
						/>
						<Input
							placeholder='Category'
							onBlur={handleBlur('category')}
							value={values.category}
							onChangeText={handleChange('category')}
						/>
						<Input
							placeholder='Description'
							multiline
							onBlur={handleBlur('description')}
							value={values.description}
							onChangeText={handleChange('description')}
						/>
						<View
							style={{
								flexDirection: 'row',
								gap: 46,
								alignItems: 'center',
							}}>
							<Input
								widthMultiplier={0.75}
								editable={false}
								placeholder='Date'
								onBlur={handleBlur('date')}
								value={values.date}
								onChangeText={handleChange('date')}
							/>
							<AntDesign
								onPress={openCalendarModal}
								name='calendar'
								size={32}
								color={colors.text}
							/>
						</View>
						<Button
							isError={isSubmitting && Object.keys(errors).length !== 0}
							onPress={() => {
								console.log(parseFloat(values.amount.replace(',', '.')));
							}}
							title='Create expense'
						/>
						<BottomModal
							ref={bottomSheetModalKeyboardRef}
							snapPoints={snapPoints}>
							<View style={s.fill}>
								<ButtonsGrid
									input={values.amount}
									onUpdate={(value) => setFieldValue('amount', value)}
									onBackspace={(value) => setFieldValue('amount', value)}
									onReset={() => setFieldValue('amount', '0')}
									onMaxReached={() => {}}
								/>
							</View>
						</BottomModal>
						<BottomModal
							ref={bottomSheetModalCalendarRef}
							snapPoints={snapPoints}>
							<View style={{ marginTop: 24 }}>
								<MaterialCommunityIcons
									onPress={() =>
										setCalendarMonthId((prev) =>
											dayjs(prev).subtract(1, 'month').format('YYYY-MM-DD')
										)
									}
									name='chevron-left'
									size={36}
									style={{
										zIndex: 1000,
										position: 'absolute',
										top: -8,
										left: 50,
									}}
									color={colors.text}
								/>
								<MaterialCommunityIcons
									onPress={() =>
										setCalendarMonthId((prev) =>
											dayjs(prev).add(1, 'month').format('YYYY-MM-DD')
										)
									}
									name='chevron-right'
									size={36}
									style={{
										zIndex: 1000,
										position: 'absolute',
										top: -8,
										right: 50,
									}}
									color={colors.text}
								/>
								<Calendar
									calendarFormatLocale='pl-PL'
									calendarMonthId={calendarMonthId}
									theme={{
										rowMonth: {
											content: {
												color: colors.text,
											},
										},
										itemWeekName: { content: { color: colors.primary } },
										itemDay: {
											idle: ({ isPressed, isWeekend, date }) => ({
												container: {
													backgroundColor: isPressed
														? colors.primary
														: dayjs(date).format('DD.MM.YYYY') === values.date
														? colors.primary
														: 'transparent',
													borderRadius: 16,
												},
												content: {
													color:
														isWeekend && !isPressed
															? `${colors.text}${hexaOpacity(0.5)}`
															: colors.text,
												},
											}),
											today: ({ isPressed, isWeekend, date }) => ({
												container: {
													backgroundColor: isPressed
														? colors.primary
														: dayjs(date).format('DD.MM.YYYY') === values.date
														? colors.primary
														: 'transparent',
													borderRadius: 16,
												},
												content: {
													color:
														isWeekend && !isPressed
															? `${colors.text}${hexaOpacity(0.5)}`
															: colors.text,
												},
											}),
											active: ({ isPressed, isWeekend }) => ({
												container: {
													backgroundColor: isPressed
														? colors.primary
														: 'transparent',
													borderRadius: 16,
												},
												content: {
													color:
														isWeekend && !isPressed
															? `${colors.text}${hexaOpacity(0.5)}`
															: colors.text,
												},
											}),
										},
									}}
									onCalendarDayPress={(dateId) =>
										setFieldValue('date', dayjs(dateId).format('DD.MM.YYYY'))
									}
								/>
							</View>
						</BottomModal>
					</View>
				)}
			</Formik>
		</View>
	);
};

export default TransactionForm;

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
