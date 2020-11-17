<template>
	<v-navigation-drawer
		v-if="$route.name != 'Account'"
		permanent
		v-model="open"
		right
		absolute
		:mini-variant.sync="mini"
		:width="width"
		class="mt-8"
		style="z-index: 2; overflow-y: hidden;"
		:mini-variant-width="miniWidth"
	>
		<v-row class="fill-height">
			<v-col 
				v-if="$vuetify.breakpoint.mdAndDown" 
				class="flex-grow-0 d-flex align-center justify-center mr-n3"
			>
				<v-btn icon @click="mini = !mini" x-large>
					<v-icon x-large v-if="mini">mdi-chevron-left</v-icon>
					<v-icon x-large v-else>mdi-chevron-right</v-icon>
				</v-btn>
			</v-col>
			<v-divider v-if="$vuetify.breakpoint.mdAndDown" vertical />
			<v-col 
				class="flex-grow-1 mt-8 pl-4" 
				style="overflow: hidden;" 
				:class="[$vuetify.breakpoint.mdAndDown ? 'ml-n4' : '']"
			>
				<Charsheet :includeEquipment="false" />
			</v-col>
		</v-row>
	</v-navigation-drawer>
</template>

<script>
export default {
	props: [ "rDrawerOpen" ],
	components: {
		Charsheet: () => import("@/components/Charsheet.vue")
	},
	data: () => ({
		open: true,
		group: null,
		mini: true,
		mainWidth: 360,
		arrowWidth: 50
	}),
	computed: {
		width() {
			if (this.$vuetify.breakpoint.mdAndDown) return this.mainWidth + this.arrowWidth;
			return this.mainWidth;
		},
		miniWidth() {
			if (this.$vuetify.breakpoint.mdAndDown) return this.arrowWidth;
			return this.mainWidth;
		}
	}
}
</script>

<style>
.v-navigation-drawer__content {
	overflow: hidden;
}
</style>