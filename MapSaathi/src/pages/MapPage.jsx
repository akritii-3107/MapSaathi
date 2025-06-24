import { useState } from "react";
import { Link } from "react-router-dom";
import AddToCanvas from "../components/AddToCanvas";

const MapPage = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-10 font-sans">
      
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">MapSaathi</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Add themes, mark locations, and export GeoJSON visuals using India's map outline.
        </p>
      </header>

      
      {/* Back Link */}
      <Link to="/" className="text-sm text-blue-400 hover:underline mb-6">
        ← Back to Home
      </Link>

      {/* Canvas Section */}
      <div className="relative z-0 mb-6">
        <AddToCanvas onSelectPoint={(point) => setSelectedRegion(point)} />
      </div>


      {/* Footer */}
      <footer className="text-gray-500 text-xs">
        @2025 MapSaathi. All rights reserved.
      </footer>
    </div>
  );
};

export default MapPage;


