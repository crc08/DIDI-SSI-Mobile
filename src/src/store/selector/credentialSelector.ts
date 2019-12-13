import { createSelector } from "reselect";

import TypedArray from "../../util/TypedArray";

import { CredentialDocument } from "../../model/CredentialDocument";

import { parsedTokenSelector } from "./parsedTokenSelector";

const allCredentialSelector = createSelector(parsedTokenSelector, tokens =>
	TypedArray.flatMap(tokens, (tk): CredentialDocument | null => (tk.type === "CredentialDocument" ? tk : null))
);

export const credentialSelector = createSelector(allCredentialSelector, credentials => {
	const nested = credentials.map(c => c.nested).reduce((acc, next) => acc.concat(next), []);
	return credentials.filter(credential => !nested.find(nest => nest.jwt === credential.jwt));
});
