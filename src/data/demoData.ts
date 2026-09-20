import { EntrepreneurProfile, BusinessIdea, CompetitorShop, PilotMilestone, AuditLogItem } from '../types';

export const DEMO_PROFILE: EntrepreneurProfile = {
  id: 'ent_demo_01',
  name: 'Muthu Kumar (முத்து குமார்)',
  age: 29,
  village: 'Melur Village (மேலூர்)',
  block: 'Melur Taluk',
  district: 'Madurai (மதுரை)',
  state: 'Tamil Nadu (தமிழ்நாடு)',
  locationType: 'rural',
  status: 'firstTime',
  businessType: 'Rural Dairy Products & Chilled Milk Counter',
  category: 'Dairy',
  skills: '4 years of family dairy cattle management, completed 1-week RSETI dairy entrepreneurship workshop.',
  ownCapital: 100000, // ₹1 Lakh
  projectCost: 500000, // ₹5 Lakhs
  requiredLoan: 400000, // ₹4 Lakhs
  specialCategory: 'obc',
  completedSteps: 6,
  updatedAt: new Date().toISOString()
};

export const DEMO_BUSINESS_IDEA: BusinessIdea = {
  id: 'biz_demo_01',
  name: 'Melur Fresh Dairy & Sweet Curd Processing',
  category: 'Dairy',
  description: 'Procuring fresh morning milk from 12 local farmers, chilling it with stainless bulk milk cooler, and selling pure milk, butter, ghee, and fresh paneer directly to village families and roadside commuters.',
  dailyCustomers: 50,
  avgBill: 140,
  operatingDays: 28,
  variableCostRatio: 0.55, // 55% cost for raw milk procurement
  fixedCosts: 12000, // shop rent ₹3,500, electricity for chilling ₹4,500, transport/misc ₹4,000
  estimatedMonthlyRevenue: 196000, // 50 * 140 * 28 = ₹1,96,000
  estimatedMonthlyOperatingCosts: 119800, // (196000 * 0.55) + 12000 = ₹1,19,800
  estimatedGrossSurplus: 76200, // ₹76,200 before EMI
  updatedAt: new Date().toISOString()
};

export const DEMO_COMPETITORS: CompetitorShop[] = [
  {
    id: 'comp_01',
    name: 'Lakshmi General Provisions',
    businessType: 'Kirana & Packaged Milk Sachet',
    distance: '150 meters (Main Bazaar)',
    approxDailyCustomers: 70,
    priceLevel: 'Moderate',
    openingHours: '7:30 AM - 9:00 PM',
    hasHomeDelivery: false,
    hasDigitalPay: true,
    observedGaps: 'Only sells commercial factory pouch milk (2 days old). No fresh curd or paneer available.',
    confidence: 'observed',
    notes: 'Busy evening crowd buying snacks and loose grains.',
    recordedAt: '2026-03-01'
  },
  {
    id: 'comp_02',
    name: 'Village Cooperative Society Milk Booth',
    businessType: 'Society Milk Collection & Tea Counter',
    distance: '400 meters (Near Bus Stop)',
    approxDailyCustomers: 90,
    priceLevel: 'Budget',
    openingHours: '6:00 AM - 10:00 AM only',
    hasHomeDelivery: false,
    hasDigitalPay: false,
    observedGaps: 'Shuts down completely at 10 AM. No afternoon or evening sales. Long queue and no seating/digital pay.',
    confidence: 'verified',
    notes: 'Farmers drop milk in early morning. Villagers complain about strict morning-only timings.',
    recordedAt: '2026-03-03'
  },
  {
    id: 'comp_03',
    name: 'Kumar Sweet Stall & Bakery',
    businessType: 'Tea & Snacks',
    distance: '300 meters',
    approxDailyCustomers: 120,
    priceLevel: 'Moderate',
    openingHours: '6:30 AM - 9:30 PM',
    hasHomeDelivery: false,
    hasDigitalPay: true,
    observedGaps: 'Buys paneer from city distributor 25 km away at high cost; expresses interest in buying fresh local paneer.',
    confidence: 'verified',
    notes: 'Potential B2B regular commercial buyer for 5 kg paneer daily.',
    recordedAt: '2026-03-05'
  }
];

export const DEMO_PILOT_MILESTONES: PilotMilestone[] = [
  {
    id: 'p_01',
    week: 1,
    titleKey: 'pilot.week1Title',
    descriptionKey: 'pilot.week1Desc',
    targetCount: 25,
    achievedCount: 28,
    completed: true,
    userObservations: 'Interviewed 28 households in Melur East Street. 22 expressed strong preference for fresh morning non-packaged cow milk.'
  },
  {
    id: 'p_02',
    week: 2,
    titleKey: 'pilot.week2Title',
    descriptionKey: 'pilot.week2Desc',
    targetCount: 10,
    achievedCount: 12,
    completed: true,
    userObservations: 'Distributed 12 test samples of fresh curd and paneer. 10 families gave high rating and paid advance for weekend delivery.'
  },
  {
    id: 'p_03',
    week: 3,
    titleKey: 'pilot.week3Title',
    descriptionKey: 'pilot.week3Desc',
    targetCount: 30,
    achievedCount: 24,
    completed: false,
    userObservations: 'Running mini-trial from family cattle surplus. Daily cash revenue recorded: ₹1,800/day with 24 regular buyers.'
  },
  {
    id: 'p_04',
    week: 4,
    titleKey: 'pilot.week4Title',
    descriptionKey: 'pilot.week4Desc',
    targetCount: 20,
    achievedCount: 16,
    completed: false,
    userObservations: 'Tracking repeat orders from week 2 and 3 customers.'
  }
];

export const DEMO_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_01',
    action: 'VERIFY_SCHEME',
    entity: 'Scheme',
    entityId: 'pmegp',
    actor: 'Admin_Officer_R1',
    timestamp: '2026-03-01T10:15:00Z',
    details: 'Verified rural subsidy guidelines (35% for Special Category) from KVIC official portal notification.'
  },
  {
    id: 'log_02',
    action: 'UPDATE_PORTAL_LINK',
    entity: 'Scheme',
    entityId: 'mudra-kishore',
    actor: 'Admin_Officer_R1',
    timestamp: '2026-02-15T14:30:00Z',
    details: 'Updated Udyamimitra portal direct integration link and zero-collateral RBI advisory link.'
  },
  {
    id: 'log_03',
    action: 'INSPECT_APPLICATION_DOSSIER',
    entity: 'ApplicationDossier',
    entityId: 'ent_demo_01',
    actor: 'District_Lead_Banker',
    timestamp: '2026-03-08T09:00:00Z',
    details: 'Reviewed GramTwin simulation and 30-day pilot validation notes for Melur Fresh Dairy proposal.'
  }
];
