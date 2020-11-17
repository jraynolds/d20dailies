<template>
	<v-container>
		<Dungeon />
	</v-container>
</template>

<script>
export default {
	components: {
		Dungeon: () => import("@/components/Dungeon.vue")
	}
}
</script>

<style>

</style>