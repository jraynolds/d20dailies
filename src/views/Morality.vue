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
			title: "Accent Practice",
			preamble: [
				"For this first exercise, you're going to be answering how you yourself would answer, not how your character would. Consider the questions below as if someone was asking you personally.",
				"Once you've found one you'd like to think about specifically, click 'continue' below."
			],
			items: [
				{
					title: "Marshmallow",
					text: "Would you eat one marshmallow now, or wait an hour to eat two?",
					color: "primary"
				},
				{
					title: "Bully",
					text: "If someone's being mean to you, is it okay to be mean back?",
					color: "green"
				},
				{
					title: "Procrastination",
					text: "Would you start studying when the assignment is given, or wait until the last minute?",
					color: "orange"
				},
				{
					title: "Friend",
					text: "If you haven't spoken with a friend in a while, would you wait for them to reach out or reach out first?",
					color: "purple"
				},
			],
			middle: [
				"Contemplate the question you've chosen for a moment. Even if it feels like there's an easy answer--are you sure? What are some circumstances which might change how you react?",
				"When you know your answer, make a recording below! Talk a little bit about why, and how you'd react in detail."
			],
			postAudio: [
				"Feel free to record or re-record as many times as you want. When you finish, it'll be uploaded for you to compare against later, or to check on when you need some more inspiration!"
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
					"Welcome to the trolley problems! Like the infamous 'do you pull the lever?' question, these questions are designed to make you think about what you--or your character--would do in difficult situations.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"It's easy (or is it?) to decide what you'd do given a metaphorical situation, but it's a lot harder to step into another person's head and decide what they'd do.",
					"The situations which call for contemplation are the ones with no easy answers. Later on you'll be dealing with the really tough ones, but right now we're going to be starting off easy."
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