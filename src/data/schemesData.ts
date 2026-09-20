import { Scheme } from '../types';

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: 'pmegp',
    name: 'PMEGP — Prime Minister\'s Employment Generation Programme',
    code: 'PMEGP',
    nativeName: {
      en: 'PMEGP — Prime Minister\'s Employment Generation Programme',
      ta: 'PMEGP — பிரதம மந்திரி வேலைவாய்ப்பு உருவாக்கும் திட்டம்',
      hi: 'PMEGP — प्रधानमंत्री रोजगार सृजन कार्यक्रम'
    },
    category: 'Manufacturing & Services',
    purpose: 'Credit-linked subsidy programme to generate self-employment in rural and urban areas for micro-enterprises.',
    targetBeneficiaries: 'First-time rural & semi-urban entrepreneurs, 18+ years, minimum 8th standard pass for projects over ₹10L (mfg) or ₹5L (service).',
    projectCostMin: 100000,
    projectCostMax: 5000000,
    maxLoanLimit: 4500000,
    ownContributionPercent: 5, // 5% for rural/special, 10% for general
    interestRateMin: 8.5,
    interestRateMax: 11.5,
    tenureYearsMax: 7,
    moratoriumMonths: 6,
    subsidyPercent: 35, // 25% to 35% in rural areas
    collateralRequired: false,
    collateralDescription: 'No collateral required. Covered under CGTMSE credit guarantee.',
    eligibleCategories: ['Grocery', 'Dairy', 'Food Processing', 'Tailoring', 'Manufacturing', 'Services', 'Agriculture'],
    requiredDocuments: [
      'Aadhaar Card & PAN Card',
      'Proof of Rural Residence (Panchayat Certificate)',
      'Educational Qualification Certificate (8th pass certificate if >₹5L/₹10L)',
      'Detailed Project Report (DPR) / GramSahay Dossier',
      'EDP / RSETI Training Certificate (can be completed post-sanction)',
      'Caste / Special Category Certificate (if claiming 35% subsidy)'
    ],
    officialWebsite: 'https://www.kviconline.gov.in',
    officialApplicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp',
    sourceAuthority: 'Ministry of MSME / KVIC / State KVI Boards',
    lastVerifiedDate: '2026-03-01',
    verificationStatus: 'verified',
    keyBenefits: [
      'Up to 35% government subsidy for rural enterprises',
      'Low own contribution (only 5% required for rural/special category)',
      'No third-party guarantee or collateral required'
    ],
    caveats: [
      'Subsidy is kept as term deposit (lock-in) for 3 years before being credited to loan',
      'Requires EDP training verification before final subsidy release',
      'Existing businesses cannot apply for new unit subsidy under normal PMEGP'
    ]
  },
  {
    id: 'mudra-kishore',
    name: 'Pradhan Mantri MUDRA Yojana (Kishore / Shishu)',
    code: 'PM-MUDRA',
    nativeName: {
      en: 'PM MUDRA Yojana (Kishore / Shishu)',
      ta: 'பிரதம மந்திரி முத்ரா கடன் திட்டம் (கிஷோர் / சிசு)',
      hi: 'प्रधानमंत्री मुद्रा योजना (किशोर / शिशु)'
    },
    category: 'Micro Enterprises & Retail',
    purpose: 'Collateral-free institutional credit to micro units for income generating activities in manufacturing, trading and service sectors.',
    targetBeneficiaries: 'Small shopkeepers, dairy farmers, artisans, fruits/vegetable vendors, small repair shops.',
    projectCostMin: 50000,
    projectCostMax: 500000,
    maxLoanLimit: 500000,
    ownContributionPercent: 10,
    interestRateMin: 9.0,
    interestRateMax: 12.0,
    tenureYearsMax: 5,
    moratoriumMonths: 3,
    subsidyPercent: 0,
    collateralRequired: false,
    collateralDescription: 'Strictly zero collateral or third-party guarantee as per RBI & MUDRA guidelines.',
    eligibleCategories: ['Grocery', 'Dairy', 'Food Processing', 'Tailoring', 'Mobile Repair', 'Services'],
    requiredDocuments: [
      'Proof of Identity & Residence (Aadhaar, Voter ID)',
      'Two recent passport size photographs',
      'Quotations for machinery/equipment or stock to be purchased',
      'Last 6 months bank statement (if existing account)',
      'GramSahay Feasibility & Revenue Estimate'
    ],
    officialWebsite: 'https://www.mudra.org.in',
    officialApplicationUrl: 'https://www.udyamimitra.in',
    sourceAuthority: 'MUDRA Ltd / Department of Financial Services (DFS)',
    lastVerifiedDate: '2026-02-15',
    verificationStatus: 'verified',
    keyBenefits: [
      'No collateral or security needed',
      'Available directly through all public & regional rural banks',
      'MUDRA Card provided for flexible working capital withdrawals'
    ],
    caveats: [
      'No direct capital subsidy component under basic MUDRA (unless combined with state schemes)',
      'Bank branch managers assess local credit history before sanction'
    ]
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    code: 'PM-VISHWAKARMA',
    nativeName: {
      en: 'PM Vishwakarma Scheme',
      ta: 'பிரதம மந்திரி விஸ்வகர்மா திட்டம்',
      hi: 'प्रधानमंत्री विश्वकर्मा योजना'
    },
    category: 'Artisans & Traditional Crafts',
    purpose: 'End-to-end holistic support to traditional rural artisans with skill training, toolkits, and subsidized collateral-free enterprise credit.',
    targetBeneficiaries: 'Artisans engaged in 18 notified family trades (Tailor, Carpenter, Blacksmith, Cobbler, Potter, Barber, Garland maker, Washerman, etc.)',
    projectCostMin: 50000,
    projectCostMax: 300000,
    maxLoanLimit: 300000,
    ownContributionPercent: 5,
    interestRateMin: 5.0, // Subsidized at 5%
    interestRateMax: 5.0,
    tenureYearsMax: 3,
    moratoriumMonths: 3,
    subsidyPercent: 8, // Interest subvention of 8% paid by government
    collateralRequired: false,
    collateralDescription: 'Completely collateral-free with credit guarantee support.',
    eligibleCategories: ['Tailoring', 'Services', 'Manufacturing'],
    requiredDocuments: [
      'Aadhaar Card with linked mobile number',
      'Ration Card / Family details',
      'Gram Panchayat / Urban Local Body verification of family craft practice',
      'Bank Account details'
    ],
    officialWebsite: 'https://pmvishwakarma.gov.in',
    officialApplicationUrl: 'https://pmvishwakarma.gov.in',
    sourceAuthority: 'Ministry of MSME & Ministry of Skill Development',
    lastVerifiedDate: '2026-03-10',
    verificationStatus: 'verified',
    keyBenefits: [
      'Subsidized 5% flat interest rate (extremely low monthly EMI)',
      '₹15,000 free toolkit incentive voucher upon training completion',
      'Tranche 1: ₹1,00,000; Tranche 2: ₹2,00,000 upon timely repayment'
    ],
    caveats: [
      'Only applicable to the 18 designated traditional artisan trades',
      'Only one member per family is eligible',
      'Must complete 5-7 days basic skill verification course'
    ]
  },
  {
    id: 'svep-nrlm',
    name: 'SVEP — Start-up Village Entrepreneurship Programme',
    code: 'SVEP',
    nativeName: {
      en: 'SVEP — Start-up Village Entrepreneurship Programme',
      ta: 'SVEP — கிராமப்புற புத்தொழில் முனைவோர் திட்டம்',
      hi: 'SVEP — स्टार्टअप ग्राम उद्यमिता कार्यक्रम'
    },
    category: 'Rural SHG Enterprises',
    purpose: 'Catalyze rural micro-enterprises through Community Enterprise Funds (CEF) and localized Business Support Centres (BRC).',
    targetBeneficiaries: 'Rural Self-Help Group (SHG) members, rural youth, and vulnerable village households.',
    projectCostMin: 30000,
    projectCostMax: 250000,
    maxLoanLimit: 200000,
    ownContributionPercent: 10,
    interestRateMin: 7.0,
    interestRateMax: 9.0,
    tenureYearsMax: 3,
    moratoriumMonths: 2,
    subsidyPercent: 10,
    collateralRequired: false,
    collateralDescription: 'Community social collateral and peer SHG guarantee.',
    eligibleCategories: ['Grocery', 'Dairy', 'Food Processing', 'Tailoring', 'Services', 'Agriculture'],
    requiredDocuments: [
      'SHG Membership ID / Verification letter from Village Organization (VO)',
      'Aadhaar Card and Village Panchayat proof',
      'Simple Enterprise Plan vetted by Community Resource Person (CRP-EP)'
    ],
    officialWebsite: 'https://aajeevika.gov.in',
    officialApplicationUrl: 'https://aajeevika.gov.in/en/content/start-village-entrepreneurship-programme-svep',
    sourceAuthority: 'Ministry of Rural Development (MoRD) / DAY-NRLM',
    lastVerifiedDate: '2026-01-20',
    verificationStatus: 'verified',
    keyBenefits: [
      'Dedicated local village mentor (CRP-EP) helps prepare records and market',
      'Flexible repayment timeline tailored to seasonal village agriculture',
      'Low interest rates disbursed via Cluster Level Federation (CLF)'
    ],
    caveats: [
      'Available specifically in designated SVEP intensive blocks',
      'Preference given to women and active SHG families'
    ]
  },
  {
    id: 'cgtmse-scheme',
    name: 'CGTMSE Credit Guarantee Scheme for Micro Enterprises',
    code: 'CGTMSE',
    nativeName: {
      en: 'CGTMSE Credit Guarantee Scheme',
      ta: 'CGTMSE — பிணையமில்லா கடன் உத்தரவாத திட்டம்',
      hi: 'CGTMSE — सूक्ष्म उद्यम ऋण गारंटी योजना'
    },
    category: 'General Micro Manufacturing & Service',
    purpose: 'Enables commercial banks to provide collateral-free and third-party-guarantee-free loans to new and existing micro enterprises.',
    targetBeneficiaries: 'New and existing micro entrepreneurs seeking business loans without pledging personal immovable property.',
    projectCostMin: 200000,
    projectCostMax: 20000000,
    maxLoanLimit: 10000000,
    ownContributionPercent: 15,
    interestRateMin: 9.5,
    interestRateMax: 12.5,
    tenureYearsMax: 7,
    moratoriumMonths: 6,
    subsidyPercent: 0,
    collateralRequired: false,
    collateralDescription: '100% guarantee coverage up to ₹50 Lakhs for micro-enterprises without mortgage.',
    eligibleCategories: ['Grocery', 'Dairy', 'Food Processing', 'Tailoring', 'Manufacturing', 'Services', 'Agriculture'],
    requiredDocuments: [
      'Udyam Registration Certificate (free MSME portal)',
      'KYC documents of borrower',
      'Business Bank statements and Projected Cashflows',
      'GramSahay Business Plan & GramTwin stress-test analysis'
    ],
    officialWebsite: 'https://www.cgtmse.in',
    officialApplicationUrl: 'https://www.cgtmse.in',
    sourceAuthority: 'SIDBI & Ministry of MSME',
    lastVerifiedDate: '2026-02-28',
    verificationStatus: 'verified',
    keyBenefits: [
      'Borrow up to ₹50 Lakhs / ₹1 Crore without mortgage of home or agricultural land',
      'Accepted by all nationalized commercial banks and private banks'
    ],
    caveats: [
      'A nominal annual guarantee fee (0.37% - 0.75%) is charged by the bank',
      'Borrower must have clean CIBIL credit track record with no prior defaults'
    ]
  },
  {
    id: 'sfurti-cluster',
    name: 'SFURTI — Traditional Industry & Agro-Cluster Scheme',
    code: 'SFURTI',
    nativeName: {
      en: 'SFURTI Scheme',
      ta: 'SFURTI — பாரம்பரிய மற்றும் வேளாண் தொழில் தொகுப்பு திட்டம்',
      hi: 'SFURTI — पारंपरिक उद्योग और कृषि क्लस्टर योजना'
    },
    category: 'Agro & Food Clusters',
    purpose: 'Organize traditional rural artisans and agro-producers into competitive production clusters with common facility centres (CFCs).',
    targetBeneficiaries: 'Groups of 20+ village farmers/producers forming a cluster in dairy, honey, bamboo, spices, or textiles.',
    projectCostMin: 500000,
    projectCostMax: 25000000,
    maxLoanLimit: 15000000,
    ownContributionPercent: 10,
    interestRateMin: 8.5,
    interestRateMax: 10.5,
    tenureYearsMax: 7,
    moratoriumMonths: 12,
    subsidyPercent: 40,
    collateralRequired: false,
    collateralDescription: 'Cluster asset hypothecation.',
    eligibleCategories: ['Dairy', 'Food Processing', 'Agriculture', 'Manufacturing'],
    requiredDocuments: [
      'Producer group / Farmer Producer Organisation (FPO) registration',
      'Village land lease or ownership for Common Facility Center',
      'List of participating village members & artisan passbooks'
    ],
    officialWebsite: 'https://sfurti.msme.gov.in',
    officialApplicationUrl: 'https://sfurti.msme.gov.in',
    sourceAuthority: 'Ministry of MSME',
    lastVerifiedDate: '2026-01-15',
    verificationStatus: 'verified',
    keyBenefits: [
      'High government grant for shared machinery and modern processing units',
      'Connects village producers directly to bulk buyers and e-commerce'
    ],
    caveats: [
      'Requires cooperative or group formation (minimum cluster members required)',
      'Not for single individual proprietary shops'
    ]
  }
];
