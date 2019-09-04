import React, { Fragment } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	TouchableOpacityProps,
	Text,
	StyleProp,
	TextStyle
} from "react-native";
import colors from "../styles/colors";

export interface DidiButtonProps extends TouchableOpacityProps {
	title: string;
	titleStyle?: StyleProp<TextStyle>;
}

export default class DidiButton extends React.Component<DidiButtonProps> {
	public render() {
		return (
			<TouchableOpacity
				accessibilityRole="button"
				{...this.props}
				style={[styles.button, this.props.style]}
			>
				<Text style={[styles.text, this.props.titleStyle]}>
					{this.props.title}
				</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 56,
		width: "80%",
		marginHorizontal: 5,
		marginVertical: 5,
		borderRadius: 5,
		backgroundColor: colors.primary
	},
	text: {
		fontWeight: "500",
		fontSize: 16,
		textAlign: "center",
		color: "#FFF"
	}
});
