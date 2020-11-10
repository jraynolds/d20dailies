<template>
	<v-container>
		<v-card class="px-4">

			<v-row id="details">
				<!-- <v-img>
				</v-img> -->
				<v-icon style="font-size: 250px;">mdi-account</v-icon>
				<v-col class="pr-8">
					
					<v-row>
						<v-col cols="4">
							<v-text-field
								label="Class and Level"
								:value="character.class + ' ' + character.level"
							/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="Alignment"
								:value="character.alignment"
							/>
						</v-col>
						<v-col cols="4">
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

				</v-col>
			</v-row>

			<v-row id="sheet">
				<v-col id="abilitiesAndSkills">
					<v-card v-for="ability in character.abilities" :key="ability.name" class="mb-2">
						<v-row>
							<v-col cols="6" class="text-center">
								<v-icon style="font-size: 100px;">{{ "mdi-" + ability.icon }}</v-icon>
							</v-col>

							<v-col cols="6">
								<v-col cols="12" v-for="skill in character.skills" :key="skill.name" class="pa-0">
									<v-row v-if="skill.ability == ability.name">
										<v-col class="flex-grow-0">{{ skill.score }}</v-col>
										<v-col>{{ skill.name }}</v-col>
									</v-row>
								</v-col>
							</v-col>
						</v-row>
					</v-card>
				</v-col>

				<v-col id="equipment">
					<v-icon style="font-size: 400px;">mdi-human</v-icon>
				</v-col>

			</v-row>

		</v-card>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		player: {
			name: "Jasper Raynolds",
		},
		character: {
			class: "Paladin",
			level: 8,
			hp: 20,
			maxHp: 30,
			alignment: "Lawful Good",
			experience: 1000,
			abilities: [
				{
					name: "Intelligence",
					score: 14,
					icon: "brain"
				},
				{
					name: "Wisdom",
					score: 14,
					icon: "thought-bubble-outline"
				},
				{
					name: "Charisma",
					score: 14,
					icon: "emoticon-wink-outline"
				}
			],
			skills: [
				{
					name: "Improvisation",
					ability: "Intelligence",
					isProficient: false,
					score: 4
				},
				{
					name: "Reasoning",
					ability: "Intelligence",
					isProficient: false,
					score: 4
				},
				{
					name: "Accents",
					ability: "Wisdom",
					isProficient: false,
					score: 4
				},
				{
					name: "Recall",
					ability: "Wisdom",
					isProficient: false,
					score: 4
				},
				{
					name: "Monologue",
					ability: "Charisma",
					isProficient: false,
					score: 4
				},
				{
					name: "Persuasiveness",
					ability: "Charisma",
					isProficient: false,
					score: 4
				},
			],
			inspiration: false,
			stats: {
				attack: {
					amount: 40,
					maximum: 40,
					filledColor: [235, 100, 39],
					midColor: [235, 100, 65],
					emptyColor: [235, 100, 85],
					angle: 315,
					offset: 22
				},
				hp: {
					amount: 80,
					maximum: 80,
					filledColor: [0, 100, 39],
					midColor: [0, 100, 65],
					emptyColor: [0, 100, 85],
					angle: 0,
					offset: 17
				},
				xp: {
					amount: 100,
					maximum: 100,
					filledColor: [115, 100, 17],
					midColor: [115, 100, 35],
					emptyColor: [115, 100, 65],
					angle: -90,
					offset: 12
				}
			}
		}
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
			console.log(gradient);
			return {
				background: gradient,
				"-webkit-background-clip": "text",
				"-webkit-text-fill-color": "transparent"
			}
		}
	}
}
</script>

<style>

</style>