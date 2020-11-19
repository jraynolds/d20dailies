<template>
	<!-- <v-container style="height: 300px"> -->
	<v-container>
		<v-row class="fill-width fill-height">
			<v-col cols="12" class="d-flex justify-center align-end">
				You don't have any characters yet!
			</v-col>
			<v-col cols="12" class="d-flex justify-center">
				<v-dialog v-model="dialog" width="500">
					<template v-slot:activator="{ on, attrs }">
						<v-btn 
							x-large 
							color="primary" 
							v-bind="attrs" 
							v-on="on"
						>
							Create a Character
						</v-btn>
					</template>

					<v-card>
						<CharCreate />
					</v-card>
				</v-dialog>
			</v-col>
			<v-spacer />
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		CharCreate: () => import("@/components/CharCreate.vue")
	},
	data: () => ({
		dialog: false,
		newCharacter: {
			name: "New Character",
			user: "",
			level: 0,
			class: "",
			alignment: "",
			inspiration: false,
			avatar: "",
			abilities: {
				charisma: 0,
				intelligence: 0,
				wisdom: 0
			},
			skills: {
				accent: 0,
				description: 0,
				morality: 0,
				persuasion: 0,
				tactics: 0,
				roleplaying: 0
			},
			stats: {
				attack: {
					value: 1,
					max: 1
				},
				hp: {
					value: 1,
					max: 1
				},
				xp: {
					value: 1,
					max: 1
				}
			}
		}
	}),
}
</script>

<style>

</style>