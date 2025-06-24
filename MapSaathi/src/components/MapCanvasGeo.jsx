import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const MapCanvasGeo = ({ onRegionClick }) => {
  const canvasRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [pulse, setPulse] = useState(0);

  // Load GeoJSON
  useEffect(() => {
    d3.json("/india.geojson").then((data) => {
      setGeoData(data);
    });
  }, []);

  // Pulse effect for animation
  useEffect(() => {
    let animation;
    const animate = () => {
      setPulse((prev) => (prev + 0.05) % (2 * Math.PI));
      animation = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animation);
  }, []);

  // Main Drawing
  useEffect(() => {
    if (!geoData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    const scale = 2;
    const width = 400;
    const height = 400;
    canvas.width = width*scale;
    canvas.height = height*scale;
    ctx.scale(scale, scale); // Scale the context for better resolution

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection).context(ctx);

    // Clear and paint black background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000"; // Black background
    ctx.fillRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

        // Draw boundaries only
    geoData.features.forEach((feature) => {
      ctx.beginPath();
      path(feature);
      path.pointRadius = 1; // Set point radius for better visibility
      ctx.strokeStyle =
        selectedFeature && selectedFeature === feature
          ? "#f97316" // Orange highlight
          : "#ffffff"; // Soft white boundaries
      ctx.lineWidth = selectedFeature && selectedFeature === feature ? 2 : 1;
      ctx.stroke();
    });


    // Highlight selected district only
    if (selectedFeature) {
      ctx.beginPath();
      path(selectedFeature);
      ctx.strokeStyle = "#f97316"; // orange
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Click event
    canvas.onclick = (e) => {
      const mouse = [e.offsetX, e.offsetY];
      for (const feature of geoData.features) {
        ctx.beginPath();
        path.pointRadius = 1; // Set point radius for better visibility
        path(feature);
        if (ctx.isPointInPath(...mouse)) {
          setSelectedFeature(feature);

          const props = feature.properties;
          onRegionClick({
            state: props.st_nm,
            district: props.district,
            code: props.st_code,
            year: props.year,
          });

          break; // Stop after first match
        }
      }
    };
  }, [geoData, selectedFeature]);

  return (
    <div className="shadow-lg rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="bg-black border border-neutral-800 rounded-xl"
      />
    </div>
  );
};

export default MapCanvasGeo;
