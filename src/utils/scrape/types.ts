/**
 * Types for case data scraped from CCAP
 */

export type TypeIngestCaseActivity = {
	ctofc: string
	date: string
	descr: string
	key: string
	loc: string
	start: string
	type: boolean
}

export type TypeIngestCaseChargeModifier = {
	descr: string
	modSeqNo: number
	statuteCite: string
}

export type TypeIngestCaseCharge = {
	chargeModifiers: TypeIngestCaseChargeModifier[]
	chargeNo: number
	descr: string
	dispoDesc: string | null
	id?: string
	isSummaryCandidate: boolean
	judgments: any[]
	offenseDate: string
	pleaDate: string
	pleaDescr: string | null
	severity: string
	statuteCite: string
}

export type TypeIngestCaseDefendant = {
	address: string
	alias: any[]
	attys: TypeIngestCaseDefendantAttorney[]
	dob: string
	effDate: string
	fingerprintId: string | null
	inclGal: boolean
	justisNo: string | null
	name: string
	partyNo: number
	race: string
	sealed: boolean
	sex: string
	status: string | null
	type: string
}

export type TypeIngestCaseDefendantAttorney = {
	entered: string
	isGal: boolean
	name: string
	withdrawn: string
}

export type TypeIngestCaseRecord = {
	addlTxt: string
	amount: string | null
	courtRptr: string | null
	ctofc: string | null
	date: string
	descr: string
	key: string
	parties: any[]
}

export type TypeIngestCase = {
	result: {
		activities: TypeIngestCaseActivity[]
		allowPurchase: boolean
		available: boolean
		balanceDue: number
		branchId: string
		caption: string
		caseNo: string
		caseType: string
		chargeHist: any[]
		charges: TypeIngestCaseCharge[]
		citations: any[]
		civilJdgmts: any[]
		classType: string
		countyName: string
		countyNo: number
		crossReferenced: any[]
		daCaseNo: string
		defAttys: any[]
		defendant: TypeIngestCaseDefendant
		documents: any[]
		execSummary: string
		filingDate: string
		isCriminal: boolean
		isReopenedRemandedFromAppeal: boolean
		lienOnlyCaseType: boolean
		maintenance: string
		parties: any[]
		payplanLink: string | null
		prosAgency: string
		prosAtty: string
		receivables: any[]
		records: TypeIngestCaseRecord[]
		respCtofc: string
		showRssButton: boolean
		status: string
		tac: string | null
		warrants: any[]
		wcisClsCode: string
	}
}