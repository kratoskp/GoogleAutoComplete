import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import configureStore from '~redux/configureStore';
import { Provider } from 'react-redux';
import ViewPage from './app/views';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		// Font loading
		this.state = {
			loading: true,
			storeCreated: false,
			store: null,
			persistor: null
		};
	}

	async componentDidMount() {

		let { store, persistor } = configureStore();

		this.setState({
			store,
			persistor,
			storeCreated: true
		});
	}

	render() {
		if (!this.state.storeCreated) {
			return null;
		}

		return (
			<Provider store={this.state.store}>
				<ViewPage />
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
