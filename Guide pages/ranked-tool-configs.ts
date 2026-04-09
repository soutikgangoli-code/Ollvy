/**
 * RANKED TOOL CONFIGS - Guides 2, 4, 9, 10, 12
 *
 * Drop these tool configs into the respective guide files, replacing the existing `tool` field.
 * Each tool now computes a score/ranking from the user's answers and returns a ranked result.
 *
 * The ranking field on the result is consumed by LearnToolRankedResult.tsx
 */

import { getUrgencyLevel, URGENCY_LEVELS } from './tool-ranking'


// =============================================================================
// GUIDE 2: Pvt Ltd vs LLP
// Scoring: accumulate Pvt Ltd and LLP scores from all 4 answers
// =============================================================================

export const pvtLtdVsLlpTool = {
  type: 'comparison' as const,
  title: 'Which Structure is Right for Your Business?',
  questions: [
    {
      text: 'Are you planning to raise equity investment from angel investors or VCs?',
      options: [
        { value: 'yes_funding',  label: 'Yes - fundraising is on the roadmap' },
        { value: 'maybe',        label: 'Maybe in a few years' },
        { value: 'no_funding',   label: 'No - bootstrapping or debt only' },
      ],
    },
    {
      text: 'How many people will run the business day-to-day?',
      options: [
        { value: 'solo',       label: 'Just me' },
        { value: 'small_team', label: '2-3 co-founders or partners' },
        { value: 'large_team', label: 'More than 3' },
      ],
    },
    {
      text: 'Expected annual turnover in the first 2-3 years?',
      options: [
        { value: 'below_40l', label: 'Below Rs. 40 lakh' },
        { value: '40l_2cr',   label: 'Rs. 40 lakh to Rs. 2 crore' },
        { value: 'above_2cr', label: 'Above Rs. 2 crore' },
      ],
    },
    {
      text: 'How important is keeping annual compliance costs low?',
      options: [
        { value: 'critical',     label: 'Very important - I want minimal filings' },
        { value: 'moderate',     label: 'Some compliance is fine' },
        { value: 'not_priority', label: 'Not a concern - growth matters more' },
      ],
      evaluator: (answer: string, allAnswers: string[]) => {
        const answers = [...allAnswers, answer]

        // Score accumulator - weighted by importance of each signal
        let pvt = 0
        let llp = 0

        const reasons: { pvt: { text: string; impact: 'high' | 'medium' | 'low' }[]; llp: { text: string; impact: 'high' | 'medium' | 'low' }[] } = {
          pvt: [], llp: [],
        }
        const warnings: { pvt: string[]; llp: string[] } = { pvt: [], llp: [] }

        // Q1: Funding - most decisive factor
        if (answers[0] === 'yes_funding') {
          pvt += 50
          reasons.pvt.push({ text: 'You need equity funding - only Pvt Ltd can issue shares to investors', impact: 'high' })
          warnings.llp.push('LLP cannot issue shares - investors cannot take equity stakes')
        } else if (answers[0] === 'maybe') {
          pvt += 30; llp += 5
          reasons.pvt.push({ text: 'Possible future funding - Pvt Ltd keeps that door open', impact: 'high' })
          reasons.llp.push({ text: 'No funding plans yet - LLP is simpler and cheaper now', impact: 'medium' })
        } else {
          pvt += 8; llp += 30
          reasons.pvt.push({ text: 'No funding needed, but Pvt Ltd gives more exit flexibility', impact: 'low' })
          reasons.llp.push({ text: 'No funding needed - LLP avoids the cost and structure overhead', impact: 'high' })
        }

        // Q2: Solo founder
        if (answers[1] === 'solo') {
          pvt += 20
          llp -= 50  // LLP not viable alone
          reasons.pvt.push({ text: 'Solo founder - only Pvt Ltd works for a single person', impact: 'high' })
          warnings.llp.push('LLP requires at least two designated partners - not an option for solo founders')
        } else if (answers[1] === 'small_team') {
          pvt += 10; llp += 20
          reasons.llp.push({ text: '2-3 partners - LLP structure maps naturally to your setup', impact: 'medium' })
        } else {
          pvt += 12; llp += 15
          reasons.pvt.push({ text: 'Larger team - Pvt Ltd handles complex ownership and ESOP easily', impact: 'medium' })
        }

        // Q3: Turnover / scale
        if (answers[2] === 'below_40l') {
          pvt += 5; llp += 25
          reasons.llp.push({ text: 'Below Rs. 40 lakh - LLP has no mandatory audit at this size (saves Rs. 15,000-25,000/year)', impact: 'high' })
        } else if (answers[2] === '40l_2cr') {
          pvt += 10; llp += 12
          reasons.pvt.push({ text: 'Rs. 40L-2Cr turnover - Pvt Ltd credibility helps with clients and banks', impact: 'medium' })
        } else {
          pvt += 20; llp += 5
          reasons.pvt.push({ text: 'Above Rs. 2 crore - at this scale, Pvt Ltd compliance cost is proportionally smaller and the structure handles growth better', impact: 'medium' })
        }

        // Q4: Compliance appetite
        if (answers[3] === 'critical') {
          pvt += 0; llp += 22
          reasons.llp.push({ text: 'Compliance cost matters - LLP saves Rs. 15,000-30,000/year vs Pvt Ltd', impact: 'high' })
          warnings.pvt.push('Pvt Ltd has mandatory annual audit, board meetings, and MCA filings regardless of activity')
        } else if (answers[3] === 'moderate') {
          pvt += 8; llp += 10
        } else {
          pvt += 18; llp += 5
          reasons.pvt.push({ text: 'Compliance not a constraint - Pvt Ltd gives full optionality for ESOPs, exits, and equity rounds', impact: 'medium' })
        }

        // Normalize to 100 (LLP floor at 0 if structurally not viable)
        const llpFinal = Math.max(0, llp)
        const pvtFinal = pvt
        const total = pvtFinal + llpFinal
        const pvtScore = Math.round((pvtFinal / total) * 100)
        const llpScore = Math.round((llpFinal / total) * 100)

        const pvtWins = pvtScore > llpScore || llp < 0

        return {
          type: 'eligible' as const,
          headline: pvtWins
            ? `Private Limited Company is the better fit.`
            : `LLP is the better fit for your situation.`,
          body: pvtWins
            ? `Pvt Ltd scores ${pvtScore}/100 vs LLP ${llpScore}/100 based on your answers.`
            : `LLP scores ${llpScore}/100 vs Pvt Ltd ${pvtScore}/100 based on your answers.`,
          ctaLabel: pvtWins ? 'Register Pvt Ltd' : 'Register LLP',
          ctaHref: pvtWins ? '/checkout/pvt-ltd-incorporation' : '/checkout/llp-incorporation',
          ranking: {
            type: 'comparison' as const,
            comparison: [
              {
                label: 'Private Limited Company',
                score: pvtScore,
                isWinner: pvtWins,
                verdict: pvtWins
                  ? 'Best fit for your situation'
                  : 'Viable, but not the optimal choice here',
                reasons: reasons.pvt,
                warnings: warnings.pvt.length ? warnings.pvt : undefined,
              },
              {
                label: 'LLP',
                score: llpScore,
                isWinner: !pvtWins,
                verdict: !pvtWins
                  ? 'Best fit for your situation'
                  : llp < 0
                    ? 'Not viable - requires at least two partners'
                    : 'Simpler to run, but limited by your situation',
                reasons: reasons.llp,
                warnings: warnings.llp.length ? warnings.llp : undefined,
              },
            ],
          },
        }
      },
    },
  ],
  defaultResult: {
    type: 'optional' as const,
    headline: 'Both structures could work for you.',
    body: 'The simplest tiebreaker: will you ever want external equity investment, even 3-5 years out? If yes, go Pvt Ltd. If not, LLP is simpler and cheaper to run.',
  },
}


// =============================================================================
// GUIDE 4: Trademark Registration
// Urgency score 0-100 based on brand exposure and risk factors
// =============================================================================

export const trademarkTool = {
  type: 'eligibility' as const,
  title: 'Should You Register Your Trademark?',
  questions: [
    {
      text: 'How central is your brand name or logo to your business?',
      options: [
        { value: 'central',        label: 'It is the product - customers search for us by name' },
        { value: 'matters',        label: 'It matters, but we compete on quality too' },
        { value: 'less_important', label: 'B2B supplier or white-label - brand is less important' },
      ],
    },
    {
      text: 'Have you spent money building brand awareness?',
      options: [
        { value: 'significant', label: 'Yes - significant spend on ads, packaging, or marketing' },
        { value: 'some',        label: 'Some - social media and basic content' },
        { value: 'none',        label: 'Not yet - not started marketing' },
      ],
    },
    {
      text: 'Is anyone else using a similar name in your industry?',
      options: [
        { value: 'yes_similar', label: 'Yes, similar names exist' },
        { value: 'not_sure',    label: 'Not sure - I have not checked' },
        { value: 'unique',      label: 'Our name is unique - nothing similar' },
      ],
    },
    {
      text: 'Are any of these in your plans?',
      options: [
        { value: 'international', label: 'Expanding internationally or licensing my brand' },
        { value: 'funding',       label: 'Raising investor funding' },
        { value: 'ecommerce',     label: 'Selling on Amazon, Flipkart, or Meesho' },
        { value: 'none',          label: 'None of these right now' },
      ],
      evaluator: (answer: string, allAnswers: string[]) => {
        const answers = [...allAnswers, answer]

        const factors: { text: string; points: number }[] = []
        let score = 0

        // Q1: Brand centrality
        if (answers[0] === 'central') {
          score += 40
          factors.push({ text: 'Brand is core to how customers find you', points: 40 })
        } else if (answers[0] === 'matters') {
          score += 20
          factors.push({ text: 'Brand is a meaningful competitive asset', points: 20 })
        } else {
          score += 5
          factors.push({ text: 'Brand plays a minor role in your business model', points: 5 })
        }

        // Q2: Marketing spend
        if (answers[1] === 'significant') {
          score += 30
          factors.push({ text: 'Significant marketing spend building unprotected brand value', points: 30 })
        } else if (answers[1] === 'some') {
          score += 15
          factors.push({ text: 'Some marketing spend - protection is worthwhile', points: 15 })
        } else {
          score += 0
          factors.push({ text: 'No marketing spend yet - risk is currently low', points: 0 })
        }

        // Q3: Similar names
        if (answers[2] === 'yes_similar') {
          score += 25
          factors.push({ text: 'Similar names exist - race to register is already on', points: 25 })
        } else if (answers[2] === 'not_sure') {
          score += 10
          factors.push({ text: 'No trademark search done - unknown risk', points: 10 })
        } else {
          score += 5
          factors.push({ text: 'Name appears unique - lower risk of conflict', points: 5 })
        }

        // Q4: Plans
        if (answers[3] === 'international') {
          score += 15
          factors.push({ text: 'International expansion requires registered IP', points: 15 })
        } else if (answers[3] === 'funding') {
          score += 15
          factors.push({ text: 'Investors check IP in due diligence - unregistered brand is a flag', points: 15 })
        } else if (answers[3] === 'ecommerce') {
          score += 15
          factors.push({ text: 'Amazon and Flipkart Brand Registry requires trademark registration', points: 15 })
        }

        const level = getUrgencyLevel(score)
        const levelInfo = URGENCY_LEVELS[level]

        return {
          type: (score >= 60 ? 'mandatory' : score >= 35 ? 'recommended' : 'optional') as any,
          headline: levelInfo.label,
          body: levelInfo.description,
          ctaLabel: score >= 60 ? 'Register Trademark Now' : 'See What Registration Costs',
          ctaHref: '/checkout/trademark-registration',
          ranking: {
            type: 'urgency' as const,
            urgency: {
              score,
              maxScore: 100,
              level,
              label: levelInfo.label,
              factors: factors.filter(f => f.points > 0),
            },
          },
        }
      },
    },
  ],
  defaultResult: {
    type: 'recommended' as const,
    headline: 'Set a timeline.',
    body: 'Brand exposure is low now, but that will change. Rs. 4,500 per class for 10 years of protection.',
  },
}


// =============================================================================
// GUIDE 9: MSME / Udyam Registration
// Benefits ranked by relevance to this specific user's situation
// =============================================================================

export const msmeTool = {
  type: 'eligibility' as const,
  title: 'Should You Register as an MSME?',
  questions: [
    {
      text: 'What is your annual turnover?',
      options: [
        { value: 'below_10cr',  label: 'Below Rs. 10 crore (Micro Enterprise)' },
        { value: '10cr_100cr',  label: 'Rs. 10 crore to Rs. 100 crore (Small Enterprise)' },
        { value: '100cr_500cr', label: 'Rs. 100 crore to Rs. 500 crore (Medium Enterprise)' },
        { value: 'above_500cr', label: 'Above Rs. 500 crore' },
      ],
      earlyExit: (answer: string) => {
        if (answer === 'above_500cr') {
          return {
            type: 'ineligible' as const,
            headline: 'Above the MSME ceiling.',
            body: 'Maximum turnover for Medium Enterprise is Rs. 500 crore. Your business does not qualify.',
          }
        }
        return null
      },
    },
    {
      text: 'What is the main reason you are looking at Udyam registration?',
      options: [
        { value: 'credit',    label: 'Getting a business loan or better credit terms' },
        { value: 'tenders',   label: 'Government tenders or GeM marketplace' },
        { value: 'subsidies', label: 'Accessing subsidies or government schemes' },
        { value: 'payments',  label: 'Recovering delayed payments from large buyers' },
        { value: 'not_sure',  label: 'Not sure - want to understand what I get' },
      ],
    },
    {
      text: 'Do you supply to large companies, listed firms, or government entities?',
      options: [
        { value: 'yes',          label: 'Yes - we sell to corporates, PSUs, or government' },
        { value: 'no',           label: 'No - mostly small businesses or end consumers' },
        { value: 'plan_to',      label: 'Not yet, but planning to' },
      ],
      evaluator: (answer: string, allAnswers: string[]) => {
        const answers = [...allAnswers, answer]
        const mainReason = answers[1]
        const suppliesLarge = answers[2] === 'yes' || answers[2] === 'plan_to'

        const benefits: { label: string; relevance: 'high' | 'medium' | 'low'; reason: string; description: string }[] = []

        // Credit access
        benefits.push({
          label: 'Collateral-Free Credit (CGTMSE)',
          description: 'Loans up to Rs. 10 crore without pledging assets or a third-party guarantee',
          relevance: mainReason === 'credit' ? 'high' : 'medium',
          reason: mainReason === 'credit'
            ? 'This is your primary goal - CGTMSE is the most direct benefit'
            : 'Useful for future credit needs even if not the primary driver',
        })

        // Payment protection
        benefits.push({
          label: 'Payment Protection (MSME Samadhaan)',
          description: 'Compound interest at 3x RBI rate if large buyers delay beyond 45 days. File online, resolve in 90 days.',
          relevance: suppliesLarge ? 'high' : mainReason === 'payments' ? 'high' : 'low',
          reason: suppliesLarge
            ? 'You supply to large companies - this is your legal leverage for delayed payments'
            : 'Less relevant until you supply to companies above Rs. 250 crore turnover',
        })

        // Tenders
        benefits.push({
          label: 'Government Tender Preference',
          description: 'MSME-exclusive categories on GeM. Government departments must buy a % of procurement from MSMEs.',
          relevance: mainReason === 'tenders' ? 'high' : answers[2] === 'yes' ? 'medium' : 'low',
          reason: mainReason === 'tenders'
            ? 'This is your primary goal - GeM and tender preference directly apply'
            : 'Register and explore GeM listing even if tenders are not your immediate focus',
        })

        // Subsidies and schemes
        benefits.push({
          label: 'Subsidies and Schemes (ISO, CLSS)',
          description: 'ISO certification cost reimbursement, Credit Linked Capital Subsidy for technology upgrades.',
          relevance: mainReason === 'subsidies' ? 'high' : 'medium',
          reason: mainReason === 'subsidies'
            ? 'Several central and state government schemes are exclusively for registered MSMEs'
            : 'Available on registration - worth exploring as you grow',
        })

        // Credit card (micro only)
        if (answers[0] === 'below_10cr') {
          benefits.push({
            label: 'Udyam Credit Card',
            description: 'Rs. 5 lakh credit limit specifically for micro enterprises registered on Udyam portal.',
            relevance: mainReason === 'credit' ? 'high' : 'medium',
            reason: 'As a micro enterprise, you are eligible for the new Udyam credit card launched in Budget 2025',
          })
        }

        return {
          type: 'recommended' as const,
          headline: 'Yes - register. It is free and takes 15 minutes.',
          body: 'Udyam is free, instant, and needs only your PAN and Aadhaar. Here is what matters most for your situation.',
          ctaLabel: 'Register MSME (Free)',
          ctaHref: '/checkout/msme-registration',
          ranking: {
            type: 'benefits' as const,
            benefits,
          },
        }
      },
    },
  ],
  defaultResult: {
    type: 'recommended' as const,
    headline: 'Yes - register. It is free and takes 15 minutes.',
    body: 'No cost, no inspection. Udyam registration gives you credit access, tender eligibility, and payment protection from large buyers.',
  },
}


// =============================================================================
// GUIDE 10: DPIIT Startup Recognition
// Benefits ranked by relevance based on entity, fundraising plans, and IP
// =============================================================================

export const dpiitTool = {
  type: 'eligibility' as const,
  title: 'Does DPIIT Startup Recognition Make Sense for You?',
  questions: [
    {
      text: 'What type of entity is your business?',
      options: [
        { value: 'pvt_ltd',     label: 'Private Limited Company' },
        { value: 'llp',         label: 'LLP' },
        { value: 'partnership', label: 'Registered Partnership Firm' },
        { value: 'other',       label: 'Sole proprietorship, HUF, or not yet incorporated' },
      ],
      earlyExit: (answer: string) => {
        if (answer === 'other') {
          return {
            type: 'ineligible' as const,
            headline: 'Not eligible by entity type.',
            body: 'DPIIT recognition requires a Pvt Ltd, LLP, or Registered Partnership Firm. Incorporate first.',
            ctaLabel: 'Register Pvt Ltd',
            ctaHref: '/checkout/pvt-ltd-incorporation',
          }
        }
        return null
      },
    },
    {
      text: 'How long has the business been incorporated?',
      options: [
        { value: 'below_5',     label: 'Less than 5 years' },
        { value: '5_to_10',     label: '5 to 10 years' },
        { value: 'above_10',    label: 'More than 10 years' },
      ],
      earlyExit: (answer: string) => {
        if (answer === 'above_10') {
          return {
            type: 'ineligible' as const,
            headline: 'Age limit exceeded.',
            body: 'DPIIT recognition is only available within the first 10 years of incorporation. Look at Udyam registration instead.',
          }
        }
        return null
      },
    },
    {
      text: 'What does your business primarily do?',
      options: [
        { value: 'tech_saas',       label: 'SaaS, app, or technology platform' },
        { value: 'tech_product',    label: 'Tech-enabled product (hardware, device, biotech)' },
        { value: 'services_tech',   label: 'Tech-enabled services (AI, data, fintech)' },
        { value: 'traditional',     label: 'Traditional business - trading, restaurant, real estate, salon' },
      ],
      earlyExit: (answer: string) => {
        if (answer === 'traditional') {
          return {
            type: 'ineligible' as const,
            headline: 'Likely not eligible.',
            body: 'DPIIT recognition requires innovation or technology-driven work. Traditional businesses typically do not meet this criterion.',
          }
        }
        return null
      },
    },
    {
      text: 'Which of these apply to you?',
      options: [
        { value: 'raising_angels', label: 'Raising or planning to raise from angel investors' },
        { value: 'has_ip',         label: 'You have or plan to file patents or proprietary IP' },
        { value: 'hiring_fast',    label: 'Scaling headcount rapidly (10+ hires planned this year)' },
        { value: 'none',           label: 'None of these specifically' },
      ],
      evaluator: (answer: string, allAnswers: string[]) => {
        const answers = [...allAnswers, answer]
        const entityType = answers[0]
        const age = answers[1]
        const businessType = answers[2]
        const specificContext = answers[3]

        const benefits: { label: string; relevance: 'high' | 'medium' | 'low'; reason: string; description: string }[] = []

        // Angel tax - most impactful if fundraising
        const raisingAngels = specificContext === 'raising_angels'
        benefits.push({
          label: 'Angel Tax Exemption (Section 56(2)(viib))',
          description: 'Investment received above fair market value is not taxed as income. At 30%, this is a serious financial risk without recognition.',
          relevance: raisingAngels ? 'high' : 'medium',
          reason: raisingAngels
            ? 'You are raising from angels - this protection is critical before you close a round'
            : 'Even if not raising now, protection activates the moment you do. Apply before you need it.',
        })

        // 80-IAC tax holiday
        const earlyStage = age === 'below_5'
        benefits.push({
          label: '3-Year Income Tax Holiday (Section 80-IAC)',
          description: '100% profit deduction for any 3 consecutive years within your first 10. Requires separate Inter-Ministerial Board certification after DPIIT recognition.',
          relevance: earlyStage ? 'high' : 'medium',
          reason: earlyStage
            ? 'You are in your first 5 years - the most valuable window to claim this'
            : 'Still available but the window is narrowing. Apply for IMB certification after recognition.',
        })

        // Patents
        const hasIP = specificContext === 'has_ip'
        benefits.push({
          label: 'Patent Subsidy (80% fee rebate)',
          description: '80% off government patent filing fees, plus fast-tracked examination through DPIIT\'s startup IP cell.',
          relevance: hasIP ? 'high' : businessType === 'tech_product' ? 'medium' : 'low',
          reason: hasIP
            ? 'You have IP to protect - the 80% fee rebate is directly valuable'
            : businessType === 'tech_product'
              ? 'Hardware and biotech typically have patentable components - worth exploring'
              : 'Less directly relevant for pure software/services businesses',
        })

        // Labour compliance
        const hiringFast = specificContext === 'hiring_fast'
        benefits.push({
          label: 'Labour Law Self-Certification (5 years)',
          description: 'Self-certify compliance under 3 central labour laws instead of being subject to inspections for 5 years.',
          relevance: hiringFast ? 'high' : 'medium',
          reason: hiringFast
            ? 'Scaling headcount fast - avoiding labour inspections for 5 years is immediately valuable'
            : 'Useful as you grow. Removes inspection risk during your most vulnerable scaling phase.',
        })

        // Fund of funds
        benefits.push({
          label: 'Fund of Funds Access (SIDBI)',
          description: 'Eligible for investment from SIDBI\'s Fund of Funds via registered AIFs.',
          relevance: raisingAngels ? 'medium' : 'low',
          reason: raisingAngels
            ? 'Relevant if you eventually pursue institutional funding via AIFs'
            : 'More relevant at Series A stage than early angel rounds',
        })

        return {
          type: 'eligible' as const,
          headline: 'Apply now. It is free and takes 2-7 working days.',
          body: 'Here are the benefits ranked by how relevant they are to your situation.',
          ctaLabel: 'Apply on Startup India Portal',
          ctaHref: 'https://startupindia.gov.in',
          ranking: {
            type: 'benefits' as const,
            benefits,
          },
        }
      },
    },
  ],
  defaultResult: {
    type: 'recommended' as const,
    headline: 'Apply if you meet the criteria.',
    body: 'Free, 2-7 working days. Angel tax protection is the most important benefit for early-stage fundraising.',
  },
}


// =============================================================================
// GUIDE 12: ITR Form Selection
// Deterministic form assignment with elimination reasoning
// =============================================================================

export const itrFormTool = {
  type: 'comparison' as const,
  title: 'Find Your ITR Form',
  questions: [
    {
      text: 'What type of entity are you filing for?',
      options: [
        { value: 'individual_huf', label: 'An individual or HUF' },
        { value: 'firm_llp',       label: 'A partnership firm or LLP' },
        { value: 'company',        label: 'A Private Limited or Public Limited company' },
        { value: 'trust_ngo',      label: 'A trust, society, NGO, AOP, or BOI' },
      ],
      earlyExit: (answer: string) => {
        if (answer === 'company') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-6.',
            body: 'All companies file ITR-6, every year, even with zero income.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-6',
                reason: 'All companies (Pvt Ltd, Public Ltd, OPC) except those claiming Section 11 exemption use this form.',
                eliminated: [
                  { form: 'ITR-1', why: 'Only for individual resident taxpayers' },
                  { form: 'ITR-5', why: 'For firms and LLPs, not companies' },
                  { form: 'ITR-7', why: 'For trusts and charitable institutions, not companies' },
                ],
              },
            },
          }
        }
        if (answer === 'firm_llp') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-5.',
            body: 'Partnership firms and LLPs always file ITR-5 - regardless of size, profit, or activity.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-5',
                reason: 'Partnership firms, LLPs, AOPs, and BOIs use this form. Each partner separately files their own personal ITR.',
                eliminated: [
                  { form: 'ITR-3', why: 'ITR-3 is for individual partners, not the firm itself' },
                  { form: 'ITR-4', why: 'ITR-4 applies to partners using presumptive taxation - not the firm' },
                  { form: 'ITR-6', why: 'Only for companies, not LLPs or firms' },
                ],
              },
            },
          }
        }
        if (answer === 'trust_ngo') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-7.',
            body: 'Trusts, political parties, universities, and research institutions use ITR-7.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-7',
                reason: 'For entities filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D) - charitable trusts, political parties, educational institutions, and scientific research bodies.',
                eliminated: [
                  { form: 'ITR-5', why: 'ITR-5 is for firms and LLPs without charitable status' },
                  { form: 'ITR-6', why: 'For companies - trusts and societies are not companies' },
                ],
              },
            },
          }
        }
        return null
      },
    },
    {
      text: 'Do any of these apply to you?',
      options: [
        { value: 'director',       label: 'I am a director in any company, or I hold unlisted shares' },
        { value: 'foreign',        label: 'I have foreign assets, a foreign bank account, or income from outside India' },
        { value: 'above_50l',      label: 'Total income from all sources is above Rs. 50 lakh' },
        { value: 'capital_gains',  label: 'I sold shares, mutual funds, property, or any other asset this year' },
        { value: 'none_of_these',  label: 'None of these' },
      ],
      earlyExit: (answer: string) => {
        const triggers: Record<string, string> = {
          director:      'ITR-1 cannot be used by directors or holders of unlisted shares',
          foreign:       'ITR-1 cannot be used if you have foreign assets or income',
          above_50l:     'ITR-1 is limited to income below Rs. 50 lakh',
          capital_gains: 'Any capital gain - even a small mutual fund redemption - disqualifies ITR-1',
        }
        if (answer !== 'none_of_these') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-2.',
            body: triggers[answer],
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-2',
                reason: triggers[answer],
                eliminated: [
                  { form: 'ITR-1', why: triggers[answer] },
                  { form: 'ITR-3', why: 'ITR-3 is for business or professional income - not applicable if your income is from salary and capital gains' },
                  { form: 'ITR-4', why: 'ITR-4 is for presumptive taxation of business income - not for salaried individuals with capital gains' },
                ],
              },
            },
          }
        }
        return null
      },
    },
    {
      text: 'Where does your income come from?',
      options: [
        { value: 'salary_only',   label: 'Salary, pension, or interest - that is mostly it' },
        { value: 'business_real', label: 'Business or professional income - I maintain actual accounts' },
        { value: 'presumptive',   label: 'Business or professional income - I want to declare a flat percentage (Section 44AD/44ADA)' },
      ],
      evaluator: (answer: string, allAnswers: string[]) => {
        if (answer === 'salary_only') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-1.',
            body: 'Salary, pension, one house property, and interest income with no other complications. The simplest form.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-1 (Sahaj)',
                reason: 'You are a resident individual with income from salary, one house property, and interest - total below Rs. 50 lakh, no capital gains, no directorship, no foreign assets.',
                eliminated: [
                  { form: 'ITR-2', why: 'Only needed if you have capital gains, multiple properties, foreign assets, or income above Rs. 50 lakh' },
                  { form: 'ITR-3', why: 'For business or professional income - not applicable to salaried individuals' },
                  { form: 'ITR-4', why: 'For presumptive taxation of business income - not for salaried income' },
                ],
              },
            },
          }
        }
        if (answer === 'business_real') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-3.',
            body: 'For business or professional income with actual books of accounts.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-3',
                reason: 'You have business or professional income and maintain actual books of accounts. Also required if your turnover exceeds presumptive limits (Rs. 2 crore for business, Rs. 50 lakh for professionals).',
                eliminated: [
                  { form: 'ITR-4', why: 'ITR-4 is for presumptive taxation - you maintain actual books, so ITR-3 is required' },
                  { form: 'ITR-1', why: 'ITR-1 cannot be used for business income' },
                  { form: 'ITR-2', why: 'ITR-2 is for individuals with capital gains or other non-business income - not for business income with actual books' },
                ],
              },
            },
          }
        }
        if (answer === 'presumptive') {
          return {
            type: 'eligible' as const,
            headline: 'Use ITR-4 - but check the limits first.',
            body: 'ITR-4 applies to presumptive taxation. Critical check: business turnover must be below Rs. 2 crore (44AD) or professional receipts below Rs. 50 lakh (44ADA). If you exceed these, you must use ITR-3.',
            ranking: {
              type: 'form-assignment' as const,
              assignment: {
                form: 'ITR-4 (Sugam)',
                reason: 'Presumptive taxation: declare 8% of business turnover as income (6% for digital receipts), or 50% of gross receipts for professionals. Much simpler filing.',
                eliminated: [
                  { form: 'ITR-3', why: 'Required only if you exceed presumptive limits or opt out of the scheme. If you opt out of 44AD, you cannot re-enter for 5 years.' },
                  { form: 'ITR-1', why: 'ITR-1 cannot be used for business income' },
                  { form: 'ITR-2', why: 'ITR-2 is for capital gains and non-business income - not for presumptive business income' },
                ],
              },
            },
          }
        }
        return null
      },
    },
  ],
  defaultResult: {
    type: 'optional' as const,
    headline: 'When in doubt, use ITR-2.',
    body: 'ITR-2 covers everything ITR-1 covers, and more. No penalty for filing a more comprehensive form. But filing ITR-1 when you need ITR-2 makes the return defective.',
  },
}
