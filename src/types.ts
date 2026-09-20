export type Language = 'en' | 'ta' | 'hi';
export type TabType = 'dashboard' | 'schemes' | 'gramtwin' | 'market' | 'pilot' | 'dossier' | 'assistant' | 'profile' | 'admin' | string;

export interface EntrepreneurProfile {
  id: string;
  name: string;
  age: number;
  village: string;
  block: string;
  district: string;
  state: string;
  locationType: 'rural' | 'semiUrban';
  status: 'firstTime' | 'existing';
  businessType: string;
  category: string;
  skills: string;
  ownCapital: number;
  projectCost: number;
  requiredLoan: number;
  specialCategory?: 'general' | 'scSt' | 'obc' | 'women' | 'minority' | 'exServicemen';
  completedSteps: number;
  updatedAt: string;
}

export interface BusinessIdea {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyCustomers: number;
  avgBill: number;
  operatingDays: number;
  variableCostRatio: number; // e.g. 0.6 for 60%
  fixedCosts: number;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyOperatingCosts: number;
  estimatedGrossSurplus: number;
  updatedAt: string;
}

export interface Scheme {
  id: string;
  name: string;
  code: string;
  nativeName?: { [key in Language]?: string };
  category: string;
  purpose: string;
  targetBeneficiaries: string;
  projectCostMin: number;
  projectCostMax: number;
  maxLoanLimit: number;
  ownContributionPercent: number; // e.g. 5-10%
  interestRateMin: number;
  interestRateMax: number;
  tenureYearsMax: number;
  moratoriumMonths: number;
  subsidyPercent: number; // e.g. 15-35%
  collateralRequired: boolean;
  collateralDescription: string;
  eligibleCategories: string[];
  requiredDocuments: string[];
  officialWebsite: string;
  officialApplicationUrl: string;
  sourceAuthority: string;
  lastVerifiedDate: string;
  verificationStatus: 'verified' | 'needsReview' | 'demo';
  keyBenefits: string[];
  caveats: string[];
}

export type EligibilityStatus = 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'INSUFFICIENT_INFORMATION';

export interface SchemeEligibilityResult {
  schemeId: string;
  status: EligibilityStatus;
  fitScore: number; // 0-100 deterministic
  financialFit: 'High' | 'Medium' | 'Low';
  businessFit: 'High' | 'Medium' | 'Low';
  matchedConditions: string[];
  failedConditions: string[];
  unknownConditions: string[];
  explanation: string;
  verificationRequired: string[];
}

export interface GramTwinSimulation {
  dailyCustomers: number;
  avgBill: number;
  operatingDays: number;
  variableMarginPercent: number;
  fixedCosts: number;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  
  // Output calculations
  monthlyRevenue: number;
  monthlyVariableCosts: number;
  monthlyOperatingCosts: number;
  monthlyEMI: number;
  monthlySurplus: number;
  breakEvenCustomersPerDay: number;
  safetyMarginPercent: number;
}

export interface WhatIfComparison {
  name: string;
  customersPerDay: number;
  fixedCosts: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyEMI: number;
  monthlySurplus: number;
  pressure: 'manageable' | 'tight' | 'highPressure';
}

export interface CompetitorShop {
  id: string;
  name: string;
  businessType: string;
  distance: string;
  approxDailyCustomers: number;
  priceLevel: 'Budget' | 'Moderate' | 'Premium';
  openingHours: string;
  hasHomeDelivery: boolean;
  hasDigitalPay: boolean;
  observedGaps: string;
  confidence: 'verified' | 'observed' | 'estimated' | 'unknown';
  notes?: string;
  recordedAt: string;
}

export interface PilotMilestone {
  id: string;
  week: 1 | 2 | 3 | 4;
  titleKey: string;
  descriptionKey: string;
  targetCount: number;
  achievedCount: number;
  completed: boolean;
  userObservations: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  timestamp: string;
  details: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  structuredResponse?: {
    answer: string;
    evidence: string[];
    assumptions: string[];
    verification: string[];
    nextStep: string;
  };
  timestamp: string;
}

// ==========================================
// INNOVATION & DIFFERENTIATION ARCHITECTURE
// ==========================================

export type EvidenceSource = 
  | 'VERIFIED' 
  | 'USER_PROVIDED' 
  | 'USER_OBSERVATION' 
  | 'ESTIMATED' 
  | 'AI_INFERENCE' 
  | 'UNKNOWN' 
  | 'REQUIRES_VERIFICATION';

export interface StressScenario {
  id: string;
  name: string;
  category: 'demand' | 'expense' | 'price' | 'capital' | 'emergency';
  demandChangePct: number; // e.g. -20 for -20%
  expenseChangePct: number; // e.g. +10 for +10%
  priceChangePct: number;
  emergencyMonthlyCost: number;
  monthlyRevenue: number;
  monthlyOperatingCosts: number;
  monthlyEMI: number;
  postEmiSurplus: number;
  breakEvenCustomersPerDay: number;
  pressure: 'Manageable' | 'Tight' | 'Higher pressure' | 'Requires validation';
  diagnosis: string;
}

export interface WhyNotBorrowItem {
  id: string;
  concern: string;
  whyItMatters: string;
  whatToValidate: string;
  suggestedAction: string;
  severity: 'low' | 'medium' | 'high';
  ruleTriggered: string;
}

export interface BusinessVariation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  capexAddition: number;
  customerMultiplier: number;
  avgBillMultiplier: number;
  marginAdjustmentPct: number;
  fixedCostDelta: number;
  differentiationFeature: string;
  competitorsOffering: number;
  validationRequirement: string;
}

export interface SkillToBusinessModel {
  skillId: string;
  skillName: string;
  iconName: string;
  models: {
    id: string;
    name: string;
    projectCostMin: number;
    projectCostMax: number;
    expectedMargin: string;
    dailyCustomersRange: string;
    observedCompetition: 'Low' | 'Moderate' | 'High';
    observedGaps: string;
    validationStep: string;
  }[];
}

export interface AssumptionItem {
  id: string;
  label: string;
  value: string;
  source: EvidenceSource;
  confidence: 'High' | 'Medium' | 'Low';
  validationStatus: 'Validated' | 'Needs Validation' | 'Unverified';
  howToValidate: string;
  sensitivityRank: number; // 1 = highest impact on surplus
  impactDescription: string;
}

export interface ApplicationReadinessItem {
  id: string;
  title: string;
  category: string;
  status: 'complete' | 'incomplete' | 'needs_validation';
  whatIsMissing: string;
  whyItMatters: string;
  howToComplete: string;
  targetTab: string;
}

export interface PostLoanRecord {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  customers: number;
  avgBill: number;
  emi: number;
  netSurplus: number;
  recordedAt: string;
}

export interface StartSmallTier {
  id: 'pilot' | 'small' | 'full';
  title: string;
  subtitle: string;
  projectCost: number;
  ownCapital: number;
  loanAmount: number;
  monthlyEMI: number;
  monthlyRevenue: number;
  monthlySurplus: number;
  breakEvenCustomers: number;
  riskProfile: string;
  validationFocus: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  isCustom?: boolean;
  customersPerDay: number;
  avgBill: number;
  operatingDays: number;
  marginPercent: number;
  fixedCosts: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  monthlyEMI: number;
  monthlySurplus: number;
  breakEven: number;
  createdAt: string;
}
