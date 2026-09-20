import { 
  BusinessIdea, 
  EntrepreneurProfile, 
  CompetitorShop, 
  PilotMilestone,
  StressScenario, 
  WhyNotBorrowItem, 
  BusinessVariation, 
  SkillToBusinessModel, 
  AssumptionItem, 
  ApplicationReadinessItem, 
  PostLoanRecord, 
  StartSmallTier 
} from '../types';
import { calculateEMI } from '../utils/financialEngine';

// ===================================================
// INNOVATION #3: LOAN STRESS LAB CALCULATOR
// ===================================================
export function calculateStressScenarios(
  idea: BusinessIdea,
  profile: EntrepreneurProfile,
  interestRate = 10.5,
  tenureYears = 5
): StressScenario[] {
  const loanAmount = profile.requiredLoan || (profile.projectCost - profile.ownCapital);
  const emi = calculateEMI(loanAmount, interestRate, tenureYears);
  const baseOperatingDays = idea.operatingDays || 26;
  const baseMargin = 1 - (idea.variableCostRatio || 0.6); // e.g. 40% margin
  const basePrice = idea.avgBill || 150;
  const baseCustomers = idea.dailyCustomers || 40;
  const baseFixedCosts = idea.fixedCosts || 14000;

  const scenariosConfig = [
    {
      id: 'base',
      name: 'Base Scenario (Current Assumptions)',
      category: 'demand' as const,
      demandChangePct: 0,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Standard operations based on your current input assumptions.'
    },
    {
      id: 'demand-10',
      name: '10% Demand Drop (Slow Season)',
      category: 'demand' as const,
      demandChangePct: -10,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Minor seasonal dip (e.g. monsoon lull or exam week in village).'
    },
    {
      id: 'demand-20',
      name: '20% Demand Drop (New Local Competitor)',
      category: 'demand' as const,
      demandChangePct: -20,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Significant customer loss if a nearby store opens or prices rise.'
    },
    {
      id: 'demand-30',
      name: '30% Demand Drop (Severe Slowdown)',
      category: 'demand' as const,
      demandChangePct: -30,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Extended agricultural off-season where household cash is tight.'
    },
    {
      id: 'demand-40',
      name: '40% Demand Drop (Extreme Stress)',
      category: 'demand' as const,
      demandChangePct: -40,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Worst-case emergency: road repair, severe supply failure, or flood.'
    },
    {
      id: 'cost-10',
      name: '10% Operating Cost Inflation',
      category: 'expense' as const,
      demandChangePct: 0,
      expenseChangePct: 10,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Fuel, electricity, or wholesale ingredient cost surge.'
    },
    {
      id: 'cost-20',
      name: '20% Operating Cost Inflation',
      category: 'expense' as const,
      demandChangePct: 0,
      expenseChangePct: 20,
      priceChangePct: 0,
      emergencyMonthlyCost: 0,
      diagnosis: 'Wholesale distributor price hike without immediate ability to pass to villagers.'
    },
    {
      id: 'price-10',
      name: '10% Price Discount / Market Pressure',
      category: 'price' as const,
      demandChangePct: 0,
      expenseChangePct: 0,
      priceChangePct: -10,
      emergencyMonthlyCost: 0,
      diagnosis: 'Forced promotional discounting to compete with established traders.'
    },
    {
      id: 'emergency-5k',
      name: 'Unexpected Repair & Emergency Outflow (+₹5,000/mo)',
      category: 'emergency' as const,
      demandChangePct: 0,
      expenseChangePct: 0,
      priceChangePct: 0,
      emergencyMonthlyCost: 5000,
      diagnosis: 'Machine breakdown, generator fuel, or family emergency withdrawal.'
    }
  ];

  return scenariosConfig.map(cfg => {
    const effectiveCustomers = Math.max(1, Math.round(baseCustomers * (1 + cfg.demandChangePct / 100)));
    const effectivePrice = Math.max(1, basePrice * (1 + cfg.priceChangePct / 100));
    const monthlyRevenue = Math.round(effectiveCustomers * effectivePrice * baseOperatingDays);

    const baseVarCost = monthlyRevenue * (1 - baseMargin);
    const inflatedVarCost = Math.round(baseVarCost * (1 + cfg.expenseChangePct / 100));
    const fixedCosts = Math.round((baseFixedCosts * (1 + cfg.expenseChangePct / 100)) + cfg.emergencyMonthlyCost);
    const monthlyOperatingCosts = Math.round(inflatedVarCost + fixedCosts);

    const monthlySurplus = Math.round(monthlyRevenue - monthlyOperatingCosts);
    const postEmiSurplus = Math.round(monthlySurplus - emi);

    // Break even customers
    const unitGrossProfit = effectivePrice * baseMargin;
    const totalRequiredFixed = fixedCosts + emi;
    const breakEvenCustomersPerDay = unitGrossProfit > 0 
      ? Math.ceil(totalRequiredFixed / (unitGrossProfit * baseOperatingDays))
      : 999;

    let pressure: 'Manageable' | 'Tight' | 'Higher pressure' | 'Requires validation' = 'Manageable';
    if (postEmiSurplus < 0) {
      pressure = 'Higher pressure';
    } else if (postEmiSurplus < emi * 0.5) {
      pressure = 'Tight';
    } else if (effectiveCustomers < breakEvenCustomersPerDay + 5) {
      pressure = 'Requires validation';
    } else {
      pressure = 'Manageable';
    }

    return {
      id: cfg.id,
      name: cfg.name,
      category: cfg.category,
      demandChangePct: cfg.demandChangePct,
      expenseChangePct: cfg.expenseChangePct,
      priceChangePct: cfg.priceChangePct,
      emergencyMonthlyCost: cfg.emergencyMonthlyCost,
      monthlyRevenue,
      monthlyOperatingCosts,
      monthlyEMI: Math.round(emi),
      postEmiSurplus,
      breakEvenCustomersPerDay,
      pressure,
      diagnosis: cfg.diagnosis
    };
  });
}

// ===================================================
// INNOVATION #4: "WHY NOT BORROW?" DECISION ENGINE
// ===================================================
export function generateWhyNotBorrow(
  idea: BusinessIdea,
  profile: EntrepreneurProfile,
  competitors: CompetitorShop[]
): WhyNotBorrowItem[] {
  const items: WhyNotBorrowItem[] = [];
  const loanAmount = profile.requiredLoan || (profile.projectCost - profile.ownCapital);
  const emi = calculateEMI(loanAmount, 10.5, 5);
  const baseMargin = 1 - (idea.variableCostRatio || 0.6);
  const monthlyRevenue = (idea.dailyCustomers || 40) * (idea.avgBill || 150) * (idea.operatingDays || 26);
  const monthlySurplus = monthlyRevenue * baseMargin - (idea.fixedCosts || 14000);

  // 1. High EMI relative to surplus
  if (emi > monthlySurplus * 0.45) {
    items.push({
      id: 'high-emi-ratio',
      concern: 'Loan EMI consumes more than 45% of your estimated monthly surplus',
      whyItMatters: 'Any seasonal dip or delayed customer payments will force you to dip into household savings to service the bank loan.',
      whatToValidate: 'Can project scope be staged in 2 phases, or can own contribution be increased by 10%?',
      suggestedAction: 'Consider starting with a reduced Phase-1 equipment loan rather than the maximum permissible limit.',
      severity: 'high',
      ruleTriggered: 'SURPLUS_DEBT_RATIO_EXCEEDS_45_PCT'
    });
  }

  // 2. High dependence on unverified customer footfall
  if ((idea.dailyCustomers || 40) >= 40) {
    items.push({
      id: 'unverified-footfall',
      concern: `Assumption of ${idea.dailyCustomers || 40} paying customers every day is not yet validated by field trials`,
      whyItMatters: 'Rural footfalls often cluster on weekly shandy (haat) days and remain light on ordinary weekdays.',
      whatToValidate: 'Conduct a 7-day manual head-count of shoppers at the target location between 8 AM - 11 AM and 5 PM - 8 PM.',
      suggestedAction: 'Run a 2-week pre-launch trial or stall before committing capital to a 3-year shop lease.',
      severity: 'medium',
      ruleTriggered: 'DAILY_CUSTOMERS_ASSUMPTION_GREATER_THAN_40'
    });
  }

  // 3. High Competition without Differentiation
  const sameTypeCompetitors = competitors.filter(c => 
    c.businessType.toLowerCase().includes(idea.category.toLowerCase()) || 
    idea.name.toLowerCase().includes(c.businessType.toLowerCase())
  );
  if (sameTypeCompetitors.length >= 2) {
    const hasDeliveryDiff = sameTypeCompetitors.some(c => !c.hasHomeDelivery);
    items.push({
      id: 'competitor-density',
      concern: `${sameTypeCompetitors.length} similar businesses already operate within your target village cluster`,
      whyItMatters: 'Without a clear reason for villagers to switch, you may be forced into price wars that destroy your profit margin.',
      whatToValidate: `Are customers unsatisfied with current shops? ${hasDeliveryDiff ? 'Doorstep delivery or digital credit tracking' : 'Specialty stock'} could differentiate you.`,
      suggestedAction: 'Formally offer at least one distinct convenience (e.g. dawn delivery or weekly subscription) before advertising opening day.',
      severity: 'medium',
      ruleTriggered: 'COMPETITOR_COUNT_GREATER_EQUAL_2'
    });
  }

  // 4. Low Own Capital Safety Buffer
  const ownContributionRatio = profile.projectCost > 0 ? (profile.ownCapital / profile.projectCost) : 0.2;
  if (ownContributionRatio < 0.15) {
    items.push({
      id: 'low-own-contribution',
      concern: `Your own equity contribution is ${(ownContributionRatio * 100).toFixed(0)}%, leaving near-zero working capital reserve`,
      whyItMatters: 'Banks require 3-6 months of operating cash buffer because inventory turnover in rural areas can be slower than forecast.',
      whatToValidate: 'Ensure you retain at least ₹25,000 to ₹50,000 cash in emergency reserve, separate from the project cost.',
      suggestedAction: 'Explore government subsidy schemes like PMEGP (up to 35% margin money subsidy) to lower your debt burden.',
      severity: 'high',
      ruleTriggered: 'OWN_CONTRIBUTION_BELOW_15_PCT'
    });
  }

  // 5. Default healthy check
  if (items.length === 0) {
    items.push({
      id: 'prudent-launch',
      concern: 'Financing structure looks balanced, but working capital cycle must be strictly tracked',
      whyItMatters: 'Rural businesses often extend informal credit (khata/kadan) to neighbors which traps working capital.',
      whatToValidate: 'Limit informal customer credit to not more than 15% of monthly revenue.',
      suggestedAction: 'Set up digital payments (UPI) and a strict 7-day payment reminder ledger from Day 1.',
      severity: 'low',
      ruleTriggered: 'HEALTHY_INITIAL_SCREENING'
    });
  }

  return items;
}

// ===================================================
// INNOVATION #7 & #18: BUSINESS IDEA EVOLVER & VARIATIONS
// ===================================================
export function generateBusinessVariations(
  idea: BusinessIdea,
  competitors: CompetitorShop[]
): BusinessVariation[] {
  const compCount = competitors.length;
  const noDeliveryCompetitors = competitors.filter(c => !c.hasHomeDelivery).length;

  return [
    {
      id: 'model-base',
      title: `Traditional ${idea.name || 'Store'}`,
      subtitle: 'Standard counter retail / service',
      description: 'Physical shop model waiting for walk-in footfall during regular daytime operating hours.',
      capexAddition: 0,
      customerMultiplier: 1.0,
      avgBillMultiplier: 1.0,
      marginAdjustmentPct: 0,
      fixedCostDelta: 0,
      differentiationFeature: 'Standard village counter presence',
      competitorsOffering: compCount,
      validationRequirement: 'Footfall observation at specific road junction'
    },
    {
      id: 'model-delivery',
      title: `${idea.name || 'Store'} + Doorstep Village Delivery`,
      subtitle: 'Cycle/Moped delivery for elderly & busy households',
      description: 'Collect orders via WhatsApp / phone in early morning, deliver before 9 AM and after 6 PM to working farmers.',
      capexAddition: 18000,
      customerMultiplier: 1.25,
      avgBillMultiplier: 1.15,
      marginAdjustmentPct: 2,
      fixedCostDelta: 2500,
      differentiationFeature: `${noDeliveryCompetitors} of ${compCount || 4} nearby shops DO NOT offer doorstep delivery`,
      competitorsOffering: Math.max(0, compCount - noDeliveryCompetitors),
      validationRequirement: 'Survey 15 village households on willingness to pay ₹10 delivery fee or ₹500 min order'
    },
    {
      id: 'model-subscription',
      title: `${idea.name || 'Store'} + Weekly Household Subscription`,
      subtitle: 'Guaranteed weekly staple & replenishment bundle',
      description: 'Curated weekly grocery or dairy box delivered every Monday morning on a fixed monthly advance payment.',
      capexAddition: 10000,
      customerMultiplier: 1.1,
      avgBillMultiplier: 1.4,
      marginAdjustmentPct: 3,
      fixedCostDelta: 1000,
      differentiationFeature: 'Predictable cash flow with zero competition offering prepaid monthly subscriptions',
      competitorsOffering: 0,
      validationRequirement: 'Sign up 10 pilot families for a 2-week trial replenishment bundle'
    },
    {
      id: 'model-value-add',
      title: `${idea.name || 'Store'} + Value-Added Processing`,
      subtitle: 'On-site sorting, packaging, and custom preparation',
      description: 'Cleaned, graded, packaged local produce with branded paper packaging, commanding 15-20% higher margin.',
      capexAddition: 35000,
      customerMultiplier: 1.15,
      avgBillMultiplier: 1.3,
      marginAdjustmentPct: 6,
      fixedCostDelta: 3000,
      differentiationFeature: 'High-trust hygienic sealed packs appealing to health-conscious rural households',
      competitorsOffering: 1,
      validationRequirement: 'Produce sample 20 trial packs and test consumer taste & willingness to pay'
    }
  ];
}

// ===================================================
// INNOVATION #8: SKILL-TO-BUSINESS MAPPINGS
// ===================================================
export const SKILL_TO_BUSINESS_MAPPINGS: SkillToBusinessModel[] = [
  {
    skillId: 'dairy',
    skillName: 'Dairy, Cattle & Animal Husbandry',
    iconName: 'Milk',
    models: [
      {
        id: 'dairy-collection',
        name: 'Chilled Milk Collection & Value-Added Paneer/Curd Unit',
        projectCostMin: 150000,
        projectCostMax: 400000,
        expectedMargin: '25% - 35%',
        dailyCustomersRange: '30 - 60 households',
        observedCompetition: 'Moderate',
        observedGaps: 'Bulk milk sold to middlemen at low prices; villagers crave pure fresh ghee/paneer.',
        validationStep: 'Tie up supply with 5 local dairy farmers and 20 residential households.'
      },
      {
        id: 'goat-poultry',
        name: 'Country Chicken (Desi Murghi) & Semi-Intensive Goat Rearing',
        projectCostMin: 100000,
        projectCostMax: 300000,
        expectedMargin: '35% - 50%',
        dailyCustomersRange: 'Weekly wholesale / festive peaks',
        observedCompetition: 'Low',
        observedGaps: 'High premium for authentic native desi chicken over broiler birds.',
        validationStep: 'Verify feed availability and connect with local Sunday shandy meat vendors.'
      }
    ]
  },
  {
    skillId: 'cooking',
    skillName: 'Food Preparation, Snacks & Cooking',
    iconName: 'Utensils',
    models: [
      {
        id: 'morning-tiffin',
        name: 'Morning Bus-Stop Tiffin Center & Fresh Millet Idli Hub',
        projectCostMin: 80000,
        projectCostMax: 200000,
        expectedMargin: '40% - 50%',
        dailyCustomersRange: '60 - 120 passengers/day',
        observedCompetition: 'Moderate',
        observedGaps: 'Existing stalls use stale oil and open late after the 7:00 AM school/factory bus leaves.',
        validationStep: 'Trial a 3-day 6:30 AM pop-up stall near the primary bus stop.'
      },
      {
        id: 'traditional-snacks',
        name: 'Traditional Roasted Snacks, Sweets & Festive Murukku Unit',
        projectCostMin: 50000,
        projectCostMax: 150000,
        expectedMargin: '30% - 45%',
        dailyCustomersRange: 'Retail + 10 tea stall wholesale drops',
        observedCompetition: 'Low',
        observedGaps: 'Tea shops currently buy stale packaged chips transported from 40km away.',
        validationStep: 'Supply 5 tea shops with trial consignment packets for 7 days.'
      }
    ]
  },
  {
    skillId: 'tailoring',
    skillName: 'Tailoring, Garments & Embroidery',
    iconName: 'Scissors',
    models: [
      {
        id: 'womens-boutique',
        name: 'Custom Blouse & Uniform Stitching with Home Pickup',
        projectCostMin: 60000,
        projectCostMax: 180000,
        expectedMargin: '50% - 65%',
        dailyCustomersRange: '4 - 8 orders/day',
        observedCompetition: 'Moderate',
        observedGaps: 'Village women travel 15km to taluk town for modern designer neck cuts.',
        validationStep: 'Stitch sample designs and distribute WhatsApp lookbook to 25 local families.'
      },
      {
        id: 'school-uniform-bulk',
        name: 'Institutional School & Factory Uniform Batch Unit',
        projectCostMin: 120000,
        projectCostMax: 350000,
        expectedMargin: '30% - 40%',
        dailyCustomersRange: 'Batch contracts',
        observedCompetition: 'Low',
        observedGaps: 'Local panchayat and private nursery schools struggle with delayed town suppliers.',
        validationStep: 'Pitch sample uniform sets to 3 local school principals before school reopening.'
      }
    ]
  },
  {
    skillId: 'repair',
    skillName: 'Mobile, Electrical & Motor Repair',
    iconName: 'Wrench',
    models: [
      {
        id: 'smartphone-services',
        name: 'Multi-Brand Mobile Display, Battery & Solar Inverter Hub',
        projectCostMin: 90000,
        projectCostMax: 250000,
        expectedMargin: '45% - 60%',
        dailyCustomersRange: '15 - 30 visits/day',
        observedCompetition: 'Moderate',
        observedGaps: 'Town repairers charge high rates and keep phones for 4 days; fast same-day fix is missing.',
        validationStep: 'Stock fast-moving screens and offer 2-hour turnaround for common models.'
      },
      {
        id: 'submersible-motor',
        name: 'Agricultural Pump, Starter & Submersible Rewinding Hub',
        projectCostMin: 100000,
        projectCostMax: 280000,
        expectedMargin: '40% - 55%',
        dailyCustomersRange: 'Agricultural seasonal peaks',
        observedCompetition: 'Low',
        observedGaps: 'Farmers lose standing crops when pump motor burns during irrigation rotations.',
        validationStep: 'Connect with 15 borehole owners and offer on-field inspection.'
      }
    ]
  },
  {
    skillId: 'farming',
    skillName: 'Organic Inputs, Seedlings & Agro-Retail',
    iconName: 'Sprout',
    models: [
      {
        id: 'shade-net-nursery',
        name: 'Shade-Net Vegetable Seedling & Bio-Fertilizer Nursery',
        projectCostMin: 120000,
        projectCostMax: 350000,
        expectedMargin: '40% - 60%',
        dailyCustomersRange: 'Seasonal farmer batches',
        observedCompetition: 'Low',
        observedGaps: 'Farmers suffer 30% germination failure from open-field seeds; pro-tray seedlings reduce risk.',
        validationStep: 'Pre-book 5,000 tomato/chilli seedlings with 10 neighboring farmers.'
      }
    ]
  },
  {
    skillId: 'digital',
    skillName: 'Digital Services, Xerox & Common Service Hub',
    iconName: 'Computer',
    models: [
      {
        id: 'panchayat-csc-fintech',
        name: 'Govt e-Services (Pattah/Chitta), Micro-ATM & Aadhaar Pay Desk',
        projectCostMin: 75000,
        projectCostMax: 180000,
        expectedMargin: '60% - 75%',
        dailyCustomersRange: '40 - 80 villagers/day',
        observedCompetition: 'Low',
        observedGaps: 'Senior citizens travel 12km to nearest town bank to withdraw monthly old-age pension.',
        validationStep: 'Verify broadband stability and apply for authorized Banking Correspondent micro-ATM.'
      }
    ]
  }
];

// ===================================================
// INNOVATION #15 & #17: ASSUMPTION REGISTER & KEY DRIVERS
// ===================================================
export function getAssumptionRegister(
  idea: BusinessIdea,
  profile: EntrepreneurProfile
): AssumptionItem[] {
  const loanAmount = profile.requiredLoan || (profile.projectCost - profile.ownCapital);

  return [
    {
      id: 'asm-footfall',
      label: 'Daily Paying Customers',
      value: `${idea.dailyCustomers || 40} customers/day`,
      source: 'USER_PROVIDED',
      confidence: 'Medium',
      validationStatus: 'Needs Validation',
      howToValidate: 'Conduct 7-day manual head-count observation at target shop location (morning & evening rush).',
      sensitivityRank: 1,
      impactDescription: 'Highest sensitivity: A 20% drop reduces estimated surplus by ~42%.'
    },
    {
      id: 'asm-bill',
      label: 'Average Transaction Bill',
      value: `₹${idea.avgBill || 150} per customer`,
      source: 'USER_PROVIDED',
      confidence: 'Medium',
      validationStatus: 'Needs Validation',
      howToValidate: 'Review actual receipt tickets from 3 existing neighboring retail shops.',
      sensitivityRank: 2,
      impactDescription: 'A ₹25 drop in bill size lowers monthly revenue by ₹26,000.'
    },
    {
      id: 'asm-margin',
      label: 'Gross Profit Margin',
      value: `${Math.round((1 - (idea.variableCostRatio || 0.6)) * 100)}% gross margin`,
      source: 'ESTIMATED',
      confidence: 'Medium',
      validationStatus: 'Needs Validation',
      howToValidate: 'Verify wholesale purchase invoices against prevailing village retail sale prices.',
      sensitivityRank: 3,
      impactDescription: 'Directly dictates break-even volume needed each month.'
    },
    {
      id: 'asm-fixed-cost',
      label: 'Monthly Fixed Overheads (Rent, Power, Labor)',
      value: `₹${(idea.fixedCosts || 14000).toLocaleString('en-IN')}/mo`,
      source: 'USER_PROVIDED',
      confidence: 'High',
      validationStatus: 'Validated',
      howToValidate: 'Signed lease agreement quotation and commercial electricity tariff rate.',
      sensitivityRank: 4,
      impactDescription: 'Must be paid regardless of customer footfall; establishes floor expense.'
    },
    {
      id: 'asm-loan',
      label: 'Bank Loan Obligation',
      value: `₹${loanAmount.toLocaleString('en-IN')} (approx EMI: ₹${calculateEMI(loanAmount, 10.5, 5).toLocaleString('en-IN')})`,
      source: 'VERIFIED',
      confidence: 'High',
      validationStatus: 'Validated',
      howToValidate: 'Official scheme interest rate guidelines (PMEGP / Mudra / CGTMSE).',
      sensitivityRank: 5,
      impactDescription: 'Fixed statutory liability for 60 months.'
    }
  ];
}

// ===================================================
// INNOVATION #10: APPLICATION READINESS 10-POINT ENGINE
// ===================================================
export function calculateApplicationReadiness(
  profile: EntrepreneurProfile,
  idea: BusinessIdea,
  competitors: CompetitorShop[],
  pilotMilestones: PilotMilestone[]
): {
  score: number;
  total: number;
  percentage: number;
  items: ApplicationReadinessItem[];
} {
  const completedMilestones = pilotMilestones.filter(m => m.completed).length;

  const items: ApplicationReadinessItem[] = [
    {
      id: 'chk-profile',
      title: 'Entrepreneur Profile & Demographic Record',
      category: 'Identity',
      status: (profile.name && profile.village && profile.age) ? 'complete' : 'incomplete',
      whatIsMissing: 'Aadhaar name, village name, and age verification details.',
      whyItMatters: 'Bank officials require demographic proof to determine priority category subsidy.',
      howToComplete: 'Complete Step 1 of Profile Wizard.',
      targetTab: 'profile'
    },
    {
      id: 'chk-business',
      title: 'Defined Business Model & Category',
      category: 'Business',
      status: (idea.name && idea.category) ? 'complete' : 'incomplete',
      whatIsMissing: 'Clear activity description and operational classification.',
      whyItMatters: 'Government schemes classify eligibility strictly by Manufacturing / Service / Trading activity.',
      howToComplete: 'Specify your core enterprise activity in Profile Wizard.',
      targetTab: 'profile'
    },
    {
      id: 'chk-project-cost',
      title: 'Project Cost Breakdown (Capex & Working Capital)',
      category: 'Finance',
      status: profile.projectCost > 0 ? 'complete' : 'incomplete',
      whatIsMissing: 'Itemized machinery, furniture, and opening stock expenditure estimate.',
      whyItMatters: 'Banks reject blanket loan requests that do not specify equipment quotations.',
      howToComplete: 'Input realistic project cost in the Financial step.',
      targetTab: 'profile'
    },
    {
      id: 'chk-own-capital',
      title: 'Promoter Equity (Own Contribution)',
      category: 'Finance',
      status: profile.ownCapital > 0 ? 'complete' : 'incomplete',
      whatIsMissing: 'Evidence of 5% - 15% own investment ready in bank passbook.',
      whyItMatters: 'Mandatory statutory requirement under Mudra, PMEGP, and NEEDS schemes.',
      howToComplete: 'Set your verifiable cash contribution in Profile or GramTwin.',
      targetTab: 'profile'
    },
    {
      id: 'chk-loan-amount',
      title: 'Formal Loan Requirement Calculation',
      category: 'Finance',
      status: (profile.projectCost - profile.ownCapital) > 0 ? 'complete' : 'incomplete',
      whatIsMissing: 'Clear calculation of Project Cost minus Own Contribution.',
      whyItMatters: 'Determines the scheme bracket (Shishu, Kishore, Tarun, or PMEGP).',
      howToComplete: 'Review the auto-calculated loan gap in Schemes tab.',
      targetTab: 'schemes'
    },
    {
      id: 'chk-scheme-match',
      title: 'Scheme Eligibility & Subsidy Verification',
      category: 'Schemes',
      status: 'complete',
      whatIsMissing: 'Selected scheme rules and subsidy criteria.',
      whyItMatters: 'Subsidies between 15% and 35% reduce repayment stress significantly.',
      howToComplete: 'Review matched schemes in Government Schemes tab.',
      targetTab: 'schemes'
    },
    {
      id: 'chk-market-radar',
      title: 'Local Competitor & Market Survey (Min 3 shops)',
      category: 'Market',
      status: competitors.length >= 3 ? 'complete' : (competitors.length > 0 ? 'needs_validation' : 'incomplete'),
      whatIsMissing: `Currently recorded ${competitors.length} of recommended 3 nearby businesses.`,
      whyItMatters: 'Proves to the bank field officer that you have assessed local market saturation.',
      howToComplete: 'Add neighboring shop observations in Opportunity Radar tab.',
      targetTab: 'market'
    },
    {
      id: 'chk-simulation',
      title: 'GramTwin™ Digital Simulation & Cash Flow',
      category: 'Simulation',
      status: (idea.dailyCustomers > 0 && idea.avgBill > 0) ? 'complete' : 'incomplete',
      whatIsMissing: 'Customer footfall, average bill, and variable margin estimates.',
      whyItMatters: 'Demonstrates debt-service coverage ratio (DSCR) and break-even sustainability.',
      howToComplete: 'Run the digital twin simulation in GramTwin tab.',
      targetTab: 'gramtwin'
    },
    {
      id: 'chk-stress-test',
      title: 'Loan Stress Lab & Downside Testing',
      category: 'Risk',
      status: 'complete',
      whatIsMissing: 'Examination of 20% demand reduction and cost surge.',
      whyItMatters: 'Ensures the entrepreneur will not default during lean seasonal periods.',
      howToComplete: 'Inspect pressure ratings in Loan Stress Lab tab.',
      targetTab: 'stresstest'
    },
    {
      id: 'chk-pilot',
      title: '30-Day Pre-Loan Validation Trial',
      category: 'Validation',
      status: completedMilestones >= 2 ? 'complete' : (completedMilestones > 0 ? 'needs_validation' : 'incomplete'),
      whatIsMissing: `Completed ${completedMilestones} of 4 validation weeks.`,
      whyItMatters: 'Turns mere assumptions into observed customer willingness to pay.',
      howToComplete: 'Log customer interviews and sample sales in 30-Day Pilot tab.',
      targetTab: 'pilot'
    }
  ];

  const completeCount = items.filter(i => i.status === 'complete').length;
  const score = completeCount;
  const total = items.length;
  const percentage = Math.round((score / total) * 100);

  return { score, total, percentage, items };
}

// ===================================================
// INNOVATION #35: "START SMALL" SCENARIOS
// ===================================================
export function getStartSmallTiers(
  idea: BusinessIdea,
  profile: EntrepreneurProfile
): StartSmallTier[] {
  const fullCost = profile.projectCost || 600000;
  const fullOwn = profile.ownCapital || 100000;
  const fullLoan = Math.max(0, fullCost - fullOwn);

  const reducedCost = Math.round(fullCost * 0.6);
  const reducedOwn = Math.min(fullOwn, Math.round(reducedCost * 0.25));
  const reducedLoan = Math.max(0, reducedCost - reducedOwn);

  const pilotCost = Math.round(Math.min(fullCost * 0.25, 150000));
  const pilotOwn = Math.min(fullOwn, pilotCost);
  const pilotLoan = Math.max(0, pilotCost - pilotOwn);

  const basePrice = idea.avgBill || 150;
  const margin = 1 - (idea.variableCostRatio || 0.6);

  return [
    {
      id: 'pilot',
      title: 'Phase 0: Micro-Pilot Trial',
      subtitle: 'Zero or minimal debt; test willingness to pay',
      projectCost: pilotCost,
      ownCapital: pilotOwn,
      loanAmount: pilotLoan,
      monthlyEMI: calculateEMI(pilotLoan, 10.5, 3),
      monthlyRevenue: Math.round((idea.dailyCustomers || 40) * 0.4 * basePrice * 20),
      monthlySurplus: Math.round(((idea.dailyCustomers || 40) * 0.4 * basePrice * 20 * margin) - 4000),
      breakEvenCustomers: 8,
      riskProfile: 'Negligible Financial Risk',
      validationFocus: 'Validates real customer demand and repeat buying without locking bank capital.'
    },
    {
      id: 'small',
      title: 'Phase 1: Reduced / Staged Enterprise',
      subtitle: 'Prudent core equipment without costly decor',
      projectCost: reducedCost,
      ownCapital: reducedOwn,
      loanAmount: reducedLoan,
      monthlyEMI: calculateEMI(reducedLoan, 10.5, 5),
      monthlyRevenue: Math.round((idea.dailyCustomers || 40) * 0.8 * basePrice * 26),
      monthlySurplus: Math.round(((idea.dailyCustomers || 40) * 0.8 * basePrice * 26 * margin) - (idea.fixedCosts || 14000) * 0.75 - calculateEMI(reducedLoan, 10.5, 5)),
      breakEvenCustomers: 22,
      riskProfile: 'Balanced & Manageable',
      validationFocus: 'Establishes regular business presence while maintaining comfortable safety buffer.'
    },
    {
      id: 'full',
      title: 'Phase 2: Full Planned Project',
      subtitle: 'Complete vision with maximum capacity',
      projectCost: fullCost,
      ownCapital: fullOwn,
      loanAmount: fullLoan,
      monthlyEMI: calculateEMI(fullLoan, 10.5, 5),
      monthlyRevenue: Math.round((idea.dailyCustomers || 40) * basePrice * (idea.operatingDays || 26)),
      monthlySurplus: Math.round(((idea.dailyCustomers || 40) * basePrice * (idea.operatingDays || 26) * margin) - (idea.fixedCosts || 14000) - calculateEMI(fullLoan, 10.5, 5)),
      breakEvenCustomers: 34,
      riskProfile: 'Highest Capital Commitment',
      validationFocus: 'Recommended only AFTER Phase 0 or Phase 1 achieves consistent monthly break-even.'
    }
  ];
}

// ===================================================
// INNOVATION #19 & #20: POST-LOAN HEALTH SAMPLE DATA
// ===================================================
export const INITIAL_POST_LOAN_RECORDS: PostLoanRecord[] = [
  {
    id: 'm1',
    month: 'Month 1 (Launch)',
    revenue: 92000,
    expenses: 56000,
    customers: 44,
    avgBill: 160,
    emi: 8700,
    netSurplus: 27300,
    recordedAt: '2026-06-30'
  },
  {
    id: 'm2',
    month: 'Month 2',
    revenue: 84000,
    expenses: 57500,
    customers: 40,
    avgBill: 155,
    emi: 8700,
    netSurplus: 17800,
    recordedAt: '2026-07-31'
  },
  {
    id: 'm3',
    month: 'Month 3 (Recent)',
    revenue: 71000,
    expenses: 59000,
    customers: 34,
    avgBill: 148,
    emi: 8700,
    netSurplus: 3300,
    recordedAt: '2026-08-31'
  }
];
