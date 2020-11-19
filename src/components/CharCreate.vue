<template>
	<v-container>
		<v-row id="avatar" class="align-center justify-center">
			<v-col cols="8" class="flex-grow-1 text-center">
				<v-icon v-if="!avatar" style="font-size: 220px;">mdi-account</v-icon>
				<v-img 
					v-else 
					:src="avatar"
					width="220"
					height="220"
					style="margin-left: auto; margin-right: auto;"
				/>
			</v-col>
			<v-col cols="8">
				<v-file-input
					:rules="avatarRules"
					style="font-size: small"
					accept="image/png, image/jpeg, image/bmp"
					label="Upload avatar"
					:prepend-icon="uploadingAvatar ? '' : 'mdi-camera'"
					@change="uploadAvatar"
					:disabled="uploadingAvatar"
				>
					<template v-slot:prepend-inner v-if="uploadingAvatar">
						<v-progress-circular indeterminate />
					</template>
				</v-file-input>
			</v-col>
		</v-row>

		<v-row id="name" class="mb-n4">
			<v-col cols="6" class="mb-n4">
				<v-text-field
					label="Name"
					v-model="name"
				/>
			</v-col>

			<v-col cols="6">
				<v-select
					label="Class"
					:items="classes"
					v-model="characterClass"
				/>
			</v-col>

			<v-col cols="12">
				<v-textarea v-model="randomBio" rows="3" filled label="Short bio" />
			</v-col>
		</v-row>

		<v-card-actions>
			<v-btn 
				color="primary" 
				style="width: 100%;" 
				@click="createCharacter()" 
				:disabled="saveDisabled"
			>
				Save Character
			</v-btn>
		</v-card-actions>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		avatar: null,
		uploadingAvatar: false,
		avatarRules: [
			value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
		],
		name: "New Character",
		characterClass: "",
		classes: [
			"Artificer",
			"Barbarian",
			"Bard",
			"Cleric",
			"Druid",
			"Fighter",
			"Monk",
			"Paladin",
			"Ranger",
			"Rogue",
			"Sorcerer",
			"Warlock",
			"Wizard"
		],
		bio: "",
		sampleBios: [
			"All her life she was a loner, until...",
			"He was content with his royal status, except...",
			"There was no way to avoid taking up arms when...",
			"Never content, always looking for more...",
			"We can't always choose our heroes..."
		],
		creatingCharacter: false,
	}),
	computed: {
		randomBio: {
			get: function() { return this.getRandomFromArray(this.sampleBios) },
			set: function(val) { this.bio = val } 
		},
		saveDisabled() {
			if (!this.name || this.name === "New Character") return true;
			if (!this.characterClass) return true;
			if (this.creatingCharacter) return true;
			return false;
		}
	},
	methods: {
		uploadAvatar(file) {
			if (!file) return;
			if (file.size > 2000000) return;
			console.log(file.size);

			this.uploadingAvatar = true;
			this.$store.dispatch("uploadCharacterAvatar", file).then(response => {
				console.log(response);
				this.avatar = response.location;
				this.uploadingAvatar = false;
			}).catch(error => {
				console.log("we failed the upload.");
				console.log(error);
				this.uploadingAvatar = false;
			});
		},
		getRandomFromArray(arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		},
		createCharacter() {
			this.creatingCharacter = true;
			let character = { name: this.name, class: this.characterClass };
			if (this.avatar) character.avatar = this.avatar;
			if (this.bio) character.bio = this.bio;

			this.$store.dispatch("createNewCharacter", character).then(response => {
				console.log(response);
				this.creatingCharacter = false;
				this.$emit("dropdialog");
			}).catch(error => {
				console.log("we failed the creation.");
				console.log(error);
				this.creatingCharacter = false;
			});
		}
	}
}
</script>

<style>

</style>