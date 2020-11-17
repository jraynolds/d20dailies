<template>
	<v-container id="p5Container">
		<VueP5 
			v-on="this" 
			@mouseclicked="p5Click()" 
			@mousemoved="p5MouseMoved()"
			@windowresized="p5WindowResized()" />
	</v-container>
</template>

<script>
import VueP5 from 'vue-p5'
import procgen from "@/scripts/procGen.js"

export default {
	props: [ "mini" ],
	components: {
		VueP5
	},
	data: () => ({
		el: "#p5Container",
		containerWidth: 0,
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
			litFloor: 200,
			hoveredLit: 255
		},
		gridLineWidth: 1,
		rows: 40,
		columns: 40,
		squareDimensions: [0, 0],
		rooms: [
			{
				isHovered: false,
				drawLoc: null
			},
			{
				isHovered: false,
				drawLoc: null
			},
			{
				isHovered: false,
				drawLoc: null
			},
			{
				isHovered: false,
				drawLoc: null
			},
		]
	}),
	computed: {
		dungeon() {
			return this.$store.getters.getDungeon;
		}
	},
	methods: {

		setup(sketch) {
			console.log("Setup is running.");
			this.p5.sketch = sketch;
			this.resizeP5(sketch);
			sketch.frameRate(this.p5.frameRate);
		},
		resizeP5(sketch) {
			this.containerWidth = 
				document.getElementById("p5Container").
				firstChild.offsetWidth
				-8;
			this.p5.sketchHeight = this.containerWidth;
			this.p5.sketchWidth = this.containerWidth;

			this.squareDimensions = [
				(this.p5.sketchWidth - 2) / this.rows, 
				(this.p5.sketchHeight - 2) / this.columns
			];

			sketch.resizeCanvas(this.p5.sketchWidth, this.p5.sketchHeight);
		},
		render(h) {
			return h(VueP5, {on: this});
		},

		draw(sketch) {
			this.drawDungeon(sketch);

			if (!this.p5.cutsceneActive) sketch.noLoop();
			else sketch.loop();
		},
		
		drawDungeon(sketch) {
			sketch.background(this.colors.darkness);
			// this.drawQuadrants(sketch);
			this.drawRooms(sketch);
			if (this.p5.isMoving) return;
			this.drawGrid(sketch);
		},
		drawRooms(sketch) {
			if (this.p5.cutsceneActive && this.rooms[0].drawLoc) {
				this.drawMovingRoom(sketch, this.dungeon.rooms[0]);
				return;
			}

			for (let i=0; i<this.dungeon.rooms.length; i++) {
				this.drawRoom(sketch, this.dungeon.rooms[i], i);
			}
		},
		drawRoom(sketch, room, index) {
			if (!room.isShown) return;

			// console.log(room);
			this.fillSquare(
				sketch,
				room.loc[0],
				room.loc[1],
				this.colors.wall,
				room.width,
				room.height
			);

			let color = this.colors.darkness;
			if (this.rooms[index].isHovered) {
				if (room.isLit) color = this.colors.hoveredLit;
				else color = this.colors.hoveredFloor;
			} else {
				if (room.isLit) color = this.colors.litFloor;
			}
			// console.log(color);
			this.fillSquare(
				sketch,
				room.loc[0] + 1,
				room.loc[1] + 1,
				color,
				room.width - 2,
				room.height - 2
			);

			// console.log(room.doors);
			for (let door of room.doors) {
				if (door.loc.length == 0 || !door.isShown) continue;
				this.fillSquare(
					sketch, 
					door.loc[0], 
					door.loc[1], 
					this.colors.door
				);
			}

			// console.log(room.pathTo);
			for (let pathTile of room.pathTo) {
				let color = this.colors.passage;
				if (this.rooms[index].isHovered) {
					color = this.colors.hoveredPassage;
				}
				this.fillSquare(sketch, pathTile[0], pathTile[1], color);
			}
		},
		drawGrid(sketch) {
			sketch.push();
			sketch.stroke(this.colors.grid);
			sketch.strokeWeight(this.gridLineWidth);
			for (let x=0; x<=this.columns; x++) {
				sketch.line(
					this.squareDimensions[0] * x + Math.floor(this.gridLineWidth/2), 
					0, 
					this.squareDimensions[0] * x + Math.floor(this.gridLineWidth/2),
					this.p5.sketchHeight
				)
			}
			for (let y=0; y<=this.rows; y++) {
				sketch.line(
					0, 
					this.squareDimensions[1] * y + Math.floor(this.gridLineWidth/2), 
					this.p5.sketchWidth,
					this.squareDimensions[1] * y + Math.floor(this.gridLineWidth/2)
				)
			}
			sketch.pop();
		},
		drawMovingRoom(sketch, room) {
			let move = [0, 0];
			if (this.rooms[0].drawLoc[0] < room.loc[0]) move[0] = 1;
			if (this.rooms[0].drawLoc[0] > room.loc[0]) move[0] = -1;
			if (this.rooms[0].drawLoc[1] < room.loc[1]) move[1] = 1;
			if (this.rooms[0].drawLoc[1] > room.loc[1]) move[1] = -1;

			this.rooms[0].drawLoc[0] += move[0];
			this.rooms[0].drawLoc[1] += move[1];

			this.fillSquare(
				sketch,
				this.rooms[0].drawLoc[0],
				this.rooms[0].drawLoc[1],
				this.colors.wall,
				room.width,
				room.height
			);
			
			let color = this.colors.litFloor;
			this.fillSquare(
				sketch,
				this.rooms[0].drawLoc[0] + 1,
				this.rooms[0].drawLoc[1] + 1,
				color,
				room.width - 2,
				room.height - 2
			);

			if (
				room.loc[0] == this.rooms[0].drawLoc[0] && 
				room.loc[1] == this.rooms[0].drawLoc[1]
			) {
				this.rooms[0].drawLoc = null;
				setTimeout(() => {
					this.p5.cutsceneActive = false;
					for (let i=0; i<3; i++) this.dungeon.rooms[i].isShown = true;
					sketch.redraw();
				}, this.p5.cutsceneLagTime * 1000);
					this.p5.cutsceneActive = false;
			}
		},
		fillSquare(sketch, x, y, color, width=1, height=1) {
			width *= this.squareDimensions[0];
			height *= this.squareDimensions[1];
			sketch.push();
			sketch.noStroke();
			sketch.fill(color);
			sketch.rect(
				this.squareDimensions[0] * x,
				this.squareDimensions[1] * y,
				width,
				height
			);
			sketch.pop();
		},

		isHoveredOver(sketch, room) {
			if (
				sketch.mouseX >= room.loc[0] * this.squareDimensions[0] &&
				sketch.mouseX <= (room.loc[0] + room.width) * this.squareDimensions[0] &&
				sketch.mouseY >= room.loc[1] * this.squareDimensions[1] &&
				sketch.mouseY <= (room.loc[1] + room.height) * this.squareDimensions[1]
			) return true;
			return false;
		},
		goToRoom(room) {
			this.dungeon.rooms = [room];
			this.rooms[0].drawLoc = [this.dungeon.rooms[0].loc[0], this.dungeon.rooms[0].loc[1]];
			room.isShown = true;
			room.quadrant = "BOTTOM";
			room.doors = [ 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true }, 
				{ loc: [], isShown: true } 
			];
			room.pathsFrom = [];
			room.pathTo = [];
			let midPointX = this.quadrants.BOTTOM.loc[0] + 
				Math.floor(this.quadrants.BOTTOM.width / 2);
			let midPointY = this.quadrants.BOTTOM.loc[1] + 
				Math.floor(this.quadrants.BOTTOM.height / 2);
			room.loc = [
				midPointX - (Math.ceil(room.width / 2)),
				midPointY - (Math.ceil(room.height / 2))
			]
			room.isLit = true;

			let procRooms = procgen.generateFromRoom(room);
			this.dungeon.rooms = procRooms;
			this.$store.commit('setDungeon', this.dungeon);

			this.p5.cutsceneActive = true;
			this.p5.sketch.redraw();
		},
		drawQuadrants(sketch) {
			let quadrants = [
				this.quadrants.TOP,
				this.quadrants.LEFT,
				this.quadrants.RIGHT,
				this.quadrants.BOTTOM
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

		p5Click() {
			if (this.mini) return;
			for (let i=0; i<this.dungeon.rooms.length; i++) {
				if (this.isHoveredOver(this.p5.sketch, this.dungeon.rooms[i])) {
					if (i==0) {
						if (this.dungeon.rooms[3].pathTo.length > 0) {
							this.dungeon.rooms[3].isShown = true;
							for (let door of this.dungeon.rooms[0].doors) door.isShown = true;
						} else {
							// this.noPathFound();
						}
					} else {
						this.goToRoom(this.dungeon.rooms[i]);
					}
				}
			}
			this.p5.sketch.redraw();
		},
		p5MouseMoved() {
			if (!this.p5.sketch || this.mini) return;
			let sketch = this.p5.sketch;
			let isHoveringSomethingClickable = false;
			for (let i=0; i<this.dungeon.rooms.length; i++) {
				let room = this.dungeon.rooms[i];
				if (this.isHoveredOver(sketch, room)) {
					this.rooms[i].isHovered = true;
					isHoveringSomethingClickable = true;
				} else {
					this.rooms[i].isHovered = false;
				}
			}
			if (isHoveringSomethingClickable) sketch.cursor(sketch.HAND);
			else sketch.cursor(sketch.ARROW);

			if (!this.p5.cutsceneActive) sketch.redraw();
		},
		p5WindowResized() {
			this.resizeP5(this.p5.sketch);
		}
	},
	mounted() {
		this.resizeP5(this.p5.sketch);
	}
}
</script>

<style>

</style>