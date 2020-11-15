<template>
	<v-dialog v-model="open" width="400">
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
									color="primary" 
									:disabled="!login.isValid" 
									@click="loginUser()"
									width="100%"
								>
									Log In
								</v-btn>
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
										color="primary" 
										:disabled="!register.isValid" 
										@click="registerUser()"
										style="width: 100%"
									>
										Register
									</v-btn>
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
	props: [ "dialog" ],
	data: () => ({
		open: false,
		tab: null,
		selectedTabColor: "hsl(230, 100%, 95%)",
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
		}
	},
	methods: {
		registerUser() {
			this.$store.dispatch('signUp', {
				email: this.register.email,
				password: this.register.password
			})
		},
		loginUser() {
			this.$store.dispatch('signIn', {
				email: this.register.email,
				password: this.register.password
			})
		}
	},
	watch: {
		dialog(val) {
			this.open = val;
		},
		open(val) {
			this.$emit("update:dialog", val);
		}
	},
	mounted() {
		this.open = this.dialog;
	}
}
</script>

<style>

</style>