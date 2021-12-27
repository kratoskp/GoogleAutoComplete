import axios from 'axios';

const RESULT = 'google/RESULT';
const SETQUERY = 'google/SETQUERY';

const initialState = {
	data: [],
	query: ''
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

export const setQuery = (query) => {
	return {
		type: SETQUERY,
		query: query
	};
};

export const getData = (text) => {
	return async (dispatch, getState) => {
		try {
			const { google } = getState();
			const { data } = google;

			let response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?placename=${text}&username=kratoskp`)
			dispatch(fillData(response.data.postalCodes));
		} catch (e) {
			console.error(e);
		}
	};
};
