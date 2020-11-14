<template>
	<v-container>
		<v-row text-center>
			<TutorialDialog :tutorial="dialog" :openOnStart="tutorialOpenOnStart" />

			<v-spacer />
			<v-col lg="6" sm="8">
				<Exercise :exercise="exercise" : />
			</v-col>
			<v-spacer />
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: [ "tutorialOpenOnStart" ],
	components: {
		TutorialDialog: () => import("@/components/TutorialDialog.vue"),
		Exercise: () => import("@/components/Exercise.vue")
	},
  data: () => ({
		exercise: {
			title: "Accent Practice",
			preamble: [
				"For this first exercise, you're going to be trying out a couple of accents. Don't be too concerned about your imitation being perfect--just try them out and have fun with it!",
				"Once you've found one you'd like to practice specifically, click 'continue' below."
			],
			items: [
				{
					title: "British",
					text: "It's a bit posh, innit?",
					background: require("@/assets/flags/uk_flag.svg.png"),
					isLight: true,
					audio: require("@/assets/audio/Code Geass Fascination.mp3")
				},
				{
					title: "Australian",
					text: "Put some shrimp on the barbie, mate!",
					background: require("@/assets/flags/aus_flag.gif"),
					isLight: true,
					audio: require("@/assets/audio/Code Geass Fascination.mp3")
				},
				{
					title: "Irish",
					text: "'Tis only a stepmother would blame you!",
					background: require("@/assets/flags/ire_flag.webp"),
					isLight: true,
					audio: require("@/assets/audio/Code Geass Fascination.mp3")
				},
				{ 
					title: "Russian",
					text: "The winter is cold, but I have a coat.",
					background: require("@/assets/flags/rus_flag.svg"),
					isLight: true,
					audio: require("@/assets/audio/Code Geass Fascination.mp3")
				},
			],
			middle: [
				"Practice saying those words a couple of times until you're happy with the general feel of them. Right now what's more important than the accent is the tone: are you happy? Wistful? Angry? Where should the emphasis be on the words?",
				"When you're happy with the general feel of the sentence, make a recording below!"
			],
			postAudio: [
				"Feel free to give it as many tries as you want. When you finish, it'll be uploaded for you to compare against later, or to check on when you need some more inspiration!"
			],
			end: [
				"Now that you've saved the recording, it'll be added to the stored practices for this character, and you'll be able to find it by going to that character's database.",
				"When you're ready to complete this exercise, click below for your reward!"
			],
		},
		dialog: {
			title: "Tutorial",
			pages: [
				[
					"Welcome to the accent exercises! Here you'll be practicing to develop your ability to speak as a given nationality or with a certain inflection.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"One of the ways to spice up a character you're roleplaying--or to emphasize certain characteristics--is to give them a speech quirk like an accent.",
					"Some accents are silly, some are sensible, but all are intended to be fun to use. Nothing makes your players or your GM laugh like hearing a witty quip in a distinctive accent!"
				],
				[
					"This exercise is designed to be a nice, simple entry point for your practice. It'll start out easy, but once you master it you'll be taking on greater challenges!"
				],
				[
					"Now click 'Continue' to give it a try!" 
				]
			]
		},
	})
}
</script>

<style>
</style>