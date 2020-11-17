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
					<Charsheet :includeEquipment="true" />
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	components: {
		Usersheet: () => import("@/components/Usersheet.vue"),
		Charsheet: () => import("@/components/Charsheet.vue")
	}
}
</script>

<style>

</style>