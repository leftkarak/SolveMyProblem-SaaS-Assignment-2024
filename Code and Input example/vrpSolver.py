import json
import os
import sys
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from math import radians, sin, cos, sqrt, atan2


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great-circle distance between two points on the Earth's surface."""
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = 6371 * c  # Earth radius in kilometers
    return int(round(1000 * distance))


def calculate_distance_matrix(locations):
    """Calculate distance matrix based on Haversine distance."""
    num_locations = len(locations)
    distance_matrix = [[0] * num_locations for _ in range(num_locations)]

    for i in range(num_locations):
        for j in range(num_locations):
            lat1, lon1 = locations[i]['Latitude'], locations[i]['Longitude']
            lat2, lon2 = locations[j]['Latitude'], locations[j]['Longitude']
            distance_matrix[i][j] = haversine_distance(lat1, lon1, lat2, lon2)
    return distance_matrix


def create_data_model(locations, num_vehicles, depot):
    """Stores the data for the problem."""
    data = {}
    data['distance_matrix'] = calculate_distance_matrix(locations)
    data['num_vehicles'] = num_vehicles
    data['depot'] = depot
    return data


def print_solution(data, manager, routing, solution):
    """Prints solution on console."""
    print(f"Objective: {solution.ObjectiveValue()}")
    max_route_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        plan_output = f"Route for vehicle {vehicle_id}:\n"
        route_distance = 0
        while not routing.IsEnd(index):
            plan_output += f" {manager.IndexToNode(index)} -> "
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )
        plan_output += f"{manager.IndexToNode(index)}\n"
        plan_output += f"Distance of the route: {route_distance}m\n"
        print(plan_output)
        max_route_distance = max(route_distance, max_route_distance)
    print(f"Maximum of the route distances: {max_route_distance}m")


def read_json_file(file_path):
    """Read JSON file and extract locations, num_vehicles, depot, and max_distance."""
    with open(file_path, 'r') as file:
        data = json.load(file)
        locations = data.get('Locations', [])
        num_vehicles = data.get('num_vehicles', 1)  # Default to 1 vehicle
        depot = data.get('depot', 0)  # Default depot index
        max_distance = data.get('max_distance', 10000)  # Default max distance in meters
        return locations, num_vehicles, depot, max_distance


def main():
    """Entry point of the program."""
    if len(sys.argv) != 2:
        print("Usage: python <script_name.py> <input_file.json>")
        sys.exit(1)

    # Load the input JSON file
    input_file = sys.argv[1]
    locations, num_vehicles, depot, max_distance = read_json_file(input_file)
    #print(f"Data: {locations}, Vehicles: {num_vehicles}, Depot: {depot}, Max Distance: {max_distance}")

    # Create the data model
    data = create_data_model(locations, num_vehicles, depot)

    # Create the routing index manager
    manager = pywrapcp.RoutingIndexManager(
        len(data['distance_matrix']), data['num_vehicles'], data['depot']
    )

    # Create the routing model
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add Distance constraint
    dimension_name = 'Distance'
    routing.AddDimension(
        transit_callback_index,
        0,  # no slack
        max_distance,  # vehicle maximum travel distance
        True,  # start cumul to zero
        dimension_name,
    )
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Setting first solution heuristic
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console
    if solution:
        print_solution(data, manager, routing, solution)
    else:
        print("No solution found!")


if __name__ == '__main__':
    main()

