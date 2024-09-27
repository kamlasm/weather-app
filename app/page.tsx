import Weather from "@/components/Weather";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-sky-50 text-sky-800 text-md">
      <main className="flex flex-col gap-8 items-center text-center">
        <Weather />
      </main>
    </div>
  );
} 
