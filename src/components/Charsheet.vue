<template>
	<v-container>
		
		<v-row id="avatar" class="align-center justify-center">
			<v-col cols="2" v-if="$store.getters.getCharacters.length > 1">
				<v-btn icon x-large @click="charSwap(-1)">
					<v-icon x-large>mdi-chevron-left</v-icon>
				</v-btn>
			</v-col>

			<v-col cols="8" class="flex-grow-1 text-center">
				<v-icon v-if="!character.avatar && !avatar" style="font-size: 220px;">
					mdi-account
				</v-icon>
				<v-img 
					v-else 
					:src="character.avatar"
					width="220"
					height="220"
					style="margin-left: auto; margin-right: auto;"
				/>
			</v-col>

			<v-col cols="2" v-if="$store.getters.getCharacters.length > 1">
				<v-btn icon x-large @click="charSwap(-1)">
					<v-icon x-large>mdi-chevron-left</v-icon>
				</v-btn>
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
			<v-btn icon large color="primary" :disabled="!avatar" @click="saveAvatar()">
				<v-icon large>mdi-content-save</v-icon>
			</v-btn>

		</v-row>

		<v-row id="name" class="mb-n4">
			<v-col class="mb-n4">
				<v-text-field
					label="Name"
					v-model="character.name"
					disabled
				/>
			</v-col>
		</v-row>

		<v-row id="details" class="mb-n4">
			<v-col>
				<v-text-field
					label="Class"
					:value="character.class"
					disabled
				/>
			</v-col>
			<v-col>
				<v-text-field
					label="Level"
					:value="character.level"
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
				<v-icon 
					style="font-size: 100px; -webkit-transform: scaleX(-1); transform: scaleX(-1);" 
					:style="getXPGradient"
				>
					mdi-chart-bar
				</v-icon>
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
									<router-link :to="skill.name.toLowerCase()">
										<v-col>{{ skill.name }}</v-col>
									</router-link>
								</v-row>
							</v-col>
						</v-col>
					</v-row>
				</v-card>
			</v-col>

			<v-col id="equipment" v-if="includeEquipment" class="text-center">
				<v-icon style="font-size: 350px;" class="text-center">mdi-human</v-icon>
			</v-col>

		</v-row>
	</v-container>
</template>

<script>
export default {
	props: [ "character", "includeEquipment" ],
	data: () => ({
		avatar: null,
		uploadingAvatar: false,
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
				name: "Description",
				ability: "Intelligence",
				isProficient: false,
			},
			{
				name: "Tactics",
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
				name: "Accent",
				ability: "Charisma",
				isProficient: false,
			},
			{
				name: "Persuasion",
				ability: "Charisma",
				isProficient: false,
			},
		],
		stats: {
			hp: {
				filledColor: [0, 100, 39],
				midColor: [0, 100, 65],
				emptyColor: [0, 100, 85],
				angle: 0,
				offset: 17
			},
			attack: {
				filledColor: [235, 100, 39],
				midColor: [235, 100, 65],
				emptyColor: [235, 100, 85],
				angle: 315,
				offset: 22
			},
			xp: {
				filledColor: [115, 100, 17],
				midColor: [115, 100, 35],
				emptyColor: [115, 100, 65],
				angle: -90,
				offset: 12
			}
		}
	}),
	computed: {
		getAttackGradient() {
			return this.getGradient("attack");
		},
		getHPGradient() {
			return this.getGradient("hp");
		},
		getXPGradient() {
			return this.getGradient("xp");
		},
		player() {
			return this.$store.getters.getPlayer;
		},
		image() {
			return this.$store.getters.getCharacterImage;
		}
	},
	methods: {
		getGradient(stat) {
			let characterStat = this.character.stats[stat];
			stat = this.stats[stat];

			let angle = `${stat.angle}deg`;
			let range = 100 - stat.offset;
			let stopLocation = characterStat.value / characterStat.max * range;
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
			this.$store.dispatch("uploadAvatar", this.avatar);
		}
	}
}
</script>

<style>

</style>