import aStar from "@/scripts/aStar.js"

let procgen = {

	dungeon: {
		rooms: [
		],
		quadrants: {
			LEFT: { loc: [1, 13], width: 16, height: 16, index: 0 },
			TOP: { loc: [1, 1], width: 38, height: 9, index: 1 },
			RIGHT: { loc: [23, 13], width: 16, height: 16, index: 2 },
			BOTTOM: { loc: [1, 30], width: 38, height: 9, index: 3 }
		},
		minRoomLegLength: 5,
		maxRoomLegLength: 10,
	},

	generateFromRoom: function(room) {
		// console.log("Generating!");
		this.dungeon.rooms = [room];
		// console.log(this.dungeon.rooms);
		// console.log(room);

		this.dungeon.rooms.push(this.generateRandomRoom(false));
		// console.log(this.dungeon.rooms[0].width);
		// console.log(this.dungeon.rooms);
		// console.log(this.dungeon.rooms[1]);
		this.dungeon.rooms.push(this.generateRandomRoom(false));
		// console.log(this.dungeon.rooms[0].width);
		// console.log(this.dungeon.rooms);
		this.dungeon.rooms.push(this.generateRandomRoom(false));
		// console.log(this.dungeon.rooms[0].width);
		// console.log(this.dungeon.rooms);

		this.getPassage(room, this.dungeon.rooms[1]);
		// console.log(this.dungeon.rooms[0].width);
		this.getPassage(room, this.dungeon.rooms[2]);
		// console.log(this.dungeon.rooms[0].width);
		this.getPassage(room, this.dungeon.rooms[3]);
		// console.log(this.dungeon.rooms[0].width);

		// console.log(this.dungeon.rooms);

		return this.dungeon.rooms;
	},

	getPassage: function(roomOne, roomTwo) {
		let doorIndex = this.dungeon.quadrants[roomTwo.quadrant].index;
		let startingDoor = roomOne.doors[doorIndex];
		if (startingDoor.loc.length == 0) {
			let doorSides = [doorIndex];
			this.addRandomDoor(roomOne, doorSides);
		}
		startingDoor = roomOne.doors[doorIndex];

		let passage = aStar.getShortestPath(
			startingDoor.loc,
			roomTwo.doors.filter(door => door.loc.length > 0)[0].loc,
			roomTwo,
			this.dungeon.rooms
		)

		let convertedPassage = [];
		for (let node of passage) {
			convertedPassage.push({ 0: node[0], 1: node[1] });
		}

		// roomOne.pathsFrom.push(passage);
		roomTwo.pathTo = convertedPassage;
	},

	getOpenQuadrants: function() {
		// console.log(this.dungeon);

		let openQuadrants = [ "LEFT", "TOP", "RIGHT" ];
		for (let room of this.dungeon.rooms) {
			openQuadrants = openQuadrants.filter(quadrant => 
				quadrant != room.quadrant 
			);
		}
		return openQuadrants;
	},

	getRandomQuadrant: function() {
		let openQuadrants = this.getOpenQuadrants();
		if (openQuadrants.length == 0) return null;
		let chosenQuadrant = this.getRandomFromArray(openQuadrants);
		return chosenQuadrant;
	},

	generateRandomRoom: function(isShown=true) {
		let quadrantName = this.getRandomQuadrant();
		// console.log(quadrantName);
		let quadrant = this.dungeon.quadrants[quadrantName];
		// console.log(quadrant);
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
			pathTo: [],
			quadrant: quadrantName
		}
		this.addRandomDoor(room);
		
		return room;
	},

	addRandomDoor: function(room, sidesAllowed=[0, 2, 3]) {
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

	getRandomIntInRange: function(minInclusive, maxInclusive) {
		return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
	},

	getRandomFromArray: function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
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

export default procgen;