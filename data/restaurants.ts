export type Restaurant = {
  id: number;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  reviewCount: number;

  foodScore: number;
  serviceScore: number;
  hygieneScore: number;
  waitingScore: number;
  priceScore: number;

  summary: string;
  complaints: string[];
};

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "The Hungry Fork",
    city: "Bangalore",
    cuisine: "North Indian",
    rating: 1.5,
    reviewCount: 342,

    foodScore: 88,
    serviceScore: 82,
    hygieneScore: 64,
    waitingScore: 76,
    priceScore: 58,

    summary:
      "Customers frequently complain about inconsistent food quality, slow service, and long waiting times.",

    complaints: [
      "Poor food quality",
      "Long waiting times",
      "Slow service",
    ],
  },

  {
    id: 2,
    name: "Spice Route",
    city: "Bangalore",
    cuisine: "Indian",
    rating: 2.7,
    reviewCount: 187,

    foodScore: 79,
    serviceScore: 85,
    hygieneScore: 61,
    waitingScore: 71,
    priceScore: 64,

    summary:
      "Reviews frequently mention slow service and inconsistent food, especially during busy hours.",

    complaints: [
      "Slow service",
      "Inconsistent food",
      "Long waiting times",
    ],
  },

  {
    id: 3,
    name: "Urban Bites",
    city: "Bangalore",
    cuisine: "Fast Food",
    rating: 3.0,
    reviewCount: 96,

    foodScore: 72,
    serviceScore: 68,
    hygieneScore: 55,
    waitingScore: 74,
    priceScore: 49,

    summary:
      "The biggest complaints are related to waiting times and inconsistent food quality.",

    complaints: [
      "Long waiting times",
      "Average food quality",
      "Inconsistent service",
    ],
  },

  {
    id: 4,
    name: "Curry Corner",
    city: "Bangalore",
    cuisine: "South Indian",
    rating: 3.2,
    reviewCount: 521,

    foodScore: 63,
    serviceScore: 59,
    hygieneScore: 47,
    waitingScore: 61,
    priceScore: 42,

    summary:
      "Most negative feedback focuses on service delays and value for money.",

    complaints: [
      "Slow service",
      "Value for money",
      "Waiting time",
    ],
  },

  {
    id: 5,
    name: "Downtown Diner",
    city: "Bangalore",
    cuisine: "Continental",
    rating: 3.4,
    reviewCount: 278,

    foodScore: 57,
    serviceScore: 52,
    hygieneScore: 38,
    waitingScore: 55,
    priceScore: 66,

    summary:
      "Customers generally like the food but frequently mention high prices and occasional service problems.",

    complaints: [
      "Expensive",
      "Slow service",
      "Inconsistent experience",
    ],
  },

  {
    id: 6,
    name: "Tandoor Tales",
    city: "Bangalore",
    cuisine: "Mughlai",
    rating: 2.9,
    reviewCount: 74,

    foodScore: 81,
    serviceScore: 63,
    hygieneScore: 58,
    waitingScore: 69,
    priceScore: 54,

    summary:
      "Food quality receives mixed feedback while waiting times are a recurring complaint.",

    complaints: [
      "Inconsistent food",
      "Long waiting times",
      "Service issues",
    ],
  },
    {
    id: 7,
    name: "Late Night Tadka",
    city: "Mumbai",
    cuisine: "Indian",
    rating: 2.2,
    reviewCount: 412,
    foodScore: 91,
    serviceScore: 87,
    hygieneScore: 72,
    waitingScore: 89,
    priceScore: 63,
    summary:
      "Frequent complaints about poor service, long waits, and inconsistent food quality.",
    complaints: [
      "Very slow service",
      "Long waiting times",
      "Inconsistent food",
    ],
  },

  {
    id: 8,
    name: "Harbor Kitchen",
    city: "Mumbai",
    cuisine: "Seafood",
    rating: 2.8,
    reviewCount: 231,
    foodScore: 76,
    serviceScore: 71,
    hygieneScore: 60,
    waitingScore: 68,
    priceScore: 72,
    summary:
      "Customers often mention expensive dishes and inconsistent service.",
    complaints: [
      "Expensive",
      "Inconsistent service",
      "Average food",
    ],
  },

  {
    id: 9,
    name: "Delhi Dine",
    city: "Delhi",
    cuisine: "North Indian",
    rating: 2.5,
    reviewCount: 389,
    foodScore: 86,
    serviceScore: 74,
    hygieneScore: 69,
    waitingScore: 77,
    priceScore: 58,
    summary:
      "Reviews frequently mention poor food quality and slow service.",
    complaints: [
      "Poor food quality",
      "Slow service",
      "Long waiting times",
    ],
  },

  {
    id: 10,
    name: "Capital Kitchen",
    city: "Delhi",
    cuisine: "Multi-cuisine",
    rating: 3.1,
    reviewCount: 154,
    foodScore: 67,
    serviceScore: 62,
    hygieneScore: 51,
    waitingScore: 63,
    priceScore: 57,
    summary:
      "Mixed reviews with recurring complaints about service and waiting times.",
    complaints: [
      "Slow service",
      "Waiting time",
      "Average food",
    ],
  },
];