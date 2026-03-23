"use client";

import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  Marker,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { fetchBaseStations, fetchPath } from "../lib/api";
import L from "leaflet";
import "leaflet.heat";

// Fixed Icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CENTER: [number, number] = [12.9716, 77.5946];

export default function RealMap() {
  const [baseStations, setBaseStations] = useState<[number, number][]>([]);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const [powerField, setPowerField] = useState<any[]>([]);
  const [zoom, setZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [isReportOpen, setIsReportOpen] = useState(true);

  useEffect(() => {
    fetchBaseStations().then((res) => {
      setBaseStations(res.data);
    });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/power-field")
      .then((res) => res.json())
      .then((data) => setPowerField(data));
  }, []);

  const handleCancel = () => {
    if (isLoading) setIsLoading(false);
    if (end) {
      setEnd(null);
      setPath([]);
      setReport(null);
    } else if (start) {
      setStart(null);
      setReport(null);
    }
  };

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    setIsLoading(false);
    setReport(null);
  };
const labelNode = (index: number) => {
  if (index === baseStations.length) return "SOURCE";
  if (index === baseStations.length + 1) return "DESTINATION";
  return `Base Station ${index}`;
};
  return (
    <div style={{ position: "relative" }}>
      {/* Loading */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            zIndex: 4000,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "20px 30px",
            borderRadius: "12px",
            fontSize: "18px",
          }}
        >
          🔄 Generating Optimal Power-Aware Path...
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          zIndex: 3000,
          top: 20,
          right: 20,
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={handleReset} style={buttonStyle("#ef4444")}>
          Reset
        </button>
        <button onClick={handleCancel} style={buttonStyle("#f59e0b")}>
          Cancel
        </button>
      </div>

      {/* MAP */}
      <MapContainer
        center={CENTER}
        zoom={12}
        style={{
          height: "90vh",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomListener setZoom={setZoom} />
        <HeatmapLayer data={powerField} />

        <MapClickHandler
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          setPath={setPath}
          setIsLoading={setIsLoading}
          setReport={(data: any) => {
            setReport(data);
            setIsReportOpen(true);
          }}
        />

        {zoom >= 14 &&
          baseStations.map((bs, i) => (
            <Circle
              key={i}
              center={bs}
              radius={600}
              pathOptions={{
                color: "#d42373",
                weight: 0.5,
                fillColor: "#4cc480",
                fillOpacity: 0.06,
              }}
            />
          ))}

        {start && (
          <Marker position={start}>
            <Tooltip permanent direction="top">
              Source
            </Tooltip>
          </Marker>
        )}

        {end && (
          <Marker position={end}>
            <Tooltip permanent direction="top">
              Destination
            </Tooltip>
          </Marker>
        )}

        {path.length > 0 && (
          <Polyline positions={path} pathOptions={{ color: "red", weight: 4 }} />
        )}
      </MapContainer>

      {/* DIM LAYER (ONLY MAP) */}
      {report && isReportOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "90vh",
            background: "rgba(0,0,0,0.35)",
            zIndex: 2000,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Floating Button */}
      {report && !isReportOpen && (
        <button
          onClick={() => setIsReportOpen(true)}
          style={{
            position: "absolute",
            right: 25,
            bottom: 25,
            width: 65,
            height: 65,
            borderRadius: "50%",
            background: "#111827",
            color: "white",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            zIndex: 3500,
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          }}
        >
          📊
        </button>
      )}

      {/* SIDEBAR */}
      {report && isReportOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: "100%",
            background: "#000000",
            zIndex: 3000,
            padding: 30,
            overflowY: "auto",
            boxShadow: "-5px 0 25px rgba(0,0,0,0.25)",
            borderLeft: "1px solid #e5e7eb",
            color: "#1f2937",
          }}
        >
          <button
            onClick={() => setIsReportOpen(false)}
            style={{
              position: "fixed",
              top: 15,
              right: 15,
              width: 35,
              height: 35,
              borderRadius: "50%",
              border: "none",
              background: "#ffffff",
              color: "black",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <h2 style={{ color: "#46b539", fontSize:"25px" }}>Power-Aware Path Report</h2>

          <h3 style={{ color: "#ffffff", fontWidth:"40px" }}>Summary</h3>
          <div style={{ fontSize: "15px", color: "#ffffff" }}>
            <p>Total Distance: {report.total_distance_km.toFixed(2)} km</p>
            <p>Min Power: {report.min_power.toFixed(4)}</p>
            <p>Avg Power: {report.avg_power.toFixed(4)}</p>
            <p>Max Power: {report.max_power.toFixed(4)}</p>
          </div>

          <hr style={{ margin: "20px 0", border: "0", borderTop: "1px solid #ffffff" }} />

          <h3 style={{ color: "#ffffff" }}>📡 Segments</h3>
          {report.segments.map((seg: any, i: number) => (
            <div key={i} style={segmentCardStyle}>
              <b style={{ color: "#ffffff", display: "block", marginBottom: "5px" }}>Segment {i + 1}</b>
              <div style={{ fontSize: "14px", color: "#ffffff" }}>
               <p>From: {labelNode(seg.from_index)}</p>
                <p>To: {labelNode(seg.to_index)}</p>
                <p>Distance: {seg.distance_km.toFixed(2)} km</p>
                <p>Power: {seg.power.toFixed(4)}</p>
                <p>Weight: {seg.weight.toFixed(4)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MapClickHandler({
  start,
  end,
  setStart,
  setEnd,
  setPath,
  setIsLoading,
  setReport,
}: any) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      if (!start) {
        setStart([lat, lng]);
        setEnd(null);
        setPath([]);
        setReport(null);
      } else if (!end) {
        setIsLoading(true);
        setEnd([lat, lng]);
        const res = await fetchPath(start, [lat, lng]);
        setPath(res.data.path);
        setReport(res.data.report);
        setIsLoading(false);
      } else {
        setStart([lat, lng]);
        setEnd(null);
        setPath([]);
        setReport(null);
      }
    },
  });

  return null;
}

function ZoomListener({ setZoom }: { setZoom: (z: number) => void }) {
  const map = useMap();
  useEffect(() => {
    setZoom(map.getZoom());
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, setZoom]);
  return null;
}

function HeatmapLayer({ data }: { data: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;
    const heatData = data.map((p) => [
      p.lat,
      p.lng,
      Math.max(0, Math.min(1, p.power * 5)),
    ]);
    const heatLayer = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });
    heatLayer.addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);
  return null;
}

const buttonStyle = (color: string) => ({
  padding: "8px 14px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
});

const segmentCardStyle = {
  marginBottom: "18px",
  padding: "15px",
  borderRadius: "10px",
  background: "#000000",
  border: "1px solid #2fae37",
};