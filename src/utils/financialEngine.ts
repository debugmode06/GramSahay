import { GramTwinSimulation, WhatIfComparison } from '../types';

/**
 * Calculates Reducing Balance Monthly EMI (Equated Monthly Installment)
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal: number, annualInterestRate: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  
  const totalMonths = Math.max(1, Math.round(tenureYears * 12));
  
  // Handle 0% interest loans (e.g. interest-free government micro-schemes)
  if (annualInterestRate <= 0) {
    return Math.round(principal / totalMonths);
  }
  
  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  
  if (factor === 1) return Math.round(principal / totalMonths);
  
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates Total Repayment and Interest over the entire tenure
 */
export function calculateRepaymentSummary(principal: number, annualInterestRate: number, tenureYears: number) {
  const emi = calculateEMI(principal, annualInterestRate, tenureYears);
  const totalMonths = Math.max(1, Math.round(tenureYears * 12));
  const totalRepayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);
  
  return {
    emi,
    totalMonths,
    totalRepayment,
    totalInterest,
    principal
  };
}

/**
 * Formats numbers into standard Indian Currency Notation: ₹1,00,000 / ₹5,00,000
 */
export function formatIndianCurrency(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const isNegative = val < 0;
  const absVal = Math.abs(Math.round(val));
  
  const str = absVal.toString();
  if (str.length <= 3) {
    return (isNegative ? '-₹' : '₹') + str;
  }
  
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return (isNegative ? '-₹' : '₹') + formattedOther + ',' + lastThree;
}

/**
 * Runs full deterministic GramTwin™ Simulation
 */
export function runGramTwinSimulation(inputs: {
  dailyCustomers: number;
  avgBill: number;
  operatingDays: number;
  variableMarginPercent: number; // e.g. 60% of revenue goes to direct goods/materials
  fixedCosts: number; // shop rent, electricity, fixed helper wage
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
}): GramTwinSimulation {
  const {
    dailyCustomers = 45,
    avgBill = 120,
    operatingDays = 26,
    variableMarginPercent = 55,
    fixedCosts = 14000,
    loanAmount = 300000,
    interestRate = 9.5,
    tenureYears = 5
  } = inputs;

  const monthlyRevenue = Math.round(dailyCustomers * avgBill * operatingDays);
  const monthlyVariableCosts = Math.round((monthlyRevenue * variableMarginPercent) / 100);
  const monthlyOperatingCosts = monthlyVariableCosts + fixedCosts;
  const monthlyEMI = calculateEMI(loanAmount, interestRate, tenureYears);
  const monthlySurplus = monthlyRevenue - monthlyOperatingCosts - monthlyEMI;

  // Contribution margin per customer
  const grossContributionPerCustomer = avgBill * (1 - variableMarginPercent / 100);
  const totalMonthlyFixedObligations = fixedCosts + monthlyEMI;
  
  let breakEvenCustomersPerDay = 0;
  if (grossContributionPerCustomer > 0 && operatingDays > 0) {
    breakEvenCustomersPerDay = Math.ceil(totalMonthlyFixedObligations / (grossContributionPerCustomer * operatingDays));
  }

  const safetyMarginPercent = dailyCustomers > 0 
    ? Math.round(((dailyCustomers - breakEvenCustomersPerDay) / dailyCustomers) * 100) 
    : 0;

  return {
    dailyCustomers,
    avgBill,
    operatingDays,
    variableMarginPercent,
    fixedCosts,
    loanAmount,
    interestRate,
    tenureYears,
    monthlyRevenue,
    monthlyVariableCosts,
    monthlyOperatingCosts,
    monthlyEMI,
    monthlySurplus,
    breakEvenCustomersPerDay,
    safetyMarginPercent
  };
}

/**
 * Runs What-If scenario against base simulation
 */
export function runWhatIfScenario(
  base: GramTwinSimulation,
  name: string,
  demandMultiplier: number = 1.0, // e.g. 0.8 for -20%
  costMultiplier: number = 1.0     // e.g. 1.1 for +10%
): WhatIfComparison {
  const newCustomers = Math.max(5, Math.round(base.dailyCustomers * demandMultiplier));
  const newRevenue = Math.round(newCustomers * base.avgBill * base.operatingDays);
  const newVariableCosts = Math.round((newRevenue * base.variableMarginPercent) / 100);
  const newFixedCosts = Math.round(base.fixedCosts * costMultiplier);
  const newOperatingExpenses = newVariableCosts + newFixedCosts;
  const newSurplus = newRevenue - newOperatingExpenses - base.monthlyEMI;

  let pressure: 'manageable' | 'tight' | 'highPressure' = 'manageable';
  if (newSurplus < base.monthlyEMI * 0.5) {
    pressure = 'highPressure';
  } else if (newSurplus < base.monthlyEMI * 1.2) {
    pressure = 'tight';
  }

  return {
    name,
    customersPerDay: newCustomers,
    fixedCosts: newFixedCosts,
    monthlyRevenue: newRevenue,
    monthlyExpenses: newOperatingExpenses,
    monthlyEMI: base.monthlyEMI,
    monthlySurplus: newSurplus,
    pressure
  };
}
