<template>
	<VueP5 v-on="this" />
</template>

<script>
export default {
	props: [
		"scenario"
	],
	components: {
		VueP5: () => import("vue-p5")
	},
	data: () => ({
		height: 400,
		width: 400,
		columns: 10,
		rows: 10,
		sketch: null,
		framerate: 30,
		images: {
			orc: { name: "orc", file: require("@/assets/orc_empty.png"), image: null },
			dragon: { name: "dragon", file: require("@/assets/dragon_empty.png"), image: null },
			player: { name: "player", file: require("@/assets/player_empty.svg"), image: null },
		},
	}),
	computed: {
		squareWidth() {
			return this.width / this.rows;
		},
		squareHeight() {
			return this.height / this.columns;
		}
	},
	methods: {
		preload(sketch) {
			this.images.orc.image = sketch.loadImage(this.images.orc.file);
			this.images.dragon.image = sketch.loadImage(this.images.dragon.file);
			this.images.player.image = sketch.loadImage(this.images.player.file);
		},
		setup(sketch) {
			this.sketch = sketch;
			sketch.frameRate(this.frameRate);
			sketch.resizeCanvas(this.width, this.height);
		},
		draw(sketch) {
			sketch.noLoop();

			sketch.background(255);
			sketch.push();
			sketch.strokeWeight(1);
			sketch.stroke('gray');
			for (let x=0; x<=this.columns; x++) {
				sketch.line(
					x * this.squareWidth,
					0,
					x * this.squareWidth,
					this.height
				)
			}
			for (let y=0; y<=this.columns; y++) {
				sketch.line(
					0,
					y * this.squareHeight,
					this.width,
					y * this.squareHeight
				)
			}
			sketch.pop();

			for (let character of this.scenario.characters) {
				this.showImage(
					sketch, 
					this.images[character.icon].image, 
					character.loc[0], 
					character.loc[1],
					character.width || 1,
					character.height || 1
				)
			}
		},
		showImage(sketch, image, xCells, yCells, cellsWide=1, cellsHigh=1) {
			let x = xCells * this.squareWidth;
			let y = yCells * this.squareHeight;
			let width = cellsWide * this.squareWidth;
			let height = cellsHigh * this.squareHeight;
			sketch.image(image, x, y, width, height);
		}
	}
}
</script>

<style>

</style>