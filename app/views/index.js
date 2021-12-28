import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { getData, setQuery, setData, setHide } from '~redux/modules/google';
import { resetQuery, fillQueryData } from '~redux/modules/savedData';
import { connect } from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import _ from 'lodash';

class ViewPage extends React.Component {

	constructor(props) {
		super(props);

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
				hideResults={this.props.hideResults}
				onChangeText={(text) => {
					this.onChangeTextDelayed(text)
					this.props.setQuery(text)
				}}
				flatListProps={{
					keyExtractor: (_, idx) => idx,
					renderItem: ({ item, index }) => {
						if (index < 10) {
							return (
								<TouchableOpacity onPress={() => {
									this.props.fillQueryData(this.props.query);
									this.props.setData(item);
									this.props.setHide(true);
									}
								}>
									<Text>{item.placeName} {item.countryCode} {item.postalCode}</Text>
								</TouchableOpacity>
							)
						}
					},
					keyboardShouldPersistTaps:"handled"
				}}
			/>
		)
	}

	render() {
		let { selectedData } = this.props
		return (
			<View style={styles.container}>
				{Platform.OS === 'ios' ?
                this.autoComp()
				:
				<View style={styles.autocompleteContainer}>
					{this.autoComp()}
				</View>
				}
				{this.props.searchQuery.length > 0 &&
					<View style={{ flexDirection: 'row', marginTop: 50, flexWrap: 'wrap' }}>
						 {this.props.searchQuery.map((data, index) => {
							return (
								<TouchableOpacity key={index} style={{ paddingTop: 16, paddingHorizontal: 16 }} onPress={() => {
									this.props.getData(data);
									this.props.setQuery(data);
									}
								}>
									<Text>{data}</Text>
								</TouchableOpacity>
							);
						})}
						<TouchableOpacity onPress={() => {this.props.resetQuery(); this.props.setQuery(''); }}  style={{ paddingTop: 16, paddingHorizontal: 16 }}>
							<Text>Clear query</Text>
						</TouchableOpacity>
					</View>
				}
				{!_.isEmpty(selectedData) &&
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text>{selectedData.placeName}</Text>
						<Text>{selectedData.countryCode}</Text>
						<Text>{selectedData.postalCode}</Text>
						<Text>{selectedData.lat}</Text>
						<Text>{selectedData.lng}</Text>
					</View>
				}
			</View>
		);
	}
}

const mapStateToProps = ({ google, savedData }) => {
	let { data, query, hideResults, selectedData } = google;
	let { searchQuery } = savedData;

	return {
		data,
		query,
		hideResults,
		searchQuery,
		selectedData
	};
};

const mapDispatchToProps = {
	getData,
	setQuery,
	setData,
	resetQuery,
	fillQueryData,
	setHide
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16
	},
	autocompleteContainer: {
		flex: 1,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 10,
		zIndex: 1,
		padding: 16
	  }
});
