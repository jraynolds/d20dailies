<template>
	<v-container>
		<v-row text-center>
			<TutorialDialog :tutorial="dialog" :tutorialOpenOnStart="tutorialOpenOnStart" />

			<v-spacer />
			<v-col sm="8" class="d-flex flex-column justify-center align-center">
				<v-col>
					<v-card>
						<v-card-title>
							Combat Tests
						</v-card-title>

						<v-card-text v-for="paragraph of scenario.preamble" :key="paragraph">
							{{ paragraph }}
						</v-card-text>

					</v-card>
				</v-col>

				<Combat :scenario="scenario" />

				<v-col>
					<v-card>
						<v-card-text 
							v-for="(paragraph, index) of scenario.description" 
							:key="paragraph"
							class="font-italic subtitle-2"
							:class="[index == 0 ? 'pb-0' : 'pt-0' ]"
							style="font-size: x-small !important"
						>
							{{ paragraph }}
						</v-card-text>
					</v-card>
				</v-col>

				<v-col>
					<v-card>
						<v-card-text v-for="paragraph of scenario.question" :key="paragraph">
							{{ paragraph }}
						</v-card-text>
					</v-card>
				</v-col>

				<v-col>
					<v-card class="px-10">
						<v-row>
							<v-col class="flex-grow-1">
								<v-text-field 
									v-model="scenario.answer" 
									:label="scenario.questionLabel"
									counter
									:maxlength="scenario.maxAnswerCharacters"
								/>
							</v-col>
							<v-col class="flex-grow-0 pt-5 d-flex align-middle">
								<v-btn 
									color="primary" 
									:disabled="scenario.answer == ''" 
									icon 
									x-large 
									@click="saveAnswer()"
								>
									<v-icon x-large>mdi-check</v-icon>
								</v-btn>
							</v-col>
						</v-row>
					</v-card>
				</v-col>

				<v-expand-transition>
					<div v-if="scenario.answerSaved" id="end">
						<v-col>
							<v-card>
								<v-card-text v-for="paragraph of scenario.end" :key="paragraph">
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

			</v-col>
			<v-spacer />
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		TutorialDialog: () => import("@/components/TutorialDialog.vue"),
		Combat: () => import("@/components/Combat.vue")
	},
	data: () => ({
		waitToScrollDown: .25,
		scrollDuration: 1.2,
		tutorialOpenOnStart: false,
		dialog: {
			title: "Tutorial",
			pages: [
				[
					"Welcome to combat tests! Here you'll test your understanding of your character and the flow of combat.",
					"If you already know what to expect, go ahead and click 'Skip' below. Otherwise, click 'Continue'."
				],
				[
					"Combat in roleplaying games can be lots of fun... but it can also be a real drag if people don't know what to do when. And worse, sometimes you're looking through your character sheet after a hard fight only to realize you could have done something cool you'd forgotten about!",
					"It's impossible to be prepared for every fight, but you can get used to common situations and adapt your reactions to them. Starting out, we'll be focusing on the basic things your character can do."
				],
				[
					"This exercise is designed to be a nice, simple entry point for your practice. It'll start out easy, but once you master it you'll be taking on greater challenges!"
				],
				[
					"Now click 'Continue' to give it a try!"
				]
			],
		},
		scenario: {
			preamble: [
				"For this first combat test, we're not going to be doing anything complicated. Look at the grid below: imagine your character is the one in the cloak and an Orc is standing in front of you. It's the first round of combat, and we should be thinking about what to do."
			],
			characters: [
				{ icon: "player", loc: [3, 4] },
				{ icon: "orc", loc: [5, 5] }
			],
			description: [
				"You're alone and there's one Orc nearby.",
				"It's up to you to decide what the best thing to do in this situation is."
			],
			question: [
				"Since we're starting off with something easy, right now it's not important what level your character is, the items you've got or what your party's up to. Instead we're interested in one basic question: how does your class deal damage?",
				"Irrespective of the actual situation, we all have a role to play. And each class (and subclass!) is set up to do damage in one main way. What's that?"
			],
			questionLabel: "I deal damage by...",
			answer: "",
			maxAnswerCharacters: 100,
			answerSaved: false,
			end: [
				"The answer you've come up with won't necessarily be what others said for their character--even if they have the same class and subclass as you! It'll be dependent on how you build and what your role in your party is.",
				"You can come back in the future to see what you said to this question: it's saved in this character's database. But for now, go ahead and collect your reward! You've earned it."
			],
		}
	}),
	methods: {
		saveAnswer() {
			this.scenario.answerSaved = true;
			let VueScrollTo = require('vue-scrollto');
			setTimeout(() => {
				VueScrollTo.scrollTo(
					document.getElementById('end'), 
					this.scrollDuration * 1000,
					{});
			}, this.waitToScrollDown * 1000);
		}
	}
}
</script>

<style>

</style>