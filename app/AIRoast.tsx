
"use client";

import { useEffect, useState } from "react";

type AIRoastProps = {
  restaurantName: string;
  cuisine: string;
  city: string;
  rating: number;
  reviewCount: number;
  worstbitesScore: number;
  foodScore: number;
  serviceScore: number;
  hygieneScore: number;
  waitingScore: number;
  priceScore: number;
  complaints: string[];
};

export default function AIRoast({
  restaurantName,
  cuisine,
  city,
  rating,
  reviewCount,
  worstbitesScore,
  foodScore,
  serviceScore,
  hygieneScore,
  waitingScore,
  priceScore,
  complaints,
}: AIRoastProps) {
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateRoast = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/roast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurantName,
            cuisine,
            city,
            rating,
            reviewCount,
            worstbitesScore,
            foodScore,
            serviceScore,
            hygieneScore,
            waitingScore,
            priceScore,
            complaints,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to generate roast"
          );
        }

        setRoast(data.roast);
      } catch (err) {
        console.error("Roast generation error:", err);

        setError(
          "Reality check temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    };

    generateRoast();
  }, [
    restaurantName,
    cuisine,
    city,
    rating,
    reviewCount,
    worstbitesScore,
    foodScore,
    serviceScore,
    hygieneScore,
    waitingScore,
    priceScore,
    complaints,
  ]);

  return (
    <div className="mt-14 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 sm:p-10">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
        Reality check
      </p>

      <h2 className="mt-3 text-3xl font-black">
        What the numbers really say
      </h2>

      <p className="mt-3 max-w-2xl text-gray-500">
    
      </p>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">

          <div className="flex items-center gap-3">

            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

            <p className="text-gray-400">
              Analyzing the evidence...
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          ROAST
      ====================================================== */}

      {!loading && roast && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-black/30 p-6 sm:p-8">

          <div className="flex gap-4">

            <div className="text-3xl">
              🔥
            </div>

            <p className="text-xl font-medium leading-8 text-gray-200">
              "{roast}"
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">

          <p className="text-gray-500">
            {error}
          </p>

        </div>
      )}

    </div>
  );
}

