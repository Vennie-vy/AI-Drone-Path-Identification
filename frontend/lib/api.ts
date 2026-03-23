import axios from "axios";

const API = "http://localhost:8000";

export const fetchBaseStations = () =>
  axios.get(`${API}/base-stations`);

export const fetchPath = (start: number[], end: number[]) =>
  axios.post(`${API}/path`, { start, end });