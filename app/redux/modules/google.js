import axios from 'axios';

const RESULT = 'google/RESULT';
const SETQUERY = 'google/SETQUERY';
const SETDATA = 'google/SETDATA';
const SETHIDE = 'google/SETHIDE';

const initialState = {
	data: [],
	query: '',
	selectedData: {},
	hideResults: false
};

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {

	case RESULT:
        let { data } = action;
		return {
			...state,
			data
		};

	case SETQUERY:
		let { query } = action;
		return {
			...state,
			query
		};

	case SETDATA:
		let { selectedData } = action;
		return {
			...state,
			selectedData
		};

	case SETHIDE:
		let { hideResults } = action;
		return {
			...state,
			hideResults
		};

	default:
		return state;
	}
}

// dispatcher
export const fillData = (data) => {
	return {
		type: RESULT,
		data: data
	};
};

export const setQuery = (text) => {
	return {
		type: SETQUERY,
		query: text
	};
};

export const setData = (data) => {
	return {
		type: SETDATA,
		selectedData: data
	};
};

export const setHide = (bool) => {
	return {
		type: SETHIDE,
		hideResults: bool
	};
};

export const getData = (text) => {
	return async (dispatch, getState) => {
		try {
			let response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?placename=${text}&username=kratoskp`)
			dispatch(fillData(response.data.postalCodes));
			dispatch(setHide(false));
		} catch (e) {
			console.error(e);
		}
	};
};
