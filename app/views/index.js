import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getData } from '~redux/modules/google';
import { connect } from 'react-redux';

class ViewPage extends React.Component {

	getDataNow = () => {
        console.log('press')
		this.props.getData()
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this.getDataNow()}>
					<Text>Open up App.js to start working on your app!</Text>
				</TouchableOpacity>
				<StatusBar style="auto" />
			</View>
		);
	}
}

const mapDispatchToProps = {
	getData
};

export default connect(null, mapDispatchToProps)(ViewPage);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
