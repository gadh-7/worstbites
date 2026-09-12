"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import {
  calculateWorstbitesScore,
  getRiskLevel,
} from "@/lib/scoring";

// =========================================================
// DATABASE RESTAURANT TYPE
// =========================================================

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

// =========================================================
// SUPABASE DATABASE TYPE
// =========================================================

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
  complaints: string[] | null;
};

// =========================================================
// EXPLORE PAGE
// =========================================================

export default function ExplorePage() {
  const supabase = createClient();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // LOAD RESTAURANTS FROM SUPABASE
  // =======================================================

  useEffect(() => {
    async function loadRestaurants() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("id", {
          ascending: true,
        });

      if (error) {
        console.error("Error loading restaurants:", error);

        setError(
          "Unable to load restaurants. Please try again."
        );

        setLoading(false);
        return;
      }

      const convertedRestaurants: Restaurant[] =
        (data as SupabaseRestaurant[]).map(
          (restaurant) => ({
            id: restaurant.id,

            name: restaurant.name,

            city: restaurant.city,

            cuisine: restaurant.cuisine,

            rating: restaurant.rating,

            reviewCount:
              restaurant.review_count,

            foodScore:
              restaurant.food_score,

            serviceScore:
              restaurant.service_score,

            hygieneScore:
              restaurant.hygiene_score,

            waitingScore:
              restaurant.waiting_score,

            priceScore:
              restaurant.price_score,

            summary:
              restaurant.summary,

            complaints:
              restaurant.complaints ?? [],
          })
        );

      setRestaurants(convertedRestaurants);
      setLoading(false);
    }

    loadRestaurants();
  }, []);

  // =======================================================
  // SEARCH
  // =======================================================

  const filteredRestaurants =
    restaurants.filter((restaurant) => {
      const searchTerm =
        search.toLowerCase().trim();

      if (!searchTerm) {
        return true;
      }

      return (
        restaurant.city
          .toLowerCase()
          .includes(searchTerm) ||
        restaurant.name
          .toLowerCase()
          .includes(searchTerm) ||
        restaurant.cuisine
          .toLowerCase()
          .includes(searchTerm)
      );
    });

  // =======================================================
  // CALCULATE + RANK
  // =======================================================

  const rankedRestaurants =
    filteredRestaurants
      .map((restaurant) => ({
        ...restaurant,

        worstbitesScore:
          calculateWorstbitesScore(
            restaurant
          ),
      }))
      .sort(
        (a, b) =>
          b.worstbitesScore -
          a.worstbitesScore
      );

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

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
              href="/"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              About
            </Link>

            <Link
              href="/add"
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold transition hover:bg-red-500"
            >
              + Add Restaurant
            </Link>

          </div>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-20">

        <div className="text-center">

          <div className="mb-6 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            🔎 Restaurant intelligence
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">

            Find your next

            <br />

            <span className="text-red-500">
              questionable meal.
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
            Search restaurants, compare their Worstbites
            scores, and find out which places deserve your
            money... and which deserve a strongly worded
            review.
          </p>

        </div>

        {/* =================================================
            PRIMARY ACTION
        ================================================== */}

        <div className="mx-auto mt-10 max-w-2xl">

          <Link
            href="/add"
            className="group block rounded-2xl bg-red-600 p-6 transition hover:-translate-y-1 hover:bg-red-500"
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
              Enter the details and let us judge it.
            </p>

          </Link>

        </div>

      </section>

      {/* =====================================================
          RESTAURANTS
      ====================================================== */}

      <section
        id="restaurant-results"
        className="mx-auto max-w-6xl scroll-mt-10 px-6 pb-24"
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <p className="text-sm font-medium text-red-500">
            EXPLORE
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Restaurants we&apos;ve already judged
          </h2>

          <p className="mt-2 text-gray-600">
            Search by restaurant, city, or cuisine.
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================== */}

        <div className="mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search restaurant, city or cuisine..."
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

        {/* =================================================
            RESULTS HEADER
        ================================================== */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <p className="text-sm font-medium text-red-500">
              {search.trim()
                ? "SEARCH RESULTS"
                : "ALL RESTAURANTS"}
            </p>

            <h2 className="mt-1 text-3xl font-bold">

              {search.trim()
                ? `"${search.trim()}"`
                : "Worstbites rankings"}

            </h2>

          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            Ranked by Worstbites Score
          </span>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <div className="text-4xl">
              🍽️
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Loading restaurants...
            </h3>

            <p className="mt-2 text-gray-600">
              Checking the database for questionable
              dining decisions.
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">

            <div className="text-5xl">
              🚨
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              Something went wrong.
            </h3>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
            >
              Try again
            </button>

          </div>
        )}

        {/* =================================================
            NO RESULTS
        ================================================== */}

        {!loading &&
          !error &&
          rankedRestaurants.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

              <div className="text-5xl">
                🍽️
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Nothing found.
              </h3>

              <p className="mt-2 text-gray-500">
                Either this restaurant is suspiciously
                unknown, or we haven&apos;t judged it yet.
              </p>

              <Link
                href="/add"
                className="mt-6 inline-block rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
              >
                + Add This Restaurant
              </Link>

            </div>
          )}

        {/* =================================================
            RESTAURANT CARDS
        ================================================== */}

        {!loading &&
          !error &&
          rankedRestaurants.length > 0 && (
            <div className="grid gap-5 md:grid-cols-3">

              {rankedRestaurants.map(
                (restaurant, index) => {

                  const risk =
                    getRiskLevel(
                      restaurant.worstbitesScore
                    );

                  return (
                    <div
                      key={restaurant.id}
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
                            {restaurant.cuisine}
                            {" · "}
                            {restaurant.city}
                          </p>

                        </div>

                        {/* SCORE */}

                        <div className="min-w-[70px] rounded-xl bg-red-500/10 px-3 py-2 text-center">

                          <p className="text-2xl font-black text-red-500">
                            {restaurant.worstbitesScore}
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
                          {restaurant.rating.toFixed(1)}
                        </span>

                        <span className="text-sm text-gray-500">
                          ({restaurant.reviewCount} reviews)
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
                          value={restaurant.foodScore}
                        />

                        <ScoreBar
                          label="Service"
                          value={restaurant.serviceScore}
                        />

                        <ScoreBar
                          label="Waiting time"
                          value={restaurant.waitingScore}
                        />

                        <ScoreBar
                          label="Hygiene"
                          value={restaurant.hygieneScore}
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
                              (complaint) => (
                                <span
                                  key={complaint}
                                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-400"
                                >
                                  {complaint}
                                </span>
                              )
                            )}

                        </div>

                      </div>

                      {/* VIEW ANALYSIS */}

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

// =========================================================
// SCORE BAR
// =========================================================

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