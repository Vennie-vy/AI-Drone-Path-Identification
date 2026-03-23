import networkx as nx
import numpy as np

def nearest_node(point, feasible_points):
    distances = np.linalg.norm(feasible_points - point, axis=1)
    return np.argmin(distances)

def find_path(G, feasible_points, start, end):
    s = nearest_node(start, feasible_points)
    e = nearest_node(end, feasible_points)

    path_nodes = nx.shortest_path(G, s, e, weight="weight")
    path_coords = [feasible_points[n].tolist() for n in path_nodes]
    return path_coords