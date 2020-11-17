<template>
	<v-container>
		<v-row text-center>
			<TutorialDialog :tutorial="dialog" :tutorialOpenOnStart="tutorialOpenOnStart" />

			<v-spacer />
			<v-col sm="8" >
				<Exercise :exercise="exercise" />
			</v-col>
			<v-spacer />
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		TutorialDialog: () => import("@/components/TutorialDialog.vue"),
		Exercise: () => import("@/components/Exercise.vue")
	},
  data: () => ({
		tutorialOpenOnStart: true,
		exercise: {
			title: "Speaking Exercises",
			preamble: [
				"For this first exercise, you're going to pick something you know intimately in order to describe it as best you can. Instead of a character or a made-up place, you're going to be describing something concrete and familiar.",
			],
			items: [
				{ 
					text: "Your phone or phone case",
					color: "blue"
				},
				{ 
					text: "Your favorite piece of clothing",
					color: "gray"
				},
				{ 
					text: "A family member",
					color: "yellow"
				},
				{ 
					text: "Your favorite book's cover",
					color: "red"
				},
				{ 
					text: "Your toothbrush",
					color: "green"
				}
			],
			middle: [
				"Try and fix an image in your head of the item you've chosen. If you've got it nearby, don't look at it! Close your eyes if you have to and do your best to visualize it.",
				"When you feel like you have a good enough picture in your head, press the 'record' button below and start describing it. Anything you think is relevant."
			],
			postAudio: [
				"Feel free to give it as many tries as you want. When you finish, it'll be uploaded for you to compare against later, or to check on when you need some more inspiration!"
			],
			end: [
				"Now that you've saved the recording, it'll be added to your stored practices, and you'll be able to find it by going to your database.",
				"When you're ready to complete this exercise, click below for your reward!"
			],
		},
		dialog: {
			title: "Tutorial",
			pages: [
				[
					"Welcome to the descriptive exercises! Here you'll be practicing to develop your ability to describe actions, items and characters themselves.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"If you GM for a game, you know a great deal of your job is just describing things. You narrate just how creepy the abandoned temple is, how beautiful the sunset, or how a particular enemy meets his grisly end.",
					"And it's important for players, too: you can dictate that your character looks 'mad', but it's so much better if you can talk about the set of your character's jaw, the narrowing of their eyes and the clench of their fists!"
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