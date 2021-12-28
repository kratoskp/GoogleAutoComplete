import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Modal, Dimensions } from 'react-native';
import { getData, setQuery, setData, setHide } from '~redux/modules/google';
import { resetQuery, fillQueryData } from '~redux/modules/savedData';
import { connect } from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import MapView, { Marker } from 'react-native-maps';
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
					<View style={{ flexDirection: 'row', marginTop: 60, flexWrap: 'wrap' }}>
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
						<TouchableOpacity onPress={() => this.setState({ map: true })}  style={{ paddingTop: 16, paddingHorizontal: 16 }}>
							<Text>Show in map</Text>
						</TouchableOpacity>
					</View>
				}
				 <Modal
					animationType="slide"
					visible={this.state.map}
					onRequestClose={() => {
						this.setState({ map: false })
					}}
					style={{ backgroundColor: 'white' }}
					
					>
					<MapView 
					style={{ height: Dimensions.get('screen').height / 2, width: Dimensions.get('screen').width }}
					initialRegion={{
						latitude: selectedData.lat,
						longitude: selectedData.lng,
						latitudeDelta: 0.1,
						longitudeDelta: 0.05,
					  }}
					>
					<Marker coordinate={{ latitude: selectedData.lat, longitude: selectedData.lng }} />
					</MapView>
					<TouchableOpacity style={{backgroundColor: "red", padding: 10}} onPress={() => this.setState({ map: false })}>
						<Text>Close Map</Text>
					</TouchableOpacity>
				</Modal>
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
