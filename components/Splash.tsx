import { Colors } from '@/constants/Colors';
import Lottie from 'lottie-react-native';
import React, { useRef } from 'react';
import { View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

const AnimatedLotteView = Animated.createAnimatedComponent(Lottie);

type Props = {
	onAnimationFinish: (isCancelled: boolean) => void;
};

const Splash = ({ onAnimationFinish }: Props) => {
	const splash = useRef<Lottie>(null);

	return (
		<Animated.View
			style={{
				flex: 1,
				justifyContent: 'center',
				backgroundColor: Colors.BLACK,
			}}>
			<AnimatedLotteView
				entering={ZoomIn.duration(1000)}
				exiting={ZoomOut}
				ref={splash}
				onAnimationFinish={onAnimationFinish}
				loop={false}
				style={{
					flex: 1,
				}}
				autoPlay
				renderMode={'HARDWARE'}
				imageAssetsFolder={'@/assets'}
				source={require('@/assets/lottie/splash.json')}
			/>
		</Animated.View>
	);
};

export default Splash;
