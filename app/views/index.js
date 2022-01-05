import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Keyboard, Dimensions } from 'react-native';
import { getData, setQuery, setData, setHide } from '~redux/modules/google';
import { resetQuery, fillQueryData } from '~redux/modules/savedData';
import { connect } from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-paper';
import Hide from 'react-native-hide-with-keyboard';
import _ from 'lodash';

class ViewPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			map: false
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
				hideResults={this.props.hideResults}
				onChangeText={(text) => {
					this.onChangeTextDelayed(text)
					this.props.setQuery(text)
				}}
				placeholder='Enter the name of the place that you want to search'
				flatListProps={{
					keyExtractor: (_, idx) => idx,
					renderItem: ({ item, index }) => {
						if (index < 10) {
							return (
								<TouchableOpacity onPress={() => {
									this.props.fillQueryData(item.placeName);
									this.props.setQuery(item.placeName)
									this.props.setData(item);
									this.props.setHide(true);
									Keyboard.dismiss();
									if (this.map) {
										this.map.animateCamera({
											center: {
											 latitude: item.lat,
											 longitude: item.lng,
										 },
											heading: 0,
											pitch: 0,
											zoom: 15
										  })
										}
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
					<View style={{ flexDirection: 'row', marginTop: 60, flexWrap: 'wrap', zIndex: 0 }}>
						 {this.props.searchQuery.map((data, index) => {
							return (
								<Button mode="contained" key={index} compact style={{ marginTop: 16, marginLeft: 16 }} onPress={() => {
									this.props.getData(data);
									this.props.setQuery(data);
									}
								}>
									{data}
								</Button>
							);
						})}
						<Button mode="contained" icon="close" compact onPress={() => {this.props.resetQuery(); this.props.setQuery(''); }} style={{ marginTop: 16, marginLeft: 16 }}>
							Clear search history
						</Button>
					</View>
				}
				{!_.isEmpty(selectedData) &&
					<Hide style={{ flex: 1, justifyContent: 'center' }}>
						<Text>Current shown location : {selectedData.placeName} {selectedData.countryCode} {selectedData.postalCode}</Text>
						<Text>Latitude : {selectedData.lat}</Text>
						<Text>Longitude: {selectedData.lng}</Text>
						<MapView
						style={{ height: Dimensions.get('screen').height / 2, width: Dimensions.get('screen').width }}
						initialRegion={{
							latitude: selectedData.lat,
							longitude: selectedData.lng,
							latitudeDelta: 1,
							longitudeDelta: 1,
						}}
						ref={ref => { this.map = ref }}
						onMapLoaded={() => this.map.animateCamera({
							   center: {
								latitude: selectedData.lat,
								longitude: selectedData.lng,
							},
							   heading: 0,
							   pitch: 0,
							   zoom: 15
							 })
						  }
						>
							<Marker coordinate={{ latitude: selectedData.lat, longitude: selectedData.lng }} />
						</MapView>
					</Hide>
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
		marginTop: 50
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
