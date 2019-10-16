import { CredentialDocument } from "../model/data/CredentialDocument";
import { Claim, flattenClaim } from "./types/Claim";
import { SelectiveDisclosureRequest } from "./types/SelectiveDisclosureRequest";
import { Identity } from "../model/data/Identity";
import TypedObject from "../util/TypedObject";
import { getCredentials } from "./getCredentials";
import { RequestDocument } from "../model/data/RequestDocument";

function selectOwnClaims(request: SelectiveDisclosureRequest, identity: Identity): Claim {
	const result: Claim = {};
	for (const value of request.ownClaims) {
		switch (value) {
			case "name":
				result.name = identity.name;
			case "email":
				result.email = identity.email.value;
				break;
			case "image":
				// TODO: Handle image request
				break;
			case "country":
				result.country = identity.nationality.value;
				break;
			case "phone":
				result.phone = identity.cellPhone.value;
				break;
			default:
				break;
		}
	}
	return result;
}

function selectVerifiedClaims(
	request: SelectiveDisclosureRequest,
	documents: CredentialDocument[]
): Array<{ selector: string; value?: CredentialDocument }> {
	return request.verifiedClaims.map(selector => {
		const selected = documents.find(document => {
			const { root } = flattenClaim(document.content.claims);
			return root === selector;
		});
		return { selector, value: selected };
	});
}

export function getResponseClaims(
	request: SelectiveDisclosureRequest,
	documents: CredentialDocument[],
	identity: Identity
): { missing: string[]; own: Claim; verified: string[] } {
	const verified: { [selector: string]: CredentialDocument } = {};
	const missing: string[] = [];

	selectVerifiedClaims(request, documents).forEach(vc => {
		if (vc.value) {
			verified[vc.selector] = vc.value;
		} else {
			missing.push(vc.selector);
		}
	});

	const own = selectOwnClaims(request, identity);
	return {
		missing,
		own: {
			...own,
			...TypedObject.mapValues(verified, v => {
				return v.content.claims;
			})
		},
		verified: TypedObject.values(verified).map(d => d.jwt)
	};
}

export interface DisclosureResponseArguments {
	request: RequestDocument;
	identity: Identity;
	credentials: CredentialDocument[];
}

export async function createDisclosureResponse(
	args: DisclosureResponseArguments
): Promise<{ accessToken: string; missing: string[] }> {
	const { missing, own, verified } = getResponseClaims(args.request.content, args.credentials, args.identity);

	const credentials = await getCredentials();
	const accessToken = await credentials.createDisclosureResponse({
		req: args.request.jwt,
		own,
		verified
	});

	return { accessToken, missing };
}