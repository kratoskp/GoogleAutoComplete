import {
	applyMiddleware,
	createStore
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '~redux/modules/reducers';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configStore = (initialState = {}) => {

	const store = createStore(
		persistedReducer,
		initialState,
		applyMiddleware(thunkMiddleware)
	);

	const persistor = persistStore(store);

	return { store, persistor };
};

export default configStore;
