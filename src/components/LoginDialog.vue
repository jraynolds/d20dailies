<template>
	<v-dialog v-model="dialog" width="400">
		<v-card>
			<v-tabs v-model="tab">
				<v-col v-for="(item, index) of items" :key="item" class="pa-0">
					<v-tab 
						class="fill-height"
						:style="[index == tab ? { backgroundColor: selectedTabColor } : {} ]"
					>
						{{ item }}
					</v-tab>
				</v-col>
			</v-tabs>

			<v-tabs-items v-model="tab">
				<v-tab-item>
					<v-row class="flex-column ma-0 pa-2">
						<v-form v-model="login.isValid">
							<v-col>
								<v-text-field
									v-model="login.email.text"
									:rules="login.email.rules"
									:label="'E-mail'"
									autocomplete="email"
									required
								/>
							</v-col>
							<v-col>
								<v-text-field
									v-model="login.password.text"
									:rules="login.password.rules"
									:label="'Password'"
									autocomplete="current-password"
									required
									:type="login.password.show ? 'text' : 'password'"
									:append-icon="login.password.show ? 'mdi-eye' : 'mdi-eye-off'"
									@click:append="login.password.show = !login.password.show"
								/>
							</v-col>
							<v-col class="fill-width">
								<v-btn 
									v-if="!isLoading"
									color="primary" 
									:disabled="!login.isValid" 
									@click="loginUser()"
									width="100%"
								>
									Log In
								</v-btn>
								<v-btn
									v-else
									color="primary" 
									disabled
									loading
									width="100%"
								>
									Log In
								</v-btn>
								<v-card-text 
									v-if="login.error" 
									class="text-center mb-n4" 
									style="font-style: italic; color: red; font-size: small; width: 100%;"
								>
									{{ errorConversion }}
								</v-card-text>
							</v-col>
						</v-form>
					</v-row>
				</v-tab-item>
				
				<v-tab-item>
					<v-col>
						<v-row class="flex-column ma-0 pa-2">
							<v-form v-model="register.isValid">
								<v-col>
									<v-text-field
										v-model="register.email.text"
										:rules="register.email.rules"
										:label="'E-mail'"
										autocomplete="email"
										required
									/>
								</v-col>
								<v-col>
									<v-text-field
										v-model="register.password.text"
										:rules="register.password.rules"
										:label="'Password'"
										autocomplete="current-password"
										required
										:type="register.password.show ? 'text' : 'password'"
										:append-icon="register.password.show ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="register.password.show = !register.password.show"
									/>
								</v-col>
								<v-col>
									<v-text-field
										v-model="register.password2.text"
										:rules="[ v => !!v || 'Password required.', matchingPasswords ]"
										:label="'Confirm password'"
										autocomplete="current-password"
										required
										:type="register.password2.show ? 'text' : 'password'"
										:append-icon="register.password2.show ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="register.password2.show = !register.password2.show"
									/>
								</v-col>
								<v-col>
									<v-btn 
										v-if="!isLoading"
										color="primary" 
										:disabled="!register.isValid" 
										@click="registerUser()"
										style="width: 100%"
									>
										Register
									</v-btn>
									<v-btn
										v-else
										color="primary" 
										disabled
										loading
										width="100%"
									>
										Register
									</v-btn>
									<v-card-text 
										v-if="register.error" 
										class="text-center mb-n4" 
										style="font-style: italic; color: red; font-size: small; width: 100%;"
									>
										{{ errorConversion }}
									</v-card-text>
								</v-col>
							</v-form>
						</v-row>
					</v-col>
				</v-tab-item>
			</v-tabs-items>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data: () => ({
		isLoading: false,
		tab: null,
		selectedTabColor: "hsl(230, 100%, 95%)",
		errorConversions: [
			{ 
				original: "auth/wrong-password",
				converted: "Incorrect password."
			},
			{
				original: "auth/user-not-found",
				converted: "No user with that email exists."
			},
			{
				original: "The email address is already in use by another account.",
				converted: "A user with that email already exists."
			},
			{
				original: "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
				converted: "Too many failed login attempts. Try later or reset your password."
			}
		],
		register: {
			isValid: false,
			email: {
				text: '',
				rules: [
					v => !!v || 'Email required.',
					v => /.+@.+/.test(v) || 'E-mail must be valid.',
				]
			},
			password: {
				text: '',
				rules: [
					v => !!v || 'Password required.',
					v => v.length >= 8 || 'Password must be at least 8 characters.',
				],
				show: false
			},
			password2: {
				text: '',
				show: false
			}
		},
		login: {
			isValid: false,
			error: null,
			email: {
				text: '',
				rules: [
					v => !!v || 'Email required.',
					v => /.+@.+/.test(v) || 'E-mail must be valid.',
				]
			},
			password: {
				text: '',
				rules: [
					v => !!v || 'Password required.'
				],
				show: false
			}
		},
		items: [ "Log In", "Register" ]
	}),
	computed: {
		matchingPasswords() {
			if (this.register.password.text === this.register.password2.text) return true;
			return "Passwords must match!"
		},
		errorConversion() {
			for (let conversion of this.errorConversions) {
				if (
					conversion.original == this.login.error || 
					conversion.original == this.register.error
				) {
					return conversion.converted;
				}
			}
			return "Error.";
		},
		dialog: {
			get: function() {
				return this.$store.getters.getLoginDialogOpen;
			},
			set: function(val) {
				this.$store.commit('setLoginDialogOpen', val);
			}
		}
	},
	methods: {
		registerUser() {
			this.isLoading = true;
			this.$store.dispatch('signUp', {
				email: this.register.email.text,
				password: this.register.password.text
			}).then(response => {
				console.log(response);
				if (response.successful) {
					this.$router.push("account");
					this.dialog = false;
					this.isLoading = false;
				} else {
					this.login.error = response.error.code;
					this.isLoading = false;
				}
			});
		},
		loginUser() {
			this.isLoading = true;
			this.$store.dispatch('signIn', {
				email: this.login.email.text,
				password: this.login.password.text
			}).then(response => {
				console.log(response);
				if (response.successful) {
					this.$router.push("account");
					this.dialog = false;
					this.isLoading = false;
				} else {
					this.login.error = response.error.code;
					this.isLoading = false;
				}
			});
		}
	},
	watch: {
	},
	mounted() {
	}
}
</script>

<style>

</style>