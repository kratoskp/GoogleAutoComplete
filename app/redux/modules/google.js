import axios from 'axios';

const RESULT = 'google/RESULT';

const initialState = {
	data: []
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

export const getData = (filter, id) => {
	return async (dispatch, getState) => {
		try {
			const { google } = getState();
			const { data } = google;

			let response = await axios.get('http://api.geonames.org/postalCodeSearchJSON?placename=Malaysia&username=kratoskp')
			console.log(response.data)
		} catch (e) {
			console.error(e);
		}
	};
};
