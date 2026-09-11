import { createClient } from "@/lib/supabase/server";

export default async function TestDatabase() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*");

  if (error) {
    return (
      <main className="p-10">
        <h1>Database Error</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1>Supabase Test</h1>

      <p>
        Restaurants found: {data.length}
      </p>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}