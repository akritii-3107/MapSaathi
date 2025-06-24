import * as d3 from "d3";
import { useEffect, useRef, useState, useCallback } from "react";

const StateCanvas = ({ onRegionClick, mode = "district" }) => {
  const canvasRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  // Store projection and path at component level for reuse
  const projectionRef = useRef(null);
  const pathRef = useRef(null);
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    setIsLoading(true);
    const file =
      mode === "state"
        ? "/state_level_with_districts.geojson"
        : "/cleaned_districts.geojson";
    
    d3.json(file)
      .then((data) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
        setIsLoading(false);
      });
  }, [mode]);

  // Define render function separately for reuse
  const renderMap = useCallback(() => {
    if (!geoData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;

    const scale = window.devicePixelRatio || 2; // Better support for various displays
    const width = 700;
    const height = 700; 

    // Set canvas dimensions
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // Create or reuse projection
    if (!projectionRef.current) {
      projectionRef.current = d3.geoMercator().fitSize([width, height], geoData);
      pathRef.current = d3.geoPath().projection(projectionRef.current).context(ctx);
    }
    
    const path = pathRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    // First pass: Draw all region outlines
    geoData.features.forEach((feature) => {
      ctx.beginPath();
      path(feature);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Second pass: Draw selected region with highlighting
    if (selectedFeature) {
      ctx.beginPath();
      path(selectedFeature);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [geoData, selectedFeature]);

  // Initial rendering and re-render on data/selection changes
  useEffect(() => {
    renderMap();
  }, [geoData, selectedFeature, renderMap]);

  // Handle click interactions
  useEffect(() => {
    if (!geoData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / rect.width;
      
      // Calculate correct mouse position accounting for canvas scaling and positioning
      const mouseX = (e.clientX - rect.left) * scale;
      const mouseY = (e.clientY - rect.top) * scale;
      
      const ctx = canvas.getContext("2d");
      const path = pathRef.current;
      
      // Find clicked feature
      let clickedFeature = null;
      
      // Iterate in reverse to handle overlapping regions properly (top layer first)
      for (let i = geoData.features.length - 1; i >= 0; i--) {
        const feature = geoData.features[i];
        ctx.beginPath();
        path(feature);
        
        if (ctx.isPointInPath(mouseX, mouseY)) {
          clickedFeature = feature;
          break; // Stop at the first match (topmost visible feature)
        }
      }
      
      if (clickedFeature) {
        setSelectedFeature(clickedFeature);
        const props = clickedFeature.properties;
        
        onRegionClick({
          state: props.st_nm || props.state || null,
          district:
            mode === "district"
              ? props.district || null
              : Array.isArray(props.district_y)
              ? props.district_y.join(", ")
              : props.district_x || null,
          year: props.year || null,
          districtCount :
            mode === "state" 
              ? props.district_count
              : null,
        });
      }
    };
    
    canvas.addEventListener("click", handleClick);
    
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [geoData, mode, onRegionClick]);

  // Add resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Reset projection when window size changes
      projectionRef.current = null;
      renderMap();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderMap]);

  return (
    <div className="shadow-lg rounded-xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white">Loading map...</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="bg-black border border-neutral-800 rounded-xl"
      />
    </div>
  );
};

export default StateCanvas;




