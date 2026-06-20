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
  year: number
  status: 'claimable' | 'processing' | 'paid'
  description: string
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
  institution: string
  amount: number
  submittedOn: string
  stage: 0 | 1 | 2 | 3
  status: 'active' | 'done'
}

// IC used for the happy-path demo
export const DEMO_IC = '900214-08-5127'

export const CLAIMS: Claim[] = [
  {
    id: 'CLM-2024-001',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 15200.0,
    type: 'insurance',
    typeLabel: 'Insurance Maturity Payout',
    institution: 'Prudential BSN Takaful',
    year: 2021,
    status: 'claimable',
    description:
      'A life insurance policy under your name matured but the payout was never collected. The funds are held in trust and can be released to your bank account.',
  },
  {
    id: 'CLM-2024-002',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 2340.5,
    type: 'dividend',
    typeLabel: 'Unclaimed Dividend',
    institution: 'Maybank Berhad',
    year: 2019,
    status: 'claimable',
    description:
      'Dividends from Maybank shares held under your name were declared but never banked in. They have since been transferred to the Registrar of Unclaimed Moneys.',
  },
  {
    id: 'CLM-2024-003',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 1890.0,
    type: 'epf',
    typeLabel: 'KWSP Dividend Balance',
    institution: 'KWSP (EPF)',
    year: 2020,
    status: 'claimable',
    description:
      'A residual EPF dividend balance remains in an inactive account linked to your IC. It can be consolidated into your active i-Akaun.',
  },
  {
    id: 'CLM-2024-004',
    ic: DEMO_IC,
    name: 'Ahmad bin Razali',
    amount: 612.75,
    type: 'dormant',
    typeLabel: 'Dormant Savings Account',
    institution: 'Bank Simpanan Nasional',
    year: 2016,
    status: 'claimable',
    description:
      'A savings account with no activity for over 7 years was classified as dormant and transferred to unclaimed moneys under the Act 1965.',
  },
]

export const DEMO_TOTAL = CLAIMS.reduce((s, c) => s + c.amount, 0)

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
    institution: 'Maybank Berhad',
    amount: 2340.5,
    submittedOn: '12 Jun 2026',
    stage: 2,
    status: 'active',
  },
  {
    id: 't2',
    ref: 'CLM-7H4P-2024',
    type: 'Dormant Savings Account',
    institution: 'Bank Simpanan Nasional',
    amount: 612.75,
    submittedOn: '08 Jun 2026',
    stage: 1,
    status: 'active',
  },
  {
    id: 't3',
    ref: 'CLM-2C8X-2025',
    type: 'KWSP Dividend Balance',
    institution: 'KWSP (EPF)',
    amount: 1890.0,
    submittedOn: '02 May 2026',
    stage: 3,
    status: 'done',
  },
]
