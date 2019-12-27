import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import { AddChildren } from "../../util/ReactExtensions";
import { DidiScreen } from "../common/DidiScreen";
import commonStyles from "../resources/commonStyles";
import { DidiServiceButton } from "../util/DidiServiceButton";
import { DidiText } from "../util/DidiText";
import DidiTextInput from "../util/DidiTextInput";

import Validator from "../access/helpers/validator";

export interface EnterEmailProps {
	description: string;
	contentImageSource: ImageSourcePropType;
	buttonTitle: string;

	isPasswordRequired: true | false | "duplicate";
	onPressContinueButton: (email: string, password: string | null) => void;
	isContinuePending: boolean;
}

interface EnterEmailState {
	email: string;
	password?: string;
	passwordCopy?: string;
}

export class EnterEmailScreen extends React.Component<AddChildren<EnterEmailProps>, EnterEmailState> {
	constructor(props: EnterEmailProps) {
		super(props);
		this.state = { email: "" };
	}

	private canPressContinueButton(): boolean {
		if (!Validator.isEmail(this.state.email)) {
			return false;
		}
		if (this.props.isPasswordRequired && !Validator.isPassword(this.state.password)) {
			return false;
		}
		if (this.props.isPasswordRequired === "duplicate" && this.state.password !== this.state.passwordCopy) {
			return false;
		}
		return true;
	}

	render() {
		return (
			<DidiScreen>
				<DidiText.Explanation.Emphasis>{this.props.description}</DidiText.Explanation.Emphasis>

				<Image source={this.props.contentImageSource} style={commonStyles.image.image} />

				<DidiTextInput.Email onChangeText={text => this.setState({ email: text })} />

				{this.props.isPasswordRequired ? (
					<DidiTextInput.Password onChangeText={text => this.setState({ password: text })} descriptionType="BASIC" />
				) : (
					<View />
				)}

				{this.props.isPasswordRequired === "duplicate" && (
					<DidiTextInput.Password
						onChangeText={text => this.setState({ passwordCopy: text })}
						descriptionType="REPEAT"
					/>
				)}

				{this.props.children}

				<DidiServiceButton
					title={this.props.buttonTitle}
					disabled={!this.canPressContinueButton()}
					onPress={() =>
						this.props.onPressContinueButton(
							this.state.email,
							this.state.password === undefined ? null : this.state.password
						)
					}
					isPending={this.props.isContinuePending}
				/>
			</DidiScreen>
		);
	}
}