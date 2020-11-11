<template>
	<v-container>
		<v-row text-center>
			<v-dialog
				v-model="dialog.enabled"
				width="500"
			>
				<v-card>
					<v-card-title v-text="dialog.title" />
					<v-fade-transition mode="out-in">
						<v-card-text v-html="joinedPage" :key="dialog.currentPage" />
					</v-fade-transition>

					<v-progress-linear :value="progress" />

					<v-card-actions>
						<v-btn color="error" @click="dialog.dialog = false">Skip</v-btn>
						<v-spacer />
						<v-btn 
							color="primary" 
							:disabled="dialog.currentPage == 0" 
							@click="dialog.currentPage--"
						>
							Previous
						</v-btn>
						<v-btn color="primary" @click="nextPage()">Continue</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-spacer />
			<v-col sm="8" >
				<v-row class="flex-column align-center">
					<v-col>
						<v-card>
							<v-card-title>
								{{ exercise.title }}
							</v-card-title>

							<v-card-text v-for="paragraph of exercise.preamble" :key="paragraph">
								{{ paragraph }}
							</v-card-text>

							<v-carousel v-model="exercise.optionIndex">
								<v-carousel-item 
									v-for="(option, index) of exercise.options" 
									:key="index"
								>
									<!-- <v-sheet
										:color="colors[i]"
										height="100%"
										tile
									> -->
									<v-sheet
										height="100%"
										:color="option.color"
									>
										<v-row
											class="fill-height pa-4 px-12 text-center"
											style="font-size: xx-large;"
											align="center"
										>
											<v-col v-if="option.text != ''" cols="12" class="px-8">
												{{ option.text }}
											</v-col>
											<v-col v-else cols="12" class="px-8">
												<v-textarea 
													rows="3"
													style="font-size: xx-large" 
													v-model="exercise.selection"
													label="Type your own phrase here!" />
											</v-col>
										</v-row>
									</v-sheet>
								</v-carousel-item>
							</v-carousel>
						</v-card>
					</v-col>

					<v-col>
						<v-btn 
							color="primary" 
							style="width: 100%"
							x-large
							:disabled="exercise.selectionMade"
							@click="makeSelection()"
						>Continue</v-btn>
					</v-col>

					<v-expand-transition>
						<v-col v-if="exercise.selectionMade" id="voiceRecording">
							<v-card>
								<v-card-text v-for="paragraph of exercise.middle" :key="paragraph">
									{{ paragraph }}
								</v-card-text>
							</v-card>

							<VoiceRecorder 
								:voiceline="exercise.selection"
								@audiorecorded="setAudioFile"
								@audiodeleted="exercise.audioURL = null; exercise.isAudioSaved = false;"
								class="mb-2" />
						</v-col>
					</v-expand-transition>

					<v-expand-transition>
						<div v-if="exercise.isAudioRecorded">
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
									:disabled="exercise.isAudioSaved || exercise.audioURL == null"
									@click="saveAudio()"
								>
									Save Audio
								</v-btn>
							</v-col>
						</div>
					</v-expand-transition>

					<v-expand-transition>
						<div v-if="exercise.hasAudioBeenSaved" id="endText">
							<v-col v-if="exercise.hasAudioBeenSaved">
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
			</v-col>
			<v-spacer />
		</v-row>
	</v-container>
</template>

<script>
import VoiceRecorder from "@/components/VoiceRecorder.vue"

export default {
	components: {
		VoiceRecorder,
	},
  data: () => ({
		waitToScrollDown: .25,
		scrollDuration: 1.2,
		exercise: {
			title: "Speaking Exercises",
			preamble: [
				"For this first exercise, you're going to pick a short phrase you think your character might say from the list below, or type in your own.",
			],
			optionIndex: 0,
			options: [
				{ 
					text: "Stand and deliver! No evil shall escape justice.",
					color: "blue"
				},
				{ 
					text: "Those pockets look a little heavy... why don't I take that gold off your hands?",
					color: "gray"
				},
				{ 
					text: "To help others is my passion. To heal the wounded is all the gods ask.",
					color: "yellow"
				},
				{ 
					text: "Hitting things is fun. Hitting bigger things is more fun!",
					color: "red"
				},
				{ 
					text: "Only in the heart of the wild can people truly find peace.",
					color: "green"
				},
				{ 
					text: "",
					color: "black"
				}
			],
			selection: "",
			selectionMade: false,
			middle: [
				"Practice saying those words a couple of times until you're happy with the general feel of them. Right now what's more important than the accent is the tone: are you happy? Wistful? Angry? Where should the emphasis be on the words?",
				"When you're happy with the general feel of the sentence, make a recording below!"
			],
			isAudioRecorded: false,
			audioURL: null,
			postAudio: [
				"Feel free to give it as many tries as you want. When you finish, it'll be uploaded for you to compare against later, or to check on when you need some more inspiration!"
			],
			isAudioSaved: false,
			hasAudioBeenSaved: false,
			end: [
				"Now that you've saved the recording, it'll be added to the stored practices for this character, and you'll be able to find it by going to that character's database.",
				"When you're ready to complete this exercise, click below for your reward!"
			],
		},
		dialog: {
			enabled: false,
			title: "Tutorial",
			pages: [
				[
					"Welcome to the character speaking exercises! Here you'll be practicing to develop your ability to speak as a given character.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"If you're familiar with the stress of being put on the spot with a 'what do you think?' or 'what does your character say?' you know it's easy to come up blank under the pressure.",
					"Just like public speaking--which talking in-character is a lot like--it's totally normal to be uncertain of what to say or how you plan on saying it. Having everyone waiting on your words is uncomfortable for most."
				],
				[
					"This exercise is designed to be a nice, simple entry point for your practice. It'll start out easy, but once you master it you'll be taking on greater challenges!"
				],
				[
					"Now click 'Continue' to give it a try!" 
				]
			],
			currentPage: 0
		}
	}),
	computed: {
		progress() {
			return ((this.dialog.currentPage) / (this.dialog.pages.length - 1)) * 100;
		},
		joinedPage() {
			return "<span>" + this.dialog.pages[this.dialog.currentPage].join("<br /><br />") + "</span>";
		},
		currentSelection() {
			if (this.exercise.optionIndex != this.exercise.options.length - 1) {
				return this.exercise.options[this.exercise.optionIndex].text;
			}
			return this.exercise.selection;
		}
	},
	methods: {
		nextPage() {
			if (this.dialog.currentPage == this.dialog.pages.length - 1) {
				this.dialog.enabled = false;
			}
			else this.dialog.currentPage += 1;
		},
		makeSelection() {
			this.exercise.selectionMade = true;
			this.exercise.selection = this.currentSelection;
			this.scrollTo("voiceRecording");
		},
		saveAudio() {
			this.exercise.isAudioSaved = true;
			this.exercise.hasAudioBeenSaved = true;
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
			this.exercise.isAudioRecorded = true;
			this.exercise.audioURL = value;
		}
	}
}
</script>

<style>
</style>