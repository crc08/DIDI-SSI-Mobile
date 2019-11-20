import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ValidatedIdentity } from "../../../store/selector/combinedIdentitySelector";
import colors from "../../resources/colors";
import themes from "../../resources/themes";

export interface HomeHeaderProps {
	person: ValidatedIdentity;
	onPersonPress: () => void;
	onBellPress: () => void;
}

export default class HomeHeader extends React.Component<HomeHeaderProps> {
	render() {
		return (
			<View style={styles.root}>
				<TouchableOpacity style={styles.identityContainer} onPress={this.props.onPersonPress}>
					<Image
						style={styles.image}
						source={
							this.props.person.visual.image !== undefined
								? this.props.person.visual.image
								: require("../../resources/images/defaultProfileImage.png")
						}
					/>
					<View>
						<Text style={styles.helloText}>Hola</Text>
						<Text style={styles.nameText}>{this.props.person.visual.id}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.bellContainer} onPress={this.props.onBellPress}>
					<Text style={styles.bell}></Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	root: {
		backgroundColor: themes.navigation,
		flexDirection: "row"
	},
	identityContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		paddingVertical: 25,
		paddingLeft: 20,
		marginRight: 20
	},
	bellContainer: {
		justifyContent: "center",
		paddingVertical: 25,
		paddingHorizontal: 20
	},
	bell: {
		fontFamily: "MaterialIcons-Regular",
		fontSize: 24,
		color: themes.navigationText
	},
	image: {
		marginRight: 10,

		width: 46,
		height: 46,
		borderRadius: 23,

		backgroundColor: colors.darkBackground,
		borderColor: "#FFF",
		borderWidth: 2
	},
	helloText: {
		color: themes.navigationText,
		fontWeight: "normal",
		fontSize: 13
	},
	nameText: {
		color: themes.navigationText,
		fontWeight: "bold",
		fontSize: 13
	}
});
