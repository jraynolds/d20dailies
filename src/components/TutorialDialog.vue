<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title v-text="tutorial.title" />
			<v-fade-transition mode="out-in">
				<v-card-text v-html="joinedPage" :key="index" />
			</v-fade-transition>

			<v-progress-linear :value="progress" />

			<v-card-actions>
				<v-btn color="error" @click="dialog = false">Skip</v-btn>
				<v-spacer />
				<v-btn 
					color="primary" 
					:disabled="index == 0" 
					@click="index--"
				>
					Previous
				</v-btn>
				<v-btn color="primary" @click="nextPage()">Continue</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: [ 
		"tutorial",
		"openOnStart"
	],
	data: () => ({
		index: 0,
		dialog: false
	}),
	computed: {
		progress() {
			return ((this.index) / (this.tutorial.pages.length - 1)) * 100;
		},
		joinedPage() {
			let joined = this.tutorial.pages[this.index].join("<br /><br />");
			return `<span>${joined}</span>`;
		}
	},
	methods: {
		nextPage() {
			if (this.index == this.tutorial.pages.length - 1) {
				this.dialog = false;
			}
			else this.index += 1;
		},
	},
	mounted() {
		this.dialog = this.openOnStart;
	}
}
</script>

<style>

</style>