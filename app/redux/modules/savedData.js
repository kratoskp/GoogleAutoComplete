const SAVE = 'savedData/SAVE';

const initialState = {
	searchQuery: []
};

// Reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {

	case SAVE:
        let { searchQuery } = action;
		return {
			...state,
			searchQuery
		};

	default:
		return state;
	}
}

// dispatcher
export const saveQuery = (data) => {
	return {
		type: SAVE,
		searchQuery: data
	};
};

export const resetQuery = () => {
	return {
		type: SAVE,
		searchQuery: []
	};
};

export const fillQueryData = (query) => {
	return async (dispatch, getState) => {
		try {
			const { savedData } = getState();
			const { searchQuery } = savedData;

			dispatch(saveQuery([...searchQuery, query]));
		} catch (e) {
			console.error(e);
		}
	};
};


