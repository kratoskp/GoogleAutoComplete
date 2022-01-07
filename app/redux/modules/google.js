import axios from 'axios';

const RESULT = 'google/RESULT';
const SETQUERY = 'google/SETQUERY';
const SETDATA = 'google/SETDATA';
const SETHIDE = 'google/SETHIDE';
const SETLOADING = 'google/SETLOADING';
const SETQUERYHIDE = 'google/SETQUERYHIDE';

const initialState = {
	data: [],
	query: '',
	selectedData: {},
	hideResults: false,
	isLoading: false,
	queryHide: true
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

	case SETQUERYHIDE:
		let { queryHide } = action;
		return {
			...state,
			queryHide
		};
	
	case SETLOADING:
		let { isLoading } = action;
		return {
			...state,
			isLoading
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

export const setLoading = (bool) => {
	return {
		type: SETLOADING,
		isLoading: bool
	};
};

export const setQueryHide = (bool) => {
	return {
		type: SETQUERYHIDE,
		queryHide: bool
	};
};

export const getData = (text) => {
	return async (dispatch, getState) => {
		try {
			dispatch(setLoading(true));
			let response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?placename=${text}&username=kratoskp`)
			dispatch(setLoading(false));
			dispatch(fillData(response.data.postalCodes));
			dispatch(setHide(false));
		} catch (e) {
			console.error(e);
		}
	};
};
