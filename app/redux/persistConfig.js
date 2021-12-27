import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
	key: 'root',
	keyPrefix: '',
	storage: AsyncStorage,
	timeout: 0,
	stateReconciler: autoMergeLevel2,
	whitelist: [
		'google'
	]
};
