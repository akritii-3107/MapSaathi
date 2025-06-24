import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const AddToCanvas = ({ onSelectPoint }) => {
  const canvasRef = useRef();
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    d3.json("/state_level_india.geojson").then((data) => {
      setGeoData(data);
    });
  }, []);

  useEffect(() => {
    if (!geoData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 400;
    const height = 400;
    const scaleFactor = 2;

    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Projection
    const projection = d3.geoMercator()
      .center([82.8, 22.5])
      .scale(650)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection).context(ctx);

    // Combine all features into a single outer path
    const combined = {
      type: "FeatureCollection",
      features: geoData.features
    };

    ctx.beginPath();
    path(combined);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Click interaction to get lat/lon
    canvas.onclick = (e) => {
      const mouseX = e.offsetX / scaleFactor;
      const mouseY = e.offsetY / scaleFactor;
      const [lon, lat] = projection.invert([mouseX, mouseY]);

      if (onSelectPoint) {
        onSelectPoint({ lat, lon });
      }

      // Add marker
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#f97316";
      ctx.fill();
    };
  }, [geoData]);

  return (
    <div className="shadow-lg rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="bg-black border border-neutral-800 rounded-xl"
      />
    </div>
  );
};

export default AddToCanvas;
