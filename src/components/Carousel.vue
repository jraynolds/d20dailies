<template>
	<v-carousel v-model="index">
		<v-carousel-item 
			eager
			v-for="(item, index) of items" 
			:key="index"
		>
			<v-sheet
				height="100%"
				:light="item.isLight ? true : false"
				:color="item.color || ''"
				style="background-position: center; background-size: cover;"
				:style="[ 
					item.background ? 
						{'background-image': 'url(' + item.background + ')'} : 
						{} 
				]"
			>
				<v-row
					class="fill-height text-center flex-column"
					style="padding: 95px 80px 100px 80px;"
					align="center"
				>
					<v-col
						v-if="item.title"
						class="px-8 flex-grow-1 align-center justify-center d-flex font-weight-bold text-h2"
					>
						{{ item.title }}
					</v-col>
					<v-card v-if="item.audio">
						<v-row class="ma-0 px-2">
							<v-col class="flex-grow-0 px-0 mr-n2 d-flex align-center">
								<v-btn 
									icon 
									x-large 
									v-if="audioPlaying == null" 
									@click="playAudio(item.audio)"
								>
									<v-icon>mdi-volume-high</v-icon>
								</v-btn>
								<v-btn 
									icon 
									x-large 
									v-else
									@click="stopAudio()"
								>
									<v-icon>mdi-stop</v-icon>
								</v-btn>
							</v-col>
							<v-col 
								class="flex-grow-1" 
								style="font-size: xx-large; font-style: italic;"
							>
								{{ item.text }}
							</v-col>
						</v-row>
					</v-card>
					<v-col 
						v-else-if="!item.isEditable"
						class="flex-grow-1 text-center d-flex align-center justify-center" 
						style="font-size: xx-large; font-style: italic;"
					>
						{{ item.text }}
					</v-col>
					<v-col
						v-else
						class="flex-grow-1 text-center d-flex align-center justify-center" 
					>
						<v-textarea 
							v-model="item.text" 
							:rows="3" 
							style="font-size: xx-large;"
							@change="$emit('selectionchanged', selection)" 
						/>
					</v-col>
				</v-row>
			</v-sheet>
		</v-carousel-item>
	</v-carousel>
</template>

<script>
export default {
	props: [
		"items" // 'item': { title?, text, color, isLight?, background?, audio?, isEditable? }
	],
	data: () => ({
		index: 0,
		audioPlaying: null 
	}),
	computed: {
		selection() {
			let selectedObject = this.items[this.index];
			if (selectedObject.title != null) return selectedObject.title;
			return selectedObject.text;
		}
	},
	methods: {
		playAudio(file) {
			this.audioPlaying = new Audio(file);
			this.audioPlaying.play();
		},
		stopAudio() {
			this.audioPlaying.pause();
			this.audioPlaying.currentTime = 0;
			this.audioPlaying = null;
		}
	},
	watch: {
		index() {
			this.$emit('selectionchanged', this.selection);
		}
	}
}
</script>

<style>
.lightStroke {
	-webkit-text-stroke: 1px black;
}

.darkStroke {
	-webkit-text-stroke: 1px white;
}
</style>