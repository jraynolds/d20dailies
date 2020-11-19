<template>
	<v-container>
		<v-row>
			<v-col cols="6">
				<v-card>
					<Usersheet />
				</v-card>
			</v-col>
			<v-col cols="6">
				<v-card>
					<Charsheet :includeEquipment="true" v-if="character" :character="character" />
					<AddCharacter v-else @charactersaved="createCharacter" />
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		Usersheet: () => import("@/components/Usersheet.vue"),
		Charsheet: () => import("@/components/Charsheet.vue"),
		AddCharacter: () => import("@/components/AddCharacter.vue")
	},
	computed: {
		character() {
			return this.$store.getters.getActiveCharacter;
		}
	},
	methods: {
		createCharacter(character) {
			this.$store.dispatch("createNewCharacter", character);
		}
	}
}
</script>

<style>

</style>