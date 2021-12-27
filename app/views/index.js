import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { getData, setQuery } from '~redux/modules/google';
import { connect } from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import _ from 'lodash';

class ViewPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			isReady: false,
			isLoading: false,
			query: ''
		};
		this.onChangeTextDelayed = _.debounce(this.onChangeText, 500);
	}

	onChangeText = (text) => {
		this.props.getData(text)
	}

	autoComp = () => {
		return (
			<Autocomplete
				data={this.props.data}
				value={this.props.query}
				onChangeText={(text) => {
					this.onChangeTextDelayed(text)
					this.props.setQuery(text)
				}}
				flatListProps={{
					keyExtractor: (_, idx) => idx,
					renderItem: ({ item, index }) => {
						if (index < 10) {
							return <Text>{item.placeName} {item.countryCode} {item.postalCode}</Text>
						}
					},
				}}
			/>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{Platform.OS === 'ios' ?
                this.autoComp()
				:
				<View style={styles.autocompleteContainer}>
					{this.autoComp()}
				</View>
				}
				<StatusBar style="auto" />
			</View>
		);
	}
}

const mapStateToProps = ({ google }) => {
	let { data, query } = google;

	return {
		data,
		query
	};
};

const mapDispatchToProps = {
	getData,
	setQuery
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	autocompleteContainer: {
		flex: 1,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 100,
		zIndex: 1
	  }
});
