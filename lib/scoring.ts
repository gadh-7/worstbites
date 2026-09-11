import { Restaurant } from "@/data/restaurants";

export function calculateWorstbitesScore(
  restaurant: Restaurant
): number {
  // Convert Google-style rating into a risk score.
  // 5 stars = 0 risk
  // 1 star = 100 risk
  const ratingRisk =
    ((5 - restaurant.rating) / 4) * 100;

  // Review count gives us confidence in the rating.
  // More reviews = more confidence.
  const reviewConfidence =
    Math.min(
      Math.log10(restaurant.reviewCount + 1) / 3,
      1
    ) * 100;

  // Average of the negative issue categories.
  const complaintRisk =
    (
      restaurant.foodScore +
      restaurant.serviceScore +
      restaurant.hygieneScore +
      restaurant.waitingScore +
      restaurant.priceScore
    ) / 5;

  /*
    Final Worstbites score

    Rating          → 40%
    Complaints      → 40%
    Review volume   → 20%
  */

  const score =
    ratingRisk * 0.4 +
    complaintRisk * 0.4 +
    reviewConfidence * 0.2;

  return Math.round(score);
}
export function getRiskLevel(score: number) {
  if (score >= 80) {
    return {
      label: "Extreme Risk",
      color: "red",
    };
  }

  if (score >= 60) {
    return {
      label: "High Risk",
      color: "orange",
    };
  }

  if (score >= 40) {
    return {
      label: "Moderate Risk",
      color: "yellow",
    };
  }

  return {
    label: "Low Risk",
    color: "green",
  };
}