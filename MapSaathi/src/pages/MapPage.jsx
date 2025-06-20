import { useState } from "react";
import DetailedInfoPanel from '../components/DetailedInfoPanel';
import MapCanvasGeo from '../components/MapCanvasGeo';
import { Link } from "react-router-dom";

const MapPage = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold mb-4">India Map</h1>
              <Link to="/" className="mt-6 text-sm text-blue-400 hover:underline">
        ← Back to Home
      </Link>
      
      <MapCanvasGeo onRegionClick={setSelectedRegion} />
      <DetailedInfoPanel region={selectedRegion} />

    </div>
  );
};

export default MapPage;

