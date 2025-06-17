/**
 * Moteur de calcul Swapeo
 * Calcule les intérêts, frais et totaux selon les règles de la plateforme
 */

export const calculateSwapDetails = (amount, duration, interestRate) => {
  // Calcul des intérêts: (montant * taux * durée) / 12
  const interest =
    Math.round(((amount * interestRate * duration) / 12 / 100) * 100) / 100;

  // Frais plateforme: 1% du montant
  const platformFee = Math.round(amount * 0.01 * 100) / 100;

  // Total à rembourser
  const total = Math.round((amount + interest + platformFee) * 100) / 100;

  return {
    principal: amount,
    interest,
    platformFee,
    total,
    monthlyPayment: Math.round((total / duration) * 100) / 100,
  };
};

export const calculateMonthlyPayment = (total, duration) => {
  return Math.round((total / duration) * 100) / 100;
};

export const calculateAPR = (amount, interest, platformFee, duration) => {
  const totalCost = interest + platformFee;
  const monthlyRate = totalCost / amount / duration;
  const apr = Math.pow(1 + monthlyRate, 12) - 1;
  return Math.round(apr * 10000) / 100; // Percentage with 2 decimals
};

export const calculateRemainingAmount = (
  originalAmount,
  paymentsCompleted,
  totalPayments,
) => {
  const paymentPercentage = paymentsCompleted / totalPayments;
  return Math.round(originalAmount * (1 - paymentPercentage) * 100) / 100;
};

export const calculateLateFees = (amount, daysLate) => {
  // 0.1% per day late, max 10%
  const dailyRate = 0.001;
  const maxRate = 0.1;
  const feeRate = Math.min(dailyRate * daysLate, maxRate);
  return Math.round(amount * feeRate * 100) / 100;
};

export const calculateTrustScore = (user, swapHistory) => {
  let score = 50; // Base score

  // Payment history (40 points max)
  const completedSwaps = swapHistory.filter((s) => s.status === "Terminé");
  const onTimePayments = completedSwaps.filter((s) => !s.wasLate);
  if (completedSwaps.length > 0) {
    score += (onTimePayments.length / completedSwaps.length) * 40;
  }

  // KYC completion (20 points max)
  score += (user.kycStatus / 100) * 20;

  // Account age (10 points max)
  const accountAge = new Date().getFullYear() - parseInt(user.memberSince);
  score += Math.min(accountAge * 2, 10);

  // Volume and activity (30 points max)
  const totalVolume = swapHistory.reduce((sum, s) => sum + s.amount, 0);
  if (totalVolume > 100000) score += 30;
  else if (totalVolume > 50000) score += 20;
  else if (totalVolume > 10000) score += 10;

  return Math.min(Math.round(score), 100);
};

export const calculateMatchingScore = (swap1, swap2, user1, user2) => {
  let score = 0;

  // Amount compatibility (30 points)
  const amountDiff =
    Math.abs(swap1.amount - swap2.amount) /
    Math.max(swap1.amount, swap2.amount);
  score += Math.max(0, 30 * (1 - amountDiff));

  // Duration compatibility (25 points)
  const durationDiff = Math.abs(swap1.duration - swap2.duration);
  score += Math.max(0, 25 * (1 - durationDiff / 12));

  // Interest rate compatibility (25 points)
  const rateDiff = Math.abs(swap1.interestRate - swap2.interestRate);
  score += Math.max(0, 25 * (1 - rateDiff / 5));

  // Trust score compatibility (20 points)
  const avgTrustScore = (user1.trustScore + user2.trustScore) / 2;
  score += (avgTrustScore / 100) * 20;

  return Math.round(score);
};

export const calculatePlatformFees = (amount) => {
  return {
    swapFee: Math.round(amount * 0.01 * 100) / 100, // 1%
    processingFee: 2.5, // Fixed processing fee
    total: Math.round((amount * 0.01 + 2.5) * 100) / 100,
  };
};

export const calculateMaxLoanAmount = (user, wallet) => {
  let maxAmount = wallet.monthlyLimit - wallet.monthlyUsed;

  // Adjust based on trust score
  const trustMultiplier = user.trustScore / 100;
  maxAmount = Math.round(maxAmount * trustMultiplier);

  // Minimum based on KYC status
  if (user.kycStatus < 50) maxAmount = Math.min(maxAmount, 5000);
  else if (user.kycStatus < 80) maxAmount = Math.min(maxAmount, 25000);

  return maxAmount;
};
