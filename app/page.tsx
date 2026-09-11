"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  calculateWorstbitesScore,
  getRiskLevel,
} from "@/lib/scoring";
import { restaurants as initialRestaurants } from "@/data/restaurants";

/* =========================================================
   RESTAURANT TYPE
========================================================= */

type Restaurant = {
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

/* =========================================================
   SUPABASE DATABASE TYPE
========================================================= */

type SupabaseRestaurant = {
  id: number;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  review_count: number;

  food_score: number;
  service_score: number;
  hygiene_score: number;
  waiting_score: number;
  price_score: number;

  summary: string;
  complaints: string[];
};

/* =========================================================
   CONVERT SUPABASE DATA → APP DATA
========================================================= */

function convertFromSupabase(
  restaurant: SupabaseRestaurant
): Restaurant {
  return {
    id: restaurant.id,
    name: restaurant.name,
    city: restaurant.city,
    cuisine: restaurant.cuisine,
    rating: Number(restaurant.rating),
    reviewCount: Number(restaurant.review_count),

    foodScore: Number(restaurant.food_score),
    serviceScore: Number(restaurant.service_score),
    hygieneScore: Number(restaurant.hygiene_score),
    waitingScore: Number(restaurant.waiting_score),
    priceScore: Number(restaurant.price_score),

    summary: restaurant.summary,
    complaints: Array.isArray(restaurant.complaints)
      ? restaurant.complaints
      : [],
  };
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const supabase = createClient();

  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  /* =======================================================
     ADD RESTAURANT FORM STATE
  ======================================================= */

  const [restaurantName, setRestaurantName] =
    useState("");

  const [city, setCity] =
    useState("");

  const [cuisine, setCuisine] =
    useState("");

  const [rating, setRating] =
    useState(3);

  const [reviewCount, setReviewCount] =
    useState(100);

  const [foodScore, setFoodScore] =
    useState(50);

  const [serviceScore, setServiceScore] =
    useState(50);

  const [hygieneScore, setHygieneScore] =
    useState(50);

  const [waitingScore, setWaitingScore] =
    useState(50);

  const [priceScore, setPriceScore] =
    useState(50);

  const [complaints, setComplaints] =
    useState("");

  /* =======================================================
     LOAD RESTAURANTS FROM SUPABASE
  ======================================================= */

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true);

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("id", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Error loading restaurants:",
          JSON.stringify(error, null, 2)
        );

        /*
         * If Supabase fails, use the original local data
         * so the website does not become completely empty.
         */
        setRestaurants(initialRestaurants);
        setLoading(false);
        return;
      }

      if (data) {
        const convertedRestaurants =
          (data as SupabaseRestaurant[]).map(
            convertFromSupabase
          );

        setRestaurants(convertedRestaurants);
      }

      setLoading(false);
    }

    loadRestaurants();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredRestaurants =
    restaurants.filter((restaurant) =>
      restaurant.city
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  /* =======================================================
     RANK RESTAURANTS
  ======================================================= */

  const rankedRestaurants =
    filteredRestaurants
      .map((restaurant) => ({
        ...restaurant,

        worstbitesScore:
          calculateWorstbitesScore(restaurant),
      }))
      .sort(
        (a, b) =>
          b.worstbitesScore -
          a.worstbitesScore
      );

  /* =======================================================
     ADD RESTAURANT TO SUPABASE
  ======================================================= */

  async function addRestaurant() {
    if (
      !restaurantName.trim() ||
      !city.trim()
    ) {
      alert(
        "Please enter a restaurant name and city."
      );

      return;
    }

    setAdding(true);

    try {
      /*
       * We generate an integer ID because your
       * current Supabase table uses numeric IDs.
       */
      const newId = Date.now();

      /*
       * Convert the complaints text into an array.
       */
      const complaintArray =
        complaints
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      /*
       * IMPORTANT:
       *
       * Your React app uses:
       *
       * reviewCount
       * foodScore
       * serviceScore
       *
       * But Supabase uses:
       *
       * review_count
       * food_score
       * service_score
       *
       * Therefore we convert the names here.
       */

      const restaurantToInsert = {
        id: newId,

        name: restaurantName.trim(),

        city: city.trim(),

        cuisine:
          cuisine.trim() ||
          "Multi-cuisine",

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

      console.log(
        "Sending restaurant to Supabase:",
        restaurantToInsert
      );

      /* =================================================
         INSERT INTO SUPABASE
      ================================================= */

      const { data, error } =
        await supabase
          .from("restaurants")
          .insert([restaurantToInsert])
          .select()
          .single();

      /* =================================================
         ERROR
      ================================================= */

      if (error) {
        console.error(
          "Error adding restaurant:",
          JSON.stringify(error, null, 2)
        );

        alert(
          `Could not add restaurant.\n\n${error.message}`
        );

        return;
      }

      /* =================================================
         SUCCESS
      ================================================= */

      console.log(
        "Restaurant successfully added:",
        data
      );

      /*
       * Convert the Supabase restaurant back into
       * the format used by the React application.
       */

      const addedRestaurant =
        convertFromSupabase(
          data as SupabaseRestaurant
        );

      /*
       * Add the new restaurant to the current list.
       *
       * This means the user immediately sees it
       * without needing to refresh the page.
       */

      setRestaurants((current) => [
        ...current,
        addedRestaurant,
      ]);

      /* =================================================
         RESET FORM
      ================================================= */

      setRestaurantName("");

      setCity("");

      setCuisine("");

      setRating(3);

      setReviewCount(100);

      setFoodScore(50);

      setServiceScore(50);

      setHygieneScore(50);

      setWaitingScore(50);

      setPriceScore(50);

      setComplaints("");

      setShowAddForm(false);

      /*
       * Automatically search the city of the
       * newly added restaurant.
       */

      setSearch(
        addedRestaurant.city
      );

      alert(
        "Restaurant added successfully! 🔥"
      );
    } catch (error) {
      console.error(
        "Unexpected error adding restaurant:",
        error
      );

      alert(
        "Something went wrong while adding the restaurant."
      );
    } finally {
      setAdding(false);
    }
  }

  /* =======================================================
     PREVIEW SCORE
  ======================================================= */

  const previewRestaurant: Restaurant = {
    id: 999999,

    name:
      restaurantName ||
      "New Restaurant",

    city:
      city ||
      "Unknown",

    cuisine:
      cuisine ||
      "Multi-cuisine",

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
    calculateWorstbitesScore(
      previewRestaurant
    );

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="border-b border-white/10">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Worst
            <span className="text-red-500">
              bites
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/about"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              About
            </Link>

            <button
              onClick={() =>
                setShowAddForm(true)
              }
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold transition hover:bg-red-500"
            >
              + Add Restaurant
            </button>

          </div>

        </div>

      </nav>

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-center">

        <div className="mb-6 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          🍔 Restaurant intelligence, without the sugarcoating
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-7xl">

          Tell us where you ate.

          <br />

          <span className="text-red-500">
            We&apos;ll tell you how brave you were.
          </span>

        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Search restaurants, explore their ratings,
          or enter your own restaurant and let Worstbites
          judge the numbers.
        </p>

        {/* =================================================
            PRIMARY ACTIONS
        ================================================= */}

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">

          {/* ROAST */}

          <button
            onClick={() =>
              setShowAddForm(true)
            }
            className="group rounded-2xl bg-red-600 p-6 text-left transition hover:-translate-y-1 hover:bg-red-500"
          >

            <div className="flex items-center justify-between">

              <span className="text-3xl">
                🔥
              </span>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>

            </div>

            <h2 className="mt-5 text-xl font-black">
              Roast a Restaurant
            </h2>

            <p className="mt-2 text-sm text-red-100">
              Enter the ratings and let us judge it.
            </p>

          </button>

          {/* EXPLORE */}

          <button
            onClick={() => {
              document
                .getElementById(
                  "restaurant-results"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-white/30"
          >

            <div className="flex items-center justify-between">

              <span className="text-3xl">
                🔎
              </span>

              <span className="text-xl text-gray-500 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </div>

            <h2 className="mt-5 text-xl font-black">
              Explore Restaurants
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Browse restaurants we&apos;ve already judged.
            </p>

          </button>

        </div>

      </section>

      {/* ===================================================
          ADD RESTAURANT FORM
      =================================================== */}

      {showAddForm && (

        <section className="mx-auto max-w-4xl px-6 pb-20">

          <div className="rounded-3xl border border-red-500/20 bg-white/[0.03] p-8">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                  Time to judge
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Roast a Restaurant 🔥
                </h2>

                <p className="mt-2 text-gray-500">
                  Give us the numbers. We&apos;ll give you
                  the verdict.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddForm(false)
                }
                className="text-3xl text-gray-500 transition hover:text-white"
              >
                ×
              </button>

            </div>

            {/* BASIC INFORMATION */}

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
                placeholder="e.g. Indian"
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
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-red-500"
                />

              </div>

            </div>

            {/* RATING */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-bold">
                    ⭐ Restaurant rating
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Current overall rating
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
                    Number(
                      e.target.value
                    )
                  )
                }
                className="mt-5 w-full accent-red-500"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-600">

                <span>
                  1.0 ⭐
                </span>

                <span>
                  5.0 ⭐
                </span>

              </div>

            </div>

            {/* PROBLEMS */}

            <div className="mt-8">

              <p className="font-bold">
                📊 Restaurant problems
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Higher means more problems.
              </p>

              <div className="mt-5 space-y-6">

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

            {/* COMPLAINTS */}

            <div className="mt-8">

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Common complaints
              </label>

              <input
                type="text"
                value={complaints}
                onChange={(e) =>
                  setComplaints(
                    e.target.value
                  )
                }
                placeholder="Slow service, expensive, cold food"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none placeholder:text-gray-700 focus:border-red-500"
              />

              <p className="mt-2 text-xs text-gray-700">
                Separate complaints using commas.
              </p>

            </div>

            {/* LIVE SCORE */}

            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">

              <p className="text-sm uppercase tracking-widest text-gray-500">
                Current Worstbites score
              </p>

              <p className="mt-2 text-6xl font-black text-red-500">
                {previewScore}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Higher = more questionable dinner decision.
              </p>

            </div>

            {/* SUBMIT */}

            <button
              onClick={addRestaurant}
              disabled={adding}
              className="mt-8 w-full rounded-xl bg-red-600 px-8 py-4 text-lg font-black transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding
                ? "Adding to Supabase..."
                : "🔥 Add Restaurant & Calculate Score"}
            </button>

          </div>

        </section>

      )}

      {/* ===================================================
          SEARCH / RESTAURANTS
      =================================================== */}

      <section
        id="restaurant-results"
        className="mx-auto max-w-6xl scroll-mt-10 px-6 pb-24"
      >

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm font-medium text-red-500">
            EXPLORE
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Restaurants we&apos;ve already judged
          </h2>

          <p className="mt-2 text-gray-600">
            Search by city and see who&apos;s winning the
            Worstbites competition nobody asked for.
          </p>

        </div>

        {/* SEARCH BAR */}

        <div className="mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search a city... e.g. Bangalore"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-red-500"
          />

          <button
            onClick={() => {
              const input =
                document.querySelector(
                  "#restaurant-results input"
                ) as HTMLInputElement | null;

              input?.focus();
            }}
            className="rounded-xl bg-white px-8 py-4 font-bold text-black transition hover:bg-gray-200"
          >
            Search
          </button>

        </div>

        {/* RESULTS TITLE */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="text-sm font-medium text-red-500">
              SUPABASE DATABASE
            </p>

            <h2 className="mt-1 text-3xl font-bold">

              {search.trim()
                ? `${search.trim()}'s Worstbites`
                : "Bangalore's Worstbites"}

            </h2>

          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            Ranked by Worstbites Score
          </span>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="text-4xl">
              🍽️
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Loading restaurants...
            </h3>

            <p className="mt-2 text-gray-500">
              Checking the Worstbites database.
            </p>

          </div>

        )}

        {/* NO RESULTS */}

        {!loading &&
          rankedRestaurants.length === 0 && (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

              <div className="text-5xl">
                🍽️
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Nothing found.
              </h3>

              <p className="mt-2 text-gray-500">
                Either this city is suspiciously clean,
                or we haven&apos;t judged it yet.
              </p>

              <button
                onClick={() =>
                  setShowAddForm(true)
                }
                className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
              >
                + Add This Restaurant
              </button>

            </div>

          )}

        {/* RESTAURANT CARDS */}

        {!loading &&
          rankedRestaurants.length > 0 && (

            <div className="grid gap-5 md:grid-cols-3">

              {rankedRestaurants.map(
                (
                  restaurant,
                  index
                ) => {

                  const risk =
                    getRiskLevel(
                      restaurant.worstbitesScore
                    );

                  return (

                    <div
                      key={
                        restaurant.id
                      }
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-red-500/40"
                    >

                      {/* HEADER */}

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="mb-3 text-sm font-bold text-gray-600">
                            #{index + 1}
                          </div>

                          <h3 className="text-xl font-bold">
                            {restaurant.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {restaurant.cuisine}{" "}
                            ·{" "}
                            {restaurant.city}
                          </p>

                        </div>

                        {/* SCORE */}

                        <div className="min-w-[70px] rounded-xl bg-red-500/10 px-3 py-2 text-center">

                          <p className="text-2xl font-black text-red-500">
                            {
                              restaurant.worstbitesScore
                            }
                          </p>

                          <p className="text-[10px] uppercase text-red-400">
                            Risk
                          </p>

                        </div>

                      </div>

                      {/* RATING */}

                      <div className="mt-6 flex items-center gap-3">

                        <span className="text-yellow-400">
                          ★
                        </span>

                        <span className="font-bold">
                          {restaurant.rating.toFixed(
                            1
                          )}
                        </span>

                        <span className="text-sm text-gray-500">
                          (
                          {
                            restaurant.reviewCount
                          }{" "}
                          reviews)
                        </span>

                      </div>

                      {/* RISK */}

                      <div className="mt-4">

                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          {risk.label}
                        </span>

                      </div>

                      {/* SCORE BARS */}

                      <div className="mt-6 space-y-4">

                        <ScoreBar
                          label="Food quality"
                          value={
                            restaurant.foodScore
                          }
                        />

                        <ScoreBar
                          label="Service"
                          value={
                            restaurant.serviceScore
                          }
                        />

                        <ScoreBar
                          label="Waiting time"
                          value={
                            restaurant.waitingScore
                          }
                        />

                        <ScoreBar
                          label="Hygiene"
                          value={
                            restaurant.hygieneScore
                          }
                        />

                      </div>

                      {/* COMPLAINTS */}

                      <div className="mt-6">

                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          Common complaints
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {restaurant.complaints
                            .slice(0, 3)
                            .map(
                              (
                                complaint
                              ) => (

                                <span
                                  key={
                                    complaint
                                  }
                                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-400"
                                >
                                  {
                                    complaint
                                  }
                                </span>

                              )
                            )}

                        </div>

                      </div>

                      {/* VIEW */}

                      <Link
                        href={`/restaurant/${restaurant.id}`}
                        className="mt-6 block w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium transition hover:bg-white/5"
                      >
                        View analysis →
                      </Link>

                    </div>

                  );
                }
              )}

            </div>

          )}

      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

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
  onChange: (
    value: string
  ) => void;
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
          onChange(
            e.target.value
          )
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
  setValue: (
    value: number
  ) => void;
}) {
  return (

    <div>

      <div className="mb-2 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span>
            {emoji}
          </span>

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
            Number(
              e.target.value
            )
          )
        }
        className="w-full accent-red-500"
      />

    </div>

  );
}

/* =========================================================
   SCORE BAR
========================================================= */

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (

    <div>

      <div className="mb-1 flex justify-between text-xs">

        <span className="text-gray-400">
          {label}
        </span>

        <span className="font-medium">
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-red-500 transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>

  );
}