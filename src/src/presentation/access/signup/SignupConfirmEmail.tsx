import React from "react";
import { Dispatch } from "redux";
import { ScrollView } from "react-native";

import NavigationHeaderStyle from "../../common/NavigationHeaderStyle";
import TermsExplanation from "../../common/TermsExplanation";
import { ServiceObserver } from "../../common/ServiceObserver";
import { VerifyCodeComponent } from "../../common/VerifyCode";
import { PasswordPickComponent } from "../../dashboard/common/PasswordPickComponent";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";

import { isPendingService } from "../../../services/ServiceStateStore";
import { registerUser } from "../../../services/user/registerUser";
import { sendMailValidator } from "../../../services/user/sendMailValidator";
import { verifyEmailCode } from "../../../services/user/verifyEmailCode";
import { didiConnect } from "../../../store/store";
import { StoreAction } from "../../../store/StoreAction";
import strings from "../../resources/strings";

import { SignupConfirmedProps } from "./SignupConfirmed";

export interface SignupConfirmEmailProps {
	phoneNumber: string;
	email: string;
}
interface SignupConfirmEmailStateProps {
	verifyEmailCodePending: boolean;
	registerUserPending: boolean;
}
interface SignupConfirmEmailDispatchProps {
	verifyEmailCode(email: string, validationCode: string): void;
	registerUser: (email: string, password: string, phoneNumber: string) => void;
	dispatch: Dispatch<StoreAction>;
}
type SignupConfirmEmailInternalProps = SignupConfirmEmailProps &
	SignupConfirmEmailStateProps &
	SignupConfirmEmailDispatchProps;

interface SignupConfirmEmailState {
	password: string | null;
	didVerifyEmail: boolean;
}

export interface SignupConfirmEmailNavigation {
	SignupConfirmed: SignupConfirmedProps;
}

const serviceKeyVerify = "SignupConfirmEmail_Verify";
const serviceKeyRegister = "SignupConfirmEmail_Register";

class SignupConfirmEmailScreen extends NavigationEnabledComponent<
	SignupConfirmEmailInternalProps,
	SignupConfirmEmailState,
	SignupConfirmEmailNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitle(strings.signup.barTitle);

	constructor(props: SignupConfirmEmailInternalProps) {
		super(props);
		this.state = {
			password: null,
			didVerifyEmail: false
		};
	}

	render() {
		return (
			<>
				<ServiceObserver serviceKey={serviceKeyVerify} onSuccess={() => this.registerUser()} />
				<ServiceObserver serviceKey={serviceKeyRegister} onSuccess={() => this.navigate("SignupConfirmed", {})} />

				<ScrollView>
					<VerifyCodeComponent
						description={strings.signup.registrationEmailSent.message}
						onResendCodePress={serviceKey => {
							this.props.dispatch(sendMailValidator(serviceKey, this.props.email, null));
						}}
						isContinueBlocked={this.state.password === null}
						onPressContinueButton={inputCode => this.onPressContinueButton(inputCode)}
						isContinuePending={this.props.registerUserPending || this.props.verifyEmailCodePending}
						firstChildren={<PasswordPickComponent onPasswordChange={password => this.setState({ password })} />}
						secondChildren={<TermsExplanation style={{ marginVertical: 20 }} />}
					/>
				</ScrollView>
			</>
		);
	}

	private onPressContinueButton(inputCode: string) {
		if (this.state.didVerifyEmail) {
			this.registerUser();
		} else {
			this.props.verifyEmailCode(this.props.email, inputCode);
		}
	}

	private registerUser() {
		this.setState({ didVerifyEmail: true });
		this.props.registerUser(this.props.email, this.state.password!, this.props.phoneNumber);
	}
}

const connected = didiConnect(
	SignupConfirmEmailScreen,
	(state): SignupConfirmEmailStateProps => ({
		verifyEmailCodePending: isPendingService(state.serviceCalls[serviceKeyVerify]),
		registerUserPending: isPendingService(state.serviceCalls[serviceKeyRegister])
	}),
	(dispatch): SignupConfirmEmailDispatchProps => ({
		verifyEmailCode: (email: string, validationCode: string) =>
			dispatch(verifyEmailCode(serviceKeyVerify, email, validationCode)),

		registerUser: (email: string, password: string, phoneNumber: string) =>
			dispatch(registerUser(serviceKeyRegister, email, password, phoneNumber)),

		dispatch
	})
);

export { connected as SignupConfirmEmailScreen };
