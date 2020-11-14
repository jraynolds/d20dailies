<template>
	<v-container>

		<v-row id="avatar" class="align-center">
			<v-col class="flex-grow-0 mr-n6">
				<v-btn icon x-large @click="$emit('charswap', -1)">
					<v-icon x-large>mdi-chevron-left</v-icon>
				</v-btn>
			</v-col>
			<v-col class="flex-grow-1 text-center">
				<v-icon v-if="!character.image" style="font-size: 220px;">mdi-account</v-icon>
				<v-img 
					v-else 
					:src="character.image"
					width="220"
					height="220"
					style="margin-left: auto; margin-right: auto;"
				/>
				<v-row class="justify-center align-center">
					<v-file-input
						:rules="avatarRules"
						style="font-size: small"
						accept="image/png, image/jpeg, image/bmp"
						prepend-icon="mdi-camera"
						label="Upload avatar"
						@change="uploadAvatar"
					></v-file-input>
					<v-btn icon large color="primary" :disabled="!avatar" @click="saveAvatar">
						<v-icon large>mdi-upload</v-icon>
					</v-btn>
				</v-row>
			</v-col>
			<v-col class="flex-grow-0 ml-n6">
				<v-btn icon x-large @click="$emit('charswap', 1)">
					<v-icon x-large>mdi-chevron-right</v-icon>
				</v-btn>
			</v-col>
		</v-row>

		<v-row id="details">
			<v-col>
				<v-text-field
					label="Class and Level"
					:value="character.class + ' ' + character.level"
					disabled
				/>
			</v-col>
			<v-col>
				<v-text-field
					label="Experience points"
					:value="character.experience"
					disabled
				/>
			</v-col>
		</v-row>

		<v-row id="stats" class="text-center">
			<v-col cols="4">
				<v-icon style="font-size: 100px;" :style="getAttackGradient">mdi-sword</v-icon>
			</v-col>

			<v-col cols="4">
				<v-icon style="font-size: 100px;" :style="getHPGradient">mdi-heart</v-icon>
			</v-col>
			
			<v-col cols="4">
				<v-icon style="font-size: 100px;" :style="getXPGradient">mdi-chart-bar</v-icon>
			</v-col>
		</v-row>

		<v-row id="sheet">
			<v-col id="abilitiesAndSkills">
				<v-card v-for="ability in abilities" :key="ability.name" class="mb-2">
					<v-row>
						<v-col cols="4" class="text-center align-center justify-center d-flex">
							<v-icon style="font-size: 50px;">{{ "mdi-" + ability.icon }}</v-icon>
						</v-col>

						<v-col>
							<v-col 
								cols="12" 
								v-for="skill in skills" 
								:key="skill.name" 
								class="pa-0 my-n4"
							>
								<v-row v-if="skill.ability == ability.name">
									<v-col class="flex-grow-0">
										{{ character.skills[skill.name.toLowerCase()] }}
									</v-col>
									<v-col>{{ skill.name }}</v-col>
								</v-row>
							</v-col>
						</v-col>
					</v-row>
				</v-card>
			</v-col>

			<v-col id="equipment" v-if="includeEquipment">
				<v-icon style="font-size: 350px;">mdi-human</v-icon>
			</v-col>

		</v-row>

	</v-container>
</template>

<script>
export default {
	props: [ "player", "character", "includeEquipment" ],
	data: () => ({
		avatar: null,
		avatarRules: [
			value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
		],
		abilities: [
			{
				name: "Intelligence",
				icon: "brain"
			},
			{
				name: "Wisdom",
				icon: "thought-bubble-outline"
			},
			{
				name: "Charisma",
				icon: "emoticon-wink-outline"
			}
		],
		skills: [
			{
				name: "Descriptiveness",
				ability: "Intelligence",
				isProficient: false,
			},
			{
				name: "Reasoning",
				ability: "Intelligence",
				isProficient: false,
			},
			{
				name: "Roleplaying",
				ability: "Wisdom",
				isProficient: false,
			},
			{
				name: "Morality",
				ability: "Wisdom",
				isProficient: false,
			},
			{
				name: "Accents",
				ability: "Charisma",
				isProficient: false,
			},
			{
				name: "Persuasiveness",
				ability: "Charisma",
				isProficient: false,
			},
		]
	}),
	computed: {
		getAttackGradient() {
			let stat = this.character.stats.attack;
			return this.getGradient(stat);
		},
		getHPGradient() {
			let stat = this.character.stats.hp;
			return this.getGradient(stat);
		},
		getXPGradient() {
			let stat = this.character.stats.xp;
			return this.getGradient(stat);
		}
	},
	methods: {
		getGradient(stat) {
			let angle = `${stat.angle}deg`;
			let range = 100 - stat.offset;
			let stopLocation = stat.amount / stat.maximum * range;
			let gradientStops = [
				{
					color: `hsl(${stat.filledColor[0]}, ${stat.filledColor[1]}%, ${stat.filledColor[2]}%)`,
					location: 0
				},
				{
					color: `hsl(${stat.midColor[0]}, ${stat.midColor[1]}%, ${stat.midColor[2]}%)`,
					location: stopLocation + stat.offset
				},
				{
					color: `hsl(${stat.emptyColor[0]}, ${stat.emptyColor[1]}%, ${stat.emptyColor[2]}%)`,
					location: stopLocation + stat.offset
				}
			];
			let gradient = `linear-gradient(${angle}, `;
			for (let stop of gradientStops) {
				gradient += `${stop.color} ${stop.location}%`
				if (gradientStops.indexOf(stop) < gradientStops.length - 1) gradient += ", ";
			}
			gradient += ")"
			// console.log(gradient);
			return {
				background: gradient,
				"-webkit-background-clip": "text",
				"-webkit-text-fill-color": "transparent"
			}
		},
		uploadAvatar(avatar) {
			this.avatar = avatar;
		},
		saveAvatar() {
			// this.character.image = this.avatar;
		}
	}
}
</script>

<style>

</style>