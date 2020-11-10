<template>
	<v-container id="p5Container">
		<VueP5 v-on="this" @mouseclicked="p5Click()" @mousemoved="p5Mousemoved()" />
	</v-container>
</template>

<script>
import VueP5 from 'vue-p5'

export default {
	components: {
		VueP5
	},
	data: () => ({
		el: "#p5Container",
		p5: {
			sketch: null,
			sketchHeight: 0,
			sketchWidth: 0,
			isMoving: false,
			mouseLoc: [],
			isPaused: false,
			cutsceneActive: false,
			squaresPerMove: [1, 1],
			frameRate: 15,
			cutsceneLagTime: .3
		},
		dungeon: {
			allowDiagonalMovement: false,
			quadrants: {
				LEFT: { loc: [1, 13], width: 16, height: 16, index: 0 },
				TOP: { loc: [1, 1], width: 38, height: 9, index: 1 },
				RIGHT: { loc: [23, 13], width: 16, height: 16, index: 2 },
				BOTTOM: { loc: [1, 30], width: 38, height: 9, index: 3 }
			},
			colors: {
				darkness: 0,
				grid: 20,
				wall: 40,
				door: 70,
				passage: 90,
				hoveredPassage: 120,
				hoveredFloor: 70,
				litFloor: 255
			},
			gridLineWidth: 1,
			doorWidth: 10,
			rows: 0,
			columns: 0,
			grid: null,
			squareDimensions: [0, 0],
			minRoomLegLength: 5,
			maxRoomLegLength: 10,
			rooms: [
				{
					isShown: true,
					isLit: true,
					isHovered: false,
					loc: [18, 31],
					goalLoc: null,
					width: 5,
					height: 5,
					doors: [
						{ loc: [18, 34], shown: true },
						{ loc: [], shown: true },
						{ loc: [22, 32], shown: true },
						{ loc: [], shown: true }
					],
					pathsFrom: [],
					pathsTo: [],
					quadrant: "BOTTOM"
				},
			]
		}
	}),
	methods: {
		aStar(start, goal, goalRoom) {
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
					node.type = this.dungeon.grid[x][y];
					grid[x][y] = node;
				}
			}

			// console.log("We're starting at " + start);
			// console.log("We're going to " + goal);
			start = grid[start[0]][start[1]];
			goal = grid[goal[0]][goal[1]];

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
			console.log("We failed.");
			return [];
		},
		aHasOpenNodes(grid) {
			for (let x = 0; x < grid.length; x++) {
				for (let y = 0; y < grid.length; y++) {
					if (!grid[x][y].closed) return true;
				}
			}
			return false;
		},
		aGetLowestF(nodes) {
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
		aGetNeighbors(grid, node, goalRoom) {
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

			let allowedNeighbors = [];
			for (let neighbor of neighbors) {
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
						for (let passage of room.pathsTo) {
							for (let square of passage) {
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
				}
				if (isAllowed) {
					allowedNeighbors.push(grid[neighbor[0]][neighbor[1]]);
				}
			}

			// console.log(10);
			return allowedNeighbors;
		},
		aHeuristic(node, goal) {
			return Math.abs(node.loc[0] - goal.loc[0]) + Math.abs(node.loc[1] - goal.loc[1]);
		},
		aReconstruct(current) {
			let totalPath = [current.loc];
			while (current.parent) {
				totalPath.unshift(current.parent.loc);
				current = current.parent;
			}
			return totalPath;
		},
		containsNode(room, node, expansion=0) {
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
		setup(sketch) {
			this.p5.sketch = sketch;
			this.p5.sketchHeight = 800;
			this.p5.sketchWidth = 800;
			this.dungeon.columns = 40;
			this.dungeon.rows = 40;
			sketch.frameRate(this.p5.frameRate);
			sketch.resizeCanvas(this.p5.sketchWidth, this.p5.sketchHeight);
			this.initializeDungeon();
		},
		draw(sketch) {
			this.drawDungeon(sketch);

			if (!this.p5.cutsceneActive) sketch.noLoop();
			else sketch.loop();
		},
		initializeDungeon() {
			this.dungeon.grid = [];
			for (let x=0; x<this.dungeon.columns; x++) {
				this.dungeon.grid[x] = [];
				for (let y=0; y<this.dungeon.rows; y++) {
					this.dungeon.grid[x][y] = this.getSquare(x, y);
				}
			}
			this.dungeon.squareDimensions = [
				(this.p5.sketchWidth - 2) / this.dungeon.rows, 
				(this.p5.sketchHeight - 2) / this.dungeon.columns
			];

			this.generateAllRooms();
		},
		generateAllRooms() {
			if (this.dungeon.rooms.length == 1) this.generateRandomRoom();
			if (this.dungeon.rooms.length == 2) this.generateRandomRoom();
			if (this.dungeon.rooms.length == 3) this.generateRandomRoom(false);

			this.getPassage(this.dungeon.rooms[0], this.dungeon.rooms[1]);
			this.getPassage(this.dungeon.rooms[0], this.dungeon.rooms[2]);
			this.getPassage(this.dungeon.rooms[0], this.dungeon.rooms[3]);
		},
		getPassage(roomOne, roomTwo) {
			let doorIndex = this.dungeon.quadrants[roomTwo.quadrant].index;
			let startingDoor = roomOne.doors[doorIndex];
			if (startingDoor.loc.length == 0) {
				let doorSides = [doorIndex];
				this.addRandomDoor(roomOne, doorSides);
			}
			startingDoor = roomOne.doors[doorIndex];

			let passage = this.aStar(
				startingDoor.loc,
				roomTwo.doors.filter(door => door.loc.length > 0)[0].loc,
				roomTwo
			)
			roomOne.pathsFrom.push(passage);
			roomTwo.pathsTo.push(passage);
		},
		getOpenQuadrants() {
			let openQuadrants = [ "LEFT", "TOP", "RIGHT" ];
			for (let room of this.dungeon.rooms) {
				openQuadrants = openQuadrants.filter(quadrant => 
					quadrant != room.quadrant 
				);
			}
			return openQuadrants;
		},
		getRandomQuadrant() {
			let openQuadrants = this.getOpenQuadrants();
			if (openQuadrants.length == 0) return null;
			let chosenQuadrant = openQuadrants[Math.floor(Math.random() * openQuadrants.length)];
			return chosenQuadrant;
		},
		generateRandomRoom(isShown=true) {
			let quadrantName = this.getRandomQuadrant();
			// console.log(quadrantName);
			let quadrant = this.dungeon.quadrants[quadrantName];
			let x = this.getRandomIntInRange(
				quadrant.loc[0] + 1, 
				quadrant.loc[0] + quadrant.width - this.dungeon.minRoomLegLength
			);
			// console.log(x);
			let y = this.getRandomIntInRange(
				quadrant.loc[1] + 1, 
				quadrant.loc[1] + quadrant.height - this.dungeon.minRoomLegLength
			);
			// console.log(y);
			let width = this.getRandomIntInRange(
				this.dungeon.minRoomLegLength,
				Math.min(quadrant.width - (x - quadrant.loc[0]), this.dungeon.maxRoomLegLength)
			);
			// console.log(width);
			let height = this.getRandomIntInRange(
				this.dungeon.minRoomLegLength,
				Math.min(quadrant.height - (y - quadrant.loc[1]), this.dungeon.maxRoomLegLength)
			);
			// console.log(height);
			let room = {
				isShown: isShown,
				isLit: false,
				isHovered: false,
				loc: [x, y],
				width: width,
				height: height,
				doors: [
					{ loc: [], isShown: true },
					{ loc: [], isShown: true },
					{ loc: [], isShown: true },
					{ loc: [], isShown: true }
				],
				pathsFrom: [],
				pathsTo: [],
				quadrant: quadrantName
			}
			this.dungeon.rooms.push(room);
			
			this.addRandomDoor(room);
		},
		addRandomDoor(room, sidesAllowed=[0, 2, 3]) {
			let side = this.getRandomFromArray(sidesAllowed);
			let doorLoc = [0, 0];
			if (side == 0) {
				doorLoc = [
					room.loc[0], 
					this.getRandomIntInRange(room.loc[1] + 1, room.loc[1] + room.height-2)
				];
			}
			else if (side == 1) {
				doorLoc = [
					this.getRandomIntInRange(room.loc[0] + 1, room.loc[0] + room.width-2), 
					room.loc[1]
				];
			}
			else if (side == 2) {
				doorLoc = [
					room.loc[0] + room.width - 1, 
					this.getRandomIntInRange(room.loc[1] + 1, room.loc[1] + room.height-2)
				];
			}
			else if (side == 3) {
				doorLoc = [
					this.getRandomIntInRange(room.loc[0] + 1, room.loc[0] + room.width-2), 
					room.loc[1] + room.height - 1
				];
			}
			// let door = { loc: doorLoc, isShown: true };
			let door = { loc: doorLoc, isShown: false };
			
			room.doors[side] = door;
		},
		getRandomIntInRange(minInclusive, maxInclusive) {
			return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
		},
		getRandomFromArray(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		},
		getSquare(x, y) {
			for (let room of this.dungeon.rooms) {
				for (let door of room.doors) {
					if (door.loc[0] == x && door.loc[1] == y) return "door";
				}	
				if ((x >= room.loc[0] && x <= room.loc[0] + room.width - 1) && (y >= room.loc[1] && y <= room.loc[1] + room.height - 1)) {
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
		},
		drawDungeon(sketch) {
			// console.log("Starting count:");
			// let lapTime = new Date().getTime();
			this.drawBackground(sketch);
			// console.log(`Background took ${(new Date().getTime() - lapTime) * 1000} seconds.`);
			// lapTime = new Date().getTime();
			// this.drawQuadrants(sketch);
			// console.log(`Quadrants took ${(new Date().getTime() - lapTime) * 1000} seconds.`);
			// lapTime = new Date().getTime();
			this.drawRooms(sketch);
			// console.log(`Rooms took ${(new Date().getTime() - lapTime) * 1000} seconds.`);
			// lapTime = new Date().getTime();
			if (this.p5.isMoving) return;
			this.drawGrid(sketch);
			// console.log(`Grid took ${(new Date().getTime() - lapTime) * 1000} seconds.`);
		},
		drawGrid(sketch) {
			sketch.push();
			sketch.stroke(this.dungeon.colors.grid);
			sketch.strokeWeight(this.dungeon.gridLineWidth);
			for (let x=0; x<=this.dungeon.columns; x++) {
				sketch.line(
					this.dungeon.squareDimensions[0] * x + Math.floor(this.dungeon.gridLineWidth/2), 
					0, 
					this.dungeon.squareDimensions[0] * x + Math.floor(this.dungeon.gridLineWidth/2),
					this.p5.sketchHeight
				)
			}
			for (let y=0; y<=this.dungeon.rows; y++) {
				sketch.line(
					0, 
					this.dungeon.squareDimensions[1] * y + Math.floor(this.dungeon.gridLineWidth/2), 
					this.p5.sketchWidth,
					this.dungeon.squareDimensions[1] * y + Math.floor(this.dungeon.gridLineWidth/2)
				)
			}
			sketch.pop();
		},
		drawBackground(sketch) {
			sketch.background(this.dungeon.colors.darkness);
		},
		drawQuadrants(sketch) {
			let quadrants = [
				this.dungeon.quadrants.TOP,
				this.dungeon.quadrants.LEFT,
				this.dungeon.quadrants.RIGHT,
				this.dungeon.quadrants.BOTTOM
			]
			let colors = [
				"red",
				"blue",
				"green",
				"yellow"
			]
			for (let i=0; i<4; i++) {
				this.fillSquare(
					sketch,
					quadrants[i].loc[0],
					quadrants[i].loc[1],
					colors[i],
					quadrants[i].width,
					quadrants[i].height
				);
			}
		},
		drawRooms(sketch) {
			if (this.p5.cutsceneActive && this.dungeon.rooms[0].goalLoc) {
				this.drawMovingRoom(sketch, this.dungeon.rooms[0]);
				return;
			}

			for (let room of this.dungeon.rooms) {
				if (!room.isShown) continue;
				room.isHovered = this.isHoveredOver(sketch, room);

				this.fillSquare(
					sketch,
					room.loc[0],
					room.loc[1],
					this.dungeon.colors.wall,
					room.width,
					room.height
				);

				let color = this.dungeon.colors.darkness;
				if (room.isLit) color = this.dungeon.colors.litFloor;
				else if (room.isHovered) color = this.dungeon.colors.hoveredFloor;
				this.fillSquare(
					sketch,
					room.loc[0] + 1,
					room.loc[1] + 1,
					color,
					room.width - 2,
					room.height - 2
				);

				for (let door of room.doors) {
					if (door.loc.length == 0 || !door.isShown) continue;
					this.fillSquare(
						sketch, 
						door.loc[0], 
						door.loc[1], 
						this.dungeon.colors.door
					);
				}

				for (let path of room.pathsTo) {
					for (let pathTile of path) {
						let color = this.dungeon.colors.passage;
						if (room.isHovered) {
							color = this.dungeon.colors.hoveredPassage;
						}
						this.fillSquare(sketch, pathTile[0], pathTile[1], color);
					}
				}
			}

			// this.addRandomDoor(room, [1]);
			// this.addRandomDoor(room, [2]);
			// this.addRandomDoor(room, [3]);

			// this.generateAllRooms();
		},
		drawMovingRoom(sketch, room) {
			let move = [0, 0];
			for (let i=0; i<2; i++) {
				if (room.goalLoc[i] > room.loc[i]) {
					if (room.goalLoc[i] - room.loc[i] >= this.p5.squaresPerMove[i]) {
						move[i] = this.p5.squaresPerMove[i]; 
					}
					else move[i] = 1;
				}
				if (room.goalLoc[i] < room.loc[i]) {
					if (room.goalLoc[i] - room.loc[i] <= this.p5.squaresPerMove[i]) {
						move[i] = -this.p5.squaresPerMove[i]; 
					}
					else move[i] = -1;
				}
			}
			for (let i=0; i<2; i++) {
				room.loc[i] += move[i];
				// for (let door of room.doors) door.loc[i] += move[i];
				// for (let passage of room.pathsTo) for (let square of passage) square[i] += move[i];
			}

			this.fillSquare(
				sketch,
				room.loc[0],
				room.loc[1],
				this.dungeon.colors.wall,
				room.width,
				room.height
			);

			let color = this.dungeon.colors.darkness;
			if (room.isLit) color = this.dungeon.colors.litFloor;
			else if (room.isHovered) color = this.dungeon.colors.hoveredFloor;
			this.fillSquare(
				sketch,
				room.loc[0] + 1,
				room.loc[1] + 1,
				color,
				room.width - 2,
				room.height - 2
			);

			for (let door of room.doors) {
				if (door.loc.length == 0 || !door.isShown) continue;
				this.fillSquare(
					sketch, 
					door.loc[0], 
					door.loc[1], 
					this.dungeon.colors.door
				);
			}

			for (let path of room.pathsTo) {
				for (let pathTile of path) {
					let color = this.dungeon.colors.passage;
					if (room.isHovered) {
						color = this.dungeon.colors.hoveredPassage;
					}
					this.fillSquare(sketch, pathTile[0], pathTile[1], color);
				}
			}

			if (room.loc[0] == room.goalLoc[0] && room.loc[1] == room.goalLoc[1]) {
				room.goalLoc = null;
				// room.pathsTo = [];
				this.generateAllRooms();
				setTimeout(() => {
					this.p5.cutsceneActive = false;
					sketch.redraw();
				}, this.p5.cutsceneLagTime * 1000);
					this.p5.cutsceneActive = false;
			}
		},
		isHoveredOver(sketch, room) {
			if (
				sketch.mouseX >= room.loc[0] * this.dungeon.squareDimensions[0] &&
				sketch.mouseX <= (room.loc[0] + room.width) * this.dungeon.squareDimensions[0] &&
				sketch.mouseY >= room.loc[1] * this.dungeon.squareDimensions[1] &&
				sketch.mouseY <= (room.loc[1] + room.height) * this.dungeon.squareDimensions[1]
			) return true;
			return false;
		},
		fillSquare(sketch, x, y, color, width=1, height=1) {
			width *= this.dungeon.squareDimensions[0];
			height *= this.dungeon.squareDimensions[1];
			sketch.push();
			sketch.noStroke();
			sketch.fill(color);
			sketch.rect(
				this.dungeon.squareDimensions[0] * x,
				this.dungeon.squareDimensions[1] * y,
				width,
				height
			);
			sketch.pop();
		},
		goToRoom(room) {
			this.dungeon.rooms = [room];
			room.isShown = true;
			room.quadrant = "BOTTOM";
			room.doors = [ 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true } 
			];
			room.pathsFrom = [];
			room.pathsTo = [];
			let midPointX = this.dungeon.quadrants.BOTTOM.loc[0] + 
				Math.floor(this.dungeon.quadrants.BOTTOM.width / 2);
			let midPointY = this.dungeon.quadrants.BOTTOM.loc[1] + 
				Math.floor(this.dungeon.quadrants.BOTTOM.height / 2);
			room.goalLoc = [
				midPointX - (Math.ceil(room.width / 2)),
				midPointY - (Math.ceil(room.height / 2))
			]
			room.isLit = true;

			this.p5.cutsceneActive = true;
			this.p5.sketch.redraw();
		},
		render(h) {
			return h(VueP5, {on: this});
		},
		p5Click() {
			for (let i=0; i<this.dungeon.rooms.length; i++) {
				if (this.isHoveredOver(this.p5.sketch, this.dungeon.rooms[i])) {
					if (i==0) {
						if (this.dungeon.rooms[3].pathsTo[0].length > 0) {
							this.dungeon.rooms[3].isShown = true;
							for (let door of this.dungeon.rooms[0].doors) door.isShown = true;
						} else {
							this.noPathFound();
						}
					} else {
						this.goToRoom(this.dungeon.rooms[i]);
					}
				}
			}
			this.p5.sketch.redraw();
		},
		p5Mousemoved() {
			let sketch = this.p5.sketch;
			let isHoveringSomethingClickable = false;
			for (let room of this.dungeon.rooms) {
				if (this.isHoveredOver(sketch, room)) {
					room.isHovered = true;
					isHoveringSomethingClickable = true;
				} else {
					room.isHovered = false;
				}
			}
			if (isHoveringSomethingClickable) sketch.cursor(sketch.HAND);
			else sketch.cursor(sketch.ARROW);

			if (!this.p5.cutsceneActive) sketch.redraw();
		},
		mouseMoved() {
			// TODO
		},
		noPathFound() {
			// TODO
		}
	}
}
</script>

<style>

</style>