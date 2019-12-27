import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

import commonStyles from "../resources/commonStyles";
import { DidiServiceButton } from "../util/DidiServiceButton";
import { DidiText } from "../util/DidiText";
import DidiTextInput from "../util/DidiTextInput";

import Validator from "../access/helpers/validator";
import strings from "../resources/strings";

import { DidiScreen } from "./DidiScreen";

export interface EnterPhoneProps {
	explanation: string;
	contentImageSource: ImageSourcePropType;
	isPasswordRequired: boolean;
	onPressContinueButton(inputPhoneNumber: string, password: string | null): void;
	isContinuePending: boolean;
}

export interface EnterPhoneState {
	inputPhoneNumber?: string;
	inputPassword?: string;
}

export class EnterPhoneScreen extends React.PureComponent<EnterPhoneProps, EnterPhoneState> {
	constructor(props: EnterPhoneProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<DidiScreen>
				<DidiText.Explanation.Emphasis>{this.props.explanation}</DidiText.Explanation.Emphasis>

				<View style={styles.countryContainer}>
					<Image style={styles.countryImage} source={this.countryImageSource()} />
					<DidiText.Explanation.Normal>{strings.accessCommon.place}</DidiText.Explanation.Normal>
				</View>

				<DidiTextInput.PhoneNumber onChangeText={text => this.setState({ inputPhoneNumber: text })} />

				{this.props.isPasswordRequired && (
					<DidiTextInput.Password
						descriptionType="BASIC"
						onChangeText={text => this.setState({ inputPassword: text })}
					/>
				)}

				<Image style={commonStyles.image.image} source={this.props.contentImageSource} />

				<DidiServiceButton
					isPending={this.props.isContinuePending || false}
					disabled={!this.canPressContinueButton()}
					onPress={() => this.onPressContinueButton()}
					title={strings.accessCommon.validateButtonText}
				/>
			</DidiScreen>
		);
	}

	private canPressContinueButton(): boolean {
		return (
			Validator.isPhoneNumber(this.state.inputPhoneNumber) &&
			(!this.props.isPasswordRequired || Validator.isPassword(this.state.inputPassword))
		);
	}

	private onPressContinueButton() {
		this.props.onPressContinueButton(this.state.inputPhoneNumber!, this.state.inputPassword || null);
	}

	private countryImageSource(): ImageSourcePropType {
		return require("../resources/images/arg.png");
	}
}

const styles = StyleSheet.create({
	countryContainer: {
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center"
	},
	countryImage: {
		width: 30,
		height: 30,
		marginRight: 10
	}
});