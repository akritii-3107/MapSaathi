import { useState } from 'react'
import { Link } from "react-router-dom"
import StateCanvas from './components/StateCanvas'
import InfoModal from './components/InfoModal'
import './App.css'

function App() {
  const [regionInfo, setRegionInfo] = useState(null)
  const [mapMode, setMapMode] = useState("state")
  const [modalOpen, setModalOpen] = useState(false)

  const handleRegionClick = (region) => {
    setRegionInfo(region)
    setModalOpen(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-10 font-sans">
      {/* Heading */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">MapSaathi</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Explore India by district or state. Click on any region to view detailed insights.
        </p>
      </header>

{/*Glassmorphic Toggle Buttons */}
<div className="flex justify-center my-4">
  <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-full p-1.5 shadow-xl flex gap-2 transition-all duration-500 hover:bg-black/40">
    <button
      className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
        mapMode === "district"
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
      }`}
      onClick={() => setMapMode("district")}
    >
      District View
    </button>
    <button
      className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
        mapMode === "state"
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
      }`}
      onClick={() => setMapMode("state")}
    >
      State View
    </button>
  </div>
</div>
      {/* Map Canvas */}
      <div className="relative z-0">
        <StateCanvas mode={mapMode} onRegionClick={handleRegionClick} />
      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        region={regionInfo}
        mapMode={mapMode}
      />

      {/* Footer Button */}
      <footer className="mt-10">
        @2025 MapSaathi. All rights reserved.
      </footer>
    </div>
  )
}

export default App
