import { combineReducers } from 'redux';

import google from '~redux/modules/google';
import savedData from '~redux/modules/savedData';

export default combineReducers({
	google,
	savedData
});
