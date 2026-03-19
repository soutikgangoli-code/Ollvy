'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FileText,
  CreditCard,
  Home,
  Globe,
  Shield,
  Briefcase,
  ClipboardList,
  FileCheck,
  ChevronDown,
  User,
  Camera,
  Building2,
  FileSignature,
  Receipt,
  Landmark,
  BadgeCheck,
  ScrollText,
  Calculator,
  PiggyBank,
  Heart,
  GraduationCap,
  TrendingUp,
  Wallet,
  Building,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Scale,
  Stamp,
  HandshakeIcon,
  Users,
  Banknote,
  FileQuestion,
  ShieldCheck,
  Palette,
  Search,
  Clock,
  AlertCircle,
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  Layers,
  Package,
  Truck,
  Factory,
  Percent,
  CalendarCheck,
  FileBarChart,
  Coins,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react'

interface DocumentItem {
  icon: ReactNode
  name: string
  note: string
  details?: string[]
  required?: boolean
  ollvyProvides?: boolean
  /** Brief explanation of what this document is */
  whatIsIt?: string
  /** How to obtain this document */
  howToGet?: string
  /** Common issues people face with this document */
  usualIssues?: string
  /** Sample image URL to show what the document looks like */
  sampleImage?: string
}

interface DocumentCategory {
  category: string
  categoryNote?: string
  items: DocumentItem[]
}

// Selected document for the detail panel
interface SelectedDocument extends DocumentItem {
  categoryName: string
}

// Comprehensive document requirements for all business types
const DOCUMENT_DATA: Record<string, DocumentCategory[]> = {
  pvt_ltd: [
    {
      category: 'Identity Documents',
      categoryNote: 'Required for all proposed directors',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'of all directors (minimum 2 directors required)',
          sampleImage: '/images/docs/sample-pan-card.png',
          whatIsIt: 'Your PAN is like your tax identity card - a 10-character code that the government uses to track your taxes. Every director needs one because the company will eventually file taxes, and MCA links directors to their PAN.',
          howToGet: 'Already have a PAN? Just take a clear photo with your phone - make sure all text is readable and there\'s no glare. Don\'t have one? Apply at incometax.gov.in (takes about 2 weeks to arrive).',
          usualIssues: 'Name mismatch is the #1 problem. If your PAN says "Rajesh K Singh" but Aadhaar says "Rajesh Kumar Singh", MCA will reject the application. Get this fixed before you start.',
          details: [
            'Clear, colored scan of original PAN card',
            'Name should match exactly with Aadhaar',
            'Must be valid and not expired',
            'For foreign nationals: passport in lieu of PAN',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of all directors - front and back',
          sampleImage: '/images/docs/sample-aadhaar-card.png',
          whatIsIt: 'Your Aadhaar is your 12-digit identity proof. We need it because MCA will send OTPs to the mobile number linked to your Aadhaar - this is how they verify you\'re really you.',
          howToGet: 'Already have Aadhaar? Perfect. Just make sure your phone number is linked (check at myaadhaar.uidai.gov.in). Scan or photograph both sides clearly. The address on Aadhaar should be current.',
          usualIssues: 'Old mobile number is the biggest headache. If your Aadhaar is linked to an old SIM you don\'t have anymore, you won\'t receive the OTP and we\'re stuck. Update it at an Aadhaar center first.',
          details: [
            'Both sides of Aadhaar card required',
            'Address on Aadhaar used for DIN verification',
            'Mobile number linked to Aadhaar must be active for OTP',
            'For foreign directors: passport + visa + address proof in India',
          ],
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photographs',
          note: '2 photos per director - white background, formal attire',
          sampleImage: '/images/docs/sample-passport-photo.png',
          whatIsIt: 'Standard photos used for your Director Identification Number (DIN) application. Think of DIN as your "director license" - this photo goes on it.',
          howToGet: 'Visit any photo studio (₹50-100) and ask for "passport photos with white background." They\'ll usually email you digital copies too. Don\'t use phone selfies - they won\'t be accepted.',
          usualIssues: 'Blue or grey backgrounds get rejected. Studios sometimes do this by default. Specifically ask for pure white background.',
          details: [
            'Recent photographs (taken within last 6 months)',
            'White background, no borders',
            'Size: 3.5cm x 4.5cm (passport standard)',
            'Professional attire, no headwear (religious exemptions allowed)',
          ],
          required: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Specimen Signature',
          note: 'on white paper - same as on PAN/bank records',
          sampleImage: '/images/docs/sample-signature.png',
          whatIsIt: 'A sample of how you sign your name. This is used to create your Digital Signature Certificate (DSC) - basically your electronic signature for signing government forms.',
          howToGet: 'Take a plain white paper, sign with a black or blue pen (the way you sign on cheques), and take a clear photo. Make sure there\'s good lighting and no shadows.',
          usualIssues: 'People sign differently each time. Your DSC signature needs to match your bank signature, so sign the way you normally do - not a "nice" version of your signature.',
          details: [
            'Sign on plain white paper',
            'Signature must match PAN and bank records',
            'Scan in high resolution (300 DPI minimum)',
            'Used for DSC application and company forms',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Director Address Proof',
      categoryNote: 'Any one document per director - must be recent',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Utility Bill',
          note: 'electricity, water, gas, or telephone - not older than 2 months',
          sampleImage: '/images/docs/sample-utility-bill.png',
          whatIsIt: 'Any bill from your electricity, water, gas, or landline provider. This proves you live where you say you live. Most people use electricity bills since everyone has one.',
          howToGet: 'Check your email inbox - most utility companies email bills now. Or download from their app (Tata Power, BSES, etc.). Physical bill also works. If it\'s in your parent\'s name, that\'s fine as long as the address matches.',
          usualIssues: 'Bills older than 2 months are rejected. Also, mobile phone bills don\'t count - only landline. If you don\'t have a recent bill, use bank statement instead.',
          details: [
            'Bill must be in the director\'s name or immediate family',
            'Not older than 2 months from date of application',
            'Address must match Aadhaar (or provide valid reason)',
            'Accepted: Electricity, Water, Gas, Landline telephone bills',
          ],
          required: false,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'Bank Statement',
          note: 'latest month - shows name and address',
          sampleImage: '/images/docs/sample-bank-statement.png',
          whatIsIt: 'An official statement from your bank showing transactions and your registered address. This is often easier than finding a utility bill.',
          howToGet: 'Log into your net banking, go to Statements or e-Statements, and download the last month as PDF. Takes 2 minutes. Make sure it shows your full name and address on the first page.',
          usualIssues: 'Passbook photocopies don\'t work - needs to be an official statement. Also, some people\'s bank address is their hometown but they live elsewhere. If so, use utility bill instead.',
          details: [
            'Official bank statement (not passbook photocopy)',
            'Must show full name and current address',
            'Should be from the last 30 days',
            'E-statement from net banking is accepted',
          ],
          required: false,
        },
        {
          icon: <Landmark size={14} />,
          name: 'Passport',
          note: 'first and last page - if passport address is current',
          sampleImage: '/images/docs/sample-passport.png',
          whatIsIt: 'Your passport works as both ID and address proof. It\'s especially useful if you travel and don\'t have utility bills in your name.',
          howToGet: 'Scan or photograph the first page (the one with your photo) and the last page (with your address). Make sure both are clear and complete.',
          usualIssues: 'Many passports have old addresses - if your passport address isn\'t current, use a utility bill or bank statement instead. Expired passports obviously won\'t work.',
          details: [
            'Valid passport with at least 6 months validity',
            'First page (photo) and last page (address)',
            'Address should be current residential address',
            'Mandatory for foreign national directors',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Registered Office Documents',
      categoryNote: 'Where your company will be officially registered',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Registered Office Address Proof',
          note: 'utility bill of the office premises - not older than 2 months',
          sampleImage: '/images/docs/sample-office-bill.png',
          whatIsIt: 'This proves your office address exists. It\'s where government notices will be sent, and it appears on all your company documents. Yes, you can use your home address - most startups do.',
          howToGet: 'Grab the electricity or water bill of wherever your office will be. Using your home? Use your home\'s electricity bill. Co-working space? Ask them for a utility bill or get a virtual office address.',
          usualIssues: 'The address format matters. If the bill says "Flat 12, Tower A" but you write "12-A" in the form, MCA might reject it. Copy the address exactly as it appears on the bill.',
          details: [
            'Electricity/water/gas bill of the premises',
            'Bill must be recent (within last 2 months)',
            'Address on bill will be company\'s registered address',
            'Commercial or residential property both allowed',
          ],
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Rent Agreement',
          note: 'if rented - registered or notarized copy',
          sampleImage: '/images/docs/sample-rent-agreement.png',
          whatIsIt: 'If you\'re renting the office space (or even a room at home from your parents), this agreement shows you have legal permission to use the address.',
          howToGet: 'Standard 11-month rent agreements work fine. If you don\'t have one, get a fresh one made with the landlord. It should be notarized (costs ₹100-200) or stamped.',
          usualIssues: 'Expired rent agreements are common - people forget to renew. Check the dates. Also, the address in the agreement must match the utility bill exactly.',
          details: [
            'Rent/lease agreement in favor of proposed company or directors',
            'Should be registered or notarized',
            'Minimum 11 months tenure recommended',
            'Must clearly mention the premises address',
          ],
          required: false,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'NOC from Property Owner',
          note: 'owner\'s consent for using premises as registered office',
          sampleImage: '/images/docs/sample-noc.png',
          whatIsIt: 'A simple letter where the property owner says "I\'m okay with this person using my property as their company\'s registered office." Sounds formal, but it\'s just one page.',
          howToGet: 'We give you a ready template - just fill in the blanks, get the owner to sign, and attach their Aadhaar or PAN copy. If your parents own the house, they sign it. Takes 10 minutes.',
          usualIssues: 'People forget to attach the owner\'s ID proof. The NOC alone isn\'t enough - we need to verify the owner is real. Always include their Aadhaar or PAN copy.',
          details: [
            'Letter from landlord/owner consenting to use as registered office',
            'Must include owner\'s signature and property details',
            'Owner\'s ID proof (Aadhaar/PAN) attached',
            'Ollvy provides a ready-to-use NOC template',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Property Tax Receipt',
          note: 'alternatively - if utility bill is unavailable',
          sampleImage: '/images/docs/sample-property-tax.png',
          whatIsIt: 'If you can\'t find a utility bill, the property tax receipt works as backup. It proves the property exists and shows its official address.',
          howToGet: 'Ask the property owner for their latest municipal tax receipt. They usually get it once a year. You can also download it from your city\'s municipal corporation website.',
          usualIssues: 'Some property tax receipts don\'t show the full address - just a survey number. If the address isn\'t clearly mentioned, use a utility bill instead.',
          details: [
            'Latest property tax receipt/assessment order',
            'Shows ownership and property address',
            'Alternative to utility bill for address proof',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Company Details',
      categoryNote: 'Information needed to draft your incorporation documents',
      items: [
        {
          icon: <Globe size={14} />,
          name: 'Proposed Company Names',
          note: '3 unique names in order of preference - for MCA approval',
          whatIsIt: 'This is what your company will officially be called. The government checks if the name is unique, so we ask for 3 options in case your first choice is already taken.',
          howToGet: 'Think of names that sound professional and hint at what you do. Structure: [Unique Word] + [Industry Word] + Private Limited. Like "Zenith Software Private Limited" or "Bluewave Consulting Private Limited". We\'ll check if they\'re available before filing.',
          usualIssues: 'Generic names like "Global Solutions Private Limited" are almost always taken. Also, you can\'t use words like "National", "Indian", "Bharat", or "India" without special approval.',
          details: [
            'Provide 3 name choices (MCA approves one)',
            'Name must be unique - not similar to existing companies',
            'Should reflect the business activity',
            'Cannot use restricted words without approval (National, Indian, etc.)',
            'Ollvy pre-checks name availability before filing',
          ],
          required: true,
        },
        {
          icon: <Briefcase size={14} />,
          name: 'Business Activity Description',
          note: 'main line of business - 2-3 sentences describing what the company will do',
          whatIsIt: 'This goes into your MOA (company\'s constitution) and defines what your company is allowed to do. Think of it as your official "about us" for the government.',
          howToGet: 'Write 2-3 sentences covering what you\'ll do now AND what you might do later. Example: "To develop software, provide IT services, and carry on e-commerce business." Keep it broad so you don\'t need to change it later.',
          usualIssues: 'People write too narrowly. If you say "mobile app development" only, and later want to do web development, you\'ll need to amend your MOA. Better to say "software and technology services" broadly.',
          details: [
            'Clear description of primary business activity',
            'Used to determine company\'s main object clause',
            'Can include up to 6 business activities in MOA',
            'Helps in choosing correct NIC code',
          ],
          required: true,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Authorized Capital Details',
          note: 'proposed share capital structure - minimum ₹1 lakh recommended',
          whatIsIt: 'This is how much money the company can raise by issuing shares. "Authorized" is the maximum limit, "Paid-up" is what founders actually put in initially. Most people start with ₹1 lakh.',
          howToGet: 'Decide on a starting amount (₹1 lakh is common). Then decide who owns how much - like "Founder A gets 60%, Founder B gets 40%". Don\'t overthink it - you can change this later.',
          usualIssues: 'Founders sometimes want to start with ₹10 crore authorized capital "for future fundraising." Bad idea - you pay higher stamp duty. Start small, increase when you actually need it.',
          details: [
            'Total authorized share capital (can be increased later)',
            'Paid-up capital (actually invested by shareholders)',
            'Shareholding pattern among directors/shareholders',
            'Face value of shares (typically ₹10 per share)',
          ],
          required: true,
        },
        {
          icon: <Users size={14} />,
          name: 'Shareholder Details',
          note: 'if different from directors - their PAN, Aadhaar, and shareholding %',
          whatIsIt: 'Directors manage the company, shareholders own it. They\'re often the same people (founders are both). But if you want an investor or family member to own shares without being a director, we need their details.',
          howToGet: 'If it\'s just the founders as both directors and shareholders, you\'re set - no extra documents. If someone else is getting shares, collect their PAN, Aadhaar, and address proof like you did for directors.',
          usualIssues: 'People sometimes want to add parents as shareholders for "tax planning" without understanding implications. Talk to us first - there are better ways to structure this.',
          details: [
            'Shareholders can be different from directors',
            'PAN and address proof of all shareholders',
            'Shareholding percentage for each shareholder',
            'Minimum 1 shareholder required (can be director)',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Digital & Legal',
      categoryNote: 'Ollvy handles these - no action needed from you',
      items: [
        {
          icon: <Shield size={14} />,
          name: 'Digital Signature Certificate (DSC)',
          note: 'Class 3 DSC for all directors - Ollvy arranges this',
          sampleImage: '/images/docs/sample-dsc-token.png',
          whatIsIt: 'Think of DSC as your electronic signature - legally equivalent to your physical signature. It comes on a small USB pen drive. Every time you sign MCA documents, you plug this in.',
          howToGet: 'We handle everything. You\'ll get a link for a 5-minute video call to verify your identity. Then the DSC token is couriered to your address in 2-3 days. You keep it safe like a password.',
          usualIssues: 'Video verification needs good internet. If the call fails, we reschedule. Also, don\'t lose the USB token - replacing it costs money and takes time.',
          details: [
            'Mandatory for signing MCA forms electronically',
            'Class 3 DSC with 2-year validity',
            'Ollvy applies for DSC on your behalf',
            'Video verification required (5-minute process)',
            'USB token delivered to your address',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <BadgeCheck size={14} />,
          name: 'Director Identification Number (DIN)',
          note: 'unique ID for each director - applied as part of incorporation',
          whatIsIt: 'DIN is like an Aadhaar for directors - a unique 8-digit number that follows you across all companies you\'ll ever be a director of. Once issued, it\'s yours for life.',
          howToGet: 'You don\'t apply separately. When we file your company incorporation (SPICe+ form), DIN is automatically applied. If you\'re already a director elsewhere and have a DIN, just share it.',
          usualIssues: 'Already have a DIN from another company? Don\'t apply for a new one - that\'s illegal. Tell us your existing DIN and we\'ll use it.',
          details: [
            'DIN is a lifetime unique identifier for directors',
            'Applied through SPICe+ form during incorporation',
            'Same DIN used across all companies where person is director',
            'Ollvy handles the complete DIN application',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'MOA & AOA',
          note: 'Memorandum & Articles of Association - Ollvy drafts these',
          whatIsIt: 'MOA is your company\'s "why" - what it\'s allowed to do (software, consulting, e-commerce, etc.). AOA is the "how" - rules for running the company (meetings, voting, shares). Every company needs both.',
          howToGet: 'We draft these for you based on your business activity and how you want to split ownership. 95% of startups use standard templates. We share drafts before filing so you can review.',
          usualIssues: 'Some founders want super-customized AOA with complex clauses. This usually causes delays. Standard templates are battle-tested and work for almost everyone.',
          details: [
            'MOA defines company\'s objectives and scope',
            'AOA defines rules for internal management',
            'Standard templates used for most companies',
            'Customization available for specific requirements',
            'Digitally signed by all subscribers',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Director Consent Forms',
          note: 'DIR-2, INC-9 declarations - Ollvy prepares, you sign digitally',
          details: [
            'DIR-2: Consent to act as director',
            'INC-9: Declaration of no convictions/disqualifications',
            'Affidavit from first subscribers',
            'All forms pre-filled by Ollvy',
            'Signed using your DSC',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
  ],

  llp: [
    {
      category: 'Identity Documents',
      categoryNote: 'Required for all designated partners',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'of all designated partners (minimum 2 required)',
          whatIsIt: 'Your PAN identifies you for tax purposes. In an LLP, every designated partner (the ones who manage the business) needs to provide their PAN. It\'s how MCA tracks who\'s running the LLP.',
          howToGet: 'Already have PAN? Take a clear photo. Don\'t have one? Apply at incometax.gov.in - takes about 2 weeks. Fun fact: even a company can be a partner in an LLP (you\'d provide the company\'s PAN then).',
          usualIssues: 'Name mismatch between PAN and Aadhaar causes 80% of rejections. If your PAN says "Amit Kumar" but Aadhaar says "Amit Kumar Sharma", fix it before starting.',
          details: [
            'Clear scan of original PAN card',
            'Name must match Aadhaar exactly',
            'At least 2 designated partners mandatory',
            'Body corporates can also be partners (provide CIN, MOA, Board Resolution)',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of all partners - both sides',
          whatIsIt: 'Your 12-digit Aadhaar is needed for OTP verification. When we file the LLP, MCA sends OTPs to the mobile linked to your Aadhaar to verify you\'re really you.',
          howToGet: 'Scan or photograph both sides clearly. Check that your mobile is linked at myaadhaar.uidai.gov.in. If linked to an old number, update it at an Aadhaar center first.',
          usualIssues: 'Old mobile number = no OTP = stuck application. This is the #1 delay reason. Verify your linked mobile before we start.',
          details: [
            'Front and back of Aadhaar card',
            'Mobile linked to Aadhaar must be active',
            'Address used for DPIN verification',
            'Foreign partners: passport + India visa + address proof',
          ],
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photographs',
          note: '2 photos per partner - recent, professional',
          whatIsIt: 'Used for your DPIN (Designated Partner Identification Number) application. Think of DPIN as your "partner license" - this photo goes on official records.',
          howToGet: 'Visit any photo studio, ask for passport photos with white background. Get digital copies emailed. Takes 10 minutes, costs ₹50-100.',
          usualIssues: 'Studios sometimes use blue backgrounds by default. Specifically say "white background" or they might give you the wrong format.',
          details: [
            'White background, recent photographs',
            'Standard passport size (3.5cm x 4.5cm)',
            'Used for DPIN application and LLP forms',
          ],
          required: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Specimen Signature',
          note: 'on plain white paper - matching bank/PAN signature',
          whatIsIt: 'A sample of your signature for the Digital Signature Certificate (DSC). Your DSC is your electronic signature - legally equivalent to signing physically.',
          howToGet: 'Sign on white paper with black or blue pen. Take a clear photo with good lighting. Sign the way you normally do on cheques - not a fancy version.',
          usualIssues: 'Inconsistent signatures cause problems. If your DSC signature looks different from your bank signature, banks might question it later.',
          details: [
            'Clear signature on white background',
            'Should match signature on PAN card',
            'High resolution scan required',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Partner Address Proof',
      categoryNote: 'Any one document per partner',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Utility Bill',
          note: 'electricity, water, gas - within last 2 months',
          whatIsIt: 'Proves where you currently live. Any bill showing your residential address works - electricity is most common since everyone has one.',
          howToGet: 'Check email for e-bills, download from utility provider\'s app, or find the physical bill. Parents\' name on bill is fine if you live at the same address.',
          usualIssues: 'Bills older than 2 months get rejected. Mobile phone bills don\'t count - only landline, electricity, water, or gas.',
          details: [
            'Recent utility bill (not older than 2 months)',
            'In partner\'s name or immediate family',
            'Must show current residential address',
          ],
          required: false,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'Bank Statement',
          note: 'latest month with full address visible',
          whatIsIt: 'Your bank statement shows your registered address with the bank. If you can\'t find a utility bill, this is the easiest alternative.',
          howToGet: 'Log into net banking → Statements → Download last month as PDF. Takes 2 minutes. Make sure your address shows on the statement header.',
          usualIssues: 'Some people have their hometown address on bank records but live elsewhere. If that\'s you, use a utility bill instead.',
          details: [
            'Official statement from bank',
            'Shows name and current address',
            'Last 30 days statement sufficient',
          ],
          required: false,
        },
        {
          icon: <Landmark size={14} />,
          name: 'Passport',
          note: 'if address matches current residence',
          whatIsIt: 'Your passport works as both ID and address proof. Useful if you travel frequently and don\'t have utility bills in your name.',
          howToGet: 'Scan first page (photo) and last page (address). Both pages needed. Make sure the address is current - not your old hometown.',
          usualIssues: 'Many passports have outdated addresses. If your passport address isn\'t where you currently live, use utility bill or bank statement.',
          details: [
            'Valid passport with current address',
            'First and last page required',
            'Mandatory for foreign partners',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Registered Office Documents',
      categoryNote: 'Official address of your LLP',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Office Address Proof',
          note: 'utility bill of LLP premises - recent',
          whatIsIt: 'This proves your LLP\'s office address exists. Government notices will be sent here. Good news: unlike Pvt Ltd, you can easily use your home address for an LLP.',
          howToGet: 'Get the electricity or water bill of your office location. Working from home? Your home\'s electricity bill works perfectly. Co-working space? Ask them for the utility bill.',
          usualIssues: 'Address format must match exactly across all documents. "Flat 12, Tower B" and "12-B Tower" look the same to you but MCA might reject it.',
          details: [
            'Electricity/water/gas bill of office location',
            'Not older than 2 months',
            'This becomes LLP\'s registered address',
            'Residential address allowed for LLP',
          ],
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Rent Agreement',
          note: 'if rented premises - notarized or registered',
          whatIsIt: 'If you\'re renting office space, this shows you have legal permission to use the address. Needed when the utility bill isn\'t in your name.',
          howToGet: 'Get a standard 11-month rent agreement with your landlord. Get it notarized (₹100-200) for extra validity. The address must match the utility bill exactly.',
          usualIssues: 'Expired agreements are common - people forget to renew. Check the dates. Also ensure the rent agreement mentions the same address as the utility bill.',
          details: [
            'Lease/rent agreement for the office',
            'Should be notarized or registered',
            'In favor of LLP or designated partners',
          ],
          required: false,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'NOC from Owner',
          note: 'owner consent letter - template provided by Ollvy',
          whatIsIt: 'A simple one-page letter where the property owner says "I allow this LLP to use my property as their registered office." Required even if it\'s your parents\' house.',
          howToGet: 'We give you a ready template. Fill in the blanks, get the owner to sign, and attach their Aadhaar or PAN copy. 10-minute task.',
          usualIssues: 'People forget to attach the owner\'s ID. The NOC letter alone isn\'t enough - always include their Aadhaar/PAN photocopy.',
          details: [
            'Landlord\'s consent to use as registered office',
            'Include owner\'s ID proof',
            'Ollvy provides ready template',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'LLP Details',
      categoryNote: 'Information for LLP incorporation',
      items: [
        {
          icon: <Globe size={14} />,
          name: 'Proposed LLP Names',
          note: '3 unique names - ending with "LLP"',
          whatIsIt: 'Your LLP\'s official name. Unlike Pvt Ltd where names end with "Private Limited", LLP names must end with "LLP" or "Limited Liability Partnership".',
          howToGet: 'Think of 3 names you like. Format: [Unique Word] + [Business Type] + LLP. Like "Bluewave Consulting LLP" or "Techify Solutions LLP". We check availability before filing.',
          usualIssues: 'Generic names like "Best Consultants LLP" are always taken. Be creative with the first word. Also can\'t use "India", "National" etc. without approval.',
          details: [
            'Must end with "LLP" or "Limited Liability Partnership"',
            'Provide 3 options in preference order',
            'Cannot match existing company/LLP names',
            'Ollvy checks availability before filing',
          ],
          required: true,
        },
        {
          icon: <Briefcase size={14} />,
          name: 'Business Activity',
          note: 'description of LLP\'s main business',
          whatIsIt: 'What will your LLP actually do? This goes into your LLP Agreement and defines your scope. Keep it broad enough to cover future plans.',
          howToGet: 'Write 2-3 lines about your business. Example: "To provide consulting services, software development, and technology solutions." Cover what you do now AND might do later.',
          usualIssues: 'Being too specific limits you. "Mobile app development" is narrow - "software and technology services" gives you room to grow without amending later.',
          details: [
            'Clear description of proposed business',
            'Determines LLP Agreement clauses',
            'Can have multiple business activities',
          ],
          required: true,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Capital Contribution',
          note: 'each partner\'s contribution amount - no minimum required',
          whatIsIt: 'How much money (or assets) each partner is putting in. Unlike Pvt Ltd, LLP has no minimum capital requirement. You can start with ₹10,000 or ₹10 lakh - your choice.',
          howToGet: 'Decide how much each partner will contribute. Common setup: equal contributions from all partners. This can be cash, or even assets like laptops/equipment.',
          usualIssues: 'Partners sometimes want to contribute "later" but you need to specify an amount now. Even ₹10,000 each is fine to start - you can increase later.',
          details: [
            'LLP has no minimum capital requirement',
            'Each partner\'s contribution amount',
            'Can be cash or asset contribution',
            'Profit sharing ratio (usually based on contribution)',
          ],
          required: true,
        },
        {
          icon: <Scale size={14} />,
          name: 'Profit Sharing Ratio',
          note: 'how profits will be divided among partners',
          whatIsIt: 'What percentage of profits does each partner get? This doesn\'t have to match capital contribution. One partner might contribute more but agree to equal profit sharing.',
          howToGet: 'Discuss with your partners. Common: equal splits (50-50 for 2 partners). Or based on capital contribution. Or based on who does more work. Document what you agree.',
          usualIssues: 'Not discussing this upfront causes fights later. Agree clearly now, even if awkward. It\'s much worse to fight when there\'s actual money involved.',
          details: [
            'Percentage of profits for each partner',
            'Can be different from capital contribution ratio',
            'Defined in LLP Agreement',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Digital & Legal',
      categoryNote: 'Handled by Ollvy',
      items: [
        {
          icon: <Shield size={14} />,
          name: 'Digital Signature Certificate',
          note: 'for designated partners - Ollvy arranges',
          details: [
            'Class 3 DSC for signing forms',
            'Applied by Ollvy with video verification',
            'USB token delivered to you',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <BadgeCheck size={14} />,
          name: 'DPIN',
          note: 'Designated Partner Identification Number - Ollvy applies',
          details: [
            'Unique ID for designated partners',
            'Applied through FiLLiP form',
            'Same DPIN for all LLPs where person is partner',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <HandshakeIcon size={14} />,
          name: 'LLP Agreement',
          note: 'drafted by Ollvy - defines partner rights and obligations',
          details: [
            'Comprehensive agreement covering all aspects',
            'Rights and duties of partners',
            'Profit sharing, decision making, exit clauses',
            'Must be filed within 30 days of incorporation',
            'Ollvy drafts and files on your behalf',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
  ],

  sole_proprietor: [
    {
      category: 'Identity Documents',
      categoryNote: 'Your personal KYC documents',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'your personal PAN - becomes business PAN',
          whatIsIt: 'In a sole proprietorship, you ARE the business. Your personal PAN becomes your business PAN. No separate company PAN exists - everything runs under your name.',
          howToGet: 'Just use your existing personal PAN card. Take a clear photo where all text is readable. If you don\'t have PAN, apply at incometax.gov.in (takes 2 weeks).',
          usualIssues: 'Make sure PAN is linked to Aadhaar. Unlinked PAN cards cause GST registration failures. Check status at incometax.gov.in → Link Aadhaar.',
          details: [
            'Clear colored scan of PAN card',
            'Business operates under your personal PAN',
            'No separate business PAN for sole proprietorship',
            'Must be linked with Aadhaar',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'front and back - mobile must be linked',
          whatIsIt: 'Your 12-digit Aadhaar proves your identity. OTPs will be sent to the mobile linked to your Aadhaar during GST registration and other processes.',
          howToGet: 'Scan or photo both sides. Verify your mobile is linked at myaadhaar.uidai.gov.in. If it shows an old number, update it at an Aadhaar center before starting.',
          usualIssues: 'Wrong mobile number is the #1 blocker. OTPs go to whatever number is linked - if that\'s your old SIM, you\'re stuck. Verify and update first.',
          details: [
            'Both sides of Aadhaar card',
            'Mobile number must be active for OTP verification',
            'Address proof if within last 3 months',
          ],
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photo',
          note: 'recent, white background',
          whatIsIt: 'Standard passport photo for GST registration and other business registrations. Some platforms display this on your profile.',
          howToGet: 'Any photo studio (₹50-100). Ask for "passport size, white background." Get digital copies emailed. Takes 10 minutes.',
          usualIssues: 'Old photos or selfies get rejected. The photo should be recent (within 6 months) and professional-looking.',
          details: [
            'Recent photograph (within 6 months)',
            'White background, professional attire',
            'Required for various registrations',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Business Address Proof',
      categoryNote: 'Where your business operates from',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Utility Bill',
          note: 'of business premises - electricity/water',
          whatIsIt: 'Proves where your business operates from. For sole proprietors working from home, your home electricity bill works perfectly.',
          howToGet: 'Find your latest electricity or water bill. Download from utility provider\'s app or check your email for e-bills. Bill should be recent (within 2 months).',
          usualIssues: 'Bill in parent\'s name? That\'s fine - just add an NOC from them. Bill older than 2 months? Download a fresh one or use bank statement instead.',
          details: [
            'Recent utility bill (within 2 months)',
            'Can be residential if running business from home',
            'In your name or with NOC from owner',
          ],
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Rent Agreement',
          note: 'if operating from rented premises',
          whatIsIt: 'If you\'re renting office/shop space, this proves you have legal permission to operate from that address.',
          howToGet: 'Get a standard rent agreement from your landlord. Notarized is better (costs ₹100-200). Should clearly mention the address and that it\'s for business use.',
          usualIssues: 'Expired agreements cause rejections. Check the end date. If expired, get a fresh agreement made.',
          details: [
            'Lease/rent agreement for business premises',
            'Should mention commercial/business use',
            'Notarized copy preferred',
          ],
          required: false,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'NOC from Owner',
          note: 'if utility bill not in your name',
          whatIsIt: 'A letter from the property owner saying "I\'m okay with this person running their business from my property." Needed when bills aren\'t in your name.',
          howToGet: 'We give you a template. Fill it in, get the owner (could be your parents) to sign, attach their Aadhaar copy. 10 minutes.',
          usualIssues: 'Forgetting to attach owner\'s ID proof. Always include their Aadhaar or PAN copy along with the signed NOC.',
          details: [
            'Property owner\'s consent letter',
            'Required if bills are in owner\'s name',
            'Template provided by Ollvy',
          ],
          required: false,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'Bank & Financial',
      categoryNote: 'For business verification',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'Bank Statement',
          note: 'last 3 months - personal or business account',
          whatIsIt: 'Shows your banking activity. GST registration needs this to verify you\'re a real business. Can use personal savings account - no need for a current account initially.',
          howToGet: 'Download from net banking: Statements → Last 3 months → Download PDF. If you have a business current account, that\'s preferred. Personal savings works too.',
          usualIssues: 'Account with zero transactions looks suspicious. If your account is mostly inactive, use a more active account.',
          details: [
            'Latest 3 months bank statement',
            'Shows regular transactions',
            'Business current account statement if available',
            'Required for GST registration',
          ],
          required: true,
        },
        {
          icon: <Banknote size={14} />,
          name: 'Cancelled Cheque',
          note: 'from your bank account',
          whatIsIt: 'A cheque leaf with "CANCELLED" written on it. Shows your account number, IFSC code, and name. Used to verify bank account details.',
          howToGet: 'Take a cheque from your chequebook, write "CANCELLED" across it in big letters, and take a photo. Don\'t have a chequebook? Order one from your bank (free) or use a bank letter instead.',
          usualIssues: 'Some people use cheques that are already used. Needs to be a fresh, unused cheque with CANCELLED written on it.',
          details: [
            'Shows your name, account number, IFSC',
            'Required for GST registration',
            'Can use business or personal account',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Business Details',
      categoryNote: 'Information about your business',
      items: [
        {
          icon: <Briefcase size={14} />,
          name: 'Business Name',
          note: 'trade name for your business',
          whatIsIt: 'The name customers will see on your invoices and shop board. Can be your own name ("Rahul Enterprises") or a trade name ("Sunrise Traders").',
          howToGet: 'Just decide what you want to call your business. Keep it professional and easy to remember. This name appears on your GST certificate and all invoices.',
          usualIssues: 'Don\'t use "Pvt Ltd" or "LLP" in the name - that\'s illegal for sole proprietorships. Also avoid registered trademarks of other brands.',
          details: [
            'Name under which you\'ll do business',
            'Can include your name or a trade name',
            'Should be unique in your locality',
            'Used for GST registration and invoicing',
          ],
          required: true,
        },
        {
          icon: <Globe size={14} />,
          name: 'Business Description',
          note: 'nature of goods/services offered',
          whatIsIt: 'What do you sell or what services do you provide? This helps determine your GST category and the right HSN/SAC codes for invoicing.',
          howToGet: 'Write a simple line about your business: "Trading of electronic goods" or "Freelance software development services" or "Retail sale of garments."',
          usualIssues: 'Being too vague ("consultancy") or too specific ("iPhone 14 cases only"). Be clear but broad enough to cover your actual business.',
          details: [
            'What products or services you offer',
            'Helps determine HSN/SAC codes for GST',
            'Main business activity description',
          ],
          required: true,
        },
        {
          icon: <MapPin size={14} />,
          name: 'Principal Place of Business',
          note: 'main business location address',
          details: [
            'Primary location where business is conducted',
            'Will appear on GST certificate',
            'Can add additional places later',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Optional but Recommended',
      categoryNote: 'Useful registrations for sole proprietors',
      items: [
        {
          icon: <Building size={14} />,
          name: 'Udyam Registration',
          note: 'MSME certificate - Ollvy can help obtain',
          details: [
            'Free registration for micro/small/medium enterprises',
            'Benefits: easy loans, subsidies, govt tender preference',
            'Based on investment and turnover criteria',
            'Single page registration process',
          ],
          required: false,
          ollvyProvides: true,
        },
        {
          icon: <ShieldCheck size={14} />,
          name: 'Shop & Establishment License',
          note: 'local municipal registration - if applicable',
          details: [
            'Required in most states for commercial activity',
            'Obtained from local municipal body',
            'Validity varies by state (1-5 years)',
            'Ollvy can guide on requirements for your area',
          ],
          required: false,
        },
      ],
    },
  ],

  partnership: [
    {
      category: 'Identity Documents',
      categoryNote: 'Required for all partners',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'of all partners (minimum 2, maximum 50)',
          whatIsIt: 'Every partner needs a PAN. A partnership is a group of individuals coming together - the government tracks each person separately for tax purposes, even though you\'ll also get a firm PAN later.',
          howToGet: 'Each partner provides a clear photo of their PAN card. If any partner doesn\'t have PAN, apply at incometax.gov.in - takes about 2 weeks. Foreign partners use passport instead.',
          usualIssues: 'Name mismatches between partners\' PAN and Aadhaar cause delays. If one partner has "Amit K Sharma" on PAN and "Amit Kumar Sharma" on Aadhaar, that partner needs to fix their documents first.',
          details: [
            'Clear scan of PAN for each partner',
            'Partnership requires minimum 2 partners',
            'Maximum 50 partners allowed (20 for banking)',
            'Names must match other documents exactly',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of all partners - front and back',
          whatIsIt: 'Aadhaar serves as identity and address proof for each partner. The addresses from Aadhaar are recorded in the partnership deed.',
          howToGet: 'Each partner photographs both sides of their Aadhaar card clearly. Make sure the mobile number linked to Aadhaar is still active - you may need OTP verification.',
          usualIssues: 'Partners often have Aadhaar with outdated addresses (parents\' house, old city). This is fine for the deed, but make sure the address proof submitted separately is current.',
          details: [
            'Both sides of Aadhaar for each partner',
            'Current address proof',
            'Mobile linked for verification',
          ],
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photos',
          note: '2 photos per partner',
          whatIsIt: 'Standard passport photos of each partner. These go into firm registration forms and bank account opening documents.',
          howToGet: 'Visit any photo studio and ask for passport-size photos with white background. Cost is around ₹50-100 per partner. Ask for digital copies too - useful for online forms.',
          usualIssues: 'Some partners send old photos or photos with colored backgrounds. Photos should be recent (within 6 months) and have a plain white background.',
          details: [
            'Recent photographs with white background',
            'Professional quality',
            'Required for deed and registrations',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Partner Address Proof',
      categoryNote: 'One document per partner',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Utility Bill',
          note: 'recent electricity/water bill',
          whatIsIt: 'Any utility bill showing the partner\'s current residential address. This proves where each partner lives and is used in the partnership deed.',
          howToGet: 'Each partner downloads their latest electricity or water bill from their utility provider\'s app or website. Physical bill works too. If it\'s in a family member\'s name at the same address, that\'s acceptable.',
          usualIssues: 'Bills older than 2 months are not accepted. Partners living in shared apartments sometimes struggle - use bank statement instead if the utility bill isn\'t in your name.',
          details: [
            'Not older than 2 months',
            'In partner\'s name or family member',
            'Shows current residential address',
          ],
          required: false,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'Bank Statement',
          note: 'last month with address',
          whatIsIt: 'An official bank statement showing the partner\'s name and address. Good alternative to utility bills, especially for partners who don\'t have bills in their name.',
          howToGet: 'Log into net banking, download the last month\'s statement as PDF. Make sure the first page shows your full name and complete address. Takes 2 minutes.',
          usualIssues: 'Some partners have bank accounts with hometown addresses even though they live elsewhere. If this is you, use utility bill or update your bank address first.',
          details: [
            'Official bank statement',
            'Shows full name and address',
            'Recent statement preferred',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Business Premises Documents',
      categoryNote: 'Where the partnership will operate',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Office Address Proof',
          note: 'utility bill of business premises',
          whatIsIt: 'This is the address that becomes your firm\'s official "principal place of business." It appears on your GST registration, letterheads, and all official documents.',
          howToGet: 'Get the electricity or water bill of the premises you\'ll use as office. Using a partner\'s home? That\'s fine - grab the home\'s utility bill. The bill should be recent (within 2 months).',
          usualIssues: 'If multiple partners are in different cities, decide one location as the principal place. You can add other locations as "additional places of business" later.',
          details: [
            'Electricity/water bill of office',
            'This becomes firm\'s principal place',
            'Recent bill (within 2 months)',
          ],
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Rent Agreement',
          note: 'if rented - registered or notarized',
          whatIsIt: 'If you\'re renting the office space (not using a partner\'s own property), this agreement shows you have legal permission to operate the business there.',
          howToGet: 'Standard 11-month rent agreement works. Get it notarized (₹100-200). The agreement should mention that the premises can be used for business/commercial purposes.',
          usualIssues: 'Residential rent agreements often say "for residential use only." If yours says this, get the landlord to sign an NOC allowing business use, or get a fresh agreement.',
          details: [
            'Lease agreement for business premises',
            'Should mention business use',
            'Notarized or registered copy',
          ],
          required: false,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'NOC from Owner',
          note: 'owner consent for business use',
          whatIsIt: 'A simple letter where the property owner says they\'re okay with a partnership firm operating from their property. If one partner owns the property, they still sign this.',
          howToGet: 'We provide a ready template. Fill in the property details, get the owner to sign, and attach their Aadhaar or PAN copy. If a partner owns the property, that partner signs the NOC.',
          usualIssues: 'People forget to attach the owner\'s ID proof. Without it, the NOC is incomplete. Always include owner\'s Aadhaar or PAN copy.',
          details: [
            'Property owner\'s no-objection letter',
            'Include owner\'s ID proof',
            'Template provided by Ollvy',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'Partnership Details',
      categoryNote: 'Information for partnership deed',
      items: [
        {
          icon: <Briefcase size={14} />,
          name: 'Firm Name',
          note: 'proposed name of partnership firm',
          whatIsIt: 'The official name of your partnership firm. Unlike companies, partnership names don\'t need approval - but you can\'t use protected terms like "Ltd" or "LLP."',
          howToGet: 'Decide on a name with all partners. Keep it simple and relevant to your business. Check informally that no one in your city is using the exact same name to avoid confusion.',
          usualIssues: 'Partners sometimes want to add "Pvt Ltd" or "India" - partnership firms can\'t use these. Also, if you\'re planning to trademark the name later, do a trademark search first.',
          details: [
            'Name for your partnership firm',
            'Should reflect business nature',
            'Check for local trademark conflicts',
            'Cannot use "Pvt Ltd", "LLP", etc.',
          ],
          required: true,
        },
        {
          icon: <Globe size={14} />,
          name: 'Business Nature',
          note: 'detailed description of activities',
          whatIsIt: 'A description of what your partnership will actually do. This goes into the deed and determines what activities you can legally conduct under this firm.',
          howToGet: 'List all business activities you might do - trading, manufacturing, services, consulting, etc. Be thorough. It\'s harder to add activities later than to include them from the start.',
          usualIssues: 'Being too narrow hurts you later. If you write "selling electronics" and later want to sell furniture, you technically need to amend the deed. Write broader: "trading in goods of all kinds."',
          details: [
            'All business activities the firm will undertake',
            'Used in partnership deed and GST registration',
            'Be comprehensive - hard to add later',
          ],
          required: true,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Capital Contribution',
          note: 'each partner\'s investment amount',
          whatIsIt: 'How much money (or assets) each partner is putting into the business. This doesn\'t have to be equal - one partner can contribute more than others.',
          howToGet: 'Discuss with all partners and decide the amount each person is contributing. It can be cash, equipment, property, or even goodwill. There\'s no minimum requirement.',
          usualIssues: 'Partners sometimes say "we\'ll figure it out later." The deed needs exact amounts. Even if it\'s ₹10,000 each, put it in writing. You can add more capital later via a supplementary deed.',
          details: [
            'Amount each partner is contributing',
            'Can be cash, assets, or goodwill',
            'No minimum capital requirement',
            'Documented in partnership deed',
          ],
          required: true,
        },
        {
          icon: <Scale size={14} />,
          name: 'Profit/Loss Sharing Ratio',
          note: 'how profits and losses are divided',
          whatIsIt: 'The percentage of profits (and losses) each partner gets. This can be different from capital contribution - a partner who works more might get a higher share despite investing less.',
          howToGet: 'Discuss and agree on percentages with all partners. The total must be 100%. Common splits are equal (50-50, 33-33-33) but any ratio is valid if all partners agree.',
          usualIssues: 'Partners sometimes want profit sharing but not loss sharing. That\'s not how it works - you share both. Also, remember this ratio is for splitting profits after paying salaries (if any).',
          details: [
            'Percentage share for each partner',
            'Can be different from capital ratio',
            'Must add up to 100%',
            'Clearly mentioned in deed',
          ],
          required: true,
        },
        {
          icon: <Users size={14} />,
          name: 'Partner Roles & Responsibilities',
          note: 'who manages what in the firm',
          whatIsIt: 'Who does what in the firm. This includes designating a "Managing Partner" who handles day-to-day decisions and banking, and what each other partner is responsible for.',
          howToGet: 'Discuss roles clearly. Who will sign cheques? Who manages operations? Who handles clients? Get these decisions in writing. It prevents disputes later.',
          usualIssues: 'Partners often skip this, thinking "we\'ll figure it out." That works until there\'s a disagreement. Define at least: banking authority, signing authority, and decision-making process.',
          details: [
            'Managing partner designation',
            'Decision-making authority',
            'Day-to-day responsibilities',
            'Banking and signing authority',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Legal Documentation',
      categoryNote: 'Ollvy drafts the deed - you review and sign',
      items: [
        {
          icon: <ClipboardList size={14} />,
          name: 'Partnership Deed',
          note: 'comprehensive agreement - drafted by Ollvy',
          whatIsIt: 'The partnership deed is the constitution of your firm. It\'s a legal contract between all partners covering capital, profits, roles, dispute resolution, exit terms - everything.',
          howToGet: 'We draft a comprehensive deed based on the details you provide. You review it, suggest changes if needed, then all partners sign it on stamp paper. We handle the entire process.',
          usualIssues: 'Rushed deeds with vague terms cause problems years later. Take time to read every clause. Common miss: what happens if a partner wants to exit or dies? Our deed covers these scenarios.',
          details: [
            'Legally binding agreement between partners',
            'Covers all aspects: capital, profits, duties, disputes',
            'Must be executed on stamp paper',
            'Stamp duty varies by state (typically 1-3% of capital)',
            'Ollvy drafts a comprehensive deed for you',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <Stamp size={14} />,
          name: 'Stamp Paper',
          note: 'as per state - Ollvy procures appropriate value',
          whatIsIt: 'Partnership deeds must be printed on stamp paper of specific value. The value depends on your state and the capital amount mentioned in the deed.',
          howToGet: 'We procure the correct denomination stamp paper for your state. You don\'t need to worry about this - we calculate the required value and arrange it.',
          usualIssues: 'Using wrong stamp value can make the deed invalid or attract penalties. Each state has different rates. In Maharashtra, it\'s typically ₹500-1000 for most partnerships. We ensure it\'s correct.',
          details: [
            'Non-judicial stamp paper',
            'Value depends on state and capital',
            'Ollvy procures correct denomination',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Partner Signatures',
          note: 'all partners sign the deed - witnessed by 2 people',
          whatIsIt: 'Every partner must sign the deed. Additionally, two witnesses (who are not partners) must sign confirming they saw all partners sign.',
          howToGet: 'Once the deed is printed on stamp paper, all partners gather to sign. Each partner initials every page and signs fully on the last page. Two adults present as witnesses also sign.',
          usualIssues: 'Partners in different cities can\'t sign together. In such cases, we can arrange for the deed to be couriered, but all partners must sign before the same date mentioned in the deed.',
          details: [
            'All partners must sign the deed',
            '2 witnesses required (with ID proof)',
            'Sign on all pages (initials) and last page (full signature)',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Optional Registrations',
      categoryNote: 'Recommended for legal protection',
      items: [
        {
          icon: <Building size={14} />,
          name: 'Firm Registration',
          note: 'with Registrar of Firms - optional but recommended',
          whatIsIt: 'Registration of your partnership with the state\'s Registrar of Firms. While not mandatory, an unregistered firm cannot sue third parties in court - a major disadvantage.',
          howToGet: 'We handle the entire registration process. You provide the signed deed and partner documents, we file with the Registrar. Takes about 2-4 weeks depending on the state.',
          usualIssues: 'Many partnerships skip registration to save ₹2,000-3,000, then regret it when they can\'t legally enforce a contract or apply for tenders that require registration certificate.',
          details: [
            'Not mandatory but highly recommended',
            'Allows firm to sue third parties',
            'Required for many tenders and contracts',
            'Ollvy handles complete registration process',
          ],
          required: false,
          ollvyProvides: true,
        },
        {
          icon: <ShieldCheck size={14} />,
          name: 'Partnership PAN',
          note: 'separate PAN for the firm - Ollvy applies',
          whatIsIt: 'Your partnership firm gets its own PAN, separate from the partners\' personal PANs. This firm PAN is used for all business transactions, GST, and filing the firm\'s ITR.',
          howToGet: 'We apply for the firm\'s PAN immediately after the deed is executed. You\'ll receive the PAN card in about 2 weeks. This is needed before you can open a bank account or get GST.',
          usualIssues: 'Some people try to operate using a partner\'s personal PAN. This creates accounting nightmares and tax issues. Always get a separate firm PAN - it\'s ₹107 and essential.',
          details: [
            'Firm gets its own PAN (different from partners)',
            'Required for GST and bank account',
            'Applied after deed execution',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
  ],

  individual_itr: [
    {
      category: 'Basic Identity',
      categoryNote: 'Essential for all taxpayers',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'your Permanent Account Number',
          whatIsIt: 'Your PAN is your tax identity. Every rupee you earn, every ITR you file, every financial transaction above ₹50,000 - the government tracks it through your 10-digit PAN.',
          howToGet: 'You already have a PAN if you\'ve ever filed taxes or opened a bank account. Just take a clear photo. If name differs from other documents, we can still file but there might be questions later.',
          usualIssues: 'PAN not linked to Aadhaar is the #1 problem. If they\'re not linked, you can\'t file ITR. Check link status at incometax.gov.in → Link Aadhaar. Takes 2 minutes to link.',
          details: [
            'Clear scan of PAN card',
            'Must be linked with Aadhaar',
            'Used for e-verification of ITR',
            'Name should match Form 16 and bank records',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'linked to PAN - required for e-filing',
          whatIsIt: 'Aadhaar is used for e-verification of your ITR. Instead of sending a physical signed copy, you verify via Aadhaar OTP - the most convenient option.',
          howToGet: 'Just ensure your mobile number is linked to Aadhaar and currently active. You\'ll receive an OTP on that number when we verify the return. Check status at myaadhaar.uidai.gov.in.',
          usualIssues: 'Old mobile number linked to Aadhaar - you won\'t get the OTP. Either update your mobile at an Aadhaar center (free) or we can use net banking/DSC for verification instead.',
          details: [
            'PAN-Aadhaar linking mandatory',
            'Mobile number must be active for OTP',
            'E-verification done via Aadhaar OTP',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Income from Salary',
      categoryNote: 'If you\'re employed / have salary income',
      items: [
        {
          icon: <Briefcase size={14} />,
          name: 'Form 16',
          note: 'TDS certificate from employer - for full financial year',
          whatIsIt: 'Form 16 is your salary certificate. It shows exactly how much your employer paid you, how much TDS they deducted, and what deductions they considered. We base your entire salary section on this.',
          howToGet: 'Your employer must provide Form 16 by June 15 every year. Ask HR. Most companies email it or upload to an employee portal. If you changed jobs, get Form 16 from each employer.',
          usualIssues: 'Switched jobs mid-year and didn\'t get Form 16 from the previous employer - very common. Contact that company\'s HR. Alternatively, we can reconstruct using salary slips, but Form 16 is cleaner.',
          details: [
            'Issued by employer by June 15 each year',
            'Contains Part A (TDS details) and Part B (salary breakup)',
            'Shows total salary, deductions, and tax deducted',
            'Download from TRACES if employer hasn\'t provided',
          ],
          required: true,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'Salary Slips',
          note: 'monthly pay slips - if Form 16 not available',
          whatIsIt: 'Monthly payslips showing your gross salary, deductions, and net pay. These are a backup if Form 16 isn\'t available yet, or to verify Form 16 details.',
          howToGet: 'Download from your company\'s HR portal or ask HR for PDFs. You need all 12 months (April to March) for the financial year you\'re filing.',
          usualIssues: 'People often have payslips but not Form 16. While we can work with payslips, Form 16 is the official document. If it\'s July and you still don\'t have Form 16, escalate with HR.',
          details: [
            'All 12 months salary slips',
            'Shows gross salary, deductions, net pay',
            'Useful for verifying Form 16 details',
            'Required if Form 16 not yet issued',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Form 12BA',
          note: 'perquisites statement - if you received non-cash benefits',
          whatIsIt: 'If your company gave you non-cash benefits (company car, rent-free house, club memberships, ESOPs), those are taxable "perquisites." Form 12BA details these.',
          howToGet: 'If applicable, it\'s usually attached to your Form 16. Not everyone has perquisites - most regular employees don\'t need this.',
          usualIssues: 'ESOP taxation confuses people. If you exercised stock options, make sure this is reflected somewhere. ESOP gains are taxable as salary when exercised.',
          details: [
            'Details of perquisites and profits in lieu of salary',
            'Company car, rent-free accommodation, etc.',
            'Usually part of Form 16 annexure',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Bank & Interest Income',
      categoryNote: 'All accounts where you earn interest',
      items: [
        {
          icon: <Landmark size={14} />,
          name: 'Bank Statements',
          note: 'all accounts - April 1 to March 31 of the financial year',
          whatIsIt: 'Bank statements show interest credited to your accounts during the year. This interest is taxable income - even the ₹2,000 from your savings account.',
          howToGet: 'Log into each bank\'s net banking, download statements from April 1 to March 31. Look for "Interest Paid" entries (usually quarterly for savings accounts).',
          usualIssues: 'Forgetting about dormant accounts or accounts in other cities. Check if you have any old FDs, RDs, or savings accounts still earning interest. All must be reported.',
          details: [
            'Savings, current, and FD accounts',
            'Full year statement (April to March)',
            'Shows interest credited during the year',
            'Include joint accounts where you\'re first holder',
          ],
          required: true,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Interest Certificates',
          note: 'from banks showing interest earned',
          whatIsIt: 'Banks issue certificates showing total interest paid and TDS deducted (if any). For FDs above the threshold, banks deduct 10% TDS on interest.',
          howToGet: 'Check net banking under "Tax" or "Certificates" section. Or request from your branch. For FDs, you\'ll get Form 16A showing TDS deducted.',
          usualIssues: 'FD interest is taxable yearly (accrual basis), but many people think it\'s taxable only when FD matures. We handle this correctly.',
          details: [
            'Certificate for FD/RD interest',
            'Form 16A if TDS deducted on interest',
            'Available in net banking or from branch',
          ],
          required: true,
        },
        {
          icon: <PiggyBank size={14} />,
          name: 'PPF/NSC Statement',
          note: 'if you have post office or PPF investments',
          whatIsIt: 'PPF interest is tax-free (EEE status), but it still appears in AIS and needs to be reported under exempt income. NSC interest is taxable yearly (accrual basis).',
          howToGet: 'For PPF: get passbook from your bank/post office or download statement. For NSC: interest accrues yearly but you can claim it under 80C, so keep track.',
          usualIssues: 'NSC interest taxation is tricky - interest accrues each year, but people don\'t report it until maturity. We handle the proper treatment.',
          details: [
            'PPF passbook or statement',
            'NSC certificates (for accrued interest)',
            'Post office savings account statement',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Capital Gains',
      categoryNote: 'If you sold shares, property, or other assets',
      items: [
        {
          icon: <TrendingUp size={14} />,
          name: 'Stock Trading Statement',
          note: 'P&L and capital gains report from broker',
          whatIsIt: 'If you bought and sold shares, mutual funds, or traded F&O, you have capital gains (or losses). Your broker provides a detailed report showing each transaction and net gains.',
          howToGet: 'Log into your broker (Zerodha, Groww, etc.) → Reports → Tax P&L or Capital Gains Statement. Download the FY statement. Takes 30 seconds.',
          usualIssues: 'F&O traders often don\'t realize they need to file ITR-3 (not ITR-1). If you traded futures or options, let us know - it changes which form we use.',
          details: [
            'Annual capital gains statement from broker',
            'LTCG and STCG breakup',
            'Transaction-wise profit/loss details',
            'Available in broker\'s back office or app',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Mutual Fund Statement',
          note: 'capital gains from MF redemptions',
          whatIsIt: 'If you redeemed (sold) any mutual funds during the year, you have capital gains. Your AMC provides a capital gains statement showing purchase cost, sale value, and gains.',
          howToGet: 'Download CAS (Consolidated Account Statement) from CAMS or KFintech. Or log into your MF app (Groww, Kuvera, Coin) → Tax Reports → Capital Gains Statement.',
          usualIssues: 'ELSS redemptions after 3 years cause confusion. They\'re LTCG taxed at 10% above ₹1 lakh - but many people think ELSS is fully tax-free.',
          details: [
            'Consolidated Account Statement (CAS) from CAMS/KFintech',
            'Capital gains statement (available from AMC)',
            'Shows purchase price, sale price, gains',
          ],
          required: false,
        },
        {
          icon: <Home size={14} />,
          name: 'Property Sale Documents',
          note: 'if you sold property during the year',
          whatIsIt: 'If you sold land, flat, or house during the year, you have capital gains. We need the sale deed and original purchase documents to calculate the gain properly.',
          howToGet: 'Gather: the sale deed (from the buyer/registry), your original purchase deed, stamp duty receipts for both. If you had a home loan, include the closure statement.',
          usualIssues: 'People don\'t keep old purchase documents. We need them to calculate the original cost. If you can\'t find them, we use the stamp duty value from the time of purchase.',
          details: [
            'Sale deed of property sold',
            'Original purchase deed (for cost calculation)',
            'Registration receipts and stamp duty paid',
            'Home loan closure statement if applicable',
          ],
          required: false,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Cost Inflation Index',
          note: 'for indexation benefit - Ollvy calculates this',
          whatIsIt: 'For properties held over 2 years, you get "indexation benefit" - your purchase cost is adjusted for inflation, reducing your taxable gain. This uses government-notified CII numbers.',
          howToGet: 'You don\'t need to do anything. We automatically apply the correct CII based on your purchase year. Just provide the purchase documents.',
          usualIssues: 'People try to calculate CII themselves using old formulas. The rates change yearly. Let us handle this - one wrong number means wrong tax.',
          details: [
            'Used for calculating indexed cost of acquisition',
            'Reduces long-term capital gains tax',
            'Ollvy applies appropriate CII automatically',
          ],
          required: false,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'House Property Income',
      categoryNote: 'If you own rental property',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Rent Receipts/Agreement',
          note: 'proof of rental income received',
          whatIsIt: 'If you receive rent from a property you own, that\'s taxable income under "Income from House Property." We need proof of how much rent you actually received.',
          howToGet: 'Share the rent agreement and bank statements showing rent credits. If tenant paid cash (not recommended), keep signed rent receipts.',
          usualIssues: 'Property lying vacant is still taxable at "deemed rent" (reasonable expected rent). Many people don\'t know this. If your property is vacant, tell us.',
          details: [
            'Rental agreement with tenant',
            'Bank statements showing rent credited',
            'Municipal tax receipts (deductible)',
          ],
          required: false,
        },
        {
          icon: <Building2 size={14} />,
          name: 'Home Loan Statement',
          note: 'for interest deduction on rented property',
          whatIsIt: 'If you have a home loan on the rented property, the entire interest paid is deductible against rental income. This can even create a loss that offsets other income.',
          howToGet: 'Download the annual interest certificate from your bank\'s net banking under "Tax Certificates" or "Home Loan" section. Shows total interest paid for the financial year.',
          usualIssues: 'People don\'t claim the full interest on rented property because they confuse it with self-occupied limits. For rented property, there\'s NO limit on interest deduction.',
          details: [
            'Annual home loan interest certificate',
            'Shows principal and interest paid',
            'Full interest deductible for rented property',
            'Get from bank or download from net banking',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Other Income',
      categoryNote: 'Freelance, dividends, gifts, etc.',
      items: [
        {
          icon: <Wallet size={14} />,
          name: 'Freelance/Consulting Income',
          note: 'invoices and payment proofs',
          whatIsIt: 'Income from side gigs, consulting, freelance work outside your main job. This is "Income from Business/Profession" and needs to be reported even if it\'s small.',
          howToGet: 'Compile all invoices you raised during the year, bank statements showing payments, and Form 16A from clients who deducted TDS. Also gather expense receipts (laptop, internet, etc.).',
          usualIssues: 'Freelancers forget about expenses. If you earned ₹5 lakh freelancing but spent ₹1 lakh on equipment and software, your taxable income is ₹4 lakh. Keep expense records.',
          details: [
            'All invoices raised during the year',
            'Bank statements showing payments received',
            'TDS certificates (Form 16A) from clients',
            'Expenses incurred for earning this income',
          ],
          required: false,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Dividend Statements',
          note: 'from shares and mutual funds',
          whatIsIt: 'Dividend income from stocks and mutual funds is now taxable in your hands (since FY 2020-21). It\'s added to your total income and taxed at your slab rate.',
          howToGet: 'Check your demat statement or CAS for dividend credited during the year. Also check AIS on the income tax portal - all dividends received are auto-reported there.',
          usualIssues: 'People still think dividends are tax-free. They\'re not anymore. If you hold high-dividend stocks, you might have surprise tax liability.',
          details: [
            'Dividend income from stocks (taxable above ₹10 lakh)',
            'Dividend from mutual funds',
            'Available in CAS or demat statement',
          ],
          required: false,
        },
        {
          icon: <FileQuestion size={14} />,
          name: 'Other Income Proofs',
          note: 'interest from others, gifts above ₹50,000, etc.',
          whatIsIt: 'Any income that doesn\'t fit other categories: interest on loans given to friends/family, gifts above ₹50,000 from non-relatives, lottery/betting winnings, agricultural income (exempt but reportable).',
          howToGet: 'Make a list of any unusual income you received. Lottery and betting winnings have 30% TDS deducted at source. Gifts from relatives are exempt - but keep records.',
          usualIssues: 'Gifts from friends (non-relatives) above ₹50,000 are taxable. Many people receive wedding gifts and don\'t realize they might be taxable. Gifts from relatives are always exempt.',
          details: [
            'Interest received from loans given to others',
            'Gifts received above ₹50,000 (taxable if not from relatives)',
            'Lottery/gambling winnings (30% TDS)',
            'Agricultural income (exempt but reported)',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Tax Saving Deductions - Section 80C',
      categoryNote: 'Investments that reduce taxable income - up to ₹1.5 lakh',
      items: [
        {
          icon: <PiggyBank size={14} />,
          name: 'Life Insurance Premium',
          note: 'LIC or private insurer premium receipts',
          whatIsIt: 'Life insurance premiums count as 80C deduction. This includes LIC, term plans, ULIPs, endowment policies - any life cover for yourself, spouse, or children.',
          howToGet: 'Check your email for premium payment receipts. Or log into the insurer\'s website/app. LIC users: check UMANG app or LIC portal for payment history.',
          usualIssues: 'Only premiums up to 10% of sum assured qualify. If you pay ₹1 lakh premium for ₹5 lakh cover, only ₹50,000 qualifies. Also, single premium policies have different rules.',
          details: [
            'Premium paid for self, spouse, children',
            'Includes term insurance, ULIPs, endowment',
            'Annual premium receipt from insurer',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'PPF/EPF Contribution',
          note: 'Provident Fund contributions',
          whatIsIt: 'EPF is auto-deducted from salary (employee\'s share). PPF is voluntary contributions you make. Both qualify under 80C - up to ₹1.5 lakh combined with other 80C items.',
          howToGet: 'EPF: it\'s in your Form 16 Part B under "Provident Fund." PPF: download statement from the bank where your PPF account is, showing deposits during the year.',
          usualIssues: 'Some people count both employee AND employer EPF contribution. Only your contribution (employee\'s share) counts for 80C. Employer\'s share is separate.',
          details: [
            'Employee contribution to EPF (from Form 16)',
            'Voluntary PPF contributions',
            'PPF passbook showing deposits',
          ],
          required: false,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'ELSS Mutual Fund',
          note: 'equity-linked savings scheme investments',
          whatIsIt: 'ELSS mutual funds are tax-saving equity funds with 3-year lock-in. They offer 80C benefit with higher return potential than PPF/FD.',
          howToGet: 'Download statement from CAMS/KFintech or your MF app showing ELSS purchases during the financial year. Only investments made between Apr 1 and Mar 31 count.',
          usualIssues: 'SIP investments count for the month they\'re invested. A March SIP counts for that financial year. But an April 1 SIP counts for the NEXT year.',
          details: [
            'ELSS mutual fund statements',
            'Tax-saving mutual funds with 3-year lock-in',
            'One of the best 80C options (higher returns)',
          ],
          required: false,
        },
        {
          icon: <GraduationCap size={14} />,
          name: 'Children\'s Tuition Fees',
          note: 'school/college fees for up to 2 children',
          whatIsIt: 'School or college tuition fees paid for up to 2 children qualify under 80C. This is actual tuition fee - not development fees, donation, transport, or hostel.',
          howToGet: 'Get fee receipts from the school/college clearly showing the tuition fee component. Most schools give annual fee receipts that break down components.',
          usualIssues: 'People claim the entire school fee. Only the "tuition fee" line item counts. Development fees, building fund, donation - these don\'t qualify.',
          details: [
            'Tuition fee receipts from school/college',
            'Only tuition fee (not development/donation)',
            'Maximum 2 children',
            'Full-time education in India only',
          ],
          required: false,
        },
        {
          icon: <Home size={14} />,
          name: 'Home Loan Principal',
          note: 'principal repayment - from loan statement',
          whatIsIt: 'The principal portion of your home loan EMI qualifies under 80C. This is separate from interest (which goes under Section 24). Also includes stamp duty paid during purchase year.',
          howToGet: 'Download annual interest certificate from bank\'s net banking. It clearly shows principal paid vs interest paid during the year.',
          usualIssues: 'People claim interest under 80C - that\'s wrong. 80C is for principal. Interest is Section 24 (up to ₹2 lakh for self-occupied property).',
          details: [
            'Principal portion of home loan EMI',
            'From annual home loan statement',
            'Also includes stamp duty and registration paid',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'NSC/Tax Saver FD',
          note: 'National Savings Certificate, 5-year FD',
          whatIsIt: 'NSC (National Savings Certificate) and 5-year tax saver FDs are safe, fixed-return 80C options. NSC also has an interesting quirk - accrued interest is reinvested and also qualifies for 80C.',
          howToGet: 'NSC: certificate from post office. Tax Saver FD: receipt from bank showing 5-year lock-in. Sukanya Samriddhi: passbook from post office/bank.',
          usualIssues: 'Regular FDs don\'t qualify - only 5-year tax saver FDs do. These have a lock-in and slightly lower interest than regular FDs. Make sure it\'s specifically a "Tax Saver FD."',
          details: [
            'NSC purchase certificate',
            '5-year tax saver FD receipt',
            'Sukanya Samriddhi (for girl child)',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Tax Saving Deductions - Other Sections',
      categoryNote: 'Additional deductions beyond 80C',
      items: [
        {
          icon: <Heart size={14} />,
          name: 'Health Insurance - 80D',
          note: 'mediclaim premium for self, family, parents',
          whatIsIt: 'Health insurance premium qualifies under 80D - separate from and in addition to 80C. You can claim for yourself+family AND separately for parents.',
          howToGet: 'Download premium receipt from your insurer\'s app or email. It shows amount paid and policy period. You need receipts for each policy - self/family and parents separately.',
          usualIssues: 'If employer provides health cover, you can\'t claim that premium. Only policies you personally pay for qualify. Paying parents\' premium in cash? Keep receipts.',
          details: [
            'Self/spouse/children: up to ₹25,000 (₹50,000 if senior citizen)',
            'Parents: additional ₹25,000 (₹50,000 if senior)',
            'Preventive health checkup: ₹5,000 within above limits',
            'Premium receipts from insurance company',
          ],
          required: false,
        },
        {
          icon: <GraduationCap size={14} />,
          name: 'Education Loan Interest - 80E',
          note: 'interest on education loan for higher studies',
          whatIsIt: 'Interest paid on education loans for higher studies (self, spouse, or children) is fully deductible with no upper limit. This is one of the most generous deductions available.',
          howToGet: 'Get interest certificate from your lender (bank/NBFC). It shows total interest paid during the financial year. Most banks provide this in net banking under "Tax" section.',
          usualIssues: 'The loan must be from a recognized bank/NBFC - loans from relatives don\'t qualify. Also, only the interest portion is deductible, not the principal (principal has no 80E benefit).',
          details: [
            'Interest certificate from lender',
            'For higher education of self, spouse, children',
            'No upper limit on deduction',
            'Available for 8 years from start of repayment',
          ],
          required: false,
        },
        {
          icon: <Home size={14} />,
          name: 'Home Loan Interest - 80EEA',
          note: 'additional ₹1.5 lakh for first-time buyers',
          whatIsIt: 'First-time homebuyers with affordable housing (value up to ₹45 lakh) can claim additional ₹1.5 lakh interest deduction under 80EEA - over and above the ₹2 lakh under Section 24.',
          howToGet: 'Same home loan statement you use for Section 24 and 80C. We automatically check if you qualify for 80EEA based on loan sanction date and property value.',
          usualIssues: 'This section has sunset - only loans sanctioned between Apr 2019 and Mar 2022 qualify. If your loan was sanctioned after Mar 2022, you don\'t get 80EEA.',
          details: [
            'Property value up to ₹45 lakh',
            'Loan sanctioned between Apr 2019 - Mar 2022',
            'Should not own any other house',
            'Beyond the ₹2 lakh limit under Section 24',
          ],
          required: false,
        },
        {
          icon: <Banknote size={14} />,
          name: 'Donations - 80G',
          note: 'donations to approved charities',
          whatIsIt: 'Donations to registered charities and NGOs qualify for 80G deduction. Different charities have 50% or 100% deduction rates - PM Relief Fund is 100%, most others are 50%.',
          howToGet: 'Get an 80G receipt from the charity showing their registration number, your donation amount, and payment mode. Many charities email this automatically.',
          usualIssues: 'Cash donations above ₹2,000 don\'t qualify - pay by cheque/UPI. Also, not all NGOs are 80G registered. If they are, they\'ll have an 80G registration number on the receipt.',
          details: [
            'Receipt from registered charity',
            'PAN of the organization',
            '50% or 100% deduction depending on charity',
            'Cash donations above ₹2,000 not eligible',
          ],
          required: false,
        },
        {
          icon: <Home size={14} />,
          name: 'House Rent - 80GG',
          note: 'if not receiving HRA from employer',
          whatIsIt: 'If you pay rent but don\'t receive HRA from your employer (common for business owners, self-employed), you can claim rent deduction under 80GG instead.',
          howToGet: 'Keep rent receipts and rental agreement. If rent is above ₹1 lakh/year, you need landlord\'s PAN. We file Form 10BA declaration as part of your ITR.',
          usualIssues: 'You can\'t claim both HRA and 80GG. If your employer gives HRA (even if it\'s ₹1), 80GG doesn\'t apply. Also, you/spouse/child shouldn\'t own a house in the same city.',
          details: [
            'Rent receipts with landlord PAN (if rent >₹1 lakh/year)',
            'No HRA in salary',
            'Self/spouse/child should not own house in same city',
            'Deduction: lower of rent-10% of income, ₹5,000/month, or 25% of income',
          ],
          required: false,
        },
        {
          icon: <PiggyBank size={14} />,
          name: 'NPS Contribution - 80CCD',
          note: 'National Pension Scheme investment',
          whatIsIt: 'NPS contributions give you additional ₹50,000 deduction under 80CCD(1B) - over and above the ₹1.5 lakh 80C limit. That\'s up to ₹2 lakh total savings.',
          howToGet: 'Download NPS statement from NSDL CRA portal or your bank (if NPS is through your bank). Shows contributions made during the financial year.',
          usualIssues: 'Only Tier 1 NPS qualifies for tax benefits. Tier 2 doesn\'t. Also, employer\'s NPS contribution (if any) has separate treatment - up to 10% of salary is exempt.',
          details: [
            'Self contribution: ₹50,000 additional over 80C',
            'Employer contribution: 10% of salary',
            'NPS Tier 1 statement from NSDL/Karvy',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'TDS & Advance Tax',
      categoryNote: 'Taxes already paid during the year',
      items: [
        {
          icon: <Receipt size={14} />,
          name: 'Form 26AS / AIS',
          note: 'your tax credit statement - download from income tax portal',
          whatIsIt: 'Form 26AS and AIS (Annual Information Statement) show everything the government already knows about you - all TDS deducted, all reported income, all transactions above certain limits.',
          howToGet: 'Log into incometax.gov.in → e-File → Income Tax Returns → View AIS. Also download 26AS from the same portal. We cross-check both with your documents.',
          usualIssues: 'Mismatch between 26AS and your records is common. If employer hasn\'t filed TDS return, your TDS won\'t show in 26AS. We identify and resolve mismatches before filing.',
          details: [
            'Annual Information Statement shows all reported income',
            'TDS deducted by employers, banks, clients',
            'Advance tax and self-assessment tax paid',
            'Refunds received',
            'Download from incometax.gov.in',
          ],
          required: true,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Advance Tax Challans',
          note: 'if you paid advance tax during the year',
          whatIsIt: 'If your tax liability after TDS is more than ₹10,000, you should pay advance tax quarterly. If you paid advance tax during the year, keep those challan receipts.',
          howToGet: 'Challan receipts (Challan 280) from when you paid via bank or online. Also visible in Form 26AS under "Taxes Paid." But keep original challans as backup.',
          usualIssues: 'Missed advance tax attracts interest under 234B/234C. If you didn\'t pay enough, we calculate the interest and include it. Not a huge deal but costs a bit extra.',
          details: [
            'Challan 280 receipts for advance tax paid',
            'Paid quarterly: Jun 15, Sep 15, Dec 15, Mar 15',
            'Verify credit in Form 26AS',
          ],
          required: false,
        },
        {
          icon: <FileText size={14} />,
          name: 'Form 16A/16B/16C',
          note: 'TDS on interest, property, rent',
          whatIsIt: 'Different TDS certificates for different income types. 16A: TDS on interest/professional fees. 16B: TDS on property purchase. 16C: TDS deducted by tenant on rent.',
          howToGet: 'Request from whoever deducted TDS. Banks provide 16A in net banking. Property buyers provide 16B. Tenants provide 16C. You can also download from TRACES portal.',
          usualIssues: 'Freelancers often don\'t collect Form 16A from clients. It\'s important - without it, we can\'t verify TDS claimed. Follow up with clients or check TRACES.',
          details: [
            '16A: TDS on interest, professional fees',
            '16B: TDS on property sale',
            '16C: TDS on rent (if tenant deducted TDS)',
            'From deductor or download from TRACES',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Previous Year Data',
      categoryNote: 'For continuity and brought-forward losses',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Last Year\'s ITR',
          note: 'acknowledgment and return copy',
          whatIsIt: 'Your previous year\'s ITR-V (acknowledgment) and return copy help us verify opening balances and ensure continuity. Also needed if you\'re carrying forward losses.',
          howToGet: 'Download from incometax.gov.in → e-File → Income Tax Returns → View Filed Returns. Download both ITR-V and the JSON/PDF of the return.',
          usualIssues: 'First-time filers won\'t have this. If you filed elsewhere last year and don\'t have copies, download from the ITD portal. If you didn\'t file at all, tell us.',
          details: [
            'ITR-V acknowledgment of previous year',
            'Copy of filed return (JSON/PDF)',
            'Helps in carrying forward losses',
            'Useful for checking last year\'s data',
          ],
          required: false,
        },
        {
          icon: <TrendingUp size={14} />,
          name: 'Brought Forward Losses',
          note: 'capital losses or business losses from previous years',
          whatIsIt: 'If you had losses in previous years (capital loss from stocks, business loss), you can carry them forward to offset against this year\'s gains. Losses can be carried for 8 years.',
          howToGet: 'Refer to Schedule CFL (Carry Forward Loss) from previous ITRs. We check your past returns to identify losses that can still be set off this year.',
          usualIssues: 'You must have filed ITR in the loss year to carry forward losses. If you had losses but didn\'t file that year\'s ITR, those losses are gone - can\'t be claimed.',
          details: [
            'Losses from last 8 years can be set off',
            'Capital losses against capital gains',
            'Business losses against business income',
            'From previous ITRs',
          ],
          required: false,
        },
      ],
    },
  ],

  trademark: [
    {
      category: 'Applicant Identity',
      categoryNote: 'Documents of the trademark owner (individual or company)',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card',
          note: 'of applicant - individual or business entity',
          whatIsIt: 'The trademark will be registered in this PAN holder\'s name. For individuals, use personal PAN. For companies, use the company\'s PAN. This determines who legally owns the brand.',
          howToGet: 'For individuals: your personal PAN card photo. For companies: download company PAN from TRACES or use the physical card. For proprietorship: proprietor\'s personal PAN.',
          usualIssues: 'Founders often register trademarks in their personal name, then struggle to transfer to the company later. If you\'re building a startup, consider registering in the company\'s name from the start.',
          details: [
            'For individuals: personal PAN card',
            'For companies/LLPs: entity PAN card',
            'For proprietorship: proprietor\'s personal PAN',
            'Clear, colored scan required',
          ],
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of applicant or authorized signatory',
          whatIsIt: 'Used for identity verification during the application. For companies, we need the Aadhaar of the director who will sign the application.',
          howToGet: 'Take a clear photo of both sides of Aadhaar. Make sure the mobile number linked to Aadhaar is active - you may need OTP verification during the process.',
          usualIssues: 'If applying as a company, some directors use their personal address which is different from the company\'s registered office. This is fine - the trademark address is separate from director\'s address.',
          details: [
            'Both sides of Aadhaar required',
            'For companies: Aadhaar of authorized director',
            'Mobile linked for OTP verification',
            'Address must be current',
          ],
          required: true,
        },
        {
          icon: <Home size={14} />,
          name: 'Address Proof',
          note: 'utility bill, bank statement, or passport',
          whatIsIt: 'The address that appears on your trademark certificate. For individuals, this is your residential address. For companies, this is typically the registered office.',
          howToGet: 'Any recent document showing your current address - electricity bill, bank statement, or passport. For companies, use a utility bill of the registered office.',
          usualIssues: 'Address changes are possible but cost ₹900+ per trademark. Pick an address you expect to be stable for 10 years (trademark validity period).',
          details: [
            'Must show current address',
            'Not older than 3 months (for utility bills)',
            'For companies: registered office address proof',
            'Address appears on trademark certificate',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Business Entity Documents',
      categoryNote: 'If applying as a company, LLP, or partnership',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Certificate of Incorporation',
          note: 'for Pvt Ltd, LLP, or OPC - from MCA',
          whatIsIt: 'Proves your company legally exists. The trademark will be registered in the company\'s name as shown on this certificate.',
          howToGet: 'Download from MCA portal → Company/LLP Master Data. Or use the original certificate you received during incorporation. Make sure it\'s clear and complete.',
          usualIssues: 'Company name changed after incorporation? Use the latest Name Change Certificate. The trademark should be in the current legal name.',
          details: [
            'Official COI from MCA portal',
            'Shows company name, CIN, date of incorporation',
            'For LLPs: LLP Agreement also helpful',
            'Not required for sole proprietors',
          ],
          required: false,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Board Resolution',
          note: 'authorizing trademark application - for companies',
          whatIsIt: 'A formal board decision authorizing one director to file the trademark application on behalf of the company. This proves the application is officially sanctioned by the company.',
          howToGet: 'We provide a template. Directors sign it, date it, and it\'s done. Takes 5 minutes. The resolution should mention the exact trademark/brand name being applied for.',
          usualIssues: 'Single-director OPCs don\'t need a "board" resolution - a simple authorization letter works. We provide the appropriate format based on your entity type.',
          details: [
            'Resolution authorizing a director to file',
            'Should mention the trademark/brand name',
            'Signed by directors with date',
            'Ollvy provides template if needed',
          ],
          required: false,
          ollvyProvides: true,
        },
        {
          icon: <HandshakeIcon size={14} />,
          name: 'Partnership Deed',
          note: 'for partnership firms - showing authorized partner',
          whatIsIt: 'If you\'re a partnership firm, the deed proves the firm exists and shows which partner is authorized to act on behalf of the firm.',
          howToGet: 'Provide a copy of your executed partnership deed. Highlight which partner will sign the trademark application. That partner\'s details go on the forms.',
          usualIssues: 'If the deed doesn\'t specify who can sign legal documents, any partner can technically apply. But it\'s cleaner if the deed designates a managing partner.',
          details: [
            'Executed partnership deed',
            'Shows names of all partners',
            'Identifies partner authorized to file',
          ],
          required: false,
        },
        {
          icon: <BadgeCheck size={14} />,
          name: 'MSME/Udyam Certificate',
          note: 'for 50% discount on government fees',
          whatIsIt: 'If you\'re a registered MSME (Udyam), you get 50% off government fees. For startups filing multiple classes, this can save thousands of rupees.',
          howToGet: 'If you have Udyam registration, download the certificate from udyamregistration.gov.in. Don\'t have it? We can help you get one - it\'s free and takes 1-2 days.',
          usualIssues: 'Many startups don\'t know they qualify for Udyam. If your turnover is under ₹250 Cr and investment in equipment under ₹50 Cr, you\'re likely eligible.',
          details: [
            'Valid Udyam registration certificate',
            'Reduces govt fee from ₹4,500 to ₹2,250 per class',
            'Significant savings for startups',
            'Ollvy can help obtain Udyam registration',
          ],
          required: false,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'Trademark Details',
      categoryNote: 'What you want to protect',
      items: [
        {
          icon: <Globe size={14} />,
          name: 'Brand Name (Word Mark)',
          note: 'the exact text you want to trademark',
          whatIsIt: 'The exact name/word you want to protect. A word mark protects the text itself, regardless of font or style. "Nike" as word mark protects "Nike" in any font.',
          howToGet: 'Just tell us the name. Exact spelling matters - "Ollvy" and "OLLVY" and "ollvy" are different applications. Pick one form that you\'ll use consistently.',
          usualIssues: 'Generic or descriptive names get rejected. "Best Coffee" for a coffee shop won\'t get approved. Made-up or distinctive names (like "Zomato") get approved faster.',
          details: [
            'Exact spelling and capitalization matters',
            'Distinctive names get approved faster',
            'Avoid generic/descriptive terms',
            'Check availability before applying',
          ],
          required: true,
        },
        {
          icon: <Palette size={14} />,
          name: 'Logo File (if applicable)',
          note: 'high-resolution PNG or JPG - min 300 DPI',
          whatIsIt: 'If you want to protect your logo design (not just the name), provide a high-resolution image. A logo trademark protects that specific visual design.',
          howToGet: 'Export from your design tool (Figma, Illustrator) at minimum 300 DPI. PNG with transparent background is ideal. JPEG works for solid backgrounds. At least 1000x1000 pixels.',
          usualIssues: 'Low-resolution logos look pixelated in the trademark database and certificate. Also, exact colors are protected - if you file in blue and use it in red, protection is weaker.',
          details: [
            'High resolution (minimum 300 DPI)',
            'PNG with transparent background preferred',
            'JPG acceptable for solid backgrounds',
            'Size: at least 1000x1000 pixels recommended',
            'Exact colors matter - they\'re part of protection',
          ],
          required: false,
        },
        {
          icon: <Briefcase size={14} />,
          name: 'Business/Goods Description',
          note: 'what products or services you offer under this brand',
          whatIsIt: 'What you actually sell under this brand name. This determines which trademark "class" (category) you need. Different classes = different applications and fees.',
          howToGet: 'List everything you do or plan to do under this brand. Be comprehensive - "SaaS platform for HR management" is better than just "software." Include future plans too.',
          usualIssues: 'Being too narrow hurts you. If you trademark for "mobile apps" but also want to make "web apps," you might need another application. Think broad.',
          details: [
            'Detailed description of goods/services',
            'Determines which trademark class(es) you need',
            'Be specific: "software development" not just "IT"',
            'Can include multiple activities',
          ],
          required: true,
        },
        {
          icon: <Layers size={14} />,
          name: 'Trademark Class Selection',
          note: 'which of the 45 classes you need - attorney advises',
          whatIsIt: 'There are 45 trademark classes - 34 for products and 11 for services. Your trademark is only protected in the classes you register. Same name in different class = allowed.',
          howToGet: 'Tell us your business activities, and our attorney will recommend the right classes. Most startups need 1-3 classes. Each additional class costs extra.',
          usualIssues: 'Filing in wrong classes wastes money. Filing in too few classes leaves gaps in protection. Our attorney analyzes your business and recommends the optimal classes.',
          details: [
            '45 classes total (34 goods + 11 services)',
            'Class 35: advertising, business services',
            'Class 42: software, IT services, SaaS',
            'Class 25: clothing, footwear',
            'Class 9: software products, electronics',
            'Each class = separate application + govt fee',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'Prior Use Evidence',
      categoryNote: 'If you\'ve been using the brand before applying',
      items: [
        {
          icon: <Clock size={14} />,
          name: 'Date of First Use',
          note: 'when you first used this brand commercially',
          whatIsIt: 'If you\'ve been using this brand name before applying, that date matters. Earlier use = stronger claim if someone else tries to register the same name.',
          howToGet: 'Think back: when did you first use this brand commercially? First invoice? First product launch? Website going live? An approximate month/year is fine.',
          usualIssues: 'If you\'re applying before any commercial use, that\'s fine - mark it as "proposed to be used." Don\'t make up a fake earlier date - it can invalidate your trademark.',
          details: [
            'Earlier date = stronger claim',
            'Must be actual commercial use (not just planning)',
            'Can be approximate (month/year)',
            '"Proposed to be used" if brand new',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Proof of Use',
          note: 'invoices, packaging, marketing materials showing the brand',
          whatIsIt: 'Evidence that you\'ve actually been using this brand commercially. Old invoices, product photos, marketing materials, website screenshots - anything showing the brand in action.',
          howToGet: 'Gather old invoices with the brand name/logo, photos of products or packaging, screenshots of your website or social media, advertisements. Date stamps are valuable.',
          usualIssues: 'Keep these even if not required at filing. If someone opposes your trademark, this evidence proves you were using it first. Better to have and not need.',
          details: [
            'Old invoices with brand name/logo',
            'Product packaging photos',
            'Marketing materials, advertisements',
            'Website screenshots with date stamps',
            'Strengthens your application if contested',
          ],
          required: false,
        },
        {
          icon: <Search size={14} />,
          name: 'User Affidavit',
          note: 'declaration of prior use - Ollvy drafts this',
          whatIsIt: 'A formal declaration of when and how you\'ve been using this trademark. Signed on stamp paper, this becomes legal evidence of your prior use.',
          howToGet: 'We draft this based on your inputs - date of first use, where you\'ve used it, revenue generated under this brand. You sign it on stamp paper.',
          usualIssues: 'Only needed if claiming prior use and there\'s any likelihood of opposition. For most straightforward applications, this isn\'t required.',
          details: [
            'Sworn statement of trademark use history',
            'Includes date of first use, markets, revenue',
            'Signed by applicant on stamp paper',
            'Ollvy drafts based on your inputs',
          ],
          required: false,
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'Legal & Filing',
      categoryNote: 'Ollvy handles these - forms and filings',
      items: [
        {
          icon: <FileSignature size={14} />,
          name: 'Form TM-A',
          note: 'trademark application form - Ollvy files',
          whatIsIt: 'The main trademark application form filed with IP India. Contains your details, the mark, class selection, and all required declarations.',
          howToGet: 'You don\'t need to prepare this. We complete TM-A based on your documents and information. We file electronically on the IP India portal.',
          usualIssues: 'Incorrect class selection or weak trademark descriptions cause objections. Our attorneys ensure the form is optimized to minimize objection risk.',
          details: [
            'Main application form for trademark',
            'Includes applicant details, mark description, class',
            'Filed electronically on IP India portal',
            'Ollvy completes and files on your behalf',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <Shield size={14} />,
          name: 'Power of Attorney',
          note: 'authorizing Ollvy\'s attorney to act on your behalf',
          whatIsIt: 'A document authorizing our trademark attorney to file and respond to the application on your behalf. Without this, we can\'t represent you before the Trademark Registry.',
          howToGet: 'We send you a ready-to-sign Power of Attorney. You sign and send it back (physical copy preferred, scanned also works). One-time signature, valid for the entire process.',
          usualIssues: 'Delays in receiving signed PoA delay filing. We recommend signing and returning on the same day. Physical signature is preferred but scanned copies are accepted.',
          details: [
            'Authorizes trademark attorney to file and respond',
            'Required for all applications',
            'Simple one-page document',
            'Ollvy provides - you sign',
          ],
          required: true,
          ollvyProvides: true,
        },
        {
          icon: <Search size={14} />,
          name: 'Trademark Search Report',
          note: 'conflicts check before filing - included in service',
          whatIsIt: 'A search of existing trademarks to check if your proposed mark conflicts with any registered or pending marks. This significantly reduces rejection risk.',
          howToGet: 'We conduct this search before filing - it\'s included in your service. You\'ll receive a report showing any potential conflicts and our recommendation.',
          usualIssues: 'Some people skip the search and file directly, only to face opposition later. Our search identifies conflicts early so we can advise you to modify or proceed.',
          details: [
            'Search of existing trademarks in your class',
            'Identifies identical and similar marks',
            'Reduces rejection risk significantly',
            'Ollvy conducts before filing',
          ],
          required: true,
          ollvyProvides: true,
        },
      ],
    },
  ],

  business_itr: [
    {
      category: 'Entity & Registration Documents',
      categoryNote: 'Basic company/LLP identification',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'PAN Card of Entity',
          note: 'company PAN for Pvt Ltd, LLP PAN for LLP',
          whatIsIt: 'Your company or LLP has its own PAN - separate from the directors\' or partners\' personal PANs. This is the PAN under which the business files its ITR.',
          howToGet: 'You received this when the company/LLP was incorporated. If you can\'t find it, download from TRACES or check the PAN card received from NSDL/UTI.',
          usualIssues: 'Using director\'s personal PAN instead of company PAN is a common mistake. Business ITR must be filed under the company/LLP\'s PAN.',
          details: [
            'Entity PAN (not director\'s personal PAN)',
            'Must match name on incorporation certificate',
            'Required for ITR filing and TAN verification',
            'Clear, colored scan',
          ],
          required: true,
        },
        {
          icon: <Building2 size={14} />,
          name: 'Certificate of Incorporation',
          note: 'COI for Pvt Ltd, Certificate of Registration for LLP',
          whatIsIt: 'Proves your company/LLP legally exists. Shows the CIN/LLPIN, incorporation date, and authorized share capital. We verify this before filing.',
          howToGet: 'Download from MCA portal → Company/LLP Master Data, or use the original certificate issued during incorporation.',
          usualIssues: 'Company name changed after incorporation? Provide the Name Change Certificate too. The ITR should be in the current legal name.',
          details: [
            'Shows entity name, CIN/LLPIN, date of incorporation',
            'Download from MCA portal if needed',
            'Verifies the entity filing the return',
          ],
          required: true,
        },
        {
          icon: <BadgeCheck size={14} />,
          name: 'GST Registration Certificate',
          note: 'if GST registered - shows GSTIN',
          whatIsIt: 'If your company is GST registered, we reconcile GST turnover with books turnover. Any mismatch needs explanation in the ITR.',
          howToGet: 'Download from gst.gov.in using your GST login. Or you can provide the GST registration number - we\'ll verify the details.',
          usualIssues: 'GST turnover and books turnover often mismatch due to timing differences, advances, or credit notes. We identify and reconcile these differences.',
          details: [
            'Required for GST turnover reconciliation',
            'Shows principal place of business',
            'Used for verifying GST return data',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Financial Statements',
      categoryNote: 'The core documents for ITR preparation',
      items: [
        {
          icon: <FileSpreadsheet size={14} />,
          name: 'Audited Balance Sheet',
          note: 'as on March 31 - signed by auditor (if audit applicable)',
          whatIsIt: 'The balance sheet shows your company\'s financial position on March 31 - what you own (assets), what you owe (liabilities), and what belongs to shareholders (equity).',
          howToGet: 'Get from your accountant or export from accounting software (Tally, Zoho Books). If audit is applicable, ensure it\'s signed by the auditor.',
          usualIssues: 'Balance sheet must balance (assets = liabilities + equity). Common issues: unadjusted TDS credits, pending bank reconciliation, director loan misclassification.',
          details: [
            'Balance sheet as on financial year end',
            'Signed by directors and auditor (if audited)',
            'Shows assets, liabilities, and equity',
            'Must match Trial Balance',
            'For ITR-6 (Pvt Ltd) and ITR-5 (LLP)',
          ],
          required: true,
        },
        {
          icon: <BarChart3 size={14} />,
          name: 'Profit & Loss Statement',
          note: 'for the financial year - shows revenue, expenses, profit',
          whatIsIt: 'The P&L shows what you earned (revenue) and what you spent (expenses) during the financial year, resulting in net profit or loss.',
          howToGet: 'Export from your accounting software. It should cover April 1 to March 31 of the financial year you\'re filing for.',
          usualIssues: 'Revenue should match GST returns. Expenses should have proper supporting bills. Unsubstantiated expenses can be disallowed during scrutiny.',
          details: [
            'Complete P&L for April 1 to March 31',
            'Revenue, cost of goods sold, operating expenses',
            'Shows net profit/loss for the year',
            'Signed by directors and auditor',
          ],
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Notes to Accounts',
          note: 'detailed breakup of balance sheet items',
          whatIsIt: 'Notes explain the numbers in your balance sheet and P&L - accounting policies, breakup of major items, contingent liabilities, related party transactions.',
          howToGet: 'Your accountant prepares these along with financial statements. They\'re part of the complete financial statements package.',
          usualIssues: 'Many small companies skip proper notes. For audit-applicable companies, incomplete notes can lead to audit qualifications.',
          details: [
            'Accounting policies followed',
            'Breakup of fixed assets, investments',
            'Details of loans, debtors, creditors',
            'Contingent liabilities, if any',
          ],
          required: true,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Trial Balance',
          note: 'complete trial balance - all ledger accounts',
          whatIsIt: 'A list of all ledger account balances. Debits must equal credits. The trial balance is the raw data from which P&L and Balance Sheet are prepared.',
          howToGet: 'Export from Tally or your accounting software. "Trial Balance as on 31-Mar" for the relevant financial year.',
          usualIssues: 'If trial balance doesn\'t tally, there\'s an accounting error. We check this before proceeding. Common issues: suspense accounts, rounding errors.',
          details: [
            'All ledger account balances',
            'Debits and credits must match',
            'Used for verifying P&L and Balance Sheet',
            'Export from Tally/accounting software',
          ],
          required: true,
        },
      ],
    },
    {
      category: 'Depreciation & Assets',
      categoryNote: 'Fixed asset details for tax computation',
      items: [
        {
          icon: <Layers size={14} />,
          name: 'Fixed Asset Register',
          note: 'list of all assets with purchase date, cost, depreciation',
          whatIsIt: 'A register of all capital assets (computers, furniture, vehicles, machinery) your company owns - with purchase dates, costs, and accumulated depreciation.',
          howToGet: 'Export from accounting software or maintain in Excel. Should include every asset - even small items like printers and chairs.',
          usualIssues: 'Assets purchased but not recorded, or fully depreciated assets not removed from register. We reconcile this with actual asset list.',
          details: [
            'All capital assets owned by the company',
            'Purchase date and cost for each asset',
            'Depreciation method (WDV or SLM)',
            'Block-wise categorization as per IT Act',
          ],
          required: true,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Depreciation Schedule',
          note: 'as per Income Tax Act rates - block-wise',
          whatIsIt: 'Depreciation for tax purposes is calculated differently than books depreciation. IT Act has specific rates and block-wise categorization.',
          howToGet: 'Your accountant should maintain this. If not, provide the fixed asset register and we\'ll calculate IT depreciation.',
          usualIssues: 'Books depreciation ≠ IT depreciation. Many companies use books depreciation in ITR - that\'s wrong. We calculate correct IT depreciation.',
          details: [
            'Opening WDV for each block',
            'Additions and deletions during year',
            'Depreciation rate as per IT Act',
            'Closing WDV calculation',
            'CA verifies rates are correct',
          ],
          required: true,
        },
        {
          icon: <Percent size={14} />,
          name: 'Additional Depreciation Claims',
          note: 'if claiming additional depreciation on new plant & machinery',
          whatIsIt: 'Manufacturing companies buying new machinery get extra 20% depreciation in the first year. This can significantly reduce taxable income.',
          howToGet: 'Provide invoices of new machinery purchased during the year. We verify eligibility and claim additional depreciation where applicable.',
          usualIssues: 'Only available for manufacturing businesses on new (not second-hand) assets. Service companies and trading businesses don\'t qualify.',
          details: [
            '20% additional depreciation on new P&M',
            'Only for manufacturing companies',
            'Asset must be new (not second-hand)',
            'Proof of purchase required',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Bank & Cash Flow',
      categoryNote: 'All bank accounts and transactions',
      items: [
        {
          icon: <Landmark size={14} />,
          name: 'Bank Statements',
          note: 'all current accounts - April 1 to March 31',
          whatIsIt: 'Bank statements for all accounts in the company\'s name - current accounts, FD accounts, and any other deposit accounts. These verify cash balances and major transactions.',
          howToGet: 'Log into corporate net banking, download statements for the full financial year (April to March) in PDF format. Include all accounts - don\'t miss any.',
          usualIssues: 'Closing bank balance should match books. If there\'s a mismatch, you need a bank reconciliation statement explaining the difference.',
          details: [
            'All bank accounts held by the company',
            'Full year statements (12 months)',
            'Shows all receipts and payments',
            'Closing balance must match books',
          ],
          required: true,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'Bank Reconciliation Statement',
          note: 'reconciling book balance with bank balance',
          whatIsIt: 'If your books show ₹5 lakh but bank shows ₹4.8 lakh as on March 31, the BRS explains why - cheques issued but not cleared, deposits in transit, bank charges not recorded, etc.',
          howToGet: 'Your accountant prepares this as part of year-end closing. It lists all items causing the difference between book balance and bank balance.',
          usualIssues: 'Old outstanding items (cheques not cleared for months) need follow-up. These often indicate errors or stale cheques that should be reversed.',
          details: [
            'Explains difference between book and bank balance',
            'Lists outstanding cheques, deposits in transit',
            'Required for audit and verification',
          ],
          required: true,
        },
        {
          icon: <Coins size={14} />,
          name: 'Cash Flow Statement',
          note: 'if turnover exceeds ₹1 crore - mandatory',
          whatIsIt: 'Shows actual cash movements during the year - cash generated from operations, cash used for investments, cash from financing. Required for companies above certain turnover.',
          howToGet: 'Your accountant prepares this as part of financial statements. It\'s mandatory for companies with turnover exceeding ₹1 Cr.',
          usualIssues: 'Cash flow must reconcile with opening and closing cash/bank balances. Any mismatch indicates accounting errors.',
          details: [
            'Operating, investing, financing activities',
            'Required for companies above ₹1Cr turnover',
            'Shows actual cash movement during year',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'TDS & Tax Payments',
      categoryNote: 'Taxes deducted and paid during the year',
      items: [
        {
          icon: <Receipt size={14} />,
          name: 'Form 26AS / AIS',
          note: 'tax credit statement - download from income tax portal',
          whatIsIt: 'Form 26AS and AIS show all TDS deducted on payments to your company, advance taxes paid, and high-value transactions reported. This is what the government knows about your company.',
          howToGet: 'Log into incometax.gov.in using company credentials → e-File → Income Tax Returns → View AIS. Download both AIS and 26AS.',
          usualIssues: 'TDS mismatch is common - clients deducted TDS but hasn\'t filed their TDS return yet, so it doesn\'t show in your 26AS. We identify and handle these mismatches.',
          details: [
            'All TDS deducted by clients/banks',
            'Advance tax payments made',
            'Self-assessment tax paid',
            'Download from incometax.gov.in',
            'Must reconcile with books',
          ],
          required: true,
        },
        {
          icon: <FileBarChart size={14} />,
          name: 'TDS Certificates (Form 16A)',
          note: 'from all parties who deducted TDS on payments to you',
          whatIsIt: 'Whenever someone deducts TDS on payments to your company (clients, banks), they should issue Form 16A. These certificates confirm the TDS amount and help claim credit.',
          howToGet: 'Request from clients/banks who paid you. Also downloadable from TRACES if you have credentials. Collect all 16As before filing.',
          usualIssues: 'Clients often don\'t provide 16A proactively. Follow up and collect. Without 16A, we can still claim TDS if it appears in 26AS, but 16A is the proper proof.',
          details: [
            'TDS on professional fees received',
            'TDS on interest from banks/others',
            'TDS on rent received',
            'Collect from all deductors',
          ],
          required: true,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Advance Tax Challans',
          note: 'Challan 280 - paid quarterly',
          whatIsIt: 'If your company\'s tax liability is more than ₹10,000, you should pay advance tax quarterly. Keep receipts of all advance tax payments made during the year.',
          howToGet: 'Challan receipts from when you paid. Also shows in Form 26AS under "Taxes Paid." Verify the amounts match.',
          usualIssues: 'Not paying enough advance tax attracts interest under 234B and 234C. We calculate any interest liability and include it in the return.',
          details: [
            'Due dates: Jun 15, Sep 15, Dec 15, Mar 15',
            'At least 90% should be paid by Mar 15',
            'Interest u/s 234B if shortfall',
            'Keep all challan receipts',
          ],
          required: false,
        },
        {
          icon: <Receipt size={14} />,
          name: 'TDS Returns Filed',
          note: 'Form 24Q, 26Q, 27Q filed by the company',
          whatIsIt: 'Your company also deducts TDS on payments - salaries (24Q), vendors/rent (26Q), foreign payments (27Q). We verify these are filed correctly.',
          howToGet: 'Get acknowledgments from whoever files your TDS returns. Verify all quarters are filed and there are no defaults.',
          usualIssues: 'TDS return defaults attract notices. If any quarter is unfiled or has errors, it should be corrected before ITR filing. Late filing attracts late fees.',
          details: [
            '24Q: TDS on salaries paid',
            '26Q: TDS on payments other than salaries',
            '27Q: TDS on payments to non-residents',
            'Acknowledgments of all quarterly returns',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Director & Shareholder Details',
      categoryNote: 'Required for ITR-6 schedules',
      items: [
        {
          icon: <Users size={14} />,
          name: 'Director Details',
          note: 'DIN, PAN, remuneration for each director',
          whatIsIt: 'ITR-6 requires details of all directors - their DIN, PAN, residential status, and any remuneration/sitting fees paid. Also, loans given to/from directors.',
          howToGet: 'Compile a list: director name, DIN, PAN, remuneration paid during the year, sitting fees if any. Also note any loans between company and directors.',
          usualIssues: 'Director loans (Section 185/186) have compliance requirements. Large loans without proper documentation can create scrutiny issues.',
          details: [
            'Full name, DIN, and PAN of each director',
            'Remuneration/salary paid during the year',
            'Sitting fees paid, if any',
            'Any loans given to/taken from directors',
          ],
          required: true,
        },
        {
          icon: <FileText size={14} />,
          name: 'Shareholder Register',
          note: 'list of all shareholders as on March 31',
          whatIsIt: 'List of all shareholders with their PAN, address, number of shares held, and percentage shareholding as on March 31.',
          howToGet: 'From your company secretary or maintain in Excel. For small companies, this is usually the founders and investors.',
          usualIssues: 'Share transfers during the year should be reflected. If someone bought or sold shares, the register should be updated with proper transfer deeds.',
          details: [
            'Name, PAN, and address of each shareholder',
            'Number of shares held',
            'Percentage shareholding',
            'Any changes during the year',
          ],
          required: true,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Dividend Details',
          note: 'if dividend was declared during the year',
          whatIsIt: 'If your company declared and paid dividends during the year, we need details - amount per share, total dividend, TDS deducted, distribution date.',
          howToGet: 'From board resolution declaring dividend and bank records showing dividend payments. Include TDS challans for dividend TDS.',
          usualIssues: 'Companies must deduct TDS on dividend payments to shareholders (currently 10% if above ₹5,000). Many small companies miss this compliance.',
          details: [
            'Dividend amount per share',
            'Total dividend distributed',
            'TDS deducted on dividend (if applicable)',
            'Dividend distribution date',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Audit Documents',
      categoryNote: 'If audit is applicable (turnover > ₹1Cr / ₹10Cr)',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Audit Report (Form 3CA/3CB)',
          note: 'auditor\'s report - 3CA for companies, 3CB for others',
          whatIsIt: 'If your company requires tax audit (turnover above ₹1Cr cash / ₹10Cr digital), a CA must audit and issue Form 3CA (for companies) along with Form 3CD.',
          howToGet: 'Your auditor prepares and signs this. They upload it to the income tax portal with their digital signature. You receive a copy.',
          usualIssues: 'Audit report must be filed by Sep 30 (for non-transfer pricing cases). ITR due date is Oct 31 only after audit report is filed. Missing audit deadline is a compliance issue.',
          details: [
            'Form 3CA: audit of accounts of Pvt Ltd/LLP',
            'Form 3CB: audit report for other businesses',
            'Signed by practicing Chartered Accountant',
            'UDIN (Unique Document Identification Number) required',
          ],
          required: false,
        },
        {
          icon: <ClipboardList size={14} />,
          name: 'Tax Audit Report (Form 3CD)',
          note: 'detailed annexure to audit report',
          whatIsIt: 'Form 3CD is the detailed statement of particulars - 44 clauses covering everything from TDS compliance to disallowed expenses to depreciation claims.',
          howToGet: 'Your auditor prepares this based on your books and records. It\'s filed along with Form 3CA/3CB.',
          usualIssues: 'Clause 34 (TDS defaults), Clause 26 (capital vs revenue expenditure), and Clause 21 (depreciation) are scrutinized closely. We ensure everything is correctly reported.',
          details: [
            'Statement of particulars required by IT Act',
            '44 clauses covering all aspects',
            'Includes TDS compliance, depreciation, expenses',
            'Signed by same auditor as Form 3CA/3CB',
          ],
          required: false,
        },
        {
          icon: <BadgeCheck size={14} />,
          name: 'Auditor Appointment Letter',
          note: 'letter appointing the statutory auditor',
          whatIsIt: 'Proof that the auditor was formally appointed - usually a board resolution appointing them and their consent letter (Form ADT-1 filed with ROC).',
          howToGet: 'From your company records. First-time audits need proper appointment. Existing companies should have this from previous years.',
          usualIssues: 'Auditor rotation rules apply after certain years. Check if your current auditor is eligible to continue. CA firms have different rotation timelines than individual CAs.',
          details: [
            'Board resolution appointing auditor',
            'Auditor\'s consent letter (Form ADT-1)',
            'Required for first-time audits',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'GST & Indirect Tax',
      categoryNote: 'For reconciliation with income',
      items: [
        {
          icon: <Receipt size={14} />,
          name: 'GSTR-9 / Annual Return',
          note: 'GST annual return for reconciliation',
          whatIsIt: 'GSTR-9 is your GST annual return - a summary of all monthly returns filed. We compare GST turnover with books turnover to ensure consistency.',
          howToGet: 'Download from gst.gov.in → Returns → Annual Return → GSTR-9. If not yet filed, provide monthly GSTR-1 and GSTR-3B summaries.',
          usualIssues: 'GST turnover often differs from books due to timing (advances, credit notes) or classification (exempt vs taxable). These differences need explanation.',
          details: [
            'Annual summary of all GST returns filed',
            'Reconcile GST turnover with books turnover',
            'Differences must be explained in ITR',
          ],
          required: false,
        },
        {
          icon: <FileSpreadsheet size={14} />,
          name: 'GST Reconciliation',
          note: 'reconciliation of GSTR-1, GSTR-3B with books',
          whatIsIt: 'A statement reconciling GST return figures with books figures. Explains why GSTR-1 sales might differ from books sales, why ITC claimed differs from books, etc.',
          howToGet: 'Your accountant should prepare this as part of year-end. It\'s especially important if there are significant differences.',
          usualIssues: 'Common differences: inter-state vs intra-state classification, export sales, RCM transactions, e-commerce TCS. Each needs proper explanation.',
          details: [
            'Monthly GSTR-1 and GSTR-3B summaries',
            'Compare with sales and purchase register',
            'Identify and explain any differences',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Previous Year & Losses',
      categoryNote: 'For carried forward losses and continuity',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Previous Year ITR',
          note: 'last year\'s filed return and acknowledgment',
          whatIsIt: 'Last year\'s filed ITR helps us verify opening balances and ensure continuity. Also needed to identify losses that can be carried forward and set off this year.',
          howToGet: 'Download from incometax.gov.in → e-File → View Filed Returns. Get both the ITR-V acknowledgment and the JSON/PDF of the return.',
          usualIssues: 'Opening balances in this year\'s balance sheet should match closing balances from last year. Any mismatch needs explanation.',
          details: [
            'ITR-V acknowledgment',
            'Copy of filed return (JSON/PDF)',
            'Computation of income',
            'Helps verify opening balances',
          ],
          required: true,
        },
        {
          icon: <TrendingUp size={14} />,
          name: 'Brought Forward Losses',
          note: 'losses from previous years to be set off',
          whatIsIt: 'If your company had losses in previous years, they can be carried forward to set off against this year\'s profits - reducing your tax liability.',
          howToGet: 'From previous years\' ITRs. Look at Schedule CFL (Carry Forward Losses). We verify eligibility based on shareholding continuity rules.',
          usualIssues: 'Companies need to maintain 51% shareholding continuity to carry forward losses. If there was significant equity change, losses might not be eligible for set off.',
          details: [
            'Business losses (8 years carry forward)',
            'Unabsorbed depreciation (unlimited)',
            'Capital losses (8 years)',
            'From previous ITRs - CA verifies eligibility',
          ],
          required: false,
        },
        {
          icon: <AlertCircle size={14} />,
          name: 'MAT Credit',
          note: 'Minimum Alternate Tax credit from previous years',
          whatIsIt: 'If you paid MAT in previous years (tax on book profits when higher than normal tax), the excess becomes a credit that can be used in future years.',
          howToGet: 'From previous ITRs - Schedule MATC shows MAT credit available and used. We track this and apply credit where eligible.',
          usualIssues: 'MAT credit has a 15-year expiry. Also, it can only be used when normal tax exceeds MAT, not the other way around.',
          details: [
            'MAT paid in excess of normal tax',
            'Can be carried forward for 15 years',
            'Set off against tax payable in current year',
          ],
          required: false,
        },
      ],
    },
    {
      category: 'Related Party Transactions',
      categoryNote: 'Transactions with directors, relatives, group companies',
      items: [
        {
          icon: <Users size={14} />,
          name: 'Related Party Transaction Details',
          note: 'loans, purchases, sales with related parties',
          whatIsIt: 'Any transactions between your company and "related parties" - directors, their relatives, other companies where directors have interest. These need to be disclosed and be at fair market value.',
          howToGet: 'Compile a list of all transactions with directors, their relatives, group companies. Include nature, amount, and terms of each transaction.',
          usualIssues: 'Transactions not at arm\'s length (fair market value) can be questioned. Purchases from director\'s family at inflated prices, for example, can be disallowed.',
          details: [
            'All transactions with directors/relatives',
            'Transactions with associate companies',
            'Must be at arm\'s length pricing',
            'Section 40A(2)(b) implications reviewed',
          ],
          required: false,
        },
        {
          icon: <FileText size={14} />,
          name: 'Transfer Pricing Report',
          note: 'if international transactions exceed ₹1 crore',
          whatIsIt: 'If your company has transactions with foreign related parties (group company abroad, foreign shareholder) exceeding ₹1Cr, a transfer pricing report (Form 3CEB) is mandatory.',
          howToGet: 'A CA with transfer pricing certification prepares this. It\'s a separate compliance with Nov 30 deadline - before ITR due date.',
          usualIssues: 'Missing 3CEB filing attracts 2% penalty on transaction value. Also, IT department heavily scrutinizes transfer pricing. Documentation must be robust.',
          details: [
            'Form 3CEB - accountant\'s report',
            'Arm\'s length pricing documentation',
            'Required for international related party transactions',
            'Due date: Nov 30',
          ],
          required: false,
        },
      ],
    },
  ],
}

// Service-specific document requirements (used on service detail pages)
const SERVICE_DOCUMENT_DATA: Record<string, DocumentCategory[]> = {
  'gst-registration': [
    {
      category: 'Identity & Address',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the business entity (or proprietor if sole prop)',
          whatIsIt: 'PAN of the entity applying for GST. For Pvt Ltd/LLP, this is the company PAN. For sole proprietorship, your personal PAN is used.',
          howToGet: 'Already have it if your company/LLP is registered. For sole prop, use your existing personal PAN.',
          usualIssues: 'Name mismatch between PAN and other documents causes rejection.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of all directors/partners/proprietor',
          whatIsIt: 'Aadhaar is used for e-KYC verification. OTP will be sent to the mobile linked to Aadhaar.',
          howToGet: 'Download e-Aadhaar from uidai.gov.in. Ensure mobile number is linked and active.',
          usualIssues: 'Inactive mobile number linked to Aadhaar blocks OTP verification. Update at Aadhaar center first.',
          required: true,
        },
        {
          icon: <Home size={14} />,
          name: 'Address Proof of Business',
          note: 'utility bill, rent agreement, or NOC from owner',
          whatIsIt: 'Proof of your principal place of business. Can be owned or rented premises.',
          howToGet: "If owned: latest electricity/water bill. If rented: rent agreement + NOC from landlord + landlord's utility bill.",
          usualIssues: 'Address format mismatch between documents. "Flat 201" vs "201" causes queries. Ensure consistency.',
          required: true,
        },
      ],
    },
    {
      category: 'Bank Account',
      items: [
        {
          icon: <Landmark size={14} />,
          name: 'Bank Statement / Cancelled Cheque',
          note: 'showing business name, account number, IFSC',
          whatIsIt: 'Proof of current account in the business name. GST refunds are credited here.',
          howToGet: 'Download statement from net banking. First page showing account holder name is sufficient.',
          usualIssues: 'Account in personal name instead of business name gets rejected. Sole proprietors need current account with trade name.',
          required: true,
        },
      ],
    },
    {
      category: 'Company Documents',
      categoryNote: 'Required for Pvt Ltd, LLP, Partnership',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Certificate of Incorporation',
          note: 'issued by MCA',
          whatIsIt: 'The official certificate from MCA proving your company/LLP exists. Contains CIN/LLPIN.',
          howToGet: 'Download from MCA21 portal under "Company Master Data" or from your incorporation documents.',
          usualIssues: 'None typically. This is a straightforward document.',
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Board Resolution / Partner Consent',
          note: 'authorizing GST registration',
          whatIsIt: 'A formal resolution from the board authorizing a specific person to apply for GST on behalf of the company.',
          howToGet: 'We provide a draft template. Directors sign it on company letterhead.',
          usualIssues: 'Missing signatures or incorrect date format. Follow the template exactly.',
          ollvyProvides: true,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'PAN of All Directors/Partners',
          note: 'each director or partner must provide PAN',
          whatIsIt: 'PAN cards of all persons listed as directors/designated partners.',
          howToGet: 'Collect clear scans from each director. Front side showing photo and PAN number.',
          usualIssues: "Missing one director's PAN delays filing. Collect all before starting.",
          required: true,
        },
      ],
    },
  ],
  'mca-annual-filing': [
    {
      category: 'Financial Statements',
      items: [
        {
          icon: <FileSpreadsheet size={14} />,
          name: 'Audited Balance Sheet',
          note: 'for the financial year',
          whatIsIt: "Statement of your company's assets, liabilities, and equity as of March 31. Must be signed by auditor.",
          howToGet: 'Your statutory auditor prepares this as part of the annual audit. Audit must be complete before MCA filing.',
          usualIssues: 'Audit not done = cannot file. Complete audit first. We can recommend auditors if needed.',
          required: true,
        },
        {
          icon: <FileSpreadsheet size={14} />,
          name: 'Profit & Loss Statement',
          note: 'for the financial year',
          whatIsIt: 'Statement showing income, expenses, and profit/loss for the year. Part of audited financials.',
          howToGet: 'Prepared by auditor along with balance sheet.',
          usualIssues: 'P&L figures must match ITR. Any mismatch triggers scrutiny.',
          required: true,
        },
        {
          icon: <FileText size={14} />,
          name: 'Notes to Accounts',
          note: 'accounting policies and detailed notes',
          whatIsIt: 'Detailed explanations of items in balance sheet and P&L. Required part of financial statements.',
          howToGet: 'Auditor prepares this as part of audit report.',
          usualIssues: 'Incomplete notes can lead to queries. Ensure auditor provides complete notes.',
          required: true,
        },
      ],
    },
    {
      category: 'Statutory Reports',
      items: [
        {
          icon: <ScrollText size={14} />,
          name: "Director's Report",
          note: 'board report on company affairs',
          whatIsIt: 'Annual report by directors covering company performance, dividends, deposits, loans, related party transactions.',
          howToGet: 'We provide a template. Directors review, modify if needed, and sign.',
          usualIssues: 'Missing required disclosures. Use the template to ensure compliance.',
          ollvyProvides: true,
        },
        {
          icon: <FileCheck size={14} />,
          name: "Auditor's Report",
          note: 'independent audit opinion',
          whatIsIt: "Auditor's official opinion on whether financial statements are true and fair.",
          howToGet: 'Prepared by your statutory auditor after completing audit.',
          usualIssues: "Qualified or adverse opinion needs explanation in director's report.",
          required: true,
        },
      ],
    },
    {
      category: 'Shareholder & Director Records',
      items: [
        {
          icon: <Users size={14} />,
          name: 'List of Shareholders',
          note: 'as of March 31',
          whatIsIt: 'Register of members showing all shareholders, their holdings, and addresses as of financial year end.',
          howToGet: 'Maintain this in Form MGT-1. Extract from your shareholder register.',
          usualIssues: 'Unrecorded share transfers cause mismatch. Update register before filing.',
          required: true,
        },
        {
          icon: <FileText size={14} />,
          name: 'Director Appointment/Resignation Details',
          note: 'if any changes during the year',
          whatIsIt: 'Details of any director changes during the year - new appointments, resignations, or term completions.',
          howToGet: 'Check board resolutions and Form DIR-12 filings made during the year.',
          usualIssues: 'Unreported director changes need to be filed first via DIR-12.',
          required: false,
        },
        {
          icon: <FileText size={14} />,
          name: 'Share Transfer Details',
          note: 'if any equity changes during the year',
          whatIsIt: 'Details of share transfers - who sold, who bought, how many shares, at what value.',
          howToGet: 'From SH-4 forms and share transfer register. Include transfer dates and consideration.',
          usualIssues: 'Stamp duty not paid on transfers causes issues. Ensure all transfers are properly stamped.',
          required: false,
        },
      ],
    },
  ],
  'iec-code': [
    {
      category: 'Identity Documents',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the business entity',
          whatIsIt: 'PAN of the entity applying for IEC. Company PAN for Pvt Ltd/LLP, personal PAN for sole proprietor.',
          howToGet: 'Already have it from company registration. Download e-PAN from incometax.gov.in if needed.',
          usualIssues: 'PAN name must match bank account name exactly.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of authorized signatory (for OTP)',
          whatIsIt: 'Aadhaar of the person signing the IEC application. Required for OTP verification.',
          howToGet: 'Download e-Aadhaar from uidai.gov.in. Mobile number must be active.',
          usualIssues: 'Name on Aadhaar must match PAN of signatory. Middle name variations cause OTP failure.',
          required: true,
        },
      ],
    },
    {
      category: 'Company Documents',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Certificate of Incorporation',
          note: 'for Pvt Ltd, LLP, or Partnership Deed',
          whatIsIt: 'Official proof that your business entity exists. CoI for companies, LLP Agreement for LLPs, Partnership Deed for firms.',
          howToGet: 'From your incorporation documents. Download from MCA if needed.',
          usualIssues: 'For proprietorship, use GST certificate or Shop Act license instead.',
          required: true,
        },
      ],
    },
    {
      category: 'Bank Account Proof',
      items: [
        {
          icon: <Landmark size={14} />,
          name: 'Cancelled Cheque / Bank Statement',
          note: 'showing account number and IFSC',
          whatIsIt: 'Proof of current account in business name. Account holder name, number, and IFSC must be clearly visible.',
          howToGet: 'Get cancelled cheque leaf from bank, or download first page of statement showing these details.',
          usualIssues: 'Account must be in business name, not personal. Savings account of proprietor may work only if it shows trade name.',
          required: true,
        },
      ],
    },
  ],
  'fssai-license': [
    {
      category: 'Business Documents',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Business Registration Proof',
          note: 'CoI, Partnership Deed, or GST certificate',
          whatIsIt: 'Proof that your business is legally registered. Type depends on your entity structure.',
          howToGet: 'CoI for companies, Partnership Deed for firms, GST certificate for proprietors.',
          usualIssues: 'For home bakers starting out, Aadhaar + electricity bill may suffice for Registration level.',
          required: true,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the business or proprietor',
          whatIsIt: 'PAN of the food business operator (FBO).',
          howToGet: 'Company PAN for Pvt Ltd, personal PAN for sole proprietor.',
          required: true,
        },
        {
          icon: <Home size={14} />,
          name: 'Address Proof of Premises',
          note: 'rent agreement, utility bill, or ownership proof',
          whatIsIt: 'Proof of the location where food operations happen - kitchen, factory, warehouse.',
          howToGet: 'Rent agreement + NOC from landlord, or ownership documents + utility bill.',
          usualIssues: 'Home address is valid for home-based food businesses. No separate commercial space needed for Registration.',
          required: true,
        },
      ],
    },
    {
      category: 'Food Safety Documents',
      items: [
        {
          icon: <ClipboardList size={14} />,
          name: 'Food Safety Management Plan',
          note: 'HACCP-based for manufacturing',
          whatIsIt: 'Document showing how you ensure food safety - storage, handling, hygiene practices.',
          howToGet: 'We provide a template based on FSSAI guidelines. Customize for your food type.',
          usualIssues: 'Template documents work for most businesses. Complex manufacturing may need consultant.',
          ollvyProvides: true,
        },
        {
          icon: <Building2 size={14} />,
          name: 'Layout Plan of Premises',
          note: 'showing food preparation areas',
          whatIsIt: 'Floor plan showing your kitchen/production area, storage, washing area, entry/exit.',
          howToGet: 'Draw a simple floor plan. Architect drawing not required. Hand-drawn is acceptable.',
          usualIssues: 'Not required for basic Registration. Only for State/Central License.',
          required: false,
        },
        {
          icon: <Package size={14} />,
          name: 'List of Food Products',
          note: 'items you will manufacture/sell',
          whatIsIt: 'Complete list of food items you plan to produce, process, or sell.',
          howToGet: 'List all products with their category (bakery, dairy, snacks, beverages, etc.).',
          usualIssues: 'Adding new categories later requires license modification. List all planned products now.',
          required: true,
        },
      ],
    },
    {
      category: 'Health & Safety',
      categoryNote: 'Required for State/Central License',
      items: [
        {
          icon: <ShieldCheck size={14} />,
          name: 'Water Test Report',
          note: 'from approved laboratory',
          whatIsIt: 'Lab report confirming your water supply meets safety standards for food preparation.',
          howToGet: 'Get water tested at NABL-accredited lab. Reports valid for 6 months.',
          usualIssues: 'Bore well water often fails. Install RO/purifier if water test fails.',
          required: false,
        },
        {
          icon: <Shield size={14} />,
          name: 'Pest Control Certificate',
          note: 'from licensed pest control agency',
          whatIsIt: 'Proof of regular pest control at your premises.',
          howToGet: 'Hire a pest control agency. They provide AMC certificate showing monthly/quarterly visits.',
          usualIssues: 'Certificate should be recent (within 3 months). Old certificates not accepted.',
          required: false,
        },
        {
          icon: <Heart size={14} />,
          name: 'Medical Fitness Certificates',
          note: 'for all food handlers',
          whatIsIt: 'Medical certificate for every person who handles food, confirming they are free from communicable diseases.',
          howToGet: 'Get Form 1-B filled by a registered medical practitioner for each staff member.',
          usualIssues: 'Inspectors ask for these during inspection. Have them ready for all staff.',
          required: false,
        },
      ],
    },
  ],
  'director-kyc': [
    {
      category: 'Required Documents',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the director',
          whatIsIt: 'Your personal PAN card as a director. Used to verify identity with MCA records.',
          howToGet: 'Already have it. Download e-PAN from incometax.gov.in if you need a copy.',
          usualIssues: 'Name on PAN must match DIN records exactly. Update PAN if there are discrepancies.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'with active mobile number',
          whatIsIt: 'Aadhaar is used for e-KYC. OTP will be sent to mobile linked with Aadhaar.',
          howToGet: 'Download e-Aadhaar from uidai.gov.in. Check that your mobile is linked and active.',
          usualIssues: 'Old/inactive mobile linked to Aadhaar = cannot receive OTP. Update at Aadhaar center first.',
          required: true,
        },
      ],
    },
  ],
  'trademark-registration': [
    {
      category: 'Identity Documents',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the trademark applicant',
          whatIsIt: 'PAN of the person or entity applying for trademark.',
          howToGet: 'Company PAN for businesses, personal PAN for individuals.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of the applicant or authorized person',
          whatIsIt: 'Identity proof of the person signing the trademark application.',
          howToGet: 'Download e-Aadhaar from uidai.gov.in.',
          required: true,
        },
        {
          icon: <Home size={14} />,
          name: 'Address Proof',
          note: 'of applicant (individual or business)',
          whatIsIt: 'Proof of address where trademark notices will be sent.',
          howToGet: 'Utility bill, bank statement, or rent agreement.',
          required: true,
        },
      ],
    },
    {
      category: 'Brand Assets',
      items: [
        {
          icon: <Palette size={14} />,
          name: 'Logo File',
          note: 'if registering a logo/device mark',
          whatIsIt: 'High-resolution image of your logo in JPEG/PNG format. For word marks, this is not needed.',
          howToGet: 'Export from design software. Minimum 300 DPI resolution recommended.',
          usualIssues: 'Blurry logos get questioned. Use vector format if possible.',
          required: false,
        },
        {
          icon: <Search size={14} />,
          name: 'Brand Name Details',
          note: 'the exact mark you want to register',
          whatIsIt: 'The word, phrase, or tagline you want to trademark. Spelling and capitalization matter.',
          howToGet: 'Decide on exact spelling. "TECHBRIDGE" vs "TechBridge" are different marks.',
          usualIssues: 'Descriptive names (like "Fresh Bakery") face objections. Distinctive names get approved faster.',
          required: true,
        },
      ],
    },
    {
      category: 'Company Documents',
      categoryNote: 'For Pvt Ltd, LLP, or Partnership',
      items: [
        {
          icon: <FileCheck size={14} />,
          name: 'Certificate of Incorporation',
          note: 'or Partnership Deed',
          whatIsIt: 'Proof of business registration. Shows the entity that will own the trademark.',
          howToGet: 'From your incorporation documents.',
          required: true,
        },
        {
          icon: <ScrollText size={14} />,
          name: 'Board Resolution',
          note: 'authorizing trademark application',
          whatIsIt: 'Formal authorization from the board for filing trademark in company name.',
          howToGet: 'We provide a draft. Directors sign on company letterhead.',
          ollvyProvides: true,
        },
      ],
    },
  ],
  'business-itr': [
    {
      category: 'Financial Records',
      items: [
        {
          icon: <FileSpreadsheet size={14} />,
          name: 'Audited Financial Statements',
          note: 'balance sheet, P&L, notes',
          whatIsIt: 'Complete audited financials for the financial year. Mandatory for companies.',
          howToGet: 'From your statutory auditor after annual audit completion.',
          usualIssues: 'Audit must be complete before ITR filing. Schedule audit early.',
          required: true,
        },
        {
          icon: <Calculator size={14} />,
          name: 'Trial Balance',
          note: 'year-end trial balance with all ledgers',
          whatIsIt: 'Complete list of all ledger account balances. Used to prepare tax computations.',
          howToGet: 'Export from your accounting software (Tally, Zoho, etc.).',
          required: true,
        },
        {
          icon: <Receipt size={14} />,
          name: 'Tax Computation Statement',
          note: 'book profit to taxable income reconciliation',
          whatIsIt: 'Working showing how book profit is adjusted to arrive at taxable income.',
          howToGet: 'Your CA prepares this. Shows disallowances, exemptions, deductions.',
          ollvyProvides: true,
        },
      ],
    },
    {
      category: 'GST Records',
      items: [
        {
          icon: <FileBarChart size={14} />,
          name: 'GSTR-3B Annual Summary',
          note: 'all 12 months filed',
          whatIsIt: 'Monthly GST returns showing tax paid each month.',
          howToGet: 'Download from GST portal. Go to Returns → Filed Returns → GSTR-3B.',
          usualIssues: 'Unfiled GST returns block ITR filing. File all pending GST returns first.',
          required: true,
        },
        {
          icon: <FileText size={14} />,
          name: 'GST Annual Return (GSTR-9)',
          note: 'if already filed',
          whatIsIt: 'Annual reconciliation of all GST returns.',
          howToGet: 'Download from GST portal if filed. Due date is Dec 31.',
          required: false,
        },
      ],
    },
    {
      category: 'TDS Records',
      items: [
        {
          icon: <Banknote size={14} />,
          name: 'Form 26AS',
          note: 'annual tax credit statement',
          whatIsIt: 'Statement showing all TDS deducted against your PAN. Tax credits are claimed from this.',
          howToGet: 'Download from TRACES or income tax portal.',
          usualIssues: '26AS mismatches cause notices. Verify all deductors have filed TDS returns.',
          required: true,
        },
        {
          icon: <Percent size={14} />,
          name: 'TDS Certificates (Form 16A)',
          note: 'from clients/vendors who deducted TDS',
          whatIsIt: 'Individual TDS certificates from parties who deducted tax from your payments.',
          howToGet: 'Request from clients. They should have filed TDS returns and can download from TRACES.',
          usualIssues: 'Missing Form 16A means TDS credit may not reflect in 26AS. Follow up with deductors.',
          required: false,
        },
      ],
    },
  ],
  'gst-monthly-filing': [
    {
      category: 'Sales Records',
      items: [
        {
          icon: <Receipt size={14} />,
          name: 'Sales Invoices',
          note: 'all invoices issued this month',
          whatIsIt: 'Complete list of all GST invoices issued to customers during the filing period.',
          howToGet: 'Export from your billing software. Include invoice number, date, customer GSTIN, amount, tax.',
          usualIssues: 'Missing invoice numbers in sequence get flagged. Account for all invoice numbers.',
          required: true,
        },
        {
          icon: <FileText size={14} />,
          name: 'Credit Notes / Debit Notes',
          note: 'if any issued this month',
          whatIsIt: 'Documents adjusting earlier invoices - for returns, discounts, or corrections.',
          howToGet: 'From your billing system. Link each CN/DN to original invoice.',
          required: false,
        },
      ],
    },
    {
      category: 'Purchase Records',
      items: [
        {
          icon: <Package size={14} />,
          name: 'Purchase Invoices',
          note: 'all GST invoices received',
          whatIsIt: 'Invoices from suppliers for goods/services purchased. Required for claiming Input Tax Credit.',
          howToGet: 'Collect from accounts. Verify supplier GSTIN is active on GST portal.',
          usualIssues: 'ITC on invoices from cancelled GSTINs gets denied. Verify supplier status before paying.',
          required: true,
        },
        {
          icon: <FileBarChart size={14} />,
          name: 'GSTR-2B Report',
          note: 'auto-drafted ITC statement',
          whatIsIt: 'Auto-generated statement showing ITC available based on supplier filings.',
          howToGet: 'Download from GST portal by 14th of each month.',
          usualIssues: 'ITC claimed cannot exceed GSTR-2B limit. Reconcile before filing.',
          required: true,
        },
      ],
    },
  ],
  'llp-incorporation': [
    {
      category: 'Partner Documents',
      categoryNote: 'Required for each designated partner',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of each designated partner',
          whatIsIt: 'PAN of every person who will be a designated partner. At least 2 required.',
          howToGet: 'Each partner provides their PAN. Download e-PAN from incometax.gov.in if needed.',
          usualIssues: 'PAN must be linked to Aadhaar. Unlinked PAN causes verification failure.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of each designated partner',
          whatIsIt: 'Aadhaar for identity verification. OTP will be sent to linked mobile.',
          howToGet: 'Download e-Aadhaar from uidai.gov.in. Ensure mobile is active.',
          usualIssues: 'Name format must match PAN. "Rahul Kumar Singh" on PAN but "R K Singh" on Aadhaar causes rejection.',
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photograph',
          note: 'recent photo with white background',
          whatIsIt: 'Recent photograph for DPIN application.',
          howToGet: 'Professional passport photo. White background, no shadows.',
          required: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Specimen Signature',
          note: 'clear signature on white paper',
          whatIsIt: 'Your signature as it will appear on LLP documents.',
          howToGet: 'Sign on plain white paper, scan clearly.',
          required: true,
        },
      ],
    },
    {
      category: 'Address Proof',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Registered Office Address Proof',
          note: 'utility bill + NOC if rented',
          whatIsIt: 'Proof of the address where LLP will be registered.',
          howToGet: "Owned: Utility bill + ownership proof. Rented: Rent agreement + NOC + landlord's utility bill.",
          usualIssues: "NOC must be on landlord's letterhead with their signature. Template provided.",
          required: true,
        },
      ],
    },
    {
      category: 'LLP Details',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Proposed LLP Name',
          note: '2-3 options in order of preference',
          whatIsIt: 'Name you want for your LLP. Must end with "LLP" or "Limited Liability Partnership".',
          howToGet: 'Think of unique names. We check availability on MCA before applying.',
          usualIssues: 'Generic names get rejected. Add distinctive prefix/suffix. "ABC Technologies LLP" better than "Tech Solutions LLP".',
          ollvyProvides: true,
        },
        {
          icon: <Briefcase size={14} />,
          name: 'Business Activity Description',
          note: 'main activities the LLP will do',
          whatIsIt: 'Description of what the LLP will do. Used to determine NIC code.',
          howToGet: 'Describe your business in 2-3 sentences. Example: "IT consulting and software development services."',
          required: true,
        },
      ],
    },
  ],
  'pvt-ltd-incorporation': [
    {
      category: 'Director Documents',
      categoryNote: 'Required for each director (minimum 2)',
      items: [
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of each proposed director',
          whatIsIt: 'PAN of every person who will be a director. Minimum 2 directors required for Pvt Ltd.',
          howToGet: 'Each director provides their PAN. Download e-PAN from incometax.gov.in if needed.',
          usualIssues: 'PAN must be linked to Aadhaar. Unlinked PAN blocks DIN allotment.',
          required: true,
        },
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of each proposed director',
          whatIsIt: 'Aadhaar for e-KYC verification. OTP sent to linked mobile during DIN application.',
          howToGet: 'Download e-Aadhaar. Check mobile number is active and linked.',
          usualIssues: 'Name on Aadhaar must match PAN exactly. Minor variations cause rejection.',
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photograph',
          note: 'recent photo with white background',
          whatIsIt: 'Professional photograph for DIN application. Used in MCA records.',
          howToGet: 'Recent passport photo. White background, clear face, no shadows.',
          required: true,
        },
        {
          icon: <FileSignature size={14} />,
          name: 'Specimen Signature',
          note: 'clear signature on white paper',
          whatIsIt: 'Your signature as it will appear on company documents.',
          howToGet: 'Sign on plain white paper, scan clearly. Signature should match how you sign checks.',
          required: true,
        },
      ],
    },
    {
      category: 'Registered Office',
      items: [
        {
          icon: <Home size={14} />,
          name: 'Address Proof of Registered Office',
          note: 'utility bill + NOC if rented',
          whatIsIt: 'Proof of address where the company will be registered. Can be home address.',
          howToGet: "Owned: Utility bill + ownership proof. Rented: Rent agreement + NOC from landlord + landlord's utility bill.",
          usualIssues: 'NOC must mention the company name and be signed by landlord. We provide template.',
          required: true,
        },
      ],
    },
    {
      category: 'Company Details',
      items: [
        {
          icon: <Building2 size={14} />,
          name: 'Proposed Company Name',
          note: '2-3 options in order of preference',
          whatIsIt: 'Name for your Pvt Ltd company. Must end with "Private Limited".',
          howToGet: 'Think of unique names. We check availability on MCA RUN before applying.',
          usualIssues: 'Names too similar to existing companies get rejected. Add distinctive words.',
          ollvyProvides: true,
        },
        {
          icon: <Briefcase size={14} />,
          name: 'Business Objectives',
          note: 'main and ancillary objects',
          whatIsIt: 'Description of all activities the company will undertake. Broad objects recommended.',
          howToGet: 'List current and future planned activities. We help draft object clause.',
          usualIssues: 'Too narrow objects limit future activities. Include related activities.',
          ollvyProvides: true,
        },
        {
          icon: <IndianRupee size={14} />,
          name: 'Share Capital Details',
          note: 'authorized and paid-up capital',
          whatIsIt: 'How much capital the company will have and how shares are divided among shareholders.',
          howToGet: 'Decide on total capital and shareholding split. Minimum ₹1L common, can start with ₹10K paid-up.',
          usualIssues: 'Stamp duty varies by state and authorized capital. We advise optimal structure.',
          required: true,
        },
      ],
    },
  ],
  'cloud-kitchen-setup': [
    {
      category: 'Identity Documents',
      categoryNote: 'Required immediately to start work',
      items: [
        {
          icon: <User size={14} />,
          name: 'Aadhaar Card',
          note: 'of the owner / proprietor / director - active mobile required',
          whatIsIt: 'Your 12-digit UIDAI identity number. Required for identity verification on FSSAI FoSCoS portal, GST portal, and municipal applications.',
          howToGet: 'Scan front and back sides. Ensure the mobile number linked to your Aadhaar is active - OTPs are sent to it during filing. Check at myaadhaar.uidai.gov.in.',
          usualIssues: 'Inactive linked mobile is the most common blocker. If your mobile is not linked, update it at any Aadhaar enrolment centre - takes 7 days.',
          required: true,
        },
        {
          icon: <CreditCard size={14} />,
          name: 'PAN Card',
          note: 'of the owner - name must match Aadhaar exactly',
          whatIsIt: 'Your 10-digit Permanent Account Number. Required for GST registration, FSSAI application, and all government filings.',
          howToGet: 'Photograph or scan the physical card. Ensure the name matches Aadhaar character for character - including spaces and initials.',
          usualIssues: "Name mismatch between PAN and Aadhaar is the #1 rejection reason. 'Rajesh K Singh' on PAN but 'Rajesh Kumar Singh' on Aadhaar - GST and FSSAI portals reject this.",
          required: true,
        },
        {
          icon: <Home size={14} />,
          name: 'Kitchen Address Proof',
          note: 'electricity / gas / water bill - not older than 60 days',
          whatIsIt: 'Proof that you operate from the address declared in the FSSAI application. Must be a utility bill.',
          howToGet: 'Download the latest bill from your electricity or gas provider app or portal. Must show the complete address including PIN code.',
          usualIssues: 'Bill older than 60 days is rejected. Bill in parent or landlord name is generally accepted - Ollvy confirms based on state requirements.',
          required: true,
        },
        {
          icon: <Building2 size={14} />,
          name: 'Kitchen Layout Sketch',
          note: 'rough hand-drawn diagram is accepted - photo of sketch is fine',
          whatIsIt: 'A simple drawing showing the physical layout of your kitchen - entry point, cooking area, storage area, washing area. Used by FSSAI inspection officer.',
          howToGet: 'Draw it yourself on plain paper. Label: Entry, Cooking Zone, Utensil Storage, Food Storage, Wash Area. Take a clear photo. No professional drawing needed.',
          usualIssues: 'Layout submitted at application must match the actual kitchen seen during inspection. If you reorganise after filing, redraw and inform Ollvy.',
          required: true,
        },
      ],
    },
    {
      category: 'Within 7 Days',
      categoryNote: 'Can be submitted after work starts',
      items: [
        {
          icon: <FileText size={14} />,
          name: 'Rent Agreement',
          note: 'only if kitchen premises are rented',
          whatIsIt: 'Your lease or leave-and-licence agreement. Proves you have the right to use the address for commercial food activity.',
          howToGet: 'Scan the existing rent agreement. Both registered and unregistered agreements are accepted. Must cover the current date of application.',
          usualIssues: 'Agreement expired? An expired agreement combined with a recent utility bill is sometimes accepted. To be safe, get a fresh letter from the landlord confirming continued occupancy.',
          required: false,
        },
        {
          icon: <Package size={14} />,
          name: 'Food Items List',
          note: "cuisines and food categories you'll prepare - WhatsApp message is fine",
          whatIsIt: 'The categories of food you will prepare - needed to select the correct Kinds of Business (KoB) on your FSSAI license. A wrong KoB causes aggregator onboarding issues.',
          howToGet: "Just describe it in a WhatsApp message: 'We'll make biryani, grilled chicken, desserts.' Ollvy maps this to the correct FSSAI KoB.",
          usualIssues: 'Adding a new food category after FSSAI is issued requires a KoB modification (₹1,000 fee). Plan broadly - if you might add desserts later, include it now.',
          required: true,
        },
        {
          icon: <Landmark size={14} />,
          name: 'Bank Cancelled Cheque or Statement',
          note: 'for GST registration - account in owner / business name',
          whatIsIt: 'Proof of your bank account - account number and IFSC. Required for GST registration.',
          howToGet: "Photograph a cancelled cheque (write 'CANCELLED' in ink). Or download a bank statement showing account number and IFSC from net banking.",
          usualIssues: "Account must be in the owner's name or the business name. A family member's account is not accepted for GST registration.",
          required: true,
        },
        {
          icon: <Camera size={14} />,
          name: 'Passport-size Photograph',
          note: 'recent JPEG format - white background preferred',
          whatIsIt: 'Required for FSSAI application on the FoSCoS portal.',
          howToGet: 'A clear mobile selfie against a white wall. Save as JPEG under 1MB.',
          usualIssues: 'Blurry, dark, or heavy-shadow photos get rejected.',
          required: true,
        },
      ],
    },
    {
      category: 'Ollvy Provides',
      categoryNote: 'We prepare these for you',
      items: [
        {
          icon: <ClipboardList size={14} />,
          name: 'Food Safety Management Plan',
          note: 'Ollvy prepares this',
          whatIsIt: 'A document describing your food safety procedures - temperature control, hygiene practices, pest control. Required for FSSAI State License.',
          howToGet: 'Ollvy prepares a standard FSMP template for your kitchen type. No action from you.',
          usualIssues: 'Generic templates get flagged. Ollvy templates are premises-specific.',
          ollvyProvides: true,
        },
        {
          icon: <FileCheck size={14} />,
          name: 'FSSAI Application (Form B)',
          note: 'Ollvy files this',
          whatIsIt: 'The formal application to the Food Safety and Standards Authority of India for a State License.',
          howToGet: 'Ollvy files this on FoSCoS portal after reviewing all your documents.',
          usualIssues: 'N/A - Ollvy handles.',
          ollvyProvides: true,
        },
        {
          icon: <Receipt size={14} />,
          name: 'GST Application',
          note: 'Ollvy files this',
          whatIsIt: 'REG-01 form filed on GST portal for GSTIN issuance.',
          howToGet: 'Ollvy files after documents are received.',
          usualIssues: 'N/A - Ollvy handles.',
          ollvyProvides: true,
        },
        {
          icon: <Shield size={14} />,
          name: 'Pre-inspection Checklist',
          note: 'Ollvy sends 7 days before inspection',
          whatIsIt: 'Comprehensive checklist to prepare your kitchen for FSSAI inspection - layout, cleanliness, labelling, document display.',
          howToGet: 'Sent to your WhatsApp 7 days before scheduled inspection date.',
          usualIssues: 'Following this checklist helps pass inspection first time.',
          ollvyProvides: true,
        },
      ],
    },
  ],
}

const TAB_LABELS: Record<string, string> = {
  pvt_ltd: 'Private Limited',
  llp: 'LLP',
  sole_proprietor: 'Sole Proprietor',
  partnership: 'Partnership',
  individual_itr: 'Individual ITR',
  trademark: 'Trademark',
  business_itr: 'Business ITR',
}

// Helper to get preview items (first category, limited items) for card display
function getPreviewDocuments(categories: DocumentCategory[]): DocumentItem[] {
  // Get first 4-5 required items from the first two categories
  const previewItems: DocumentItem[] = []
  for (const category of categories) {
    for (const item of category.items) {
      if (previewItems.length >= 5) break
      if (item.required !== false || previewItems.length < 4) {
        previewItems.push(item)
      }
    }
    if (previewItems.length >= 5) break
  }
  return previewItems.slice(0, 5)
}

// Compact list for preview cards - modern minimal style
function DocumentPreviewList({ documents }: { documents: DocumentItem[] }) {
  return (
    <ul className="space-y-1.5">
      {documents.map((doc, i) => (
        <li key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors -mx-2">
          <div className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
            {doc.icon}
          </div>
          <span className="text-sm text-foreground flex-1 truncate">{doc.name}</span>
          {doc.ollvyProvides && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
              Ollvy
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

// Full detailed list for dialog with click-to-select
function DocumentFullList({
  categories,
  selectedDoc,
  onSelectDoc
}: {
  categories: DocumentCategory[]
  selectedDoc: SelectedDocument | null
  onSelectDoc: (doc: SelectedDocument | null) => void
}) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-foreground">{category.category}</h4>
            {category.categoryNote && (
              <p className="text-xs text-muted-foreground">{category.categoryNote}</p>
            )}
          </div>
          <ul className="space-y-2">
            {category.items.map((doc, docIndex) => {
              const isSelected = selectedDoc?.name === doc.name && selectedDoc?.categoryName === category.category
              return (
                <li
                  key={docIndex}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-card/50 hover:border-muted-foreground/30 hover:bg-card'
                  }`}
                  onClick={() => onSelectDoc({ ...doc, categoryName: category.category })}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground'
                    }`}>
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        {doc.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                            Required
                          </span>
                        )}
                        {doc.ollvyProvides && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            Ollvy provides
                          </span>
                        )}
                      </div>
                      {doc.note && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.note}</p>
                      )}
                    </div>
                    <ChevronRight size={14} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Document detail panel shown on the right
function DocumentDetailPanel({ doc, onClose }: { doc: SelectedDocument; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            {doc.icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{doc.name}</h3>
            <p className="text-xs text-muted-foreground">{doc.categoryName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5">
        {/* Badges */}
        <div className="flex items-center gap-2">
          {doc.required && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
              Required
            </span>
          )}
          {doc.ollvyProvides && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Ollvy handles this
            </span>
          )}
          {!doc.required && !doc.ollvyProvides && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              Optional
            </span>
          )}
        </div>

        {/* Sample Image */}
        {doc.sampleImage && (
          <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
            <img
              src={doc.sampleImage}
              alt={`Sample ${doc.name}`}
              className="w-full h-auto max-h-40 object-contain"
            />
            <p className="text-[10px] text-center text-muted-foreground py-1.5 border-t border-border">
              Sample document for reference
            </p>
          </div>
        )}

        {/* What is it */}
        {doc.whatIsIt && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              What is this?
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{doc.whatIsIt}</p>
          </div>
        )}

        {/* How to get */}
        {doc.howToGet && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              How to get it
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{doc.howToGet}</p>
          </div>
        )}

        {/* Usual Issues */}
        {doc.usualIssues && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <h4 className="text-xs font-semibold text-amber-700 mb-1">Common issues</h4>
                <p className="text-xs text-amber-900/80 leading-relaxed">{doc.usualIssues}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {doc.details && doc.details.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              What we check
            </h4>
            <ul className="space-y-2">
              {doc.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-primary" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

interface DocumentChecklistProps {
  defaultTab?: string
  showSectionHeader?: boolean
  customHeading?: string
  /** When provided, shows service-specific documents instead of business-type tabs */
  serviceSlug?: string
  /** Service name to display in heading */
  serviceName?: string
}

export function DocumentChecklist({
  defaultTab = 'pvt_ltd',
  showSectionHeader = true,
  customHeading,
  serviceSlug,
  serviceName,
}: DocumentChecklistProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(null)

  // Check if we have service-specific documents
  const hasServiceDocs = serviceSlug && SERVICE_DOCUMENT_DATA[serviceSlug]
  const serviceDocuments = hasServiceDocs ? SERVICE_DOCUMENT_DATA[serviceSlug] : null

  // Reset selected doc when dialog closes or tab changes
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setSelectedDoc(null)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedDoc(null)
  }

  // Service-specific mode (no tabs, shows documents for this service only)
  if (hasServiceDocs && serviceDocuments) {
    const totalDocs = serviceDocuments.reduce((acc, cat) => acc + cat.items.length, 0)
    const displayName = serviceName || serviceSlug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    return (
      <section className={showSectionHeader ? "bg-card py-24" : ""}>
        <div className={showSectionHeader ? "container" : ""}>
          {showSectionHeader && (
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                DOCUMENTS REQUIRED
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {customHeading || `What you'll need for ${displayName}`}
              </h2>
              <p className="text-base text-muted-foreground max-w-[480px] mx-auto mt-4">
                Gather these documents before starting. Click any to see exactly what we need.
              </p>
            </div>
          )}
          {!showSectionHeader && customHeading && (
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
              {customHeading}
            </h2>
          )}

          {/* Direct Card (no tabs) */}
          <div className={showSectionHeader ? "max-w-[640px] mx-auto" : ""}>
            <Card className="border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Required Documents</span>
                <span className="text-sm text-muted-foreground">{totalDocs} total</span>
              </div>
              <DocumentPreviewList documents={getPreviewDocuments(serviceDocuments)} />

              <div className="mt-4 pt-4 border-t border-border flex justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-[hsl(var(--ollvy-green))] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-[hsl(142_71%_40%)]"
                  onClick={() => setDialogOpen(true)}
                >
                  View complete checklist
                  <ChevronDown size={14} />
                </button>
              </div>
            </Card>
          </div>

          {/* Dialog for service-specific docs */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col transition-all duration-300 ${
              selectedDoc ? 'max-w-[1000px]' : 'max-w-[680px]'
            }`}>
              <DialogHeader className="shrink-0">
                <DialogTitle>Document Checklist - {displayName}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedDoc
                    ? 'Click any document to learn what it is and how to get it.'
                    : 'Everything you need to have ready. Click any document for details.'
                  }
                </p>
              </DialogHeader>

              <div className="mt-4 flex-1 overflow-hidden flex gap-4">
                {/* Document List - Left Side */}
                <div className={`overflow-y-auto pr-2 -mr-2 transition-all duration-300 ${
                  selectedDoc ? 'w-1/2 border-r border-border pr-4' : 'w-full'
                }`}>
                  <DocumentFullList
                    categories={serviceDocuments}
                    selectedDoc={selectedDoc}
                    onSelectDoc={setSelectedDoc}
                  />
                </div>

                {/* Document Detail - Right Side */}
                {selectedDoc && (
                  <div className="w-1/2 pl-2 animate-in slide-in-from-right-4 duration-200">
                    <DocumentDetailPanel
                      doc={selectedDoc}
                      onClose={() => setSelectedDoc(null)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-4 shrink-0">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60"></span>
                    Required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                    Ollvy handles
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    )
  }

  // Default mode with business-type tabs (homepage)
  return (
    <section className="bg-card py-24">
      <div className="container">
        {showSectionHeader && (
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              BEFORE YOU BOOK
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {customHeading || "What you'll need"}
            </h2>
            <p className="text-base text-muted-foreground max-w-[480px] mx-auto mt-4">
              Gather these before you start. Click any document to see exactly what we need.
            </p>
          </div>
        )}
        {!showSectionHeader && customHeading && (
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
            {customHeading}
          </h2>
        )}

        {/* Tabs + Card Container */}
        <div className="max-w-[640px] mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="overflow-x-auto pb-1">
              <TabsList className="h-auto p-1 gap-1 w-full flex-wrap justify-center bg-transparent">
                <TabsTrigger value="pvt_ltd" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Pvt Ltd</TabsTrigger>
                <TabsTrigger value="llp" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">LLP</TabsTrigger>
                <TabsTrigger value="sole_proprietor" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Sole Prop</TabsTrigger>
                <TabsTrigger value="partnership" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Partnership</TabsTrigger>
                <TabsTrigger value="individual_itr" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Personal ITR</TabsTrigger>
                <TabsTrigger value="trademark" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Trademark</TabsTrigger>
                <TabsTrigger value="business_itr" className="font-mono text-xs h-7 px-2.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-sm transition-all duration-150">Biz ITR</TabsTrigger>
              </TabsList>
            </div>

            {Object.keys(DOCUMENT_DATA).map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey} className="animate-in fade-in-0 duration-150">
                <Card className="border border-border bg-card p-6 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Key Documents</span>
                    <span className="text-sm text-muted-foreground">{DOCUMENT_DATA[tabKey].reduce((acc, cat) => acc + cat.items.length, 0)} total</span>
                  </div>
                  <DocumentPreviewList documents={getPreviewDocuments(DOCUMENT_DATA[tabKey])} />

                  <div className="mt-4 pt-4 border-t border-border flex justify-center">
                    <button
                      className="px-4 py-2 rounded-lg bg-[hsl(var(--ollvy-green))] text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-[hsl(142_71%_40%)]"
                      onClick={() => setDialogOpen(true)}
                    >
                      View complete checklist
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className={`max-h-[85vh] overflow-hidden flex flex-col transition-all duration-300 ${
            selectedDoc ? 'max-w-[1000px]' : 'max-w-[680px]'
          }`}>
            <DialogHeader className="shrink-0">
              <DialogTitle>Complete Document Checklist - {TAB_LABELS[activeTab]}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedDoc
                  ? 'Click any document to learn what it is and how to get it.'
                  : 'Everything you need to have ready. Click any document for details.'
                }
              </p>
            </DialogHeader>

            <div className="mt-4 flex-1 overflow-hidden flex gap-4">
              {/* Document List - Left Side */}
              <div className={`overflow-y-auto pr-2 -mr-2 transition-all duration-300 ${
                selectedDoc ? 'w-1/2 border-r border-border pr-4' : 'w-full'
              }`}>
                <DocumentFullList
                  categories={DOCUMENT_DATA[activeTab]}
                  selectedDoc={selectedDoc}
                  onSelectDoc={setSelectedDoc}
                />
              </div>

              {/* Document Detail - Right Side */}
              {selectedDoc && (
                <div className="w-1/2 pl-2 animate-in slide-in-from-right-4 duration-200">
                  <DocumentDetailPanel
                    doc={selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 mt-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60"></span>
                    Required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                    Ollvy handles
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=document_checklist">Book this service</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
