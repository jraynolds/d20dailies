<template>
	<v-container v-if="user">

		<v-row id="avatar" class="align-center px-4">
			<v-col class="flex-grow-1 text-center">
				<v-img 
					v-if="user.avatar" 
					:src="user.avatar"
					width="220"
					height="220"
					style="margin-left: auto; margin-right: auto;"
				/>
				<v-icon v-else style="font-size: 220px;">mdi-account</v-icon>
				<v-row class="justify-center align-center">
					<v-file-input
						:rules="avatarRules"
						style="font-size: small"
						accept="image/png, image/jpeg, image/bmp"
						prepend-icon="mdi-camera"
						label="Upload avatar"
						@change="uploadAvatar"
					></v-file-input>
					<v-btn icon large color="primary" :disabled="!avatar" @click="saveAvatar()">
						<v-icon large>mdi-content-save</v-icon>
					</v-btn>
				</v-row>

				<!-- <v-row>
					<v-col cols="12" class="text-center d-flex justify-center">
						<v-card-title class="text-center">
							{{ user.email }}
						</v-card-title>
					</v-col>
				</v-row> -->

				<v-row>
					<router-link to="/dungeon" style="width: 100%;">
						<Dungeon :mini="true" v-if="$store.getters.getDungeon" />
					</router-link>
					<v-btn color="primary" large style="width: 100%;" to="/dungeon">
						Visit the Dungeon
					</v-btn>
				</v-row>

				<v-spacer style="height: 100px;"/>

				<v-form v-model="valid">
					<v-row>
						<v-col cols="6">
							<v-text-field
								v-model="password.text"
								:rules="password.rules"
								:label="'New password'"
								required
								:type="password.show ? 'text' : 'password'"
								:append-icon="password.show ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="password.show = !password.show"
							/>
						</v-col>
						<v-col cols="6">
							<v-text-field
								v-model="confirmPassword.text"
								:rules="[ v => !!v || 'Password required.', matchingPasswords ]"
								:label="'Confirm password'"
								required
								:type="confirmPassword.show ? 'text' : 'password'"
								:append-icon="confirmPassword.show ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="confirmPassword.show = !confirmPassword.show"
							/>
						</v-col>
						<v-col>
							<v-btn 
								v-if="!loading"
								color="primary" 
								:disabled="!valid" 
								@click="changePassword()"
								width="100%"
							>
								Change Password
							</v-btn>
							<v-btn
								v-else
								color="primary" 
								disabled
								loading
								width="100%"
							>
								Change Password
							</v-btn>
						</v-col>
					</v-row>
				</v-form>

				<v-spacer style="height: 100px;"/>

				<v-row>
					<v-btn 
						color="error" 
						x-large 
						style="width: 100%;" 
						@click="$store.dispatch('signOut')"
					>
						Log Out
					</v-btn>
				</v-row>

			</v-col>
		</v-row>

	</v-container>
</template>

<script>
export default {
	components: {
		Dungeon: () => import("@/components/Dungeon.vue")
	},
	data: () => ({
		loading: false,
		valid: false,
		avatar: null,
		avatarRules: [
			value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
		],
		password: {
			text: "",
			rules: [
				v => !!v || 'Password required.',
				v => v.length >= 8 || 'Password must be at least 8 characters.',
			],
			show: false
		},
		confirmPassword: {
			text: "",
			show: false
		}
	}),
	computed: {
		user() {
			return this.$store.getters.getUser;
		},
		matchingPasswords() {
			if (this.password.text === this.confirmPassword.text) return true;
			return "Passwords must match!"
		},
	},
	methods: {
		changePassword() {
			// TODO
		},
		uploadAvatar(avatar) {
			this.avatar = avatar;
		},
		saveAvatar() {
			this.$store.dispatch("uploadPlayerAvatar", this.avatar);
		}
	}
}
</script>

<style>

</style>