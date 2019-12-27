import TypedArray from "../util/TypedArray";

import { ClaimData, ClaimDataPairs } from "./Claim";
import { DidiDocument } from "./DidiDocument";
import { EthrDID } from "./EthrDID";
import { DocumentFilterType } from "./SampleDocument";
import { SpecialCredentialFlag } from "./SpecialCredential";

export interface CredentialDocument extends DidiDocument {
	type: "CredentialDocument";

	subject: EthrDID;
	title: string;
	data: ClaimData;
	preview?: { type: number; fields: string[] };
	category: DocumentFilterType;

	nested: CredentialDocument[];
	specialFlag?: SpecialCredentialFlag;
}

export const CredentialDocument = {
	extractAllDataPairs: (doc: CredentialDocument): ClaimDataPairs => {
		return [
			...doc.nested.map(CredentialDocument.extractAllDataPairs).reduce((l, r) => [...l, ...r], []),
			...TypedArray.flatMap(Object.entries(doc.data), ([label, value]) => {
				switch (typeof value) {
					case "string":
						return { label, value };
					case "number":
						return { label, value: value.toString() };
					default:
						return undefined;
				}
			})
		];
	},

	extractDataPairs: (doc: CredentialDocument, preview?: { type: number; fields: string[] }): ClaimDataPairs => {
		const dataPairs = CredentialDocument.extractAllDataPairs(doc);
		if (!preview) {
			return dataPairs;
		}
		return TypedArray.flatMap(preview.fields, label => dataPairs.find(pair => pair.label === label));
	},

	numberOfColumns(doc: CredentialDocument): 1 | 2 | 3 {
		if (!doc.preview) {
			return 1;
		}
		switch (doc.preview.type) {
			case 1:
			case 2:
			case 3:
				return doc.preview.type;
			default:
				return 1;
		}
	}
};