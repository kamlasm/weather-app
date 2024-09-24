import Weather from "@/components/Weather";

export default function Home() {
  return (
    <div className="min-h-screen p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-xl">
          WEATHER
        </h1>

        <Weather />

      </main>
    </div>
  );
} 
