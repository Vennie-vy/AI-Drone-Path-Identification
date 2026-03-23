# 🚁 AI Drone Path Identification using Signal Strength

## 📌 Overview

This project presents a **signal-aware drone navigation system** that identifies the optimal path between a source and destination using **base station signal strength**.

Instead of shortest distance, the system prioritizes **maximum connectivity**, ensuring reliable drone communication in urban environments.

---

## 🎯 Problem Statement

Drone navigation in cities faces major challenges:

* 📡 Signal strength fluctuations due to buildings
* 🏢 Urban obstacles causing connectivity loss
* ❌ Traditional path planning ignores communication quality

---

## 💡 Solution

This system introduces:

* 📡 Signal-based path planning
* 🧠 Graph-based optimization
* ⚡ Dijkstra’s algorithm for best route selection

---

## ⚙️ System Workflow

1. User selects **source and destination** on the map
2. The map is divided into **nodes (graph representation)**
3. Signal strength is calculated using distance
4. Nodes are connected with weighted edges
5. **Dijkstra’s algorithm** finds the optimal path
6. Path is displayed on the map

---

## 🧠 Algorithm Used

### Dijkstra’s Algorithm

* Finds optimal path in a graph
* Uses **signal strength as weight**
* Ensures maximum connectivity route

---

## 📊 Dataset

* Simulated base stations
* Each includes:

  * Latitude
  * Longitude
  * Signal power

*(Used due to lack of real telecom datasets)*

---

## 🖥️ Tech Stack

### 🔹 Backend (`/backend`)

* Python
* FastAPI
* Signal calculation logic

**Key Files:**

* `app.py` → API endpoints
* `config.py` → Base station data
* `pathfinder.py` → Dijkstra implementation
* `power_model.py` → Signal strength calculation

---

### 🔹 Frontend (`/frontend`)

* Next.js
* React
* Map-based visualization

**Key Files:**

* `MapWrapper.tsx` → Map integration
* `RealMap.tsx` → Path visualization
* `page.tsx` → Main UI

---

## 📂 Project Structure

```
AI-Drone-Path-Identification/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── pathfinder.py
│   ├── power_model.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## 🚀 Features

* ✅ Signal-aware path planning
* ✅ Dynamic source & destination selection
* ✅ Graph-based optimization
* ✅ Interactive map visualization

---

## 📸 Demo

* Select source and destination
* System generates optimal path
* Path avoids weak signal regions

*(Add screenshots here for better presentation)*

---

## ⚠️ Limitations

* Uses simulated data
* No real-time obstacle detection
* Static environment assumptions

---

## 🔮 Future Scope

* 📡 Real telecom data integration
* 🧠 AI-based obstacle avoidance
* 🌍 3D drone navigation
* ⚡ Real-time adaptive routing

---

## ▶️ How to Run

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 📢 Conclusion

This project demonstrates how **communication-aware routing** can improve drone navigation by ensuring **stable connectivity throughout the path**.

---

## 🤝 Contribution

Open to improvements and suggestions!
