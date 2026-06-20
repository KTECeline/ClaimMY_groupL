havent do: Notifications, Family Mode, Claim Tracker, Settings & error state
Browser verification of core flow

# ClaimMY — Project Guide
### UX Design Assignment | CT120-3-3 | APD-APU3F2605CS/SE

---

## What This Project Is

**ClaimMY** is a coded high-fidelity mobile prototype — a Next.js web app designed
to simulate a mobile experience, demonstrating advanced UX principles for the
CT120-3-3 assignment.

You are NOT building a real product. No real APIs. No backend. No database.
Everything is mocked. The goal is the **UX quality**, not the engineering.

**Focus area:** Financial Inclusion
**Problem:** eGUMIS has RM13B in unclaimed funds but is confusing, not mobile-friendly,
and not widely known.
**Solution:** ClaimMY — a simplified, guided mobile platform to discover and claim
unclaimed money across eGUMIS, KWSP, insurance, and court settlements.

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | **Next.js 14** (App Router) | File-based routing = clean page structure |
| Styling | **Tailwind CSS** | Rapid UI, consistent spacing system |
| Components | **shadcn/ui** | Accessible, unstyled-first, easy to customize |
| Animations | **Framer Motion** | Page transitions, micro-interactions, wizard steps |
| Icons | **Lucide React** | Ships with shadcn, consistent icon set |
| State | **React useState / useContext** | No backend needed, keep it simple |
| Mock data | **Local JSON files** | Fake claim results, user profiles, notifications |
| Fonts | **next/font (Google Fonts)** | Load fonts properly without layout shift |
| Language | **i18next + react-i18next** | BM / English / Mandarin / Tamil switching |

---

## Important Commands

```bash
# Create the project
npx create-next-app@latest claimmy --typescript --tailwind --eslint --app --src-dir

# Move into project
cd claimmy

# Install shadcn/ui
npx shadcn@latest init

# Add shadcn components as you need them
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add sheet
npx shadcn@latest add dialog
npx shadcn@latest add progress
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add toast

# Install Framer Motion
npm install framer-motion

# Install i18next for multilingual
npm install i18next react-i18next i18next-resources-to-backend

# Run dev server
npm run dev

# Build (to check for errors before submission)
npm run build
```

---

## DO NOT Do These

```
❌ Don't call real APIs — mock everything with local JSON
❌ Don't use a database — useState and mock data only
❌ Don't build for desktop — design mobile-first (390px width max content)
❌ Don't skip loading states — they are part of the UX
❌ Don't skip error states — "no results found" is a real screen
❌ Don't use Lorem Ipsum — use real Malaysian names, real RM amounts
❌ Don't leave broken links — every button must go somewhere
❌ Don't skip animations — Framer Motion transitions = perceived quality
❌ Don't ignore contrast — check every text colour passes WCAG AA (4.5:1)
❌ Don't forget the language toggle — show at least EN → BM switch working
❌ Don't hardcode English strings — run everything through i18next from day one
❌ Don't make it desktop-only — wrap everything in a mobile container
```

---

## Project Folder Structure

```
claimmy/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout — mobile container wrapper
│   │   ├── page.tsx                  # Splash / onboarding
│   │   ├── home/
│   │   │   └── page.tsx              # Home + IC search
│   │   ├── results/
│   │   │   └── page.tsx              # Search results screen
│   │   ├── claim/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Claim detail
│   │   │   └── wizard/
│   │   │       ├── page.tsx          # Claim wizard wrapper
│   │   │       ├── step-1/page.tsx   # Confirm identity
│   │   │       ├── step-2/page.tsx   # Select claim type
│   │   │       ├── step-3/page.tsx   # Document upload (mock)
│   │   │       ├── step-4/page.tsx   # Review & submit
│   │   │       └── success/page.tsx  # Confirmation screen
│   │   ├── notifications/
│   │   │   └── page.tsx              # Notification centre
│   │   ├── family/
│   │   │   ├── page.tsx              # Family mode — member list
│   │   │   └── add/page.tsx          # Add family member
│   │   ├── track/
│   │   │   └── page.tsx              # Claim status tracker
│   │   └── settings/
│   │       └── page.tsx              # Language, profile, about
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MobileContainer.tsx   # 390px centered wrapper
│   │   │   ├── BottomNav.tsx         # Bottom navigation bar
│   │   │   └── TopBar.tsx            # Header with back button
│   │   ├── ui/                       # shadcn components live here (auto-generated)
│   │   ├── search/
│   │   │   ├── ICSearchInput.tsx     # The main IC number input
│   │   │   └── ResultCard.tsx        # Individual claim result card
│   │   ├── wizard/
│   │   │   ├── WizardProgress.tsx    # Step progress bar
│   │   │   └── StepWrapper.tsx       # Animated step container
│   │   ├── family/
│   │   │   └── FamilyMemberCard.tsx
│   │   └── common/
│   │       ├── LanguageToggle.tsx
│   │       ├── EmptyState.tsx        # No results found
│   │       └── LoadingSpinner.tsx
│   │
│   ├── lib/
│   │   ├── mock-data/
│   │   │   ├── claims.json           # Fake claim results
│   │   │   ├── notifications.json    # Fake notifications
│   │   │   └── family-members.json   # Fake family profiles
│   │   ├── i18n/
│   │   │   ├── config.ts             # i18next setup
│   │   │   └── locales/
│   │   │       ├── en.json           # English strings
│   │   │       ├── bm.json           # Bahasa Malaysia strings
│   │   │       ├── zh.json           # Mandarin strings
│   │   │       └── ta.json           # Tamil strings
│   │   └── utils.ts                  # cn() helper, formatRM(), etc.
│   │
│   ├── context/
│   │   ├── LanguageContext.tsx       # Global language state
│   │   └── ClaimContext.tsx          # Wizard state across steps
│   │
│   └── styles/
│       └── globals.css               # Tailwind base + custom CSS vars
│
├── public/
│   └── images/                       # App icons, illustration assets
│
├── tailwind.config.ts                # Custom colours, fonts, mobile breakpoints
└── components.json                   # shadcn config
```

---

## Design System — Set This Up First

Before building any screens, lock these down in `tailwind.config.ts` and `globals.css`.

### Colour Palette

```ts
// tailwind.config.ts
colors: {
  brand: {
    primary:   '#1B4FD8',  // Trust blue — main CTA, links
    secondary: '#0EA472',  // Success green — claim found, confirmed
    accent:    '#F59E0B',  // Amber — notifications, warnings
    surface:   '#F8FAFF',  // Off-white background
    muted:     '#6B7280',  // Secondary text
    danger:    '#EF4444',  // Errors
  }
}
```

### Typography

```ts
// Use next/font in layout.tsx
import { Inter, Noto_Sans } from 'next/font/google'

// Inter — primary (Latin, clean and trustworthy)
// Noto Sans — fallback (covers Mandarin, Tamil, Arabic scripts)
```

### Mobile Container (use this on every page)

```tsx
// components/layout/MobileContainer.tsx
// Keeps all content in a 390px column — simulates a phone screen
export default function MobileContainer({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

---

## Animations — Framer Motion Patterns to Use

These specific patterns make the UX feel polished. Use them consistently.

```tsx
// 1. PAGE TRANSITION — wrap every page content with this
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 }
}

<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
  transition={{ duration: 0.25, ease: 'easeOut' }}>
  {/* page content */}
</motion.div>


// 2. WIZARD STEP TRANSITION — slides left as user progresses
const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 }
}


// 3. RESULTS STAGGER — claim cards appear one by one
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } }
}
const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
}


// 4. LOADING PULSE — while "searching" IC number (fake 1.5s delay)
// Use shadcn Skeleton component + setTimeout to simulate API call


// 5. SUCCESS ANIMATION — checkmark on claim submission
// Animate a circle + checkmark SVG with pathLength from 0 to 1
```

---

## Mock Data Examples

```json
// lib/mock-data/claims.json
[
  {
    "id": "CLM-2024-001",
    "ic": "901234567890",
    "name": "Ahmad bin Razali",
    "amount": 2340.50,
    "type": "Unclaimed Dividend",
    "institution": "Maybank Berhad",
    "year": 2019,
    "status": "claimable",
    "description": "Unclaimed dividend from Maybank shares held under your name"
  },
  {
    "id": "CLM-2024-002",
    "ic": "901234567890",
    "amount": 890.00,
    "type": "Dormant Savings Account",
    "institution": "Bank Simpanan Nasional",
    "year": 2017,
    "status": "claimable",
    "description": "Dormant savings account with no activity for over 7 years"
  },
  {
    "id": "CLM-2024-003",
    "ic": "901234567890",
    "amount": 15200.00,
    "type": "Insurance Maturity Payout",
    "institution": "Prudential BSN Takaful",
    "year": 2021,
    "status": "claimable",
    "description": "Matured life insurance policy payout uncollected"
  }
]
```

---

## Screen Checklist — Build These In Order

### Must-Have (core marks)
- [ ] Splash / Onboarding (3 slides with value proposition)
- [ ] Home — IC number search input
- [ ] Loading state — animated search (fake 1.5s delay)
- [ ] Results screen — staggered claim cards
- [ ] Empty state — "No unclaimed funds found"
- [ ] Claim detail screen — full breakdown of one claim
- [ ] Wizard Step 1 — Confirm identity
- [ ] Wizard Step 2 — Select claim type
- [ ] Wizard Step 3 — Document upload (mock camera/file UI)
- [ ] Wizard Step 4 — Review & submit
- [ ] Success screen — animated confirmation
- [ ] Notification centre
- [ ] Family Mode — member list
- [ ] Family Mode — add member form
- [ ] Claim tracker / status dashboard
- [ ] Settings — language toggle (show EN ↔ BM working live)
- [ ] Error state — something went wrong

### Nice to Have (pushes toward A)
- [ ] Onboarding language selection screen
- [ ] Biometric/PIN mock login screen
- [ ] Animated bottom nav with active indicator
- [ ] Pull-to-refresh animation on results
- [ ] Haptic-style button press animation
- [ ] Dark mode support
- [ ] Skeleton loading screens instead of spinners

---

## UX Principles to Demonstrate (Tie These to Your Report)

These are what your lecturer is marking against. Build with intention.

| Principle | How to show it in code |
|-----------|----------------------|
| **Progressive disclosure** | Wizard reveals one step at a time, not all at once |
| **Error prevention** | IC input validates format before searching (12 digits) |
| **Plain language** | All result descriptions in simple BM/EN, no legal jargon |
| **Feedback** | Every action has a response — loading, success, error |
| **Accessibility** | aria-labels on all inputs, focus states visible, contrast AA |
| **Consistency** | Same button styles, same spacing, same motion across all screens |
| **Recognition over recall** | Show claim type icons so users don't need to remember codes |
| **User control** | Back button on every screen, wizard lets you go back |

---

## References & Resources

### UX Principles
- Nielsen Norman Group — nngroup.com (search any UX topic here first)
- Laws of UX — lawsofux.com (quick visual reference for design principles)
- WCAG 2.1 Quick Ref — w3.org/WAI/WCAG21/quickref

### Malaysian Context
- eGUMIS (test it yourself) — egumis.anm.gov.my
- KWSP i-Akaun — kwsp.gov.my
- Unclaimed Moneys Act 1965 — relevant legislation context

### Next.js + Stack Docs
- Next.js App Router — nextjs.org/docs/app
- shadcn/ui — ui.shadcn.com
- Framer Motion — framer.com/motion
- i18next React — react.i18next.com
- Tailwind CSS — tailwindcss.com/docs

### Design Inspiration (study these apps)
- **Wise** — clean multilingual financial UX
- **Grab Financial / GXBank** — Malaysian fintech patterns
- **Maybank MAE** — local reference
- **GovTech Singapore Singpass** — gold standard for government UX
- **CIMB Octo** — modern Malaysian banking app

### Colour Contrast Checker
- coolors.co/contrast-checker
- webaim.org/resources/contrastchecker

---

## Team Split

| Member | Assignment Stage | Prototype Responsibility |
|--------|-----------------|--------------------------|
| Member 1 | Empathize | Onboarding + Home + Search + Results screens |
| Member 2 | Define | Claim Detail + Wizard (all steps) + Success screen |
| Member 3 | Ideate | Notifications + Family Mode + Settings |
| Member 4 | Test | Claim Tracker + Error/Empty states + Usability testing on prototype |
| All | — | Design system (set up together in Week 1 before splitting) |

> Set up the design system tokens TOGETHER before anyone writes a single screen.
> If one person uses different colours or spacing, the whole prototype looks inconsistent.

---

*Last updated: June 2026 | CT120-3-3 UX Design Assignment*