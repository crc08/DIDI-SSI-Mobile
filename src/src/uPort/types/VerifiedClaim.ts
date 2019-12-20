import * as t from "io-ts";

import { SingleKeyedRecordCodec } from "../../util/SingleKeyedRecord";

import { ClaimDataCodec } from "../../model/Claim";
import { CredentialDocument } from "../../model/CredentialDocument";
import { EthrDIDCodec } from "../../model/EthrDID";

const VerifiedClaimOuterCodec = t.intersection([
	t.type({
		iss: EthrDIDCodec,
		sub: EthrDIDCodec,
		vc: t.type({
			"@context": t.array(t.string),
			type: t.array(t.string),
			credentialSubject: SingleKeyedRecordCodec(
				t.partial({
					data: ClaimDataCodec,
					wrapped: t.record(t.string, t.string),
					preview: t.type({
						type: t.number,
						fields: t.array(t.string)
					})
				})
			)
		})
	}),
	t.partial({
		iat: t.number,
		exp: t.number
	})
]);
type VerifiedClaimTransport = typeof VerifiedClaimOuterCodec._A;

export type VerifiedClaim = Omit<CredentialDocument, "type" | "jwt" | "nested" | "specialFlag"> & {
	type: "VerifiedClaim";
	wrapped: Record<string, string>;
};

export const VerifiedClaimCodec = VerifiedClaimOuterCodec.pipe(
	new t.Type<VerifiedClaim, VerifiedClaimTransport, VerifiedClaimTransport>(
		"VerifiedClaimCodec",
		(u): u is VerifiedClaim => true,
		(i, c) =>
			t.success<VerifiedClaim>({
				type: "VerifiedClaim",
				issuer: i.iss,
				subject: i.sub,
				expireAt: i.exp,
				issuedAt: i.iat,
				title: i.vc.credentialSubject.key,
				preview: i.vc.credentialSubject.value.preview,
				data: i.vc.credentialSubject.value.data ?? {},
				wrapped: i.vc.credentialSubject.value.wrapped ?? {}
			}),
		a => {
			return {
				type: "shareReq",
				iss: a.issuer,
				sub: a.subject,
				exp: a.expireAt,
				iat: a.issuedAt,
				vc: {
					"@context": ["https://www.w3.org/2018/credentials/v1"],
					type: ["VerifiableCredential"],
					credentialSubject: {
						key: a.title,
						value: {
							data: a.data,
							preview: a.preview,
							wrapped: a.wrapped
						}
					}
				}
			};
		}
	)
);
