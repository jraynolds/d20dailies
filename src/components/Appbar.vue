<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
			<v-col cols="4" class="flex-grow-0" />

			<v-col class="text-center" cols="4">
				<v-btn large color="primary" to="/">
					D<v-icon>mdi-dice-d20-outline</v-icon>Dailies
				</v-btn>
			</v-col>

			<v-col cols="4" class="flex-grow-0">
				<v-row class="text-right justify-end">
					<v-col class="text-right pr-0">
						<v-card-text v-if="$store.getters.isUserAuth" class="text-right pr-0">
							{{ userEmail }}
						</v-card-text>
						<v-card-text v-else class="text-right pr-0">
							Login
						</v-card-text>
					</v-col>
					<v-col class="d-flex align-center justify-center flex-grow-0">
						<v-btn icon @click="accountClick()">
							<v-icon v-if="$store.getters.isUserAuth">mdi-account</v-icon>
							<v-icon v-else>mdi-login-variant</v-icon>
						</v-btn>
						<LoginDialog />
					</v-col>
				</v-row>
			</v-col>
    </v-app-bar>
</template>

<script>
export default {
	props: [ "title" ],
	components: {
		LoginDialog: () => import("@/components/LoginDialog.vue")
	},
	data: () => ({
	}),
	computed: {
		userEmail() {
			return this.$store.getters.getUser.email;
		}
	},
	methods: {
		accountClick() {
			if (this.$store.getters.isUserAuth) {
				console.log("this user is logged in.");
				this.$router.push('account');
			} else {
				console.log("this user is not logged in!");
				this.$store.commit('setLoginDialogOpen', true);
			}
		}
	}
}
</script>

<style>
</style>