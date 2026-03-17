# Ollvy Website Spec for Claude Code — v2
## ollvy.com · The Compliance OS for Indian Businesses

> **Intent**: Build a world-class landing page that makes Indian founders feel the same trust they feel when they see Razorpay or Urban Company. Every section is grounded in Ollvy's actual product mechanics — nothing fabricated. Trust signals are real, prices are real, features are real.
>
> **This document is the single source of truth. Claude Code should implement exactly what is written here. Every section includes: exact copy, component spec, states (loading / error / empty), mobile behavior, and implementation notes. Do not improvise.**

---

## HOMEPAGE vs SERVICE PAGE — ARCHITECTURE DECISION (v3 RESTRUCTURE)

> **This section overrides previous section placement decisions. Read before building.**

Based on the Atlys country page pattern, the heavy trust content moves OFF the homepage and onto individual service pages. The homepage becomes a discovery + credibility layer. The service page is where conversion actually happens.

### HOMEPAGE — what stays

| Section | Stays | Note |
|---|---|---|
| §1 Nav | ✓ | Unchanged |
| §2 Hero | ✓ | Unchanged |
| §3 Problem Bar | ✓ | Unchanged |
| §4 How It Works | ✓ | Unchanged |
| §5 Service Grid | ✓ | Cards only — click through to service pages |
| §6 Trust Layer (4 cards) | ✓ | Needs visual improvement — see note |
| §6A Success Rate | ✗ → Service pages | Specific to service context |
| §6B Why Businesses Get Notices | ✗ → Service pages | Each service page has its own risk section |
| §6C Incorporation Unlocks | ✗ → Service pages | Lives on /services/pvt-ltd-incorporation |
| §7 Compliance Calendar | ✗ → Pro feature page | Too deep for homepage |
| §8 Penalty Calculator | ✓ | Keep and expand — high-conversion element |
| §9 Professional Assignment | ✓ | Condense to 1 section, not 2 |
| §10 Retainer Model | ✗ → Removed | Retainer detail lives on retainer service pages |
| §11 Ollvy Pro | ✓ CONDENSED | Cut from full comparison table to lean 3-feature card |
| §12 Social Proof stats | ✓ | Keep the stats bar |
| §12 Processing Time Chart | ✗ → Service pages | Service-specific |
| §12A Document Checklist | ✓ | Keep — Atlys has this on homepage too |
| §13 Reviews | ✓ | Keep, condense |
| §14 For Professionals | ✗ → /join page | Homepage is for buyers, not supply |
| §14B Refer a Founder | ✓ feature-flagged | Keep |
| §15 Final CTA | ✓ | Unchanged |
| §15B Accuracy Statement | ✗ → Service pages | Lives at bottom of every service page |
| §16 Footer | ✓ | Unchanged |

### HOMEPAGE — revised section order

```
Nav → Hero → Problem Bar → How It Works → Service Grid →
Trust Layer (4 cards + logos) → Penalty Calculator →
Document Checklist → Pro (condensed) → Reviews →
Refer a Founder → Final CTA → Footer
```

### SERVICE PAGES — see §18 for full spec

Route: `/services/[slug]`
Each service page gets: hero, sticky booking panel, full trust layer, process steps, 
what's included, completion stats, service-specific risks, document checklist, 
FAQ with search, reviews, related services, accuracy statement.

---

### NOTE ON §6 TRUST LAYER — Visual improvement

The 4 trust cards (Image 3) are rendering correctly per spec but look text-heavy. 
The fix is NOT more copy — it's adding a visual anchor to each card:

- Card 1 (Fixed prices): Add a mini fee breakdown replica — 3 rows (Ollvy fee / Govt fee / Total) in a tiny code-block style box inside the card. The price rows ARE the visual.
- Card 2 (GST invoice): Add a tiny mock invoice fragment — "Tax Invoice #OLV-2024-1847 · GSTIN: 07XXXXX · ₹8,999 + GST" in monospace text, styled like a receipt stub.
- Card 3 (Scope of work): The included/excluded list IS already the visual. Make the checkmark green and the minus icon slightly larger.
- Card 4 (Monthly report): Add 3 mini data rows — "GSTR-3B · Filed 18 Mar · ARN: AA1234 ✓" — styled like a compact status list.

This is the Atlys pattern: show the thing, don't just describe it.

---

### NOTE ON §11 PRO — Condensed for homepage

Replace the full comparison table with a 3-card lean section:

```
Section label: OLLVY PRO
H2: Know every deadline before it hits.

3 feature cards:
  Card 1: "Compliance calendar with reminders"
    Body: Every obligation for your specific business, tracked automatically.
    30d / 7d / 1d reminders before each deadline.
    
  Card 2: "Business health score"
    Body: A single number that tells you where your compliance stands.
    Updated after every filing. Benchmarked against your business type.
    
  Card 3: "Priority assignment + 5% discount"
    Body: Pro subscribers get dedicated CA assignment — not the general queue.
    Plus 5% off every service booking, including retainers.

Pricing CTA (centered below cards):
  ₹833/month · billed annually as ₹9,990
  [Start Ollvy Pro]
  Cancel anytime · 14-day money-back guarantee
```

Full comparison table moves to `/pro` standalone page.

---


---

## ① DESIGN DIRECTION — COLOR & TYPOGRAPHY

### On the color question

The user has chosen **Shadcn UI with a black-dominant / Cred-inspired aesthetic**. This is the right call. Dark signals confidence and seriousness for a B2B compliance product.

**One important nuance**: Cred works as pure dark because it's aspirational consumer credit — minimal content density. Compliance has more content: service cards, pricing tables, document lists. For this reason, follow the **Mercury Bank / Linear model**: dark chrome (nav, hero, section separators, backgrounds) with slightly-lifted dark card surfaces for content. Not light mode. Just surface hierarchy within dark.

**Use Shadcn UI's dark theme CSS variables throughout. Do not define a custom color system.**

```css
/* globals.css — apply dark class to <html> */
:root {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
  --radius: 0.75rem;

  /* Ollvy semantic additions on top of Shadcn */
  --ollvy-green: 142 71% 35%;
  --ollvy-green-fg: 142 71% 90%;
  --ollvy-amber: 28 80% 43%;
  --ollvy-amber-fg: 28 80% 90%;
  --ollvy-pro-gold: 43 59% 38%;
  --ollvy-pro-gold-fg: 43 59% 90%;
  --ollvy-red: 0 72% 45%;
  --ollvy-red-fg: 0 72% 90%;
}
```

Set `<html className="dark">` in `layout.tsx`. Shadcn components will inherit dark theme automatically.

**Do NOT use**:
- `bg-white`, `bg-gray-50`, `bg-slate-100` — breaks dark theme
- `text-black`, `text-gray-900` — use `text-foreground`
- Navy `#1E3A5F` — that was the old spec
- Cream `#FAFAF7` — that was the old spec
- Any hex color defined outside CSS variables

### Typography

```
Display (H1 only):
  Font: Fraunces (Google Fonts, weight 700, subsets: latin)
  Load in layout.tsx via next/font/google
  Size: 64px desktop / 40px mobile
  Color: hsl(var(--foreground))

Section Headings (H2):
  Font: Inter (system-ui fallback), weight 600
  Size: 32px desktop / 24px mobile

Sub-headings (H3):
  Font: Inter, weight 600
  Size: 20px desktop / 18px mobile

Body:
  Font: Inter, weight 400
  Size: 15–16px standard, 13–14px small
  Color: hsl(var(--foreground)) standard, hsl(var(--muted-foreground)) secondary

Monospace (amounts, codes, SLA numbers):
  Font: JetBrains Mono (Google Fonts) or system monospace
  Use for: rupee amounts in calculator, penalty figures, stats numbers
```

### Layout

```
Max content width: 1200px → use max-w-[1200px] mx-auto px-6
Section padding: py-24 desktop, py-16 mobile (use md:py-24)
Card border radius: rounded-xl (from --radius: 0.75rem)
Card border: 1px solid hsl(var(--border))
Card background: hsl(var(--card)) — slightly lifted from page background
Gap between cards: gap-6 desktop, gap-4 mobile
```

---

## ② ATLYS TRUST ELEMENT MAPPING — ALL 13 IMAGES

Every Atlys trust pattern mapped to its Ollvy analogue. Nothing dismissed without a replacement.

| # | Atlys Element | Image | Ollvy Analogue | Section |
|---|---|---|---|---|
| 1 | Country cards with guaranteed visa date | 1 | Service cards with "Done by [date], guaranteed" | §5 |
| 2 | Visa info + guaranteed date on detail page | 2 | Guaranteed date badge on service cards and service detail pages | §5 |
| 3 | Fee breakdown: Govt fee + Atlys fee + Total | 3 | Fee breakdown on service cards: Ollvy fee + Govt fee separately | §5 |
| 4 | Document checklist by employment type | 4 | Document checklist by business type (Pvt Ltd, LLP, Proprietor, etc.) | §12A |
| 5 | Approval rate: 96.3% (Atlys) vs 54% (industry) | 5 | On-time filing rate: Ollvy vs unorganised market | §6A |
| 6 | "Your Canada visa unlocks these destinations" | 6 | "What Pvt Ltd incorporation unlocks" — cascade of required + beneficial services | §6C |
| 7 | Processing time chart (rolling average, by day) | 7 | Average completion time chart — rolling 30-order average | §12 |
| 8 | Visa rejection reasons (icon + title + 1 line) | 8 | Why businesses get GST/MCA notices — 4 common compliance failures | §6B |
| 9 | Reviews: aggregate rating + keyword chips + cards | 9 | Reviews: aggregate rating + keyword chips + 3 testimonial cards | §13 |
| 10 | "How we reviewed this page" + official source links | 10 | "How we ensure accuracy" + links to MCA, GSTN, Income Tax portals | §15B |
| 11 | Event-specific landing (F1 Grand Prix Canada visa) | 11 | Deadline-specific landing pages (ITR season, GSTR-9, Director KYC amnesty) | §NOTE |
| 12 | Refer & earn — UPI cashback per visa country | 12 | Refer a founder — UPI credit per service booked | §14B |
| 13 | "All 7 Emirates with 1 visa" + authority partner logos | 13 | Incorporation unlocks cascade + ICAI/ICSI/Bar Council/GSTN authority logos | §6C, §6 |

---

## SECTIONS — FULL IMPLEMENTATION SPEC

---

### §1 — NAVBAR

**File**: `components/landing/Navbar.tsx`

**Layout**:
```
<header> 
  position: fixed top-0 left-0 right-0 z-50
  height: 64px → shrinks to 52px on scroll (animated)
  background: hsl(var(--background)) + backdrop-filter: blur(12px)
  border-bottom: 1px solid hsl(var(--border)) — only appears after scroll
  transition: all 200ms ease
```

**Scroll behavior** — implement with `useEffect`:
```typescript
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const fn = () => setScrolled(window.scrollY > 8);
  window.addEventListener('scroll', fn, { passive: true });
  return () => window.removeEventListener('scroll', fn);
}, []);
// className={cn("fixed top-0 z-50 w-full transition-all duration-200",
//   scrolled ? "h-[52px] border-b border-border" : "h-16")}
```

**Left**: `<Link href="/">` wrapping Ollvy wordmark SVG. Color: `text-foreground`. Width ~80px. No icon — wordmark only.

**Center** (hidden below `md` breakpoint):
```
<nav className="hidden md:flex items-center gap-8">
  <NavLink href="/#services">Services</NavLink>
  <NavLink href="/#pricing">Pricing</NavLink>
  <NavLink href="/join">For Professionals</NavLink>
</nav>
```

`NavLink` props: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150`.

Active state: if the section that link points to is in viewport, apply `text-foreground font-semibold`. Use `useActiveSection` hook (IntersectionObserver watching `#services`, `#pricing`, `#professionals` section IDs).

**Right**:
- Desktop: `<Button size="sm" className="rounded-full">Get Started — Free</Button>`
- Mobile: hamburger `<Menu size={20} />` button that opens a `<Sheet side="right">` (Shadcn Sheet)

**Mobile Sheet content** (full-height right drawer):
```
<SheetHeader>
  <Ollvy wordmark />
</SheetHeader>

<nav className="flex flex-col gap-1 mt-6">
  <MobileNavLink>Services</MobileNavLink>
  <MobileNavLink>Pricing</MobileNavLink>
  <MobileNavLink>For Professionals</MobileNavLink>
</nav>

<div className="mt-auto pb-8 flex flex-col gap-3">
  <Button className="w-full">Get Started — Free</Button>
  <Button variant="ghost" className="w-full text-sm">
    Already have an account? Sign in
  </Button>
</div>
```

`MobileNavLink`: `text-base font-medium py-3 border-b border-border text-foreground`

---

### §2 — HERO

**File**: `components/landing/Hero.tsx`

**Background**: `hsl(var(--background))`. Min-height: `100svh`. Padding-top: `96px` (offset for fixed nav).

**Layout**: CSS Grid, `grid-cols-1 md:grid-cols-[1fr_auto]`, gap-12. On mobile: text above, cards below.

#### Left Column — Copy

**H1** — Fraunces 700, 64px desktop / 40px mobile, `text-foreground`, max-width 600px, line-height 1.1:
```
Your business compliance,
completely handled.
```
Force line break after "compliance," with `<br className="hidden sm:block" />`.

This headline stays. It is direct, specific, and makes a concrete promise. Do not change it to "Simplify your compliance journey" or anything with the word "journey", "seamless", "streamline", or "leverage".

**Subheadline** — 16px, `text-muted-foreground`, max-width 480px, mt-6, line-height 1.7:
```
A CA files your GST returns. A lawyer handles your 
trademark. A company secretary manages your MCA filings. 
You see it happening in the app. You pay a fixed price. 
That's it.
```

Why this works better than the previous version: it describes what actually happens rather than listing service categories. A founder reading it sees themselves — they're not buying a product category, they're watching something get done.

**CTA row** — mt-8, flex flex-wrap gap-3:
```typescript
<Button size="lg" asChild>
  <a href="/app" data-utm="hero_primary">Start Free</a>
</Button>
<Button variant="ghost" size="lg" onClick={() => scrollToId('services')}>
  See All 32 Services ↓
</Button>
```

**Trust bar** — mt-6, flex flex-wrap gap-x-6 gap-y-2:
```
✓ Fixed prices — no hourly billing
✓ GST-compliant invoices for every order
✓ Cancel or pause anytime
```
Each item: `text-sm text-muted-foreground`. The `✓` is `className="text-[hsl(var(--ollvy-green))]"`.

#### Right Column — Floating Document Cards

Container: `relative w-[340px] h-[420px] hidden md:block shrink-0`

Three `<Card>` components, absolutely positioned:

**Card 1** (top: 0, right: 0, rotate: -2deg, z-index: 1):
```
<Card className="absolute top-0 right-0 w-64 border border-border bg-card p-4
  style={{ transform: 'rotate(-2deg)' }}"
  animate: { y: [0, -6, 0] } transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }

Content:
  <div className="flex justify-between items-start">
    <span className="text-sm font-semibold">GST Registration</span>
    <Badge className="bg-ollvy-green/10 text-green-400 border border-green-400/20 text-xs">
      ✓ Filed
    </Badge>
  </div>
  <p className="text-xs text-muted-foreground mt-2">GSTIN: 07XXXXX1234Z1XX</p>
  <p className="text-xs text-muted-foreground mt-1">19 Mar 2025</p>
```

**Card 2** (top: 120px, left: 0, rotate: +1deg, z-index: 2):
```
Content:
  <span className="text-sm font-semibold">Pvt Ltd Incorporation</span>
  
  Progress stages (5 steps):
  const stages = ['Name Reserved', 'DSC', 'DIN', 'MOA/AOA', 'Certificate'];
  Render as: ● ● ● ○ ○ (filled circles = done, empty = pending)
  Current stage label below: "Stage 3 of 5 · In Progress"
  
  <div className="flex gap-1.5 mt-3">
    {stages.map((s, i) => (
      <div className={cn("h-1.5 flex-1 rounded-full", i < 3 ? "bg-ollvy-green" : "bg-muted")} />
    ))}
  </div>
  <p className="text-xs text-muted-foreground mt-2">Stage 3 of 5 · In Progress</p>
```

**Card 3** (bottom: 0, right: 20px, rotate: -1deg, z-index: 1):
```
Content:
  <div className="flex justify-between">
    <span className="text-sm font-semibold">Compliance Score</span>
    <span className="text-xs text-muted-foreground">On Track ✓</span>
  </div>
  
  SVG circular gauge (simple arc, not a heavy library):
  <svg viewBox="0 0 60 60" width="60" height="60">
    <circle cx="30" cy="30" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
    <circle cx="30" cy="30" r="24" fill="none" 
      stroke="hsl(var(--ollvy-green))" strokeWidth="4"
      strokeDasharray={`${(84/100)*150.8} 150.8`}
      strokeLinecap="round"
      transform="rotate(-90 30 30)" />
    <text x="30" y="34" textAnchor="middle" className="text-xs fill-foreground font-bold">84</text>
  </svg>
  
  <p className="text-xs text-muted-foreground mt-1">3 upcoming deadlines</p>
```

**Animation**: Use CSS `@keyframes float` or framer-motion `animate={{ y: [0, -8, 0] }}` with `transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}` per card. Keep subtle.

**Mobile**: Remove the card container entirely on mobile (`hidden md:block`). Do not show on small screens — clutter.

---

### §3 — PROBLEM BAR

**File**: `components/landing/ProblemBar.tsx`

**Background**: `hsl(var(--card))`. Full-width. `py-16`.

**Layout**: `grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border`

**Each column**: `px-8 py-8 md:py-0`

```typescript
const problems = [
  {
    title: "Missed deadlines",
    arrow: "→ and you only hear about it from a notice",
    lines: [
      "GSTR-3B was due on the 20th.",
      "Your CA missed it. ₹50/day started accruing.",
      "You found out two months later.",
    ]
  },
  {
    title: "No fixed price",
    arrow: "→ the invoice arrives after the work",
    lines: [
      "You asked for a quote. You got a vague range.",
      "The final number was higher. Always.",
      "No scope document. No recourse.",
    ]
  },
  {
    title: "Zero visibility",
    arrow: "→ filed or not filed, you genuinely don't know",
    lines: [
      "You sent the documents over WhatsApp.",
      "CA said it's done. You have no proof.",
      "No invoice. No acknowledgement. Nothing.",
    ]
  },
];
```

Per column render:
```
<p className="text-base font-semibold text-foreground">{title}</p>
<p className="text-xs text-muted-foreground mt-1">{arrow}</p>
<div className="mt-4 space-y-1">
  {lines.map(line => <p className="text-sm text-muted-foreground">{line}</p>)}
</div>
```

**Footer** below grid — `border-t border-border mt-0 pt-8 text-center`:
```
<p className="text-sm text-muted-foreground italic max-w-[560px] mx-auto">
  Every service on Ollvy has a price before you pay, a professional 
  assigned automatically, and a status you can check right now. 
  That's the entire product.
</p>
```

---

### §4 — HOW IT WORKS

**File**: `components/landing/HowItWorks.tsx`

**id="how-it-works"**. **Background**: `hsl(var(--background))`. `py-24`.

**Section label** (centered, `text-xs uppercase tracking-widest text-muted-foreground mb-3`):
```
HOW IT WORKS
```

**H2** (centered): `Three steps to handled compliance`

**Layout**: `grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 relative`

On desktop, add a dashed connecting line between steps:
```typescript
// Absolutely positioned pseudo-element across the top of the step numbers
// CSS only: .step-connector { position: absolute; top: 24px; left: 16.66%; 
//   right: 16.66%; height: 1px; border-top: 1px dashed hsl(var(--border)); }
// Hide on mobile
```

**Each step**:
```typescript
const steps = [
  {
    number: "01",
    title: "Tell us what you run",
    body: "Answer 3 questions: business type, GST status, headcount. We show you the exact services that apply to your situation — with prices. Not ranges. Actual prices.",
  },
  {
    number: "02",
    title: "A professional is assigned",
    body: "A verified CA, lawyer, or company secretary gets matched to your order automatically. Matched by city and service type. You don't pick them. You don't message them on WhatsApp. They show up in the app.",
  },
  {
    number: "03",
    title: "Watch it get done",
    body: "Every stage updates in real time. Documents go in through the app. When it's done, you get a GST-compliant invoice and a completion confirmation. No chasing. No guessing.",
  },
];
```

Per step render:
```
<div className="flex flex-col">
  <span className="font-mono text-5xl font-bold text-muted-foreground/20">{number}</span>
  <h3 className="text-lg font-semibold mt-4 text-foreground">{title}</h3>
  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{body}</p>
</div>
```

**Below steps** (centered, mt-16, `border-t border-border pt-10`):
```
<p className="text-sm text-muted-foreground text-center max-w-[480px] mx-auto">
  From GST registration to company incorporation to monthly filings — 
  one place, one app, one team.
</p>
```

---

### §5 — SERVICE GRID

**File**: `components/landing/ServiceGrid.tsx`

**id="services"**. **Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `SERVICES`

**H2**: `32 services. Every price listed.`

**Subheading** (muted, 16px, max-width 520px, mx-auto, text-center):
```
Pick a service. See the price. Book it. A verified professional 
is assigned the same day. That's the whole process.
```

#### Filter Chips

```typescript
const categories = ['All', 'Registrations', 'Licensing', 'Monthly Compliance', 'Tax Filings', 'Payroll', 'Legal'] as const;
const [active, setActive] = useState<typeof categories[number]>('All');
```

Render as `flex flex-wrap gap-2 justify-center mt-8`:
```typescript
{categories.map(cat => (
  <button
    key={cat}
    onClick={() => setActive(cat)}
    className={cn(
      "px-4 py-1.5 rounded-full text-sm border transition-colors",
      active === cat
        ? "border-foreground bg-foreground text-background"
        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
    )}
    role="tab"
    aria-selected={active === cat}
  >
    {cat}
  </button>
))}
```

On mobile: `overflow-x-auto` wrapper, `flex flex-nowrap`, no wrapping.

#### MVP Cards — Top Row (always visible, ignores filter)

`<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">`

These 4 cards get a `<Badge className="absolute top-3 right-3 text-xs bg-ollvy-pro-gold/10 text-yellow-400 border border-yellow-400/20">Popular</Badge>` badge. Card wrapper needs `relative`.

#### Service Card Component

```typescript
interface ServiceCardProps {
  name: string;
  description: string;
  ollvyFee: number;         // Ollvy's fee in rupees
  govtFee?: number;         // Government fee if applicable, else undefined
  slaDays: number;          // working days
  avgRating?: number;       // undefined if < 10 reviews
  totalRatings?: number;    // raw count
  category: string;
  isPopular?: boolean;
}
```

```typescript
function ServiceCard({ name, description, ollvyFee, govtFee, slaDays, avgRating, totalRatings, isPopular }: ServiceCardProps) {
  const guaranteedDate = getGuaranteedDate(slaDays); // returns "25 Mar" or null
  const showRating = totalRatings !== undefined && totalRatings >= 10 && avgRating !== undefined;
  const totalPrice = ollvyFee + (govtFee ?? 0);

  return (
    <Card className="relative border border-border bg-card hover:-translate-y-0.5 transition-transform cursor-pointer group">
      {isPopular && (
        <Badge className="absolute top-3 right-3 text-xs bg-ollvy-pro-gold/10 text-yellow-400 border border-yellow-400/20">
          Popular
        </Badge>
      )}
      <CardContent className="p-5">
        <h3 className="font-semibold text-foreground pr-16">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>

        {/* Fee breakdown — Atlys Image 3 pattern */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground">Ollvy fee</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              ₹{ollvyFee.toLocaleString('en-IN')}
            </span>
          </div>
          {govtFee !== undefined && govtFee > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">Govt fee (approx)</span>
              <span className="font-mono text-sm text-muted-foreground">
                ₹{govtFee.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {govtFee !== undefined && govtFee > 0 && (
            <div className="flex justify-between items-baseline border-t border-border pt-1 mt-1">
              <span className="text-xs font-medium text-foreground">Total</span>
              <span className="font-mono text-base font-bold text-foreground">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {(govtFee === undefined || govtFee === 0) && (
            <div className="flex justify-between items-baseline border-t border-border pt-1 mt-1">
              <span className="text-xs font-medium text-foreground">Total</span>
              <span className="font-mono text-base font-bold text-foreground">
                ₹{ollvyFee.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Guaranteed date — Atlys Images 1 & 2 pattern */}
        <div className="mt-3">
          {guaranteedDate ? (
            <Badge 
              className="bg-ollvy-green/10 text-green-400 border border-green-400/20 text-xs"
              aria-label={`Guaranteed completed by ${guaranteedDate}`}
            >
              ✓ Done by {guaranteedDate}, guaranteed
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Done in {slaDays} working days</span>
          )}
        </div>

        {/* Rating — only if >= 10 reviews */}
        {showRating && (
          <div className="mt-2 flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground" aria-label={`${avgRating} out of 5 stars, ${totalRatings} reviews`}>
              {avgRating!.toFixed(1)} ({totalRatings} reviews)
            </span>
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full mt-4 justify-between group-hover:text-foreground">
          View Details <ArrowRight size={14} />
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Guaranteed date utility**:
```typescript
import { addBusinessDays, format, isBefore, isWeekend } from 'date-fns';

// Indian public holidays FY 2025-26 — update annually
const HOLIDAYS: string[] = [
  '2025-08-15', '2025-10-02', '2025-10-24', '2025-11-05',
  '2025-11-14', '2025-12-25', '2026-01-26', '2026-03-29',
  '2026-04-02', '2026-04-14',
];

export function getGuaranteedDate(slaDays: number): string | null {
  let date = addBusinessDays(new Date(), slaDays);
  // Skip holidays
  let iterations = 0;
  while (HOLIDAYS.includes(format(date, 'yyyy-MM-dd')) || isWeekend(date)) {
    date = addBusinessDays(date, 1);
    if (++iterations > 20) break; // safety
  }
  if (isBefore(date, new Date())) return null;
  return format(date, 'd MMM'); // "25 Mar"
}
```

**Monthly filing retainers** — show GST cycle due date instead of SLA:
```typescript
export function getNextGstrDueDate(): string {
  const now = new Date();
  const day = now.getDate();
  // GSTR-3B due 20th of following month
  const dueMonth = day <= 15 ? now.getMonth() + 1 : now.getMonth() + 2;
  const dueDate = new Date(now.getFullYear(), dueMonth, 20);
  return format(dueDate, 'd MMM');
}
// Display: "Current cycle due: 20 Apr"
```

**MVP Services Data**:
```typescript
const MVP_SERVICES: ServiceCardProps[] = [
  {
    name: "Private Limited Incorporation",
    description: "Name reservation, DSC, DIN, MOA/AOA, and Certificate of Incorporation. You get the CIN. Govt stamp duty is ₹15,000 on top — shown upfront, not at checkout.",
    ollvyFee: 9999,
    govtFee: 15000,
    slaDays: 15,
    category: "Registrations",
    isPopular: true,
  },
  {
    name: "GST Registration",
    description: "Your GSTIN, applied for and obtained. Mandatory once turnover crosses ₹40L (₹20L for service businesses). No govt fee on top.",
    ollvyFee: 8999,
    govtFee: 0,
    slaDays: 7,
    category: "Registrations",
    isPopular: true,
  },
  {
    name: "GST Monthly Filing",
    description: "GSTR-1 filed by the 11th. GSTR-3B filed by the 20th. Every month. Acknowledgements saved. Monthly report sent. You don't think about it.",
    ollvyFee: 2999, // per month, retainer
    govtFee: 0,
    slaDays: 0, // retainer — use getNextGstrDueDate()
    category: "Monthly Compliance",
    isPopular: true,
    isRetainer: true,
  },
  {
    name: "Business ITR Filing",
    description: "ITR-6 for Pvt Ltd companies, ITR-5 for LLPs and partnerships. Includes P&L review, depreciation, and director remuneration treatment.",
    ollvyFee: 11999,
    govtFee: 0,
    slaDays: 10,
    category: "Tax Filings",
    isPopular: true,
  },
];
```

**Full grid** (below MVP row): loads from `GET /functions/v1/search-services?category={active}`. Show `<Skeleton>` (8 cards) while loading. On error: show `"Service listings unavailable — please refresh."` text only. Do not crash.

**Below grid**: `<Button variant="ghost" className="mx-auto block mt-8">View all 32 services →</Button>`

---

### §6 — TRUST LAYER

**File**: `components/landing/TrustLayer.tsx`

**Background**: `hsl(var(--card))`. `py-24`.

**Section label**: `WHY OLLVY`

**H2**: `What makes Ollvy different from hiring a CA directly`

**4 feature cards** — `grid grid-cols-1 md:grid-cols-2 gap-6 mt-12`:

Each card: `<Card className="border border-border bg-background p-6">` (one step deeper than section).

---

**Card 1 — Fixed prices**

```
Icon: <IndianRupee size={18} strokeWidth={1.5} className="text-muted-foreground" />

<h3 className="font-semibold mt-4">The price you see is what you pay.</h3>

<p className="text-sm text-muted-foreground mt-2 leading-relaxed">
  Ollvy fee and government fee are broken out separately on every service card. 
  You see both before you click anything. No quote-first. No invoice-after. 
  No "it depends on the complexity."
</p>

<div className="mt-4 pt-4 border-t border-border">
  <p className="text-xs text-muted-foreground italic">
    GST Registration is ₹8,999. There's no government fee for that service — 
    so that's the total. We show you that rather than hiding it in a footnote.
  </p>
</div>
```

---

**Card 2 — GST-compliant invoice**

```
Icon: <FileText size={18} strokeWidth={1.5} className="text-muted-foreground" />

<h3 className="font-semibold mt-4">A proper invoice. Every time.</h3>

<p className="text-sm text-muted-foreground mt-2 leading-relaxed">
  Every payment auto-generates a GST-compliant tax invoice with the right 
  CGST/SGST or IGST split for your state. It's in your account permanently — 
  not in an email you'll lose. Your CA will ask for it during ITR season. 
  It'll be there.
</p>

<div className="mt-4 pt-4 border-t border-border">
  <p className="text-xs text-muted-foreground italic">
    Most CA engagements produce no documentation at all. This is table stakes 
    that somehow nobody does.
  </p>
</div>
```

---

**Card 3 — Scope of work (with radical honesty)**

```
Icon: <ClipboardList size={18} strokeWidth={1.5} className="text-muted-foreground" />

<h3 className="font-semibold mt-4">You see the scope before you pay. Including what's excluded.</h3>

<p className="text-sm text-muted-foreground mt-2 leading-relaxed">
  Before checkout, you get an Engagement Letter: what the service covers, 
  and what it doesn't. This is generated automatically and stored in your 
  account. If there's ever a dispute about what was agreed, there's a document.
</p>

<div className="mt-4 pt-4 border-t border-border space-y-1.5">
  <p className="text-xs font-medium text-foreground">GST Monthly Filing retainer — scope preview:</p>
  <div className="flex gap-2 text-xs text-muted-foreground items-start">
    <Check size={10} className="text-ollvy-green mt-0.5 shrink-0" />
    <span>GSTR-1, GSTR-3B, late fee computation, monthly report</span>
  </div>
  <div className="flex gap-2 text-xs text-muted-foreground items-start">
    <Minus size={10} className="mt-0.5 shrink-0" />
    <span>Audit response, demand notices, amendment returns</span>
  </div>
</div>
```

Note: The "NOT included" items use `<Minus>` (not a red X). This is honesty, not failure. The muted grey makes it feel matter-of-fact.

---

**Card 4 — Monthly proof-of-work**

```
Icon: <BarChart2 size={18} strokeWidth={1.5} className="text-muted-foreground" />

<h3 className="font-semibold mt-4">Every month, a report. Not just a payment request.</h3>

<p className="text-sm text-muted-foreground mt-2 leading-relaxed">
  After every billing cycle on a retainer, a Proof-of-Work Report is generated: 
  what was filed, when it was filed, the acknowledgement numbers, any notices 
  received. You know exactly what happened that month.
</p>

<div className="mt-4 pt-4 border-t border-border">
  <p className="text-xs text-muted-foreground italic">
    Most retainer relationships end because the founder eventually asks: 
    "what am I actually paying for?" We send the answer before they ask.
  </p>
</div>
```

---

**Authority Logos Bar** (below the 4 cards)

`<div className="mt-16 border-t border-border pt-10">`

**Label** (`text-xs uppercase tracking-widest text-muted-foreground text-center mb-8`):
```
PROFESSIONALS VERIFIED AGAINST
```

`<div className="flex flex-wrap justify-center items-center gap-6 opacity-60">`:

If logo assets exist: use `<Image>` with `filter: invert(1)` (to make logos visible on dark bg), max-height 28px, `hover:opacity-100 transition-opacity`.

If logo assets don't exist: render as text pills:
```typescript
const bodies = ['ICAI', 'ICSI', 'Bar Council of India', 'MCA21', 'GSTN'];
// Render: <div className="border border-border rounded-md px-3 py-1.5 text-xs font-mono text-muted-foreground uppercase tracking-wider">{body}</div>
```

**Never use placeholder images. Never use fake logos.**

---

### §6A — SUCCESS RATE COMPARISON

**File**: `components/landing/SuccessRate.tsx`

**Inspired by**: Atlys Image 5

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `TRACK RECORD`

**H2**: `Filings that get done on time`

#### Feature flag

```typescript
const SHOW_PERCENTAGE = process.env.NEXT_PUBLIC_SHOW_PERCENTAGE === 'true';
```

If `false`: skip the two-panel comparison and show the soft-claim fallback instead (see below).

#### Two-panel comparison (if SHOW_PERCENTAGE = true)

`<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">`

**Left panel** — `<Card className="border border-border bg-card p-8">`:
```
<span className="text-xs uppercase tracking-widest text-muted-foreground">ollvy</span>
<div className="mt-2 space-y-0.5">
  <p className="text-xs text-muted-foreground">Years: 2023–2025</p>
  <p className="text-xs text-muted-foreground">Orders: {orders_completed_total}+</p>
</div>

{/* Animated fill bar — triggered by IntersectionObserver */}
<div className="mt-6 h-3 w-full bg-muted rounded-full overflow-hidden">
  <div 
    className="h-full rounded-full bg-[hsl(var(--ollvy-green))] transition-all duration-1200 ease-out"
    style={{ width: isVisible ? '98.4%' : '0%' }}
  />
</div>

<div className="mt-4 font-mono text-5xl font-bold">98.4%</div>
<p className="text-sm text-muted-foreground mt-1">On-Time Filing Rate</p>
```

**Right panel** — same structure, amber fill, shows `61%`, source: `CAG Report 2023`:
```
bar width: 61%
color: hsl(var(--ollvy-amber))
number: text-muted-foreground (not white — de-emphasised)
```

**Source footnote** (below panels, `text-xs text-muted-foreground italic mt-4`):
```
"Industry average sourced from CAG Report on GST compliance rates, 2023. 
Ollvy rate based on {orders_completed_total} orders, 2023–2025."
```

**IntersectionObserver for animation**:
```typescript
const ref = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
  }, { threshold: 0.3 });
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```

#### Soft-claim fallback (if SHOW_PERCENTAGE = false or insufficient data)

```
<Card className="border border-border bg-card p-8 text-center max-w-[600px] mx-auto mt-12">
  <p className="text-xl font-semibold text-foreground">
    Zero missed deadlines for retainer clients in the last 12 months.
  </p>
  <p className="text-sm text-muted-foreground mt-2">
    {orders_completed_total}+ services completed across India.
    Not a claim — a count from the database, loaded in real time.
  </p>
</Card>
```

#### Assessment CTA card (always shown, below both variants)

```typescript
<Card className="mt-6 border border-[hsl(var(--ollvy-amber))]/20 bg-[hsl(var(--ollvy-amber))]/5 p-6">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <h3 className="font-semibold">See where your business stands</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Takes 2 minutes. Tell us your business type and registrations. 
        We show you what's due, what's overdue, and what you're at risk of missing.
      </p>
    </div>
    <div className="flex items-center gap-6 shrink-0">
      <Button>Start Free Assessment</Button>
      <div className="text-center hidden sm:block">
        <div className="text-2xl font-bold font-mono text-[hsl(var(--ollvy-green))]">100%</div>
        <div className="text-xs text-muted-foreground">Accuracy</div>
      </div>
    </div>
  </div>
</Card>
```

---

### §6B — WHY BUSINESSES GET NOTICES

**File**: `components/landing/ComplianceRisks.tsx`

**Inspired by**: Atlys Image 8

**Background**: `hsl(var(--card))`. `py-24`.

**Section label**: `COMPLIANCE RISK`

**H2**: `The most common reasons businesses get GST notices`

**Subheading** (muted, 16px, max-width 560px, mx-auto, text-center):
```
Most compliance failures are predictable and preventable.
```

**4-item risk list**:
`<div className="mt-12 max-w-[720px] mx-auto divide-y divide-border">`

```typescript
const risks = [
  {
    icon: <Clock />,
    title: "Late filing",
    body: "GSTR-3B was due on the 20th. Your CA filed on the 22nd. That's ₹100 in late fees plus 18% annual interest on whatever tax was due — and it starts accruing from day 21, not from when you find out.",
    color: "text-[hsl(var(--ollvy-amber))]",
  },
  {
    icon: <GitBranch />,
    title: "GSTR-1 and GSTR-3B don't match",
    body: "If the outward supply figures in your GSTR-1 don't match what you declared in GSTR-3B, the GSTN system flags it automatically under Section 61. You get a notice. You then need a CA to respond to it — which is not included in most retainers.",
    color: "text-[hsl(var(--ollvy-amber))]",
  },
  {
    icon: <AlertTriangle />,
    title: "Claiming ITC for a vendor who hasn't filed",
    body: "You paid the vendor. You have the invoice. You claimed the ITC. But if that vendor hasn't filed their GSTR-1, your ITC claim gets blocked and you get a notice — even though you did nothing wrong. You're liable for someone else's non-compliance.",
    color: "text-[hsl(var(--ollvy-amber))]",
  },
  {
    icon: <Building2 />,
    title: "Director KYC missed",
    body: "MCA requires DIR-3 KYC every year before Sep 30. If you miss it, your DIN gets deactivated, you can't sign on any MCA document, and the penalty is ₹5,000/day until it's filed. Most founders don't know this deadline exists until they've already missed it.",
    color: "text-[hsl(var(--ollvy-amber))]",
  },
];
```

Per item render:
```typescript
<div className="flex items-start gap-5 py-6">
  <div className={cn("mt-0.5 shrink-0", risk.color)}>
    {React.cloneElement(risk.icon, { size: 18, strokeWidth: 1.5 })}
  </div>
  <div>
    <h3 className="font-semibold text-foreground text-base">{risk.title}</h3>
    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{risk.body}</p>
  </div>
</div>
```

**Below list** (centered, mt-8):
```typescript
<div className="text-center mt-10">
  <p className="text-sm text-muted-foreground">
    Ollvy's compliance calendar tracks all these deadlines automatically — 
    for your specific business type and registrations.
  </p>
  <Button variant="ghost" size="sm" className="mt-3"
    onClick={() => document.getElementById('compliance-calendar')?.scrollIntoView({ behavior: 'smooth' })}>
    See the compliance calendar ↓
  </Button>
</div>
```

---

### §6C — WHAT INCORPORATION UNLOCKS

**File**: `components/landing/IncorporationUnlocks.tsx`

**Inspired by**: Atlys Images 6 and 13

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `SERVICE UNLOCKS`

**H2**: `What Pvt Ltd registration unlocks for your business`

**Subheading** (muted):
```
Incorporating is step one. Here are the compliance obligations 
and opportunities that open up once you're registered.
```

**Entity toggle** — Shadcn `<Tabs defaultValue="pvt_ltd">`:
```
[Pvt Ltd]  [LLP]  [GST Registration]
```

#### For Pvt Ltd (defaultValue)

`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">`

```typescript
const pvtLtdUnlocks = [
  { name: "GST Registration", explanation: "Mandatory once turnover crosses ₹40L (₹20L for services)", price: "₹8,999", type: "required" },
  { name: "MCA Annual Filing", explanation: "AOC-4 and MGT-7 due annually. Non-filing: ₹100/day penalty", price: "₹6,999/year", type: "required" },
  { name: "Director KYC (DIR-3)", explanation: "Annual filing for every director. Due Sep 30 each year", price: "₹1,499/director", type: "required" },
  { name: "Business ITR (ITR-6)", explanation: "Due Oct 31 annually for companies. Form ITR-6", price: "₹11,999", type: "required" },
  { name: "Trademark Registration", explanation: "Protect your brand name under the registered entity", price: "₹7,999", type: "beneficial" },
  { name: "MSME / Udyam Registration", explanation: "Unlocks government tenders, priority credit, lower bank rates", price: "₹2,999", type: "beneficial" },
];
```

Per card:
```typescript
<Card className="border border-border bg-card p-5 relative">
  <Badge className={cn(
    "absolute top-3 right-3 text-xs",
    unlock.type === 'required'
      ? "bg-[hsl(var(--ollvy-red))]/10 text-red-400 border border-red-400/20"
      : "border-border text-muted-foreground"
  )}>
    {unlock.type === 'required' ? 'Required' : 'Beneficial'}
  </Badge>
  <h3 className="font-semibold text-sm pr-20">{unlock.name}</h3>
  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{unlock.explanation}</p>
  <p className="font-mono text-sm font-bold text-foreground mt-3">{unlock.price}</p>
</Card>
```

**Below cards** (centered, mt-8):
```
<p className="text-sm text-muted-foreground text-center">
  Ollvy tracks all required filings automatically on your compliance 
  calendar after incorporation.
</p>
<div className="flex justify-center mt-4">
  <Button>Start with Incorporation — ₹24,999</Button>
</div>
```

#### For LLP (when LLP tab selected)

```typescript
const llpUnlocks = [
  { name: "LLP Annual Return (Form 11)", explanation: "Due May 30 every year. ₹100/day penalty", price: "₹4,999", type: "required" },
  { name: "LLP Statement of Accounts (Form 8)", explanation: "Due Oct 30. Financial statements filed with MCA", price: "₹3,999", type: "required" },
  { name: "Partner KYC", explanation: "Annual KYC for all partners", price: "₹999/partner", type: "required" },
  { name: "LLP ITR (ITR-5)", explanation: "Annual income tax return for LLPs", price: "₹7,999", type: "required" },
  { name: "GST Registration", explanation: "Mandatory above threshold or for inter-state supply", price: "₹8,999", type: "beneficial" },
];
```

#### For GST Registration (when GST tab selected)

```typescript
const gstUnlocks = [
  { name: "GSTR-1 (Monthly)", explanation: "Outward supply return. Due 11th of every month", price: "Included in retainer", type: "required" },
  { name: "GSTR-3B (Monthly)", explanation: "Net tax payment return. Due 20th of every month", price: "Included in retainer", type: "required" },
  { name: "GSTR-9 (Annual)", explanation: "Annual return reconciliation. Due Dec 31", price: "₹4,999", type: "required" },
  { name: "GSTR-2B Reconciliation", explanation: "Match ITC claimed vs available. Critical to avoid notices", price: "Included in retainer", type: "required" },
  { name: "E-invoicing Setup", explanation: "Mandatory above ₹5Cr turnover. Ollvy sets it up", price: "₹3,999", type: "beneficial" },
];
```

---

### §7 — COMPLIANCE CALENDAR PREVIEW

**File**: `components/landing/ComplianceCalendar.tsx`

**id="compliance-calendar"**. **Background**: `hsl(var(--card))`. `py-24`.

**Layout**: `grid grid-cols-1 md:grid-cols-2 gap-12 items-center`

#### Left — Copy

**Section label**: `PRO FEATURE`

**H2**: `Your compliance deadlines, tracked automatically.`

**Body** (15px muted, line-height 1.7, mt-4, max-width 440px):
```
GST returns. TDS deposits. MCA filings. Director KYC. 
PF and ESIC. These have different due dates, different 
penalties, and most founders are tracking zero of them.

Ollvy Pro tracks all of them for your specific business. 
You get a reminder 30 days out, 7 days out, and the 
day before. Not a generic calendar — your obligations.
```

**Tier comparison** (mt-6, border-t border-border pt-6, space-y-2):
```typescript
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <span className="font-medium text-foreground">Free:</span>
  See all your compliance obligations. No reminders.
</div>
<div className="flex items-center gap-2 text-sm">
  <Badge className="bg-ollvy-pro-gold/10 text-yellow-400 border border-yellow-400/20 text-xs">Pro</Badge>
  <span className="text-muted-foreground">Reminders at 30d / 7d / 1d · Health score · One-tap booking · ₹999/month</span>
</div>
```

**CTA** (mt-8): `<Button variant="outline">Upgrade to Pro</Button>`

#### Right — Calendar Card

`<Card className="border border-border bg-background p-6">`

**Header row**: `flex justify-between items-center mb-5`
- Left: `"Compliance Calendar"` 14px weight 600
- Right: `"April 2025"` 14px muted

**Obligation rows** (divide-y divide-border/50):

```typescript
const obligations = [
  {
    name: "GSTR-3B",
    status: "due_soon",
    label: "Due in 7 days — Apr 20",
    badgeText: "Due Soon",
    leftBorderColor: "border-l-[hsl(var(--ollvy-amber))]",
  },
  {
    name: "TDS Deposit",
    status: "filed",
    label: "Paid Mar 7",
    badgeText: "Filed",
    leftBorderColor: "border-l-[hsl(var(--ollvy-green))]",
  },
  {
    name: "Director KYC",
    status: "upcoming",
    label: "Due Sep 30 · 5 months away",
    badgeText: "Upcoming",
    leftBorderColor: "border-l-transparent",
  },
  {
    name: "Business ITR",
    status: "upcoming",
    label: "Due Oct 31 · 6 months away",
    badgeText: "Upcoming",
    leftBorderColor: "border-l-transparent",
    isProLocked: true,
  },
];
```

Per row:
```typescript
<div className={cn(
  "flex items-center justify-between py-3 pl-3 border-l-2",
  obligation.leftBorderColor
)}>
  <div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{obligation.name}</span>
      {obligation.isProLocked && <Lock size={10} className="text-muted-foreground" />}
    </div>
    <p className="text-xs text-muted-foreground mt-0.5">{obligation.label}</p>
  </div>
  <Badge className={cn("text-xs", badgeStyle(obligation.status))}>
    {obligation.badgeText}
  </Badge>
</div>
```

`badgeStyle` helper:
```typescript
function badgeStyle(status: string) {
  if (status === 'due_soon') return 'bg-ollvy-amber/10 text-amber-400 border border-amber-400/20';
  if (status === 'filed') return 'bg-ollvy-green/10 text-green-400 border border-green-400/20';
  return 'border-border text-muted-foreground';
}
```

**Health score block** (below the obligation rows, mt-4 border-t border-border pt-4):
```typescript
<div className="flex items-center gap-4">
  <div>
    <span className="text-3xl font-bold font-mono">84</span>
    <span className="text-lg text-muted-foreground">/100</span>
    <p className="text-xs text-muted-foreground mt-0.5">Compliance Score</p>
  </div>
  <div className="flex-1">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-medium text-[hsl(var(--ollvy-green))]">On Track ✓</span>
      <span className="text-muted-foreground">3 due this month</span>
    </div>
    <div className="h-2 w-full bg-muted rounded-full">
      <div className="h-2 rounded-full bg-[hsl(var(--ollvy-green))]" style={{ width: '84%' }} />
    </div>
  </div>
</div>
```

---

### §8 — PENALTY CALCULATOR

**File**: `components/landing/PenaltyCalculator.tsx`

**Background**: `hsl(var(--background))`. `py-24`.

**This is the highest-conversion element. Build it exactly as specified.**

**Section label**: `PENALTY CALCULATOR`

**H2**: `The actual cost of missing a deadline.`

**Subheading** (muted):
```
Not "you could face penalties." Specific amounts, 
based on your business type. Take 10 seconds.
```

#### Inputs Card

`<Card className="border border-border bg-card p-8 mt-12 max-w-[640px] mx-auto">`

**Input 1 — Business type** (Shadcn `<Select>`):
```typescript
<div className="space-y-1.5">
  <Label htmlFor="biz-type" className="text-sm font-medium">Business type</Label>
  <Select value={businessType} onValueChange={setBusinessType}>
    <SelectTrigger id="biz-type">
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
      <SelectItem value="llp">LLP</SelectItem>
      <SelectItem value="partnership">Partnership Firm</SelectItem>
      <SelectItem value="sole_proprietor">Sole Proprietor / Individual</SelectItem>
      <SelectItem value="not_registered">Not yet registered</SelectItem>
    </SelectContent>
  </Select>
</div>
```

**Input 2 — GST registered** (Shadcn `<Switch>`):
```typescript
<div className="flex items-center justify-between">
  <div>
    <Label className="text-sm font-medium">GST registered</Label>
    <p className="text-xs text-muted-foreground mt-0.5">
      Mandatory above ₹40L turnover (₹20L for services)
    </p>
  </div>
  <Switch checked={gstRegistered} onCheckedChange={setGstRegistered} />
</div>
```

**Input 3 — Employees** (same pattern):
```
Label: Have employees on payroll
Sub: PF mandatory above 20 employees, ESIC above 10
```

Default states: `businessType = 'pvt_ltd'`, `gstRegistered = true`, `hasEmployees = false`.

**Calculate button** — `<Button className="w-full mt-6" onClick={calculate}>Show My Risk</Button>`

Do NOT auto-calculate on input change. Require button click. This creates a small commitment moment.

#### Penalty Output

Animated in with:
```typescript
// Wrap output in:
<div className={cn("max-w-[640px] mx-auto mt-4 transition-all duration-300",
  showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
)}>
```

**Penalty table** (static, client-side):
```typescript
interface Penalty {
  key: string;
  label: string;
  amount: string;
  perPeriod: string;
  explanation: string;
  condition: (inputs: CalculatorInputs) => boolean;
}

const PENALTY_TABLE: Penalty[] = [
  {
    key: 'gst_late_filing',
    label: 'Late GST Return (GSTR-3B / GSTR-1)',
    amount: '₹50/day (min ₹20,000)',
    perPeriod: 'per return + 18% p.a. interest',
    explanation: 'Accrues from day 1 after due date. No grace period. Minimum ₹20,000 per return even for one-day delays.',
    condition: (i) => i.gstRegistered,
  },
  {
    key: 'mca_annual',
    label: 'MCA Annual Filing Penalty',
    amount: '₹100/day',
    perPeriod: 'up to ₹1,00,000',
    explanation: 'AOC-4 due within 30 days of AGM, MGT-7 within 60 days. Both attract separate penalties.',
    condition: (i) => ['pvt_ltd', 'llp'].includes(i.businessType),
  },
  {
    key: 'tds',
    label: 'TDS Non-Compliance',
    amount: '1.5% p.m. interest',
    perPeriod: '+ 40% expense disallowance',
    explanation: '1.5% monthly interest on unpaid TDS. Disallowance means you lose the expense deduction entirely — not just the TDS.',
    condition: (i) => i.hasEmployees || ['pvt_ltd', 'llp', 'partnership'].includes(i.businessType),
  },
  {
    key: 'pf_esic',
    label: 'PF / ESIC Payment Default',
    amount: '12% p.a. interest',
    perPeriod: '+ ₹5,000 per default event',
    explanation: '12% annual interest on delayed contributions. ₹5,000 minimum penalty per individual default event under EPFO rules.',
    condition: (i) => i.hasEmployees,
  },
  {
    key: 'director_kyc',
    label: 'Director KYC (DIR-3 KYC) Lapse',
    amount: '₹5,000/day',
    perPeriod: 'until filed',
    explanation: 'DIN deactivated. Blocks all MCA filings. ₹5,000/day penalty until DIR-3 KYC is filed. Also blocks signing on statutory documents.',
    condition: (i) => ['pvt_ltd', 'llp'].includes(i.businessType),
  },
  {
    key: 'no_gst',
    label: 'Operating Without GST Registration',
    amount: '₹25,000 penalty',
    perPeriod: '+ 100% of tax liability',
    explanation: 'If turnover exceeds the threshold, operating without GST registration: ₹25,000 + penalty equal to your entire unpaid tax.',
    condition: (i) => !i.gstRegistered && i.businessType !== 'not_registered',
  },
];

function getPenalties(inputs: CalculatorInputs): Penalty[] {
  return PENALTY_TABLE.filter(p => p.condition(inputs));
}
```

Per penalty card:
```typescript
<Card className="border border-[hsl(var(--ollvy-red))]/20 bg-[hsl(var(--ollvy-red))]/5 p-4">
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <AlertCircle size={13} className="text-red-400 shrink-0" />
        <span className="font-semibold text-sm text-foreground">{penalty.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{penalty.explanation}</p>
    </div>
    <div className="text-right shrink-0">
      <div className="font-mono font-bold text-red-400 text-sm">{penalty.amount}</div>
      <div className="text-xs text-muted-foreground">{penalty.perPeriod}</div>
    </div>
  </div>
</Card>
```

**Special case — `not_registered` selected**: Don't show penalty cards. Show:
```typescript
<Card className="border border-border bg-card p-6 text-center">
  <p className="font-semibold">No penalties yet — but the clock starts when you register.</p>
  <p className="text-sm text-muted-foreground mt-2">
    The moment you incorporate or get a GSTIN, these obligations begin. 
    There's no grace period for new registrations. Getting set up right 
    from day one means your first month isn't already behind.
  </p>
  <Button className="mt-4">Incorporate correctly from day one — ₹24,999</Button>
</Card>
```

**CTA below penalty cards** (always shown when penalties are showing):
```typescript
<Card className="border border-border bg-card p-6 text-center mt-4">
  <p className="text-sm text-muted-foreground">
    Ollvy Pro is <strong className="text-foreground font-mono">₹9,990/year</strong>.
  </p>
  <p className="text-sm text-muted-foreground mt-1">
    One missed GSTR-3B filing — minimum ₹20,000 in late fees. 
    One Director KYC lapse for 30 days — ₹1,50,000. 
    The maths is not subtle.
  </p>
  <Button className="mt-4" size="sm">Start with Ollvy Pro — ₹999/month</Button>
</Card>
```

**Accessibility**: 
- All inputs labelled
- Output section: `role="status" aria-live="polite"` so screen readers announce new results
- Button has `aria-controls="penalty-output"`

---

### §9 — PROFESSIONAL ASSIGNMENT

**File**: `components/landing/ProfessionalAssignment.tsx`

**Background**: `hsl(var(--card))`. `py-24`.

**Section label**: `HOW IT WORKS`

**H2**: `Handled by verified professionals. You never have to find one.`

**Layout**: `grid grid-cols-1 md:grid-cols-2 gap-12 mt-12`

#### Left — Explanation

```
<h3 className="text-lg font-semibold">You book Ollvy. Not a CA.</h3>

<p className="text-sm text-muted-foreground mt-3 leading-relaxed">
  Every order gets matched to a verified CA, lawyer, or company secretary 
  automatically. Matched by city, service type, and current workload. 
  You don't get to pick — and that's the point.
</p>

<p className="text-sm text-muted-foreground mt-3 leading-relaxed">
  The professional works inside the app. You see their first name. 
  That's the extent of the relationship. If they miss an SLA, 
  we reassign and fix it. Not you.
</p>

<p className="text-sm text-muted-foreground mt-3 leading-relaxed">
  This matters because: when the professional is directly accountable 
  to you, they also have leverage over you. Every Indian founder has 
  experienced a CA who goes quiet before a deadline. On Ollvy, 
  Ollvy is accountable — not the individual.
</p>

{/* Pull quote */}
<blockquote className="mt-8 pl-4 border-l-2 border-[hsl(var(--ollvy-green))]">
  <p className="text-sm text-muted-foreground italic">
    "You book Ollvy. If anything goes wrong, Ollvy fixes it. 
    The CA is invisible infrastructure."
  </p>
</blockquote>
```

#### Right — Verification Checklist

`<Card className="border border-border bg-background p-6">`

**Header**: `text-xs uppercase tracking-widest text-muted-foreground mb-5` → `HOW PROFESSIONALS ARE VERIFIED`

```typescript
const verifications = [
  "ICAI membership number confirmed for all CAs",
  "Bar Council enrollment number confirmed for all lawyers",
  "ICSI certificate number confirmed for Company Secretaries",
  "ID proof and practice certificate reviewed before first order",
  "5-strike SLA enforcement — automatic suspension on the 5th breach",
  "All disputes mediated by Ollvy. The professional is not your problem.",
];

{verifications.map(item => (
  <li className="flex items-start gap-3 text-sm text-foreground">
    <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
    {item}
  </li>
))}
```

---

### §10 — RETAINER MODEL

**File**: `components/landing/RetainerModel.tsx`

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `MONTHLY RETAINERS`

**H2**: `Monthly obligations. Handled monthly.`

**Body paragraph** (muted, 15px, max-width 600px, mx-auto, text-center):
```
GST filings don't file themselves. TDS doesn't deposit itself. 
Payroll doesn't process itself. These happen every month whether 
or not you're thinking about them.

A retainer on Ollvy means a specialist is assigned to your 
account. They handle it each cycle. You get a report when 
it's done. Fixed price. No negotiation every month.
```

**3 retainer cards** — `grid grid-cols-1 md:grid-cols-3 gap-6 mt-12`:

Each card: `<Card className="border border-border bg-card p-6">`

```typescript
interface RetainerCard {
  name: string;
  price: string;
  capacity: string;
  included: string[];
  excluded: string[];
}

const retainers: RetainerCard[] = [
  {
    name: "GST Monthly Filing",
    price: "From ₹2,999/month",
    capacity: "Up to ₹50L annual turnover",
    included: [
      "GSTR-1 (outward supply return)",
      "GSTR-3B (net tax payment)",
      "Late fee computation and reporting",
      "Monthly compliance report",
    ],
    excluded: [
      "Audit response or scrutiny notices",
      "Demand notice replies",
      "Amendment returns (GSTR-1A)",
      "ITC mismatches with GSTR-2B",
    ],
  },
  {
    name: "Payroll Management",
    price: "From ₹5,999/month",
    capacity: "Up to 10 employees",
    included: [
      "Monthly salary processing",
      "PF and ESIC computation",
      "Payslip generation",
      "Challan preparation and tracking",
    ],
    excluded: [
      "HR policy drafting",
      "Termination or relieving letters",
      "Full-and-final settlement disputes",
      "New joiner onboarding paperwork",
    ],
  },
  {
    name: "TDS Monthly Compliance",
    price: "₹3,999/month",
    capacity: "Standard deductee count",
    included: [
      "Monthly TDS challan filing",
      "Form 26Q and 24Q quarterly returns",
      "TDS deposit deadline tracking",
    ],
    excluded: [
      "TDS notice replies",
      "Demand resolution or rectification",
      "Lower TDS certificate applications",
    ],
  },
];
```

Per card render:
```typescript
<Card className="border border-border bg-card p-6">
  <h3 className="font-semibold text-base">{retainer.name}</h3>
  <p className="font-mono text-xl font-bold text-foreground mt-1">{retainer.price}</p>
  <p className="text-xs text-muted-foreground mt-0.5">{retainer.capacity}</p>

  <div className="mt-5">
    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">INCLUDED</p>
    <ul className="space-y-1.5">
      {retainer.included.map(item => (
        <li className="flex items-start gap-2 text-sm">
          <Check size={11} className="text-[hsl(var(--ollvy-green))] mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>

  <div className="mt-4">
    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">NOT INCLUDED</p>
    <ul className="space-y-1.5">
      {retainer.excluded.map(item => (
        <li className="flex items-start gap-2 text-sm text-muted-foreground">
          <Minus size={11} className="mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>

  <Button variant="outline" className="w-full mt-6">Book Retainer</Button>
</Card>
```

**Below cards** (centered):
```
<Button variant="ghost" className="mx-auto block mt-8">See all retainer services →</Button>
```

---

### §11 — OLLVY PRO PRICING

**File**: `components/landing/ProPricing.tsx`

**id="pricing"**. **Background**: `hsl(var(--card))`. `py-24`.

**Section label**: `OLLVY PRO`

**H2**: `₹833/month. Know everything that's due before it's late.`

**Billing toggle** (centered, mt-6):

```typescript
const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

<Tabs value={billing} onValueChange={(v) => setBilling(v as 'monthly' | 'annual')} className="w-fit mx-auto">
  <TabsList>
    <TabsTrigger value="monthly">Monthly</TabsTrigger>
    <TabsTrigger value="annual">
      Annual
      <Badge className="ml-2 bg-ollvy-pro-gold/10 text-yellow-400 border border-yellow-400/20 text-xs">
        Save ₹1,998
      </Badge>
    </TabsTrigger>
  </TabsList>
</Tabs>
```

**Comparison table** (`<Table>` from Shadcn — import from `@/components/ui/table`):

```typescript
const features = [
  { label: "Browse all 32 services", free: true, pro: true },
  { label: "One-time service bookings", free: "Standard", pro: "5% discount" },
  { label: "Monthly retainer services", free: "Standard", pro: "First month free" },
  { label: "Compliance calendar", free: "View only", pro: "Full + reminders + book" },
  { label: "Deadline reminders", free: false, pro: "30d / 7d / 1d before" },
  { label: "Business health score", free: false, pro: true },
  { label: "My Business (invoice vault)", free: false, pro: true },
  { label: "Assignment priority", free: "Standard queue", pro: "Reserved capacity" },
  { label: "Monthly retainer reports", free: true, pro: true },
];
```

```typescript
// Table rendering:
<Table className="mt-10">
  <TableHeader>
    <TableRow>
      <TableHead className="w-[60%]">Feature</TableHead>
      <TableHead className="text-center">Free</TableHead>
      <TableHead className="text-center bg-[hsl(var(--ollvy-pro-gold))]/5 rounded-t-lg">Pro</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {features.map(f => (
      <TableRow key={f.label}>
        <TableCell className="text-sm">{f.label}</TableCell>
        <TableCell className="text-center">{renderCell(f.free)}</TableCell>
        <TableCell className="text-center bg-[hsl(var(--ollvy-pro-gold))]/5">{renderCell(f.pro)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

function renderCell(value: boolean | string) {
  if (value === true) return <Check size={14} className="text-[hsl(var(--ollvy-green))] mx-auto" />;
  if (value === false) return <X size={14} className="text-muted-foreground/30 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}
```

**Pricing CTA block** (centered, mt-10):

```typescript
{billing === 'annual' ? (
  <div className="text-center">
    <Button size="lg">Start Annual — ₹9,990/year</Button>
    <p className="text-sm text-muted-foreground mt-2">
      That's ₹833/month. You save ₹1,998 versus monthly.
    </p>
  </div>
) : (
  <div className="text-center">
    <Button size="lg">Start Monthly — ₹999/month</Button>
    <p className="text-sm text-muted-foreground mt-2">
      Switch to annual anytime and save ₹1,998.
    </p>
  </div>
)}
```

**Trust lines** (mt-6, flex flex-col items-center gap-2):
```
✓ 14-day money-back guarantee — if you don't find it useful, full refund
✓ Cancel anytime. No lock-in. No "please speak to retention."
✓ Active immediately. No setup call. No onboarding email chain.
```

---

### §12 — SOCIAL PROOF + PROCESSING TIME

**File**: `components/landing/SocialProof.tsx`

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `BY THE NUMBERS`

#### Part A — Platform Stats

```typescript
// SWR fetch — unauthenticated
const { data: stats, error } = useSWR('/functions/v1/get-public-profile', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 3_600_000, // 1 hour
});

// Fields used: stats.orders_completed_total, stats.professionals_count, stats.cities_served
```

`<div className="grid grid-cols-3 gap-8 text-center max-w-[720px] mx-auto">`

Per stat:
```typescript
function StatBlock({ loading, value, suffix, label }: ...) {
  return (
    <div>
      {loading
        ? <Skeleton className="h-14 w-28 mx-auto" />
        : value != null && value > 0
          ? <div className="text-5xl font-bold font-mono text-foreground">{value.toLocaleString('en-IN')}{suffix}</div>
          : null  // hide if 0 or null
      }
      {!loading && value != null && value > 0 && (
        <p className="text-sm text-muted-foreground mt-2">{label}</p>
      )}
    </div>
  );
}
```

**Error handling**: If the fetch throws or `stats` is null, hide the entire Part A. Do not show error state, do not show zeros. Graceful disappearance.

#### Part B — Processing Time Chart

**Below Part A**, `mt-16`. Feature-flagged: only render if `/functions/v1/get-completion-stats` endpoint exists.

Check for endpoint availability:
```typescript
const { data: completionStats } = useSWR('/functions/v1/get-completion-stats', fetcher, {
  onError: () => { /* silently fail */ },
});
```

If `completionStats` null or error → show **fallback** (see below).
If data available → render Chart.js line chart:

```typescript
<div className="max-w-[800px] mx-auto">
  <h3 className="text-lg font-semibold">Average completion time</h3>
  <p className="text-sm text-muted-foreground mt-1">
    Rolling average across the last 30 completed orders.
  </p>

  <Tabs defaultValue="filing" className="mt-6">
    <TabsList>
      <TabsTrigger value="filing">Filing Services</TabsTrigger>
      <TabsTrigger value="registration">Registrations</TabsTrigger>
    </TabsList>

    <TabsContent value="filing">
      <div className="flex gap-6 mt-4">
        {/* Left annotation */}
        <div className="w-48 shrink-0">
          <p className="text-sm font-medium">What is this?</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Average time from order placement to professional delivery confirmation.
          </p>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Current average</p>
            <p className="text-2xl font-bold font-mono text-[hsl(var(--ollvy-green))]">
              {completionStats?.filing?.avgDays} Days {completionStats?.filing?.avgHours} Hrs
            </p>
          </div>
        </div>
        {/* Chart */}
        <div className="flex-1 h-48">
          <Line
            data={buildChartData(completionStats?.filing?.series)}
            options={chartOptions}
          />
        </div>
      </div>
    </TabsContent>

    {/* Registration tab: same structure, different data */}
  </Tabs>
</div>
```

Chart.js options:
```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'hsl(var(--border))' }, ticks: { color: 'hsl(var(--muted-foreground))' } },
    y: { grid: { color: 'hsl(var(--border))' }, ticks: { color: 'hsl(var(--muted-foreground))' } },
  },
  elements: {
    line: { borderDash: [4, 4], borderColor: 'hsl(var(--ollvy-green))', borderWidth: 2 },
    point: { backgroundColor: 'hsl(var(--ollvy-green))', radius: 3 },
  },
};
```

**Fallback** (shown if endpoint unavailable):
```typescript
<Card className="border border-border bg-card p-6 text-center mt-12 max-w-[560px] mx-auto">
  <p className="font-semibold">Every GST retainer filing delivered before the due date — or we refund that month.</p>
  <p className="text-sm text-muted-foreground mt-2">
    We don't have enough orders yet to show a rolling chart. This is what we can say instead, 
    and it's the stronger claim.
  </p>
</Card>
```

#### Part C — Trust Badge Row

```typescript
<div className="mt-12 flex flex-wrap justify-center gap-3">
  {[
    'GST-Compliant Invoices',
    'Razorpay Payments',
    'Engagement Letters at Checkout',
    'Monthly Proof-of-Work Reports',
    'Data on Supabase',
  ].map(badge => (
    <span key={badge} className="border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground">
      {badge}
    </span>
  ))}
</div>
```

---

### §12A — WHAT YOU NEED TO GET STARTED

**File**: `components/landing/DocumentChecklist.tsx`

**Inspired by**: Atlys Image 4

**Background**: `hsl(var(--card))`. `py-24`.

**Section label**: `BEFORE YOU BOOK`

**H2**: `What you'll need to have ready`

**Subheading** (muted):
```
Most services need 3–5 documents. Here's the full list 
by business type — so there are no surprises mid-process.
```

**Tabs** — Shadcn `<Tabs defaultValue="pvt_ltd">`:
```
[Pvt Ltd]  [LLP]  [Sole Proprietor]  [Partnership]  [Individual ITR]
```

Mobile: `overflow-x-auto` tab list.

**Document data**:
```typescript
const DOCUMENT_DATA: Record<string, { icon: ReactNode; name: string; note: string }[]> = {
  pvt_ltd: [
    { icon: <FileText size={14} />, name: "PAN card", note: "of all directors" },
    { icon: <IdCard size={14} />, name: "Aadhaar card", note: "of all directors" },
    { icon: <Home size={14} />, name: "Registered address proof", note: "utility bill or NOC from property owner" },
    { icon: <Globe size={14} />, name: "Proposed company name", note: "3 choices recommended for higher approval" },
    { icon: <Shield size={14} />, name: "Digital Signature Certificate", note: "Ollvy arranges this as part of the service" },
  ],
  llp: [
    { icon: <FileText size={14} />, name: "PAN card", note: "of all partners" },
    { icon: <IdCard size={14} />, name: "Aadhaar card", note: "of all partners" },
    { icon: <Home size={14} />, name: "Registered address proof", note: "for LLP office address" },
    { icon: <Globe size={14} />, name: "Proposed LLP name", note: "3 choices recommended" },
  ],
  sole_proprietor: [
    { icon: <FileText size={14} />, name: "PAN card", note: "" },
    { icon: <IdCard size={14} />, name: "Aadhaar card", note: "" },
    { icon: <CreditCard size={14} />, name: "Bank statement", note: "last 3 months, all accounts" },
    { icon: <Home size={14} />, name: "Business address proof", note: "if different from home address" },
  ],
  partnership: [
    { icon: <FileText size={14} />, name: "PAN card", note: "of all partners" },
    { icon: <IdCard size={14} />, name: "Aadhaar card", note: "of all partners" },
    { icon: <ClipboardList size={14} />, name: "Partnership deed", note: "draft available — or Ollvy drafts it" },
    { icon: <Home size={14} />, name: "Business address proof", note: "" },
  ],
  individual_itr: [
    { icon: <FileText size={14} />, name: "PAN card", note: "" },
    { icon: <IdCard size={14} />, name: "Aadhaar card", note: "" },
    { icon: <Briefcase size={14} />, name: "Form 16", note: "if salaried — from employer" },
    { icon: <CreditCard size={14} />, name: "Bank statements", note: "all accounts, full financial year" },
    { icon: <FileCheck size={14} />, name: "Investment proofs", note: "80C, 80D, HRA, etc." },
  ],
};
```

Per tab content:
```typescript
<TabsContent value={tabKey}>
  <Card className="border border-border bg-background p-6 mt-6">
    <h4 className="font-semibold text-sm mb-4">Required Documents</h4>
    <ul className="space-y-3">
      {DOCUMENT_DATA[tabKey].map((doc, i) => (
        <li key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center shrink-0 text-muted-foreground">
            {doc.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{doc.name}</p>
            {doc.note && <p className="text-xs text-muted-foreground">{doc.note}</p>}
          </div>
        </li>
      ))}
    </ul>
    
    {/* "View full list" opens a Dialog */}
    <Button variant="ghost" size="sm" className="w-full mt-5 justify-center"
      onClick={() => setDialogOpen(true)}>
      View full document list <ChevronDown size={13} className="ml-1" />
    </Button>
  </Card>
</TabsContent>
```

**Dialog** (full document list + book CTA):
```typescript
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-[520px]">
    <DialogHeader>
      <DialogTitle>Full document list — {tabLabel}</DialogTitle>
    </DialogHeader>
    {/* Show all documents (not just the first few) */}
    {/* Plus: */}
    <div className="border-t border-border pt-4 mt-4">
      <Button className="w-full">Book this service</Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        You upload documents inside the app after booking. 
        Nothing is needed before you pay — just the list above so you know what to find.
      </p>
    </div>
  </DialogContent>
</Dialog>
```

---

### §13 — REVIEWS

**File**: `components/landing/Reviews.tsx`

**Inspired by**: Atlys Image 9

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `REVIEWS`

**H2**: `From people who've used it`

#### Aggregate Rating (conditional on >= 10 reviews)

```typescript
// Only render if total_ratings_count >= 10
if (stats?.total_ratings_count >= 10) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
      <div className="flex items-end gap-3">
        <span className="text-6xl font-bold font-mono leading-none">
          {stats.avg_rating.toFixed(1)}
        </span>
        <div className="pb-1">
          <StarRow rating={stats.avg_rating} />
          <p className="text-sm text-muted-foreground mt-1">
            Outstanding · {stats.total_ratings_count} reviews
          </p>
        </div>
      </div>
    </div>
  );
}
```

`StarRow` component: renders 5 stars, filled/half/empty based on rating. Use `fill-yellow-400` for filled, `fill-muted` for empty.

#### Keyword Chips (hardcoded, always shown)

```typescript
<div className="flex flex-wrap justify-center gap-2 mb-12">
  <p className="text-xs text-muted-foreground w-full text-center mb-2 uppercase tracking-widest">
    What comes up most often
  </p>
  {['✓ On Time', '✓ Fixed Fees', '✓ No Surprises', '✓ CA was responsive', '✓ Easy process'].map(chip => (
    <span key={chip} className="
      border border-[hsl(var(--ollvy-green))]/20 
      bg-[hsl(var(--ollvy-green))]/5 
      text-[hsl(var(--ollvy-green-fg))]
      rounded-full px-3 py-1 text-xs font-medium
    ">
      {chip}
    </span>
  ))}
</div>
```

#### Three Testimonial Cards

`<div className="grid grid-cols-1 md:grid-cols-3 gap-6">`

```typescript
const TESTIMONIALS = [
  {
    quote: "We hired our 4th employee and suddenly had PF obligations I had no idea about. Ollvy caught it during setup — I hadn't even asked. The CA set up the PF registration and the first month's challan before payroll ran. I found out about the requirement and it was already handled.",
    name: "Rohit A.",
    role: "Founder",
    business: "E-commerce, 8 employees",
    city: "Delhi",
  },
  {
    quote: "I've worked with three CAs over five years. None of them ever sent a scope document before starting work. Ollvy showed me an engagement letter at checkout — exactly what's covered and what isn't. I read it twice because I couldn't believe it was real. Booked immediately.",
    name: "Priya K.",
    role: "Co-Founder",
    business: "D2C skincare brand",
    city: "Bangalore",
  },
  {
    quote: "My previous CA would just say 'all done' over WhatsApp. No acknowledgements. No dates. When I asked for records during a due diligence, I had nothing. With Ollvy I have filing dates, acknowledgement numbers, and a monthly report for every single cycle since I started.",
    name: "Arjun M.",
    role: "Director",
    business: "SaaS, Pvt Ltd",
    city: "Mumbai",
  },
];
```

Per card:
```typescript
<Card className="border border-border bg-card p-6">
  <div className="text-4xl leading-none text-muted-foreground/20 font-serif">&ldquo;</div>
  <p className="text-sm text-foreground leading-relaxed mt-3">{t.quote}</p>
  <div className="border-t border-border mt-6 pt-4">
    <p className="text-sm font-semibold text-foreground">{t.name}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{t.role} · {t.business} · {t.city}</p>
  </div>
</Card>
```

---

### §14 — FOR PROFESSIONALS

**File**: `components/landing/ForProfessionals.tsx`

**id="professionals"**. **Background**: `hsl(var(--card))`. `py-24`. Centered, max-width 640px.

```
Section label: FOR CAs, CSs, AND LAWYERS

H2: Clients come to you. Not the other way around.

Body (muted, mt-4, leading-relaxed, max-width 540px):
Join as a verified professional and get matched with 
clients based on your city and service type. Orders 
come in through the app. You handle them in the app. 
Payouts hit your account every week.

No cold calls. No rate negotiations. No chasing invoices.

Earnings context card (mt-6, border border-border rounded-xl p-5):
  <p className="text-sm font-medium text-foreground">
    What professionals on Ollvy earn
  </p>
  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
    A CA in Delhi handling 8–12 GST retainer clients through Ollvy 
    earns approximately ₹24,000–₹36,000/month from the platform — 
    on top of their existing practice. This is based on current 
    platform activity, not a guarantee.
  </p>

CTA (mt-8):
<Button size="lg" variant="outline" asChild>
  <Link href="/join">Apply to join →</Link>
</Button>
<p className="text-xs text-muted-foreground mt-3">
  Verification takes 2–3 working days. ICAI/ICSI/Bar Council 
  registration number required.
</p>
```

---

### §14B — REFER A FOUNDER

**File**: `components/landing/ReferFounder.tsx`

**Feature flag**: `process.env.NEXT_PUBLIC_REFERRAL_ENABLED === 'true'`. If false, render nothing (return null).

**Inspired by**: Atlys Image 12

**Background**: `hsl(var(--background))`. `py-24`.

**Section label**: `REFER A FOUNDER`

**H2**: `Refer a founder. Get paid when they book.`

**Subheading** (muted):
```
Share your link. If the founder books any service, 
you get a cash reward via UPI — or credit toward 
your next order. Paid within 7 working days.
```

**Reward cards** — `grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10`:

```typescript
const rewards = [
  { service: "Pvt Ltd Incorporation", reward: "₹2,000" },
  { service: "GST Registration", reward: "₹500" },
  { service: "Monthly Filing (3 months)", reward: "₹200/month" },
  { service: "Trademark Registration", reward: "₹750" },
  { service: "Business ITR Filing", reward: "₹1,000" },
  { service: "Any other service", reward: "5% of value" },
];
```

Per card:
```typescript
<Card className="border border-border bg-card p-4 text-center">
  <p className="text-xs text-muted-foreground leading-snug">{r.service}</p>
  <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-pro-gold))] mt-2">GET</p>
  <p className="text-xl font-bold font-mono text-foreground mt-0.5">{r.reward}</p>
</Card>
```

**How it works** (3-step, mt-10, `divide-y divide-border max-w-[480px] mx-auto`):

```typescript
const steps = [
  { n: "1", title: "Copy your link", body: "One link, unique to your account. Share on WhatsApp, email, wherever." },
  { n: "2", title: "They book a service", body: "The founder clicks your link and books anything — registration, filing, retainer." },
  { n: "3", title: "Money in 7 days", body: "UPI transfer to your registered number, or wallet credit. No threshold. No minimum." },
];
```

Per step: flex with large muted number, title + body.

**CTA** (centered, mt-8):
```typescript
<Button variant="outline" onClick={handleReferClick}>
  Get My Referral Link
</Button>
```

`handleReferClick`: if user is authenticated → open `/refer`. If not → open Shadcn `<Dialog>` with "Sign in to get your link" + sign-in CTA.

---

### §15 — FINAL CTA

**File**: `components/landing/FinalCTA.tsx`

**Background**: `hsl(var(--card))`. `py-24`. Full-width. Centered.

```
H2 (Fraunces, 48px desktop / 32px mobile, max-width 480px, mx-auto):
Start in 3 minutes.
No documents needed upfront.

Body (muted, mt-4, max-width 400px, mx-auto):
Browse services, see fixed prices, and book — 
all before creating an account.
```

**App store buttons** (mt-10, flex flex-wrap justify-center gap-4):
- App Store SVG badge — `<a href="https://apps.apple.com/..." target="_blank">`
- Play Store SVG badge — `<a href="https://play.google.com/..." target="_blank">`
- `<Button variant="ghost" asChild><Link href="/app">Open on Web →</Link></Button>`

**Trust lines** (mt-10, flex flex-col items-center gap-2, text-sm muted):
```
✓ No account needed to browse services and prices
✓ Every order includes a GST-compliant tax invoice
✓ Monthly retainers have no minimum term — cancel any cycle
```

---

### §15B — HOW WE ENSURE ACCURACY

**File**: `components/landing/AccuracyStatement.tsx`

**Inspired by**: Atlys Image 10

**Background**: `hsl(var(--background))`. `py-12`. No section heading or label. Sits between §15 and footer.

```typescript
<Card className="border border-border bg-card max-w-[800px] mx-auto p-8">
  <h3 className="font-semibold text-base text-foreground">How we ensure accuracy</h3>
  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
    Ollvy's service descriptions, penalty amounts, and compliance deadlines are sourced 
    directly from official government portals. We do not rely on secondary sources. We 
    update this information when regulations change.
  </p>

  <Tabs defaultValue="sources" className="mt-6">
    <TabsList>
      <TabsTrigger value="sources">Sources</TabsTrigger>
      <TabsTrigger value="history">Last Reviewed</TabsTrigger>
    </TabsList>

    <TabsContent value="sources" className="mt-4">
      <ul className="space-y-2">
        {[
          ['Ministry of Corporate Affairs', 'https://www.mca.gov.in'],
          ['GST Council / GSTN Portal', 'https://www.gst.gov.in'],
          ['Income Tax India', 'https://www.incometax.gov.in'],
          ['EPFO — Employees Provident Fund Organisation', 'https://www.epfindia.gov.in'],
          ['ESIC — Employees State Insurance Corporation', 'https://www.esic.in'],
        ].map(([label, url]) => (
          <li className="flex items-center gap-2 text-sm">
            <ExternalLink size={11} className="text-muted-foreground shrink-0" />
            <a href={url} target="_blank" rel="noopener noreferrer"
               className="text-muted-foreground hover:text-foreground transition-colors">
              {label}
              <span className="font-mono text-xs ml-2 opacity-60">{url}</span>
            </a>
          </li>
        ))}
      </ul>
    </TabsContent>

    <TabsContent value="history" className="mt-4">
      <p className="text-sm text-muted-foreground">
        Content last reviewed: <strong className="text-foreground">March 2025</strong>
      </p>
      <p className="text-xs text-muted-foreground mt-1.5">
        Update the <code className="bg-muted px-1 py-0.5 rounded text-xs">LAST_REVIEWED</code> constant 
        in <code className="bg-muted px-1 py-0.5 rounded text-xs">constants/accuracy.ts</code> every time 
        you manually verify the penalty amounts against the source portals.
      </p>
    </TabsContent>
  </Tabs>
</Card>
```

---

### §16 — FOOTER

**File**: `components/landing/Footer.tsx`

**Background**: `hsl(var(--background))`. `border-t border-border`. `py-12`.

**Layout**: `grid grid-cols-2 md:grid-cols-4 gap-8`

```typescript
<footer className="border-t border-border py-12">
  <div className="max-w-[1200px] mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

      {/* Column 1: Brand */}
      <div className="col-span-2 md:col-span-1">
        <OllvyWordmark />
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          GST filings. ITR. Payroll. Incorporation. 
          32 services, fixed prices, verified professionals.
          No hidden fees. No WhatsApp CAs.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="https://linkedin.com/company/ollvy" target="_blank" rel="noopener">
            <Linkedin size={16} className="text-muted-foreground hover:text-foreground transition-colors" />
          </a>
          <a href="https://twitter.com/ollvy" target="_blank" rel="noopener">
            <Twitter size={16} className="text-muted-foreground hover:text-foreground transition-colors" />
          </a>
        </div>
      </div>

      {/* Column 2: Products */}
      <FooterColumn title="Products" links={[
        { label: 'Services', href: '/#services' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Ollvy Pro', href: '/#pricing' },
        { label: 'Compliance Calendar', href: '/#compliance-calendar' },
        { label: 'For Professionals', href: '/join' },
      ]} />

      {/* Column 3: Company */}
      <FooterColumn title="Company" links={[
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: 'mailto:support@ollvy.com' },
      ]} />

      {/* Column 4: Legal */}
      <FooterColumn title="Legal" links={[
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cancellation Policy', href: '/cancellation' },
        { label: 'Refund Policy', href: '/refunds' },
      ]} />

    </div>

    {/* Bottom row */}
    <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 flex-wrap">
      <p className="text-xs text-muted-foreground">
        © 2025 Ollvy Technologies Private Limited. All rights reserved.
      </p>
      <div className="flex gap-4 flex-wrap">
        <p className="text-xs text-muted-foreground font-mono">CIN: [INSERT CIN]</p>
        <p className="text-xs text-muted-foreground font-mono">GSTIN: [INSERT OLLVY GSTIN]</p>
      </div>
    </div>
  </div>
</footer>
```

**Insert Ollvy's own CIN and GSTIN** — these are trust signals proving the company is real and GST-compliant. Do not leave blank.

```typescript
function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map(link => (
          <li>
            <Link href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## §17 — DEADLINE-SPECIFIC LANDING PAGES

**Inspired by**: Atlys Image 11 (F1 Canadian Grand Prix Canada visa page)

**What Atlys does and why it works**: Atlys builds a dedicated page for every major travel event — F1, IPL, World Cup finals. Someone searching "Canada visa for F1 Grand Prix" lands on a page that speaks directly to their situation: the event date, how many days before the event their visa arrives, and how many people are already applying. The page isn't generic. It's about *their trip*. Conversion is higher because the visitor's intent is matched precisely.

**The compliance analogue**: Indian founders search for things like "ITR filing due date 2025", "GSTR-9 last date", "Director KYC penalty 2025", "how to avoid GST notice". These are deadline-driven, high-intent searches. A generic homepage doesn't convert this traffic. A page that speaks specifically to that deadline does.

**These are separate routes.** They are not part of the main `app/page.tsx`. They live at:

```
app/
  itr-2025/page.tsx           → Business ITR filing season
  gst-annual-2025/page.tsx    → GSTR-9 annual return
  director-kyc-2025/page.tsx  → DIR-3 KYC Sep 30 deadline
  startup-india/page.tsx      → Pvt Ltd incorporation (evergreen)
  msme-registration/page.tsx  → Udyam registration (evergreen)
```

Build as a shared template: `components/deadline/DeadlinePage.tsx` that accepts a config object. Adding a new deadline page = adding one config entry.

---

### DEADLINE PAGE CONFIG STRUCTURE

```typescript
// lib/deadlines.ts
export interface DeadlineConfig {
  slug: string;
  serviceName: string;           // "Business ITR Filing"
  eventLabel: string;            // "Financial Year 2025-26"
  dueDate: string;               // ISO date: "2025-10-31"
  postDeadlineMessage: string;   // shown when dueDate has passed
  heroTagline: string;           // large accent-colored text under service name
  purposeLabel: string;          // "TAX FILING"
  eligibilityLabel: string;      // "All Pvt Ltd companies"
  urgencyLine: string;           // "Filed before due date = no late fee"
  penaltyLine: string;           // "Miss this: ₹1,000/day + interest"
  filingCount?: number;          // "340 businesses filing this season with Ollvy"
  ollvyFee: number;
  govtFee?: number;
  slaDays: number;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export const DEADLINES: DeadlineConfig[] = [
  {
    slug: 'itr-2025',
    serviceName: 'Business ITR Filing',
    eventLabel: 'Financial Year 2025-26',
    dueDate: '2025-10-31',
    postDeadlineMessage: 'The Oct 31 deadline has passed. File now to reduce penalty accrual — late filing interest is 1% per month.',
    heroTagline: 'Financial Year 2025-26',
    purposeLabel: 'TAX FILING',
    eligibilityLabel: 'All Pvt Ltd, LLP, and Partnership firms',
    urgencyLine: 'File by Oct 31 to avoid late filing interest',
    penaltyLine: 'Past due: 1% per month interest on tax payable',
    ollvyFee: 11999,
    govtFee: 0,
    slaDays: 10,
    seoTitle: 'Business ITR Filing 2025 — File Before Oct 31 | Ollvy',
    seoDescription: 'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31, 2025. Fixed price ₹11,999. Verified CA assigned within 24 hours.',
    canonicalUrl: 'https://ollvy.com/itr-2025',
  },
  {
    slug: 'gst-annual-2025',
    serviceName: 'GST Annual Return (GSTR-9)',
    eventLabel: 'FY 2024-25 Annual Return',
    dueDate: '2025-12-31',
    postDeadlineMessage: 'The Dec 31 deadline has passed. File GSTR-9 immediately — ₹200/day penalty is accruing.',
    heroTagline: 'FY 2024-25 Annual Return',
    purposeLabel: 'GST ANNUAL FILING',
    eligibilityLabel: 'All GST-registered businesses above ₹2Cr turnover',
    urgencyLine: 'File before Dec 31 to avoid ₹200/day penalty',
    penaltyLine: 'Past due: ₹200/day late fee with no ceiling',
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 7,
    seoTitle: 'GSTR-9 Annual Return 2025 — File Before Dec 31 | Ollvy',
    seoDescription: 'File your GSTR-9 annual return for FY 2024-25 before December 31. Fixed price ₹4,999. CA assigned same day.',
    canonicalUrl: 'https://ollvy.com/gst-annual-2025',
  },
  {
    slug: 'director-kyc-2025',
    serviceName: 'Director KYC (DIR-3 KYC)',
    eventLabel: 'Annual Filing · Due Sep 30',
    dueDate: '2025-09-30',
    postDeadlineMessage: 'The Sep 30 deadline has passed. Your DIN may already be deactivated. File DIR-3 KYC immediately — ₹5,000/day penalty is accruing.',
    heroTagline: 'Sep 30, 2025 · Every year',
    purposeLabel: 'MCA COMPLIANCE',
    eligibilityLabel: 'All directors of Indian companies',
    urgencyLine: 'File by Sep 30 or your DIN gets deactivated',
    penaltyLine: 'Past due: ₹5,000/day until filed + DIN deactivated',
    ollvyFee: 1499,
    govtFee: 0,
    slaDays: 2,
    seoTitle: 'Director KYC 2025 — DIR-3 KYC Filing Before Sep 30 | Ollvy',
    seoDescription: 'File DIR-3 KYC before Sep 30, 2025. Avoid DIN deactivation and ₹5,000/day penalty. Fixed price ₹1,499 per director.',
    canonicalUrl: 'https://ollvy.com/director-kyc-2025',
  },
];
```

---

### DEADLINE PAGE — HERO SECTION

**Directly mirrors Atlys Image 11 layout.**

```
<section className="relative min-h-[80vh] flex flex-col items-center justify-center
  bg-background overflow-hidden">

  {/* Dark background with subtle radial glow — no stock photos */}
  <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,hsl(142_71%_35%_/_0.07),transparent_60%)]" />

  {/* Social proof pill — top right, mirrors Atlys "280+ going for this event" */}
  {deadline.filingCount && (
    <div className="absolute top-6 right-6 flex items-center gap-2 
      bg-card border border-border rounded-full px-3 py-1.5">
      {/* Small avatar stack: 3 overlapping initials circles */}
      <AvatarStack count={3} />
      <span className="text-xs text-muted-foreground">
        {deadline.filingCount}+ businesses filing this with Ollvy
      </span>
    </div>
  )}

  <div className="relative z-10 text-center max-w-[640px] px-6">

    {/* Service name — large, white */}
    <h1 className="text-5xl md:text-6xl font-bold text-foreground font-display">
      {deadline.serviceName}
    </h1>

    {/* Event label — accent color, below title. Atlys uses green for this */}
    <p className="text-2xl md:text-3xl font-semibold text-[hsl(var(--ollvy-green))] mt-2">
      {deadline.heroTagline}
    </p>

    {/* Due date line */}
    <p className="text-sm text-muted-foreground mt-4">
      Due {format(new Date(deadline.dueDate), 'MMMM d, yyyy')}
    </p>

    {/* Metadata row — mirrors Atlys "PURPOSE: TOURISM  VALID: 10 YEARS" */}
    <div className="flex justify-center gap-8 mt-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">For</p>
        <p className="font-semibold text-foreground text-sm mt-1">{deadline.eligibilityLabel}</p>
      </div>
      <div className="w-px bg-border" />
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Type</p>
        <p className="font-semibold text-foreground text-sm mt-1">{deadline.purposeLabel}</p>
      </div>
    </div>

    {/* CTA button */}
    <Button size="lg" className="mt-8 w-full max-w-[320px]">
      Start Filing Now
    </Button>

    {/* Urgency line below CTA — mirrors Atlys "Get visa 6 days before event" */}
    <p className="text-sm text-muted-foreground mt-3">
      {isBeforeDeadline
        ? `${daysLeft} days left · ${deadline.urgencyLine}`
        : deadline.postDeadlineMessage
      }
    </p>

  </div>
</section>
```

**Avatar stack** (`components/ui/AvatarStack.tsx`):
```typescript
// Shows N overlapping initials circles to suggest "people are doing this"
// Use static initials: "RA", "PK", "SM" — not real users
function AvatarStack({ count }: { count: number }) {
  const initials = ['RA', 'PK', 'SM', 'DM', 'NK'].slice(0, count);
  return (
    <div className="flex -space-x-2">
      {initials.map((init, i) => (
        <div key={i} className="w-6 h-6 rounded-full bg-muted border border-background 
          flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
          {init}
        </div>
      ))}
    </div>
  );
}
```

**Countdown implementation**:
```typescript
import { differenceInDays, format, isPast } from 'date-fns';

const dueDate = new Date(deadline.dueDate);
const isBeforeDeadline = !isPast(dueDate);
const daysLeft = differenceInDays(dueDate, new Date());

// States:
// daysLeft > 30:  "87 days left · File by Oct 31 to avoid late filing interest"
// daysLeft 8–30: "23 days left · File now — CAs are filling up fast this season"
// daysLeft 1–7:  "4 days left · Urgency is real"  [amber text color]
// daysLeft === 0: "Due today — file now"           [red text color]
// isPast:         deadline.postDeadlineMessage      [red text, no countdown]

function getUrgencyStyle(daysLeft: number, isPast: boolean) {
  if (isPast) return 'text-red-400';
  if (daysLeft <= 7) return 'text-[hsl(var(--ollvy-amber))]';
  return 'text-muted-foreground';
}
```

---

### DEADLINE PAGE — BELOW HERO

After the hero, the page has 5 sections in this order:

#### Section 1 — Service card (fee breakdown)

Same `<ServiceCard>` component from §5 of the main spec. Pre-populated with this service's data. Shows:
- Ollvy fee
- Govt fee (if any)
- Total
- Guaranteed completion date (using the same `getGuaranteedDate(slaDays)` utility)
- SLA in working days
- `<Button className="w-full mt-4">Book This Service — ₹{ollvyFee.toLocaleString('en-IN')}</Button>`

Full-width card, max-width 640px, centered.

#### Section 2 — What documents you need

Same `<DocumentChecklist>` component from §12A, pre-filtered to this service's business type. For ITR: show the `individual_itr` or appropriate tab pre-selected. For GST annual return: show `pvt_ltd` tab.

**Section heading** (specific, not generic):
- ITR: `"Documents you'll need to file ITR-6 / ITR-5"`
- GSTR-9: `"What your CA will ask for to file GSTR-9"`
- Director KYC: `"Two documents. That's it. This one is simple."`

#### Section 3 — Why this deadline matters (2–4 risk items)

Same `<ComplianceRisks>` component pattern from §6B, but scoped to risks specifically relevant to THIS deadline. Not all 4 generic risks — just the 2–3 that apply.

**For ITR page**:
```typescript
const itrRisks = [
  {
    title: "Belated filing interest at 1% per month",
    body: "Section 234A: if you file after Oct 31 and have tax due, 1% monthly interest accrues on the outstanding amount from Nov 1. On ₹5L tax liability, that's ₹5,000 per month.",
  },
  {
    title: "Losses can't be carried forward",
    body: "If your company made a loss this year and you file late, you lose the right to carry it forward and offset against future profits. This is irreversible.",
  },
  {
    title: "Defective return notice",
    body: "Late filers are more likely to receive defective return notices under Section 139(9) — requires a response within 15 days or the return is treated as not filed.",
  },
];
```

**For GSTR-9 page**:
```typescript
const gstr9Risks = [
  {
    title: "₹200/day late fee — no ceiling",
    body: "GSTR-9 late fee is ₹200/day (₹100 CGST + ₹100 SGST) with no maximum cap. At 90 days late, that's ₹18,000. At 180 days, ₹36,000.",
  },
  {
    title: "ITC claims become final",
    body: "GSTR-9 is your last chance to claim or correct ITC for the financial year. Any unclaimed ITC from FY 2024-25 is permanently lost if not reconciled in this return.",
  },
];
```

**For Director KYC page**:
```typescript
const kycRisks = [
  {
    title: "₹5,000/day penalty — starts immediately",
    body: "The MCA penalty clock starts Oct 1. By Dec 31, that's ₹91,000 per director. Multiple directors multiply this. The DIN is also deactivated, blocking all company filings.",
  },
  {
    title: "Can't sign on any MCA document",
    body: "With a deactivated DIN, the director can't sign board resolutions, financial statements, or annual returns. This cascades — it blocks the company's own MCA filings.",
  },
];
```

#### Section 4 — Testimonials (service-specific, 2 cards)

Use the same `<Reviews>` component but only show 2 testimonial cards, filtered or rewritten to be relevant to this specific service.

**For ITR page**:
```typescript
const itrTestimonials = [
  {
    quote: "We always filed in November because 'October is too early.' Cost us ₹8,000 in interest last year on ₹8L tax liability. This year I booked on Ollvy in September and it was done by Oct 3.",
    name: "Sandeep R.",
    role: "Director",
    business: "IT Services, Pvt Ltd",
    city: "Hyderabad",
  },
  {
    quote: "I had capital gains from two property sales and ESOP vesting in the same year. Told the CA everything on day 1. He came back with specific questions about cost of acquisition for both properties. Not just a form-filler.",
    name: "Kavya M.",
    role: "Co-Founder",
    business: "Fintech startup",
    city: "Bangalore",
  },
];
```

**For GSTR-9 page**:
```typescript
const gstr9Testimonials = [
  {
    quote: "GSTR-9 reconciliation found ₹34,000 in ITC we hadn't claimed from Q1. The CA caught it during the annual review. That alone paid for the service multiple times over.",
    name: "Varun S.",
    role: "Founder",
    business: "Manufacturing, GST-registered",
    city: "Pune",
  },
  {
    quote: "I was dreading this because our books were messy after a system migration. The CA broke it into a checklist, told me exactly what to send, and handled the reconciliation. Two weeks start to finish.",
    name: "Megha T.",
    role: "CFO",
    business: "Retail chain, 4 locations",
    city: "Chennai",
  },
];
```

#### Section 5 — Final CTA

```typescript
<section className="py-16 text-center bg-card">
  <h2 className="text-3xl font-bold font-display">
    {isBeforeDeadline
      ? `${daysLeft} days left. Start now.`
      : 'The deadline passed. Every day you wait, the penalty grows.'
    }
  </h2>
  <p className="text-muted-foreground mt-3 max-w-[480px] mx-auto text-sm">
    {isBeforeDeadline
      ? `A verified CA is assigned within 24 hours. Done by ${getGuaranteedDate(deadline.slaDays)}, guaranteed.`
      : 'Late filing interest accrues every day. The sooner you file, the less you pay.'
    }
  </p>
  <Button size="lg" className="mt-8">
    Book Now — ₹{deadline.ollvyFee.toLocaleString('en-IN')}
  </Button>
  <p className="text-xs text-muted-foreground mt-3">
    Fixed price. No govt fee surprises. CA assigned within 24 hours. 
    GST invoice generated at checkout.
  </p>
</section>
```

---

### DEADLINE PAGE — SEO

Each page exports metadata from Next.js:

```typescript
// app/itr-2025/page.tsx
import { Metadata } from 'next';
import { DEADLINES } from '@/lib/deadlines';

const deadline = DEADLINES.find(d => d.slug === 'itr-2025')!;

export const metadata: Metadata = {
  title: deadline.seoTitle,
  description: deadline.seoDescription,
  alternates: { canonical: deadline.canonicalUrl },
  openGraph: {
    title: deadline.seoTitle,
    description: deadline.seoDescription,
    url: deadline.canonicalUrl,
    type: 'website',
  },
};
```

**JSON-LD structured data** (in `<head>` of each deadline page):
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: deadline.serviceName,
  provider: { '@type': 'Organization', name: 'Ollvy Technologies Private Limited' },
  offers: {
    '@type': 'Offer',
    price: deadline.ollvyFee.toString(),
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    validThrough: deadline.dueDate,
  },
};
// Render as: <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

This structured data is why these pages rank — Google shows the price and availability directly in search results for queries like "ITR filing cost India 2025".

---

### DEADLINE PAGE — POST-DEADLINE STATE

When `isPast(new Date(deadline.dueDate))` is true, the page does NOT 404 or break. It transforms:

```
Hero headline: "Filed yours yet?"  →  "Deadline passed. File now."
Countdown badge: gone
Urgency line: deadline.postDeadlineMessage (red text)
CTA button text: "File Now — Stop the Penalty Clock"
Hero background glow: switches from green (#ollvy-green) to amber (#ollvy-amber)
```

The page stays live permanently. For deadline pages, the post-deadline version gets different search traffic: "ITR late filing 2025", "what happens if I miss ITR deadline" — these are still high-intent visitors who need the service.

---

### DEADLINE PAGE — ADDING A NEW DEADLINE

To add a new deadline page after this sprint:

1. Add one entry to `DEADLINES` array in `lib/deadlines.ts`
2. Create `app/[slug]/page.tsx` that imports `DeadlinePage` component and passes the config
3. Write 2 service-specific testimonials
4. Write 2–3 service-specific risk items
5. Done

No new components. No new layout. All the heavy lifting is in the shared template.

**Planned next deadline pages** (build after launch):
```
/tds-q4-2025        → TDS return deadline March 31
/pvt-ltd-2026       → Evergreen incorporation — no deadline, but high search volume
/gst-registration   → Evergreen — "how to get GST number" is high-volume
/pf-registration    → Evergreen — mandatory above 20 employees
```

---

## FINAL SECTION ORDER

```
§1   Navbar (fixed)
§2   Hero
§3   Problem Bar
§4   How It Works
§5   Service Grid (id="services")
§6   Trust Layer + Authority Logos
§6A  Success Rate Comparison
§6B  Why Businesses Get Notices
§6C  What Incorporation Unlocks
§7   Compliance Calendar Preview (id="compliance-calendar")
§8   Penalty Calculator
§9   Professional Assignment
§10  Retainer Model
§11  Ollvy Pro Pricing (id="pricing")
§12  Social Proof + Processing Time
§12A What You Need to Get Started
§13  Reviews
§14  For Professionals (id="professionals")
§14B Refer a Founder (feature-flagged)
§15  Final CTA
§15B How We Ensure Accuracy
§16  Footer
```

---

## IMPLEMENTATION RULES — NON-NEGOTIABLE

### Dynamic data rules
```
Source: GET /functions/v1/get-public-profile (unauthenticated)
Fields: orders_completed_total, professionals_count, cities_served, avg_rating, total_ratings_count

Rules (zero exceptions):
1. Show <Skeleton> while loading
2. If API returns null or throws: hide section, render nothing
3. Never show 0, never show "—", never hardcode these numbers
4. avg_rating only if total_ratings_count >= 10
5. Use SWR: revalidateOnFocus: false, dedupingInterval: 3_600_000
```

### Feature flags
```
NEXT_PUBLIC_SHOW_PERCENTAGE=true/false      // §6A: percentage vs soft claim
NEXT_PUBLIC_REFERRAL_ENABLED=true/false    // §14B: show/hide referral
NEXT_PUBLIC_SHOW_REVIEWS=true/false        // §13: show/hide reviews block
```

### Date/SLA rules
```
Guaranteed date:
- addBusinessDays(today, sla_days) from date-fns
- Skip HOLIDAYS_2025_2026 constant
- If result <= today: show "Done in N working days" fallback
- Never show a past date

Monthly retainers:
- GSTR-3B due: 20th of following month
- If order placed after 15th: show due date of month after next
```

### UTM tags
```
Every CTA href appends: ?utm_source=homepage&utm_medium=landing&utm_content=[section_id]
§2 hero:         utm_content=hero
§5 service grid: utm_content=service_grid  
§8 calculator:   utm_content=penalty_calc
§11 pro pricing: utm_content=pro_pricing
§14b referral:   utm_content=refer
```

### Accessibility
```
- All interactive elements keyboard-navigable
- Filter chips: role="tab", aria-selected
- Penalty calculator output: role="status" aria-live="polite"
- Stars: aria-label="4.8 out of 5 stars"
- Guaranteed date badge: aria-label="Guaranteed completed by 25 March"
- All images: meaningful alt text, not "image"
- Lazy-load all sections below the fold with next/dynamic
```

### Performance
```
Target: LCP < 2.5s, CLS < 0.1, FCP < 1.8s
- Hero is fully static — no API
- Platform stats async — never block render
- next/image for all images
- framer-motion: LazyMotion with domAnimation feature bundle
- font-display: swap on Fraunces and JetBrains Mono
```

---

## WHAT NOT TO BUILD

```
✗ Carousel or hero slider
✗ Countdown timer ("3 hours left!") — this is not Zomato
✗ "17 people viewing this" FOMO — same reason
✗ Live chat widget in v1
✗ Purple or gradient backgrounds
✗ Stock photos of smiling Indians at laptops
✗ "As seen in" logos without real press coverage
✗ Fabricated review counts (< 10 reviews = no rating shown)
✗ bg-white, bg-gray-50, bg-slate-100 — breaks dark theme
✗ text-black, text-gray-900 — use text-foreground
✗ Navy #1E3A5F or cream #FAFAF7 — old spec, do not use
✗ Hex colors defined outside CSS variables
✗ Any reference to the old colour system
```

---

*Spec grounded entirely in Ollvy Master Build Spec v22 and Atlys trust pattern analysis (13 images). All prices, features, edge functions, product mechanics, and penalty amounts referenced here are real, verifiable, and buildable.*


---


---

## §18 — SERVICE DETAIL PAGES (COMPLETE IMPLEMENTATION SPEC)

**Route**: `app/services/[slug]/page.tsx`
**Shared component**: `components/service/ServicePage.tsx`

This is the conversion page. Homepage = discovery. Service page = where the booking happens.

---

### NEW PATTERNS FROM ATLYS (Canada + Schengen pages) — ASSESSMENT AND ADOPTION

These patterns appear in the new screenshots. Each has been evaluated for Ollvy fit.

| Pattern | Source | Decision | Ollvy Implementation |
|---|---|---|---|
| Fee breakdown: Govt fee line + Atlys fee line + Total | Canada page | ✓ ADOPT | Both fees shown as separate lines, both collected upfront |
| Interactive process stepper (Steps 1–5 with carousel) | Canada steps | ✓ ADOPT | 4–5 step animated stepper per service |
| Document checklist by applicant profile (Employed/Student/Business Owner) | Canada page | ✓ ADOPT | Checklist by business type (Pvt Ltd / LLP / Proprietor) — already in §12A |
| "Chances of approval" comparison (Atlys 96.3% vs 54% industry) | Canada page | ✓ ADOPT | On-time filing rate with feature flag |
| "We optimize for approval, not submission" — custom checklist per profile | Why Atlys tab | ✓ ADOPT | "We file correctly, not just on time" — CA reviews for accuracy, not just submission |
| "We catch red flags before embassies do" — scan → predict → fix → provide | Why Atlys tab | ✓ ADOPT | "We catch compliance gaps before notices arrive" — same 4-step scan model |
| Profile personas: "single / unemployed / not traveled — all approved" | Canada page | ✓ ADOPT | "First-time founder / missed last deadline / no CA before — all handled" |
| "4.5 rating across all platforms" (Trustpilot + App Store + Google Play) | Schengen page | ✓ ADOPT LATER | Only when real multi-platform reviews exist. Don't fake it. |
| Schengen fee structure transparency card (Appointment fee vs Visa fee, paid at different places) | Schengen page | ✓ ADOPT | "What you pay now vs what goes to the government" — single card in booking panel |
| Road/journey process illustration | Schengen page | ✗ REJECT | Illustrative overhead, dark theme doesn't suit it, step stepper covers the same need |
| "Unlock a lower price" link | Canada page | ✗ REJECT | Confusing in B2B, creates uncertainty about the listed price |
| Hero city/country background photo | Canada/Dubai | ✗ REJECT | No equivalent for compliance. Dark gradient + radial glow is the right call. |
| Review carousel with prev/next arrows | Schengen page | ✗ REJECT | Spec already says no carousels |

---

### FILE STRUCTURE

```
app/
  services/
    [slug]/
      page.tsx          ← generates metadata, fetches service config, renders ServicePage
      
components/
  service/
    ServicePage.tsx     ← top-level layout: hero + tabs + sticky panel
    ServiceHero.tsx     ← hero section with guaranteed date + metadata row + tabs
    StickyBar.tsx       ← top sticky bar on scroll
    BookingPanel.tsx    ← right sticky fee breakdown + book CTA
    tabs/
      ServiceInfoTab.tsx    ← default tab: stats + stepper + risks + related
      WhatsIncludedTab.tsx  ← before/after comparisons with mock visuals
      ReviewsTab.tsx        ← rating + chips + review cards + AI search
      DocumentsTab.tsx      ← checklist by business type
      WhyOllvyTab.tsx       ← "We catch compliance gaps" — new from Atlys Canada
      FaqsTab.tsx           ← categorised accordion + search
    ProcessStepper.tsx      ← animated 4–5 step stepper
    CompletionStats.tsx     ← "47 orders completed this month" + distribution bars
    ServiceRisks.tsx        ← 2–3 risk items specific to this service
    RelatedServices.tsx     ← "Services you'll need next"
    HowWeReviewed.tsx       ← accuracy statement + official sources
    
lib/
  services.ts             ← ServiceConfig[] array — one entry per service
  services/
    pvt-ltd-incorporation.ts
    gst-registration.ts
    gst-monthly-filing.ts
    business-itr.ts
    director-kyc.ts
    trademark-registration.ts
    llp-incorporation.ts
    fssai-license.ts
    iec-code.ts
    mca-annual-filing.ts
    tds-monthly-compliance.ts
    payroll-management.ts
```

---

### SERVICE CONFIG INTERFACE

```typescript
// lib/services.ts

export interface ServiceConfig {
  // Core identity
  slug: string;
  name: string;                          // "Private Limited Incorporation"
  shortName: string;                     // "Pvt Ltd" — used in sticky bar, chips
  category: ServiceCategory;
  tagline: string;                       // "One registration. Every door opens."
  
  // Pricing — ALL collected upfront. Separate line items for transparency.
  ollvyFee: number;                      // 9999
  govtFee?: number;                      // 15000 — if applicable
  govtFeeLabel?: string;                 // "MCA stamp duty (approx)"
  govtFeeNote?: string;                  // "This fee goes directly to the government. Ollvy does not retain it."
  
  // SLA
  slaDays: number;                       // 15 — working days
  isRetainer: boolean;
  retainerCycleLabel?: string;           // "per month" — shown on price
  nextDueDate?: () => string;            // for retainers — dynamic due date
  
  // Service metadata (shown in hero metadata row)
  mandatoryFor: string;                  // "All Pvt Ltd companies"
  serviceType: 'One-time' | 'Annual' | 'Monthly retainer';
  legalBasis?: string;                   // "Companies Act 2013, Section 7"
  penaltyForMissing?: string;            // "₹100/day, max ₹1,00,000"
  penaltyColor: 'amber' | 'red' | 'none';
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  
  // Content — all defined per service in lib/services/[slug].ts
  processSteps: ProcessStep[];
  whatsIncluded: WhatsIncludedItem[];
  serviceRisks: ServiceRisk[];           // 2–3 items
  profilePersonas: ProfilePersona[];     // "We handle messy situations too"
  faqs: ServiceFaq[];
  reviewKeywordChips: string[];
  relatedSlugs: string[];
  reviewSources: ReviewSource[];
  unlocks?: UnlockItem[];                // "What this service unlocks"
  
  // Feature flags
  showCompletionStats: boolean;          // false until 10+ orders
  showApprovalRate: boolean;             // false until 20+ orders
}

export type ServiceCategory = 
  'Registrations' | 'Licensing' | 'Monthly Compliance' | 
  'Tax Filings' | 'Payroll' | 'Legal';

export interface ProcessStep {
  step: number;
  title: string;
  timeline: string;                      // "Day 1–2"
  body: string;
  milestone?: string;                    // "ARN generated and shared with you"
  isCompletion?: boolean;                // true on final step
  visual?: 'checklist' | 'upload' | 'form' | 'calendar' | 'stamp'; // icon type for stepper
}

export interface WhatsIncludedItem {
  title: string;
  body: string;
  comparisonWithout?: string;            // "CA asks for docs over WhatsApp, no tracking"
  comparisonWithOllvy?: string;          // "Documents collected in app, all stored permanently"
  mockVisualType?: 'receipt' | 'status' | 'checklist' | 'calendar' | 'arn'; // for mini mock UIs
  mockVisualData?: Record<string, string>; // data to populate the mock
}

export interface ServiceRisk {
  icon: 'clock' | 'mismatch' | 'document' | 'building' | 'alert';
  title: string;
  body: string;
}

export interface ProfilePersona {
  label: string;                         // "Missed last year's ITR"
  detail: string;                        // "We handle penalty calculation and belated filing"
}

export interface ServiceFaq {
  category: string;                      // "General" | "Process" | "Documents" | "After Completion"
  q: string;
  a: string;
}

export interface ReviewSource {
  name: string;
  url: string;
  description: string;
}

export interface UnlockItem {
  name: string;
  explanation: string;
  price: string;
  type: 'required' | 'beneficial';
  slug: string;                          // link to service page
}
```

---

### COMPLETE SERVICE DATA — 3 FULLY WRITTEN SERVICES

#### Pvt Ltd Incorporation

```typescript
// lib/services/pvt-ltd-incorporation.ts
export const pvtLtdIncorporation: ServiceConfig = {
  slug: 'pvt-ltd-incorporation',
  name: 'Private Limited Incorporation',
  shortName: 'Pvt Ltd',
  category: 'Registrations',
  tagline: 'One registration. Every door opens.',
  
  ollvyFee: 9999,
  govtFee: 15000,
  govtFeeLabel: 'MCA stamp duty',
  govtFeeNote: 'This fee is paid directly to the Ministry of Corporate Affairs. Ollvy collects it on your behalf and remits it in full. It varies slightly by state — ₹15,000 is the standard amount for most states.',
  
  slaDays: 15,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Founders registering a company in India',
  legalBasis: 'Companies Act 2013, Section 7',
  penaltyForMissing: undefined,
  penaltyColor: 'none',
  
  seoTitle: 'Private Limited Company Registration Online India | ₹24,999 | Ollvy',
  seoDescription: 'Register your Private Limited Company in India. Includes name reservation, DSC, DIN, MOA/AOA, and CIN. Fixed price ₹24,999 (₹9,999 Ollvy + ₹15,000 MCA). CA assigned within 4 hours.',
  canonicalUrl: 'https://ollvy.com/services/pvt-ltd-incorporation',
  
  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions — we build your personalised checklist',
      timeline: 'Day 0',
      body: 'Business type, number of directors, proposed company name (3 options recommended), registered state, and registered address type. A company secretary is assigned within 4 business hours. They review your answers and send you the exact document list — not a generic one.',
      visual: 'checklist',
      milestone: 'Company secretary assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0–1',
      body: 'PAN and Aadhaar for all directors, registered address proof (utility bill or NOC from owner), and your 3 proposed company names. All uploads stay in your account — nothing over WhatsApp. Your CS verifies each document and flags issues before filing, not after.',
      visual: 'upload',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'Name reservation and DSC arranged',
      timeline: 'Day 1–4',
      body: 'Your CS checks all 3 names against the MCA21 registry and trademark database simultaneously. Available names are submitted for reservation. DSC tokens are arranged for every director — each director completes a short video verification through the app. DINs are filed as part of SPICe+.',
      visual: 'form',
      milestone: 'Name reservation application submitted to MCA',
    },
    {
      step: 4,
      title: 'SPICe+ filed — MOA, AOA, PAN, TAN in one form',
      timeline: 'Day 5–12',
      body: 'SPICe+ is the integrated MCA form that handles incorporation, PAN, TAN, and GSTIN pre-enrollment in a single submission. Your CS drafts the Memorandum and Articles of Association, prepares the subscriber sheet, and files with the Registrar of Companies. MCA typically processes within 5–7 working days.',
      visual: 'form',
      milestone: 'SPICe+ submitted to MCA21',
    },
    {
      step: 5,
      title: 'CIN issued — your company exists',
      timeline: 'Day 12–15',
      body: 'MCA issues the Certificate of Incorporation with your Company Identification Number. Your PAN and TAN are generated simultaneously. All documents are uploaded to your Ollvy account and stored permanently. Your compliance calendar is populated with the first MCA annual filing due dates.',
      visual: 'stamp',
      milestone: 'Certificate of Incorporation issued',
      isCompletion: true,
    },
  ],
  
  whatsIncluded: [
    {
      title: 'Name reservation — 3 options checked simultaneously',
      body: 'We check all 3 proposed names against the MCA21 registry and trademark database before submitting any of them. Most CAs submit one name at a time and wait for rejection before trying the next — adding days to the timeline. We do all 3 in parallel.',
      comparisonWithout: 'Submit one name, wait for rejection, repeat',
      comparisonWithOllvy: '3 names checked in parallel — faster approval',
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'TECHBRIDGE INDIA PVT LTD — Checking...',
        row2: 'TECHBRIDGE SOLUTIONS PVT LTD — Available ✓',
        row3: 'TECHBRIDGE VENTURES PVT LTD — Checking...',
        note: 'Name 2 reserved — SPICe+ filed same day',
      },
    },
    {
      title: 'DSC arranged for all directors — including video verification',
      body: 'Digital Signature Certificates are required for all directors. We arrange the DSC tokens and each director completes the video verification through a guided flow in the app. Most founders find this confusing when doing it themselves — we walk through it step by step.',
      comparisonWithout: 'Navigate DSC portals yourself — typically 3–5 hours',
      comparisonWithOllvy: 'Guided flow in app — 15 minutes per director',
    },
    {
      title: 'MOA and AOA drafted — not templated',
      body: "The Memorandum and Articles of Association define your company's purpose, share structure, and governance rules. Your CS drafts these based on your business type and objectives — not a standard template. If your business has specific operational requirements, they're reflected in the MOA.",
      comparisonWithout: 'Generic MOA — may need amendment later',
      comparisonWithOllvy: 'Drafted for your specific business and share structure',
    },
    {
      title: 'PAN, TAN, and compliance calendar — included',
      body: 'PAN and TAN are generated as part of SPICe+ at no extra step. Once the CIN is issued, your Ollvy compliance calendar is automatically populated with every annual obligation: MCA annual return, Director KYC (Sep 30), Business ITR (Oct 31), and audit requirements based on company size.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'MCA Annual Return — Due Sep 30 (AOC-4 + MGT-7)',
        row2: 'Director KYC (DIR-3) — Due Sep 30 every year',
        row3: 'Business ITR (ITR-6) — Due Oct 31 every year',
        note: 'Added to your calendar automatically',
      },
    },
    {
      title: 'All documents in your account — permanently',
      body: 'Certificate of Incorporation, MOA, AOA, PAN card, TAN letter, share certificates, and DSC details — all stored in your Ollvy account permanently. Not emailed to you and lost. Your CA will ask for these repeatedly over the years. They\'ll always be here.',
    },
  ],
  
  serviceRisks: [
    {
      icon: 'document',
      title: 'Name rejected by MCA',
      body: 'The most common reason incorporations take longer than 15 days. MCA rejects names identical or similar to existing companies, or containing restricted words (Bank, Insurance, Exchange, etc.). Submitting 3 distinct names in parallel is the standard workaround — which is what we do. If all 3 are rejected, we suggest 3 alternatives at no extra cost.',
    },
    {
      icon: 'alert',
      title: 'Registered address utility bill mismatch',
      body: 'The registered office address must match the utility bill exactly — building name, floor, area, and pin code. Many founders use their home address (legal) with an old utility bill in a family member\'s name. MCA raises a query. Your CS does a pre-submission check and catches this before filing.',
    },
    {
      icon: 'clock',
      title: 'One director slow on DSC video verification',
      body: 'SPICe+ cannot be filed until all directors complete DSC verification. If one director is travelling or unresponsive, it stalls the entire application. Ollvy tracks completion status and sends daily reminders. The video itself takes 10 minutes — it just needs to actually happen.',
    },
  ],
  
  profilePersonas: [
    { label: 'First-time founder', detail: 'Never done this before. We explain every step before you take it.' },
    { label: 'Solo director', detail: 'Single-director company. MOA is drafted to reflect full operational authority.' },
    { label: 'Two co-founders, different cities', detail: 'DSC video verification done remotely. Common situation, handled.' },
    { label: 'Home address as registered office', detail: 'Fully legal. We verify the address proof requirements before filing.' },
  ],
  
  reviewKeywordChips: ['✓ Done in time', '✓ CS was responsive', '✓ No surprises on fees', '✓ All docs explained', '✓ CIN on day 13'],
  
  relatedSlugs: ['gst-registration', 'director-kyc', 'mca-annual-filing', 'trademark-registration'],
  
  faqs: [
    { category: 'General', q: 'What is a Private Limited Company?', a: 'A Pvt Ltd is a separate legal entity from its owners. It can own assets, enter contracts, take on employees, and raise funding. Liability is limited to share capital — your personal assets are protected. It\'s the default entity type for startups that plan to raise investment.' },
    { category: 'General', q: 'Is Pvt Ltd right for me, or should I do an LLP?', a: 'Pvt Ltd if you plan to raise equity funding, hire employees, or need the company name to carry credibility. LLP if the business is a professional services practice (consulting, architecture, etc.) or if the founding team prefers profit-sharing over salary+dividend structure. We can help you decide — WhatsApp us.' },
    { category: 'General', q: 'Can I use my home address as the registered office?', a: 'Yes. There is no restriction on using a residential address. You\'ll need a utility bill (electricity or water, within 2 months) in the name of the owner, or an NOC from the property owner if you\'re a tenant.' },
    { category: 'Process', q: 'What happens if my proposed name is rejected?', a: 'Your CS will notify you immediately and suggest 3 alternatives based on your business type. We refile at no extra charge. Name rejections add 3–5 days to the timeline — which is why we recommend submitting 3 distinct names from the start.' },
    { category: 'Process', q: 'How long does it actually take?', a: 'Most incorporations are done in 12–15 working days. The timeline depends entirely on MCA processing speed (which Ollvy cannot control) and how quickly all directors complete DSC verification. Our SLA is 15 working days. We\'ve never breached it for a well-documented application.' },
    { category: 'Documents', q: 'What if a director doesn\'t have an Aadhaar-linked mobile number?', a: 'Aadhaar-based OTP verification is required for SPICe+. If a director\'s mobile is not linked to Aadhaar, it must be linked through UIDAI before we can proceed. This typically takes 2–3 days and must be done by the director in person at any Aadhaar enrollment centre.' },
    { category: 'After Completion', q: 'What are my compliance obligations after incorporation?', a: 'Immediately: open a current account within 30 days. Within 2 months: hold the first board meeting. Annual: MCA annual return (AOC-4 + MGT-7), Director KYC by Sep 30, Business ITR by Oct 31. Ollvy adds all of these to your compliance calendar automatically.' },
    { category: 'After Completion', q: 'Does this include GST registration?', a: 'No. GST registration is a separate service (₹8,999). It\'s mandatory once your turnover crosses ₹40L (₹20L for service businesses). If you already know you\'ll need it, you can book both together — no discount, but both CAs are assigned the same day.' },
  ],
  
  reviewSources: [
    { name: 'MCA21 Portal', url: 'https://www.mca.gov.in', description: 'Ministry of Corporate Affairs — company registry and SPICe+ documentation' },
    { name: 'Companies Act, 2013', url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf', description: 'Section 7: Incorporation requirements. Section 139: Audit requirements.' },
    { name: 'SPICe+ Form Guide', url: 'https://www.mca.gov.in/content/mca/global/en/mca/spice-plus.html', description: 'Official SPICe+ user manual — MCA21' },
  ],
  
  unlocks: [
    { name: 'GST Registration', explanation: 'Mandatory once turnover crosses ₹40L. Required to issue GST invoices.', price: '₹8,999', type: 'required', slug: 'gst-registration' },
    { name: 'Director KYC (DIR-3)', explanation: 'Annual KYC for every director. Due Sep 30 each year. ₹5,000/day penalty if missed.', price: '₹1,499/director', type: 'required', slug: 'director-kyc' },
    { name: 'MCA Annual Filing', explanation: 'AOC-4 and MGT-7 due every year. Non-compliance: ₹100/day penalty.', price: '₹6,999/year', type: 'required', slug: 'mca-annual-filing' },
    { name: 'Business ITR', explanation: 'ITR-6 due Oct 31 annually. Required regardless of profit or loss.', price: '₹11,999', type: 'required', slug: 'business-itr' },
    { name: 'Trademark Registration', explanation: 'Protect your brand under your registered company name. Ownership is cleaner after incorporation.', price: '₹7,999', type: 'beneficial', slug: 'trademark-registration' },
  ],
  
  showCompletionStats: false,
  showApprovalRate: false,
};
```

#### GST Registration

```typescript
// lib/services/gst-registration.ts
export const gstRegistration: ServiceConfig = {
  slug: 'gst-registration',
  name: 'GST Registration',
  shortName: 'GST Reg',
  category: 'Registrations',
  tagline: 'Your GSTIN, applied for and obtained. We handle every step.',
  
  ollvyFee: 8999,
  govtFee: undefined,
  
  slaDays: 7,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Businesses above ₹40L turnover (₹20L for services)',
  legalBasis: 'CGST Act 2017, Section 22',
  penaltyForMissing: '100% of tax due + ₹10,000 minimum',
  penaltyColor: 'red',
  
  seoTitle: 'GST Registration Online India — GSTIN in 7 Days | ₹8,999 | Ollvy',
  seoDescription: 'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. CA assigned same day. ARN shared within 24 hours of filing.',
  canonicalUrl: 'https://ollvy.com/services/gst-registration',
  
  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions — we build your personalised checklist',
      timeline: 'Day 0',
      body: 'Business type, state, annual turnover estimate, supply type (goods / services / both), and whether you need voluntary registration. A CA is assigned within 4 hours. They review your answers and generate a specific document checklist — not the standard 20-item government list. If you\'re a sole proprietor with domestic sales only, you get 4 documents. Not 20.',
      visual: 'checklist',
      milestone: 'CA assigned, personalised checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0–1',
      body: 'Your CA sends the list in the app. You upload directly — photos from your phone are fine for most documents. Your CA reviews every upload before filing. Blurry Aadhaar, mismatched address, wrong file format — caught here, not after the officer raises a query.',
      visual: 'upload',
      milestone: 'Documents verified by CA',
    },
    {
      step: 3,
      title: 'Application filed — ARN in 24 hours',
      timeline: 'Day 1–2',
      body: 'Your CA files GST REG-01 on the GSTN portal. An Application Reference Number is generated immediately on submission. We share the ARN in the app the same day. You can verify the status yourself at gstn.gov.in → Search Taxpayer → Search by ARN. We encourage this — you shouldn\'t have to trust us blindly.',
      visual: 'form',
      milestone: 'ARN generated — sent to your app',
    },
    {
      step: 4,
      title: 'If an officer query arrives, your CA handles it',
      timeline: 'Day 3–5 (if applicable)',
      body: 'GST officers sometimes request document clarifications within 7 days of filing. If this happens, your CA responds within 24 hours. This is within scope — it\'s not an extra charge. The most common queries are Aadhaar verification issues and address proof mismatches. Both are resolvable.',
      visual: 'form',
    },
    {
      step: 5,
      title: 'GSTIN issued',
      timeline: 'Day 5–7',
      body: 'GSTN issues your GSTIN. It\'s permanent — no renewal, no expiry. Delivered to your app immediately. Your Ollvy compliance calendar is updated automatically with your first GSTR-1 due date (11th of next month) and GSTR-3B due date (20th of next month). You don\'t set them manually.',
      visual: 'stamp',
      isCompletion: true,
      milestone: 'GSTIN active on GSTN portal',
    },
  ],
  
  whatsIncluded: [
    {
      title: 'CA handles the GSTN portal — all 23 fields',
      body: 'The GST REG-01 form on the government portal has 23 fields across 5 tabs, requires documents in specific formats, and times out after inactivity. Your CA fills the entire form. You answer 5 questions in the app.',
      comparisonWithout: '23 fields · 5 tabs · 3–4 hours on GSTN portal',
      comparisonWithOllvy: '5 questions in app · ~4 minutes',
      mockVisualType: 'status',
      mockVisualData: {
        label: 'GST REG-01 Application',
        row1: 'Business details — complete ✓',
        row2: 'Promoter details — complete ✓',
        row3: 'Principal place of business — complete ✓',
        row4: 'Bank account — complete ✓',
        row5: 'Aadhaar authentication — complete ✓',
      },
    },
    {
      title: 'ARN shared immediately — you can verify it yourself',
      body: 'The moment your CA files, the GSTN portal generates an Application Reference Number. We share it in your app the same day. Go to gstn.gov.in, enter your ARN, and verify the status yourself. We tell you to do this because it builds trust — and because it\'s your registration, not ours.',
      mockVisualType: 'arn',
      mockVisualData: {
        label: 'Application Reference Number',
        value: 'AA070125XXXXXXX',
        status: 'Pending Processing',
        filed: 'Filed 18 Mar · 12:43 PM',
        verify: 'Verify at gstn.gov.in',
      },
    },
    {
      title: 'Officer queries handled — included in ₹8,999',
      body: 'If a GST officer requests clarification within 7 days of filing, your CA responds within 24 hours. Document queries are in scope. This is the thing that trips people up: they get an application themselves, then face a query and have to pay extra to resolve it. Not here.',
      comparisonWithout: 'Officer query = new CA engagement, extra fees',
      comparisonWithOllvy: 'Query response included in ₹8,999',
    },
    {
      title: 'Compliance calendar auto-populated',
      body: 'The moment your GSTIN is issued, Ollvy adds your GSTR-1 and GSTR-3B due dates to your compliance calendar. If your turnover qualifies for quarterly filing (below ₹1.5Cr), the calendar reflects that. The first deadline doesn\'t sneak up on you.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'GSTR-1 — Due 11 Apr (first cycle)',
        row2: 'GSTR-3B — Due 20 Apr (first cycle)',
        row3: 'GSTR-9 (Annual) — Due Dec 31 2025',
        note: 'Auto-added when GSTIN issued',
      },
    },
  ],
  
  serviceRisks: [
    {
      icon: 'document',
      title: 'Aadhaar mobile number not linked or changed',
      body: 'GST registration requires Aadhaar-based OTP authentication. If the mobile number linked to your Aadhaar has changed or was never linked, the OTP step fails. Fixing this requires a visit to an Aadhaar enrollment centre — it cannot be done online or by Ollvy. Takes 2–3 days. This is the most common delay.',
    },
    {
      icon: 'mismatch',
      title: 'Business address doesn\'t match the utility bill exactly',
      body: 'The address on your application must match the utility bill field by field — building name, floor, area name, pin code. Officers raise queries on any mismatch, including spelling variations. Your CA does a pre-submission check and catches this — but document quality (old bills, unclear scans) is the applicant\'s side of the problem.',
    },
  ],
  
  profilePersonas: [
    { label: 'Registering voluntarily (below threshold)', detail: 'Voluntary registration is handled identically. Full service, same fee.' },
    { label: 'E-commerce seller', detail: 'E-commerce sellers must register regardless of turnover. We know the GSTN category.' },
    { label: 'Interstate supply', detail: 'Interstate supply triggers mandatory registration regardless of turnover. Handled.' },
    { label: 'Aadhaar mobile issue', detail: 'If your Aadhaar mobile needs updating, we tell you exactly what to do and wait for it.' },
  ],
  
  reviewKeywordChips: ['✓ ARN same day', '✓ No govt fee', '✓ CA was clear', '✓ Fast', '✓ Done in 5 days'],
  
  relatedSlugs: ['gst-monthly-filing', 'pvt-ltd-incorporation', 'business-itr', 'iec-code'],
  
  faqs: [
    { category: 'General', q: 'Is GST registration mandatory for my business?', a: 'Mandatory if annual turnover exceeds ₹40L (₹20L for service businesses, ₹10L for North-East states). Also mandatory regardless of turnover if you supply interstate, sell through e-commerce platforms, or want to claim input tax credit.' },
    { category: 'General', q: 'How long does a GSTIN stay valid?', a: 'Permanent. No renewal or expiry. It can be voluntarily cancelled if the business closes or falls below threshold, but it doesn\'t expire on its own.' },
    { category: 'General', q: 'Can I use a home address as my business address?', a: 'Yes, for most business types. You\'ll need a utility bill (electricity or water, within 2 months) or an NOC from the property owner if you\'re a tenant.' },
    { category: 'Process', q: 'Can I track my application status myself?', a: 'Yes. Once your CA files, we share the ARN in the app. Go to gstn.gov.in → Search Taxpayer → Search by ARN. You\'ll see the real-time status directly on the government portal.' },
    { category: 'Process', q: 'What if my application gets rejected?', a: 'Application rejection is rare if documents are correct. If it happens, your CA will rectify the deficiency and refile at no extra charge. If the rejection is due to something outside our scope (e.g., an existing CIN mismatch), we\'ll tell you exactly what needs to be fixed first.' },
    { category: 'Documents', q: 'What if my Aadhaar mobile number is different from my current number?', a: 'The GSTN portal uses your Aadhaar-registered mobile for OTP verification. If it\'s changed, you need to update it through UIDAI first. Visit any Aadhaar enrollment centre with your Aadhaar and new mobile number. Takes 2–3 days. We wait.' },
    { category: 'After Registration', q: 'What are my monthly obligations after getting a GSTIN?', a: 'File GSTR-1 (outward supplies) by the 11th of every month and GSTR-3B (net tax payment) by the 20th. If turnover is below ₹1.5Cr, you may qualify for quarterly filing. Ollvy\'s compliance calendar is set up automatically — or you can book a GST Monthly Filing retainer.' },
    { category: 'After Registration', q: 'Can I add more business locations later?', a: 'Yes. Additional places of business are added via GST REG-14 (amendment). Ollvy handles amendments as a separate service (₹1,499).' },
  ],
  
  reviewSources: [
    { name: 'GSTN Portal', url: 'https://www.gstn.gov.in', description: 'Official GSTIN registry, REG-01 form, and ARN tracking' },
    { name: 'CGST Act 2017 — Section 22', url: 'https://www.gst.gov.in/download/cgstact', description: 'Mandatory registration thresholds and voluntary registration rules' },
    { name: 'GST Council Circulars', url: 'https://www.gst.gov.in/newsandupdates/circulars', description: 'Threshold notifications and amendment circulars' },
  ],
  
  showCompletionStats: false,
  showApprovalRate: false,
};
```

#### Director KYC (DIR-3)

```typescript
// lib/services/director-kyc.ts
export const directorKyc: ServiceConfig = {
  slug: 'director-kyc',
  name: 'Director KYC (DIR-3 KYC)',
  shortName: 'Director KYC',
  category: 'Registrations',
  tagline: 'Two documents. Filed before Sep 30. DIN stays active.',
  
  ollvyFee: 1499,
  govtFee: undefined,
  
  slaDays: 2,
  isRetainer: false,
  serviceType: 'Annual',
  mandatoryFor: 'All directors of Indian companies — every year',
  legalBasis: 'Companies Act 2013, Section 155; MCA Notification dated 2018',
  penaltyForMissing: '₹5,000/day until filed + DIN deactivated',
  penaltyColor: 'red',
  
  seoTitle: 'Director KYC Filing (DIR-3 KYC) — Due Sep 30 | ₹1,499 | Ollvy',
  seoDescription: 'File DIR-3 KYC before Sep 30. Avoid ₹5,000/day penalty and DIN deactivation. Fixed price ₹1,499 per director. Done in 2 working days.',
  canonicalUrl: 'https://ollvy.com/services/director-kyc',
  
  processSteps: [
    {
      step: 1,
      title: 'Share your DIN and 2 documents',
      timeline: 'Day 0',
      body: 'Your DIN (Director Identification Number), PAN card, and Aadhaar card. That\'s it. A company secretary is assigned within 2 hours. No long onboarding. This is a simple annual filing that most founders procrastinate on until it\'s urgent.',
      visual: 'upload',
      milestone: 'CS assigned',
    },
    {
      step: 2,
      title: 'Mobile and email OTP verification',
      timeline: 'Day 0',
      body: 'DIR-3 KYC requires verification via the mobile number registered against your DIN (the one used when you first became a director). Your CS guides you through the OTP step. Takes 5 minutes. If your registered mobile has changed, your CS handles the mobile update process first.',
      visual: 'form',
      milestone: 'OTP verification complete',
    },
    {
      step: 3,
      title: 'DIR-3 KYC filed — DIN active confirmed',
      timeline: 'Day 1–2',
      body: 'Your CS files DIR-3 KYC on the MCA21 portal. MCA processes it within 24–48 hours. Your DIN status is verified as Active in the MCA registry. Confirmation is uploaded to your Ollvy account. Done for the year.',
      visual: 'stamp',
      isCompletion: true,
      milestone: 'DIR-3 KYC filed and acknowledged',
    },
  ],
  
  whatsIncluded: [
    {
      title: 'Filed on MCA21 — acknowledgement in your account',
      body: 'Your CS files directly on the MCA21 portal. The acknowledgement receipt is uploaded to your Ollvy account. If an officer asks for proof later, it\'s there.',
      mockVisualType: 'status',
      mockVisualData: {
        label: 'DIR-3 KYC Status',
        row1: 'DIN: 0XXXXXXX — Active ✓',
        row2: 'Filed: 12 Sep 2025',
        row3: 'Acknowledged by MCA: 13 Sep 2025',
        note: 'Stored in your account permanently',
      },
    },
    {
      title: 'Covers OTP verification issues',
      body: 'If your DIN-registered mobile number has changed, your CS handles the update process on MCA21 first. Mobile update is in scope — it\'s a common complication that most founders don\'t discover until they try to file.',
      comparisonWithout: 'Mobile change = stalled application',
      comparisonWithOllvy: 'CS handles mobile update before filing',
    },
  ],
  
  serviceRisks: [
    {
      icon: 'clock',
      title: 'Mobile number registered against DIN has changed',
      body: 'DIR-3 KYC requires OTP on the mobile number you used when you first registered as a director. If that number is no longer active, you need to update it on MCA21 before filing. This adds 1–2 days. Tell us upfront if your mobile has changed and we handle it.',
    },
    {
      icon: 'alert',
      title: 'DIN already deactivated — ₹5,000/day accruing',
      body: 'If you\'re reading this after Sep 30, your DIN may already be deactivated. DIN reactivation (DIR-3 KYC filing with penalty payment) is still within this service scope. The penalty is ₹5,000 flat (not per day retroactively) for late filing. File immediately to stop the clock.',
    },
  ],
  
  profilePersonas: [
    { label: 'Never heard of this deadline', detail: 'Most directors haven\'t. That\'s why the penalty rate is so high. We handle it before Sep 30.' },
    { label: 'Already missed the deadline', detail: 'DIN reactivation is covered in this service. File now to stop further penalty.' },
    { label: 'Multiple directors in company', detail: 'Book once per director. Each gets their own filing and acknowledgement.' },
  ],
  
  reviewKeywordChips: ['✓ Done in 2 days', '✓ Simple process', '✓ No extra charges', '✓ Reminder next year'],
  
  relatedSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'business-itr'],
  
  faqs: [
    { category: 'General', q: 'What happens if I miss the Sep 30 deadline?', a: 'Your DIN is deactivated from Oct 1. You cannot sign any MCA document, board resolution, or financial statement. Penalty is ₹5,000 flat for late filing (paid at the time of filing). File immediately once you miss it — every day of delay doesn\'t add more penalty, but you remain unable to sign anything.' },
    { category: 'General', q: 'Is this required every year?', a: 'Yes. DIR-3 KYC must be filed by Sep 30 every year for every director. There is no exception based on company size or activity status. Dormant company directors still need to file.' },
    { category: 'Process', q: 'My company has 3 directors. Do all 3 need to file?', a: 'Yes. Each director\'s DIN is separate and each must file their own DIR-3 KYC. Book once per director at ₹1,499 each.' },
    { category: 'Documents', q: 'What documents do I need?', a: 'PAN card, Aadhaar card, and your DIN. The mobile number registered against your DIN must be active for OTP. If it\'s changed, tell us upfront.' },
    { category: 'After Completion', q: 'When will my DIN show as Active on MCA?', a: 'Within 24–48 hours of filing. You can check at mca.gov.in → MCA Services → DIN Services → Verify DIN Status. Enter your DIN and see the status directly.' },
  ],
  
  reviewSources: [
    { name: 'MCA21 — DIR-3 KYC Form', url: 'https://www.mca.gov.in/Ministry/pdf/Dir3KYCForm.pdf', description: 'Official DIR-3 KYC form and instructions' },
    { name: 'Companies Act 2013, Section 155', url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf', description: 'Director identification number provisions' },
    { name: 'MCA Notification — DIN KYC', url: 'https://www.mca.gov.in/Ministry/pdf/DINKYCNotification.pdf', description: 'Annual KYC mandate notification (2018)' },
  ],
  
  showCompletionStats: false,
  showApprovalRate: false,
};
```

---

### COMPONENT IMPLEMENTATIONS

#### `app/services/[slug]/page.tsx`

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_CONFIGS } from '@/lib/services';
import { ServicePage } from '@/components/service/ServicePage';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SERVICE_CONFIGS.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = SERVICE_CONFIGS.find(s => s.slug === params.slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: service.canonicalUrl },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: service.canonicalUrl,
      type: 'website',
    },
  };
}

export default function ServicePageRoute({ params }: Props) {
  const service = SERVICE_CONFIGS.find(s => s.slug === params.slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
```

---

#### `components/service/ServicePage.tsx`

```typescript
'use client';
import { useState, useRef, useEffect } from 'react';
import { ServiceConfig } from '@/lib/services';
import { ServiceHero } from './ServiceHero';
import { StickyBar } from './StickyBar';
import { BookingPanel } from './BookingPanel';
import { ServiceInfoTab } from './tabs/ServiceInfoTab';
import { WhatsIncludedTab } from './tabs/WhatsIncludedTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { WhyOllvyTab } from './tabs/WhyOllvyTab';
import { FaqsTab } from './tabs/FaqsTab';
import { HowWeReviewed } from './HowWeReviewed';

export type ServiceTab = 'Service Info' | "What's Included" | 'Why Ollvy' | 'Reviews' | 'Documents' | 'FAQs';
const TABS: ServiceTab[] = ['Service Info', "What's Included", 'Why Ollvy', 'Reviews', 'Documents', 'FAQs'];

export function ServicePage({ service }: { service: ServiceConfig }) {
  const [activeTab, setActiveTab] = useState<ServiceTab>('Service Info');
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Sticky bar: show when hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Tab scroll anchoring
  const scrollToTab = (tab: ServiceTab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    provider: {
      '@type': 'Organization',
      name: 'Ollvy Technologies Private Limited',
      url: 'https://ollvy.com',
    },
    offers: {
      '@type': 'Offer',
      price: (service.ollvyFee + (service.govtFee ?? 0)).toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <StickyBar
        service={service}
        visible={!heroVisible}
        activeTab={activeTab}
        onTabClick={scrollToTab}
      />
      
      {/* Hero */}
      <div ref={heroRef}>
        <ServiceHero
          service={service}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
      
      {/* Main layout: left content + right sticky booking panel */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          {/* Left: tab content */}
          <div className="min-w-0">
            <div ref={el => { tabRefs.current['Service Info'] = el; }}>
              {activeTab === 'Service Info' && <ServiceInfoTab service={service} />}
            </div>
            <div ref={el => { tabRefs.current["What's Included"] = el; }}>
              {activeTab === "What's Included" && <WhatsIncludedTab service={service} />}
            </div>
            <div ref={el => { tabRefs.current['Why Ollvy'] = el; }}>
              {activeTab === 'Why Ollvy' && <WhyOllvyTab service={service} />}
            </div>
            <div ref={el => { tabRefs.current['Reviews'] = el; }}>
              {activeTab === 'Reviews' && <ReviewsTab service={service} />}
            </div>
            <div ref={el => { tabRefs.current['Documents'] = el; }}>
              {activeTab === 'Documents' && <DocumentsTab service={service} />}
            </div>
            <div ref={el => { tabRefs.current['FAQs'] = el; }}>
              {activeTab === 'FAQs' && <FaqsTab service={service} />}
            </div>
            
            {/* Always at bottom regardless of tab */}
            <HowWeReviewed service={service} />
          </div>
          
          {/* Right: sticky booking panel */}
          <div className="hidden lg:block">
            <BookingPanel service={service} />
          </div>
        </div>
      </div>
      
      {/* Mobile booking bar — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-mono font-bold text-foreground">
            ₹{(service.ollvyFee + (service.govtFee ?? 0)).toLocaleString('en-IN')}
          </p>
        </div>
        <Button size="lg" className="flex-1 ml-4">Book Now</Button>
      </div>
    </>
  );
}
```

---

#### `components/service/ServiceHero.tsx`

```typescript
'use client';
import Link from 'next/link';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getGuaranteedDate } from '@/lib/dates';
import { ServiceConfig } from '@/lib/services';
import { ServiceTab } from './ServicePage';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const TABS: ServiceTab[] = ['Service Info', "What's Included", 'Why Ollvy', 'Reviews', 'Documents', 'FAQs'];

export function ServiceHero({ service, activeTab, onTabClick }: {
  service: ServiceConfig;
  activeTab: ServiceTab;
  onTabClick: (tab: ServiceTab) => void;
}) {
  const guaranteedDate = service.isRetainer
    ? service.nextDueDate?.()
    : getGuaranteedDate(service.slaDays);

  // Dynamic rating from API
  const { data: stats } = useSWR(
    `/functions/v1/get-service-stats?slug=${service.slug}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  );
  const showRating = stats?.total_ratings_count >= 10;

  return (
    <section className="relative bg-background border-b border-border overflow-hidden">
      {/* Radial glow — green for no-penalty services, amber for penalty-driven */}
      <div className={cn(
        "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_transparent_60%)]",
        service.penaltyColor === 'red'
          ? "bg-[radial-gradient(ellipse_at_50%_0%,hsl(0_72%_45%_/_0.05),transparent_60%)]"
          : "bg-[radial-gradient(ellipse_at_50%_0%,hsl(142_71%_35%_/_0.05),transparent_60%)]"
      )} />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-10 pb-0">
        
        {/* Breadcrumb */}
        <p className="text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Ollvy</Link>
          <span className="mx-1.5">→</span>
          <Link href={`/?category=${service.category}`} className="hover:text-foreground transition-colors capitalize">
            {service.category}
          </Link>
          <span className="mx-1.5">→</span>
          <span className="text-foreground">{service.shortName}</span>
        </p>

        {/* Service name */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display max-w-[680px] leading-tight">
          {service.name}
        </h1>

        {/* Tagline */}
        <p className="text-base text-muted-foreground mt-2 max-w-[480px]">
          {service.tagline}
        </p>

        {/* Guaranteed date + rating row */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          {guaranteedDate && (
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-4 py-1.5">
              <CheckCircle size={13} className="text-[hsl(var(--ollvy-green))] shrink-0" />
              <span className="text-sm font-medium text-[hsl(var(--ollvy-green-fg))]">
                {service.isRetainer
                  ? `Current cycle due: ${guaranteedDate}`
                  : `Done by ${guaranteedDate}, guaranteed`
                }
              </span>
            </div>
          )}
          {showRating && (
            <div className="inline-flex items-center gap-1.5">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {stats.avg_rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({stats.total_ratings_count.toLocaleString('en-IN')} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
          {[
            { label: 'For', value: service.mandatoryFor },
            { label: 'Type', value: service.serviceType },
            { label: 'Turnaround', value: `${service.slaDays} working days` },
            ...(service.penaltyForMissing ? [{
              label: 'Penalty if missed',
              value: service.penaltyForMissing,
              isWarning: true,
            }] : []),
          ].map((item, i, arr) => (
            <div key={item.label} className="flex items-start gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {item.label}
                </p>
                <p className={cn(
                  "text-sm font-medium mt-0.5",
                  'isWarning' in item && item.isWarning
                    ? "text-[hsl(var(--ollvy-amber))]"
                    : "text-foreground"
                )}>
                  {item.value}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden sm:block w-px bg-border self-stretch" />
              )}
            </div>
          ))}
        </div>

        {/* Tab navigation — flush to bottom of hero section */}
        <nav
          className="flex gap-0 mt-8 border-b border-border -mx-6 px-6 overflow-x-auto scrollbar-none"
          role="tablist"
        >
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => onTabClick(tab)}
              className={cn(
                "shrink-0 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
```

---

#### `components/service/BookingPanel.tsx`

```typescript
'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { getGuaranteedDate } from '@/lib/dates';
import { ServiceConfig } from '@/lib/services';

export function BookingPanel({ service }: { service: ServiceConfig }) {
  const guaranteedDate = service.isRetainer
    ? service.nextDueDate?.()
    : getGuaranteedDate(service.slaDays);

  const totalFee = service.ollvyFee + (service.govtFee ?? 0);

  const handleBook = () => {
    // Navigate to booking flow with UTM
    window.location.href = `/book/${service.slug}?utm_source=service_page&utm_medium=booking_panel&utm_content=${service.slug}`;
  };

  return (
    <Card className="sticky top-24 border border-border bg-card p-6 w-full">
      
      {/* Guaranteed date at top — Atlys Image 1 pattern */}
      {guaranteedDate && (
        <div className="flex items-center gap-2 pb-5 border-b border-border mb-5">
          <CheckCircle size={14} className="text-[hsl(var(--ollvy-green))] shrink-0" />
          <p className="text-sm font-semibold text-foreground">
            {service.isRetainer
              ? `Current cycle due: ${guaranteedDate}`
              : `Guaranteed by ${guaranteedDate}`
            }
          </p>
        </div>
      )}

      {/* Total amount — prominent */}
      <div className="mb-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Total to pay now</p>
        <p className="font-mono text-4xl font-bold text-foreground mt-1">
          ₹{totalFee.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Fee breakdown — Atlys Canada Image 1 pattern */}
      <div className="mt-5 space-y-3">
        
        {/* Ollvy fee */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[hsl(var(--ollvy-green))]/20 flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle size={11} className="text-[hsl(var(--ollvy-green))]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ollvy fee</p>
              <p className="text-xs text-muted-foreground mt-0.5">Includes CA, tracking, and support</p>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            ₹{service.ollvyFee.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Govt fee — only if applicable */}
        {service.govtFee && service.govtFee > 0 && (
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5 shrink-0">
                {/* Bank/govt icon */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{service.govtFeeLabel ?? 'Government fee'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {service.govtFeeNote ?? 'Paid to the government. Not retained by Ollvy.'}
                </p>
              </div>
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              ₹{service.govtFee.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Total line */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-sm font-semibold text-foreground">Total Amount</span>
          <span className="font-mono text-lg font-bold text-foreground">
            ₹{totalFee.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <Button
        className="w-full mt-5"
        size="lg"
        onClick={handleBook}
      >
        Book Now — ₹{totalFee.toLocaleString('en-IN')}
      </Button>

      {/* GST invoice note */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        GST-compliant invoice generated at checkout
      </p>

      {/* Have queries — Atlys Canada pattern */}
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Questions about documents, process, or price?
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            asChild
          >
            <a href="https://wa.me/91XXXXXXXXXX?text=Hi, I have a question about {service.name}">
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
            <a href="tel:+91XXXXXXXXXX">
              <Phone size={13} />
              Call
            </a>
          </Button>
        </div>
      </div>

      {/* Trust micro-signals */}
      <div className="mt-4 space-y-1.5">
        {[
          'GST-compliant invoice included',
          'Engagement letter before you pay',
          'Cancel within 2 hours for full refund',
        ].map(line => (
          <p key={line} className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle size={10} className="text-[hsl(var(--ollvy-green))] shrink-0" />
            {line}
          </p>
        ))}
      </div>
    </Card>
  );
}
```

---

#### `components/service/tabs/ServiceInfoTab.tsx`

```typescript
'use client';
import { ServiceConfig } from '@/lib/services';
import { CompletionStats } from '../CompletionStats';
import { ProcessStepper } from '../ProcessStepper';
import { ServiceRisks } from '../ServiceRisks';
import { ProfilePersonas } from '../ProfilePersonas';
import { RelatedServices } from '../RelatedServices';

export function ServiceInfoTab({ service }: { service: ServiceConfig }) {
  return (
    <div className="space-y-12">
      
      {/* Stats widget — hidden until service.showCompletionStats */}
      {service.showCompletionStats && (
        <CompletionStats service={service} />
      )}

      {/* Process stepper — Atlys Canada Steps 1–5 pattern */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-8">
          How {service.shortName} works on Ollvy
        </h2>
        <ProcessStepper steps={service.processSteps} />
      </div>

      {/* Approval/filing rate — only if showApprovalRate */}
      {service.showApprovalRate && (
        <ApprovalRateBlock service={service} />
      )}

      {/* Profile personas — "We handle messy situations too" */}
      <ProfilePersonas personas={service.profilePersonas} serviceName={service.shortName} />

      {/* Service-specific risks */}
      <ServiceRisks
        risks={service.serviceRisks}
        serviceShortName={service.shortName}
      />

      {/* What this service unlocks */}
      {service.unlocks && service.unlocks.length > 0 && (
        <UnlocksBlock unlocks={service.unlocks} serviceName={service.shortName} />
      )}

      {/* Related services */}
      <RelatedServices slugs={service.relatedSlugs} />
    </div>
  );
}
```

---

#### `components/service/ProcessStepper.tsx`

This is the Atlys Canada steps carousel (Images 2–6) — animated stepper with progress indicator.

```typescript
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, ChevronLeft, ChevronRight, FileText, Upload, ClipboardList, Calendar, Stamp } from 'lucide-react';
import { ProcessStep } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_ICONS = {
  checklist: ClipboardList,
  upload: Upload,
  form: FileText,
  calendar: Calendar,
  stamp: CheckCircle,
};

export function ProcessStepper({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);

  const step = steps[active];
  const Icon = STEP_ICONS[step.visual ?? 'form'];

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      
      {/* Progress track — Atlys thin line with dot */}
      <div className="relative h-8 bg-background border-b border-border flex items-center px-6">
        {/* Track line */}
        <div className="absolute left-6 right-6 h-px bg-border top-1/2 -translate-y-1/2" />
        {/* Step dots */}
        <div className="relative flex justify-between w-full">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "w-3 h-3 rounded-full border-2 transition-all duration-200",
                i < active
                  ? "bg-[hsl(var(--ollvy-green))] border-[hsl(var(--ollvy-green))]"
                  : i === active
                  ? "bg-background border-foreground scale-125"
                  : "bg-background border-border hover:border-foreground/40"
              )}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
        {/* Active step label */}
        <div
          className="absolute top-5 text-xs text-muted-foreground font-mono transition-all duration-200"
          style={{
            left: `calc(${(active / (steps.length - 1)) * 100}% + ${active === 0 ? 0 : active === steps.length - 1 ? -28 : -16}px)`,
            transform: 'translateX(-50%)',
          }}
        >
          Step {active + 1}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-8 min-h-[280px] flex flex-col"
        >
          {/* Step icon */}
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center mb-5",
            step.isCompletion
              ? "bg-[hsl(var(--ollvy-green))]/15 text-[hsl(var(--ollvy-green))]"
              : "bg-muted text-muted-foreground"
          )}>
            <Icon size={18} />
          </div>

          {/* Title + timeline */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-lg font-semibold text-foreground leading-snug">
              {step.title}
            </h3>
            <span className="shrink-0 text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 font-mono">
              {step.timeline}
            </span>
          </div>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {step.body}
          </p>

          {/* Milestone — like Atlys "Application sent to immigration supervisor" */}
          {step.milestone && (
            <div className="mt-4 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                step.isCompletion
                  ? "bg-[hsl(var(--ollvy-green))]"
                  : "bg-muted-foreground"
              )} />
              <p className="text-xs text-muted-foreground">
                {step.isCompletion ? '✓ ' : ''}{step.milestone}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between px-8 pb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActive(prev => Math.max(0, prev - 1))}
          disabled={active === 0}
          className="gap-1.5"
        >
          <ChevronLeft size={14} />
          Previous Step
        </Button>
        {active < steps.length - 1 ? (
          <Button
            size="sm"
            onClick={() => setActive(prev => Math.min(steps.length - 1, prev + 1))}
            className="gap-1.5"
          >
            Next Step
            <ChevronRight size={14} />
          </Button>
        ) : (
          <Button size="sm" asChild>
            <a href="#book">Book this service →</a>
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

#### `components/service/tabs/WhyOllvyTab.tsx`

New tab — based on Atlys Canada "Why Atlys" (Images 8–9). The "we catch compliance gaps before notices arrive" positioning.

```typescript
'use client';
import { ServiceConfig } from '@/lib/services';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function WhyOllvyTab({ service }: { service: ServiceConfig }) {
  return (
    <div className="space-y-12">

      {/* ── 1. "We catch compliance gaps before notices arrive" ── */}
      {/* Atlys: "We catch red flags before embassies do" */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[hsl(var(--ollvy-green))]/10 border border-[hsl(var(--ollvy-green))]/20 rounded-full px-3 py-1 mb-5">
          <span className="text-xs font-medium text-[hsl(var(--ollvy-green-fg))]">Ollvy Guided</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground leading-snug">
          We file correctly.<br />Not just on time.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-[520px] leading-relaxed">
          Most CAs submit what you give them and hope for the best.
          Ollvy reviews your documents before filing — not after a notice arrives.
        </p>

        {/* Others vs Ollvy — Atlys Image 9 pattern */}
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-[560px]">
          <Card className="border border-border bg-muted/30 p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Others</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Take your documents as-is. Submit the application. 
              If there's a query or rejection, it's your problem.
            </p>
          </Card>
          <Card className="border border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5 p-5">
            <p className="text-xs uppercase tracking-widest text-[hsl(var(--ollvy-green-fg))] mb-3">Ollvy</p>
            <p className="text-sm text-foreground leading-relaxed">
              Review every document before filing. Catch mismatches,
              expired items, and format issues. Then file.
            </p>
          </Card>
        </div>
      </div>

      {/* ── 2. "We catch red flags before regulators do" — 4-step flow ── */}
      {/* Atlys: "we scan → we predict → we fix → we provide" */}
      <div>
        <Card className="border border-border bg-card p-8">
          <h3 className="text-base font-semibold text-foreground mb-6">
            We catch compliance gaps before regulators do.
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: 'we review', label: 'your documents', description: 'Every upload checked before anything is filed' },
              { step: 'we flag', label: 'the risks', description: 'Issues identified — expiry dates, mismatches, format errors' },
              { step: 'we fix', label: 'if possible', description: 'Fixable issues resolved before filing, not after' },
              { step: 'we file', label: 'correctly', description: 'Clean submission — lower chance of officer query' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <span className="text-xs font-mono font-bold text-foreground">{i + 1}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{item.step}</p>
                <p className="text-xs text-[hsl(var(--ollvy-green-fg))] mt-0.5">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 3. Profile personas — Atlys "all profile types approved" ── */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          We handle the messy situations too.
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          The situations most CAs decline or overcharge for.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.profilePersonas.map((persona, i) => (
            <div key={i} className="flex items-start gap-3 border border-border rounded-xl p-4 bg-card">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 font-mono text-xs font-bold text-muted-foreground">
                {persona.label[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{persona.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{persona.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Platform ratings — only when real data exists ── */}
      {/* ONLY render this block if real multi-platform review data is confirmed */}
      {/* Do not hardcode Trustpilot/App Store numbers — leave this block out until earned */}
      {/* 
      <PlatformRatings /> 
      */}

    </div>
  );
}
```

---

#### `components/service/tabs/WhatsIncludedTab.tsx`

```typescript
'use client';
import { ServiceConfig, WhatsIncludedItem } from '@/lib/services';
import { cn } from '@/lib/utils';

// Mini mock UI components — these are the visual fragments inside each item
function MockVisual({ type, data }: { type: WhatsIncludedItem['mockVisualType']; data?: Record<string, string> }) {
  if (!type || !data) return null;
  
  return (
    <div className="rounded-xl bg-background border border-border p-4 font-mono text-xs">
      {type === 'status' && (
        <div className="space-y-2">
          {data.label && <p className="text-muted-foreground mb-3 font-sans text-xs uppercase tracking-widest">{data.label}</p>}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => (
              <div key={k} className={cn(
                "flex items-center gap-2",
                v.includes('✓') ? "text-[hsl(var(--ollvy-green-fg))]" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  v.includes('✓') ? "bg-[hsl(var(--ollvy-green))]" : "bg-muted"
                )} />
                {v}
              </div>
            ))}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">{data.note}</p>
          )}
        </div>
      )}
      {type === 'arn' && (
        <div className="space-y-2">
          {data.label && <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">{data.label}</p>}
          <p className="text-foreground text-base font-bold tracking-wider">{data.value}</p>
          <p className="text-[hsl(var(--ollvy-green-fg))]">{data.status}</p>
          <p className="text-muted-foreground text-[10px]">{data.filed}</p>
          {data.verify && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-2 font-sans">{data.verify}</p>
          )}
        </div>
      )}
      {type === 'calendar' && (
        <div className="space-y-2">
          {data.label && <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest mb-2">{data.label}</p>}
          {Object.entries(data)
            .filter(([k]) => k.startsWith('row'))
            .map(([k, v]) => {
              const [name, ...rest] = v.split(' — ');
              return (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-foreground">{name}</span>
                  <span className="text-[hsl(var(--ollvy-amber))] text-[10px]">{rest.join(' — ')}</span>
                </div>
              );
            })}
          {data.note && (
            <p className="text-muted-foreground/60 text-[10px] border-t border-border pt-2 mt-1 font-sans">{data.note}</p>
          )}
        </div>
      )}
      {type === 'receipt' && (
        <div className="space-y-1.5">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className={cn(
              "flex justify-between",
              k === 'total' ? "font-bold text-foreground border-t border-border pt-1.5" : "text-muted-foreground"
            )}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WhatsIncludedTab({ service }: { service: ServiceConfig }) {
  const total = service.ollvyFee + (service.govtFee ?? 0);

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        What's included with ₹{service.ollvyFee.toLocaleString('en-IN')}
      </h2>
      <p className="text-sm text-muted-foreground mb-10">
        Everything your CA handles on your behalf. Nothing hidden.
      </p>

      <div className="divide-y divide-border">
        {service.whatsIncluded.map((item, index) => (
          <div
            key={index}
            className={cn(
              "grid gap-8 items-center py-12",
              item.mockVisualType ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}
          >
            {/* Visual — left on even, right on odd (alternating) */}
            {item.mockVisualType && (
              <div className={cn(
                "order-2",
                index % 2 === 1 ? "md:order-first" : "md:order-last"
              )}>
                <div className="max-w-[320px] mx-auto">
                  <MockVisual type={item.mockVisualType} data={item.mockVisualData} />
                </div>
              </div>
            )}

            {/* Text */}
            <div className={cn(item.mockVisualType ? "order-1" : "")}>
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {item.body}
              </p>

              {/* Comparison — Atlys DS-160 before/after pattern */}
              {(item.comparisonWithout || item.comparisonWithOllvy) && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Without Ollvy</p>
                    <p className="text-sm font-medium text-foreground">{item.comparisonWithout}</p>
                  </div>
                  <div className="bg-[hsl(var(--ollvy-green))]/5 rounded-lg p-3 border border-[hsl(var(--ollvy-green))]/20">
                    <p className="text-xs text-[hsl(var(--ollvy-green-fg))] uppercase tracking-widest mb-1.5">With Ollvy</p>
                    <p className="text-sm font-medium text-foreground">{item.comparisonWithOllvy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

#### `components/service/tabs/FaqsTab.tsx`

```typescript
'use client';
import { useState, useMemo } from 'react';
import { ServiceConfig } from '@/lib/services';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqsTab({ service }: { service: ServiceConfig }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(service.faqs.map(f => f.category))];
    return cats;
  }, [service.faqs]);

  const filtered = useMemo(() => {
    return service.faqs.filter(faq => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesSearch = !search ||
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [service.faqs, activeCategory, search]);

  return (
    <div className="max-w-[720px]">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Frequently asked questions
      </h2>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Ask anything about ${service.shortName}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-7">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              activeCategory === cat
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No questions matching "{search}". Try different words, or{' '}
          <a href="https://wa.me/91XXXXXXXXXX" className="text-foreground underline">ask us on WhatsApp</a>.
        </p>
      ) : (
        <Accordion type="single" collapsible className="space-y-0">
          {filtered.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-border last:border-0"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
```

---

#### `components/service/HowWeReviewed.tsx`

```typescript
'use client';
import { useState } from 'react';
import { ServiceConfig } from '@/lib/services';
import { FileText, History, ExternalLink } from 'lucide-react';
import { LAST_REVIEWED } from '@/constants/accuracy';

export function HowWeReviewed({ service }: { service: ServiceConfig }) {
  const [activeTab, setActiveTab] = useState<'sources' | 'history'>('sources');

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-sm font-semibold text-foreground mb-1">How we reviewed this page</h3>
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed max-w-[560px]">
        The penalty amounts, deadlines, and regulatory requirements on this page are sourced 
        directly from official government portals. We do not use secondary sources. 
        When regulations change, we update the page.
      </p>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-5">
        {(['sources', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors capitalize",
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground"
            )}
          >
            {tab === 'sources' ? <FileText size={11} /> : <History size={11} />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'sources' && (
        <ul className="space-y-3">
          {service.reviewSources.map(source => (
            <li key={source.name} className="flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
              <div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
                >
                  {source.name}
                  <ExternalLink size={9} className="opacity-50" />
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">{source.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'history' && (
        <div>
          <p className="text-xs text-muted-foreground">
            Last reviewed: <span className="text-foreground font-medium">{LAST_REVIEWED[service.slug] ?? 'March 2025'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Penalty amounts and deadlines are manually verified against source portals 
            when any regulatory update is announced. Update the{' '}
            <code className="bg-muted px-1 rounded text-[10px]">LAST_REVIEWED</code> constant 
            in <code className="bg-muted px-1 rounded text-[10px]">constants/accuracy.ts</code>{' '}
            after each review.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### HOMEPAGE VISUAL FIX — §6 TRUST LAYER

The trust cards (Image 3 from previous session) look text-heavy. Each card needs a visual anchor at the bottom — not an image, a fragment of the actual thing being described.

**Card 1 (Fixed prices)** — add this below the italic note:
```typescript
<div className="mt-4 pt-4 border-t border-border bg-background rounded-lg p-3 font-mono text-xs space-y-1.5">
  <div className="flex justify-between text-muted-foreground">
    <span>Ollvy fee</span><span>₹8,999</span>
  </div>
  <div className="flex justify-between text-muted-foreground/50">
    <span>Govt fee</span><span>₹0 (none for GST Reg)</span>
  </div>
  <div className="flex justify-between font-bold text-foreground border-t border-border pt-1.5 mt-1.5">
    <span>Total</span><span>₹8,999</span>
  </div>
</div>
```

**Card 2 (GST invoice)** — add below italic note:
```typescript
<div className="mt-4 pt-4 border-t border-border bg-background rounded-lg p-3 font-mono text-[10px] space-y-1 text-muted-foreground">
  <p className="text-foreground text-xs font-semibold mb-2">Tax Invoice</p>
  <p>Invoice #OLV-2025-1847</p>
  <p>GSTIN: 07AAXXX1234N1Z5</p>
  <p>CGST (9%) + SGST (9%): ₹1,619.82</p>
  <p className="text-foreground font-semibold">Total: ₹10,618.82</p>
</div>
```

**Card 3 (Scope)** — the checklist items already serve as the visual. No change needed beyond what's spec'd.

**Card 4 (Monthly report)** — add below italic note:
```typescript
<div className="mt-4 pt-4 border-t border-border bg-background rounded-lg p-3 font-mono text-[10px] space-y-2 text-muted-foreground">
  <p className="text-foreground text-xs font-semibold mb-2">March 2025 — Proof of Work</p>
  <div className="flex justify-between">
    <span>GSTR-1</span>
    <span className="text-[hsl(var(--ollvy-green-fg))]">Filed 11 Mar ✓</span>
  </div>
  <div className="flex justify-between">
    <span>GSTR-3B</span>
    <span className="text-[hsl(var(--ollvy-green-fg))]">Filed 18 Mar ✓</span>
  </div>
  <div className="flex justify-between text-muted-foreground/60">
    <span>ARN</span>
    <span>AA07012500XXXXX</span>
  </div>
</div>
```

---

### REMAINING SERVICE DATA (BRIEF CONFIG — FULL DATA IN SEPARATE FILES)

All other services follow the same `ServiceConfig` structure. Priority order for writing full content:

1. `gst-monthly-filing` — gateway to retainer relationships
2. `business-itr` — seasonal high volume, Oct 31 deadline
3. `trademark-registration` — highest CA comparison search traffic
4. `llp-incorporation` — second most common entity type
5. `fssai-license` — F&B businesses, specific and searchable
6. `iec-code` — export businesses, very specific need
7. `mca-annual-filing` — annual obligation for all Pvt Ltd
8. `tds-monthly-compliance` — retainer, recurring
9. `payroll-management` — retainer, recurring

For all of these: same file structure (`lib/services/[slug].ts`), same component, same tabs. Only the data changes.

---

### CRITICAL IMPLEMENTATION NOTES FOR CLAUDE CODE

1. **`lib/services.ts` must export `SERVICE_CONFIGS`** — an array of all `ServiceConfig` objects imported from individual files. This is what `generateStaticParams` iterates over.

```typescript
// lib/services.ts
import { pvtLtdIncorporation } from './services/pvt-ltd-incorporation';
import { gstRegistration } from './services/gst-registration';
import { directorKyc } from './services/director-kyc';
// ... more imports

export const SERVICE_CONFIGS: ServiceConfig[] = [
  pvtLtdIncorporation,
  gstRegistration,
  directorKyc,
  // ...
];
```

2. **`getGuaranteedDate` must be imported from `@/lib/dates`** — the utility already defined in §5. Do not redefine it.

3. **Framer motion** — `ProcessStepper` uses `AnimatePresence` and `motion`. Import from `framer-motion`. The `LazyMotion` wrapper is already set up in `layout.tsx` from §2 of the homepage spec.

4. **Tab state does not persist on navigation** — `useState` resets to `'Service Info'` on every page load. This is correct behaviour for service pages.

5. **Mobile booking bar** — the fixed bottom bar on mobile uses `lg:hidden`. The desktop booking panel uses `hidden lg:block`. Both are always in the DOM — the fixed bar simply doesn't render on desktop. No JS toggling needed.

6. **SWR for service stats** — `get-service-stats?slug=[slug]` endpoint needs to exist on the Supabase edge function. If it returns null or errors, `showCompletionStats` gates the component anyway. Nothing breaks.

7. **`notFound()`** — if the slug doesn't match any `ServiceConfig`, Next.js renders the 404 page. No custom error handling needed.

8. **`generateStaticParams`** — this makes all service pages statically generated at build time. Essential for SEO. Do not skip this export.

9. **Tab overflow on mobile** — the tab nav uses `overflow-x-auto scrollbar-none`. All 6 tabs will be scrollable horizontally on small screens. This is correct. Do not wrap tabs.

10. **`penaltyColor` on hero glow** — if `service.penaltyColor === 'red'`, the radial glow in the hero is amber/red. If `'none'`, it's green. This is the only dynamic color in the hero.
