<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
			<v-spacer />

			<v-toolbar-title>{{ title }}</v-toolbar-title>

			<v-spacer />

			<v-btn icon @click="accountClick()">
				<v-icon>
					mdi-account
				</v-icon>
			</v-btn>
			<LoginDialog :dialog.sync="dialog" />
    </v-app-bar>
</template>

<script>
export default {
	props: [ "title" ],
	components: {
		LoginDialog: () => import("@/components/LoginDialog.vue")
	},
	data: () => ({
		dialog: true
	}),
	methods: {
		accountClick() {
			if (this.$store.getters.isUserAuth) {
				console.log("this user is logged in.");
				this.$router.push('account');
			} else {
				console.log("this user is not logged in!");
				this.dialog = true;
			}
		}
	}
}
</script>

<style>
</style>