<template>
	<v-row class="flex-column align-center">
		<v-col>
			<v-card>
				<v-card-title>
					{{ exercise.title }}
				</v-card-title>

				<v-card-text v-for="paragraph of exercise.preamble" :key="paragraph">
					{{ paragraph }}
				</v-card-text>

			</v-card>
		</v-col>
		
		<v-col>
			<Carousel :items="exercise.items" @selectionchanged="selectionChanged" />
		</v-col>

		<v-col>
			<v-btn 
				color="primary" 
				style="width: 100%"
				x-large
				:disabled="selectionMade"
				@click="makeSelection()"
			>Continue</v-btn>
		</v-col>

		<v-expand-transition>
			<v-col v-if="selectionMade" id="voiceRecording">
				<v-card>
					<v-card-text v-for="paragraph of exercise.middle" :key="paragraph">
						{{ paragraph }}
					</v-card-text>
				</v-card>

				<VoiceRecorder 
					:voiceline="selection"
					@audiorecorded="setAudioFile"
					@audiodeleted="audioURL = null; isAudioSaved = false;"
					class="mb-2" />
			</v-col>
		</v-expand-transition>

		<v-expand-transition>
			<div v-if="isAudioRecorded">
				<v-col>
					<v-card>
						<v-card-text v-for="paragraph of exercise.postAudio" :key="paragraph">
							{{ paragraph }}
						</v-card-text>
					</v-card>
				</v-col>

				<v-col class="fill-width">
					<v-btn 
						color="primary" 
						style="width: 100%;" 
						x-large
						:disabled="isAudioSaved || audioURL == null"
						@click="saveAudio()"
					>
						Save Audio
					</v-btn>
				</v-col>
			</div>
		</v-expand-transition>

		<v-expand-transition>
			<div v-if="hasAudioBeenSaved" id="endText">
				<v-col v-if="hasAudioBeenSaved">
					<v-card>
						<v-card-text v-for="paragraph of exercise.end" :key="paragraph">
							{{ paragraph }}
						</v-card-text>
					</v-card>
				</v-col>

				<v-col class="mt-2 fill-width">
					<v-btn color="yellow" style="width: 100%;" x-large>
						<v-icon large left class="mr-4">mdi-treasure-chest</v-icon>
						Collect Reward!
						<v-icon large right class="ml-4">mdi-treasure-chest</v-icon>
					</v-btn>
				</v-col>
			</div>
		</v-expand-transition>

	</v-row>
</template>

<script>
import VoiceRecorder from "@/components/VoiceRecorder.vue"

export default {
	props: [ "exercise" ],
	components: {
		VoiceRecorder,
		Carousel: () => import("@/components/Carousel.vue")
	},
	data: () => ({
		waitToScrollDown: .25,
		scrollDuration: 1.2,
		option: 0,
		selection: null,
		selectionMade: false,
		isAudioRecorded: false,
		audioURL: null,
		isAudioSaved: false,
		hasAudioBeenSaved: false,
	}),
	methods: {
		makeSelection() {
			this.selectionMade = true;
			this.scrollTo("voiceRecording");
		},
		saveAudio() {
			this.isAudioSaved = true;
			this.hasAudioBeenSaved = true;
			this.scrollTo("endText");
		},
		scrollTo(id) {
			let VueScrollTo = require('vue-scrollto');
			setTimeout(() => {
				VueScrollTo.scrollTo(
					document.getElementById(id), 
					this.scrollDuration * 1000,
					{});
			}, this.waitToScrollDown * 1000);
		},
		setAudioFile(value) {
			console.log(value);
			this.isAudioRecorded = true;
			this.audioURL = value;
		},
		selectionChanged(selection) {
			this.selection = selection;
		}
	},
	mounted() {
		this.selection = this.exercise.items[0].title || this.exercise.items[0].text;
	}

}
</script>

<style>

</style>