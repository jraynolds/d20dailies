<template>
  <v-app>
		<Appbar :title="'D and Dailies'" />
		<Sidebar :player="player" :character="character" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    Appbar: () => import("@/components/Appbar.vue"),
    Sidebar: () => import("@/components/Sidebar.vue")
  },
  data: () => ({
    drawerOpen: null,
		rDrawerOpen: true,
		player: {
			name: "Jasper Raynolds",
			tutorials: {
				speaking: false,
				description: false,
				accent: false,
				trolley: false
			}
		},
		character: {
			class: "Paladin",
			name: "Brent Crownguard",
			image: require("@/assets/dragon_empty.png"),
			level: 8,
			hp: 20,
			maxHp: 30,
			alignment: "Lawful Good",
			inspiration: false,
			experience: 1000,
			abilities: {
				intelligence: 14,
				wisdom: 14,
				charisma: 14
			},
			skills: {
				descriptiveness: 4,
				reasoning: 4,
				morality: 4,
				accents: 4,
				persuasiveness: 4,
				roleplaying: 4
			},
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
		},
  }),
};
</script>
