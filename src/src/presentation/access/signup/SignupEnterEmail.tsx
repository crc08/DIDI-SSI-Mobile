import React from "react";
import { Alert, Image, Text } from "react-native";

import { ServiceWrapper } from "../../../services/common/ServiceWrapper";
import { DidiScreen } from "../../common/DidiScreen";
import { DidiServiceButton } from "../../util/DidiServiceButton";
import DidiTextInput from "../../util/DidiTextInput";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";
import commonStyles from "../resources/commonStyles";

import { RegisterUserArguments, RegisterUserState } from "../../../services/user/registerUser";
import { SendMailValidatorArguments, SendMailValidatorState } from "../../../services/user/sendMailValidator";
import { didiConnect } from "../../../store/store";
import NavigationHeaderStyle from "../../resources/NavigationHeaderStyle";
import strings from "../../resources/strings";
import Validator from "../helpers/validator";

import { SignupConfirmEmailProps } from "./SignupConfirmEmail";

export interface SignupEnterEmailProps {
	phoneNumber: string;
}
interface SignupEnterEmailStateProps {
	requestEmailCodeState: SendMailValidatorState;
}
interface SignupEnterEmailDispatchProps {
	requestEmailCode(args: SendMailValidatorArguments): void;
	dropRequestEmailCode(): void;
}
type SignupEnterEmailInternalProps = SignupEnterEmailStateProps & SignupEnterEmailDispatchProps & SignupEnterEmailProps;

export interface SignupEnterEmailNavigation {
	SignupConfirmEmail: SignupConfirmEmailProps;
}

interface SignupEnterEmailState {
	email: string;
	key: string;
	keyDup: string;
}

class SignupEnterEmailScreen extends NavigationEnabledComponent<
	SignupEnterEmailInternalProps,
	SignupEnterEmailState,
	SignupEnterEmailNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitle(strings.signup.barTitle);

	private canPressContinueButton(): boolean {
		if (!this.state || !Validator.isEmail(this.state.email)) {
			return false;
		}
		return this.state.key ? this.state.key.length > 0 && this.state.keyDup === this.state.key : false;
	}

	render() {
		return (
			<DidiScreen>
				<Text style={commonStyles.text.emphasis}>{strings.signup.enterEmail.messageHead}</Text>

				<Image
					source={
						this.canPressContinueButton()
							? require("../resources/images/save.png")
							: require("../resources/images/saveClean.png")
					}
					style={commonStyles.image.image}
				/>

				<DidiTextInput.Email onChangeText={text => this.setState({ email: text })} />

				<DidiTextInput.Password onChangeText={text => this.setState({ key: text })} descriptionType="BASIC" />

				<DidiTextInput.Password onChangeText={text => this.setState({ keyDup: text })} descriptionType="REPEAT" />

				<ServiceWrapper
					serviceState={this.props.requestEmailCodeState}
					onServiceSuccess={() =>
						this.navigate("SignupConfirmEmail", {
							phoneNumber: this.props.phoneNumber,
							email: this.state.email,
							password: this.state.key
						})
					}
					resetService={() => this.props.dropRequestEmailCode()}
				/>
				<DidiServiceButton
					title={strings.signup.enterEmail.backupGenerate}
					disabled={!this.canPressContinueButton()}
					onPress={() => this.onPressContinueButton()}
					isPending={this.props.requestEmailCodeState.state === "PENDING"}
				/>
			</DidiScreen>
		);
	}

	private onPressContinueButton() {
		this.props.requestEmailCode({ email: this.state.email });
	}
}

const connected = didiConnect(
	SignupEnterEmailScreen,
	(state): SignupEnterEmailStateProps => ({
		requestEmailCodeState: state.serviceCalls.sendMailValidator
	}),
	(dispatch): SignupEnterEmailDispatchProps => ({
		requestEmailCode: (args: SendMailValidatorArguments) =>
			dispatch({ type: "SERVICE_SEND_EMAIL_VALIDATOR", serviceAction: { type: "START", args } }),
		dropRequestEmailCode: () => dispatch({ type: "SERVICE_SEND_EMAIL_VALIDATOR", serviceAction: { type: "DROP" } })
	})
);

export { connected as SignupEnterEmailScreen };
