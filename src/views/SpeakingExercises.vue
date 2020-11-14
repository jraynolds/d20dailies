<template>
	<v-container>
		<v-row text-center>
			<TutorialDialog :tutorial="dialog" :tutorialOpenOnStart="tutorialOpenOnStart" />

			<v-spacer />
			<v-col lg="6" sm="8">
				<Exercise :exercise="exercise" />
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
		tutorialOpenOnStart: true,
		exercise: {
			title: "Speaking Exercises",
			preamble: [
				"For this first exercise, you're going to pick a short phrase you think your character might say from the list below, or type in your own.",
			],
			items: [
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
					isEditable: true,
					color: "black"
				}
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
		}
	})
}
</script>

<style>
</style>