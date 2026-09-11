"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { calculateWorstbitesScore } from "@/lib/scoring";

export default function AddRestaurantPage() {
  const supabase = createClient();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [restaurantName, setRestaurantName] = useState("");
  const [city, setCity] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [rating, setRating] = useState(3);
  const [reviewCount, setReviewCount] = useState(100);

  const [foodScore, setFoodScore] = useState(50);
  const [serviceScore, setServiceScore] = useState(50);
  const [hygieneScore, setHygieneScore] = useState(50);
  const [waitingScore, setWaitingScore] = useState(50);
  const [priceScore, setPriceScore] = useState(50);

  const [complaints, setComplaints] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================================================
  // ADD RESTAURANT
  // =========================================================

  async function addRestaurant() {
    if (!restaurantName.trim() || !city.trim()) {
      alert("Please enter a restaurant name and city.");
      return;
    }

    setLoading(true);

    try {
      const complaintArray = complaints
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const restaurant = {
        name: restaurantName.trim(),
        city: city.trim(),
        cuisine: cuisine.trim() || "Multi-cuisine",
        rating,
        review_count: reviewCount,
        food_score: foodScore,
        service_score: serviceScore,
        hygiene_score: hygieneScore,
        waiting_score: waitingScore,
        price_score: priceScore,
        summary:
          "A user-added restaurant being evaluated by Worstbites.",
        complaints: complaintArray,
      };

      const { error } = await supabase
        .from("restaurants")
        .insert([restaurant]);

      if (error) {
        console.error("Error adding restaurant:", error);

        alert(
          `Failed to add restaurant.\n\n${error.message}`
        );

        return;
      }

      alert("Restaurant added successfully! 🔥");

      // Go back to Explore page
      window.location.href = "/explore";

    } catch (error) {
      console.error(error);

      alert("Something went wrong while adding the restaurant.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // PREVIEW RESTAURANT
  // =========================================================

  const previewRestaurant = {
    id: 999999,
    name: restaurantName || "New Restaurant",
    city: city || "Unknown",
    cuisine: cuisine || "Multi-cuisine",
    rating,
    reviewCount,

    foodScore,
    serviceScore,
    hygieneScore,
    waitingScore,
    priceScore,

    summary: "",
    complaints: [],
  };

  const previewScore =
    calculateWorstbitesScore(previewRestaurant);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="border-b border-white/10">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            href="/explore"
            className="text-2xl font-black tracking-tight"
          >
            Worst<span className="text-red-500">bites</span>
          </Link>

          <Link
            href="/explore"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
          >
            ← Back to Explore
          </Link>

        </div>

      </nav>


      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="mx-auto max-w-4xl px-6 pb-10 pt-16">

        <div className="mb-6 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
          🔥 Time to judge
        </div>

        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          Roast a Restaurant
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500">
          Enter the restaurant details below.
          We&apos;ll calculate its Worstbites score and
          add it to the restaurant database.
        </p>

      </section>


      {/* =====================================================
          FORM
      ====================================================== */}

      <section className="mx-auto max-w-4xl px-6 pb-24">

        <div className="rounded-3xl border border-red-500/20 bg-white/[0.03] p-8 sm:p-10">


          {/* =================================================
              BASIC INFORMATION
          ================================================== */}

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              01 — Basic information
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Tell us about the place
            </h2>

          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <InputField
              label="Restaurant name"
              placeholder="e.g. The Hungry Fork"
              value={restaurantName}
              onChange={setRestaurantName}
            />

            <InputField
              label="City"
              placeholder="e.g. Bangalore"
              value={city}
              onChange={setCity}
            />

            <InputField
              label="Cuisine"
              placeholder="e.g. North Indian"
              value={cuisine}
              onChange={setCuisine}
            />

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Number of reviews
              </label>

              <input
                type="number"
                min="0"
                value={reviewCount}
                onChange={(e) =>
                  setReviewCount(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
              />

            </div>

          </div>


          {/* =================================================
              RATING
          ================================================== */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              02 — Restaurant rating
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-bold">
                    ⭐ Overall rating
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Current restaurant rating
                  </p>

                </div>

                <div className="text-3xl font-black text-yellow-400">
                  {rating.toFixed(1)}
                </div>

              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(e.target.value)
                  )
                }
                className="mt-5 w-full accent-red-500"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-600">
                <span>1.0 ⭐</span>
                <span>5.0 ⭐</span>
              </div>

            </div>

          </div>


          {/* =================================================
              PROBLEMS
          ================================================== */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              03 — Restaurant problems
            </p>

            <h2 className="mt-2 text-2xl font-black">
              How questionable is this place?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Higher means more problems.
            </p>

            <div className="mt-8 space-y-7">

              <ScoreSlider
                emoji="🍔"
                label="Food quality problems"
                value={foodScore}
                setValue={setFoodScore}
              />

              <ScoreSlider
                emoji="👨‍🍳"
                label="Service problems"
                value={serviceScore}
                setValue={setServiceScore}
              />

              <ScoreSlider
                emoji="🧼"
                label="Hygiene problems"
                value={hygieneScore}
                setValue={setHygieneScore}
              />

              <ScoreSlider
                emoji="⏱️"
                label="Waiting time problems"
                value={waitingScore}
                setValue={setWaitingScore}
              />

              <ScoreSlider
                emoji="💰"
                label="Value-for-money problems"
                value={priceScore}
                setValue={setPriceScore}
              />

            </div>

          </div>


          {/* =================================================
              COMPLAINTS
          ================================================== */}

          <div className="mt-12">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              04 — Customer complaints
            </p>

            <label className="mt-5 mb-2 block text-sm font-medium text-gray-400">
              Common complaints
            </label>

            <input
              type="text"
              value={complaints}
              onChange={(e) =>
                setComplaints(e.target.value)
              }
              placeholder="Slow service, expensive, cold food"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-700 focus:border-red-500"
            />

            <p className="mt-2 text-xs text-gray-700">
              Separate complaints using commas.
            </p>

          </div>


          {/* =================================================
              LIVE SCORE
          ================================================== */}

          <div className="mt-12 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Current Worstbites score
            </p>

            <p className="mt-3 text-7xl font-black text-red-500">
              {previewScore}
            </p>

            <p className="mt-3 text-sm text-gray-600">
              Higher = more questionable dinner decision.
            </p>

          </div>


          {/* =================================================
              SUBMIT
          ================================================== */}

          <button
            onClick={addRestaurant}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-red-600 px-8 py-4 text-lg font-black transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Adding restaurant..."
              : "🔥 Add Restaurant & Calculate Score"}
          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-700 sm:flex-row">

          <p>
            © 2026 Worstbites
          </p>

          <p>
            Restaurant intelligence, without the sugarcoating.
          </p>

        </div>

      </footer>

    </main>
  );
}


/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-400">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-700 focus:border-red-500"
      />

    </div>
  );
}


/* =========================================================
   SCORE SLIDER
========================================================= */

function ScoreSlider({
  emoji,
  label,
  value,
  setValue,
}: {
  emoji: string;
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span>{emoji}</span>

          <span className="text-sm text-gray-400">
            {label}
          </span>

        </div>

        <span className="font-bold text-red-400">
          {value}%
        </span>

      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) =>
          setValue(
            Number(e.target.value)
          )
        }
        className="w-full accent-red-500"
      />

    </div>
  );
}
