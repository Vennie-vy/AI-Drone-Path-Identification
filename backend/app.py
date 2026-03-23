from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import BASE_STATIONS
from power_model import haversine
import numpy as np
import networkx as nx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MIN_POWER = 0.05


# -----------------------------
# Root
# -----------------------------
@app.get("/")
def root():
    return {"message": "AI Drone Highway Backend Running"}


# -----------------------------
# Base Stations
# -----------------------------
@app.get("/base-stations")
def get_bs():
    return BASE_STATIONS.tolist()


# -----------------------------
# Path Computation
# -----------------------------
@app.post("/path")
def compute_path(data: dict):
    start = data["start"]
    end = data["end"]

    points = np.vstack([BASE_STATIONS, start, end])
    G = nx.Graph()

    segment_data = {}

    for i in range(len(points)):
        for j in range(i + 1, len(points)):
            d = haversine(
                points[i][0], points[i][1],
                points[j][0], points[j][1]
            )

            power = 1 / (d * d + 0.001)

            if power >= MIN_POWER:
                weight = 1 / power
                G.add_edge(i, j, weight=weight)

                segment_data[(i, j)] = {
                    "distance_km": float(d),
                    "power": float(power),
                    "weight": float(weight)
                }

    start_index = len(points) - 2
    end_index = len(points) - 1

    path_indices = nx.shortest_path(G, start_index, end_index, weight="weight")

    path_coords = [points[i].tolist() for i in path_indices]

    # -------- Build Report --------
    segments = []
    total_distance = 0
    powers = []

    for k in range(len(path_indices) - 1):
        i = path_indices[k]
        j = path_indices[k + 1]

        key = (i, j) if (i, j) in segment_data else (j, i)
        data_seg = segment_data[key]
        total_distance += data_seg["distance_km"]
        powers.append(data_seg["power"])

        segments.append({
            "from_index": int(i),
            "to_index": int(j),
            "distance_km": data_seg["distance_km"],
            "power": data_seg["power"],
            "weight": data_seg["weight"]
        })

    report = {
        "segments": segments,
        "total_distance_km": total_distance,
        "min_power": min(powers),
        "avg_power": sum(powers) / len(powers),
        "max_power": max(powers)
    }

    return {
        "path": path_coords,
        "report": report
    }


# -----------------------------
# Power Field for Heatmap
# -----------------------------
@app.get("/power-field")
def power_field():
    results = []

    # Define Bangalore bounding box
    lat_min, lat_max = 12.85, 13.05
    lng_min, lng_max = 77.45, 77.75

    step = 0.02  # smaller = more detailed, heavier

    lat_vals = np.arange(lat_min, lat_max, step)
    lng_vals = np.arange(lng_min, lng_max, step)

    for lat in lat_vals:
        for lng in lng_vals:

            # Find strongest signal from all towers
            max_power = 0

            for bs in BASE_STATIONS:
                d = haversine(lat, lng, bs[0], bs[1])
                power = 1 / (d * d + 0.001)
                max_power = max(max_power, power)

            results.append({
                "lat": float(lat),
                "lng": float(lng),
                "power": float(max_power)
            })

    return results