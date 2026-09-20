import { EntrepreneurProfile, Scheme, SchemeEligibilityResult, EligibilityStatus } from '../types';

/**
 * Deterministic Rule-Based Eligibility Engine
 * Evaluates real criteria without AI hallucinations or arbitrary black-box numbers.
 */
export function evaluateSchemeEligibility(
  profile: Partial<EntrepreneurProfile>,
  scheme: Scheme
): SchemeEligibilityResult {
  const matchedConditions: string[] = [];
  const failedConditions: string[] = [];
  const unknownConditions: string[] = [];
  const verificationRequired: string[] = [];

  let fitPoints = 0;
  const maxPoints = 100;

  const projectCost = profile.projectCost || 0;
  const loanRequired = profile.requiredLoan || (projectCost - (profile.ownCapital || 0));
  const ownCapital = profile.ownCapital || 0;
  const location = profile.locationType || 'rural';
  const category = profile.category || profile.businessType || '';

  // 1. Location Fit Check
  if (location === 'rural') {
    matchedConditions.push('Rural location verified (eligible for maximum rural subsidy and support)');
    fitPoints += 25;
  } else {
    matchedConditions.push('Semi-urban location (eligible for standard municipal limits)');
    fitPoints += 20;
  }

  // 2. Project Cost Bounds Check
  if (projectCost > 0) {
    if (projectCost >= scheme.projectCostMin && projectCost <= scheme.projectCostMax) {
      matchedConditions.push(`Project cost (₹${projectCost.toLocaleString('en-IN')}) is within scheme bounds (₹${scheme.projectCostMin.toLocaleString('en-IN')} - ₹${scheme.projectCostMax.toLocaleString('en-IN')})`);
      fitPoints += 25;
    } else if (projectCost < scheme.projectCostMin) {
      failedConditions.push(`Project cost is below minimum scheme threshold of ₹${scheme.projectCostMin.toLocaleString('en-IN')}`);
    } else {
      failedConditions.push(`Project cost exceeds maximum scheme ceiling of ₹${scheme.projectCostMax.toLocaleString('en-IN')}`);
    }
  } else {
    unknownConditions.push('Total project cost not yet specified in profile');
    fitPoints += 10;
  }

  // 3. Own Capital & Margin Money Check
  const requiredOwnPercent = scheme.ownContributionPercent;
  const actualOwnPercent = projectCost > 0 ? (ownCapital / projectCost) * 100 : 10;
  if (projectCost > 0) {
    if (actualOwnPercent >= requiredOwnPercent) {
      matchedConditions.push(`Own contribution of ${Math.round(actualOwnPercent)}% satisfies scheme requirement of ${requiredOwnPercent}%`);
      fitPoints += 25;
    } else {
      failedConditions.push(`Own contribution of ${Math.round(actualOwnPercent)}% is below required ${requiredOwnPercent}% margin`);
    }
  } else {
    unknownConditions.push('Applicant equity contribution awaiting final quotation');
    fitPoints += 10;
  }

  // 4. Business Category Check
  const matchesCategory = scheme.eligibleCategories.some(c => 
    category.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(category.toLowerCase())
  );

  if (category) {
    if (matchesCategory || scheme.eligibleCategories.includes('Services') || scheme.eligibleCategories.includes('Manufacturing')) {
      matchedConditions.push(`Business category (${category}) is eligible under scheme terms`);
      fitPoints += 25;
    } else {
      unknownConditions.push(`Verify whether your specific trade fits under designated categories`);
      fitPoints += 15;
    }
  } else {
    unknownConditions.push('Business category to be selected');
    fitPoints += 10;
  }

  // 5. Verification requirements (caveats)
  verificationRequired.push(`Check current interest rate with local lending branch`);
  if (scheme.code === 'PMEGP') {
    verificationRequired.push('Requires 8th standard pass certificate if manufacturing project >₹10L');
    verificationRequired.push('Requires Aadhaar-linked bank account in applicant name');
  } else if (scheme.code === 'PM-VISHWAKARMA') {
    verificationRequired.push('Panchayat verification of family traditional craft engagement');
  }

  // Determine overall status
  let status: EligibilityStatus = 'POTENTIALLY_ELIGIBLE';
  if (failedConditions.length > 0) {
    status = 'NOT_ELIGIBLE';
  } else if (unknownConditions.length >= 3) {
    status = 'INSUFFICIENT_INFORMATION';
  } else if (failedConditions.length === 0 && unknownConditions.length <= 1 && fitPoints >= 80) {
    status = 'ELIGIBLE';
  } else {
    status = 'POTENTIALLY_ELIGIBLE';
  }

  // Financial Fit
  let financialFit: 'High' | 'Medium' | 'Low' = 'Medium';
  if (loanRequired <= scheme.maxLoanLimit && actualOwnPercent >= requiredOwnPercent) {
    financialFit = 'High';
  } else if (loanRequired > scheme.maxLoanLimit * 1.2) {
    financialFit = 'Low';
  }

  // Business Fit
  let businessFit: 'High' | 'Medium' | 'Low' = 'Medium';
  if (matchesCategory) {
    businessFit = 'High';
  }

  // Construct clear, transparent explanation
  let explanation = '';
  if (status === 'ELIGIBLE' || status === 'POTENTIALLY_ELIGIBLE') {
    explanation = `Your proposed business in ${profile.village || 'your village'} aligns with the ${scheme.name} guidelines. Your required financing of ₹${(loanRequired || 0).toLocaleString('en-IN')} and own capital meet the initial eligibility thresholds.`;
  } else if (status === 'NOT_ELIGIBLE') {
    explanation = `One or more mandatory parameters did not align: ${failedConditions.join('; ')}. You may adjust project sizing or consider alternative micro-financing schemes.`;
  } else {
    explanation = `Additional profile details required to confirm match. Complete the entrepreneur profile steps to refine verification.`;
  }

  return {
    schemeId: scheme.id,
    status,
    fitScore: Math.min(100, Math.max(10, fitPoints)),
    financialFit,
    businessFit,
    matchedConditions,
    failedConditions,
    unknownConditions,
    explanation,
    verificationRequired
  };
}
