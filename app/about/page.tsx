import Link from "next/link";

export default function AboutPage() {
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
            Find Restaurants
          </Link>

        </div>
      </nav>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center">

        <div className="mb-6 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          🍔 Welcome to Worstbites
        </div>

        <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-7xl">

          Restaurants have ratings.

          <br />

          <span className="text-red-500">
            We have opinions.
          </span>

        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400">
          Worstbites is a restaurant intelligence concept that
          looks beyond the shiny star rating and asks the
          question nobody wants to ask:
        </p>

        <p className="mt-6 text-2xl font-black text-white sm:text-3xl">
          &quot;How likely am I to regret eating here?&quot;
        </p>

      </section>


      {/* =====================================================
          WHAT IS WORSTBITES
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 pb-20">

        <div className="grid gap-6 md:grid-cols-2">

          {/* WHAT IS WORSTBITES */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="text-4xl">
              🔍
            </div>

            <h2 className="mt-5 text-2xl font-black">
              What is Worstbites?
            </h2>

            <p className="mt-4 leading-8 text-gray-500">
              Worstbites turns restaurant ratings, complaints,
              and review patterns into a simple risk score.
              Instead of simply saying a restaurant has
              &quot;3.2 stars&quot;, we try to explain what those
              numbers actually mean.
            </p>

          </div>


          {/* WHY SARCASM */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <div className="text-4xl">
              🔥
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Why the sarcasm?
            </h2>

            <p className="mt-4 leading-8 text-gray-500">
              Because nobody wants another boring restaurant
              dashboard.
            </p>

            <p className="mt-4 leading-8 text-gray-500">
              Worstbites turns analysis into humorous,
              sarcastic commentary so that restaurant problems
              are easier to understand — and hopefully a lot
              more entertaining.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-5xl px-6 py-20">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              The Worstbites method
            </p>

            <h2 className="mt-3 text-4xl font-black">
              How does this thing work?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              It&apos;s actually pretty simple.
              The complicated part is making the roast funny.
            </p>

          </div>


          {/* STEPS */}

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* STEP 1 */}

            <div className="rounded-2xl border border-white/10 bg-black p-6">

              <span className="text-sm font-black text-red-500">
                01
              </span>

              <div className="mt-5 text-3xl">
                📊
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Collect the signals
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Ratings, review counts, food quality,
                service, hygiene, waiting time and
                value-for-money.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="rounded-2xl border border-white/10 bg-black p-6">

              <span className="text-sm font-black text-red-500">
                02
              </span>

              <div className="mt-5 text-3xl">
                🧮
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Calculate the risk
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Our scoring system combines the signals
                into a single Worstbites score from
                0 to 100.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="rounded-2xl border border-white/10 bg-black p-6">

              <span className="text-sm font-black text-red-500">
                03
              </span>

              <div className="mt-5 text-3xl">
                🔥
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Deliver the verdict
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                The numbers become a brutally honest,
                sarcastic restaurant analysis.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SCORE EXPLANATION
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-20">

        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 sm:p-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Understanding the score
          </p>

          <h2 className="mt-3 text-3xl font-black">
            The higher the number...
          </h2>

          <p className="mt-4 text-gray-500">
            ...the more likely Worstbites thinks you should
            reconsider your dinner plans.
          </p>


          {/* SCORE LEVELS */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <Score
              number="90–100"
              emoji="💀"
              label="RUN"
            />

            <Score
              number="80–89"
              emoji="🚨"
              label="THINK TWICE"
            />

            <Score
              number="70–79"
              emoji="😬"
              label="PROCEED WITH CAUTION"
            />

            <Score
              number="50–69"
              emoji="🤨"
              label="YOUR CALL"
            />

            <Score
              number="30–49"
              emoji="🙂"
              label="PROBABLY FINE"
            />

            <Score
              number="0–29"
              emoji="👑"
              label="SUSPICIOUSLY GOOD"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="border-t border-white/10">

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">

          <p className="text-4xl">
            🍽️
          </p>

          <h2 className="mt-5 text-4xl font-black sm:text-5xl">

            Hungry?

            <br />

            <span className="text-red-500">
              Make questionable decisions responsibly.
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-500">
            Search our restaurants and find out which places
            deserve your money... and which deserve a strongly
            worded review.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-red-600 px-8 py-4 font-black transition hover:bg-red-500"
          >
            🔥 Explore Restaurants
          </Link>

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
   SCORE COMPONENT
========================================================= */

function Score({
  number,
  emoji,
  label,
}: {
  number: string;
  emoji: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4">

      <span className="text-2xl">
        {emoji}
      </span>

      <div>

        <p className="text-xs text-gray-600">
          {number}
        </p>

        <p className="text-sm font-bold text-gray-300">
          {label}
        </p>

      </div>

    </div>
  );
}