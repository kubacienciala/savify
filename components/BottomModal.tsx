import hexaOpacity from '@/helpers/hexaOpacity';
import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { forwardRef, useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

const BottomModal = forwardRef<BottomSheetModal, BottomSheetModalProps>(
	({ snapPoints, children }, ref) => {
		const { colors } = useTheme();

		const renderContainerComponent: React.ComponentType<{
			children?: React.ReactNode;
		}> = useCallback(({ children }) => {
			return <FullWindowOverlay>{children}</FullWindowOverlay>;
		}, []);

		return (
			<BottomSheetModal
				containerComponent={
					Platform.OS === 'ios' ? renderContainerComponent : undefined
				}
				backgroundStyle={{
					backgroundColor: 'transparent',
					width: '100%',
				}}
				enablePanDownToClose
				ref={ref}
				index={1}
				snapPoints={snapPoints}>
				<View
					style={{
						...s.modal,
						backgroundColor: `${colors.background}${hexaOpacity(0.8)}`,
					}}>
					<>{children}</>
				</View>
			</BottomSheetModal>
		);
	}
);

export default BottomModal;

const s = StyleSheet.create({
	modal: {
		flex: 1,
		height: '100%',
		overflow: 'hidden',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});
