import numpy as np

GRID_RES = 0.01

LAT_MIN, LAT_MAX = 12.85, 13.05
LON_MIN, LON_MAX = 77.50, 77.70

NUM_STATIONS = 800

BASE_STATIONS = np.column_stack((
    np.random.uniform(LAT_MIN, LAT_MAX, NUM_STATIONS),
    np.random.uniform(LON_MIN, LON_MAX, NUM_STATIONS)
))