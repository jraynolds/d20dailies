<template>
	<v-container>
		<v-row class="justify-space-around">
			<v-col 
				cols="5" 
				v-for="(square, index) of squares" 
				:key="index" 
			>
				<v-card>
					<v-card-title>{{ square.title }}</v-card-title>
					<v-img width="400" height="400" style="background-color: gray;"></v-img>
					<v-card-text>{{ square.text }}</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="fill-width px-12">
				<v-btn 
					x-large 
					style="width: 100%;" 
					@click="$store.commit('setLoginDialogOpen', true)" 
					color="primary"
				>
					Sign Up
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
	},
	data: () => ({
		squares: [
			{
				title: "Hone your roleplaying abilities.",
				image: "",
				text: "Practice exercises designed to help you get into character, and stay there."
			},
			{
				title: "Record your practices for review.",
				image: "",
				text: "Record the accent or diction of a character and save it to refresh your memory."
			},
			{
				title: "Delve deep into the dungeon.",
				image: "",
				text: "Choose your path through a procedurally-generated dungeon, created just for you."
			},
			{
				title: "Level up!",
				image: "",
				text: "Earn XP by completing practices, clearing rooms in the dungeon, and keeping up streaks."
			}
		]
	})
}
</script>

<style>

</style>