import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Keyboard, Dimensions, ActivityIndicator } from 'react-native';
import { getData, setQuery, setData, setHide, setQueryHide } from '~redux/modules/google';
import { resetQuery, fillQueryData } from '~redux/modules/savedData';
import { connect } from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import LottieView from 'lottie-react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, IconButton } from 'react-native-paper';
import Hide from 'react-native-hide-with-keyboard';
import formatcoords  from 'formatcoords';
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

	endOfInput = () => {
		if (this.props.query === '') {
			return null;
		}

		if (this.props.isLoading === true) {
			return (
				<View style={{ position: 'absolute', right: 0, padding: 10 }}>
					<ActivityIndicator color={'black'}/>
				</View>
			)
		}

		return (
			<View style={{ position: 'absolute', right: 0, top: -2 }}>
				<IconButton icon="close" onPress={() => { this.props.setQuery(''); this.props.setHide(true);}}/>
			</View>
		)
	}

	autoComp = () => {
		return (
			<View>
			<Autocomplete
				data={this.props.data}
				value={this.props.query}
				hideResults={this.props.hideResults}
				onChangeText={(text) => {
					this.onChangeTextDelayed(text)
					this.props.setQuery(text)
				}}
				onBlur={() => this.props.setQueryHide(true)}
				onFocus={() => this.props.setQueryHide(false)}
				inputContainerStyle={{ paddingRight: 50, borderRadius: 15, paddingLeft: 16 }}
				placeholder='Enter the name of the place to search'
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
									this.props.setQueryHide(true);
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
			{this.endOfInput()}
			</View>
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
				{(this.props.searchQuery.length > 0 && this.props.queryHide === false) &&
					<View style={{ flexDirection: 'row', marginTop: Platform.OS === 'android' ? 60 : 0, flexWrap: 'wrap', zIndex: 0, paddingTop: 16 }}>
						 {this.props.searchQuery.map((data, index) => {
							return (
								<Button mode="contained" key={index} compact style={{ marginTop: 16, marginLeft: 16, backgroundColor: '#24a0ed' }} onPress={() => {
									this.props.getData(data);
									this.props.setQuery(data);
									}
								}>
									{data}
								</Button>
							);
						})}
						<Button 
							mode="contained"
							compact
							onPress={() => {this.props.resetQuery(); this.props.setQuery(''); }}
							style={{ marginTop: 16, marginLeft: 16, backgroundColor: 'red', borderRadius: 50 }}
						>
							Clear
						</Button>
					</View>
				}
				{!_.isEmpty(selectedData) ?
					<Hide style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{ paddingBottom: 16, paddingHorizontal: 16, alignItems: 'center' }}>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedData.placeName} {selectedData.countryCode} {selectedData.postalCode}</Text>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>{formatcoords(selectedData.lat,selectedData.lng).format('f')}</Text>
						</View>
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
					:
					<LottieView
						ref={animation => {
							this.animation = animation;
						}}
						autoPlay
						loop
						style={{
							width: 400,
							height: 400,
							backgroundColor: '#fff',
							marginTop: Platform.OS === 'android' && 60
						}}
						source={require('../../assets/map-pin-location.json')}
						// OR find more Lottie files @ https://lottiefiles.com/featured
						// Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
					/>
				}
			</View>
		);
	}
}

const mapStateToProps = ({ google, savedData }) => {
	let { data, query, hideResults, selectedData, isLoading, queryHide } = google;
	let { searchQuery } = savedData;

	return {
		data,
		query,
		hideResults,
		searchQuery,
		selectedData,
		isLoading,
		queryHide
	};
};

const mapDispatchToProps = {
	getData,
	setQuery,
	setData,
	resetQuery,
	fillQueryData,
	setHide,
	setQueryHide
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
