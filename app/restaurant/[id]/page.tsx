import AIRoast from "@/app/AIRoast";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateWorstbitesScore } from "@/lib/scoring";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

export default async function RestaurantPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // =========================================================
  // GET RESTAURANT FROM SUPABASE
  // =========================================================

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) {
    console.error("Error loading restaurant:", error);
    notFound();
  }

  // =========================================================
  // CONVERT SUPABASE DATABASE FORMAT
  // TO THE FORMAT USED BY THE APP
  // =========================================================

  const restaurant: Restaurant = {
    id: data.id,
    name: data.name,
    city: data.city,
    cuisine: data.cuisine,
    rating: Number(data.rating),
    reviewCount: Number(data.review_count),

    foodScore: Number(data.food_score),
    serviceScore: Number(data.service_score),
    hygieneScore: Number(data.hygiene_score),
    waitingScore: Number(data.waiting_score),
    priceScore: Number(data.price_score),

    summary: data.summary ?? "",

    complaints: Array.isArray(data.complaints)
      ? data.complaints
      : [],
  };

  // =========================================================
  // WORSTBITES SCORE
  // =========================================================

  const worstbitesScore =
    calculateWorstbitesScore(restaurant);

  // =========================================================
  // VERDICT
  // =========================================================

  const getVerdict = (score: number) => {
    if (score >= 90) {
      return {
        emoji: "💀",
        title: "RUN.",
        text:
          "Congratulations. You have discovered a restaurant where disappointment comes with a side dish.",
      };
    }

    if (score >= 80) {
      return {
        emoji: "🚨",
        title: "THINK TWICE.",
        text:
          "Your stomach has filed a formal complaint before you've even arrived.",
      };
    }

    if (score >= 70) {
      return {
        emoji: "😬",
        title: "PROCEED WITH CAUTION.",
        text:
          "It's not necessarily a disaster. But neither is it something we'd brag about eating.",
      };
    }

    if (score >= 50) {
      return {
        emoji: "🤨",
        title: "YOUR CALL.",
        text:
          "Could be good. Could be questionable. Flip a coin and prepare your stomach.",
      };
    }

    if (score >= 30) {
      return {
        emoji: "🙂",
        title: "PROBABLY FINE.",
        text:
          "Look at that. A restaurant that hasn't completely betrayed its customers.",
      };
    }

    return {
      emoji: "👑",
      title: "SUSPICIOUSLY GOOD.",
      text:
        "Something went right. We're as surprised as you are.",
    };
  };

  const verdict = getVerdict(worstbitesScore);

  // =========================================================
  // FOOD COMMENT
  // =========================================================

  const getFoodComment = (score: number) => {
    if (score >= 90)
      return "Apparently seasoning is a premium feature.";

    if (score >= 80)
      return "The food has bravely decided to fight back.";

    if (score >= 70)
      return "Edible is technically a compliment.";

    if (score >= 60)
      return "Not terrible. Not exactly a love letter either.";

    if (score >= 40)
      return "The kitchen appears to know what food is.";

    return "Wait... this is actually good?";
  };

  // =========================================================
  // SERVICE COMMENT
  // =========================================================

  const getServiceComment = (score: number) => {
    if (score >= 90)
      return "The staff operates on geological time.";

    if (score >= 80)
      return "Apparently customer service is optional.";

    if (score >= 70)
      return "You may need to make eye contact with the staff three times.";

    if (score >= 60)
      return "Service exists. Technically.";

    if (score >= 40)
      return "Surprisingly functional.";

    return "Someone here actually likes customers.";
  };

  // =========================================================
  // HYGIENE COMMENT
  // =========================================================

  const getHygieneComment = (score: number) => {
    if (score >= 90)
      return "The five-second rule feels dangerously optimistic.";

    if (score >= 80)
      return "Maybe don't inspect the kitchen too closely.";

    if (score >= 70)
      return "Cleanliness appears to be more of a suggestion.";

    if (score >= 60)
      return "We've seen cleaner. We've also seen worse.";

    if (score >= 40)
      return "Nothing particularly terrifying here.";

    return "Someone discovered soap. Respect.";
  };

  // =========================================================
  // WAITING COMMENT
  // =========================================================

  const getWaitingComment = (score: number) => {
    if (score >= 90)
      return "Perfect if you ordered yesterday and plan to eat tomorrow.";

    if (score >= 80)
      return "Bring patience. And possibly a sleeping bag.";

    if (score >= 70)
      return "Your food is currently taking the scenic route.";

    if (score >= 60)
      return "Waiting is apparently part of the dining experience.";

    if (score >= 40)
      return "A little patience won't hurt.";

    return "Whoa. Food actually arrives.";
  };

  // =========================================================
  // PRICE COMMENT
  // =========================================================

  const getPriceComment = (score: number) => {
    if (score >= 90)
      return "Your wallet would like to speak with management.";

    if (score >= 80)
      return "Expensive enough to make the food taste worse.";

    if (score >= 70)
      return "Your bank account may need emotional support.";

    if (score >= 60)
      return "Let's just say your wallet noticed.";

    if (score >= 40)
      return "Not cheap. Not outrageous.";

    return "Your wallet survived. Somehow.";
  };

  // =========================================================
  // RATING COMMENT
  // =========================================================

  const getRatingComment = (rating: number) => {
    if (rating <= 2)
      return "Two stars. At least the customers were feeling generous.";

    if (rating <= 2.5)
      return "The rating is doing most of the warning for us.";

    if (rating <= 3)
      return "Three stars. The universal rating for 'it happened.'";

    if (rating <= 3.5)
      return "Not terrible. Not exactly legendary.";

    if (rating <= 4)
      return "Okay, there's some competence happening here.";

    return "Wait... people actually like this place.";
  };

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
            Worst<span className="text-red-500">bites</span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
          >
            ← Back
          </Link>

        </div>

      </nav>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}

        <div className="mb-8 text-sm text-gray-600">
          Home / {restaurant.city} / {restaurant.name}
        </div>


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          <div>

            <div className="mb-5 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
              {verdict.emoji} Worstbites has spoken
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
              {restaurant.name}
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              {restaurant.cuisine} · {restaurant.city}
            </p>


            {/* Rating */}

            <div className="mt-6 flex items-center gap-3">

              <span className="text-2xl text-yellow-400">
                ★
              </span>

              <span className="text-xl font-bold">
                {restaurant.rating.toFixed(1)}
              </span>

              <span className="text-gray-600">
                from {restaurant.reviewCount} reviews
              </span>

            </div>

            <p className="mt-5 max-w-2xl text-lg italic leading-8 text-gray-400">
              "{getRatingComment(restaurant.rating)}"
            </p>

          </div>


          {/* =================================================
              SCORE
          ================================================== */}

          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              Worstbites Score
            </p>

            <div className="mt-3 text-7xl font-black text-red-500">
              {worstbitesScore}
            </div>

            <p className="mt-2 text-sm text-gray-600">
              out of 100
            </p>

            <div className="mt-6 rounded-full bg-red-500/10 px-4 py-3 text-sm font-black uppercase text-red-400">
              {verdict.title}
            </div>

          </div>

        </div>


        {/* ===================================================
            VERDICT
        ==================================================== */}

        <div className="mt-12 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            The official Worstbites verdict
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">

            <div className="text-5xl">
              {verdict.emoji}
            </div>

            <div>

              <h2 className="text-3xl font-black">
                {verdict.title}
              </h2>

              <p className="mt-3 max-w-3xl text-xl leading-8 text-gray-300">
                {verdict.text}
              </p>

            </div>

          </div>

          <div className="mt-8 border-t border-red-500/10 pt-6">

            <p className="text-sm leading-7 text-gray-500">
              {restaurant.summary}
            </p>

          </div>

        </div>


        {/* ===================================================
            SCORE BREAKDOWN
        ==================================================== */}

        <div className="mt-14">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            The evidence
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Why are we roasting this place?
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            These scores are based on the review signals
            powering the Worstbites algorithm.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <SarcasticCard
              emoji="🍔"
              title="Food quality"
              value={restaurant.foodScore}
              comment={getFoodComment(
                restaurant.foodScore
              )}
            />

            <SarcasticCard
              emoji="👨‍🍳"
              title="Service"
              value={restaurant.serviceScore}
              comment={getServiceComment(
                restaurant.serviceScore
              )}
            />

            <SarcasticCard
              emoji="🧼"
              title="Hygiene"
              value={restaurant.hygieneScore}
              comment={getHygieneComment(
                restaurant.hygieneScore
              )}
            />

            <SarcasticCard
              emoji="⏱️"
              title="Waiting time"
              value={restaurant.waitingScore}
              comment={getWaitingComment(
                restaurant.waitingScore
              )}
            />

            <SarcasticCard
              emoji="💰"
              title="Value for money"
              value={restaurant.priceScore}
              comment={getPriceComment(
                restaurant.priceScore
              )}
            />

            <SarcasticCard
              emoji="⭐"
              title="Overall rating risk"
              value={Math.round(
                ((5 - restaurant.rating) / 4) * 100
              )}
              comment={getRatingComment(
                restaurant.rating
              )}
            />

          </div>

        </div>


        {/* ===================================================
            COMMON COMPLAINTS
        ==================================================== */}

        <div className="mt-14">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Things customers apparently noticed
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Common complaints
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {restaurant.complaints.map(
              (complaint, index) => (

                <div
                  key={`${complaint}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <span className="text-red-500">
                    ⚠
                  </span>

                  <span className="ml-3 text-sm text-gray-300">
                    {complaint}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        {/* ===================================================
            REALITY CHECK
        ==================================================== */}

        <AIRoast
          restaurantName={restaurant.name}
          cuisine={restaurant.cuisine}
          city={restaurant.city}
          rating={restaurant.rating}
          reviewCount={restaurant.reviewCount}
          worstbitesScore={worstbitesScore}
          foodScore={restaurant.foodScore}
          serviceScore={restaurant.serviceScore}
          hygieneScore={restaurant.hygieneScore}
          waitingScore={restaurant.waitingScore}
          priceScore={restaurant.priceScore}
          complaints={restaurant.complaints}
        />


        {/* ===================================================
            MOCK PRAISE
        ==================================================== */}

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-600">
            A completely unbiased compliment
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Let's say something nice.
          </h2>

          <p className="mt-5 max-w-3xl text-xl leading-9 text-gray-400">
            "{getPraise(
              restaurant.rating,
              restaurant.foodScore,
              restaurant.serviceScore
            )}"
          </p>

        </div>


        {/* ===================================================
            ALGORITHM
        ==================================================== */}

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Behind the roast
          </p>

          <h2 className="mt-3 text-3xl font-black">
            How Worstbites judges you... I mean, restaurants.
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-gray-500">
            Worstbites combines restaurant rating, review volume,
            and negative review signals to produce a single risk
            score.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <AlgorithmStep
              number="01"
              title="Collect signals"
              text="Ratings, review volume and recurring complaints."
            />

            <AlgorithmStep
              number="02"
              title="Calculate risk"
              text="Negative signals are converted into a Worstbites score."
            />

            <AlgorithmStep
              number="03"
              title="Roast responsibly"
              text="The final score becomes a ranking and a brutally honest verdict."
            />

          </div>

        </div>


        {/* ===================================================
            BACK
        ==================================================== */}

        <div className="mt-14 pb-10 text-center">

          <Link
            href="/"
            className="inline-block rounded-xl bg-red-600 px-8 py-4 font-bold transition hover:bg-red-500"
          >
            ← Find another Worstbite
          </Link>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   SARCASTIC SCORE CARD
========================================================= */

function SarcasticCard({
  emoji,
  title,
  value,
  comment,
}: {
  emoji: string;
  title: string;
  value: number;
  comment: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/30">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span className="text-2xl">
            {emoji}
          </span>

          <h3 className="font-bold">
            {title}
          </h3>

        </div>

        <span className="font-black text-red-400">
          {value}%
        </span>

      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-red-500 transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

      <p className="mt-5 text-lg font-medium leading-7 text-gray-300">
        "{comment}"
      </p>

    </div>
  );
}


/* =========================================================
   ALGORITHM STEP
========================================================= */

function AlgorithmStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

      <span className="text-sm font-black text-red-500">
        {number}
      </span>

      <h3 className="mt-3 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-gray-600">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   MOCK PRAISE
========================================================= */

function getPraise(
  rating: number,
  foodScore: number,
  serviceScore: number
) {
  if (
    rating >= 4 &&
    foodScore < 50 &&
    serviceScore < 50
  ) {
    return "Against all odds, this place appears to be doing something right. We investigated. We found no immediate explanation.";
  }

  if (rating >= 3.5) {
    return "Look at that rating. People voluntarily came back. That's honestly more impressive than anything we're about to say.";
  }

  if (foodScore < 50) {
    return "The food might actually be the reason people keep coming back. We hate to admit it, but credit where credit is due.";
  }

  if (serviceScore < 50) {
    return "At least the staff seems to have discovered the revolutionary concept of helping customers.";
  }

  return "Well... the building is still standing, the food is technically food, and nobody mentioned calling the authorities. We'll take it.";
}