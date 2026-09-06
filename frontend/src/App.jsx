import { MapPin, ArrowRight } from "lucide-react";

function App() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">

        <p className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-6">
          Tourism Management System
        </p>

        <h1 className="font-['Playfair_Display'] text-6xl md:text-7xl text-[#1C1C1C] mb-6">
          TRAVELIA
        </h1>

        <p className="text-lg text-[#77736D] max-w-xl mx-auto leading-relaxed mb-10">
          Discover destinations, manage journeys, and create
          unforgettable travel experiences.
        </p>

        <button className="inline-flex items-center gap-3 bg-[#1C1C1C] text-white px-6 py-3 rounded-lg hover:bg-[#333333] transition">
          Explore dashboard
          <ArrowRight size={18} />
        </button>

      </div>
    </main>
  );
}

export default App;