let aStar = {

	dungeon: {
		rows: 40,
		columns: 40,
		rooms: []
	},

	getShortestPath: function(startLoc, goalLoc, goalRoom, rooms) {
		this.dungeon.rooms = rooms;
		let grid = [];
		for (let x = 0; x < this.dungeon.rows; x++) {
			grid[x] = [this.dungeon.columns];
			for (let y = 0; y < this.dungeon.columns; y++) {
				let node = {};
				node.loc = [x, y];
				node.f = Infinity;
				node.g = Infinity;
				node.visited = false;
				node.closed = false;
				node.parent = null;
				node.type = this.getSquare(x, y);
				grid[x][y] = node;
			}
		}

		// console.log("We're starting at " + startLoc);
		// console.log("We're going to " + goalLoc);
		let start = grid[startLoc[0]][startLoc[1]];
		let goal = grid[goalLoc[0]][goalLoc[1]];

		let openList = [];
		openList.push(start);
		start.g = 0;
		start.f = this.aHeuristic(start, goal);
		// let i = 0;

		while (openList.length > 0) {
			// console.log("Open list:");
			// console.log(openList);
			let current = this.aGetLowestF(openList);
			// console.log("Current:");
			// console.log(current);

			if (current.loc[0] == goal.loc[0] && current.loc[1] == goal.loc[1]) {
				// console.log("Found the end!");
				return this.aReconstruct(current);
			}
			current.closed = true;
			current.visited = true;
			openList.splice(openList.indexOf(current), 1);

			for (let neighbor of this.aGetNeighbors(grid, current, goalRoom)) {
				let tentativeGScore = current.g + 1;
				
				if (!neighbor.visited || tentativeGScore < neighbor.g) {
					neighbor.parent = current;
					neighbor.g = tentativeGScore;
					neighbor.f = neighbor.g + this.aHeuristic(neighbor, goal);

					if (!neighbor.visited) {
						openList.push(neighbor);
					}
					neighbor.visited = true;
				}
			}
			// i++;
		}
		// console.log("We failed.");
		return [];
	},

	aHasOpenNodes: function(grid) {
		for (let x = 0; x < grid.length; x++) {
			for (let y = 0; y < grid.length; y++) {
				if (!grid[x][y].closed) return true;
			}
		}
		return false;
	},

	aGetLowestF: function(nodes) {
		let lowestNode = null;
		for (let node of nodes) {
			if (node.closed) continue;
			if (lowestNode == null) {
				lowestNode = node;
				continue;
			}
			if (lowestNode.f > node.f) lowestNode = node;
		}

		return lowestNode;
	},

	aGetNeighbors: function(grid, node, goalRoom) {
		let neighbors = [];
		node = node.loc;
		if (node[0] != 0) neighbors.push([node[0]-1, node[1]]);
		if (node[0] != this.dungeon.columns - 1) neighbors.push([node[0]+1, node[1]]);
		if (node[1] != 0) neighbors.push([node[0], node[1]-1]);
		if (node[1] != this.dungeon.rows - 1) neighbors.push([node[0], node[1]+1]);

		if (this.dungeon.allowDiagonalMovement) {
			if (node[0] != 0) {
				if (node[1] != 0) neighbors.push([node[0]-1, node[1]-1]);
				if (node[1] != this.dungeon.rows - 1) neighbors.push([node[0]-1, node[1]+1]);
			}
			if (node[0] != this.dungeon.columns - 1) {
				if (node[1] != 0) neighbors.push([node[0]+1, node[1]-1]);
				if (node[1] != this.dungeon.rows - 1) neighbors.push([node[0]+1, node[1]+1]);
			} 
		}
		// console.log(neighbors);

		let allowedNeighbors = [];
		for (let neighbor of neighbors) {
			// console.log(neighbor);
			let isAllowed = true;
			for (let room of this.dungeon.rooms) {
				let expansion = 0;
				if (room != goalRoom && room != this.dungeon.rooms[0]) expansion = 2;
				if (this.containsNode(room, neighbor, expansion)) {
					isAllowed = false;
					for (let door of room.doors) {
						if (door.loc[0] == neighbor[0] && door.loc[1] == neighbor[1]) {
							isAllowed = true;
						}
					}
					if (!isAllowed) break;
				}
				if (isAllowed) {
					for (let square of room.pathTo) {
						if (square[0] == neighbor[0] && square[1] == neighbor[1]) {
							isAllowed = false;
						} 
						else if (Math.abs(square[0] - neighbor[0]) == 1 && square[1] == neighbor[1]) {
							isAllowed = false;
						} 
						else if (Math.abs(square[1] - neighbor[1]) == 1 && square[0] == neighbor[0]) {
							isAllowed = false;
						}
					}
					if (!isAllowed) break;
			}
			}
			if (isAllowed) {
				allowedNeighbors.push(grid[neighbor[0]][neighbor[1]]);
			}
		}

		// console.log(10);
		return allowedNeighbors;
	},

	aHeuristic: function(node, goal) {
		return Math.abs(node.loc[0] - goal.loc[0]) + Math.abs(node.loc[1] - goal.loc[1]);
	},

	aReconstruct: function(current) {
		let totalPath = [current.loc];
		while (current.parent) {
			totalPath.unshift(current.parent.loc);
			current = current.parent;
		}
		return totalPath;
	},

	containsNode: function(room, node, expansion=0) {
		if (
			node[0] >= room.loc[0] - expansion && 
			node[0] < room.loc[0] + room.width + expansion
		) {
			if (
				node[1] >= room.loc[1] - expansion && 
				node[1] < room.loc[1] + room.height + expansion
			) {
				return true;
			}
		}
		return false;
	},

	getSquare: function(x, y) {
		for (let room of this.dungeon.rooms) {
			for (let door of room.doors) {
				if (door.loc[0] == x && door.loc[1] == y) return "door";
			}	
			if ((
				x >= room.loc[0] && 
				x <= room.loc[0] + room.width - 1
			) && (
				y >= room.loc[1] && 
				y <= room.loc[1] + room.height - 1
			)) {
				if (
					x == room.loc[0] || 
					x == room.loc[0] + room.width - 1 || 
					y == room.loc[1] || 
					y == room.loc[1] + room.height - 1
				) return "wall";
				return "floor";
			}
		}
		return null;
	}
}

export default aStar;