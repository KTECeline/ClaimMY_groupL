export type ClaimType =
  | 'dividend'
  | 'dormant'
  | 'insurance'
  | 'epf'
  | 'court'

export type Claim = {
  id: string
  ic: string
  name: string
  amount: number
  type: ClaimType
  typeLabel: string
  institution: string
  /** Links the claim to an Institution for the checklist and info screen. */
  institutionSlug: string
  year: number
  status: 'claimable' | 'processing' | 'paid'
  description: string
  /** Drives S-11b — the checklist users see *before* they start uploading. */
  requiredDocs: string[]
}

export type FamilyMember = {
  id: string
  name: string
  ic: string
  relationship: string
  avatarColor: string
  initials: string
  claimable: number
  claims: number
}

export type AppNotification = {
  id: string
  type: 'found' | 'status' | 'reminder' | 'system'
  title: string
  body: string
  amount?: number
  time: string
  group: 'today' | 'earlier'
  unread: boolean
}

export type TrackedClaim = {
  id: string
  ref: string
  type: string
  /** Enum alongside the label, so the tracker can render <ClaimTypeIcon>. */
  claimType: ClaimType
  institution: string
  institutionSlug: string
  amount: number
  submittedOn: string
  stage: 0 | 1 | 2 | 3
  status: 'active' | 'done' | 'rejected'
  /** S-29 — only present when status is 'rejected'. */
  rejectionReason?: string
  howToFix?: string[]
}

/** S-30 Document Vault */
export type VaultDocument = {
  id: string
  /** Matches a DOCUMENTS entry, so claims know what the vault can auto-fill. */
  docId: string
  name: string
  detail: string
  status: 'stored' | 'not-stored'
  /** Renders the ⚠ expiry warning in the lo-fi. */
  expiringSoon?: boolean
}

/** S-09 Institution Info, and the source of each claim's document checklist */
export type Institution = {
  slug: string
  name: string
  shortName: string
  about: string
  processingTime: string
  phone: string
  website: string
  requiredDocs: string[]
}

/** S-28 Help & FAQ */
export type FaqTopic = {
  id: string
  question: string
  answer: string
}

/** S-27 Security — active sessions */
export type Session = {
  id: string
  device: string
  detail: string
  current: boolean
}

/** S-20b Deceased Estate Guide */
export type EstateStep = {
  id: string
  label: string
  body: string
}

// IC used for the happy-path demo
export const DEMO_IC = '900214-08-5127'

/** The sources one search checks — shown on Home as reassurance and replayed as the checklist on the Searching screen. */
export const SEARCH_SOURCES = [
  'eGUMIS',
  'KWSP (EPF)',
  'Bank Negara',
  'Insurance & Takaful',
  'Court Settlements',
]

export const CLAIMS: Claim[] = [
  {
    id: 'CLM-2024-001',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 15200.0,
    type: 'insurance',
    typeLabel: 'Insurance Maturity Payout',
    institution: 'Prudential BSN Takaful',
    institutionSlug: 'prudential-bsn',
    year: 2021,
    status: 'claimable',
    description:
      'A life insurance policy under your name matured but the payout was never collected. The funds are held in trust and can be released to your bank account.',
    requiredDocs: ['mykad', 'policy', 'bank-statement'],
  },
  {
    id: 'CLM-2024-002',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 2340.5,
    type: 'dividend',
    typeLabel: 'Unclaimed Dividend',
    institution: 'Maybank Berhad',
    institutionSlug: 'maybank',
    year: 2019,
    status: 'claimable',
    description:
      'Dividends from Maybank shares held under your name were declared but never banked in. They have since been transferred to the Registrar of Unclaimed Moneys.',
    requiredDocs: ['mykad', 'bank-statement'],
  },
  {
    id: 'CLM-2024-003',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 1890.0,
    type: 'epf',
    typeLabel: 'KWSP Dividend Balance',
    institution: 'KWSP (EPF)',
    institutionSlug: 'kwsp',
    year: 2020,
    status: 'claimable',
    description:
      'A residual EPF dividend balance remains in an inactive account linked to your IC. It can be consolidated into your active i-Akaun.',
    requiredDocs: ['mykad', 'bank-statement'],
  },
  {
    id: 'CLM-2024-004',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 612.75,
    type: 'dormant',
    typeLabel: 'Dormant Savings Account',
    institution: 'Bank Simpanan Nasional',
    institutionSlug: 'bsn',
    year: 2016,
    status: 'claimable',
    description:
      'A savings account with no activity for over 7 years was classified as dormant and transferred to unclaimed moneys under the Act 1965.',
    requiredDocs: ['mykad', 'bank-statement', 'address'],
  },
  {
    id: 'CLM-2024-005',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 940.0,
    type: 'dividend',
    typeLabel: 'Unclaimed Dividend',
    institution: 'CIMB Berhad',
    institutionSlug: 'cimb',
    year: 2022,
    status: 'processing',
    description:
      'Share dividends declared under your name were never banked in. Your claim has already been submitted and is under review by CIMB.',
    requiredDocs: ['mykad', 'bank-statement'],
  },
  {
    id: 'CLM-2024-006',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 1500.0,
    type: 'epf',
    typeLabel: 'KWSP Dividend Balance',
    institution: 'KWSP (EPF)',
    institutionSlug: 'kwsp',
    year: 2018,
    status: 'paid',
    description:
      'A residual EPF dividend balance was consolidated into your active i-Akaun. This record is kept for your reference only.',
    requiredDocs: ['mykad', 'bank-statement'],
  },
]

export const DEMO_TOTAL = CLAIMS.reduce((s, c) => s + c.amount, 0)

// Claims for family members, keyed by IC (digits only)
export const FAMILY_CLAIMS: Record<string, Claim[]> = {
  '580312082244': [
    {
      id: 'FAM-2024-001',
      ic: '580312-08-2244',
      name: 'Rosnah binti Ismail',
      amount: 5200.0,
      type: 'insurance',
      typeLabel: 'Insurance Maturity Payout',
      institution: 'Takaful Malaysia',
      institutionSlug: 'takaful-malaysia',
      year: 2018,
      status: 'claimable',
      description:
        'A life takaful policy matured but the payout was never collected. Funds are held in trust pending a valid claim.',
      requiredDocs: ['mykad', 'policy', 'poa'],
    },
    {
      id: 'FAM-2024-002',
      ic: '580312-08-2244',
      name: 'Rosnah binti Ismail',
      amount: 3220.0,
      type: 'dividend',
      typeLabel: 'Unclaimed Dividend',
      institution: 'CIMB Berhad',
      institutionSlug: 'cimb',
      year: 2017,
      status: 'claimable',
      description:
        'Share dividends declared under this name were never banked in and have since been transferred to the Registrar of Unclaimed Moneys.',
      requiredDocs: ['mykad', 'bank-statement', 'poa'],
    },
  ],
  '551120085531': [
    {
      id: 'FAM-2024-003',
      ic: '551120-08-5531',
      name: 'Razali bin Hamid',
      amount: 3275.5,
      type: 'epf',
      typeLabel: 'KWSP Dividend Balance',
      institution: 'KWSP (EPF)',
      institutionSlug: 'kwsp',
      year: 2019,
      status: 'claimable',
      description:
        'A residual EPF dividend balance remains in an inactive account linked to this IC. It can be consolidated into an active i-Akaun.',
      requiredDocs: ['mykad', 'bank-statement', 'poa'],
    },
  ],
}

export const FAMILY: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Rosnah binti Ismail',
    ic: '580312-08-2244',
    relationship: 'family.add.rel.parent',
    avatarColor: 'var(--pine)',
    initials: 'RI',
    claimable: 8420.0,
    claims: 2,
  },
  {
    id: 'fam-2',
    name: 'Razali bin Hamid',
    ic: '551120-08-5531',
    relationship: 'family.add.rel.parent',
    avatarColor: 'var(--gold)',
    initials: 'RH',
    claimable: 3275.5,
    claims: 1,
  },
  {
    id: 'fam-3',
    name: 'Nurul Ain binti Ahmad',
    ic: '120804-08-1122',
    relationship: 'family.add.rel.child',
    avatarColor: 'var(--clay)',
    initials: 'NA',
    claimable: 0,
    claims: 0,
  },
]

export const FAMILY_TOTAL = FAMILY.reduce((s, m) => s + m.claimable, 0)

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'found',
    title: 'New unclaimed money found',
    body: 'A dormant savings account under your IC was just added to our records.',
    amount: 612.75,
    time: '2h ago',
    group: 'today',
    unread: true,
  },
  {
    id: 'n2',
    type: 'status',
    title: 'Documents verified',
    body: 'Your Maybank dividend claim passed verification and moved to institution review.',
    time: '5h ago',
    group: 'today',
    unread: true,
  },
  {
    id: 'n3',
    type: 'found',
    title: 'Money found for Rosnah binti Ismail',
    body: 'We found an insurance payout under your mother in Family Mode.',
    amount: 8420.0,
    time: '1d ago',
    group: 'earlier',
    unread: false,
  },
  {
    id: 'n4',
    type: 'reminder',
    title: 'Finish your KWSP claim',
    body: 'You started a claim 3 days ago. Upload your documents to continue.',
    time: '3d ago',
    group: 'earlier',
    unread: false,
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Welcome to ClaimMY',
    body: 'Search your IC anytime to discover money waiting for you.',
    time: '1w ago',
    group: 'earlier',
    unread: false,
  },
]

export const TRACKED_CLAIMS: TrackedClaim[] = [
  {
    id: 't1',
    ref: 'CLM-9F2K-2024',
    type: 'Unclaimed Dividend',
    claimType: 'dividend',
    institution: 'Maybank Berhad',
    institutionSlug: 'maybank',
    amount: 2340.5,
    submittedOn: '12 Jun 2026',
    stage: 2,
    status: 'active',
  },
  {
    id: 't2',
    ref: 'CLM-7H4P-2024',
    type: 'Dormant Savings Account',
    claimType: 'dormant',
    institution: 'Bank Simpanan Nasional',
    institutionSlug: 'bsn',
    amount: 612.75,
    submittedOn: '08 Jun 2026',
    stage: 1,
    status: 'active',
  },
  {
    id: 't3',
    ref: 'CLM-2C8X-2025',
    type: 'KWSP Dividend Balance',
    claimType: 'epf',
    institution: 'KWSP (EPF)',
    institutionSlug: 'kwsp',
    amount: 1890.0,
    submittedOn: '02 May 2026',
    stage: 3,
    status: 'done',
  },
  {
    id: 't4',
    ref: 'CLM-4T1M-2025',
    type: 'Insurance Maturity Payout',
    claimType: 'insurance',
    institution: 'Prudential BSN Takaful',
    institutionSlug: 'prudential-bsn',
    amount: 15200.0,
    submittedOn: '18 Apr 2026',
    stage: 1,
    status: 'rejected',
    rejectionReason:
      'The bank statement you uploaded was more than 3 months old, so the payout account could not be verified.',
    howToFix: [
      'Download a bank statement dated within the last 3 months.',
      'Make sure your full name and account number are both visible.',
      'Re-upload it and submit again — nothing else needs re-entering.',
    ],
  },
]

// ---------------------------------------------------------------------------
// Institutions — drive S-09 Institution Info and the S-11b document checklist
// ---------------------------------------------------------------------------

export const INSTITUTIONS: Institution[] = [
  {
    slug: 'maybank',
    name: 'Maybank Berhad',
    shortName: 'Maybank',
    about:
      'Unclaimed dividends and dormant accounts held by Maybank are transferred to the Registrar of Unclaimed Moneys after seven years. Maybank verifies your identity before the Registrar releases the funds.',
    processingTime: '14–21 working days',
    phone: '1300-88-6688',
    website: 'maybank2u.com.my',
    requiredDocs: ['mykad', 'bank-statement'],
  },
  {
    slug: 'kwsp',
    name: 'KWSP (EPF)',
    shortName: 'KWSP',
    about:
      'Residual dividend balances in inactive EPF accounts can be consolidated into your active i-Akaun, or paid out if you are no longer contributing.',
    processingTime: '7–14 working days',
    phone: '03-8922 6000',
    website: 'kwsp.gov.my',
    requiredDocs: ['mykad', 'bank-statement'],
  },
  {
    slug: 'bsn',
    name: 'Bank Simpanan Nasional',
    shortName: 'BSN',
    about:
      'Savings accounts with no activity for over seven years are classified as dormant under the Unclaimed Moneys Act 1965 and transferred to the Registrar.',
    processingTime: '21–30 working days',
    phone: '1300-88-1900',
    website: 'bsn.com.my',
    requiredDocs: ['mykad', 'bank-statement', 'address'],
  },
  {
    slug: 'prudential-bsn',
    name: 'Prudential BSN Takaful',
    shortName: 'Prudential BSN',
    about:
      'Matured takaful policies where the payout was never collected are held in trust. The policy certificate speeds up verification but is not compulsory.',
    processingTime: '21–30 working days',
    phone: '03-2775 7188',
    website: 'prubsn.com.my',
    requiredDocs: ['mykad', 'policy', 'bank-statement'],
  },
  {
    slug: 'takaful-malaysia',
    name: 'Takaful Malaysia',
    shortName: 'Takaful Malaysia',
    about:
      'Matured life takaful payouts remain in trust until a valid claim is made by the certificate holder or an authorised representative.',
    processingTime: '21–30 working days',
    phone: '1300-88-2525',
    website: 'takaful-malaysia.com.my',
    requiredDocs: ['mykad', 'policy', 'poa'],
  },
  {
    slug: 'cimb',
    name: 'CIMB Berhad',
    shortName: 'CIMB',
    about:
      'Share dividends declared but never banked in are transferred to the Registrar of Unclaimed Moneys. CIMB confirms the shareholding before release.',
    processingTime: '14–21 working days',
    phone: '03-6204 7788',
    website: 'cimb.com.my',
    requiredDocs: ['mykad', 'bank-statement', 'poa'],
  },
]

export function getInstitution(slug: string) {
  return INSTITUTIONS.find((i) => i.slug === slug)
}

/**
 * Document catalogue. `id`s are referenced by Claim.requiredDocs and
 * Institution.requiredDocs; labels/hints are i18n keys resolved at render.
 */
export const DOCUMENTS = [
  { id: 'mykad', labelKey: 'doc.mykad', hintKey: 'doc.mykad.hint' },
  { id: 'bank-statement', labelKey: 'doc.bank', hintKey: 'doc.bank.hint' },
  { id: 'address', labelKey: 'doc.address', hintKey: 'doc.address.hint' },
  { id: 'policy', labelKey: 'doc.policy', hintKey: 'doc.policy.hint' },
  { id: 'poa', labelKey: 'doc.poa', hintKey: 'doc.poa.hint' },
  { id: 'death-cert', labelKey: 'doc.death', hintKey: 'doc.death.hint' },
  { id: 'grant', labelKey: 'doc.grant', hintKey: 'doc.grant.hint' },
] as const

export function getDocument(id: string) {
  return DOCUMENTS.find((d) => d.id === id)
}

// ---------------------------------------------------------------------------
// Document Vault (S-30)
// ---------------------------------------------------------------------------

export const VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'v1',
    docId: 'mykad',
    name: 'MyKad — front & back',
    detail: 'Uploaded 12 Jun 2026 · 2 files',
    status: 'stored',
  },
  {
    id: 'v2',
    docId: 'bank-statement',
    name: 'Bank statement',
    detail: 'Maybank · uploaded 12 Jun 2026',
    status: 'stored',
  },
  {
    id: 'v3',
    docId: 'address',
    name: 'Proof of address',
    detail: 'TNB bill · expires in 12 days',
    status: 'stored',
    expiringSoon: true,
  },
  {
    id: 'v4',
    docId: 'policy',
    name: 'Insurance policy certificate',
    detail: 'Not uploaded yet',
    status: 'not-stored',
  },
  {
    id: 'v5',
    docId: 'poa',
    name: 'Power of Attorney',
    detail: 'For Rosnah binti Ismail · uploaded 02 May 2026',
    status: 'stored',
  },
]

/** Document ids the vault can auto-fill into a claim. */
export const VAULT_DOC_IDS = VAULT_DOCUMENTS.filter(
  (d) => d.status === 'stored',
).map((d) => d.docId)

// ---------------------------------------------------------------------------
// Help & FAQ (S-28)
// ---------------------------------------------------------------------------

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: 'f1',
    question: 'What counts as unclaimed money?',
    answer:
      'Money that has sat untouched for seven years or more — dormant savings accounts, uncollected dividends, matured insurance payouts, and court deposits. Banks and insurers must hand it to the Registrar of Unclaimed Moneys, where it waits for you indefinitely. It never expires.',
  },
  {
    id: 'f2',
    question: 'Is there a fee to claim my money?',
    answer:
      'No. Claiming is free. If anyone asks you to pay a "processing fee" or "release fee" to get your unclaimed money, it is a scam — report it and do not pay.',
  },
  {
    id: 'f3',
    question: 'How long does a claim take?',
    answer:
      'Most claims are processed in 14 to 30 working days depending on the institution. You can see the exact estimate on each claim, and the status updates as it moves through review.',
  },
  {
    id: 'f4',
    question: 'Can I claim for my parents or a relative?',
    answer:
      'Yes. Family Mode lets you search and claim on behalf of a living relative with their consent and a Power of Attorney. For a relative who has passed away, the Deceased Estate guide walks you through the letters of administration you will need.',
  },
  {
    id: 'f5',
    question: 'What if my claim is rejected?',
    answer:
      'You will get a notification explaining exactly why, plus the steps to fix it. Most rejections are document problems — an out-of-date bank statement or an unreadable scan — and you can re-submit without re-entering your details.',
  },
  {
    id: 'f6',
    question: 'Is my data safe?',
    answer:
      'Documents in your vault are encrypted and locked behind biometrics or a PIN. You can delete everything at any time from Settings → My Documents.',
  },
]

// ---------------------------------------------------------------------------
// Security (S-27)
// ---------------------------------------------------------------------------

export const SESSIONS: Session[] = [
  {
    id: 's1',
    device: 'iPhone 14 · Kuala Lumpur',
    detail: 'Active now · this device',
    current: true,
  },
  {
    id: 's2',
    device: 'Chrome on Windows · Petaling Jaya',
    detail: 'Last active 3 days ago',
    current: false,
  },
]

// ---------------------------------------------------------------------------
// Deceased Estate Guide (S-20b)
// ---------------------------------------------------------------------------

export const ESTATE_STEPS: EstateStep[] = [
  {
    id: 'e1',
    label: 'Death certificate',
    body: 'The original or a certified copy from the National Registration Department (JPN).',
  },
  {
    id: 'e2',
    label: 'Letter of Administration or Probate',
    body: 'From the Amanah Raya, the Land Office, or the High Court — which one depends on the size and type of the estate.',
  },
  {
    id: 'e3',
    label: 'Proof you are the administrator',
    body: 'Your MyKad plus the document naming you as administrator or executor of the estate.',
  },
  {
    id: 'e4',
    label: 'Estate bank account details',
    body: 'Funds are paid into the estate account, not a personal account. Your bank can open one with the documents above.',
  },
]
