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
			title: "Persuasion Exercises",
			preamble: [
				"For this first exercise, you're going to pick a prompt from a list of easy questions. Imagine you're talking to an NPC in these situations and consider what you'd say to convince them.",
			],
			items: [
				{
					text: "To try your favorite food",
					color: "blue"
				},
				{ 
					text: "To visit your city",
					color: "gray"
				},
				{ 
					text: "To watch your favorite movie",
					color: "yellow"
				},
				{ 
					text: "To listen to your favorite band",
					color: "red"
				},
				{ 
					text: "To play your favorite roleplaying game",
					color: "green"
				}
			],
			middle: [
				"Think about the prompt you've chosen for a moment and consider what you'd say to someone to convince them. You don't need to find the best reason, just a good enough one.",
				"When you feel like you have some convincing things to say, press the 'record' button below and give your reasons. Just a couple will do."
			],
			postAudio: [
				"Feel free to give it as many tries as you want. When you finish, it'll be uploaded for you to compare against later, or to check on when you need some extra arguments!"
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
					"Welcome to the persuasive exercises! Here you'll be practicing to develop your ability to craft compelling arguments.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"It's all well and good to roll when circumstances call for an argument to be made, but it takes something out of the experience if you just narrate the number you end up with.",
					"Isn't it more fun to come up with an argument that legitimately sounds compelling? Plus, if you say something smart there's a much higher chance your GM will slide some bonuses your way."
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